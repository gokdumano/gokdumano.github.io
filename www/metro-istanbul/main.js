const lineGroups = [
  {
    "Group": "M",
    "Name": "Metro Hatları",
    "Lines": {
      "1": "M2", "2": "M3", "3": "M4", "5": "M5", "6": "M6",
      "7": "M7", "8": "M8", "9": "M1A", "10": "M1B", "17": "M9"
    }
  },
  {
    "Group": "T",
    "Name": "Tramvay Hatları",
    "Lines": {
      "11": "T1", "12": "T3", "13": "T4", "14": "T5"
    }
  },
  {
    "Group": "F",
    "Name": "Füniküler Hatları",
    "Lines": {
      "4": "F1", "20": "F4"
    }
  },
  {
    "Group": "TF",
    "Name": "Teleferik Hatları",
    "Lines": {
      "15": "TF1", "16": "TF2"
    }
  }
];

// (Opsiyonel) Hat renklerini belirle
const lineColors = {
  "M1A": "#e60026", "M1B": "#e60026", "M2": "#006caa", "M3": "#00ad4e",
  "M4": "#8b1f8f", "M5": "#582c83", "M6": "#c29f00", "M7": "#b1004c",
  "M8": "#ff6319", "M9": "#af4c00", "T1": "#006caa", "T3": "#999999",
  "T4": "#00b7c3", "T5": "#5a5a5a", "F1": "#757575", "F4": "#a46b00",
  "TF1": "#008c95", "TF2": "#00a99d"
};

let [railwayGroups, lines, stations] = [null, null, null];

async function FetchMetroIstanbulData (serviceName, serviceUrl){
    return await fetch(serviceUrl).then(function (response) {
            if (!response.ok) { throw new Error(`${serviceName} returned with status code ${response.status}`); }
            return response.json();
        }).then(function({Success, Error: Message, Data}){
            if (!Success) { throw new Error(`${serviceName} returned with error message ${Message}`); }
            console.log(`${serviceName} successfully fetched data`);
            return Data;
        }).catch(function(error){
            console.error(error);
            return null;
        });
}

async function GetRailwayGroups (){    
    return await FetchMetroIstanbulData('GetRailwayGroups', 'https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetRailwayGroups');
}

async function GetLines (){ 
    return await FetchMetroIstanbulData('GetLines', 'https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetLines');
}

async function GetStations (){    
    return await FetchMetroIstanbulData('GetStations', 'https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetStations');
}

async function Main(){
    [railwayGroups, lines, stations] = await Promise.all([
        GetRailwayGroups() //, GetLines(), GetStations()
    ]);

    const container = document.getElementById("railway-groups");

    railwayGroups.forEach(function({Name, Lines}){
        let groupSection = document.createElement("div");
        groupSection.classList.add("group-section");

        let groupTitle = document.createElement("div");
        groupTitle.classList.add("group-title");
        groupTitle.textContent = Name;
    
        let lineGroup = document.createElement("div");
        lineGroup.classList.add("line-group");
        
        Object.values(Lines).sort(function(left, right){
            return left.padEnd(3, '_').localeCompare(right.padEnd(3, '_'));
        }).forEach(function(line){
            let lineButton = document.createElement("a");
            lineButton.classList.add("line-button");
            lineButton.textContent = line;
            lineButton.href = "#"; // ileride detay sayfasına yönlendirme yapılabilir
            lineGroup.appendChild(lineButton);
        });
    
        groupSection.appendChild(groupTitle);
        groupSection.appendChild(lineGroup);
        container.appendChild(groupSection);
    })
}

document.addEventListener("DOMContentLoaded", Main);