function ImageLoader(display) {
	var textureNames = ["bookshelf","explosives","brick","cobblestone","dirt",
	"red flower","yellow flower","glass","gold ore","gold","grass","gravel",
	"half block","iron ore","iron","lava","leaves","log","mossy cobblestone",
	"obsidian","planks","sand","sponge","stone","water","wool","coal","bedrock",
	"brown mushroom","red mushroom","two half blocks","sapling"];
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
