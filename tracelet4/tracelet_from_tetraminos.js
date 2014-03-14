var width;
var oval_distortion;
var height;
var thickness;
var bar_width;
var num_rows;
var opening_length;
var square_side;
var section_size;
var curve_length;
var number_of_sections;
var voxelSize;

function main(args) {
	width = 68*MM; // width of the wrist
	oval_distortion = 0.9; // oval shape
	height = 34*MM; // width of bracelet
	thickness = 2*MM;
	bar_width = 2*MM;
	num_rows = 5;
	opening_length = 20*MM;
	square_side = (
		height - bar_width * (num_rows + 1)
		) / num_rows;
	section_size = bar_width + square_side;

	// making sure curve length fits perfectly
	curve_length = width * Math.PI - opening_length;
	number_of_sections = Math.floor((curve_length - bar_width) / section_size);
	curve_length = section_size * number_of_sections + bar_width;

	voxelSize = 1*MM; // point precision

	// positioned around center of coordinates
	var dest = createGrid(
		-width / 2 * 3.5, width / 2 * 3.5,
		-height / 2 * 3.5, height / 2 * 3.5,
		-width / 2 * 3.5, width / 2 * 3.5, // leaving space for original cylinder
		voxelSize
		);
	var bracelet = new Union();

	// debug dot in the center of the mode
	// bracelet.add(new Sphere(new Vector3d(0,0,0), 2*MM));

	render_strokes(bracelet, traceDesign(tracelet_4_design_5x28));
	// render_strokes(bracelet, traceDesign([[0,0,T]]));

	var bend = new CompositeTransform();
	bend.add(RingWrap(width / 2));
	bend.add(new Scale(1, 1, oval_distortion));

	bracelet.setTransform(bend);

	var maker = new GridMaker();
	maker.setSource(bracelet);
	maker.makeGrid(dest);
	return dest;
}

// cells is an array of 4 (hence tetramino) elements that are themselves an array of x and y coordinate on 4x4 grid
function generateTetraminoStrokes(cells) {
	// horizontal strokes (4x5 array)
	var horizontal = [[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0]];

	// horizontal strokes (4x5 array)
	var vertical   = [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]];

	for (var i = 0; i < 4; i++) {
		var x = cells[i][0];
		var y = cells[i][1];

		//console.log("x: " + x + "; y: " + y);

		// horizontal strokes
		horizontal[x][y]++; // top border
		horizontal[x][y+1]++; // bottom border

		// vertical strokes
		vertical[x][y]++; // left border
		vertical[x+1][y]++; // right border
	}

	// now make all duplicate borders disappear to only draw a perimiter

	// horizontal
	for (var x=0; x < 4; x++) {
		for (var y=0; y < 5; y++) {
			if (horizontal[x][y] > 1) {
				horizontal[x][y] = 0;
			}
		}
	}

	// vertical
	for (var x=0; x < 4; x++) {
		for (var y=0; y < 5; y++) {
			if (vertical[x][y] > 1) {
				vertical[x][y] = 0;
			}
		}
	}

	return [horizontal, vertical];
}

// tetraminos are a combination of horizontal and vertical strokes on borders of 4x4 grid surrounding 4 of 16 cells
var Ih = generateTetraminoStrokes([[0, 0], [1, 0], [2, 0], [3, 0]]); // I horizontal (4-bar)
var Iv = generateTetraminoStrokes([[0, 0], [0, 1], [0, 2], [0, 3]]); // I vertical (4-bar)

var O  = generateTetraminoStrokes([[0, 0], [0, 1], [1, 0], [1, 1]]); // O (square)

var S  = generateTetraminoStrokes([[0, 1], [1, 1], [1, 0], [2, 0]]); // S
var Sv = generateTetraminoStrokes([[0, 0], [0, 1], [1, 1], [1, 2]]); // S vertical

var Z  = generateTetraminoStrokes([[0, 0], [1, 0], [1, 1], [2, 1]]); // Z
var Zv = generateTetraminoStrokes([[1, 0], [1, 1], [0, 1], [0, 2]]); // Z vertical

var L  = generateTetraminoStrokes([[0, 0], [0, 1], [0, 2], [1, 2]]); // L
var Lx = generateTetraminoStrokes([[1, 0], [1, 1], [1, 2], [0, 0]]); // L upside-down
var Lu = generateTetraminoStrokes([[0, 1], [1, 1], [2, 1], [2, 0]]); // L up
var Ld = generateTetraminoStrokes([[0, 0], [1, 0], [2, 0], [0, 1]]); // L down

var J  = generateTetraminoStrokes([[1, 0], [1, 1], [1, 2], [0, 2]]); // J
var Jx = generateTetraminoStrokes([[0, 0], [0, 1], [0, 2], [1, 0]]); // J upside-down
var Ju = generateTetraminoStrokes([[0, 1], [1, 1], [2, 1], [0, 0]]); // J up
var Jd = generateTetraminoStrokes([[0, 0], [1, 0], [2, 0], [2, 1]]); // J down

var T  = generateTetraminoStrokes([[0, 0], [1, 0], [2, 0], [1, 1]]); // T
var Tu = generateTetraminoStrokes([[0, 1], [1, 1], [2, 1], [1, 0]]); // T upside-down
var Tl = generateTetraminoStrokes([[0, 0], [0, 1], [0, 2], [1, 1]]); // T left
var Tr = generateTetraminoStrokes([[1, 0], [1, 1], [1, 2], [0, 1]]); // T right

var tetraminos = [
['I horizontal (4-bar)', 'Ih', Ih],
['I vertical (4-bar)', 'Iv', Iv],
['O (square)', 'O', O],
['S', 'S', S],
['S vertical', 'Sv', Sv],
['Z', 'Z', Z],
['Z vertical', 'Z', Zv],
['L', 'L', L],
['L upside-down', 'Lx', Lx],
['L up', 'Lu', Lu],
['L down', 'Ld', Ld],
['J', 'J', J],
['J upside-down', 'Jx', Jx],
['J up', 'Ju', Ju],
['J down', 'Jd', Jd],
['T', 'T', T],
['T upside-down', 'Tu', Tu],
['T left', 'Tl', Tl],
['T right', 'Tr', Tr]
];

/*
 * Returns a pair of two-dimensional arrays for horizontal and vertical strokes based on provided design
 */
function traceDesign(design) {
	var strokes = [
	[], // horizontal
	[], // vertical
	];

	for(var i = 0; i < design.length; i++) {
		var position = design[i];

		// console.log(position);

		var origin_x = position[0];
		var origin_y = position[1];

		var horizontal = position[2][0];
		var vertical = position[2][1];

		// horizontal
		for (var x=0; x < 4; x++) {
			for (var y=0; y < 5; y++) {
				if (!(strokes[0][origin_x + x] instanceof Array)) {
					strokes[0][origin_x + x] = [];
				}
				if (!(strokes[0][origin_x + x][origin_y + y])) {
					strokes[0][origin_x + x][origin_y + y] = 0;
				}

				strokes[0][origin_x + x][origin_y + y] += horizontal[x][y];
			}
		}

		// vertical
		for (var x=0; x < 5; x++) {
			for (var y=0; y < 4; y++) {
				if (!(strokes[1][origin_x + x] instanceof Array)) {
					strokes[1][origin_x + x] = [];
				}
				if (!(strokes[1][origin_x + x][origin_y + y])) {
					strokes[1][origin_x + x][origin_y + y] = 0;
				}

				strokes[1][origin_x + x][origin_y + y] += vertical[x][y];
			}
		}
	}

	// console.log(strokes);

	// horizontal
	for (var x=0; x < strokes[0].length; x++) {
		if (!(strokes[0][x] instanceof Array)) {
			strokes[0][x] = [];
		}

		for (var y=0; y < strokes[0][x].length; y++) {
			if (strokes[0][x][y] > 1) {
				strokes[0][x][y] = 1;
			}
		}
	}

	// vertical
	for (var x=0; x < strokes[1].length; x++) {
		if (!(strokes[1][x] instanceof Array)) {
			strokes[1][x] = [];
		}

		for (var y=0; y < strokes[1][x].length; y++) {
			if (strokes[1][x][y] > 1) {
				strokes[1][x][y] = 1;
			}
		}
	}

	return strokes;
}

function render_strokes(bracelet, strokes) {
	var horizontal_strokes = strokes[0];
	var vertical_strokes = strokes[1];

	var grid_size = get_grid_width_size(strokes);
	var grid_width = grid_size[0];
	var grid_height = grid_size[1];

	// horizontal
	for (var x=0; x < horizontal_strokes.length; x++) {
		for (var y=0; y < horizontal_strokes[x].length; y++) {
			if (horizontal_strokes[x][y] > 0) {
				bracelet.add(new Box(
					-curve_length / 2 + (x + 0.5) * section_size + bar_width / 2,
					-height / 2 + y * section_size,
					0,
					section_size + bar_width, bar_width, thickness
					));
			}
		}
	}

	// vertical
	for (var x=0; x < vertical_strokes.length; x++) {
		for (var y=0; y < vertical_strokes[x].length; y++) {
			if (vertical_strokes[x][y] > 0) {
				bracelet.add(new Box(
					-curve_length / 2 + x * section_size + bar_width / 2,
					-height / 2 + (y + 0.5) * section_size,
					0,
					bar_width, section_size + bar_width, thickness
					));
			}
		}
	}
}

function get_grid_width_size(strokes) {
	var horizontal_strokes = strokes[0];
	var vertical_strokes = strokes[1];

	var grid_width = 0;
	var grid_height = 0;

	if (horizontal_strokes.length > grid_width) {
		grid_width = horizontal_strokes.length;
	}

	for (var x=0; x < horizontal_strokes.length; x++) {
		if (horizontal_strokes[x].length - 1 > grid_height) {
			grid_height = horizontal_strokes[x].length - 1;
		}
	}

	if (vertical_strokes.length - 1 > grid_width) {
		grid_width = vertical_strokes.length - 1;
	}

	for (var x=0; x < vertical_strokes.length; x++) {
		if (vertical_strokes[x].length > grid_height) {
			grid_height = vertical_strokes[x].length;
		}
	}

	return [grid_width, grid_height];
}

function display_strokes(table, strokes) {
	var horizontal_strokes = strokes[0];
	var vertical_strokes = strokes[1];

	var grid_size = get_grid_width_size(strokes);
	var grid_width = grid_size[0];
	var grid_height = grid_size[1];

	var tds = [];

	//	console.log("grid_width: " + grid_width + "; grid_height: " + grid_height);
	for(var y = 0; y < grid_height; y++) {
		var tr = $('<tr></tr>');
		for (var x = 0; x < grid_width; x++) {
			var td = $('<td></td>');
			tr.append(td);

			if (!(tds[x] instanceof Array)) {
				tds[x] = [];
			}

			tds[x][y] = td;
		}
		table.append(tr);
	}

	// now, setting borders on all the TDs

	// horizontal
	for (var x=0; x < horizontal_strokes.length; x++) {
		for (var y=0; y < horizontal_strokes[x].length; y++) {
			if (horizontal_strokes[x][y] > 0) {
				if (y > 0) {
					tds[x][y - 1].css('border-bottom', '2px solid red');
				} else {
					tds[x][y].css('border-top', '2px solid red');
				}
			}
		}
	}

	// vertical
	for (var x=0; x < vertical_strokes.length; x++) {
		for (var y=0; y < vertical_strokes[x].length; y++) {
			if (vertical_strokes[x][y] > 0) {
				if (x > 0) {
					tds[x - 1][y].css('border-right', '2px solid red');
				} else {
					tds[x][y].css('border-left', '2px solid red');
				}
			}
		}
	}
}

var tracelet_4_design_5x28 = [
[0, 0, Ld],  [0, 1, Tr],  [0, 3, Ju],
[2, 0, Zv],  [2, 2, Tu],  [3, 3, Lu],
[4, 0, L],   [5, 0, O],   [6, 2, Jx],
[7, 0, Sv],  [7, 3, O],   [8, 0, T],
[9, 2, Tl],  [10, 1, Sv], [10, 4, Ih],
[11, 0, Ju], [12, 0, Ih], [12, 2, O],
[14, 1, O],  [14, 3, Ju], [15, 3, Jd],
[16, 0, Jx], [17, 0, Zv], [18, 2, L],
[19, 0, Jd], [19, 1, Z],  [19, 2, Sv],
[21, 3, O],  [22, 0, Jx], [23, 0, S],
[23, 2, T],  [23, 3, Ju], [25, 0, S],
[25, 3, Z],  [26, 1, Tr]
];

function display_design() {
	var table_container = $('#tables');
	var table;

	// testing the design
	table_container.append($('<h1>Design<h1/>'));

	table = $('<table>');
	table_container.append(table);

	display_strokes(table, traceDesign(tracelet_4_design_5x28));

	// testing the tetraminos
	table_container.append($('<h1>Tetraminos<h1/>'));

	for (var i = 0; i < tetraminos.length; i++) {
		table_container.append($('<h2>' + tetraminos[i][0] + ' (' + tetraminos[i][1] + ')' + '<h2/>'));

		table = $('<table>');
		table_container.append(table);

		display_strokes(table, tetraminos[i][2]);
	}
}