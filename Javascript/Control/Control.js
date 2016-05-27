const viewTabID = {slice:0, isometric:1, render3D:2, text:3};

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
	this.currentColour = colourComponents(this.targetSchematic.palette[this.currentPalette].colour);

	this.currentTabView = viewTabID.slice;

	this.createButtons();
	this.createKeyboardEventHandlers();
	this.createCanvasEventHandlers();
}
Control.prototype.linkDisplay = function(display) {
    this.targetDisplay=display;
	this.fitToWindow();
}
Control.prototype.createKeyboardEventHandlers = function () {
    var t = this;
    document.onkeydown = function (event) {
        var keyCode;
        if (event === null) {
            keyCode = window.event.keyCode;
        } else {
            keyCode = event.keyCode;
        }

		if (keyCode>47 && keyCode<58) { //numeric key
			var num = keyCode-49;
			if (num<0) num=9;
			if (num < t.targetSchematic.palette.length) {
				t.selectPalette(num);
			}
		}

        switch (keyCode) {
			case 85: // u
                t.newFile();
                break;
			case 73: // i
				t.loadFile();
				break;
			case 79: // o
				t.saveAsJSON();
				break;
			case 80: // p
				t.saveAsImage();
				break;

			case 70: // f
				t.fullscreen();
				break;

            case 65:
            case 37: // a or left arrow
                t.scrollLeft();
                break;
            case 38:
            case 87: // w or up arrow
                t.scrollUp();
                break;
            case 39:
            case 68: // d or right arrow
                t.scrollRight();
                break;
            case 40:
            case 83: // s or down arrow
                t.scrollDown();
                break;

			case 78: // n
				t.increaseSize();
				break;
			case 77: // m
				t.decreaseSize();
				break;
			case 69: // e
				t.shiftViewUp();
				break;
			case 81: // q
				t.shiftViewDown();
				break;

			case 74: // j
				t.fitToWindow();
				break;
			case 75: // k
				t.zoomIn();
				break;
			case 76: // l
				t.zoomOut();
				break;
        }
    };
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
    if (this.mouse.isOverButton === false && this.currentTabView === viewTabID.slice) {
        this.checkLattice();
    }
    this.targetDisplay.refresh();
}
Control.prototype.checkLattice = function () {
    this.mouse.isOverWorkspace = true;
    var cellSize = this.view.cellPerPixel/(this.view.pixelPerCell+1);
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

function View() {
    this.offsetX = 0;
    this.offsetY = 48;
    this.x = this.offsetX;
    this.y = this.offsetY;

    this.borderTop = 48;
    this.borderLeft = 0;
    this.borderRight = 232;
    this.borderBottom = 48;

    this.pixelPerCell = 16;
    this.cellPerPixel = 1;

	this.sliceHeight = 0;
}

Control.prototype.createButtons = function () {
    var c = this.targetCanvas;
    var t = this;
	this.button = [];
    // file modification
    this.button.push( new Button(2, 24, 22, 22, 0, "U", "newFile") );
    this.button.push( new Button(26, 24, 22, 22, 1, "I", "loadFile") );
    this.button.push( new Button(50, 24, 22, 22, 2, "O", "saveAsJSON") );
	this.button.push( new Button(74, 24, 22, 22, 5, "P", "saveAsImage") );

	// viewport options
	this.button.push( new Button(155, 24, 36, 22, null, "", "toggleMainView", viewTabID.slice) );
	this.button.push( new Button(195, 24, 56, 22, null, "", "toggleMainView", viewTabID.isometric) );
	this.button.push( new Button(255, 24, 55, 22, null, "", "toggleMainView", viewTabID.render3D) );
	this.button.push( new Button(315, 24, 42, 22, null, "", "toggleMainView", viewTabID.text) );

    // palette
	var palette = this.targetSchematic.palette;
	var px = this.targetCanvas.width-203;
	var py = 497;
	var x=0, y=0;
	for (var i=0; i<palette.length; i++) {
		this.button.push(  new Button(px+x*24, py+y*24, 22, 22, null, i+1, "selectPalette", i) );
		x++;
		if (x>7) {
			x=0;
			y++;
		}
	}
	// edit palette buttons
	this.button.push(  new Button(px+x*24, py+y*24, 22, 22, 11, "", "extendPalette") );
	this.button.push(  new Button(c.width-33, 286, 22, 22, 7, "", "removePalette") );

	// rotation buttons
	this.button.push( new Button(c.width-214, 240, 22, 22, 8, "", "rotateRender", -1) );
    this.button.push( new Button(c.width-23, 240, 22, 22, 9, "", "rotateRender", 1) );

	// colour sliders
	this.button.push(  new Button(px+20, 370, 160, 22, null, "", "changeColour", 0) );
	this.button.push(  new Button(px+20, 400, 160, 22, null, "", "changeColour", 1) );
	this.button.push(  new Button(px+20, 430, 160, 22, null, "", "changeColour", 2) );

    // viewport controls
    this.button.push(  new Button(c.width - 21, 1, 20, 20, 10, "F", "fullscreen") );

    this.button.push(  new Button(c.width - this.view.borderRight, 48, 16, 16, 12, "W", "scrollUp") );
    this.button.push(  new Button(c.width - this.view.borderRight, c.height - 58, 16, 16, 13, "S", "scrollDown") );
    this.button.push(  new Button(0, c.height - 42, 16, 16, 14, "A", "scrollLeft") );
    this.button.push(  new Button(c.width - (16+this.view.borderRight), c.height - 42, 16, 16, 15, "D", "scrollRight") );

    // size and scale
    this.button.push(  new Button(3, c.height - 23, 20, 20, 16, "", "trimEdges") );
	this.button.push(  new Button(23, c.height - 23, 20, 20, null, "", "increaseSize", [2,0,0]) );
	this.button.push(  new Button(47, c.height - 23, 20, 20, null, "", "increaseSize", [0,1,0]) );
	this.button.push(  new Button(71, c.height - 23, 20, 20, null, "", "increaseSize", [0,0,2]) );

	this.button.push(  new Button(95, c.height - 23, 20, 9, 3, "N", "increaseSize") );
	this.button.push(  new Button(95, c.height - 12, 20, 9, 4, "M", "decreaseSize") );

	this.button.push(  new Button(440, c.height - 23, 20, 9, 3, "E", "shiftViewUp") );
	this.button.push(  new Button(440, c.height - 12, 20, 9, 4, "Q", "shiftViewDown") );

    this.button.push(  new Button(152, c.height - 23, 20, 20, 17, "", "noEffect") );
    this.button.push(  new Button(c.width - 70, c.height - 23, 20, 20, 18, "J", "fitToWindow") );
    this.button.push(  new Button(c.width - 46, c.height - 23, 20, 20, 19, "K", "zoomIn") );
    this.button.push(  new Button(c.width - 22, c.height - 23, 20, 20, 20, "L", "zoomOut") );

    // scrollbar sections
    this.button.push( new Button(c.width - this.view.borderRight, 64, 16, 16, null, "W", "scrollUp") );
    this.button.push(  new Button(c.width - this.view.borderRight, c.height - 74, 16, 16, null, "S", "scrollDown") );
    this.button.push(  new Button(16, c.height - 42, 16, 16, null, "A", "scrollLeft") );
    this.button.push(  new Button(c.width - (32+this.view.borderRight), c.height - 42, 16, 16, null, "D", "scrollRight") );

    // file tab button
  //  this.button[27] = new Button(1, 1, 30, 19, null, "fileMenu");
  this.button[4].isSelected = true;
  this.button[this.currentPalette+8].isSelected = true;
  this.mouse.selected = this.currentPalette+4;
}
function Button(x, y, width, height, icon, hotkey, func, funcArgs) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.icon = icon;
	this.hotkey = hotkey;
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

// file handling
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

Control.prototype.toggleMainView = function(newView) {
	this.button[this.currentTabView+4].isSelected = false;
	this.button[newView+4].isSelected = true;
	this.currentTabView = newView;
	this.fitToWindow();
}

// rotate isometric render
Control.prototype.rotateRender = function(direc) {
	var rotation = this.targetDisplay.render.rotation;
	rotation += direc;
	if (rotation < 0) rotation = 3;
	if (rotation > 3) rotation = 0;
	this.targetDisplay.render.rotation = rotation;
	this.targetDisplay.minimap.rotation = rotation;
	this.targetDisplay.updateRender();
}

// palette editing
Control.prototype.selectPalette = function(id) {
	this.currentPalette = id;
	this.button[this.mouse.selected].isSelected = false;
    this.mouse.selected = id + 8;
    this.button[this.mouse.selected].isSelected = true;
	this.currentColour = colourComponents(this.targetSchematic.palette[id].colour);
}
Control.prototype.extendPalette = function() {
	this.currentPalette = this.targetSchematic.palette.length;
	this.targetSchematic.extendPalette();
	this.repositionButtons();

	this.button[this.mouse.selected].isSelected = false;
    this.mouse.selected = this.currentPalette + 4;
    this.button[this.mouse.selected].isSelected = true;
	this.currentColour = colourComponents(this.targetSchematic.palette[this.currentPalette].colour);
	this.targetDisplay.updatePalette();

}

Control.prototype.removePalette = function() {
	if (this.currentPalette>0) {
		this.targetSchematic.removePaletteEntry(this.currentPalette);

		this.currentPalette = 0;
		this.repositionButtons();
		this.button[this.mouse.selected].isSelected = false;
	    this.mouse.selected = this.currentPalette + 4;
	    this.button[this.mouse.selected].isSelected = true;
		this.currentColour = colourComponents(this.targetSchematic.palette[this.currentPalette].colour);
		this.targetDisplay.updatePalette();
	}
}

Control.prototype.changeColour = function(colourID) {
	var targetButton = this.button[this.mouse.newSelected];
	var step = 255/targetButton.width;
	var newValue = Math.floor((this.mouse.x - targetButton.x)*step);

	this.currentColour[colourID] = newValue;
	var id = this.currentPalette ;
	var colour = this.currentColour;
	this.targetSchematic.palette[id].colour = toRGBString(colour[0], colour[1], colour[2]);
	this.targetDisplay.updatePalette();
}

// move view
Control.prototype.fullscreen = function() {
    this.select = "fullscreen";

    if (!document.mozFullScreen && !document.webkitFullScreen) {
        if (this.targetCanvas.mozRequestFullScreen) {
            this.targetCanvas.mozRequestFullScreen();
        } else {
            this.targetCanvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else {
            document.webkitCancelFullScreen();
        }
    }
}
Control.prototype.scrollUp = function() {
    this.select = "scroll up";
    this.view.y += this.view.pixelPerCell;
}
Control.prototype.scrollDown = function() {
    this.select = "scroll down";
    this.view.y -= this.view.pixelPerCell;
}
Control.prototype.scrollLeft = function() {
    this.select = "scroll left";
    this.view.x += this.view.pixelPerCell;
}
Control.prototype.scrollRight = function() {
    this.select = "scroll right";
    this.view.x -= this.view.pixelPerCell;
}

// change schematic size
Control.prototype.increaseSize = function(axis) {
	if (axis) {
		this.targetSchematic.changeSize(axis[0],axis[1],axis[2]);
	} else {
		this.targetSchematic.changeSize(2,2,2);
		this.view.sliceHeight++;
	}

	this.fitToWindow();
	this.targetDisplay.minimap.resizeTileSize(200,200);
	this.targetDisplay.updateRender();
}
Control.prototype.decreaseSize = function() {
	this.targetSchematic.decreaseSize(2,2,2);
	if (this.view.sliceHeight >= this.targetSchematic.height) {
		this.view.sliceHeight = this.targetSchematic.height -1;
	}
	this.fitToWindow();
	this.targetDisplay.minimap.resizeTileSize(200,200);
	this.targetDisplay.updateRender();
}
Control.prototype.trimEdges = function() {
	this.targetSchematic.trimEdges();
	if (this.view.sliceHeight >= this.targetSchematic.height) this.view.sliceHeight = this.targetSchematic.height-1;
	this.fitToWindow();
	this.targetDisplay.minimap.resizeTileSize(200,200);
	this.targetDisplay.updateRender();
}

Control.prototype.noEffect = function() {
}


// change displayed slice
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

// change zoom level
Control.prototype.fitToWindow = function() {
	var model = this.targetSchematic
    this.select = "fit to window";
    this.view.pixelPerCell = 128;
    this.view.cellPerPixel = 1;

    var maxWorkspaceWidth = this.targetCanvas.width - (this.view.borderLeft + this.view.borderRight);
    var maxWorkspaceHeight = this.targetCanvas.height - (this.view.borderTop + this.view.borderBottom);

	if (this.currentTabView === viewTabID.isometric) {
		this.targetDisplay.render.resizeTileSize(maxWorkspaceWidth,maxWorkspaceHeight);//maxWorkspaceWidth, maxWorkspaceHeight);
	}

    while (this.view.pixelPerCell > maxWorkspaceWidth / model.width && this.view.pixelPerCell > 1) {
        this.view.pixelPerCell = this.view.pixelPerCell / 2;
    }
    while (this.view.pixelPerCell > maxWorkspaceHeight / model.depth && this.view.pixelPerCell > 1) {
        this.view.pixelPerCell = this.view.pixelPerCell / 2;
    }
    this.view.cellPerPixel = 1;

	if (this.targetDisplay.topdown.tileSize !== this.view.pixelPerCell+1) {
		this.targetDisplay.topdown.tileSize = this.view.pixelPerCell+1;
		this.targetDisplay.updateRender();
	}

    var workspaceWidth = model.width * this.view.pixelPerCell / this.view.cellPerPixel;
    var workspaceHeight = model.depth * this.view.pixelPerCell / this.view.cellPerPixel;

    if (workspaceWidth < maxWorkspaceWidth) {
        this.view.x = this.view.borderLeft + (maxWorkspaceWidth - workspaceWidth) / 2;
    }
    if (workspaceHeight < maxWorkspaceHeight) {
        this.view.y = this.view.borderTop + (maxWorkspaceHeight - workspaceHeight) / 2;
    }
    this.view.x = Math.floor(this.view.x);
    this.view.y = Math.floor(this.view.y);
}
Control.prototype.zoomIn = function () {
    this.select = "zoom in";
    this.view.cellPerPixel = this.view.cellPerPixel / 2;
    if (this.view.cellPerPixel < 1) {
        this.view.cellPerPixel = 1;
        this.view.pixelPerCell = this.view.pixelPerCell * 2;
    }

    this.view.x = this.view.x-this.targetCanvas.width/4; //Math.floor(this.view.x * 2 - this.mouse.x);
    this.view.y = this.view.y-this.targetCanvas.height/4;//Math.floor(this.view.y * 2 - this.mouse.y);
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
