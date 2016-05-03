function Display(canvasName, schematic, control) {
  this.targetSchematic = schematic;
  this.targetControl = control;

  this.canvas = document.getElementById(canvasName);
  this.ctx = this.canvas.getContext("2d");
  this.render = new IsometricRender(schematic);

	this.icon = [];
	this.loadIcons();

  var t = this;
  window.onresize = function (){ t.resizeCanvas();};
  this.resizeCanvas();
}

Display.prototype.loadIcons = function () {
    var iconName = [   "new", "load", "save", "increase", "decrease", "camera", "splitter",
						"rotate", "remove", "undo", "redo", "run", "pause", "fullscreen",
						"windowed", "scrollUp", "scrollDown", "scrollLeft", "scrollRight",
						"resize", "position", "fitToWindow", "zoomIn", "zoomOut",
                        "wirehead", "wireInLeft", "wireInRight", "wireInBack", "wireInverter"];
    for (var i = 0; i < iconName.length; i++) {
        this.icon[i] = new Image();
        this.icon[i].src = "Resources/Icons/" + iconName[i] + ".svg";
    }
}

Display.prototype.resizeCanvas = function () {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.targetControl.repositionButtons();
	this.refresh();
}
Display.prototype.updatePalette = function() {
	this.render.createRender();
	this.refresh();
}
Display.prototype.updateRender = function() {
	this.render.updateRender();
	this.refresh();
}
Display.prototype.refresh = function() {
  this.clearCanvas();
  this.drawSlice();
  this.drawIsometricRender();
  this.drawInterface();
  this.drawButtons();
  this.drawPalette();
  this.drawInfo();
  this.drawTooltips();
  this.drawCursor();

}

Display.prototype.clearCanvas = function() {
  this.ctx.fillStyle = "#efefff";//"#dce5f2";
  this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
}

Display.prototype.drawSlice = function() {
	var model = this.targetSchematic;
	var sqSize = this.targetControl.view.pixelPerCell;
	if (sqSize > 1) {
        this.ctx.fillStyle = "#eeeeee";
    } else {
        this.ctx.fillStyle = "#ffffff";
    }
    this.drawRectOnView(0, 0, model.width * sqSize, model.depth *  sqSize);

	this.ctx.fillStyle = "#ffffff";
	var sliceHeight = this.targetControl.view.sliceHeight;
    for (var i = 0; i < model.width; i++) {
        for (var k = 0; k < model.depth; k++) {

			var id = model.block[i][sliceHeight][k];
			if (sliceHeight>0 && model.isTransparent(i,sliceHeight,k)) {
				if (model.isTransparent(i,sliceHeight-1,k)) {
					this.ctx.fillStyle = model.palette[id].colour;
				} else {
					var id = model.block[i][sliceHeight-1][k];
					this.ctx.fillStyle = colourBlend(model.palette[id].colour, model.palette[0].colour);
				}
			} else {
				this.ctx.fillStyle = model.palette[id].colour;
			}
			this.drawRectOnView(i * sqSize, k * sqSize, sqSize - 1, sqSize - 1);
        }
    }
}

Display.prototype.drawIsometricRender = function() {
  var tx = this.canvas.width - this.render.outputImage.width;
  this.ctx.drawImage(this.render.outputImage, tx-17, 48);

  this.ctx.fillStyle = "#9FAEC2";
  this.ctx.fillRect(tx-17, 48, 1, this.render.outputImage.height);
  this.ctx.fillRect(tx-17, 48+this.render.outputImage.height, this.render.outputImage.width, 1);

}

Display.prototype.drawInterface = function () {
    var c = this.canvas;
    // top info bar
    this.drawRectangle(0, 0, c.width, 21, "#DBE8F5");
    this.drawRectangle(0, 21, c.width, 1, "#365D90");
    // tool bar
    this.drawRectangle(0, 22, c.width, 25, "#FBFDFF");
    this.drawRectangle(0, 47, c.width, 1, "#9FAEC2");
    // vertical scrollbar
    this.drawRectangle(c.width - 16, 48, 16, c.height - 90, "#fcfcfc");
    this.drawRectangle(c.width - 17, 48, 1, c.height - 90, "#9FAEC2");
    // horizontal scrollbar
    this.drawRectangle(0, c.height - 42, c.width, 16, "#fcfcfc");
    this.drawRectangle(0, c.height - 43, c.width - 16, 1, "#9FAEC2");
    // bottom info bar
    this.drawRectangle(0, c.height - 25, c.width, 25, "#FBFDFF");
    this.drawRectangle(0, c.height - 26, c.width, 1, "#919191");
    // tool bar dividers
    this.ctx.fillStyle = "#9FAEC2";
    this.ctx.fillRect(107, 29, 1, 13);
    this.ctx.fillRect(598, 29, 1, 13);
    //this.ctx.fillRect(289, 29, 1, 13);
    // bottom bar dividers
    this.ctx.fillStyle = "#9FAEC2";
    this.ctx.fillRect(132, c.height - 19, 1, 13);
	this.ctx.fillRect(335, c.height - 19, 1, 13);
    this.ctx.fillRect(c.width - 122, c.height - 19, 1, 13);
}
Display.prototype.drawButtons = function () {
    for (var i = 0; i < this.targetControl.button.length; i++) {
        this.drawButton(this.targetControl.button[i]);
    }
    // drawing scrollbar sections goes here
}
Display.prototype.drawButton = function (button) {
    var nx, ny;
    if (button.isClicked) {
        this.ctx.fillStyle = "#dddddd";
    } else if (button.isSelected) {
        this.ctx.fillStyle = "#bbccff";
    } else if (button.isHovered) {

        this.ctx.fillStyle = "#ddf5ff";
    } else {
        this.ctx.fillStyle = "#EEEEEE";
    }
    this.ctx.fillRect(button.x, button.y, button.width, button.height);

    if (button.icon !== null) {
        nx = (button.width - this.icon[button.icon].width) / 2;
        ny = (button.height - this.icon[button.icon].height) / 2;
        this.ctx.drawImage(this.icon[button.icon], button.x + nx, button.y + ny);
    }
}

Display.prototype.drawPalette = function () {
	var palette = this.targetSchematic.palette;

	this.ctx.fillStyle = palette[this.targetControl.currentPalette].colour;
	//this.ctx.fillRect(210, 27, 16, 16);

	for (var i=0; i<palette.length; i++) {
		this.ctx.fillStyle = palette[i].colour;
		this.ctx.fillRect(657+i*24, 27, 16, 16);
	}

	var colour = this.targetControl.currentColour;
	var length = 100;
	var step = 255/length;

	for (var i=0; i<length; i++) {
		var newRed = Math.floor(step*i);
		this.ctx.fillStyle = toRGBString(newRed,colour[1],colour[2]);
		this.ctx.fillRect(244+i, 24,1,21);

		var newGreen = Math.floor(step*i);
		this.ctx.fillStyle = toRGBString(colour[0], newGreen, colour[2]);
		this.ctx.fillRect(364+i,24,1,21);

		var newBlue = Math.floor(step*i);
		this.ctx.fillStyle = toRGBString(colour[0], colour[1], newBlue);
		this.ctx.fillRect(484+i,24,1,21);
	}
	this.ctx.fillStyle = "#22BCFE";
	this.ctx.fillRect(244+colour[0]/step, 24,2,22);
	this.ctx.fillRect(364+colour[1]/step,24,2,22);
	this.ctx.fillRect(484+colour[2]/step,24,2,22);

}

Display.prototype.drawRectOnView = function(x,y,w,h) {
    this.ctx.fillRect(x + this.targetControl.view.x, y + this.targetControl.view.y, w, h);
}

Display.prototype.drawRectangle = function (x, y, w, h, colour) {
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(x, y, w, h);
}
Display.prototype.drawInfo = function () {
    var c = this.canvas;
    // top bar info
    this.ctx.fillStyle = "#000033";
    this.ctx.fillText("Edit", 5, 13);
    this.ctx.fillText("*Schematic.png - Voxel Editor v0.2", 45, 13);

    this.ctx.fillText("Current block: "+this.targetSchematic.palette[this.targetControl.currentPalette].material, 123, 38);
	this.ctx.fillText("R: ", 232, 38);
	this.ctx.fillText("G: ", 352, 38);
	this.ctx.fillText("B: ", 472, 38);
	this.ctx.fillText("Palette: ", 612, 38);

    // bottom bar info
    this.ctx.fillText("size: " + this.targetSchematic.width + " x " + this.targetSchematic.height + " x " + this.targetSchematic.depth, 5, c.height - 10);
	var mouse = this.targetControl.mouse;
	this.ctx.fillText("mouse: " + mouse.latticeX + "," + mouse.latticeY + "," + mouse.latticeZ, 179, c.height - 10);
	if (mouse.isPressed) {
		var dx = Math.abs(mouse.oldLatticeX - mouse.latticeX);
		var dy = Math.abs(mouse.oldLatticeY - mouse.latticeY);
		var dz = Math.abs(mouse.oldLatticeZ - mouse.latticeZ);
		this.ctx.fillText("(" + (dx+1) + "," + (dy+1) + "," + (dz+1) + ")", 269, c.height - 10);
	}
    this.ctx.fillText("viewing slice: " + this.targetControl.view.sliceHeight, 359, c.height - 10);
    this.ctx.fillText(this.targetControl.view.pixelPerCell + ":" + this.targetControl.view.cellPerPixel, c.width - 102, c.height - 10);
}

Display.prototype.drawTooltips = function () {
	for (var i = 0; i < this.targetControl.button.length; i++) {
		var button = this.targetControl.button[i];
		if (button.isHovered || button.isClicked) {
			var text = button.function+" ("+button.hotkey+")";
			var x = button.x+button.width;
			if (button.x>this.canvas.width/2) x = button.x-this.ctx.measureText(text).width;
			var y = button.y+button.height+12;
			if (button.y>this.canvas.height/2) y = button.y-10;
			this.ctx.fillStyle = "#9FAEC2";
			this.ctx.fillRect(x-4, y-10, this.ctx.measureText(text).width+8, 16);
			this.ctx.fillStyle = "#ffffff";
			this.ctx.fillText(text, x, y);
		}
	}
}
Display.prototype.drawCursor = function() {
	var sqSize = this.targetControl.view.pixelPerCell;
	var offset = sqSize/4;
	var width = sqSize/2;
	var mouse = this.targetControl.mouse;

	if (mouse.isPressed) {
		this.ctx.fillStyle = "#9FAEC2";
		this.drawRectOnView(mouse.oldLatticeX*sqSize+offset, mouse.oldLatticeZ*sqSize+offset, width, width);
		this.drawRectOnView(mouse.oldLatticeX*sqSize+width, mouse.oldLatticeZ*sqSize+width, 2, (mouse.latticeZ-mouse.oldLatticeZ)*sqSize);
		this.drawRectOnView(mouse.oldLatticeX*sqSize+width, mouse.oldLatticeZ*sqSize+width, (mouse.latticeX-mouse.oldLatticeX)*sqSize, 2);
		this.drawRectOnView(mouse.latticeX*sqSize+width, mouse.latticeZ*sqSize+width, 2, (mouse.oldLatticeZ-mouse.latticeZ)*sqSize);
		this.drawRectOnView(mouse.latticeX*sqSize+width, mouse.latticeZ*sqSize+width, (mouse.oldLatticeX-mouse.latticeX)*sqSize, 2);
	}

	this.ctx.fillStyle = "#22BCFE";
    this.drawRectOnView(mouse.latticeX*sqSize+offset, mouse.latticeZ*sqSize+offset, width, width);

}

Display.prototype.getRenderImage = function () {
	return this.render.outputImage;
}
