$(document).ready(function () {
  InitDB();
});

function InitDB() {
  // IndexedDB'yi aç veya oluştur
  let request = indexedDB.open('MetroIstanbulDB');

  request.onupgradeneeded = function(event) {
      let db = event.target.result;

      // Lines tablosunu oluştur
      if (!db.objectStoreNames.contains('Lines')) {
          let linesStore = db.createObjectStore('Lines', { keyPath: 'Id' });
          linesStore.createIndex('Id', 'Id', { unique: true });
      }

      // Stations tablosunu oluştur
      if (!db.objectStoreNames.contains('Stations')) {
          let stationsStore = db.createObjectStore('Stations', { keyPath: ['Id', 'LineId'] });
          stationsStore.createIndex('Id', 'Id', { unique: true });
          stationsStore.createIndex('LineId', 'LineId', { unique: false });
      }

      // Directions tablosunu oluştur
      if (!db.objectStoreNames.contains('Directions')) {
          let directionsStore = db.createObjectStore('Directions', { keyPath: ['Id', 'LineId', 'StationId'] });
          directionsStore.createIndex('Id', 'Id', { unique: true });
          directionsStore.createIndex('LineId', 'LineId', { unique: false });
          directionsStore.createIndex('StationId', 'StationId', { unique: false });
      }
  };

  request.onsuccess = function(event) {
      console.log('IndexedDB.onsuccess');
      PopulateLinesDB();
  };

  request.onerror = function(event) {
      console.error('IndexedDB.onerror');
  };
}

function PopulateLinesDB() {
  // API'ye GET isteği gönder
  $.get({
      url: 'https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetLines',
      headers: {
          'Accept': 'application/json',
          'Host': 'api.ibb.gov.tr',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
      },
      success: function(response) {
          // Success anahtarını kontrol et
          if (!response.Success) {
              // Success false ise, Error anahtarındaki mesajı kullanarak hata fırlat
              throw new Error(response.Error || 'An error occurred while fetching lines.');
          }

          // API'den gelen verileri al
          let lines = response.Data; // Data anahtarı altında verilerin olduğunu varsayalım

          // IndexedDB'yi aç
          let openRequest = indexedDB.open('MetroIstanbulDB');

          openRequest.onsuccess = function(event) {
              let db = event.target.result;

              // Lines tablosuna eriş
              let transaction = db.transaction(['Lines'], 'readwrite');
              let linesStore = transaction.objectStore('Lines');

              // API'den gelen verileri Lines tablosuna ekle
              lines.forEach(function(line) {
                  // LineId'ye sahip bir veri var mı kontrol et
                  let getRequest = linesStore.get(line.Id);

                  getRequest.onsuccess = function(event) {
                      let lineId = event.target.result;

                      if (lineId) {
                          // Aynı LineId'ye sahip bir veri varsa ekleme yapma
                          console.log(`Line with LineId ${line.Id} already exists.`);	
                      } else {
                          // Aynı LineId'ye sahip bir veri yoksa ekle
                          let addRequest = linesStore.add(line);

                          addRequest.onsuccess = function() {
                              console.log(`Successfully added line with LineId ${line.Id}`);
                          };

                          addRequest.onerror = function(event) {
                              console.error(`Error adding line with LineId ${line.Id}: ${event.target.error}`);
                          };
                      }
                  };

                  getRequest.onerror = function(event) {
                      console.error(`Error fetching line with LineId ${line.Id}: ${event.target.error}`);
                  };
              });
          };

          openRequest.onerror = function(event) {
              console.error('request.onerror: ', event.target.errorCode);
          };
      },
      error: function(_, status, error) {
          console.error('$.ajax.error: ', status, error);
      }
  });
}

/*
const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Host: 'api.ibb.gov.tr',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive',
  },
};

function InitDB() {
  const DBOpenRequest = window.indexedDB.open('MetroIstanbulDB');

  DBOpenRequest.onupgradeneeded = (event) => {
    const db = event.target.result;

    const linesObjectStore = db.createObjectStore('lines', { keyPath: 'Id' });
    linesObjectStore.createIndex('Lines.Id', 'Id', { unique: true });

    const stationsObjectStore = db.createObjectStore('stations', {
      keyPath: ['Id', 'LineId'],
    });
    stationsObjectStore.createIndex('Station.Id', 'Id', { unique: true });
    stationsObjectStore.createIndex('Station.LineId', 'LineId', {
      unique: false,
    });
  };

  DBOpenRequest.onsuccess = (event) => {
    console.log('Database initialized successfully.');
  };

  DBOpenRequest.onerror = (event) => {
    console.error('Error initializing database: ', event.target.error);
  };

  DBOpenRequest.onblocked = (event) => {
    console.error('Database initialization blocked: ', event.target.error);
  };

  DBOpenRequest.onversionchange = (event) => {
    console.error('Database version change: ', event.target.error);
  };

  DBOpenRequest.onclose = (event) => {
    console.error('Database connection closed: ', event.target.error);
  };

  DBOpenRequest.onabort = (event) => {
    console.error('Database connection aborted: ', event.target.error);
  };

  DBOpenRequest.oncomplete = (event) => {
    console.error('Database connection completed: ', event.target.error);
  };
}

function PopulateLinesDB() {
  fetch(
    'https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetLines',
    options
  )
    .then((response) => response.json())
    .then((data) => {
      const DBOpenRequest = window.indexedDB.open('MetroIstanbulDB');

      DBOpenRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['lines'], 'readwrite');
        const object_store = transaction.objectStore('lines');

        transaction.oncomplete = () => {
          console.log('All lines have been added to the database.');
        };

        transaction.onerror = (event) => {
          console.error('Transaction error: ', event.target.error);
        };

        data.Data.forEach((line) => {
          const get_request = object_store.get(line.Id);

          get_request.onsuccess = (event) => {
            if (!event.target.result) {
              object_store.add({
                Id: line.Id,
                Name: line.Name,
                Content: line.Content,
                LongDescription: line.LongDescription,
                IsActive: line.IsActive,
                FunctionalCode: line.FunctionalCode,
                Color: [
                  line.Color.Color_R,
                  line.Color.Color_G,
                  line.Color.Color_B,
                ],
                FirstTime: line.FirstTime,
                LastTime: line.LastTime,
              });
            }
          };

          get_request.onerror = (event) => {
            console.error('Error fetching line: ', event.target.error);
          };
        });
      };
    })
    .catch((error) => console.error(error));
}

function PopulateStationsDB() {
  fetch(
    'https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetStations',
    options
  )
    .then((response) => response.json())
    .then((data) => {
      const DBOpenRequest = window.indexedDB.open('MetroIstanbulDB');

      DBOpenRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['stations'], 'readwrite');
        const object_store = transaction.objectStore('stations');

        transaction.oncomplete = () => {
          console.log('All stations have been added to the database.');
        };

        transaction.onerror = (event) => {
          console.error('Transaction error: ', event.target.error);
        };

        data.Data.forEach((station) => {
          const get_request = object_store.get([station.Id, station.LineId]);

          get_request.onsuccess = (event) => {
            if (!event.target.result) {
              object_store.add(station);
            }
          };

          get_request.onerror = (event) => {
            console.error('Error fetching line: ', event.target.error);
          };
        });
      };
    })
    .catch((error) => console.error(error));
}

InitDB();
PopulateLinesDB();
PopulateStationsDB();

function GetLines() {
  const lineselect = document.getElementById('metro-istanbul-lines');

  // Metro Hatları için optgroup'lar oluşturulur
  const metro_hatlari_optgroup = document.createElement('optgroup');
  metro_hatlari_optgroup.setAttribute('id', 'metro-hatlari-optgroup');
  metro_hatlari_optgroup.setAttribute('label', 'Metro Hatları');

  // Tramvay Hatları için optgroup'lar oluşturulur
  const tramvay_hatlari_optgroup = document.createElement('optgroup');
  tramvay_hatlari_optgroup.setAttribute('id', 'tramvay-hatlari-optgroup');
  tramvay_hatlari_optgroup.setAttribute('label', 'Tramvay Hatları');

  // Füniküler Hatları için optgroup'lar oluşturulur
  const funikuler_hatlari_optgroup = document.createElement('optgroup');
  funikuler_hatlari_optgroup.setAttribute('id', 'funikuler-hatlari-optgroup');
  funikuler_hatlari_optgroup.setAttribute('label', 'Füniküler Hatları');

  // Teleferik Hatları için optgroup'lar oluşturulur
  const teleferik_hatlari_optgroup = document.createElement('optgroup');
  teleferik_hatlari_optgroup.setAttribute('id', 'teleferik-hatlari-optgroup');
  teleferik_hatlari_optgroup.setAttribute('label', 'Teleferik Hatları');

  fetch('https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V2/GetLines', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Host: 'api.ibb.gov.tr',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.Success) {
        throw new Error(data.Error);
      }

      const DBOpenRequest = window.indexedDB.open('MetroIstanbulDB');

      // Generic error handler for all errors targeted at this database's requests!
      DBOpenRequest.onerror = (event) => {
        throw new Error(event.target.error?.message);
      };

      DBOpenRequest.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create an objectStore to hold information about our customers. We're
        // going to use 'ssn' as our key path because it's guaranteed to be
        // unique - or at least that's what I was told during the kickoff meeting.
        const objectStore = db.createObjectStore('lines', { keyPath: 'Id' });

        // Create an index to search customers by name. We may have duplicates
        // so we can't use a unique index.
        objectStore.createIndex('Lines.Id', 'Id', { unique: true });

        // Use transaction oncomplete to make sure the objectStore creation is
        // finished before adding data into it.
        objectStore.transaction.oncomplete = (event) => {
          // Store values in the newly created objectStore.
          const linesObjectStore = db
            .transaction('lines', 'readwrite')
            .objectStore('lines');
          data.Data.forEach((line) => {
            linesObjectStore.add(line);
          });
        };
      };

      DBOpenRequest.onsuccess = (event) => {
        const db = DBOpenRequest.result;
        const transaction = db.transaction(['lines'], 'readonly');
        const object_store = transaction.objectStore('lines');
        const request = object_store.getAll();

        request.onsuccess = (event) => {
          const lines = event.target.result;
          lines.forEach((line) => {
            const lineopt = document.createElement('option');
            lineopt.setAttribute('value', line.Id);
            lineopt.textContent = `${line.Name} - ${line.LongDescription}`;

            switch (true) {
              case line.Name.startsWith('TF'):
                teleferik_hatlari_optgroup.appendChild(lineopt);
                break;
              case line.Name.startsWith('F'):
                funikuler_hatlari_optgroup.appendChild(lineopt);
                break;
              case line.Name.startsWith('T'):
                tramvay_hatlari_optgroup.appendChild(lineopt);
                break;
              case line.Name.startsWith('M'):
                metro_hatlari_optgroup.appendChild(lineopt);
                break;
              default:
                break;
            }
          });

          lineselect.appendChild(metro_hatlari_optgroup);
          lineselect.appendChild(tramvay_hatlari_optgroup);
          lineselect.appendChild(funikuler_hatlari_optgroup);
          lineselect.appendChild(teleferik_hatlari_optgroup);
        };
      };

      request.onerror = (event) => {
        console.error('Database error: ', event.target.error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('lines')) {
          const object_store = db.createObjectStore('lines', { keyPath: 'Id' });
          object_store.createIndex('Lines.Id', 'Id', { unique: true });
        }

        const transaction = db.transaction(['lines'], 'readwrite');
        const object_store = transaction.objectStore('lines');

        transaction.oncomplete = () => {
          console.log('All lines have been added to the database.');
        };

        transaction.onerror = (event) => {
          console.error('Transaction error: ', event.target.error);
        };

        data.Data.forEach((line) => {
          const lineopt = document.createElement('option');
          lineopt.setAttribute('value', line.Id);
          lineopt.textContent = `${line.Name} - ${line.LongDescription}`;

          switch (true) {
            case line.Name.startsWith('TF'):
              teleferik_hatlari_optgroup.appendChild(lineopt);
              break;
            case line.Name.startsWith('F'):
              funikuler_hatlari_optgroup.appendChild(lineopt);
              break;
            case line.Name.startsWith('T'):
              tramvay_hatlari_optgroup.appendChild(lineopt);
              break;
            case line.Name.startsWith('M'):
              metro_hatlari_optgroup.appendChild(lineopt);
              break;
            default:
              break;
          }

          const get_request = object_store.get(line.Id);
          get_request.onsuccess = (event) => {
            if (!event.target.result) {
              object_store.add({
                Id: line.Id,
                Name: line.Name,
                Content: line.Content,
                LongDescription: line.LongDescription,
                IsActive: line.IsActive,
                FunctionalCode: line.FunctionalCode,
                Color: [
                  line.Color.Color_R,
                  line.Color.Color_G,
                  line.Color.Color_B,
                ],
                FirstTime: line.FirstTime,
                LastTime: line.LastTime,
              });
            }
          };

          get_request.onerror = (event) => {
            console.error('Error fetching line: ', event.target.error);
          };
        });

        lineselect.appendChild(metro_hatlari_optgroup);
        lineselect.appendChild(tramvay_hatlari_optgroup);
        lineselect.appendChild(funikuler_hatlari_optgroup);
        lineselect.appendChild(teleferik_hatlari_optgroup);
      };
    })
    .catch((error) => console.error(error));
}

function GetStations() {
  fetch('https://api.ibb.gov.tr/MetroIstanbul/api/MetroMobile/V3/GetStations', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Host: 'api.ibb.gov.tr',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.Success) {
        throw new Error(data.Error);
      }

      const request = window.indexedDB.open('MetroIstanbulDB');

      request.onupgradeneeded = (event) => {
        // Save the IDBDatabase interface
        const db = event.target.result;

        // Create an objectStore for this database
        const objectStore = db.createObjectStore('name', { keyPath: 'myKey' });
      };

      request.onerror = (event) => {
        // Do something with request.error!
      };
      request.onsuccess = (event) => {
        // Do something with request.result!
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('stations')) {
          const object_store = db.createObjectStore('stations', {
            keyPath: ['Id', 'LineId'],
          });
          object_store.createIndex('Station.Id', 'Id', { unique: true });
          object_store.createIndex('Station.LineId', 'LineId', {
            unique: false,
          });
        }
      };

      request.onerror = (event) => {
        console.error('Database error: ', event.target.error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;

        const transaction = db.transaction(['stations'], 'readwrite');
        const object_store = transaction.objectStore('stations');

        transaction.oncomplete = () => {
          console.log('All stations have been added to the database.');
        };

        transaction.onerror = (event) => {
          console.error('Transaction error: ', event.target.error);
        };

        data.Data.forEach((station) => {
          const get_request = object_store.get([station.Id, station.LineId]);

          get_request.onsuccess = (event) => {
            if (!event.target.result) {
              object_store.add(station);
            }
          };

          get_request.onerror = (event) => {
            console.error('Error fetching line: ', event.target.error);
          };
        });
      };
    })
    .catch((error) => console.error(error));
}

// GetLines();
// GetStations();
*/