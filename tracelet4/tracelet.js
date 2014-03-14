function main(args) {
  var width = 68*MM; // width of the wrist
  var oval_distortion = 0.9; // oval shape
  var height = 34*MM; // width of bracelet
  var thickness = 2*MM;
  var bar_width = 3*MM; 
  var num_rows = 5;
  var opening_length = 20*MM;
  var square_side = (
    height - bar_width * (num_rows + 1)
  ) / num_rows;
  var section_size = bar_width + square_side;
  
  // making sure curve length fits perfectly
  var curve_length = width * Math.PI - opening_length;
  var number_of_sections = Math.floor((curve_length - bar_width) / section_size);
  curve_length = section_size * number_of_sections + bar_width;
  
  var voxelSize = 0.1*MM; // point precision

  // positioned around center of coordinates
  var dest = createGrid(
    -width / 2 * 5, width / 2 * 5,
    -height / 2 * 5, height / 2 * 5,
    -width / 2 * 5, width / 2 * 5, // leaving space for original cylinder
    voxelSize
  );
  var bracelet = new Union();
  
  // debug dot in the center of the mode
  // bracelet.add(new Sphere(new Vector3d(0,0,0), 2*MM));
  
  for (var i = 0; i < num_rows + 1; i++) {
    // long bars hugging the wrist
    bracelet.add(new Box(
      0,
      -height / 2 +
       bar_width / 2 +
       i * section_size,
      0,
      curve_length, bar_width, thickness
    ));
    
    // if (i < 1) {
    if (i < num_rows) {
      // bars parallel to fingers
      for (var j = 0; j < number_of_sections + 1; j++) {
        bracelet.add(new Box(
          -curve_length / 2 + j * section_size + bar_width / 2,
          -height / 2 + (i + 0.5) * section_size,
          0,
          bar_width, section_size, thickness
        ));
      }
    }
  }
  
  /*
  var bend = new CompositeTransform();
  bend.add(RingWrap(width / 2));
  bend.add(new Scale(1, 1, oval_distortion));
  
  bracelet.setTransform(bend);
  */
 
  var maker = new GridMaker();
  maker.setSource(bracelet);
  maker.makeGrid(dest);
  return dest;
}
