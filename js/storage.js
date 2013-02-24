var Storage = new function(){
	
	this.db = null;
	this.tables = '';
	this.cols = '';
	
	this.isSupported = function(){
		if ( "webkitIndexedDB" in window ) {
			  window.indexedDB      = window.webkitIndexedDB;
			  window.IDBTransaction = window.webkitIDBTransaction;
			  window.IDBKeyRange    = window.webkitIDBKeyRange;
			  return true;
		} else if ( "moz_indexedDB" in window ) {
			  window.indexedDB = window.mozIndexedDB;
			  return true;
		}
			
		if ( !window.indexedDB ) {
				return false;
		} 
	}
	
	this.init = function(){
		if(this.isSupported()){
			//Storage is supported.
			var request = window.indexedDB.open("wordlerStatistics","Statestics for wordler");
			console.log(request);
			request.onsuccess = function(event) {
				console.log(event);
				  var db = event.result;
				  console.log(db);
				  if (db.version != "1") {
				    // User's first visit, initialize database.
				    var createdObjectStoreCount = 0;
				    var objectStores = [
				      { name: "kids", keyPath: "id", autoIncrement: true },
				      { name: "candy", keyPath: "id", autoIncrement: true },
				      { name: "candySales", keyPath: "", autoIncrement: true }
				    ];
				 
				    function objectStoreCreated(event) {
				      if (++createdObjectStoreCount == objectStores.length) {
				        db.setVersion("1").onsuccess = function(event) {
				          loadData(db);
				        };
				      }
				    }
				 
				    for (var index = 0; index < objectStores.length; index++) {
				      var params = objectStores[index];
				      request = db.createObjectStore(params.name, params.keyPath,
				                                     params.autoIncrement);
				      request.onsuccess = objectStoreCreated;
				    }
				  }
				  else {
				    // User has been here before, no initialization required.
				    loadData(db);
				  }
				};
			
			
		} else {
			alert('Storage not supported');
		}
	}
	
}