async function CheckDB(dbname = 'MetroIstanbulDB', dbversion = 1) {
    if (!window.indexedDB) {
        return false;
    }
    let dbs = await window.indexedDB.databases();
    for (let db of dbs) {
        if (db.name == dbname && db.version == dbversion) {
            return true;
        }
    }
    return false;
}
async function CheckObjStore(objStoreName, dbname = 'MetroIstanbulDB', dbversion = 1) {
    return new Promise((resolve, reject) => {
        if (!CheckDB(dbname, dbversion)) {
            reject(new Error('CheckDB function returned with _false_ value'));
        }
        const OpenDBRequest = indexedDB.open(dbname, dbversion);
        OpenDBRequest.onsuccess = (event) => {
            const db = event.target.result;
            const objectStoreExists = db.objectStoreNames.contains(objStoreName);
            db.close();
            resolve(objectStoreExists);
        };
        OpenDBRequest.onerror = (event) => {
            db.close();
            reject(new Error(event.target.error));
        };
    });
}
async function IsObjStoreEmpty(objStoreName, dbname = 'MetroIstanbulDB', dbversion = 1) {
    return new Promise((resolve, reject) => {
        if (!CheckObjStore(dbname, dbversion)) {
            reject(new Error('CheckObjStore function returned with _false_ value'));
        }
        // IndexedDB'yi aç
        const OpenDBRequest = indexedDB.open(dbname, dbversion);
        OpenDBRequest.onsuccess = (event) => {
            const db = event.target.result;
            // Transaction oluştur ve object store'a eriş
            const transaction = db.transaction(objStoreName, 'readonly');
            const objectStore = transaction.objectStore(objStoreName);
            // Object store'daki kayıt sayısını al
            const countRequest = objectStore.count();
            countRequest.onsuccess = () => {
                db.close();
                resolve(countRequest.result === 0);
            };
            countRequest.onerror = () => {
                db.close();
                reject(new Error(event.target.error));
            };
        };
        OpenDBRequest.onerror = (event) => {
            reject(new Error("Failed to open the database."));
        };
    });
}