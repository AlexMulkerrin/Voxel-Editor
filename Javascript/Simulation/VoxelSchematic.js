function VoxelSchematic(width, height, depth) {
  this.width = width;
  this.height = height;
  this.depth = depth;
  this.palette = defaultPalette();

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

VoxelSchematic.prototype.decreaseSize = function() {

	this.width = this.width-1;
	if (this.width == 0) this.width = 1;
	this.height = this.height-1;
	if (this.height == 0) this.height = 1;
	this.depth = this.depth-1;
	if (this.depth == 0) this.depth = 1;

	var newBlock = create3DArray(this.width, this.height, this.depth, 0);
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			for (var k=0; k<this.depth; k++) {
				newBlock[i][j][k] = this.block[i][j][k];
			}
		}
	}
	this.block = newBlock;

	this.visible = create3DArray(this.width, this.height, this.depth, false);
	this.checkVisible();

}
VoxelSchematic.prototype.increaseSize = function() {
	var newBlock = create3DArray(this.width+1, this.height+1, this.depth+1, 0);
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			for (var k=0; k<this.depth; k++) {
				newBlock[i][j][k] = this.block[i][j][k];
			}
		}
	}

	this.width = this.width+1;
	this.height = this.height+1;
	this.depth = this.depth+1;

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
	var symbolList = ["A","B","C","D","E","F","G","H"];
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
	result +='"palette":'+JSON.stringify(this.palette)+',\n';
	result +='"RunLengthEncoded blocks":"'+this.runLengthEncodeBlockArray()+'"';
	result +='}';
	return result;
}

VoxelSchematic.prototype.readJSON = function(JSONtext) {
	this.width = JSONtext.width;
	this.height = JSONtext.height;
	this.depth = JSONtext.depth;

	this.block = this.readRunLengthEncoding(JSONtext["RunLengthEncoded blocks"]);
	this.palette = JSONtext.palette;
	this.visible = create3DArray(this.width, this.height, this.depth, false);
	this.checkVisible();
}
VoxelSchematic.prototype.readRunLengthEncoding = function(JSONtext) {
	var x=0; y=0; z=0;
	var result = create3DArray(this.width, this.height, this.depth);
	var currentCount ="";
	var runLength = 0;
	var currentID = 2;
	var currentChar= "";
	for (var i=0; i<JSONtext.length; i++) {
		currentChar = JSONtext.charAt(i);
		if (isNaN(parseInt(currentChar)) ) {

			currentID = getIDfromSymbol(currentChar);
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
			currentCount += currentChar;
		}
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
  var material = this.palette[id].material;
  if (material == "gas") {
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
  var material = this.palette[id].material;
  return materialTransparent[materialID[material]];
}
