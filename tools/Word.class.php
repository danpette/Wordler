<?php
class Word {
    
    public $db;
    
    
    
    
    public function __construct($conn){
        $this->db = $conn;
    }
    
    
    
    
    public function getAllLanguages() {
        $query = 'SELECT lang_id, lang_name FROM Languages';
        $result = $this->db->query($query,array());
        
        if(is_array($result)){
            return $result;
        }
        return C::E_SQL_EMPTY_RESULTSET;
        
    }
    
    public function getLanguageIdFromName($name) {
        $query = 'SELECT DISTINCT lang_id, lang_name FROM Languages WHERE lang_name = ?';
        $result = $this->db->query($query,array($name));
        
        if(is_array($result)){
            return $result[0]['lang_id'];
        }
        // Don't want to return anything above 0.
        return -1;
    }
    
    
    // Get the language (string), for example "English" based on the language ID.
    public function getLanguageFromId($id) {
        // Return the language
        if(is_numeric($id) && $id > 0){
                $query = 'SELECT DISTINCT lang_name FROM Languages WHERE lang_id = ?';
                $result = $this->db->query($query,array($id));
        
            if(is_array($result)){
                return $result[0]['lang_name'];
            }
            return C::E_SQL_EMPTY_RESULTSET;
        }
        return C::E_INPUT_NOT_INT;
    }
    
    
   // Fetch random words from the db
    public function getRandomWords($languageFrom, $languageTo, $amount = 1) {
        // TODO: Check if language exists in db
        // Return the language
        if(is_numeric($languageFrom) && $languageFrom > 0 && is_numeric($languageTo) && $languageTo > 0){

            // TODO: order by RAND() LIMIT 1 is slow for big tables, but quick enough for testing. ;)
            $query = 'SELECT word_id, word_word FROM ' . Word::getLanguageFromId($languageTo) . ' WHERE word_id IS NOT NULL AND word_id IN (SELECT word_id FROM '. Word::getLanguageFromId($languageFrom)  .') order by RAND() LIMIT 4';
            
            $result = $this->db->query($query,array());
            
        
            if(is_array($result)){
                // Lets pick a random value from the array
                $randomWord = $result[array_rand($result, 1)];
                $fromWord = Word::getWord($languageFrom, $randomWord["word_id"]);
                
                
                $newArray = array();
                $newArray[] = array("fromWord" => $fromWord["word_word"]);
                $newArray[] = array("fromId" => $fromWord["word_id"]);
                
                $returnArray = array();
                $returnArray[] = $newArray;
                $returnArray[] = $result;
                
                return $returnArray;
            }
            return C::E_SQL_EMPTY_RESULTSET;
        }
        return C::E_INPUT_NOT_INT;
        
        
        
        
    }
    
    
    public function getTranslateWord($languageId)
    {
        if(is_numeric($languageId) && $languageId > 0)
        {
            $query = 'SELECT DISTINCT word_id, word_word FROM English WHERE word_id NOT IN (SELECT word_id FROM ' . Word::getLanguageFromId($languageId) . ') ORDER BY RAND() LIMIT 1';
            
            $result = $this->db->query($query,array());
            
            if(is_array($result)){
            
                return $result[0];
            }
            return C::E_SQL_EMPTY_RESULTSET;
        }
        return C::E_INPUT_NOT_INT;
            
    }
    
    // Get a specific word from the db.
    public function getWord($languageId, $wordId) {
        //echo "<br>Word id: " . $wordId . " <br>";
        
        
        if(is_numeric($languageId) && $languageId > 0 && is_numeric($wordId) && $wordId > 0){
        
            $query = 'SELECT DISTINCT word_id, word_word FROM ' . Word::getLanguageFromId($languageId) . ' WHERE word_id = ? LIMIT 1';
        
            $result = $this->db->query($query,array($wordId));
        
        
            if(is_array($result)){
        
                return $result[0];
            }
            return C::E_SQL_EMPTY_RESULTSET;
        }
        return C::E_INPUT_NOT_INT;
    }
    
    public function getWordIdFromWord($languageId, $word)
    {
        if(is_numeric($languageId) && $languageId > 0){
        
            $query = 'SELECT DISTINCT word_id, word_word FROM ' . Word::getLanguageFromId($languageId) . ' WHERE word_word = ? LIMIT 1';
        
            $result = $this->db->query($query,array($word));
        
        
            if(is_array($result)){
        
                return $result[0]['word_id'];
            }
            return -1;
        }
        return -1;
    }
    
    
    // TODO: Implement. Add a new language to the database 
    public function addLanguage($name) {
        
        $query = "CREATE TABLE `'.$name.'` (`id` INT, ) ENGINE = InnoDB;";
        
    }
    
    // Function to add words to the database.
    // Can be both a completely new word, or a word connected to another word.
    public function addWord($languageId, $word, $wordId = 0)
    {
        // Kode for å legge til ord
        // Sjekker også om et ord eksisterer allerede og endrer ordet gjennom editWord.
        
        // Gidder ikke ha ord lengre enn 45 bokstaver
        if (is_numeric($languageId) && strlen($word) <= 45 && strlen($word) > 0)
        {
            
            if ($wordId == 0)
            {
                $query = 'INSERT INTO '. Word::getLanguageFromId($languageId).' VALUES( NULL, ? )';
                $result = $this->db->query($query,array($word));              
            } else if (is_numeric($wordId) && $wordId > 0) {
                if (is_array(Word::getWord($languageId, $wordId)))
                {
                    // Word already exists, lets edit it instead of adding a new one :D
                    Word::editWord($languageId, $word, $wordId);
                    return true;
                }
                else 
                {
                    // Add a new word
                    $query = 'INSERT INTO '. Word::getLanguageFromId($languageId).' VALUES( ?, ? )';
                    $result = $this->db->query($query,array($wordId, $word));
                }
            }

            
            //debug
            //echo $query . " " . $result . "<br>";
            
        }
        	
        if ($result == 1) {
            return true;
        }
        return C::E_SQL_INSERT;
    }
    
    // Function to edit an already existing word. For example if there's a mismatch between words or a spelling mistake.
    public function editWord($languageId, $word, $wordId) {
        // Kode for å endre et allerede eksisterende ord
        if (is_numeric($languageId) && strlen($word) <= 45 && strlen($word) > 0)
        {
            $query = 'UPDATE '. Word::getLanguageFromId($languageId).' SET word_word = ? WHERE word_id = ?';
            $result = $this->db->query($query,array($word, $wordId));
            if ($result == 1) {
                return C::SUCCESS;
            }
            
            return C::E_SQL_UPDATE;
        }
        return C::E_INPUT_NOT_INT;
    }
    
    // TODO: Implement
    // Function to delete a word from the database.
    public function deleteWord($languageId, $wordId) {
        // Kode for å endre et allerede eksisterende ord
    
    }
    
}