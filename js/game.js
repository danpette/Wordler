var currentTask;
var correct = 0;
var wrong = 0;
var lastPick = -1;
var timedgame_running = false;
var countdowngame_running = false;
var countdowngame_counter = 0;
var percent;
var counter = 0;
var continuing = false;
var hasAnswered = false;


(function($) {
    /*
     * Changes the displayed text for a jquery mobile button.
     * Encapsulates the idiosyncracies of how jquery re-arranges the DOM
     * to display a button for either an <a> link or <input type="button"> or <button ..></button>
     */
    $.fn.changeButtonText = function(newText) {
        return this.each(function() {
            $this = $(this);
            if( $this.is('a') ) {
                $('span.ui-btn-text',$this).text(newText);
                return;
            }
            if( $this.is('input') ) {
                $this.val(newText);
                // go up the tree
                var ctx = $this.closest('.ui-btn');
                $('span.ui-btn-text',ctx).text(newText);
                return;
            }
            if( $this.is('button') ) {
                $this.val(newText);
                // go up the tree
                var ctx = $this.closest('.ui-btn');
                $('span.ui-btn-text',ctx).text(newText);
                return;
            }
        });
    };
})(jQuery);


function changeAnswerButton(buttonId, newText)
{
	$(buttonId).changeButtonText(newText);
}

$('#wordbyword').live('pageinit', function() {
	
	// Make sure we load everything like we should..
	$.ajaxSetup( { "async": false } );
	//console.log(dictionary);
	Settings.init();
	language.loadLanguage(Settings.getSource(),Settings.getTarget());

	wordByWordNext();
	
});

function setCounter(){
	counter++;
}

function changeCounter(c){
	counter = c;
}

function wordByWordNext()
{
	var amountOfWords = validWordArray.length;
	// dictionary[validWordArray[i]].targetWord
	var randomPick = Math.floor(Math.random()*amountOfWords);
	var amountOfWhile = 0;
	while (randomPick == lastPick && amountOfWhile < 10)
	{
		randomPick = Math.floor(Math.random()*amountOfWords);
		amountOfWhile++;
	}
	
	lastPick = randomPick;
	
	
	$('#sourceWordText').html(dictionary[validWordArray[randomPick]].sourceWord);
	$('#targetWordText').html(dictionary[validWordArray[randomPick]].targetWord);
}


$('#wordbywordnext').live('click', function(){
	wordByWordNext();
});


$('#dictionary').live('pageinit', function() {
	$.ajaxSetup( { "async": false } );
	//console.log(dictionary);
	Settings.init();
	language.loadLanguage(Settings.getSource(),Settings.getTarget());

	$('#ulDictionary').html("");
	
	var startLetter = "";
	for (var i=0; i< validWordArray.length; i++)
	{
		var curLetter = dictionary[validWordArray[i]].targetWord.charAt(0);
		if (startLetter != curLetter)
		{
			startLetter = curLetter;
			$('#ulDictionary').append('<li data-role="list-divider">'+startLetter.capitalize()+'</li>');
		}
		
		$('#ulDictionary').append('<li>'+ dictionary[validWordArray[i]].targetWord.capitalize() +' - '+ dictionary[validWordArray[i]].sourceWord.capitalize() + '</li>');
	}
	
	$('#ulDictionary').listview('refresh');
	
});

$('#statistics').live('pageinit', function() {
	Statistics.init();
});

function resetNormalGame() {
	$.ajaxSetup( { "async": false } );
	//console.log(dictionary);
	Settings.init();
	Statistics.init();
	language.loadLanguage(Settings.getSource(),Settings.getTarget());
	nextRound();
	correct = 0;
	wrong = 0;
	$("#correctAnswers").html(correct);
	$("#wrongAnswers").html(wrong);
}

$('#normalgame').live('pageinit', function() {
	resetNormalGame();
});

$('#normalgame').live('pagebeforeshow', function() {
	resetNormalGame();
});

$('#timedgame').live('pageinit',function(){
	
	correct = 0;
	wrong = 0;
	$.ajaxSetup( { "async": false } );
	Settings.init();
	Statistics.init();
	language.loadLanguage(Settings.getSource(),Settings.getTarget());
	
	//Setup Logic
	countdowngame_counter = Settings.getDifficultyInSeconds(); //new :: 20
	percent = 100 / Settings.getDifficultyInSeconds();
	continuing = false;

});

$('#timedgame').live('pagebeforehide', function(event, ui) {
	
	//When we leave a page we stopp the time and update ui
	
	timedgame_running = false;
	$('.timed-answer-button').changeButtonText('');
	$("#timedgame-start").changeButtonText('Continue');
	$("#timedgame-start").removeClass('ui-disabled');
	$("#timedgame-start").stopTime();
	
	//console.log('timed stopped at: ' + counter);
	continuing = true;
});

$('#timedgame').live('pagebeforeshow', function(event, ui) {
	console.log('continue game at: '+ counter);
});

$('#countdowngame').live('pageinit',function(){
	correct = 0;
	wrong = 0;
	$.ajaxSetup( { "async": false } );
	Settings.init();
	Statistics.init();
	language.loadLanguage(Settings.getSource(),Settings.getTarget());
	
	//Setup Logic
	countdowngame_counter = Settings.getDifficultyInSeconds(); //new
	percent = 100 / Settings.getDifficultyInSeconds();
});

$('#spelltheword').live('pageinit',function(){
	
});

$("#timedgame-start").live("click", function(){ 
	
	if(!timedgame_running){
		
		$(this).changeButtonText('');
		$(this).addClass('ui-disabled');
		timedgame_running = true;
		
		if(continuing){
			//If page has been paused
			continuing = false;
			$('#timed-progress').css('width',(percent*(Settings.getDifficultyInSeconds()-counter))+'%');

			changeAnswerButton("#timed-alternative1", currentTask.options.one);
			changeAnswerButton("#timed-alternative2", currentTask.options.two);
			changeAnswerButton("#timed-alternative3", currentTask.options.three);
			changeAnswerButton("#timed-alternative4", currentTask.options.four);
			$("#wordToTranslateTimed").html(currentTask.source);
			
			$(this).everyTime(1000, function(i) {
				//console.log(counter);
				$('#timed-progress').css('width',(100-((counter+1)*percent)) +'%');
				if(timedgame_running){
					
					console.log('setcounter +1 from timedgame_running');
					setCounter();
							
					console.log('sett button counter ui to: ' + (Settings.getDifficultyInSeconds()-counter) +" | counter was: " + counter);
					$(this).changeButtonText(Settings.getDifficultyInSeconds()-counter);
					if(counter == Settings.getDifficultyInSeconds()){
						console.log('nextRoundTimed-timegame_running reset counter');
						changeCounter(0);
						timedgame_running = false;
						 $('.timed-answer-button').changeButtonText('');
						$(this).changeButtonText('Start');
						$(this).removeClass('ui-disabled');
						$(this).stopTime();	
					}
				}  else {
					$(this).stopTime();
					//nextRoundTimed();
					$("#timedgame-start").click();
				}
			});
			
			
			
			
		} else {
			//Run game as normal
			
			$('#timed-progress').css('width','100%');
			
			nextRoundTimed();
			changeCounter(0);
			$("#correctAnswers").html(correct);
			$("#wrongAnswers").html(wrong);
			$(this).changeButtonText(counter);
			
			
			$(this).everyTime(1000, function(i) {
				//console.log(counter);
				$('#timed-progress').css('width',(100-((counter+1)*percent)) +'%');
				if(timedgame_running){
					
					console.log('setcounter +1 from timedgame_running');
					setCounter();
							
					console.log('sett button counter ui to: ' + (Settings.getDifficultyInSeconds()-counter) +" | counter was: " + counter);
					$(this).changeButtonText(Settings.getDifficultyInSeconds()-counter);
					if(counter == Settings.getDifficultyInSeconds()){
						console.log('nextRoundTimed-timegame_running reset counter');
						changeCounter(0);
						timedgame_running = false;
						 $('.timed-answer-button').changeButtonText('');
						$(this).changeButtonText('Start');
						$(this).removeClass('ui-disabled');
						$(this).stopTime();	
					}
				}  else {
					$(this).stopTime();
					//nextRoundTimed();
					$("#timedgame-start").click();
				}
			});
			
			
			
			
			
		}
		var percent = 100 / Settings.getDifficultyInSeconds();
		
		$(this).everyTime(1000, function(i) {
			console.log((100-(i*percent)));
			$('#timed-progress').css('width',(100-(i*percent)) +'%');
			if(timedgame_running){
				$(this).changeButtonText(Settings.getDifficultyInSeconds()-i);
			    console.log(i);
			    if(i == Settings.getDifficultyInSeconds()){
			    	console.log(Settings.getDifficultyInSeconds() + ' reached, game over mr.');
			    	timedgame_running = false;
			    	$('.timed-answer-button').changeButtonText('');
			    	$(this).changeButtonText('Start');
			    	$(this).removeClass('ui-disabled');
			    	$(this).stopTime();	
			    }  
			} else {
				$(this).stopTime();
				nextRoundTimed();
				$("#timedgame-start").click();
			}
		});
	} else {
		//console.log('timedgame-start reset counter');
		//changeCounter(0);
		timedgame_running = false;
		$(this).stopTime();
	}	
		

});

$('#countdowngame-start').live("click", function(){
	if(!countdowngame_running){
		
		//Setup UI elements
		$('#countdown-progress').css('width','100%');
		$(this).changeButtonText('');
		$(this).addClass('ui-disabled');
		countdowngame_running = true;
		nextRoundCountdown();
		$("#correctAnswers").html(correct);
		$("#wrongAnswers").html(wrong);
		$(this).changeButtonText(countdowngame_counter);
		
		//remove logic
		
		console.log('starting timer');
		
		$(this).everyTime(1000, function(i) {
			
			countdowngame_counter--;
			console.log(countdowngame_counter);
			console.log('percent is: ' + percent);
			i++; //hack to display 0% correctly.
			$('#countdown-progress').css('width',100-(percent*i) +'%');
			//console.log(100-(percent*i));
			
			if(countdowngame_running){
	
				$(this).changeButtonText(countdowngame_counter);
			    //console.log(i);
			    
			    if(countdowngame_counter <= 0){ //new
			    	console.log('no more time left');
			    	countdowngame_running = false;
			    	$('.countdown-answer-button').changeButtonText('');
			    	$(this).changeButtonText('Start');
			    	$(this).removeClass('ui-disabled');
			    	$(this).stopTime();	
			    	
			    	//reset logic
			    	countdowngame_counter = Settings.getDifficultyInSeconds();
			    	percent = 100 / countdowngame_counter;
			    	
			    }  
			} else {
				$(this).stopTime();
				nextRoundCountdown();
				$("#countdowngame-start").click();
			}
		});
	} else {
		countdowngame_running = false;
		$(this).stopTime();
		
	}
})

$('#settings').live('pageinit', function() {
	$.ajaxSetup( { "async": false } );
	
	Settings.init();
	
	$('[name="difficulty-settings" ][value="' + Settings.getDifficulty() + '"]').attr('checked', true).checkboxradio("refresh");
	$("[name=difficulty-settings]").change(function() {
		Settings.setDifficulty($('input[name=difficulty-settings]:checked').val());
	});

	
	$('.source-language').val(Settings.getSource()).selectmenu("refresh");
	$("[name=source-language]").change(function() {
		var source = $('.source-language :selected').val();
		if(source == Settings.getTarget()){
			Settings.setTarget(Settings.getSource());
			$('.target-language').val(Settings.getTarget()).selectmenu("refresh");
		}
		
		Settings.setSource(source);

	});
	
	$('.target-language').val(Settings.getTarget()).selectmenu("refresh");
	$("[name=target-language]").change(function() {
		var target = $('.target-language :selected').val();	
		if(target == Settings.getSource()){
			Settings.setSource(Settings.getTarget());
			$('.source-language').val(Settings.getSource()).selectmenu("refresh");
		}
		
		Settings.setTarget(target);
	});
});

$(function() {

	$.ajaxSetup( { "async": false } );
	
	Settings.init();

	$('.normal-answer-button').live('click', function(){
		checkUserSelected(this, this.id);
	});
	
	$('.timed-answer-button').live('click', function(){
		timedgame_running = false;
		checkUserSelectedTimed(this.id);
	});
	
	$('.countdown-answer-button').live('click', function(){
		countdowngame_running = false;
		checkUserSelectedCountdown(this.id);
	});

});

function nextRound() {

	currentTask = generateTask();
	
	changeAnswerButton("#alternative1", currentTask.options.one);
	changeAnswerButton("#alternative2", currentTask.options.two);
	changeAnswerButton("#alternative3", currentTask.options.three);
	changeAnswerButton("#alternative4", currentTask.options.four);
	$("#wordToTranslate").html(currentTask.source);
	
}

function nextRoundTimed() {

	currentTask = generateTask();
	
	changeAnswerButton("#timed-alternative1", currentTask.options.one);
	changeAnswerButton("#timed-alternative2", currentTask.options.two);
	changeAnswerButton("#timed-alternative3", currentTask.options.three);
	changeAnswerButton("#timed-alternative4", currentTask.options.four);
	$("#wordToTranslateTimed").html(currentTask.source);
	
}

function nextRoundCountdown() {

	currentTask = generateTask();

	changeAnswerButton("#countdown-alternative1", currentTask.options.one);
	changeAnswerButton("#countdown-alternative2", currentTask.options.two);
	changeAnswerButton("#countdown-alternative3", currentTask.options.three);
	changeAnswerButton("#countdown-alternative4", currentTask.options.four);
	$("#wordToTranslateCountdown").html(currentTask.source);
	
}


var nextQuestionTimer;
// Normal
function checkUserSelected(thebutton, optionClicked){
	if (!hasAnswered)
	{
		// So sneaky people can't answer twice on the same question... :)
		hasAnswered=true;
		console.log('clicked: '+ optionClicked + ' and correct was alternative'+currentTask.correct);
		if(optionClicked == 'alternative'+currentTask.correct){
			console.log('correct');
			Statistics.correct();
			correct++;
			$(thebutton).siblings().css("color", "green");
		} else {
			wrong++;
			Statistics.wrong();
			console.log('fail');
			$(thebutton).siblings().css("color", "red");
			$('#alternative'+currentTask.correct).siblings().css("color", "green");
		}
		
		// Set the amount of correct
		$("#correctAnswers").html(correct);
		$("#wrongAnswers").html(wrong);
		
		// Start timer to clear colors etc.
		if (nextQuestionTimer)
		{
			clearTimeout(nextQuestionTimer);
		}
		nextQuestionTimer = setTimeout(function(){
			nextRound();		
			$("span.ui-btn-inner").css("color", "");
			hasAnswered=false;
		}, 1000);
	}
}

function checkUserSelectedTimed(optionClicked){
	if (timedgame_running)
	{
		console.log('clicked: '+ optionClicked + ' and correct was alternative'+currentTask.correct);
		if(optionClicked == 'timed-alternative'+currentTask.correct){
			console.log('correct');
			Statistics.correct();
			correct++;
		} else {
			wrong++;
			Statistics.wrong();
			console.log('fail');
		}
		$("#correctAnswersTimed").html(correct);
		$("#wrongAnswersTimed").html(wrong);
		nextRoundTimed();
	}

	$("#correctAnswersTimed").html(correct);
	$("#wrongAnswersTimed").html(wrong);
	//nextRoundTimed();
	
}

function checkUserSelectedCountdown(optionClicked){
	console.log('clicked: '+ optionClicked + ' and correct was alternative'+currentTask.correct);
	if(optionClicked == 'countdown-alternative'+currentTask.correct){
		console.log('correct');
		correct++;
		Statistics.correct();
		countdowngame_counter += Settings.getCountdownSecondsPluss();
		percent = 100 / countdowngame_counter;
	} else {
		wrong++;
		Statistics.wrong();
		countdowngame_counter = countdowngame_counter-Settings.getCountdownSecondsMinus();
		percent = 100 / countdowngame_counter;
		console.log('fail');
	}
	$('#countdown-progress').css('width','100%');
	$("#correctAnswersCountdown").html(correct);
	$("#wrongAnswersCountdown").html(wrong);
	//nextRoundCountdown();
}

function generateTask(){
	var length = validWordArray.length;
	var used_array = new Array();
	while((used_array.length < 5 && used_array.length < validWordArray.length) && length != 0){
		var rnd = Math.floor(Math.random()*length);
		var element = validWordArray[rnd];
		if(jQuery.inArray(element, used_array) == -1){
			used_array.push(element);
		}
	}
	
	var rnd_correct = Math.floor(Math.random()*4);
	var task = {};
	
	task['source'] = dictionary[used_array[rnd_correct]].sourceWord;
	console.log('correct is:' +dictionary[used_array[rnd_correct]].targetWord);
	task['correct'] = rnd_correct+1;
	task['options'] = {};
	task['options']['one'] = dictionary[used_array[0]].targetWord;
	task['options']['two'] = dictionary[used_array[1]].targetWord;
	task['options']['three'] = dictionary[used_array[2]].targetWord;
	task['options']['four'] = dictionary[used_array[3]].targetWord;
	console.log('new task created successfully');
	return task;
}
