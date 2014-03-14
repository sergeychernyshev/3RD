FOLDER=$(shell pwd)

all: tracelet_from_tetraminos.js.stl

tracelet_from_tetraminos.js.stl:
	(cd ~/AbFab3D/apps/volumesculptor/; ant runShell "-Dscript=$(FOLDER)/tracelet_from_tetraminos.js")
	mv ~/AbFab3D/apps/volumesculptor/tracelet_from_tetraminos.js.stl .

