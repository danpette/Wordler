<?php 
// 

if (!isset($_GET["language"])){
    die("Please specify a language. ?language=English for example.");
}

$db=mysql_connect("localhost", "bit", "millionairemysql"); 
mysql_select_db("word", $db);
mysql_set_charset('utf8');

$lang = mysql_real_escape_string($_GET["language"]);



// Hente ut språk du vil ha json for
$result = mysql_query('SELECT * FROM '.$lang.' ORDER BY word_word ASC');

$wordArray = array();


while ($row = mysql_fetch_array($result)) {
    //echo $row['word_id']." - ".$row['word_word']."<br>";
    
    $newArr = array("i" => (int)$row['word_id'], "w" => strtolower($row['word_word']));
    $wordArray[] = $newArr;
}

if (json_encode($wordArray) != null)
{
    $jsonStuff = json_encode($wordArray);
    echo $jsonStuff;
    $filename = "data/".strtolower($lang).".json";
    $file = fopen($filename,'w+');
    fwrite($file, $jsonStuff);
    fclose($file);
}
else {
    echo "Error";
}

?>