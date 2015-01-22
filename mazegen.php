<?php
	function permuteNESW($str = '0123'){
	
		if(strlen($str) > 3){
		
			$swap = $str;
		
			for($s = 0; $s < strlen($str) - 1; $s++){
						
				$swap = substr_replace($swap, $swap[$s], $s + 2, 0);
				$swp[] = $swap = substr_replace($swap, "", $s, 1);						
			}	
			
		} else {$swp[] = $str;}
		

		foreach($swp as $str){		
			
			$p = $str.$str;
			
			$mirror = strrev($str);
			$m = $mirror.$mirror;
		
			for($i = 0; $i < strlen($str); $i++){
			
				$permutation[] = substr($p, $i, strlen($str));
				$permutation[] = substr($m, $i, strlen($str));
			}	
		}
		return $permutation;	
	}	
	
	class Coord {
		public $x;
		public $y;
		public function Coord($x, $y){
			$this->x = $x;
			$this->y = $y;
		}
	}
	
	class Cell {
		const NORTH = 0;
		const EAST = 1;
		const SOUTH = 2;
		const WEST = 3;
		static public $width = 50;
		static public $height = 50;
		
		public $x ,$y;
		public $walls = '1111';
		public $visited = false;
		public $extra = "";
		
		public function Cell($x, $y){
			$this->x = $x;
			$this->y = $y;
		}
		
		public function __toString(){
		
			$class = 'cell';
			
			if($this->walls == '1111') {
				$class .=  ' concrete ';
			}
			else {			
				$heading = array(' north ', ' east ', ' south ', ' west ');
				for($h = 0; $h < 4; $h++){			
					$class .= (!$this->walls[$h] ) ? $heading[$h] : "";			
				}
			}			
			return "<div class='{$class} {$this->extra}' style='width:".(self::$width)."px; height:".(self::$height)."px;'></div>";
		}		
	}
	
	class Maze {
		protected $width;
		protected $height;
		protected $grid;
		
		public function Maze() {
			$this->width = rand(10, 20);
			$this->height = rand(10, 20);
			
			for($y = 0; $y < $this->height; $y++){			
				for($x = 0; $x < $this->width; $x++){
					$this->grid[$y][$x] = new Cell($x, $y);
				}
			}
		}
		
		public function build() {
				
			$totalcells = ($this->width * $this->height);
			$visited = 0;
			$cell = $this->grid[rand(0, $this->height -1)][rand(0, $this->width - 1)];
			$cell->extra .= ' entrance ';
			$permutations = permuteNESW();
				
			while($visited < $totalcells) {
				
				if(!$cell->visited){
					$visited++;
					$cell->visited = true;
					$backtrack[] = $cell;
				}
					
				$nesw = $permutations[rand(0, count($permutations) - 1)];
				
				for($i = 0; $i < 4; $i++){
					
					$n = $nesw[$i];					
						
					if(($cell->walls[$n] == 1) && ($neighbor = $this->getCell($cell->x, $cell->y, $n)) && (!$neighbor->visited)){
						$cell->walls[$n] = 0;							
						$neighbor->walls[($n > 1) ? $n-2 : $n+2] = 0;
						$cell = $neighbor;
						break;
					}	
					
				}
				if(!$cell->visited)
					continue;
					
				//$btrk++;
				//$cell = $backtrack[$btrk];
				
				// random backtracking
				$cell = $backtrack[rand(0, count($backtrack) - 1)];
			}
			$cell->extra .= ' exit ';
		}
		
		public function getCell($x, $y, $neighbor = -1) {
			if($x < 0 || $x > $this->width || $y < 0 || $y > $this->height)
				return false;
				
			if($neighbor > -1){
				switch($neighbor){
					case(Cell::NORTH):
						return $this->getCell($x, $y - 1);
						break;
					case(Cell::EAST):
						return $this->getCell($x + 1, $y);
						break;
					case(Cell::SOUTH):
						return $this->getCell($x, $y + 1);	
						break;
					case(Cell::WEST):
						return $this->getCell($x - 1, $y);
						break;
					default:
						return false;
				}
			}
			return $this->grid[$y][$x];
		}
		
		public function display() {
			$w = $this->width * Cell::$width + ($this->width * 2);
			$h = $this->height * Cell::$height + ($this->height * 2);
			echo "<div class='maze' style='width:{$w}px; height:{$h}px;'>";
			foreach($this->grid as $y => $row){
				foreach($row as $x => $cell){
					echo $cell;
				}
			}
			echo "</div>";
		}		
	}
?>