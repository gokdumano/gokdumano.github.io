$(document).ready(function () {
    InitDB();
    PopulateTicketPricesTable();
    PopulateLinesDB();
    PopulateStationsDB();
});

function InitDB() {
    let request = indexedDB.open('MetroIstanbulDB');

    request.onupgradeneeded = function (event) {
        console.log('IndexedDB.onupgradeneeded');
        let db = event.target.result;

        if (!db.objectStoreNames.contains('Lines')) {
            let linesStore = db.createObjectStore('Lines', { keyPath: 'Id' });
            linesStore.createIndex('Lines.Id', 'Id', { unique: true });
        }

        if (!db.objectStoreNames.contains('Stations')) {
            let stationsStore = db.createObjectStore('Stations', { keyPath: ['Id', 'LineId'] });
            stationsStore.createIndex('Stations.Id', 'Id', { unique: true });
            stationsStore.createIndex('Stations.LineId', 'LineId', { unique: false });
        }

        if (!db.objectStoreNames.contains('Directions')) {
            let directionsStore = db.createObjectStore('Directions', { keyPath: ['Id', 'LineId', 'StationId'] });
            directionsStore.createIndex('Directions.Id', 'Id', { unique: true });
            directionsStore.createIndex('Directions.LineId', 'LineId', { unique: false });
            directionsStore.createIndex('Directions.StationId', 'StationId', { unique: false });
        }
    };

    request.onsuccess = function (event) {
        console.log('IndexedDB.onsuccess');
    };

    request.onerror = function (event) {
        console.error('IndexedDB.onerror');
    };
}

function PopulateTicketPricesTable() {
    let ticketPricesTable = $('#ticket-prices-table');

    $.get({
        url: 'https://api.ibb.gov.tr/MetroIstanbul//api/MetroMobile/V2/GetTicketPrice/TR',
        headers: {
            'Accept': 'application/json',
            // 'Host': 'api.ibb.gov.tr',
            // 'Accept-Encoding': 'gzip, deflate, br',
            // 'Connection': 'keep-alive'
        },
        success: function (response) {
            if (!response.Success) {
                throw new Error(response.Error || 'An error occurred while fetching lines.');
            }

            let prices = response.Data;
            $("<tbody>", { id: 'ticket-prices-table-body' }).appendTo('#metro-istanbul-lines');

            prices.forEach(function (group) {
                let tr = $("<tr>", { id: 'ticket-prices-table-row' });
                tr.append($('<th>', { id: 'ticket-prices-table-header', text: group.Type, colspan: 2 }));
                tr.appendTo('#ticket-prices-table');

                group.TicketPrices.forEach(function (ticketPrice) {
                    let tr = $("<tr>", { id: 'ticket-prices-table-row' });
                    tr.append($('<td>', { id: 'ticket-prices-table-name-data', text: ticketPrice.Name }));
                    tr.append($('<td>', { id: 'ticket-prices-table-price-data', text: ticketPrice.Price }));
                    tr.appendTo('#ticket-prices-table');
                });
            });
        },
        error: function (_, status, error) {
            console.error('$.ajax.error: ', status, error);
        }
    });
}

function PopulateLinesDB() {
    $('<option>', { value: 0, text: 'Lütfen bir hat seçiniz...' }).appendTo('#metro-istanbul-lines');
    let metroIstanbulLines = $('#metro-istanbul-lines');

    $.get({
        url: 'https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetLines',
        headers: {
            'Accept': 'application/json',
            // 'Host': 'api.ibb.gov.tr',
            // 'Accept-Encoding': 'gzip, deflate, br',
            // 'Connection': 'keep-alive'
        },
        success: function (response) {
            if (!response.Success) {
                throw new Error(response.Error || 'An error occurred while fetching lines.');
            }

            let lines = response.Data;
            let openRequest = indexedDB.open('MetroIstanbulDB');

            openRequest.onsuccess = function (event) {
                let db = event.target.result;
                let transaction = db.transaction(['Lines'], 'readwrite');
                let linesStore = transaction.objectStore('Lines');

                $('<optgroup>', { id: 'metro-hatlari-optgroup', label: 'Metro Hatları' }).appendTo('#metro-istanbul-lines');
                $('<optgroup>', { id: 'tramvay-hatlari-optgroup', label: 'Tramvay Hatları' }).appendTo('#metro-istanbul-lines');
                $('<optgroup>', { id: 'funikuler-hatlari-optgroup', label: 'Füniküler Hatları' }).appendTo('#metro-istanbul-lines');
                $('<optgroup>', { id: 'teleferik-hatlari-optgroup', label: 'Teleferik Hatları' }).appendTo('#metro-istanbul-lines');

                lines.forEach(function (line) {
                    let getRequest = linesStore.get(line.Id);

                    getRequest.onsuccess = function (event) {
                        let lineId = event.target.result;

                        if (lineId) {
                            console.log(`Line with LineId ${line.Id} already exists.`);
                        } else {
                            let addRequest = linesStore.add(line);

                            addRequest.onsuccess = function () {
                                console.log(`Successfully added line with LineId ${line.Id}`);
                            };

                            addRequest.onerror = function (event) {
                                console.error(`Error adding line with LineId ${line.Id}: ${event.target.error}`);
                            };
                        }

                        switch (true) {
                            case line.Name.startsWith('TF'):
                                $('<option>', { val: line.Id, text: `${line.Name} - ${line.LongDescription}` }).appendTo('#teleferik-hatlari-optgroup');
                                break;
                            case line.Name.startsWith('F'):
                                $('<option>', { val: line.Id, text: `${line.Name} - ${line.LongDescription}` }).appendTo('#funikuler-hatlari-optgroup');
                                break;
                            case line.Name.startsWith('T'):
                                $('<option>', { val: line.Id, text: `${line.Name} - ${line.LongDescription}` }).appendTo('#tramvay-hatlari-optgroup');
                                break;
                            case line.Name.startsWith('M'):
                                $('<option>', { val: line.Id, text: `${line.Name} - ${line.LongDescription}` }).appendTo('#metro-hatlari-optgroup');
                                break;
                            default:
                                break;
                        }
                    };

                    getRequest.onerror = function (event) {
                        console.error(`Error fetching line with LineId ${line.Id}: ${event.target.error}`);
                    };
                });

                db.close();
            };

            openRequest.onerror = function (event) {
                console.error('request.onerror: ', event.target.errorCode);
            };
        },
        error: function (_, status, error) {
            console.error('$.ajax.error: ', status, error);
        }
    });
}

function PopulateStationsDB() {
    $.get({
        url: 'https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetStations',
        headers: {
            'Accept': 'application/json',
            // 'Host': 'api.ibb.gov.tr',
            // 'Accept-Encoding': 'gzip, deflate, br',
            // 'Connection': 'keep-alive'
        },
        success: function (response) {
            if (!response.Success) {
                throw new Error(response.Error || 'An error occurred while fetching stations.');
            }

            let stations = response.Data;
            let openRequest = indexedDB.open('MetroIstanbulDB');

            openRequest.onsuccess = function (event) {
                let db = event.target.result;
                let transaction = db.transaction(['Stations'], 'readwrite');
                let stationsStore = transaction.objectStore('Stations');

                stations.forEach(function (station) {
                    let getRequest = stationsStore.get([station.Id, station.LineId]);

                    getRequest.onsuccess = function (event) {
                        let stationId = event.target.result;

                        if (stationId) {
                            console.log(`Station with StationId ${station.Id} already exists.`);
                        } else {
                            let addRequest = stationsStore.add(station);

                            addRequest.onsuccess = function () {
                                console.log(`Successfully added station with StationId ${station.Id}`);
                            };

                            addRequest.onerror = function (event) {
                                console.error(`Error adding station with StationId ${station.Id}: ${event.target.error}`);
                            };
                        }
                    };

                    getRequest.onerror = function (event) {
                        console.error(`Error fetching station with StationId ${station.Id}: ${event.target.error}`);
                    };
                });

                db.close();
            };

            openRequest.onerror = function (event) {
                console.error('request.onerror: ', event.target.errorCode);
            };
        },
        error: function (_, status, error) {
            console.error('$.ajax.error: ', status, error);
        }
    });

    $('#metro-istanbul-lines').on('change', (event) => {
	if (event.target.value == 0) { return; }
	
	let stations = GetStationByLineId(
		parseInt(event.target.value)
	);
	
        console.log(stations);
    });
}

function GetStationByLineId(lineId) {
    let request = indexedDB.open("MetroIstanbulDB");

    request.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction(['Stations'], 'readonly');
        let stationStore = transaction.objectStore('Stations');
        let stationIndex = stationStore.index('Stations.LineId');

        let getRequest = stationIndex.getAll(lineId);

        getRequest.onsuccess = function (event) {
            let stations = event.target.result;
            console.log(stations);
        };

        getRequest.onerror = function (event) {
            console.error(`Error fetching stations with LineId ${lineId}: ${event.target.error}`);
        };

        db.close();
    };

    request.onerror = function (event) {
        console.error("request.onerror:", event.target.errorCode);
    };
}
