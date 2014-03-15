FOLDER=$(shell pwd)

all: tracelet_substraction.js.stl

tracelet_substraction.js.stl: tracelet_substraction.js
	(cd ~/AbFab3D/apps/volumesculptor/; ant runShell "-Dscript=$(FOLDER)/tracelet_substraction.js")
	mv ~/AbFab3D/apps/volumesculptor/tracelet_substraction.js.stl .
	open tracelet_substraction.js.stl

tracelet_from_tetraminos.js.stl: tracelet_from_tetraminos.js
	(cd ~/AbFab3D/apps/volumesculptor/; ant runShell "-Dscript=$(FOLDER)/tracelet_from_tetraminos.js")
	mv ~/AbFab3D/apps/volumesculptor/tracelet_from_tetraminos.js.stl .
	open tracelet_from_tetraminos.js.stl

sandbox: sandbox.js.stl
sandbox.js.stl: sandbox.js
	time (cd ~/AbFab3D/apps/volumesculptor/; ant runShell "-Dscript=$(FOLDER)/sandbox.js")
	mv ~/AbFab3D/apps/volumesculptor/sandbox.js.stl .
	open sandbox.js.stl

clean:
	rm *.stl
