<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
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


// THE CSV-FILE
$filename = $_GET["filename"];

$fromLanguage = "";
$fromId = -1;

$toLanguage = "";
$toId = -1;


$firstRun = true;

if (isset($filename))
{
    if (($handle = fopen($filename, "r")) !== FALSE) {
        while (($data = fgetcsv($handle, 0, ',', '"')) !== FALSE) {
            
            if ($firstRun)
            {
                $fromLanguage = $data[0];
                $toLanguage = $data[1];
                $firstRun = false;
                $fromId = $word->getLanguageIdFromName($fromLanguage);
                $toId = $word->getLanguageIdFromName($toLanguage);
                
                echo "From language: <b>".$fromLanguage. " (" . $fromId . ") </b>. To language: <b>". $toLanguage. " (" . $toId . ")</b>.<br>";
            }
            else
            {
                $num = count($data);
               
                if ($num < 2)
                {
                    // SKIP IT, Can't be less than two words.
                    continue;
                }
                
                echo $data[0] . " - " . $data[1];
                $curWordId = $word->getWordIdFromWord($fromId, $data[0]);
                
                if ($word->addWord($toId, $data[1], $curWordId))
                {
                    echo " <b>ADDED</b>";
                }

                echo "<br>";

                
                
            }
            
            

        }
        fclose($handle);
    }
}
else {
    echo "Forgot something?";
}
?>
</body>
</html>