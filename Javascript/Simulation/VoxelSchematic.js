function VoxelSchematic(width, height, depth) {
  this.fileName = "schematic";
  this.width = width;
  this.height = height;
  this.depth = depth;
  this.palette = creativePalette();

  this.block = create3DArray(width, height, depth, 0);
  this.visible = create3DArray(width, height, depth, false);
}
VoxelSchematic.prototype.randomise = function() {
  for (var i=0; i<this.width; i++) {
    for (var j=0; j<this.height; j++) {
      for (var k=0; k<this.depth; k++) {
        this.block[i][j][k] = random(this.palette.length);
      }
    }
  }
  this.checkVisible();
}
VoxelSchematic.prototype.clear = function() {
  for (var i=0; i<this.width; i++) {
    for (var j=0; j<this.height; j++) {
      for (var k=0; k<this.depth; k++) {
        this.block[i][j][k] = 0;
      }
    }
  }
  this.checkVisible();
}

VoxelSchematic.prototype.extendPalette = function() {
	var index = this.palette.length;
	var newEntry = {name:"block #"+index, material:"wood", colour:"#ffffd1", model:"solid", texture:"planks", customColour:true};
	this.palette.push(newEntry);
}

VoxelSchematic.prototype.removePaletteEntry = function(id) {
	this.palette.splice(id, 1);
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			for (var k=0; k<this.depth; k++) {
				if (this.block[i][j][k] === id) {
					this.block[i][j][k]=0
				} else if ( this.block[i][j][k] > id) {
					this.block[i][j][k]--;
				}
			}
		}
	}

	//var index = this.palette.length;
	//var newEntry = {name:"block #"+index, material:"solid", colour:"#ff00ff"};
	//this.palette.push(newEntry);
}

VoxelSchematic.prototype.changeSize = function(deltaX, deltaY, deltaZ) {
	var offsetX = Math.floor(deltaX/2);
	var newWidth = this.width + deltaX;
	if (newWidth === 0) newWidth = 1;

	var offsetY = Math.floor(deltaY/2);
	var newHeight = this.height + deltaY;
	if (newHeight === 0) newHeight = 1;

	var offsetZ = Math.floor(deltaZ/2);
	var newDepth = this.depth + deltaZ;
	if (newDepth === 0) newDepth = 1;

	var newBlock = create3DArray(newWidth, newHeight, newDepth, 0);
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			for (var k=0; k<this.depth; k++) {
				newBlock[i+offsetX][j+offsetY][k+offsetZ] = this.block[i][j][k];
			}
		}
	}
	this.width = newWidth;
	this.height = newHeight;
	this.depth = newDepth;
	this.block = newBlock;

	this.visible = create3DArray(this.width, this.height, this.depth, false);
	this.checkVisible();

}

VoxelSchematic.prototype.decreaseSize = function(deltaX, deltaY, deltaZ) {
	var offsetX = Math.floor(deltaX/2);
	this.width = this.width - deltaX;
	if (this.width <= 0) {
		this.width = 1;
		offsetX = 0;
	}

	var offsetY = Math.floor(deltaY/2);
	this.height = this.height - deltaY;
	if (this.height <= 0) {
		this.height = 1;
		offsetY = 0;
	}

	var offsetZ = Math.floor(deltaZ/2);
	this.depth = this.depth - deltaZ;
	if (this.depth <= 0) {
		this.depth = 1;
		offsetZ = 0;
	}

	var newBlock = create3DArray(this.width, this.height, this.depth, 0);
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			for (var k=0; k<this.depth; k++) {
				newBlock[i][j][k] = this.block[i+offsetX][j+offsetY][k+offsetZ];
			}
		}
	}
	this.block = newBlock;

	this.visible = create3DArray(this.width, this.height, this.depth, false);
	this.checkVisible();

}
VoxelSchematic.prototype.increaseSize = function(deltaX, deltaY, deltaZ) {
	var newBlock = create3DArray(this.width+deltaX, this.height+deltaY, this.depth+deltaZ, 0);
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			for (var k=0; k<this.depth; k++) {
				newBlock[i][j][k] = this.block[i][j][k];
			}
		}
	}

	this.width = this.width+deltaX;
	this.height = this.height+deltaY;
	this.depth = this.depth+deltaZ;

	this.block = newBlock;

	this.visible = create3DArray(this.width, this.height, this.depth, false);
	this.checkVisible();
}

VoxelSchematic.prototype.trimEdges = function() {
	var left = this.width-1;
	var right = 0;
	var bottom = this.height-1;
	var top = 0;
	var front = this.depth-1;
	var back = 0;

	for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
			for (var k = 0; k < this.depth; k++) {
            	var id = this.block[i][j][k];
				if (this.palette[id].model !== "none") {
					if (i < left) left = i;
					if (i > right) right = i;

					if (j < bottom) bottom = j;
					if (j > top) top = j;

					if (k < front) front = k;
					if (k > back) back = k;
				}
			}
        }
    }
	var newWidth = 1 + right - left;
	if (newWidth <= 0) newWidth = 1;
	var newHeight= 1 + top - bottom;
	if (newHeight <= 0) newHeight = 1;
	var newDepth = 1 + back - front;
	if (newDepth <= 0) newDepth = 1;

	var newBlock = create3DArray(newWidth, newHeight, newDepth, 0);
	for (var i=0; i<newWidth; i++) {
		for (var j=0; j<newHeight; j++) {
			for (var k=0; k<newDepth; k++) {
				newBlock[i][j][k] = this.block[i+left][j+bottom][k+front];
			}
		}
	}
	this.width = newWidth;
	this.height = newHeight;
	this.depth = newDepth;
	this.block = newBlock;

	this.visible = create3DArray(this.width, this.height, this.depth, false);
	this.checkVisible();

}

VoxelSchematic.prototype.setVolume = function(start, end, id) {
	var left = Math.min(start[0], end[0]);
    var top = Math.min(start[1], end[1]);
	var front = Math.min(start[2], end[2]);
    var right = Math.max(start[0], end[0]);
    var bottom = Math.max(start[1], end[1]);
	var back = Math.max(start[2], end[2]);

	for (var i = left; i <= right; i++) {
        for (var j = top; j <= bottom; j++) {
			for (var k = front; k <= back; k++) {
            	this.block[i][j][k]= id;
			}
        }
    }
	this.checkVisible();
}

VoxelSchematic.prototype.runLengthEncodeBlockArray = function() {
	var symbolList = getSymbolList(this.palette.length);
	var result = "";
	var currentID = this.block[0][0][0];
	var currentRunLength = 0;
	var currentSymbol = "";
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			for (var k=0; k<this.depth; k++) {
				if (this.block[i][j][k] === currentID) {
					currentRunLength++;
				} else {
					currentSymbol = symbolList[currentID]; // palette[currentID].symbol;
					if (currentRunLength>1) {
						result += currentRunLength + currentSymbol;
					} else {
						result += currentSymbol;
					}
					currentID = this.block[i][j][k];
					currentRunLength = 1;
				}
			}
		}
	}
	currentSymbol = symbolList[currentID];
	result += currentRunLength + currentSymbol;
	return result;
}
VoxelSchematic.prototype.createJSON = function() {
	var result ='{';
	result +='"created with":"Voxel Editor v0.3",';
	result += '"creation date":"'+(new Date()).toJSON()+'",\n';
	result +='"width":'+this.width+',';
	result +='"height":'+this.height+',';
	result +='"depth":'+this.depth+',\n';
	result +='"palette":'+this.generatePaletteJSON();//JSON.stringify(this.palette)+',\n';
	result +='"RunLengthEncoded blocks":"'+this.runLengthEncodeBlockArray()+'"';
	result +='}';
	return result;
}

VoxelSchematic.prototype.generatePaletteJSON = function() {
	var result = '[\n';
	var symbolList = getSymbolList(this.palette.length);
	for (var i=0; i<this.palette.length; i++) {
		var blockType = this.palette[i];
		if (i>0) result+=',\n';
		result +='{';
		result +='"name":"'+blockType.name+'",';
		result +='"symbol":"'+symbolList[i]+'",';
		result +='"material":"'+blockType.material+'",';
		result +='"model":"'+blockType.model+'",';
		result +='"texture":"'+blockType.texture+'",';
		if (blockType.customColour) result +='"customColour":"'+blockType.customColour+'",';
		result +='"colour":"'+blockType.colour+'"';
		result +='}';
	}
	result +='],\n';
	return result;
}

VoxelSchematic.prototype.readJSON = function(JSONtext) {
	this.width = JSONtext.width;
	this.height = JSONtext.height;
	this.depth = JSONtext.depth;

	this.palette = JSONtext.palette;
	// check for old palette
	if (this.palette[0].texture === undefined) {
		console.log("old!");
		for (var i=0; i<this.palette.length; i++) {
			if (this.palette[i].material === "gas") {
				this.palette[i].model = "none";
				this.palette[i].texture = "stone";

			} else if (this.palette[i].material === "solid") {
				this.palette[i].model = "solid";
				this.palette[i].texture = "wool";

			} else if (this.palette[i].material === "liquid") {
				this.palette[i].model = "transparent";
				this.palette[i].texture = "water";
			}
			this.palette[i].customColour = true;
		}
	}
	this.block = this.readRunLengthEncoding(JSONtext["RunLengthEncoded blocks"]);

	this.visible = create3DArray(this.width, this.height, this.depth, false);
	this.checkVisible();
}
VoxelSchematic.prototype.readRunLengthEncoding = function(JSONtext) {
	var x=0; y=0; z=0;
	var symbolList = getSymbolList(this.palette.length);
	var result = create3DArray(this.width, this.height, this.depth,0);
	var currentCount ="";
	var runLength = 0;
	var currentID = 2;
	var currentSymbol= "";
	var nextChar = "";

	var i=0;
	while (i < JSONtext.length) {
		currentSymbol = JSONtext.charAt(i);
		if (isNaN(parseInt(currentSymbol)) ) {
			// check to see if multi letter symbol
			if (i<JSONtext.length-1) {
				nextChar = JSONtext.charAt(i+1);
				if (isNaN(parseInt(nextChar)) && nextChar === nextChar.toLowerCase()) {
					currentSymbol += nextChar;
					i++;
				}
			}

			currentID = symbolList.indexOf(currentSymbol);
			runLength = parseInt(currentCount);
			if (isNaN(runLength)) runLength = 1;
			for (var j=0; j<runLength; j++) {
				result[x][y][z] = currentID;
				z++;
				if (z === this.depth) {
					z=0;
					y++;
					if (y === this.height) {
						y=0;
						x++;
					}
				}
			}
			currentCount = "";
		} else {
			currentCount += currentSymbol;
		}
		i++;
	}
	return result;
}

VoxelSchematic.prototype.checkVisible = function() {
  for (var i=0; i<this.width; i++) {
    for (var j=0; j<this.height; j++) {
      for (var k=0; k<this.depth; k++) {
        this.visible[i][j][k] = this.isVisible(i,j,k);
      }
    }
  }
}
VoxelSchematic.prototype.isVisible = function(x,y,z) {
  var result = false;
  if (!this.isGas(x,y,z)) {
    // borders of model are always visible
    if (x>0 && x<this.width-1 && y>0 && y<this.height-1 && z>0 && z<this.depth-1) {
      // only visible if next to transparent blocks
      if (this.isAdjacentToTransparent(x,y,z)) {
        // only show surface of transparent liquids;
        if (this.isTransparent(x,y,z)) {
          if (this.isAdjacentToGas(x,y,z)) {
            result = true;
          }
        } else {
          result = true;
        }
      }
    } else {
      result = true;
    }
  }
  return result;
}
VoxelSchematic.prototype.isAdjacentToGas = function(x,y,z) {
  if (  this.isGas(x-1,y,z) || this.isGas(x+1,y,z) ||
        this.isGas(x,y-1,z) || this.isGas(x,y+1,z) ||
        this.isGas(x,y,z-1) || this.isGas(x,y,z+1) ) {
    return true;
  } else {
    return false;
  }
}
VoxelSchematic.prototype.isGas = function(x,y,z) {
  var id = this.block[x][y][z];
  var material = this.palette[id].model;
  if (material == "none") {
    return true;
  } else {
    return false;
  }
}
VoxelSchematic.prototype.isAdjacentToTransparent = function(x,y,z) {
  if (  this.isTransparent(x-1,y,z) || this.isTransparent(x+1,y,z) ||
        this.isTransparent(x,y-1,z) || this.isTransparent(x,y+1,z) ||
        this.isTransparent(x,y,z-1) || this.isTransparent(x,y,z+1) ) {
    return true;
  } else {
    return false;
  }
}
VoxelSchematic.prototype.isTransparent = function(x,y,z) {
  var id=this.block[x][y][z];
  var material = this.palette[id].model;
  return materialTransparent[materialID[material]];
}
