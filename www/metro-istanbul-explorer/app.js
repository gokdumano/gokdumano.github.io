
let GROUPS = null;
let LINES = null;
let STATIONS = null;
let DIRECTIONS = null;

// -------------------------------------------------------------------------------

let currentRoute = null;
let currentDirection = 0;
let markers = [];
let polyline = null;

function createStationPopup(stationName, features) {
    const featureRows = Object.entries(features).map(([feature, available]) => {
        const iconClass = available ? 'text-green-500' : 'text-red-500';
        const iconName = available ? 'check-circle' : 'times-circle';
        const textClass = available ? 'text-gray-800' : 'text-gray-500';
        
        return `
            <div class="feature-row flex items-center p-3 border-b border-gray-100">
                <div class="feature-icon ${iconClass}">
                    <i class="fas fa-${iconName}"></i>
                </div>
                <span class="text-sm ${textClass} flex-1">${feature}</span>
                <span class="text-xs font-medium ${available ? 'text-green-600' : 'text-red-600'}">
                    ${feature === 'Gelecek Seferler' ? available : available ? 'Var' : 'Yok'}
                </span>
            </div>
        `;
    }).join('');

    return `
        <div class="bg-blue-600 p-3">
            <h3 class="text-white font-semibold text-lg">${stationName}</h3>
        </div>
        <div class="max-h-64 overflow-y-auto">
            ${featureRows}
        </div>
        <div class="bg-gray-50 p-2 text-right">
            <span class="text-xs text-gray-500">Son güncelleme: ${new Date().toLocaleDateString()}</span>
        </div>
    `;
}
async function GetTimeTable(BoardingStationId, DirectionId){
    return await fetch('https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetTimeTable', {
        method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ BoardingStationId, DirectionId, DateTime: new Date().toISOString() })
    }).then(function(response) {
        if (!response.ok) { throw new Error(`Time Table API returned with status code: ${response.status} (${response.statusText})`) };
        return response.json();
    }).then(function({ Success, Error: Err, Data}) {
        if (!Success) { throw new Error(`Time Table API returned with error message: ${Err.Message}`) };
        return Data;
    }).then(function([{ TimeInfos }]){
        return TimeInfos?.Times.join(', ');
    }).catch(function(err) { 
        console.error(err);
        return 'Sefer bulunamadı';
    })
}

async function GetStationBetweenTime(BoardingStationId, DirectionId){
    return await fetch('https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetStationBetweenTime', {
        method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ BoardingStationId, DirectionId, DateTime: new Date().toISOString() })
    }).then(function(response) {
        if (!response.ok) { throw new Error(`Time Table API returned with status code: ${response.status} (${response.statusText})`) };
        return response.json();
    }).then(function({ Success, Error: Err, Data}) {
        if (!Success) { throw new Error(`Time Table API returned with error message: ${Err.Message}`) };
        return Data;
    }).then(function([{ StationOrder }]){
        return StationOrder?.sort(function({ Order: left }, { Order: right }){
            return left - right;
        }).map(function({ Id, Time }){
            return { Id, Time }
        });
    }).catch(function(err) { 
        console.error(err);
    })
}

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize map centered on Hong Kong
    const map = L.map('map').setView([41.113476, 29.061173], 10);
    
    // Define different basemaps
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
    });

    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
    });

    // Add base layers to the map
    const baseLayers = {
        "OpenStreetMap": osmLayer,
        "Uydu Görünümü": satelliteLayer,
        "Karanlık Mod": darkLayer
    };

    // Add default layer
    osmLayer.addTo(map);

    // Add layer control
    L.control.layers(baseLayers, null, {
        position: 'topright',
        collapsed: true
    }).addTo(map);

    [GROUPS, LINES, STATIONS, DIRECTIONS] = await Promise.all([
        fetch('https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetRailwayGroups'),
        fetch('https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetLines'),
        fetch('https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetStations'),
        fetch('https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetDirections')
    ]).then(function ([groups, lines, stations, directions]) {
        if (!groups.ok) { throw new Error(`Railway Groups API returned with status code: ${groups.status} (${groups.statusText})`) };
        if (!lines.ok) { throw new Error(`Lines API returned with status code: ${lines.status} (${lines.statusText})`) };
        if (!stations.ok) { throw new Error(`Stations API returned with status code: ${stations.status} (${stations.statusText})`) };
        if (!directions.ok) { throw new Error(`Directions API returned with status code: ${directions.status} (${directions.statusText})`) };
        return Promise.all([groups.json(), lines.json(), stations.json(), directions.json()]);
    }).then(function ([groups, lines, stations, directions]) {
        if (!groups.Success) { throw new Error(`Railway Groups API returned with error message: ${JSON.stringify(groups.Error)}`) };
        if (!lines.Success) { throw new Error(`Lines API returned with error message: ${JSON.stringify(lines.Error)}`) };
        if (!stations.Success) { throw new Error(`Stations API returned with error message: ${JSON.stringify(stations.Error)}`) };
        if (!directions.Success) { throw new Error(`Directions API returned with error message: ${JSON.stringify(directions.Error)}`) };
        return [groups.Data, lines.Data, stations.Data, directions.Data]
    })
    
    const routeSelect = document.getElementById('route-select');
    routeSelect.innerHTML = '<option value="">Lütfen bir hat seçiniz</option>';

    GROUPS.forEach(function(group) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group.Name;

        const lineIds = Object.keys(group.Lines).map(Number);
        LINES.filter(function({ Id }) {
            return lineIds.includes(Id);
        }).forEach(function({ Id, Name, LongDescription }){
            const option = document.createElement('option');
            option.value = Id;
            option.textContent = `${LongDescription} (${Name})`;

            optgroup.appendChild(option);
        })
        document.getElementById('route-select').appendChild(optgroup);
    });
    
    // Route select change handler
    document.getElementById('route-select').addEventListener('change', function(e) {
        const routeId = e.target.value;
        
        if (!routeId) {
            document.getElementById('direction-section').style.display = 'none';
            document.getElementById('stops-container').style.display = 'none';
            clearMap();
            return;
        }
        
        currentRoute = LINES.find(function({ Id }){ return Id == routeId; });
        document.getElementById('direction-section').style.display = 'block';
        
        // Update direction options
        const directionContainer = document.getElementById('direction-container');
        directionContainer.innerHTML = '';

        let {Color: {Color_R, Color_G, Color_B}} = currentRoute
        let rgb = `rgb(${Color_R}, ${Color_G}, ${Color_B})`;
        
        DIRECTIONS.filter(function({ LineId }){ return LineId == currentRoute.Id}).forEach((dir, idx) => {
            const dirParts = dir.DirectionName.split('->');
            const dirElement = document.createElement('div');
            dirElement.className = `direction-item p-2 border border-gray-200 rounded-md cursor-pointer ${idx === 0 ? 'bg-blue-50' : ''}`;
            dirElement.dataset.direction = dir.DirectionId;
            dirElement.innerHTML = `
                <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full mr-2" style="background-color:${rgb};"></div>
                    <div>
                        <p class="text-sm font-medium">${dirParts[0]}</p>
                        <p class="text-xs text-gray-500">→ ${dirParts[1]}</p>
                    </div>
                </div>
            `;
            
            dirElement.addEventListener('click', function() {
                document.querySelectorAll('.direction-item').forEach(el => el.classList.remove('bg-blue-50'));
                this.classList.add('bg-blue-50');
                currentDirection = parseInt(this.dataset.direction);
                updateStopsList();
                updateMap();
            });
            
            directionContainer.appendChild(dirElement);
        });
        
        // Select first direction by default
        clearMap();
        // document.getElementById('direction-section').style.display = 'none';
        document.getElementById('stops-container').style.display = 'none';
        // currentDirection = 0;
        // updateStopsList();
        // updateMap();
    });
    
    // Shuffle directions handler
    // document.getElementById('shuffle-directions').addEventListener('click', function() {
    //     const directionItems = document.querySelectorAll('.direction-item');
    //     const activeIndex = currentDirection;
    //     const newIndex = activeIndex === 0 ? 1 : 0;
    //     
    //     directionItems.forEach(el => el.classList.remove('bg-blue-50'));
    //     directionItems[newIndex].classList.add('bg-blue-50');
    //     
    //     currentDirection = newIndex;
    //     updateStopsList();
    //     updateMap();
    // });
    
    // Update stops list
    function updateStopsList() {
        if (!currentRoute) return;
        
        const stopsList = document.getElementById('stops-list');
        stopsList.innerHTML = '';
        
        const stops = STATIONS.filter(function({ LineId }){ return LineId == currentRoute.Id; }).sort(function({Order: left}, {Order: right}){ return left - right; })


        let {Color: {Color_R, Color_G, Color_B}} = currentRoute
        let rgb = `rgb(${Color_R}, ${Color_G}, ${Color_B})`;
        
        stops.forEach((stop, index) => {
            const stopElement = document.createElement('div');
            const isFirst = index === 0;
            const isLast = index === stops.length - 1;
            
            stopElement.className = `route-line p-2 relative ${isFirst ? 'first-stop' : ''} ${isLast ? 'last-stop' : ''}`;
            stopElement.innerHTML = `
                <div class="stop-marker ${isFirst || isLast ? 'bg-blue-600' : ''}" style="background-color:${rgb};"></div>
                <div class="pl-2">
                    <p class="text-sm font-medium">${stop.Description}</p>
                    <p class="text-xs text-gray-500">Stop ID: ${stop.Id}</p>
                </div>
            `;

            stopElement.dataset.stopId = stop.Id;
            
            stopElement.addEventListener('click', function() {
                map.setView([
                    Number(stop.DetailInfo.Latitude), Number(stop.DetailInfo.Longitude)
                ], 16);
            });
            
            stopsList.appendChild(stopElement);
        });
        
        document.getElementById('stops-container').style.display = 'block';
    }
    
    // Update map with markers and route
    function updateMap() {
        clearMap();
        
        if (!currentRoute) return;
        
        const stops = STATIONS.filter(function({ LineId }){ return LineId == currentRoute.Id; }).sort(function({Order: left}, {Order: right}){ return left - right; });
        const latLngs = [];
        
        // Add markers
        let {Color: {Color_R, Color_G, Color_B}} = currentRoute
        let rgb = `rgb(${Color_R}, ${Color_G}, ${Color_B})`;
        stops.forEach((stop, index) => {
            const isFirst = index === 0;
            const isLast = index === stops.length - 1;
            
            let icon;
            if (isFirst || isLast) {
                // Square icon for first and last stops
                icon = L.divIcon({
                    className: 'custom-icon',
                    html: `<div style="width: 16px; height: 16px; background: ${rgb}; border: 2px solid white; transform: rotate(45deg);"></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
            } else {
                // Circle icon for intermediate stops
                icon = L.divIcon({
                    className: 'custom-icon',
                    html: `<div style="width: 12px; height: 12px; background: ${rgb}; border-radius: 50%; border: 2px solid white;"></div>`,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                });
            }

            const marker = L.marker([Number(stop.DetailInfo.Latitude), Number(stop.DetailInfo.Longitude)], { icon: icon })
            .addTo(map).bindPopup(function(_){
                const el = document.createElement('div');
                el.className = 'station-popup';
                GetTimeTable(stop.Id, currentDirection).then(function(timeTable){
                    el.innerHTML =  createStationPopup(stop.Description, {
                        'Bebek Bakım Odası': stop.DetailInfo.BabyRoom,
                        'Mescid': stop.DetailInfo.Masjid,
                        'Tuvalet': stop.DetailInfo.WC,
                        'Gelecek Seferler': timeTable,
                    });
                });
                return el;
            }, { className: 'station-popup', maxWidth: 280 }).addTo(map);

            // const marker = L.marker([Number(stop.DetailInfo.Latitude), Number(stop.DetailInfo.Longitude)], { icon: icon })
            //     .bindPopup(function(_){
            //         // https://www.raymondcamden.com/2024/09/17/using-asynchronous-content-in-leaflet-popups
            //         
            //         
            //         const el = document.createElement('div');
            //         GetTimeTable(stop.Id, currentDirection).then(function(timeTable){
            //             el.innerHTML = `<b>${stop.Description}</b><br>
            //             Bebek Bakım Odası: ${stop.DetailInfo.BabyRoom ? '✓' : '✗'}<br>
            //             Mescid: ${stop.DetailInfo.Masjid ? '✓' : '✗'}<br>
            //             Tuvalet: ${stop.DetailInfo.WC ? '✓' : '✗'}<br>
            //             Gelecek Seferler: ${timeTable}`;
            //         })
            //         return el;
            //     }, { minWidth: 500 }).addTo(map);
            
            markers.push(marker);
            latLngs.push([Number(stop.DetailInfo.Latitude), Number(stop.DetailInfo.Longitude)]);
        });
        
        // Add polyline
        polyline = L.polyline(latLngs, { color: rgb, weight: 4 }).addTo(map);
        
        // Fit bounds to show all markers
        if (latLngs.length > 0) {
            map.fitBounds(latLngs, { padding: [50, 50] });
        }
    }
    
    // Clear map markers and polyline
    function clearMap() {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        if (polyline) {
            map.removeLayer(polyline);
            polyline = null;
        }
    }
    
    // Initialize with first route selected (for demo purposes)
    // setTimeout(() => {
    //     document.getElementById('route-select').value = '1';
    //     const event = new Event('change');
    //     document.getElementById('route-select').dispatchEvent(event);
    // }, 500);
});