// Isometric Renderer creates an HTML5 canvas with render output upon it which can be given to Display object to draw.
function IsometricRender(schematic) {
  this.targetSchematic = schematic;
  this.rotation = 0;
  this.cutoff = this.targetSchematic.height;

  this.outputImage = document.createElement('canvas');
  this.tileSheet = document.createElement('canvas');
  this.tempCanvas = document.createElement('canvas');
  this.tileSize = 50;

	this.blockImage = [];
	//this.loadBlockImages();
}

IsometricRender.prototype.setBlockImages = function(images) {
	this.blockImage = images;
}

// create render method called when block image is loaded or when schematic
// palette is updated and tilesheet needs to be re-populated.
IsometricRender.prototype.createRender = function() {
  this.createTileSheet();
  this.updateRender();
}

IsometricRender.prototype.resizeTileSize = function(width, height) {
	var model = this.targetSchematic;
	var maxXSize = (2*width)/(model.width+model.depth+2);
	var maxYSize = (4*height)/(model.width+model.depth+2*model.height+4);
	this.tileSize = Math.floor(Math.min(maxXSize,maxYSize));

	this.createRender();
}

// creates a tilesheet with default block image adjusted to match each
// colouration present in schematic palette.
IsometricRender.prototype.createTileSheet = function (sourceImage) {
	let palette = this.targetSchematic.palette;
	this.tileSheet.width = palette.length*this.tileSize;
	this.tileSheet.height = this.tileSize;
	let ctx = this.tileSheet.getContext("2d");
	this.tempCanvas.width = this.tileSize;
	this.tempCanvas.height = this.tileSize;
	let tempCtx = this.tempCanvas.getContext("2d");

	// temp canvas in cleared state to be used after each tile is drawn
	let clearRect = tempCtx.createImageData(this.tileSize, this.tileSize);
	for (let i=0; i<clearRect.data.length; i++) {
		clearRect.data[i] = 0;
	}

	/*
  for (var i=0; i<palette.length; i++) {
	  var textureIndex = textureID[palette[i].texture];

	  tempCtx.drawImage(this.blockImage[textureIndex], 0, 0, this.tileSize, this.tileSize);
	  var imageData = tempCtx.getImageData(0, 0, this.tileSize, this.tileSize);
	  // wipe initial tile for next
  		tempCtx.putImageData(clearRect,0,0);
	  var data = imageData.data;

	  var blockColour = colourComponents("#ffffff");
	  if (palette[i].customColour) {
    	blockColour = colourComponents(palette[i].colour);
	}

    var oldData = [];
    for (var j=0; j<data.length; j++) {
      oldData[j] = data[j];
    }

    for (var j=0; j<data.length; j += 4) {
      var oldRed = data[j];
      var oldGreen = data[j+1];
      var oldBlue = data[j+2];
      var red = (blockColour[0] * oldRed)/255;
      var green = (blockColour[1] * oldGreen)/255;
      var blue = (blockColour[2] * oldBlue)/255;
      data[j] = Math.floor(red);
      data[j+1] = Math.floor(green);
      data[j+2] = Math.floor(blue);
    }

    ctx.putImageData(imageData, i*this.tileSize, 0);
    for (var j=0; j<data.length; j++) {
      data[j] = oldData[j];
    }
  }
  */
  
	// NEW don't bother loading images of isometric textured cubes. Instead generate then with a function
	ctx.fillStyle
	for (let i=0; i<palette.length; i++) {
		//tempCtx.fillStyle = "#ffffff";
		//tempCtx.fillRect(0, 0, this.tileSize, this.tileSize);
		this.drawIsometricCube(tempCtx, 0, 0, this.tileSize, "#ffffff",true);
		
		let imageData = tempCtx.getImageData(0, 0, this.tileSize, this.tileSize);
		// wipe temp canvas for next
		tempCtx.putImageData(clearRect,0,0);
		let data = imageData.data;
		
		let blockColour = colourComponents("#ffffff");
		//if (palette[i].customColour) {
			blockColour = colourComponents(palette[i].colour);
		//}

		let oldData = [];
		for (let j=0; j<data.length; j++) {
			oldData[j] = data[j];
		}

		for (let j=0; j<data.length; j += 4) {
			let oldRed = data[j];
			let oldGreen = data[j+1];
			let oldBlue = data[j+2];
			let red = (blockColour[0] * oldRed)/255;
			let green = (blockColour[1] * oldGreen)/255;
			let blue = (blockColour[2] * oldBlue)/255;
			data[j] = Math.floor(red);
			data[j+1] = Math.floor(green);
			data[j+2] = Math.floor(blue);
		}

		ctx.putImageData(imageData, i*this.tileSize, 0);
		for (let j=0; j<data.length; j++) {
			data[j] = oldData[j];
		}
		
	}
}

// redraws isometric render, to be called when contents of schematic block array changes.
IsometricRender.prototype.updateRender = function() {
  var rotationTransforms = [ [[1,0],[0,1]], [[0,-1],[1,0]], [[-1,0],[0,-1]], [[0,1],[-1,0]] ];

	var size = this.tileSize;
	var half = Math.floor(size/2);
	var quarter = Math.floor(size/4);

  var model = this.targetSchematic;
  this.outputImage.width = model.width*half + model.depth*half + size;
  this.outputImage.height = model.width*quarter + model.height*half + model.depth*quarter + size;
  var ctx = this.outputImage.getContext("2d");
  ctx.fillStyle= model.palette[0].colour;
  ctx.fillRect(0,0,this.outputImage.width,this.outputImage.height)

  var nx, nz;
  var xxcomp = rotationTransforms[this.rotation][0][0];
  var xzcomp = rotationTransforms[this.rotation][0][1];
  var zxcomp = rotationTransforms[this.rotation][1][0];
  var zzcomp = rotationTransforms[this.rotation][1][1];

	var longestAxis = Math.max(model.width, model.depth);

  for (var i=0; i<longestAxis; i++) {
    for (var k=0; k<longestAxis; k++) {
      for (var j=0; j<model.height; j++) {

        nx =  xxcomp<0 ? model.width - (1+i) : i*xxcomp;
        nx += xzcomp<0 ? model.width - (1+k) : k*xzcomp;
        nz =  zxcomp<0 ? model.depth - (1+i) : i*zxcomp;
        nz += zzcomp<0 ? model.depth - (1+k) : k*zzcomp;

		// Temporary bugfix!
		if (nx < model.width && nz < model.depth && nx >= 0 && nz >= 0) {

	        var id = model.block[nx][j][nz];
	        var material = model.palette[id].model;
	        if ( !(material == "none") ) {
	          if (model.visible[nx][j][nz] || j == this.cutoff) {
	            if (material == "transparent") ctx.globalAlpha=0.7;

	            var tx = id*size;
	            var ty = 0;
	            var x = model.depth*half + i*half -k*half;
	            var y = model.height*half + i*quarter + k*quarter - j*half;
	            ctx.drawImage(this.tileSheet,tx,ty,size,size, x,y,size,size);
	            if (material == "transparent") ctx.globalAlpha=1;
	          }
	        }
	      }
  		}
    }
  }
}


IsometricRender.prototype.drawIsometricCube = function(inCTX, inX, inY, inSpan, inColour, isOutlined) {
	let x = inX;
	let y = inY;
	let inner = 2;
	let outer = 1;
	let span = inSpan;
	let ctx = inCTX;
	
	// top face
	ctx.fillStyle = inColour; //"#00ffff";
	ctx.beginPath();
	ctx.moveTo(x+span/2,y);
	ctx.lineTo(x+span,y+span/4);
	ctx.lineTo(x+span/2,y+span/2);
	ctx.lineTo(x,y+span/4);
	ctx.closePath();
	ctx.fill();
	
	// left face
	ctx.fillStyle = adjustColourValue(inColour,0.8);
	ctx.beginPath();
	ctx.moveTo(x,y+span/4);
	ctx.lineTo(x+span/2,y+span/2);
	ctx.lineTo(x+span/2,y+span);
	ctx.lineTo(x,y+span*3/4);
	ctx.closePath();
	ctx.fill();
	
	// right face
	ctx.fillStyle = adjustColourValue(inColour,0.7);
	ctx.beginPath();
	ctx.moveTo(x+span/2,y+span/2);
	ctx.lineTo(x+span,y+span/4);
	ctx.lineTo(x+span,y+span*3/4);
	ctx.lineTo(x+span/2,y+span);
	ctx.closePath();
	ctx.fill();
	
	if (isOutlined == true) {
		ctx.fillStyle = adjustColourValue(inColour,0.4);
		for (let i=0; i<span/4; i++) {
			//top of block
			ctx.fillRect(x+i*2+span/2-1,y+i,3,outer);
			ctx.fillRect(x-i*2+span/2+1,y+i,-3,outer);
			
			// inner edge of top of block
			ctx.fillRect(x+i*2+span/2-1, span/2+y-i,3,inner);
			ctx.fillRect(x-i*2+span/2+1, span/2+y-i,-3,inner);
			
			// bottom of block
			ctx.fillRect(x+i*2+span/2-1,span+y-i-outer,3,outer);
			ctx.fillRect(x-i*2+span/2+1,span+y-i-outer,-3,outer);
		}
		//outer sides
		ctx.fillRect(x+span-outer,span/4+y,outer,span/2);
		ctx.fillRect(x,span/4+y,outer,span/2);
		
		// inner side
		ctx.fillRect(x+span/2-inner+1,span/2+y,inner,span/2);
	}
}