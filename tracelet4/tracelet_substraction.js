var width;
var oval_distortion;
var height;
var thickness;
var bar_width;
var opening_length;
var square_side;
var section_size;
var curve_length;
var voxelSize;
var grid_padding;
var design_width_tiles;
var design_length_tiles;

var Ih, Iv, O, S, Sv, Z, Zv, L, Lx, Lu, Ld, J, Jx, Ju, Jd, T, Tu, Tl, Tr;

var tetraminos;

var tracelet_4_design_5x28;

function main(args) {
	init();

	// positioned around center of coordinates
	var dest = createGrid(
		-curve_length / 2 * grid_padding, curve_length / 4 * grid_padding,
		-height / 2 * grid_padding, height / 2 * grid_padding,
		-curve_length / 2 * grid_padding, curve_length / 4 * grid_padding,
		voxelSize
		);

	// block of material, bracelet is cut out of
	var bracelet = new Box(0,0, 0, curve_length, height, thickness);

	//	var design = [[0,0,Lu]];
	var design = tracelet_4_design_5x28;
	var design_elements_num = design.length;

	var cutOuts = new Union();

	for (var i = 0; i < design_elements_num; i++) {
		var cutOut = new DataTransformer();
		cutOut.setSource(design[i][2]);

		// move cut-out to appropriate location
		cutOut.setTransform(new Translation(
			section_size * design[i][0] - curve_length / 2 + bar_width,
			section_size * design[i][1] - height / 2 + bar_width,
			0));

		cutOuts.add(cutOut);
	}

	bracelet = new Subtraction(bracelet, cutOuts);

	var bend = new CompositeTransform();
	bend.add(RingWrap(width / 2));
	bend.add(new Scale(1, 1, oval_distortion));

	bracelet.setTransform(bend);

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
					square_side,
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
					square_side,
					square_side,
					thickness * 2
					));
			}
		}
	}

	return tetramino;
}

function init() {
	grid_padding = 1.1;
	width = 68*MM; // width of the wrist
	oval_distortion = 0.9; // oval shape
	thickness = 3*MM;
	bar_width = 3*MM;
	opening_length = 20*MM;

	design_width_tiles = 5;
	design_length_tiles = 28;

	// making sure curve length fits perfectly
	curve_length = width * Math.PI - opening_length;
	square_side = (curve_length - bar_width * (design_length_tiles + 1)) / design_length_tiles;
	section_size = bar_width + square_side;
	height = design_width_tiles * section_size + bar_width; // width of bracelet

	voxelSize = 0.8*MM; // point precision

	debug("curve_length: " + curve_length / MM);
	debug("square_side: " + square_side / MM);
	debug("height: " + height / MM);

	// tetraminos are a combination of horizontal and vertical boxes
	// occupying several squares on the 4x4 grid and spaces between them
	//
	// sculpting them square by square produces too many artifacts
	// so we need to minimize the primitives
	Ih = new Box((4 * section_size - bar_width) / 2, square_side / 2, 0,
		4 * section_size - bar_width, square_side, thickness * 2); // I horizontal (4-bar)
	Iv = new Box(square_side / 2, (4 * section_size - bar_width) / 2, 0,
		square_side, 4 * section_size - bar_width, thickness * 2); // I vertical (4-bar)

	O = new Box((2 * section_size - bar_width) / 2, (2 * section_size - bar_width) / 2, 0,
		(2 * section_size - bar_width),	2 * section_size - bar_width, thickness * 2); // O (square)

	S  = new Union(); // S
	S.add(new Box(
		square_side / 2 + section_size, section_size - bar_width / 2, 0,
		square_side, 2 * section_size - bar_width, thickness * 2
		)); //  |
	S.add(new Box(
		(2 * section_size - bar_width) / 2 + section_size, square_side / 2, 0,
		2 * section_size - bar_width, square_side, thickness * 2
		)); // -
	S.add(new Box(
		(2 * section_size - bar_width) / 2, square_side / 2 + section_size, 0,
		2 * section_size - bar_width, square_side, thickness * 2
		)); //    _

	Sv = new Union(); // Sv
	Sv.add(new Box(
		section_size - bar_width / 2, square_side / 2 + section_size, 0,
		2 * section_size - bar_width, square_side, thickness * 2
		)); // --
	Sv.add(new Box(
		square_side / 2 + section_size, (2 * section_size - bar_width) / 2 + section_size, 0,
		square_side, 2 * section_size - bar_width, thickness * 2
		)); //  !
	Sv.add(new Box(
		square_side / 2, (2 * section_size - bar_width) / 2, 0,
		square_side, 2 * section_size - bar_width, thickness * 2
		)); // i

	Z = new Union(); // Z
	Z.add(new Box(
		square_side / 2 + section_size, section_size - bar_width / 2, 0,
		square_side, 2 * section_size - bar_width, thickness * 2
		)); //  |
	Z.add(new Box(
		(2 * section_size - bar_width) / 2, square_side / 2, 0,
		2 * section_size - bar_width, square_side, thickness * 2
		)); //    -
	Z.add(new Box(
		(2 * section_size - bar_width) / 2 + section_size, square_side / 2 + section_size, 0,
		2 * section_size - bar_width, square_side, thickness * 2
		)); // _

	Zv = new Union(); // Zv
	Zv.add(new Box(
		section_size - bar_width / 2, square_side / 2 + section_size, 0,
		2 * section_size - bar_width, square_side, thickness * 2
		)); // --
	Zv.add(new Box(
		square_side / 2, (2 * section_size - bar_width) / 2 + section_size, 0,
		square_side, 2 * section_size - bar_width, thickness * 2
		)); //  !
	Zv.add(new Box(
		square_side / 2 + section_size, (2 * section_size - bar_width) / 2, 0,
		square_side, 2 * section_size - bar_width, thickness * 2
		)); // i

	L = new Union(); // L
	L.add(new Box(
		square_side / 2, (3 * section_size - bar_width) / 2, 0,
		square_side, 3 * section_size - bar_width, thickness * 2
		)); // |
	L.add(new Box(
		(2 * section_size - bar_width) / 2, square_side / 2 + section_size * 2, 0,
		2 * section_size - bar_width, square_side, thickness * 2
		)); // __

	Lx = new Union(); // L
	Lx.add(new Box(
		square_side / 2 + section_size, (3 * section_size - bar_width) / 2, 0,
		square_side, 3 * section_size - bar_width, thickness * 2
		)); // |
	Lx.add(new Box(
		(2 * section_size - bar_width) / 2, square_side / 2, 0,
		2 * section_size - bar_width, square_side, thickness * 2
		)); // __

	Lu = new Union(); // Lu
	Lu.add(new Box(
		(3 * section_size - bar_width) / 2, square_side / 2 + section_size, 0,
		3 * section_size - bar_width, square_side, thickness * 2
		)); // ---
	Lu.add(new Box(
		square_side / 2 + section_size * 2, (2 * section_size - bar_width) / 2, 0,
		square_side, 2 * section_size - bar_width, thickness * 2
		)); //  !

	Ld = new Union(); // Lu
	Ld.add(new Box(
		(3 * section_size - bar_width) / 2, square_side / 2, 0,
		3 * section_size - bar_width, square_side, thickness * 2
		)); // ---
	Ld.add(new Box(
		square_side / 2, (2 * section_size - bar_width) / 2, 0,
		square_side, 2 * section_size - bar_width, thickness * 2
		)); //  !

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