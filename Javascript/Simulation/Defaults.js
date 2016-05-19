const materialID = {none:0, transparent:1, solid:2, halfBlock:3, item:4, air:0, liquid:1};
const materialTransparent = [true, true, false, true, true];
const textureID = {brick:0,cobblestone:1,dirt:2,glass:3,grass:4,leaves:5,log:6,planks:7,sand:8,stone:9,water:10,wool:11};


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
		{name:"sapling", 	material:"wood", 	colour:"#46cf2d", model:"solid",		texture:"stone"},//"sapling"},
		{name:"bedrock", 	material:"rock", 	colour:"#373737", model:"solid",		texture:"stone"},//"bedrock"},
		{name:"water", 		material:"water", 	colour:"#59c9ff", model:"transparent",	texture:"water"},
		{name:"still water",material:"water", 	colour:"#59c9ff", model:"transparent",	texture:"water"},
		{name:"lava", 		material:"rock", 	colour:"#ff3700", model:"transparent",	texture:"stone"},//"lava"},
		{name:"still lava", material:"rock", 	colour:"#ff3700", model:"transparent",	texture:"stone"},//"lava"},
		{name:"sand", 		material:"rock", 	colour:"#ffffd1", model:"solid",		texture:"sand"},
		{name:"gravel", 	material:"rock", 	colour:"#a5a1a1", model:"solid",		texture:"stone"},//"gravel"},
		{name:"gold ore", 	material:"metal", 	colour:"#fcee4b", model:"solid",		texture:"stone"},//"ore"},
		{name:"iron ore", 	material:"metal", 	colour:"#eeeeee", model:"solid",		texture:"stone"},//"ore"},
		{name:"coal ore", 	material:"organic", colour:"#373737", model:"solid",		texture:"stone"},//"ore"},
		{name:"tree trunk", material:"wood", 	colour:"#79553a", model:"solid",		texture:"log"},
		{name:"leaves", 	material:"wood", 	colour:"#46cf2d", model:"transparent",	texture:"leaves"},
		{name:"sponge", 	material:"plant", 	colour:"#fcee4b", model:"solid",		texture:"stone"},//"sponge"},
		{name:"glass", 		material:"rock", 	colour:"#ffffff", model:"transparent",	texture:"glass"},
		{name:"red wool", 	material:"wool", 	colour:"#ff0000", model:"solid",		texture:"wool", customColour:true},
		{name:"orange wool",material:"wool", 	colour:"#ffcc00", model:"solid",		texture:"wool", customColour:true},
		{name:"yellow wool",material:"wool", 	colour:"#ffff00", model:"solid",		texture:"wool", customColour:true},
		{name:"lime wool", 	material:"wool", 	colour:"#eeffee", model:"solid",		texture:"wool", customColour:true},
		{name:"green wool", material:"wool", 	colour:"#00ff00", model:"solid",		texture:"wool", customColour:true},
		{name:"aqua wool", 	material:"wool", 	colour:"#00ffcc", model:"solid",		texture:"wool", customColour:true},
		{name:"cyan wool", 	material:"wool", 	colour:"#00ccff", model:"solid",		texture:"wool", customColour:true},
		{name:"blue wool", 	material:"wool", 	colour:"#0000ff", model:"solid",		texture:"wool", customColour:true},
		{name:"purple wool",material:"wool", 	colour:"#cc00ff", model:"solid",		texture:"wool", customColour:true},
		{name:"indigo wool",material:"wool", 	colour:"#cc00cc", model:"solid",		texture:"wool", customColour:true},
		{name:"violet wool",material:"wool", 	colour:"#ff00cc", model:"solid",		texture:"wool", customColour:true},
		{name:"magenta wool",material:"wool", 	colour:"#ff00ff", model:"solid",		texture:"wool", customColour:true},
		{name:"pink wool", 	material:"wool", 	colour:"#ffccff", model:"solid",		texture:"wool", customColour:true},
		{name:"black wool", material:"wool", 	colour:"#111111", model:"solid",		texture:"wool", customColour:true},
		{name:"grey wool", 	material:"wool", 	colour:"#aaaaaa", model:"solid",		texture:"wool", customColour:true},
		{name:"white wool", material:"wool", 	colour:"#ffffff", model:"solid",		texture:"wool", customColour:true},/*
		{name:"daisy", 		material:"plant", 	colour:"#ffff00", model:"item",			texture:"daisy"},
		{name:"rose", 		material:"plant", 	colour:"#ff0000", model:"item",			texture:"rose"},
		{name:"brown mushroom",material:"plant",colour:"#aa9988", model:"item",			texture:"brownMushroom"},
		{name:"red mushroom",material:"plant", 	colour:"#aa0000", model:"item",			texture:"redMushroom"},
		{name:"gold block", material:"metal", 	colour:"#fcee4b", model:"solid",		texture:"gold"},
		{name:"iron block", material:"metal", 	colour:"#dddddd", model:"solid",		texture:"iron"},
		{name:"double slab", material:"rock", 	colour:"#7f7f7f", model:"solid",		texture:"double slab"},
		{name:"slab", 		material:"rock", 	colour:"#7f7f7f", model:"halfBlock",	texture:"slab"},
		{name:"brick", 		material:"rock", 	colour:"#aa9988", model:"solid",		texture:"brick"},
		{name:"bomb", 		material:"other", 	colour:"#ff0000", model:"solid",		texture:"bomb"},
		{name:"bookshelf", 	material:"wood", 	colour:"#ffffd1", model:"solid",		texture:"bookshelf"},
		{name:"moss stone", material:"rock", 	colour:"#224422", model:"solid",		texture:"mossStone"},
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
