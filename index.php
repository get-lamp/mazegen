<?php
	define(VERSION, "v1.0a");
	
	include('./mazegen.php'); 	
?>
<html>
	<head>
		<title>MAZEGEN <?php echo VERSION;?></title>
		<script src='./js/jquery.js'></script>
		<script src='./js/mazegen.js'></script>
		<link href='./css/maze.css' rel='stylesheet' />
	</head>
	<body>
		<?php 
			$maze = new Maze();
			$maze->build();
			$maze->display();
		?>
	</body>
</html>