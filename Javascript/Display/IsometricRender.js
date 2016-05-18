// Isometric Renderer creates an HTML5 canvas with render output upon it which can be
// given to Display object to draw.
function IsometricRender(schematic) {
  this.targetSchematic = schematic;
  this.rotation = 0;
  this.cutoff = this.targetSchematic.height;

  this.outputImage = document.createElement('canvas');
  this.tileSheet = document.createElement('canvas');
  this.tileSize = 0;

  this.blockImage = new Image();
  this.blockImage.crossOrigin = "Anonymous";
  this.blockImage.src = "Resources/Images/GiantWoolTexture.png";
  var t = this;
  this.blockImage.onload = function() {
	  t.tileSize = 50;//t.blockImage.width;
	  t.createRender();
  }
}

// create render method called when block image is loaded or when schematic
// palette is updated and tilesheet needs to be re-populated.
IsometricRender.prototype.createRender = function () {
  this.createTileSheet();
  this.updateRender();
}

// creates a tilesheet with default block image adjusted to match each
// colouration present in schematic palette.
IsometricRender.prototype.createTileSheet = function (sourceImage) {
  var palette = this.targetSchematic.palette;
  this.tileSheet.width = palette.length*this.tileSize;
  this.tileSheet.height = this.tileSize;
  var ctx = this.tileSheet.getContext("2d");

  ctx.drawImage(this.blockImage, 0, 0, this.tileSize, this.tileSize);
  var imageData = ctx.getImageData(0, 0, this.tileSize, this.tileSize);
  var data = imageData.data;

  for (var i=0; i<palette.length; i++) {
    var blockColour = colourComponents(palette[i].colour);

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

  for (var i=0; i<model.width; i++) {
    for (var k=0; k<model.depth; k++) {
      for (var j=0; j<model.height; j++) {

        nx =  xxcomp<0 ? model.width - (1+i) : i*xxcomp;
        nx += xzcomp<0 ? model.depth - (1+k) : k*xzcomp;
        nz =  zxcomp<0 ? model.width - (1+i) : i*zxcomp;
        nz += zzcomp<0 ? model.depth - (1+k) : k*zzcomp;

        var id = model.block[nx][j][nz];
        var material = model.palette[id].material;
        if (material !== "gas") {
          if (model.visible[nx][j][nz] || j == this.cutoff) {
            if (material == "liquid") ctx.globalAlpha=0.3;

            var tx = id*size;
            var ty = 0;
            var x = model.depth*half + i*half -k*half;
            var y = model.height*half + i*quarter + k*quarter - j*half;
            ctx.drawImage(this.tileSheet,tx,ty,size,size, x,y,size,size);
            if (material == "liquid") ctx.globalAlpha=1;
          }
        }
      }
    }
  }
}
