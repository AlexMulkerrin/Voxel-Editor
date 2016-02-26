function random(integer) {
    return Math.floor(Math.random() * integer);
}

function create3DArray(width, height, depth, initialValue) {
	result = [];
	for (var i=0; i<width; i++) {
		result[i] = [];
		for (var j=0; j<height; j++) {
				result[i][j] = [];
			for (var k=0; k<depth; k++) {
				result[i][j][k] = initialValue;
			}
		}
	}
	return result;
}

function colourComponents(colour) {
	var components=[], string;
	for (var i=0; i<3; i++) {
		// "#rrggbb"
		string = colour[1+i*2]+colour[2+i*2];
		components[i]=parseInt(string,16);
	}
	return components;
}

function toRGBString(red, green, blue) {
    var colourString = '#';
    if (red < 16) colourString += '0';
    colourString += red.toString(16);
    if (green < 16) colourString += '0';
    colourString += green.toString(16);
    if (blue < 16) colourString += '0';
    colourString += blue.toString(16);
    return colourString;
}

function getIDfromSymbol(symbol) {
	switch (symbol) {
		case "A":
			return 0;
		case "B":
			return 1;
		case "C":
			return 2;
		case "D":
			return 3;
		case "E":
			return 4;
		case "F":
			return 5;
		case "G":
			return 6;
		case "H":
			return 7;
	}
}

function getFileNameExtension(fileName) {
	return extension = fileName.split(".").pop();

}
