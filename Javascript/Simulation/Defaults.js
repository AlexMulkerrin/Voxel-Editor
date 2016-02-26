const materialID = {gas:0, liquid:1, solid:2};
const materialTransparent = [true, true, false];

function defaultPalette() {
  return [
    {name:"air", symbol:"A", material:"gas", colour:"#ddddff"},
  	{name:"water", symbol:"B", material:"liquid", colour:"#59c9ff"},
  	{name:"block #1", symbol:"C", material:"solid", colour:"#ffff00"},
  	{name:"block #2", symbol:"D", material:"solid", colour:"#ff0000"},

  	{name:"block #3", symbol:"E", material:"solid", colour:"#00ff00"},
  	{name:"block #4", symbol:"F", material:"solid", colour:"#0000ff"},
  	{name:"block #5", symbol:"G", material:"solid", colour:"#000000"},
  	{name:"block #6", symbol:"H", material:"solid", colour:"#ffffff"}
  ]
}
