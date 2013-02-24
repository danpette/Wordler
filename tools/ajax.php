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

/**
 * 
 * 
 * 
 * 
 * 
 */

switch ($_GET["q"]) {
    
    case "word":
        // fl = fromLanguage (ID)
        // tl = toLanguage (ID)
        if(isset($_GET["fl"]) && is_numeric($_GET["fl"]) && isset($_GET["tl"]) && is_numeric($_GET["tl"]))
        {
            echo json_encode($word->getRandomWords($_GET["fl"], $_GET["tl"]));
        }
        break;
    
    case "getRandomWord":
        // fl = fromLanguage (ID)
        // tl = toLanguage (ID)
        if(isset($_GET["tl"]) && is_numeric($_GET["tl"]))
        {
            echo json_encode($word->getTranslateWord($_GET["tl"]));
        }
        break;
        
    case "add":
        if (isset($_GET["word"]) && isset($_GET["language"]))
        {
            if($word->addWord($_GET["language"], $_GET["word"])){
                echo "Added word";
            }
            else {
                echo "Failed.";
            }
        }
        
        break;
    case "connect":
        if(isset($_GET["tl"]) && is_numeric($_GET["tl"]) && isset($_GET["wid"]) && is_numeric($_GET["wid"]) && isset($_GET["word"]) && strlen($_GET["word"]) > 0)
        {
            if($word->addWord($_GET["tl"], $_GET["word"], $_GET["wid"])){
                echo "Added word";
            }
            else {
                echo "Failed.";
            }
        }
        break;

    case "update":
        break;
        
    default:
        echo "fail";
        break;
        
    
    
}
