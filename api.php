<?php
/*
$english = array('languge' => 'english', id => 1);
$english[1] = array('w' => 'house');
$english[2] = array('w' => 'sentence');
$english[3] = array('w' => 'world');

$spanish = array('languge' => 'spanish', id => 2);
$spanish[1] = array('w' => 'casa');
$spanish[2] = array('w' => 'sentencia');
$spanish[3] = array('w' => 'monde');
*/
$dictionary = array();
$dictionary[1] = array('f' => 'house', 't' => 'case');
$dictionary[2] = array('f' => 'sentence', 't' => 'sentencia');
$dictionary[3] = array('f' => 'mountain', 't' => 'montano');

$data = array('from_lang' => 'english', 'to_lang' => 'spanish', 'table' => $dictionary);

echo json_encode($data);

echo '<hr />';

$english = array();

$english[1] = 'house';
$english[2] = 'sentence';
$english[3] = 'mountain';

echo json_encode($english);
?>