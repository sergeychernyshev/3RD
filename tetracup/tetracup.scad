$fn = 300;

module circular_tetromino(outer_d, num_segments, border) {
	cylinder_circumference = PI * outer_d;
	segment_circumference = cylinder_circumference / num_segments - border;

	difference() {	
		cylinder(d = outer_d, h = segment_circumference);
		color("Red")
			translate([0,0, -segment_circumference / 2])
				cylinder(d = outer_d - border * 2, h = segment_circumference * 2);
	}
}

circular_tetromino(76, 15, 3);
