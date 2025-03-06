// Veritabanı adı ve sürümü
const dbName = 'AQIStationsDB';
const dbVersion = 1;

// API URL'si
const apiUrl = 'https://api.ibb.gov.tr/havakalitesi/OpenDataPortalHandler/GetAQIStations';

// Veritabanı bağlantısını açma
const request = indexedDB.open(dbName, dbVersion);

request.onerror = function(event) {
  console.error('Veritabanına bağlanılamadı:', event.target.errorCode);
};

request.onsuccess = function(event) {
  console.log('Veritabanı başarıyla açıldı');
  const db = event.target.result;

  // API'den veri alıp veritabanına eklemek için işlem yapılabilir
  fetchDataAndStore(db);
};

request.onupgradeneeded = function(event) {
  const db = event.target.result;

  // Object store oluşturma
  const objectStore = db.createObjectStore('AQIStations', { keyPath: 'Id' });

  // Indexleri oluşturma
  // objectStore.createIndex('Name', 'Name', { unique: false });
  // objectStore.createIndex('Address', 'Address', { unique: false });
  // objectStore.createIndex('Latitude', 'Latitude', { unique: false });
  // objectStore.createIndex('Longitude', 'Longitude', { unique: false });

  console.log('Object store ve indexler oluşturuldu');
};

async function fetchDataAndStore(db) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const stations = await response.json();

    // Verileri veritabanına eklemek için işlem yapılır
    const transaction = db.transaction(['AQIStations'], 'readwrite');
    const objectStore = transaction.objectStore('AQIStations');

    stations.forEach(station => {
      // Adress anahtarını Address olarak değiştirme
      station.Address = station.Adress;
      delete station.Adress;
	  
      // Location verisini Latitude ve Longitude'a ayırma
      const locationMatch = station.Location.match(/\(([^)]+)\)/);	  
	  
      if (locationMatch) {
        const [longitude, latitude] = locationMatch[1].split(' ').map(Number);
        station.Latitude = latitude;
        station.Longitude = longitude;
      }

      delete station.Location;

      // Veriyi veritabanına ekleme
      objectStore.add(station);
    });

    transaction.oncomplete = function() {
      console.log('Tüm veriler başarıyla eklendi');
    };

    transaction.onerror = function(event) {
      console.error('Veri eklenirken hata oluştu:', event.target.errorCode);
    };

  } catch (error) {
    console.error('Veri alınırken hata oluştu:', error);
  }
}
