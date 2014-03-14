function main(args) {
	var block = new Box(0,0,0,20*MM,20*MM,5*MM);
	var cut_out = new Box(0,0,0,10*MM,10*MM,10*MM);

	var cut1 = new DataTransformer();
	cut1.setSource(cut_out);
	cut1.setTransform(new Translation(-10*MM,0,0));

	var result = new Subtraction(new Subtraction(block, cut_out), cut1);

	var dest = createGrid(
		-12*MM, +12*MM,
		-12*MM, +12*MM,
		-6*MM, +6*MM,
		0.1*MM
	);

	var maker = new GridMaker();
	maker.setSource(result);
	maker.makeGrid(dest);
	return dest;
}