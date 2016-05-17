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

function colourBlend(colour1, colour2) {
	var components1=[];
	components1 = colourComponents(colour1);
	var components2=[];
	components2 = colourComponents(colour2);
	for (var i=0; i<components1.length; i++) {
		components1[i] = Math.floor((components1[i]+components2[i])/2);
	}
	return toRGBString(components1[0],components1[1],components1[2]);
}

function getSymbolList(length) {
	var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v','w', 'x', 'y', 'z'];
	var nextSymbol;
	var resultList = [];
	for (var i=0; i<length; i++) {
		if (i>=letters.length) {
			var index = Math.floor(i/letters.length) - 1;
			nextSymbol = letters[index].toUpperCase();
			nextSymbol += letters[i % letters.length];
		} else {
		 nextSymbol = letters[i].toUpperCase();
	 	}
		resultList.push(nextSymbol);
	}
	return resultList;
}

function getFileNameExtension(fileName) {
	return extension = fileName.split(".").pop();
}
