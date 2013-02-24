var Statistics = new function(){
	
	this.wrongOverall = $.cookie('stat_wrong_overall');
	this.answersOverall = $.cookie('stat_answers_overall');
	this.today = $.cookie('stats_latest');
	
	this.init = function(){
		if(this.wrongOverall === undefined || this.wrongOverall === null || $.cookie('stat_wrong_overall') === null || $.cookie('stat_wrong_overall') === undefined){
			this.wrongOverall = '0';
		} else {
			this.wrongOverall = $.cookie('stat_wrong_overall');
		}
		
		if(this.answersOverall === undefined || this.answersOverall === null || $.cookie('stat_answers_overall') === null || $.cookie('stat_answers_overall') === undefined){
			this.answersOverall = '0';
		} else {
			this.answersOverall = $.cookie('stat_answers_overall');
		}
		
		if(this.today === undefined || this.today === null || $.cookie('stat_latest') === null || $.cookie('stat_latest') === undefined){
			this.today = '';
		} else {
			this.today = $.cookie('stats_latest');
		}
		
		console.log('Statistics init complete.');
	}
	
	
	this.wrong = function() {
		console.log('Called: Statistics.wrong()');
		this.answere();
		//Increase the wrong overall count
		
		this.wrongOverall = parseInt(this.wrongOverall) + 1;
		console.log('Answers wrong set to: '+ this.wrongOverall);
		$.cookie('stat_wrong_overall',this.wrongOverall, { expires: 1000 });
		
		//Insert data for today statistics
		this.newTodayEntry(true);
	}
	
	this.correct = function() {
		console.log('Called: Statistics.correct()');
		this.answere();
		this.newTodayEntry(false);
	}
	
	this.answere = function(){
		console.log('Called: Statistics.answere() was called');
		//Increase the overall count.
		
		this.answersOverall = parseInt(this.answersOverall) + 1;
		console.log('Answeres overall set to: '+ this.answersOverall);
		$.cookie('stat_answers_overall',this.answersOverall, { expires: 1000 });
	}
	
	this.newTodayEntry = function(wasWrong){
		
		//setup JS time params for date check.
		var date = new Date().getDate(); //lol at javascripts Date object, day is the only field starting at 1.
		var month = new Date().getMonth()+1; 
		var hours = new Date().getHours()+1;

		//get all hour objects
		var seventytwohours = $.parseJSON($.cookie('stats_latest'));
		
		//this is where we save all valid hour objects
		var entries = [];
		var found_current = false;
		var hour_object = null;
		
		//if we have any hour objects, lets delete all outdate objects
		if(seventytwohours != null){
			console.log('Got stored hour object, lets loop them and se if anyone is to old.');
			var correctDaysAgo = this.getDateAgo();
			$.each(seventytwohours, function(i, obj) {
				//Check if entry need to be removed because it older then 3 days
				console.log('Obj has date: ' + obj.date + ' should be higher then:' + correctDaysAgo );
				//if(parseInt(obj.date) > parseInt(month+''+(date-3))){ OLD
				if(parseInt(obj.date) > correctDaysAgo){
					console.log('Hour object usable, add it to list.');
					entries.push(obj);
					
					//Entry less then 72 hours old, so lets the exists a entry for the current hour.
					if((parseInt(obj.date) == parseInt(month+''+date)) && obj.hour == hours){
						console.log('Found this hour object, set it as found with index: ' + i);
						found_current = true;
						hour_object = i;
					} 
				} else {
					console.log('3 Days check failed, delete.');
				}
			});
		} else {
			console.log('No hour objects found, continue...');
		}
		
		//If we have a object for this hour, else we have to create a new one.
		if(found_current){
			console.log('Found a hour object, updating object.');
			entries[hour_object].entries++
			if(wasWrong) entries[hour_object].wrong++;
		} else {
			console.log('Did not found hour object, creating a new one.');
			var entry = new Object();
			entry.date = month+''+date;
			entry.hour = hours
			entry.entries = 1;
			if(wasWrong) entry.wrong = 1;
			else entry.wrong = 0;
			entries.push(entry);
		}
		
		console.log(entries);
		
		$.cookie('stats_latest',JSON.stringify(entries), {expires: 1000 });
		this.today = $.cookie('stats_latest');
	}
	
	this.getLatestEntries = function(){
		return $.parseJSON($.cookie('stats_latest'));
	}
	
	this.getOverallAnswers = function(){
		return parseInt($.cookie('stat_answers_overall'));
	}
	
	this.getOverallWrongs = function(){
		return parseInt($.cookie('stat_wrong_overall'));
	}

	
	this.getOverallPercent = function(){
		if(parseInt(this.answersOverall) > 0){
			return parseInt(this.wrongOverall) / parseInt(this.answersOverall);
		}
		return 0;
	}
	
	this.getDateAgo = function(){
		console.log("getDateAgo() Called");
		var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
		var date = parseInt(new Date().getDate());
		var month = parseInt(new Date().getMonth()); 
		
		if(parseInt(date) < 4){

			//	Expected results
			//
			//	01.02	02.02	03.02	04.02
			//	_____________________________
			//	29.01	30.01	31.01	01.02
			
			var daysInLastMonth = (month == 1) ? daysInMonth[11] : daysInMonth[month];
			console.log('Days in previous month: ' + daysInLastMonth);
			var totaldays = daysInLastMonth+parseInt(date);
			console.log('Returning: ' + parseInt(month)+''+(totaldays-3));
			return parseInt(month)+''+(parseInt(totaldays)-3);
			
		} else {
			console.log('Returning:' + parseInt(month+1)+''+((parseInt(date) < 10) ? '0' : '')+''+(parseInt(date)-3));
			return parseInt(month+1)+''+ ((parseInt(date) < 10) ? '0' : '') +''+(parseInt(date)-3);
			
		}
	}

}