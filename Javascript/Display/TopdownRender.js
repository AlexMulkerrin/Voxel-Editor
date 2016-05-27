function TopdownRender(schematic) {
	this.targetSchematic = schematic;
	this.rotation = 0;
	this.cutoff = 0;//this.targetSchematic.height;

	this.outputImage = document.createElement('canvas');
	this.tileSheet = document.createElement('canvas');
	this.tempCanvas = document.createElement('canvas');
	this.tileSize = 16;

	this.blockImage = [];
	this.loadImages();
}
TopdownRender.prototype.loadImages = function() {
	this.textureAtlas = new Image();
	this.textureAtlas.crossOrigin = "Anonymous";
	this.textureAtlas.src = "Resources/Images/TextureAtlas.png";

	var t = this;
	this.textureAtlas.onload = function() {
		t.tempCanvas.width = t.textureAtlas.width;
		t.tempCanvas.height = t.textureAtlas.height;
		var ctx = t.tempCanvas.getContext("2d");
		ctx.drawImage(t.textureAtlas, 0, 0);

		for (var j=0; j<8; j++) {
			for (var i=0; i<8; i++) {
				t.blockImage[i+j*8] = ctx.getImageData(i*16, j*16, 16, 16);
			}
		}
		t.createTileSheet();
	}
}

TopdownRender.prototype.createRender = function() {
  this.createTileSheet();
  this.updateRender(0);
}
TopdownRender.prototype.resizeTileSize = function(width,height) {
	var model = this.targetSchematic;
	var maxXSize = width/model.width;
	var maxYSize = height/model.depth;
	this.tileSize = Math.floor(Math.min(maxXSize,maxYSize));

	//this.createRender();
}
TopdownRender.prototype.createTileSheet = function() {
	var palette = this.targetSchematic.palette;
	var size = 16;

	this.tileSheet.width = palette.length*size;
	this.tileSheet.height = size;
	var ctx = this.tileSheet.getContext("2d");

	this.tempCanvas.width = size;
	this.tempCanvas.height = size;
	var tempCtx = this.tempCanvas.getContext("2d");

	//create image data which is completely blank
	var clearedImage = tempCtx.createImageData(size, size);
	for (var i=0; i<clearedImage.data.length; i++) {
		clearedImage.data[i] = 0;
	}

	for (var i=0; i<palette.length; i++) {
		var textureIndex = textureID[palette[i].texture] || 0;
		tempCtx.putImageData(this.blockImage[textureIndex], 0, 0, 0, 0, size, size);
		var imageData = tempCtx.getImageData(0,0, size, size);
		// clear temp canvas after use
		tempCtx.putImageData(clearedImage, 0, 0);

		var data = imageData.data;
		if (palette[i].customColour) {
			var blockColour = colourComponents(palette[i].colour);
		} else {
			var blockColour = colourComponents("#ffffff");
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
		ctx.putImageData(imageData, i*size, 0);
	}
}

TopdownRender.prototype.updateRender = function(sliceHeight) {
	this.cutoff = sliceHeight;
	var model = this.targetSchematic;
	var size = this.tileSize;

	this.tempCanvas.width = size;
	this.tempCanvas.height = size;
	var tempCtx = this.tempCanvas.getContext("2d");

	this.outputImage.width = model.width*size;
	this.outputImage.height = model.depth*size;
	var ctx = this.outputImage.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled =  false;

	ctx.fillStyle = model.palette[0].colour;
	ctx.fillRect(0, 0, this.outputImage.width, this.outputImage.height);

	for (var i=0; i<model.width; i++) {
		for (var k=0; k<model.depth; k++) {
			var id = model.block[i][sliceHeight][k];
			var blockType = model.palette[id].model;


			if (model.isTransparent(i,sliceHeight,k) && sliceHeight>0) {
				// display lower layers faded out
				var j = sliceHeight-1;
				while (j>0) {
					if ( model.visible[i][j][k]) break;//!model.isTransparent(i,j,k)) break;
					j--;
				}
				var lowerId = model.block[i][j][k];
				var lowerBlockType = model.palette[lowerId].model;
				if (lowerBlockType !== "none") {
					var tx = lowerId*16;
					ctx.globalAlpha=0.5;
					ctx.drawImage(this.tileSheet, tx, 0, 16, 16, i*size, k*size, size-1, size-1);
					ctx.globalAlpha=1;
				}
			}

			if (blockType !== "none") {
				var tx = id*16;
				ctx.drawImage(this.tileSheet, tx, 0, 16, 16, i*size, k*size, size-1, size-1);
			}

		}
	}
}
