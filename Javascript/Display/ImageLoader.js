function ImageLoader(display) {
	var textureNames = ["stone", "grass", "dirt", "cobblestone", "planks", "sapling",
	"bedrock", "water", "lava", "sand", "gravel", "gold ore", "iron ore", "coal",
	 "log", "leaves", "sponge", "glass", "wool", "yellow flower", "red flower",
	 "brown mushroom", "red mushroom", "gold", "iron", "two half blocks",
	 "half block", "brick", "explosives", "bookshelf", "mossy cobblestone", "obsidian"];
	this.totalImages = textureNames.length;
	this.loadedImages = 0;
	this.blockImage = [];
	this.targetDisplay = display;

	var t = this;
	for (var i=0; i<textureNames.length; i++) {
		var name = textureNames[i];
		this.blockImage[i] = new Image();
		this.blockImage[i].crossOrigin = "Anonymous";
	    this.blockImage[i].src = "Resources/Images/Isometric Blocks/"+name+".png";

		this.blockImage[i].onload = function() {
			t.loadedImages++;
			if (t.loadedImages === t.totalImages) {
		 		t.targetDisplay.loadHandlerFunction();
	 		}
		}
	}
}
