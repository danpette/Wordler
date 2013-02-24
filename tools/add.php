<?php

error_reporting(E_ALL & ~E_NOTICE);
date_default_timezone_set('Europe/Paris');
ob_start();
session_start();


// Laste inn ting vi trenger.... ftw!

include 'Constants.php';
include 'Global.php';
include 'Database.class.php';
include 'Word.class.php';

$db = Database::getInstance();

$word = new Word($db);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"> 
<html>
	<head>
		<title>ForeignWords - All the words you need to learn a new language</title>
		<meta name="description" content="Learn a new language through the use of a game.">
		<link rel="shortcut icon" href="img/favicon.ico">
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/main.js"></script>

		<style type="text/css">
		
		</style>
		<script type="text/javascript">

		$(document).ready(function(){
			// Lets turn off async so ajax doesnt %!#$ us over....
			$.ajaxSetup( { "async": false } );
			
			var currentId = -1;

			<?php 
			/**
			 * Getting all the languages and setting it directly in javascript! fuck yeah!
			 */
			?>
			
			var languages = <?=json_encode($word->getAllLanguages());?>;

			$('.languages').html('');
			
			$.each(languages, function() {
				if (this.lang_name != "English")
				{
			     $('.languages').
		          append($("<option></option>").
		          attr("value",this.lang_id).
		          text(this.lang_name));
				} 
			});

			function getNewWordToTranslate(langId)
			{
				$.ajax({
					   type: "GET",
					   url: "ajax.php",
					   data: "q=getRandomWord&tl="+ langId,
					   success: function(msg){
						   // Fancy kode her...
						   var json = $.parseJSON(msg);
							$('.translateThis').html(json.word_word + ' (' + json.word_id + ')');
							currentId = json.word_id;
					   }
					});
			}
			

			$("#newWord").keyup(function(event){
				if (event.keyCode == '13') {
		     		event.preventDefault();

					if ($("#newWord").val() != "")
					{
    					$.ajax({
    					   type: "GET",
    					   url: "ajax.php",
    					   data: "q=connect&tl="+ $("#newWordLanguage").val() +"&word="+ $("#newWord").val() + "&wid=" + currentId,
    					   success: function(msg){
    						   // Fancy kode her...
 
    					   }
    					});
					}

					getNewWordToTranslate($('#newWordLanguage').val());

					// Reset value
					$("#newWord").val("");
					
		     	}

		     	


				
			});

			getNewWordToTranslate($('#newWordLanguage').val());

			
			
		});

		</script>
		
		
		
	</head>
	<body>
		<div id="languageSelector">
			<h1>Add new word translation</h1>
		
			<span class="languageDiv">
			Adding to: 
			<select name="from" id="newWordLanguage" class="languages" tabindex="-1">
			<option value="1" selected="selected">English</option>
            </select>
            <br><br>Translate: <span class="translateThis"></span><br><br>
			 New word: 
			<input type="text" id="newWord" value="" tabindex="1">
			
			</span>
			
			</span>
		</div>
		
		<div id="languageSelector">
			<h1>Connect words</h1>
		
			<span id="fromLanguage" class="languageDiv">
			From: 
			<select name="from" class="languages" tabindex="-1">
			
            </select>
			existing word: 
			<input type="text" id="existingWord" value="" tabindex="1">
			
			</span>
			<span id="toLanguage" class="languageDiv">
			To:
			<select name="to" class="languages" tabindex="-1">
			
            </select>
            
            <input type="text" id="connectWord" value="" tabindex="2">
            
			
			
			</span>
		</div>
		
		
	</body>
</html>












