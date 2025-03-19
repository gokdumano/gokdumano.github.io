async function CheckDB(dbname='MetroIstanbulDB', dbversion=1) {
	const dbs = await window.indexedDB.databases();
	for (let db of dbs){
		if (db.name == dbname & db.version == dbversion){
			return true;
		}
	}
	return false;
}

async function CheckTable(relname, dbname='MetroIstanbulDB', dbversion=1) {
	if ( !await CheckDB(dbname, dbversion) ) {
		return false;
	}
	
	const DBOpenRequest = window.indexedDB.open(dbname, dbversion);
	// https://stackoverflow.com/questions/67547038/how-do-i-check-if-an-indexeddb-database-already-exists
	// https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/databases#examples
	
	
}

let CheckDB = async (dbname = 'MetroIstanbulDB') => await window.indexedDB.databases().then(dbs => dbs.some(db => db.name === dbname));

await window.indexedDB.databases().then((dbs) => dbs.forEach(db => {if (db.name === dbname) {return db}}))


async function CheckTable(relname, dbname = '') {
	CheckDB(dbname).then(dbexists => {
		if (dbexists) {
			console.log(`Found ${dbname}`);
		}
		else {
			throw new Error(`No IndexedDB found named ${dbname}`);
		}
	});
}

async function InitDB(dbname = 'MetroIstanbulDB') {
	
}


