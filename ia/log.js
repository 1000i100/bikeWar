onmessage = function (event) {
	var playerId = event.data.playerId;
	var players = event.data.data.players;
	var stations = event.data.data.stations;
	var trucks = event.data.data.trucks;
	var roads = event.data.data.roads;
	var currentTime = event.data.data.currentTime;

	var str = "\n PlayerID = "+JSON.stringify(playerId)
		+"\n players = "+JSON.stringify(players)
		+"\n stations = "+JSON.stringify(stations)
		+"\n trucks = "+JSON.stringify(trucks)
		//+"\n roads = "+JSON.stringify(roads) // graphe cyclique infini
		+"\n currentTime = "+JSON.stringify(currentTime)+"\n\n";
	postMessage({'orders':[],'consoleMessage':str,'error':''});
};
