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
var grid_padding = 1.2;

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
  
	voxelSize = 0.8*MM; // point precision

	// positioned around center of coordinates
	var dest = createGrid(
		-curve_length / 2 * grid_padding, curve_length / 2 * grid_padding,
		-height / 2 * grid_padding, height / 2 * grid_padding,
		-curve_length / 2 * grid_padding, curve_length / 2 * grid_padding,
		voxelSize
	);

	// block of material, bracelet is cut out of
	var block = new Box(0,0,0, curve_length, height, thickness);

	cutOutDesign(block, tracelet_4_design_5x28);
	// cutOutDesign(block, [[0,0,T]]); // single tetramino

	var bracelet = new Union();
	bracelet.add(block);
	
	/*
	var bend = new CompositeTransform();
	bend.add(RingWrap(width / 2));
	bend.add(new Scale(1, 1, oval_distortion));
  
	bracelet.setTransform(bend);
	*/

	// reference point in the center of the model
	// bracelet.add(new Sphere(new Vector3d(0,0,0), 2*MM));
  
	var maker = new GridMaker();
	maker.setSource(bracelet);
	maker.makeGrid(dest);
	return dest;
}

function generateTetramino(squares) {
	
}

// tetraminos are a combination of horizontal and vertical strokes on borders of 4x4 grid surrounding 4 of 16 cells
var Ih = generateTetramino([[0, 0], [1, 0], [2, 0], [3, 0]]); // I horizontal (4-bar)
var Iv = generateTetramino([[0, 0], [0, 1], [0, 2], [0, 3]]); // I vertical (4-bar)

var O  = generateTetramino([[0, 0], [0, 1], [1, 0], [1, 1]]); // O (square)

var S  = generateTetramino([[0, 1], [1, 1], [1, 0], [2, 0]]); // S
var Sv = generateTetramino([[0, 0], [0, 1], [1, 1], [1, 2]]); // S vertical

var Z  = generateTetramino([[0, 0], [1, 0], [1, 1], [2, 1]]); // Z
var Zv = generateTetramino([[1, 0], [1, 1], [0, 1], [0, 2]]); // Z vertical

var L  = generateTetramino([[0, 0], [0, 1], [0, 2], [1, 2]]); // L
var Lx = generateTetramino([[1, 0], [1, 1], [1, 2], [0, 0]]); // L upside-down
var Lu = generateTetramino([[0, 1], [1, 1], [2, 1], [2, 0]]); // L up
var Ld = generateTetramino([[0, 0], [1, 0], [2, 0], [0, 1]]); // L down

var J  = generateTetramino([[1, 0], [1, 1], [1, 2], [0, 2]]); // J
var Jx = generateTetramino([[0, 0], [0, 1], [0, 2], [1, 0]]); // J upside-down
var Ju = generateTetramino([[0, 1], [1, 1], [2, 1], [0, 0]]); // J up
var Jd = generateTetramino([[0, 0], [1, 0], [2, 0], [2, 1]]); // J down

var T  = generateTetramino([[0, 0], [1, 0], [2, 0], [1, 1]]); // T
var Tu = generateTetramino([[0, 1], [1, 1], [2, 1], [1, 0]]); // T upside-down
var Tl = generateTetramino([[0, 0], [0, 1], [0, 2], [1, 1]]); // T left
var Tr = generateTetramino([[1, 0], [1, 1], [1, 2], [0, 1]]); // T right

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