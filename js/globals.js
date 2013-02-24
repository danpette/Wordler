var currentTask;

//Dictionary of words
var dictionary = {};
var validWordArray = new Array();

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};