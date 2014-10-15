#= require ./bikeWarUtils.coffee

monId = 0
TRUCK_NUM_SLOT = 10
if !exports
	exports = this
exports.onmessage = (event) ->
	if event.data
		monId = event.data.playerId
		donnéesDuTour = event.data.data
		actions = []
		msg=''
		try
			actions = queFaire(donnéesDuTour)
		catch e
			msg = 'Error : ' + e
		exports.postMessage(
			orders:actions
			consoleMessage:msg
			error:''
		)
	else postMessage("data null")

queFaire = (mondeActuel) ->
	actions = []
	for camion in mondeActuel.trucks
		if camion.owner.id == monId && camion.currentStation != null
			if !camion.currentStation.owner || (camion.currentStation.owner && camion.currentStation.owner.id != monId)
				if camion.currentStation.bikeNum < camion.currentStation.slotNum / 4
					if camion.bikeNum > 0
						actions.push(construireOrdre(camion, 'unload', camion.currentStation,1))
				else if camion.currentStation.bikeNum > camion.currentStation.slotNum / 4 * 3
					if camion.bikeNum < TRUCK_NUM_SLOT
						actions.push(construireOrdre(camion, 'load', camion.currentStation,1))
				else if hasStationEnoughBike(camion.currentStation)
					if camion.bikeNum < TRUCK_NUM_SLOT
						actions.push(construireOrdre(camion, 'load', camion.currentStation,1))
			else
				stationsEnnemies = getStationEnnemis(monId, mondeActuel.stations)
				if stationsEnnemies.length
					actions.push(
						construireOrdre(camion, 'move', stationsEnnemies[Math.round(Math.random() * stationsEnnemies.length)])
					)
	return actions

construireOrdre = (camion, instruction, stationCible, quantité)->
	#if(!instruction.match(RegExp(instructionsReconnues.join('|')))) throw 'Ordre non reconnu : '+instruction;
	return {
		truckId:camion.id
		targetStationId:stationCible.id
		type:instruction
		bikeNum:quantité
	}

hasStationEnoughBike = (station)->
	return station.bikeNum > station.slotNum/4 && station.bikeNum < station.slotNum/4*3
