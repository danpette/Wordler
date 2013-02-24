var Settings = new function(){
	this.source = $.cookie('source');
	this.target = $.cookie('target');;
	this.difficulty = $.cookie('difficulty');
	
	this.init = function(){
		if(this.source === undefined || this.source === null || $.cookie('source') === null || $.cookie('source') === undefined){
			this.source = 'english';
		} else {
			this.source = $.cookie('source');
		}
		
		if(this.target === undefined || this.target === null || $.cookie('target') === null || $.cookie('target') === undefined){
			this.target = 'spanish';
		} else {
			this.target = $.cookie('target');
		}
		
		if(this.difficulty === undefined || this.difficulty === null || $.cookie('difficulty') === null || $.cookie('difficulty') === undefined){
			this.difficulty = 'easy';
		} else {
			this.difficulty = $.cookie('difficulty');
		}		
	}
	
	this.getSource = function() {
		return this.source;
	}
	
	this.getTarget = function() {
		return this.target;
	}
	
	this.setSource = function(param){
		this.source = param;
		$.cookie('source',param, { expires: 1000 });
	}
	
	this.setTarget = function(param){
		this.target = param;
		$.cookie('target',param, { expires: 1000 });
	}
	
	this.getDifficulty = function(){
		return this.difficulty;
	}
	
	this.setDifficulty = function(param){
		this.difficulty = param;
		$.cookie('difficulty',param, { expires: 1000 });
	}
	
	this.getDifficultyInSeconds = function(){
		switch(this.difficulty){
			case 'easy':
				return 30;
			break;
			
			case 'medium':
				return 20;
			break;
			
			case 'hard':
				return 10;
			break;
				
			case 'very-hard':
				return 5;
			break;
			
			default:
				return 30;
		}
	}
	
	this.getCountdownSecondsPluss = function(){
		switch(this.difficulty){
			case 'easy':
				return 15;
			break;
			
			case 'medium':
				return 10;
			break;
			
			case 'hard':
				return 6;
			break;
				
			case 'very-hard':
				return 3;
			break;
			
			default:
				return 30;
		}
	}
	
	this.getCountdownSecondsMinus = function(){
		switch(this.difficulty){
			case 'easy':
				return 3;
			break;
			
			case 'medium':
				return 6;
			break;
			
			case 'hard':
				return 10;
			break;
				
			case 'very-hard':
				return 15;
			break;
			
			default:
				return 30;
		}
	}
}