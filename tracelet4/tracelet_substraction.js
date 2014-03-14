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
var grid_padding;

var Ih, Iv, O, S, Sv, Z, Zv, L, Lx, Lu, Ld, J, Jx, Ju, Jd, T, Tu, Tl, Tr;

var tetraminos;

var tracelet_4_design_5x28;

function main(args) {
	init();

	// positioned around center of coordinates
	var dest = createGrid(
		-curve_length / 2 * grid_padding, curve_length / 2 * grid_padding,
		-height / 2 * grid_padding, height / 2 * grid_padding,
		-curve_length / 2 * grid_padding, curve_length / 2 * grid_padding,
		voxelSize
		);

	// block of material, bracelet is cut out of
	var block = new Box(0,0,0, curve_length, height, thickness);

	var bracelet = block;

	var design = tracelet_4_design_5x28;
	var design_elements_num = design.length;

	for (var i = 0; i < design_elements_num; i++) {
		var cutOut = new DataTransformer();
		cutOut.setSource(design[i][2]);

		// move cut-out to appropriate location
		cutOut.setTransform(new Translation(
			section_size * design[i][0] - curve_length / 2 + bar_width,
			section_size * design[i][1] - height / 2 + bar_width,
			0));

		bracelet = new Subtraction(bracelet, cutOut);
	}

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

function debug(message) {
	print('[DEBUG] ' + message.toString());
}

function generateTetramino(squares) {
	var tetramino = new Union();

	for (var i = 0; i < squares.length; i++) {
		var square = new Box(
			(squares[i][0] + 0.5) * section_size - bar_width / 2,
			(squares[i][1] + 0.5) * section_size - bar_width / 2,
			0,
			square_side,
			square_side,
			thickness * 2
			);
		tetramino.add(square);

		// now we need to add borders for this square
		for (var j = 0; j < squares.length; j++) {
			// same X
			if (squares[i][0] == squares[j][0] && squares[i][1] - squares[j][1] == 1) {
				// TODO draw line under
				tetramino.add(new Box(
					(squares[i][0] + 0.5) * section_size - bar_width / 2,
					(squares[i][1] + 0.5) * section_size - bar_width / 2 - square_side + bar_width / 2, // one below
					0,
					square_side,
					bar_width,
					thickness * 2
					));
			}

			// same Y
			if (squares[i][1] == squares[j][1] && squares[i][0] - squares[j][0] == 1) {
				// TODO draw line on the left
				tetramino.add(new Box(
					(squares[i][0] + 0.5) * section_size - bar_width / 2 - square_side + bar_width / 2,  // one on the left
					(squares[i][1] + 0.5) * section_size - bar_width / 2,
					0,
					bar_width,
					square_side,
					thickness * 2
					));
			}
		}
	}

	return tetramino;
}

function init() {
	grid_padding = 1.5;
	width = 68*MM; // width of the wrist
	oval_distortion = 0.9; // oval shape
	height = 35*MM; // width of bracelet
	thickness = 2*MM;
	bar_width = 2*MM;
	num_rows = 5;
	opening_length = 20*MM;
	square_side = (height - bar_width * (num_rows + 1)) / num_rows;
	section_size = bar_width + square_side;

	// making sure curve length fits perfectly
	// TODO calculate width and height out of design parameters and wrist and opening sizes
	curve_length = width * Math.PI - opening_length;
	number_of_sections = Math.floor((curve_length - bar_width) / section_size);
	debug(number_of_sections);
	curve_length = section_size * number_of_sections + bar_width;

	voxelSize = 0.4*MM; // point precision

	// tetraminos are a combination of horizontal and vertical strokes on borders of 4x4 grid surrounding 4 of 16 cells
//	Ih = generateTetramino([[0, 0], [1, 0], [2, 0], [3, 0]]); // I horizontal (4-bar)
	Ih = new Box(	(4 * section_size - bar_width) / 2,	square_side / 2,	0,
					4 * section_size - bar_width,		square_side,		thickness * 2); // I horizontal (4-bar)
	Iv = generateTetramino([[0, 0], [0, 1], [0, 2], [0, 3]]); // I vertical (4-bar)

	O  = new Box(	(2 * section_size - bar_width) / 2,	(2 * section_size - bar_width) / 2,	0,
					(2 * section_size - bar_width),		2 * section_size - bar_width,		thickness * 2); // O (square)

	S  = generateTetramino([[0, 1], [1, 1], [1, 0], [2, 0]]); // S
	Sv = generateTetramino([[0, 0], [0, 1], [1, 1], [1, 2]]); // S vertical

	Z  = generateTetramino([[0, 0], [1, 0], [1, 1], [2, 1]]); // Z
	Zv = generateTetramino([[1, 0], [1, 1], [0, 1], [0, 2]]); // Z vertical

	L  = generateTetramino([[0, 0], [0, 1], [0, 2], [1, 2]]); // L
	Lx = generateTetramino([[1, 0], [1, 1], [1, 2], [0, 0]]); // L upside-down
	Lu = generateTetramino([[0, 1], [1, 1], [2, 1], [2, 0]]); // L up
	Ld = generateTetramino([[0, 0], [1, 0], [2, 0], [0, 1]]); // L down

	J  = generateTetramino([[1, 0], [1, 1], [1, 2], [0, 2]]); // J
	Jx = generateTetramino([[0, 0], [0, 1], [0, 2], [1, 0]]); // J upside-down
	Ju = generateTetramino([[0, 1], [1, 1], [2, 1], [0, 0]]); // J up
	Jd = generateTetramino([[0, 0], [1, 0], [2, 0], [2, 1]]); // J down

	T  = generateTetramino([[0, 0], [1, 0], [2, 0], [1, 1]]); // T
	Tu = generateTetramino([[0, 1], [1, 1], [2, 1], [1, 0]]); // T upside-down
	Tl = generateTetramino([[0, 0], [0, 1], [0, 2], [1, 1]]); // T left
	Tr = generateTetramino([[1, 0], [1, 1], [1, 2], [0, 1]]); // T right

	tetraminos = [
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

	tracelet_4_design_5x28 = [
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
}