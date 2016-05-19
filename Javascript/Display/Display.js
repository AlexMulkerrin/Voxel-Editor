function Display(canvasName, schematic, control) {
  this.targetSchematic = schematic;
  this.targetControl = control;

  this.canvas = document.getElementById(canvasName);
  this.ctx = this.canvas.getContext("2d");
  this.render = new IsometricRender(schematic);

	this.maxViewWidth;
	this.maxViewHeight;

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

	this.maxViewWidth = this.canvas.width - (this.targetControl.view.borderLeft + this.targetControl.view.borderRight);
    this.maxViewHeight = this.canvas.height - (this.targetControl.view.borderTop + this.targetControl.view.borderBottom);

	if (this.targetControl.currentTabView === viewTabID.isometric) {
		this.render.resizeTileSize(this.maxViewWidth, this.maxViewHeight);
	}

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
  //this.drawIsometricRender();
  this.drawInterface();
  this.drawButtons();

  this.drawSideBar();
  this.drawColourPicker();
  this.drawInfo();

	if (this.targetControl.currentTabView === viewTabID.isometric) {
		this.drawIsometricRender();
	}

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
	this.drawRectangle(this.targetControl.view.borderLeft, this.targetControl.view.borderTop, this.maxViewWidth, this.maxViewHeight, this.targetSchematic.palette[0].colour);
  	var tx = this.targetControl.view.borderLeft + (this.maxViewWidth - this.render.outputImage.width)/2;
  	var ty = this.targetControl.view.borderTop + (this.maxViewHeight - this.render.outputImage.height)/2;
  	this.ctx.drawImage(this.render.outputImage, tx, ty);

  //this.ctx.drawImage(this.render.outputImage, (this.canvas.width-215)+tx, ty);

  //this.ctx.fillStyle = "#9FAEC2";
  //this.ctx.fillRect(tx-17, 48, 1, this.render.outputImage.height);
 // this.ctx.fillRect(tx-17, 48+this.render.outputImage.height, this.render.outputImage.width, 1);
	this.drawRectangle(this.canvas.width-215, 179, 215, 1, "#9FAEC2");

}

Display.prototype.drawInterface = function () {
    var c = this.canvas;
	var view = this.targetControl.view;
    // top info bar
    this.drawRectangle(0, 0, c.width, 21, "#DBE8F5");
    this.drawRectangle(0, 21, c.width, 1, "#365D90");
    // tool bar
    this.drawRectangle(0, 22, c.width, 25, "#FBFDFF");
    this.drawRectangle(0, 47, c.width, 1, "#9FAEC2");
    // vertical scrollbar
    this.drawRectangle(c.width - view.borderRight, 48, 16, c.height - 90, "#fcfcfc");
    this.drawRectangle(c.width - (1+view.borderRight), 48, 1, c.height - 90, "#9FAEC2");
	this.drawRectangle(c.width + 16 - view.borderRight, 48, 1, c.height - 58, "#9FAEC2");
    // horizontal scrollbar
    this.drawRectangle(0, c.height - 42, c.width + 16 - view.borderRight, 16, "#fcfcfc");
    this.drawRectangle(0, c.height - 43, c.width - view.borderRight, 1, "#9FAEC2");
    // bottom info bar
    this.drawRectangle(0, c.height - 25, c.width, 25, "#FBFDFF");
    this.drawRectangle(0, c.height - 26, c.width, 1, "#919191");
    // tool bar dividers
    this.ctx.fillStyle = "#9FAEC2";
    this.ctx.fillRect(107, 29, 1, 13);
    this.ctx.fillRect(370, 29, 1, 13);
    //this.ctx.fillRect(289, 29, 1, 13);
    // bottom bar dividers
    this.ctx.fillStyle = "#9FAEC2";
    this.ctx.fillRect(132, c.height - 19, 1, 13);
	this.ctx.fillRect(335, c.height - 19, 1, 13);
    this.ctx.fillRect(c.width - 122, c.height - 19, 1, 13);
	// sidebar background
	this.drawRectangle(this.canvas.width-215, 180, 215, this.canvas.height-206, "#FBFDFF");

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

Display.prototype.drawSideBar = function() {
	var palette = this.targetSchematic.palette;
	var px = this.canvas.width-200;
	var py = 400;
	var x=0, y=0;
	for (var i=0; i<palette.length; i++) {
		this.ctx.fillStyle = palette[i].colour;
		this.ctx.fillRect(px+x*24, py+y*24, 16, 16);
		x++;
		if (x>7) {
			x=0;
			y++;
		}
	}
	var current = this.targetControl.currentPalette;
	var palette = this.targetSchematic.palette;

	this.ctx.fillStyle = palette[current].colour;
	this.ctx.fillRect(px+140, 188, 16, 16);

	this.ctx.fillStyle = "#000033";
    this.ctx.fillText("Currently selected block: #"+current, px, 200);
	this.ctx.fillText("name: "+palette[current].name, px, 220);
	this.ctx.fillText("material: "+palette[current].material, px, 240);
	this.ctx.fillText("colour code: "+palette[current].colour, px, 260);
}

Display.prototype.drawColourPicker = function() {
	var colour = this.targetControl.currentColour;
	var length = 160;
	var step = 255/length;
	var px = this.canvas.width-183;

	for (var i=0; i<length; i++) {
		var newRed = Math.floor(step*i);
		this.ctx.fillStyle = toRGBString(newRed,colour[1],colour[2]);
		this.ctx.fillRect(px+i, 270,1,21);

		var newGreen = Math.floor(step*i);
		this.ctx.fillStyle = toRGBString(colour[0], newGreen, colour[2]);
		this.ctx.fillRect(px+i,300,1,21);

		var newBlue = Math.floor(step*i);
		this.ctx.fillStyle = toRGBString(colour[0], colour[1], newBlue);
		this.ctx.fillRect(px+i,330,1,21);
	}
	this.ctx.fillStyle = "#22BCFE";
	this.ctx.fillRect(px+colour[0]/step, 269,2,22);
	this.ctx.fillRect(px+colour[1]/step,299,2,22);
	this.ctx.fillRect(px+colour[2]/step,329,2,22);
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
    this.ctx.fillText("*"+this.targetSchematic.fileName+" - Voxel Editor v0.3", 45, 13);
	this.ctx.fillText("Current View: "+this.targetControl.currentTabView, 345, 13);

	this.ctx.fillText("View: ", 120, 38);
	this.ctx.fillText("Slice", 160, 38);
	this.ctx.fillText("Isometric", 200, 38);
    this.ctx.fillText("3D render", 260, 38);
	this.ctx.fillText("Details", 320, 38);


	var px = this.canvas.width-203;
	this.ctx.fillText("R: ", px, 284);
	this.ctx.fillText("G: ", px, 314);
	this.ctx.fillText("B: ", px, 344);
	this.ctx.fillText("Palette: ", px, 390);
	this.ctx.fillStyle = "#9FAEC2";
	this.ctx.fillRect( px, 368, this.canvas.width-(px+5), 1);
	this.ctx.fillStyle = "#000033";

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
