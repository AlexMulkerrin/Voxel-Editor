function Control(canvasName, schematic, program) {
	this.targetProgram = program;
	this.targetCanvas = document.getElementById(canvasName);
	this.targetSchematic = schematic;
	this.targetDisplay;

	this.mouse = new Mouse();
	this.view = new View();
	this.button = [];

	this.select = "none";

	this.currentPalette = 2;
	this.currentColour = colourComponents(this.targetSchematic.palette[0].colour);

	this.createButtons();
	//this.createKeyboardEventHandlers();
	this.createCanvasEventHandlers();
}
Control.prototype.linkDisplay = function(display) {
    this.targetDisplay=display;
	this.fitToWindow();
}

Control.prototype.createCanvasEventHandlers = function () {
    var t = this;

    this.targetCanvas.onmousemove = function (event) { t.mouseUpdateCoords(event); };

    this.targetCanvas.onmousedown = function (event) { t.mousePressed(event); };
    this.targetCanvas.onmouseup = function (event) { t.mouseReleased(event); };

    this.targetCanvas.onmousewheel = function (event) { t.mouseWheel(event.wheelDelta); return false; };
    // special case for Mozilla...
    this.targetCanvas.onwheel = function (event) { t.mouseWheel(event); return false; };

    this.targetCanvas.oncontextmenu = function (event) { return false; };
    this.targetCanvas.onselectstart = function (event) { return false; };
}

function Mouse() {
    this.x = 0;
    this.y = 0;
    this.isOverWorkspace = false;
    this.isPressed = false;
    this.isReleased = false;
    this.buttonPressed = 0;

    this.isOverButton = false;
    this.selected = 3;
    this.newSelected = 0;

    this.latticeX = 0;
    this.latticeY = 0;
	this.latticeZ = 0;
    this.oldLatticeX = 0;
    this.oldLatticeY = 0;
	this.oldLatticeZ = 0;
}
Control.prototype.mouseUpdateCoords = function (event) {
    var rect = this.targetCanvas.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
    this.checkHover();
}
Control.prototype.mouseWheel = function (event) {
    var change = -event.deltaY || event.wheelDelta;
    if (change < 0) {
        //this.zoomOut();
		this.shiftViewDown();
    } else if (change > 0) {
        //this.zoomIn();
		this.shiftViewUp();
    }
    this.checkHover();
}
Control.prototype.checkHover = function () {
    this.mouse.isOverButton = false;
    var button;
    for (var i = 0; i < this.button.length; i++) {
        button = this.button[i];
        button.isHovered = false;
        button.isClicked = false;
        if (this.mouse.x >= button.x && this.mouse.x <= button.x + button.width) {
            if (this.mouse.y >= button.y && this.mouse.y <= button.y + button.height) {
                if (this.mouse.isReleased) {
                    this.mouse.newSelected = i;
                    this[button.function](button.functionArguments);
                } else if (this.mouse.isPressed) {
                    button.isClicked = true;
                } else {
                    button.isHovered = true;
                }
                this.mouse.isOverButton = true;
				this.mouse.isOverWorkspace = false;
            }
        }
    }
    if (this.mouse.isOverButton === false) {
        this.checkLattice();
    }
    this.targetDisplay.refresh();
}
Control.prototype.checkLattice = function () {
    this.mouse.isOverWorkspace = true;
    var cellSize = this.view.cellPerPixel/this.view.pixelPerCell;
    this.mouse.latticeX = Math.floor((this.mouse.x - this.view.x) * cellSize);
	this.mouse.latticeY = this.view.sliceHeight;
    this.mouse.latticeZ = Math.floor((this.mouse.y - this.view.y) * cellSize);

    if (this.mouse.latticeX < 0) {
        this.mouse.isOverWorkspace = false;
        this.mouse.latticeX = 0;
    }
    if (this.mouse.latticeX >= this.targetSchematic.width) {
        this.mouse.isOverWorkspace = false;
        this.mouse.latticeX = this.targetSchematic.width - 1;
    }
    if (this.mouse.latticeZ < 0) {
        this.mouse.isOverWorkspace = false;
        this.mouse.latticeZ = 0;
    }
    if (this.mouse.latticeZ >= this.targetSchematic.depth) {
        this.mouse.isOverWorkspace = false;
        this.mouse.latticeZ = this.targetSchematic.depth - 1;
    }
}

Control.prototype.setOldHover = function () {
    this.mouse.oldLatticeX = this.mouse.latticeX;
    this.mouse.oldLatticeY = this.mouse.latticeY;
	this.mouse.oldLatticeZ = this.mouse.latticeZ;
}

Control.prototype.mousePressed = function (event) {
    this.mouse.buttonPressed = event.which;
    this.mouse.isPressed = true;
    this.setOldHover();
    this.checkHover();
}
Control.prototype.mouseReleased = function (event) {
    this.mouse.isReleased = true;
    this.mouse.isPressed = false;
    this.checkHover();
    this.mouse.isReleased = false;
    this.checkHover();

    if (this.mouse.isOverWorkspace) {
		var start = [this.mouse.latticeX,this.mouse.latticeY,this.mouse.latticeZ];
		var end = [this.mouse.oldLatticeX,this.mouse.oldLatticeY,this.mouse.oldLatticeZ];
        if (this.mouse.buttonPressed === 1) {
			this.targetSchematic.setVolume(start, end, this.currentPalette);
        } else if (this.mouse.buttonPressed === 3) {
            this.targetSchematic.setVolume(start, end, 0);
        }
		this.targetDisplay.updateRender();
    }
    this.targetDisplay.refresh();
}



Control.prototype.zoomIn = function () {
    this.select = "zoom in";
    this.view.cellPerPixel = this.view.cellPerPixel / 2;
    if (this.view.cellPerPixel < 1) {
        this.view.cellPerPixel = 1;
        this.view.pixelPerCell = this.view.pixelPerCell * 2;
    }

    this.view.x = Math.floor(this.view.x * 2 - this.mouse.x);
    this.view.y = Math.floor(this.view.y * 2 - this.mouse.y);
}

Control.prototype.zoomOut = function () {
    this.select = "zoom out";
    this.view.pixelPerCell = this.view.pixelPerCell / 2;
    if (this.view.pixelPerCell < 1) {
        this.view.pixelPerCell = 1;
        this.view.cellPerPixel = this.view.cellPerPixel * 2;
    }

    this.view.x = (this.view.x + this.targetCanvas.width - this.mouse.x) / 2;
    this.view.y = (this.view.y + this.targetCanvas.height - this.mouse.y) / 2;

    var maxWorkspaceWidth = this.targetCanvas.width - (this.view.borderLeft + this.view.borderRight);
    var maxWorkspaceHeight = this.targetCanvas.height - (this.view.borderTop + this.view.borderBottom);

    var workspaceWidth = this.targetSchematic.width * this.view.pixelPerCell / this.view.cellPerPixel;
    var workspaceHeight = this.targetSchematic.height * this.view.pixelPerCell / this.view.cellPerPixel;

    if (workspaceWidth < maxWorkspaceWidth) {
        this.view.x = this.view.borderLeft + (maxWorkspaceWidth - workspaceWidth) / 2;
    }
    if (workspaceHeight < maxWorkspaceHeight) {
        this.view.y = this.view.borderTop + (maxWorkspaceHeight - workspaceHeight) / 2;
    }
    this.view.x = Math.floor(this.view.x);
    this.view.y = Math.floor(this.view.y);
}

Control.prototype.shiftViewUp = function() {
	this.view.sliceHeight++;
	if (this.view.sliceHeight >= this.targetSchematic.height) {
		this.view.sliceHeight = this.targetSchematic.height -1;
	}
}

Control.prototype.shiftViewDown = function() {
	this.view.sliceHeight--;
	if (this.view.sliceHeight < 0 ) {
		this.view.sliceHeight = 0;
	}
}

function View() {
    this.offsetX = 5;
    this.offsetY = 53;
    this.x = this.offsetX;
    this.y = this.offsetY;

    this.borderTop = 53;
    this.borderLeft = 5;
    this.borderRight = 22;
    this.borderBottom = 48;

    this.pixelPerCell = 16;
    this.cellPerPixel = 1;

	this.sliceHeight = 3;
}

Control.prototype.createButtons = function () {
    var c = this.targetCanvas;
    var t = this;
	this.button = [];
    // file modification
    this.button.push( new Button(2, 24, 22, 22, 0, "newFile") );
    this.button.push( new Button(26, 24, 22, 22, 1, "loadFile") );
    this.button.push( new Button(50, 24, 22, 22, 2, "saveAsJSON") );
	this.button.push( new Button(74, 24, 22, 22, 2, "saveAsImage") );

    // palette
	var palette = this.targetSchematic.palette;
	for (var i=0; i<palette.length; i++) {
		this.button.push(  new Button(654+i*24, 24, 22, 22, null, "selectPalette", i) );
	}
	// colour sliders
	this.button.push(  new Button(244, 24, 100, 22, null, "changeColour", 0) );
	this.button.push(  new Button(364, 24, 100, 22, null, "changeColour", 1) );
	this.button.push(  new Button(484, 24, 100, 22, null, "changeColour", 2) );

    // viewport controls
    this.button.push(  new Button(c.width - 21, 1, 20, 20, 13, "fullscreen") );

    this.button.push(  new Button(c.width - 16, 48, 16, 16, 15, "scrollUp") );
    this.button.push(  new Button(c.width - 16, c.height - 58, 16, 16, 16, "scrollDown") );
    this.button.push(  new Button(0, c.height - 42, 16, 16, 17, "scrollLeft") );
    this.button.push(  new Button(c.width - 32, c.height - 42, 16, 16, 18, "scrollRight") );

    // size and scale
    //this.button.push(  new Button(3, c.height - 23, 20, 20, 19, "resize") );
	this.button.push(  new Button(95, c.height - 23, 20, 9, null, "increaseSize") );
	this.button.push(  new Button(95, c.height - 12, 20, 9, null, "decreaseSize") );

    this.button.push(  new Button(122, c.height - 23, 20, 20, 20, "noEffect") );
    this.button.push(  new Button(c.width - 70, c.height - 23, 20, 20, 21, "fitToWindow") );
    this.button.push(  new Button(c.width - 46, c.height - 23, 20, 20, 22, "zoomIn") );
    this.button.push(  new Button(c.width - 22, c.height - 23, 20, 20, 23, "zoomOut") );

    // scrollbar sections
    this.button.push( new Button(c.width - 16, 64, 16, 16, null, "scrollUp") );
    this.button.push(  new Button(c.width - 16, c.height - 74, 16, 16, null, "scrollDown") );
    this.button.push(  new Button(16, c.height - 42, 16, 16, null, "scrollLeft") );
    this.button.push(  new Button(c.width - 48, c.height - 42, 16, 16, null, "scrollRight") );

    // file tab button
  //  this.button[27] = new Button(1, 1, 30, 19, null, "fileMenu");
  this.button[this.currentPalette+4].isSelected = true;
  this.mouse.selected = this.currentPalette+4;
}
function Button(x, y, width, height, icon, func, funcArgs) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.icon = icon;
    this.function = func
	this.functionArguments = funcArgs;
    this.isHovered = false;
    this.isSelected = false;
    this.isClicked = false;
}
Control.prototype.repositionButtons = function () {
    this.createButtons();
    //this.button[this.mouse.selected].isSelected = true;
}

Control.prototype.newFile = function () {
	this.targetSchematic.clear();
	this.targetDisplay.updateRender();
}
Control.prototype.loadFile = function() {
    this.select = "load file";
    this.targetProgram.createOpenPrompt();
}
Control.prototype.saveAsJSON = function() {
    this.select = "save file";
    this.targetProgram.saveJSON();
}
Control.prototype.saveAsImage = function() {
    this.select = "save file";
    this.targetProgram.saveImage();
}

Control.prototype.selectPalette = function(id) {
	this.currentPalette = id;
	this.button[this.mouse.selected].isSelected = false;
    this.mouse.selected = id + 4;
    this.button[this.mouse.selected].isSelected = true;
	this.currentColour = colourComponents(this.targetSchematic.palette[id].colour);
}

Control.prototype.changeColour = function(colourID) {
	var step = 255/100;
	var newValue = 0;
	if (colourID == 0) {
		newValue = Math.floor((this.mouse.x - 244)*step);
	} else if (colourID == 1) {
		newValue = Math.floor((this.mouse.x - 364)*step);
	}  else if (colourID == 2) {
		newValue = Math.floor((this.mouse.x - 484)*step);
	}
	this.currentColour[colourID] = newValue;
	var id = this.currentPalette ;
	var colour = this.currentColour;
	this.targetSchematic.palette[id].colour = toRGBString(colour[0], colour[1], colour[2]);
	this.targetDisplay.updatePalette();
}

Control.prototype.increaseSize = function() {
	this.targetSchematic.increaseSize();
	this.fitToWindow();
	this.targetDisplay.updateRender();
}
Control.prototype.decreaseSize = function() {
	this.targetSchematic.decreaseSize();
	if (this.view.sliceHeight >= this.targetSchematic.height) {
		this.view.sliceHeight = this.targetSchematic.height -1;
	}
	this.fitToWindow();
	this.targetDisplay.updateRender();
}

Control.prototype.fitToWindow = function() {
	var model = this.targetSchematic
    this.select = "fit to window";
    this.view.pixelPerCell = 128;
    this.view.cellPerPixel = 1;

    var maxWorkspaceWidth = this.targetCanvas.width - (this.view.borderLeft + this.view.borderRight);
    var maxWorkspaceHeight = this.targetCanvas.height - (this.view.borderTop + this.view.borderBottom);

    while (this.view.pixelPerCell > maxWorkspaceWidth / model.width && this.view.pixelPerCell > 1) {
        this.view.pixelPerCell = this.view.pixelPerCell / 2;
    }
    while (this.view.pixelPerCell > maxWorkspaceHeight / model.height && this.view.pixelPerCell > 1) {
        this.view.pixelPerCell = this.view.pixelPerCell / 2;
    }
    this.view.cellPerPixel = 1;

    var workspaceWidth = model.width * this.view.pixelPerCell / this.view.cellPerPixel;
    var workspaceHeight = model.height * this.view.pixelPerCell / this.view.cellPerPixel;

    if (workspaceWidth < maxWorkspaceWidth) {
        this.view.x = this.view.borderLeft + (maxWorkspaceWidth - workspaceWidth) / 2;
    }
    if (workspaceHeight < maxWorkspaceHeight) {
        this.view.y = this.view.borderTop + (maxWorkspaceHeight - workspaceHeight) / 2;
    }
    this.view.x = Math.floor(this.view.x);
    this.view.y = Math.floor(this.view.y);
}
