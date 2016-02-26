function loadProgram() {
	var program = new Program("voxelCanvas");
	program.display.refresh();
	setInterval(function(){program.update();}, program.updateDelay);
}

function Program(canvasName) {
	this.updateDelay = 50;
	this.schematic = new VoxelSchematic(16,16,16);
	//this.schematic.randomise();
	var t = this;
	this.control = new Control(canvasName, this.schematic, t);
	this.display = new Display(canvasName, this.schematic, this.control);
	this.control.linkDisplay(this.display);

}
Program.prototype.update = function() {
	this.display.refresh();
}

Program.prototype.createOpenPrompt = function () {
	var t = this;
	var input = document.createElement('input');
	input.setAttribute("type", "file");
	document.body.appendChild(input);
	input.onchange = function (event) {
		if (getFileNameExtension(input.value) === "png") {
			t.loadEncodedImage(input);
		} else {
			t.loadJSON(input);
		}
		document.body.removeChild(event.target);
	};
	input.click();
}
Program.prototype.loadJSON = function(fileInput) {
	var file = fileInput.files[0];
	var fileReader = new FileReader();
	var t = this;
	fileReader.onload = function(fileLoadedEvent) {
		var loadedText = fileLoadedEvent.target.result;
		var resultJSON = JSON.parse(loadedText);
		t.schematic.readJSON(resultJSON);
		t.control.view.sliceHeight = 0;
		t.display.updatePalette();
	};
	fileReader.readAsText(file, "UTF-8");
}
Program.prototype.loadEncodedImage = function(fileInput) {
	var image = new Image();
	var file = fileInput.files[0];
	var fileReader = new FileReader();
	var t = this;
	fileReader.onload = function(event) {
		image.src = event.target.result;
		image.onload = function() {
			var decodedText = t.decodeTextFromImage(image);
			var resultJSON = JSON.parse(decodedText);
			t.schematic.readJSON(resultJSON);
			t.control.view.sliceHeight = 0;
			t.display.updatePalette();
		}
	};
	fileReader.readAsDataURL(file);
}

Program.prototype.saveJSON = function() {
	var text = this.schematic.createJSON();
	var textBlob = new Blob([text], {type:'text/json'});
	var fileName = "VoxelSchematic.json";
	var textData = window.URL.createObjectURL(textBlob);
	this.createDownloadPrompt(fileName, textData);
}
Program.prototype.saveImage = function() {
	var schematicImage = this.display.getRenderImage();
	var text = this.schematic.createJSON();
	var encodedImage = this.encodeTextIntoImage(schematicImage, text);

    var imageData = encodedImage.toDataURL("image/png");
	var fileName = "VoxelSchematic";
	this.createDownloadPrompt(fileName, imageData);
}
Program.prototype.createDownloadPrompt = function(name, contents) {
	var link = document.createElement("a");
	link.download = name;
	link.innerHTML = "Download File";
	link.href = contents;
	link.onclick = function(event) {
		document.body.removeChild(event.target);
	};
	link.style.display = "none";
	document.body.appendChild(link);
	link.click();
}

Program.prototype.encodeTextIntoImage = function(canvas, text) {
	// prepare image for data insertion
	var ctx = canvas.getContext("2d");
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
	var mask2bit = parseInt("11111100",2);
	var mask3bit = parseInt("11111000",2);
	// set 2 least significant bits to zero
	for (var i=0; i<data.length; i+=4) {
      data[i] = data[i] & mask2bit;
	  data[i+1] = data[i+1] & mask3bit;
	  data[i+2] = data[i+2] & mask3bit;
    }
	// split text into bit pairs to insert into image data
	var charCode;
	var redPair, greenTriplet, blueTriplet;
	var redMask = 	parseInt("11000000",2);
	var greenMask = parseInt("00111000",2);
	var blueMask = 	parseInt("00000111",2);
	for (var j=0; j<text.length; j++) {
		charCode = text.charCodeAt(j);
		redPair = (charCode & redMask) >> 6;
		data[j*4] += redPair;

		greenTriplet = (charCode & greenMask) >> 3;
		data[j*4+1] += greenTriplet;

		blueTriplet = (charCode & blueMask);
		data[j*4+2] += blueTriplet;
	}
	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = canvas.width;
	tempCanvas.height = canvas.height;
	var tempctx = tempCanvas.getContext("2d");
    tempctx.putImageData(imageData, 0, 0);
	return tempCanvas;
}
Program.prototype.decodeTextFromImage = function(image) {
	var resultText = "";
	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = image.width;
	tempCanvas.height = image.height;
	var ctx = tempCanvas.getContext("2d");
	ctx.drawImage(image, 0, 0);
	var imageData = ctx.getImageData(0, 0, image.width, image.height);
	var data = imageData.data;

	var isEndofData = false;
	var charCode, char;
	var redPair, greenTriplet, blueTriplet;
	var mask2bit = parseInt("00000011",2);
	var mask3bit = parseInt("00000111",2);
	for (var i=0; i<data.length && !isEndofData; i += 4) {
		redPair = (data[i] & mask2bit) << 6;
		greenTriplet = (data[i+1] & mask3bit) << 3;
		blueTriplet = (data[i+2] & mask3bit);

		charCode = redPair + greenTriplet + blueTriplet;
		//if (i<80) console.log(redPair +","+ greenTriplet +","+ blueTriplet +"="+charCode);
		if (charCode == 0) {
			isEndofData = true;
		} else {
			resultText += String.fromCharCode(charCode);
		}
	}
	//console.log(resultText);
	return resultText;
}
