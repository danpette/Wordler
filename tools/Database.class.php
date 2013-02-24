<?phpclass Database {   	protected static $instance;   	private $link;   	private $queries = 0;   	public $error = "";   	   	private function __construct(){ }   	   	public static function getInstance(){	    if (!self::$instance){	        self::$instance = new Database();	        //echo "new instance created<br>";	    } else {	    	//echo "instance allready created<br>";	    }	    return self::$instance;	}		private function connect(){		if($this->link == null){			$this->link = new Mysqli('localhost','bit','millionairemysql','word');	    	if (mysqli_connect_errno()) {				printf("Connect failed: %s\n", mysqli_connect_error()); //Bytt ut med bedre feilmelding				return false;			}			$this->link->set_charset("utf8");			//echo "mysql connected<br>";			return true;		}		return true;	}		public function __clone(){		die(__CLASS__.' cannot be cloned');	}		public function query($query,$args = ""){		$this->connect();	    		//echo "query inited<br>";					if($stmt = $this->link->prepare($query)){								//if not empty args				if(!empty($args)){					$types = '';                    			        foreach($args as $arg) {        			            if(is_int($arg)) {			                $types .= 'i';              			            } elseif (is_float($arg)) {			                $types .= 'd';             			            } elseif (is_string($arg)) {			                $types .= 's';              			            } else {			                $types .= 'b';            			            }			        } 					 					//echo "bind_param string created: ".$types."<br>";        			$bind_names[] = $types;        			        			for ($i=0; $i<count($args);$i++) {//go through incoming params and added em to array			            $bind_name = 'bind' . $i;       //give them an arbitrary name			            $$bind_name = $args[$i];      //add the parameter to the variable variable			            $bind_names[] = &$$bind_name;   //now associate the variable as an element in an array			        }                      //call the function bind_param with dynamic params       				 call_user_func_array(array($stmt,'bind_param'),$bind_names);				}								//end args code								$stmt->execute();							$words = explode(" ", $query);				//print_r($words);								switch($words[0]){					case 'SELECT':						$this->queries++;						//echo "found select query<br>";						if($words[1] == "*"){							//echo "select with * are not supported";							throw new Exception('SELECT WITH * IS NOT SUPPORTED');							return false;						} else {							//echo "This is an SELECT query<br>";							$params = array();							$p = array();							$iteration = 0;							$hasEnded = false;							$special = array('/,/'); 							$lastIterationWasDistinct = false;														foreach($words as $word){								//echo "(raw word: ".$word.")<br>";								$word = trim(preg_replace($special,"",$word));																if($word != "FROM" && $iteration  != 0 && $hasEnded == false){									//echo "added word: ".$word."<br>";																		//If the last word was DISTINCT the next field will be surrounded by (), example (user_id). We do remove those									if($lastIterationWasDistinct){										$word = str_replace(array('(',')'),'', $word);										$lastIterationWasDistinct = false;									}																		//check if word is distinct, if so ignore it									//IMPORTANT:									if($word != 'DISTINCT'){										$params[$word] = &$words[$iteration];									} else {										$lastIterationWasDistinct = true;									}																																				$p[] = $word;								} else if ($word == "FROM"){									$hasEnded = true;									//echo "end initialized<br>";									//echo "found ".count($params) ." result fields<br>";								}								$iteration++;							}															$stmt->store_result();														$return = array();				    		if($stmt->num_rows > 0){				    			call_user_func_array(array($stmt, 'bind_result'), $params);				    			$c = 0;				    			while($stmt->fetch()){				    				foreach($params as $key => $val){				    					// echo "key: ".$key." | value: ".$val."<br>";				    					$return[$c][$key] = $val;				    				}				    				$c++;				    			}				    			//print_r($return);				    			//echo "select ok, returning set";				    			$this->quieries++;				    			return $return;				    		} else {				    		 	//echo "select query returned zero results<br>";				    		 	//echo $this->link->error;				    		 	$this->error = $this->link->error;				    			return false;				    		}														}											break;										case 'DELETE':						if($this->link->affected_rows > 0){							return $this->link->affected_rows;							$this->quieries++;						} else return false;					break;										case 'UPDATE':						if($this->link->affected_rows > 0){							return $this->link->affected_rows;							$this->quieries++;						} else return $this->link->error;					break;										case 'INSERT':						if($this->link->affected_rows > 0){							return $this->link->affected_rows;							$this->quieries++;						} else return false;										break;									}							} else {				//echo  $this->link->error;				return C::E_SQL_PREPARE;			}						} 		public function getQueryCount(){		return $this->queries;	} 		public function getLastInsertID(){		return $this->link->insert_id;	}	}?>