onmessage = function (event) {
	var stations = event.data.data.stations;
	var minStation = 9999;
	var maxStation = 0;
	for (var i = 0;i<stations.length;i++){
		if (minStation>stations[i].slotNum) minStation = stations[i].slotNum;
		if (maxStation<stations[i].slotNum) maxStation = stations[i].slotNum;
	}
	var str = "\n Stations : "+minStation+" à "+maxStation+" emplacements"
		+"\n Capacité des camions : "+10 //com.tamina.bikewar.game.Game.TRUCK_NUM_SLOT
		+"\n\n";
	postMessage({'orders':[],'consoleMessage':str,'error':''});
};
