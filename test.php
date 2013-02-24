<?php 
$db=mysql_connect("localhost", "bit", "millionairemysql");
mysql_select_db("word", $db);
mysql_set_charset('utf8');

// Only words not yet translated
//$sql = "SELECT English.word_word FROM English WHERE English.word_id NOT IN (SELECT word_id FROM Norwegian)";

// All words
$sql = "SELECT English.word_word FROM English";

$result = mysql_query($sql);

while ($row = mysql_fetch_array($result)) {
    echo $row['word_word']."<br>";
}

?>