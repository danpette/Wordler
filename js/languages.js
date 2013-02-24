
function word(id) {
	this.id = id;
	this.sourceWord = null;
	this.targetWord = null;
}

var language = new function(){
	
	// Lets load the json files to the language
	this.loadLanguage = function(source, target) {

		// Lowercase
		source = source.toLowerCase();
		target = target.toLowerCase();
		
		// Reset the global vars in case we load several languages..
		dictionary = {};
		validWordArray = new Array();

		// Load from source language
		$.getJSON("/data/" + source + ".json", function(response) {
			
			$.each(response, function(key, val) {
				var newword = new word(val.i);
				newword.sourceWord = val.w;
				
				dictionary[val.i] = newword;
				
			});
		});
		
		// Load from target language
		$.getJSON("/data/" + target + ".json", function(response) {
			
			$.each(response, function(key, val) {

				if (val.i in dictionary)
				{
					dictionary[val.i].targetWord = val.w;
					validWordArray.push(val.i);
				}
				else {
					// If it doesnt exist then let's not add it to the dictionary....
//					var newword = new word(val.i);
//					newword.sourceWord = val.w;
//					dictionary[val.i] = newword;
				}
			});
		});
			
	};
}