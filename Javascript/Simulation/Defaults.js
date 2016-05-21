const materialID = {none:0, transparent:1, solid:2, halfBlock:3, item:4, air:0, liquid:1};
const materialTransparent = [true, true, false, true, true];
const textureID = {bookshelf:0,explosives:1,brick:2,cobblestone:3,dirt:4,
	"red flower":5,"yellow flower":6,glass:7,"gold ore":8,gold:9,grass:10,gravel:11,
	"half block":12,"iron ore":13,iron:14,lava:15,leaves:16,log:17,"mossy cobblestone":18,
	obsidian:19,planks:20,sand:21,sponge:22,stone:23,water:24,wool:25,coal:26,bedrock:27,
	"brown mushroom":28,"red mushroom":29,"two half blocks":30,"sapling":31};


function defaultPalette() {
  return [
    {name:"air", symbol:"A", material:"gas", colour:"#ddddff"},
  	{name:"water", symbol:"B", material:"liquid", colour:"#59c9ff"},
  	{name:"block #1", symbol:"C", material:"solid", colour:"#ffff00"},
  	{name:"block #2", symbol:"D", material:"solid", colour:"#ff0000"},

  	{name:"block #3", symbol:"E", material:"solid", colour:"#00ff00"},
  	{name:"block #4", symbol:"F", material:"solid", colour:"#0000ff"},
  	{name:"block #5", symbol:"G", material:"solid", colour:"#000000"},
  	{name:"block #6", symbol:"H", material:"solid", colour:"#ffffff"},
	{name:"block #7", symbol:"I", material:"solid", colour:"#ff00ff"},
	{name:"block #8", symbol:"J", material:"solid", colour:"#00ffff"}
  ]
}

function creativePalette() {
	return[
		{name:"air", 		material:"air",		colour:"#ddddff", model:"none",			texture:"stone"},//"none"},
		{name:"stone", 		material:"rock", 	colour:"#7f7f7f", model:"solid",		texture:"stone"},
		{name:"grass", 		material:"dirt", 	colour:"#9ccb6c", model:"solid",		texture:"grass"},
		{name:"dirt", 		material:"dirt", 	colour:"#79553a", model:"solid",		texture:"dirt"},
		{name:"cobblestone",material:"rock", 	colour:"#7f7f7f", model:"solid",		texture:"cobblestone"},
		{name:"planks", 	material:"wood", 	colour:"#ffffd1", model:"solid",		texture:"planks"},
		{name:"sapling", 	material:"wood", 	colour:"#46cf2d", model:"solid",		texture:"sapling"},
		{name:"bedrock", 	material:"rock", 	colour:"#373737", model:"solid",		texture:"bedrock"},
		{name:"water", 		material:"water", 	colour:"#59c9ff", model:"semi-trans",	texture:"water"},
		{name:"still water",material:"water", 	colour:"#59c9ff", model:"semi-trans",	texture:"water"},
		{name:"lava", 		material:"rock", 	colour:"#ff3700", model:"semi-trans",	texture:"lava"},
		{name:"still lava", material:"rock", 	colour:"#ff3700", model:"semi-trans",	texture:"lava"},
		{name:"sand", 		material:"rock", 	colour:"#ffffd1", model:"solid",		texture:"sand"},
		{name:"gravel", 	material:"rock", 	colour:"#a5a1a1", model:"solid",		texture:"gravel"},
		{name:"gold ore", 	material:"metal", 	colour:"#fcee4b", model:"solid",		texture:"gold ore"},
		{name:"iron ore", 	material:"metal", 	colour:"#eeeeee", model:"solid",		texture:"iron ore"},
		{name:"coal", 		material:"organic", colour:"#373737", model:"solid",		texture:"coal"},
		{name:"tree trunk", material:"wood", 	colour:"#79553a", model:"solid",		texture:"log"},
		{name:"leaves", 	material:"wood", 	colour:"#46cf2d", model:"semi-trans",	texture:"leaves"},
		{name:"sponge", 	material:"plant", 	colour:"#fcee4b", model:"solid",		texture:"sponge"},
		{name:"glass", 		material:"rock", 	colour:"#ffffff", model:"semi-trans",	texture:"glass"},
		{name:"red wool", 	material:"wool", 	colour:"#F13636", model:"solid",		texture:"wool", customColour:true},
		{name:"orange wool",material:"wool", 	colour:"#F19336", model:"solid",		texture:"wool", customColour:true},
		{name:"yellow wool",material:"wool", 	colour:"#F1F136", model:"solid",		texture:"wool", customColour:true},
		{name:"lime wool", 	material:"wool", 	colour:"#93F136", model:"solid",		texture:"wool", customColour:true},
		{name:"green wool", material:"wool", 	colour:"#36F136", model:"solid",		texture:"wool", customColour:true},
		{name:"aqua wool", 	material:"wool", 	colour:"#36F193", model:"solid",		texture:"wool", customColour:true},
		{name:"cyan wool", 	material:"wool", 	colour:"#36F1F1", model:"solid",		texture:"wool", customColour:true},
		{name:"blue wool", 	material:"wool", 	colour:"#72B1F1", model:"solid",		texture:"wool", customColour:true},
		{name:"purple wool",material:"wool", 	colour:"#8282F1", model:"solid",		texture:"wool", customColour:true},
		{name:"indigo wool",material:"wool", 	colour:"#9336F1", model:"solid",		texture:"wool", customColour:true},
		{name:"violet wool",material:"wool", 	colour:"#BE50F1", model:"solid",		texture:"wool", customColour:true},
		{name:"magenta wool",material:"wool", 	colour:"#F136F1", model:"solid",		texture:"wool", customColour:true},
		{name:"pink wool", 	material:"wool", 	colour:"#F13693", model:"solid",		texture:"wool", customColour:true},
		{name:"black wool", material:"wool", 	colour:"#575757", model:"solid",		texture:"wool", customColour:true},
		{name:"grey wool", 	material:"wool", 	colour:"#9D9D9D", model:"solid",		texture:"wool", customColour:true},
		{name:"white wool", material:"wool", 	colour:"#F1F1F1", model:"solid",		texture:"wool", customColour:true},
		{name:"daisy", 		material:"plant", 	colour:"#ffff00", model:"item",			texture:"yellow flower"},
		{name:"rose", 		material:"plant", 	colour:"#ff0000", model:"item",			texture:"red flower"},
		{name:"brown mushroom",material:"plant",colour:"#aa9988", model:"item",			texture:"brown mushroom"},
		{name:"red mushroom",material:"plant", 	colour:"#aa0000", model:"item",			texture:"red mushroom"},
		{name:"gold block", material:"metal", 	colour:"#fcee4b", model:"solid",		texture:"gold"},
		{name:"iron block", material:"metal", 	colour:"#dddddd", model:"solid",		texture:"iron"},
		{name:"double slab", material:"rock", 	colour:"#7f7f7f", model:"solid",		texture:"two half blocks"},
		{name:"slab", 		material:"rock", 	colour:"#7f7f7f", model:"halfBlock",	texture:"half block"},
		{name:"brick", 		material:"rock", 	colour:"#aa9988", model:"solid",		texture:"brick"},
		{name:"explosives", material:"other", 	colour:"#ff0000", model:"solid",		texture:"explosives"},
		{name:"bookshelf", 	material:"wood", 	colour:"#ffffd1", model:"solid",		texture:"bookshelf"},
		{name:"mossy cobblestone",material:"rock",colour:"#224422",model:"solid",		texture:"mossy cobblestone"},
		{name:"obsidian", 	material:"rock", 	colour:"#000000", model:"solid",		texture:"obsidian"} /*,

		{name:"cobble slab", material:"Ay", 	colour:"#000000", material:"solid"},
		{name:"rope", 		material:"Az", 	colour:"#000000", material:"solid"},
		{name:"sandstone", 	material:"Ba", 	colour:"#000000", material:"solid"},
		{name:"snow", 		material:"Bb", 	colour:"#000000", material:"solid"},
		{name:"fire", 		material:"Bc", 	colour:"#000000", material:"solid"},
		{name:"light pink wool", material:"Bd", 	colour:"#000000", material:"solid"},
		{name:"forest green wool", material:"Be", 	colour:"#000000", material:"solid"},
		{name:"brown wool", material:"Bf", 	colour:"#000000", material:"solid"},
		{name:"darkblue wool", 	material:"Bg", 	colour:"#000000", material:"solid"},
		{name:"turquoise wool", material:"Bh", 	colour:"#000000", material:"solid"},
		{name:"ice", 		material:"Bi", 	colour:"#000000", material:"transparent"},
		{name:"ceramic", 	material:"Bj", 	colour:"#000000", material:"solid"},
		{name:"magma", 		material:"Bk", 	colour:"#000000", material:"solid"},
		{name:"pillar", 	material:"Bl", 	colour:"#000000", material:"solid"},
		{name:"crate", 		material:"Bm", 	colour:"#000000", material:"solid"},
		{name:"stone brick", material:"Bn", 	colour:"#bbbbbb", material:"solid"} */

	]
}
