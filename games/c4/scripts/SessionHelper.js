class SessionHelper {
  constructor() {
		this.database = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
		this.checkDb()
		this.connectToDb()
  }
	
	checkDb() {
		if (!this.database) {
			console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
		}
	}
	
	connectToDb() {
		let open = this.database.open("ConnectFourData", 1);

		// Create the schema
		open.onupgradeneeded = () => {
			let db = open.result;
			let store = db.createObjectStore("MyObjectStore", {keyPath: "id"});
			let index = store.createIndex("NameIndex", ["name.last", "name.first"]);
		};

		open.onsuccess = () => {
			// Start a new transaction
			let db = open.result;
			let tx = db.transaction("MyObjectStore", "readwrite");
			let store = tx.objectStore("MyObjectStore");
			let index = store.index("NameIndex");

			// Add some data
			store.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
			store.put({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35});
			
			// Query the data
			let getJohn = store.get(12345);
			let getBob = index.get(["Smith", "Bob"]);

			getJohn.onsuccess = function() {
					console.log(getJohn.result.name.first);  // => "John"
			};

			getBob.onsuccess = function() {
					console.log(getBob.result.name.first);   // => "Bob"
			};

			// Close the db when the transaction is done
			tx.oncomplete = function() {
					db.close();
			};
		}
	}
} 

export { SessionHelper }