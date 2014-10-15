#= require ./bikeWarUtils.coffee
if !exports
	exports = this
msg=''
exports.onmessage = (event) ->
	if event.data
		monId = event.data.playerId
		donnéesDuTour = event.data.data
		actions = []
		msg=''
		try
			actions = queFaireAvec(monId, donnéesDuTour)
		catch e
			msg = 'Error : ' + e
		exports.postMessage(
			orders:actions
			consoleMessage:msg
			error:''
		)
	#else exports.postMessage("data null")

queFaireAvec = (monId, mondeActuel) ->
	actions = []
	mesCamions = getMesCamions(monId,mondeActuel.trucks)
	mesCamionsDispo = getCamionsArrêtés(mesCamions)

	for camion in mesCamionsDispo
		#msg += "\n\n"+'Camion : '+camion.bikeNum+'/'+CAPACITÉ_CAMION+ 'deltaPlein:'+deltaCible(camion,1)
		#msg += "\n"+'Station : '+camion.currentStation.bikeNum+'/'+camion.currentStation.slotNum+ 'deltaEquilibre:'+deltaCible(camion.currentStation)

		# si le camion peu réguler la station ou il se trouve pour la rapprocher de l'équillibre, il le fait.
		if deltaCible(camion,1) >= 1 && deltaCible(camion.currentStation) <= -2
			actions.push(
				construireOrdre(camion, 'load', camion.currentStation,
					Math.min(Math.floor(-deltaCible(camion.currentStation)), deltaCible(camion,1))
				)
			)
		else if deltaCible(camion,0) <= -1 && deltaCible(camion.currentStation) >= 2
			actions.push(
				construireOrdre(camion, 'unload', camion.currentStation,
					Math.min(Math.floor(deltaCible(camion.currentStation)), -deltaCible(camion,0))
				)
			)
		else if deltaCible(camion.currentStation,.75)>1 && deltaCible(camion.currentStation,.25)<-1 && (!camion.currentStation.owner || camion.currentStation.owner.id != monId)
			construireOrdre(camion, 'load', camion.currentStation,0)

		else
			# il va falloir bouger
			if deltaCible(camion)>0 # on cherche des stations trop remplie
				stationsCandidates = filtrerParTauxDeRemplissage(mondeActuel.stations,.5)
			else # on cherche des stations trop vide
				stationsCandidates = filtrerParTauxDeRemplissage(mondeActuel.stations,0,.5)

			grossesStationsCandidates = getStationsParTaille(stationsCandidates,30)
			mesStationsCandidates = getMesStations(monId,stationsCandidates)
			mesStationsFoireuse = différence( mesStationsCandidates, filtrerParTauxDeRemplissage(mesStationsCandidates,.25,.75) )
			trèsBonCandidats = getStationsEnnemis(monId, grossesStationsCandidates).concat mesStationsFoireuse
			mesStationsBof = différence( mesStationsCandidates, filtrerParTauxDeRemplissage(mesStationsCandidates,.35,.65) )
			bonsCandidats = grossesStationsCandidates.concat getStationsEnnemis(monId, stationsCandidates).concat mesStationsBof
			if trèsBonCandidats.length
				actions.push(
					construireOrdre(camion, 'move', trèsBonCandidats[Math.round(Math.random() * trèsBonCandidats.length)])
				)
			else if bonsCandidats.length
				actions.push(
					construireOrdre(camion, 'move', bonsCandidats[Math.round(Math.random() * bonsCandidats.length)])
				)
			else
				actions.push(
					construireOrdre(camion, 'move', stationsCandidates[Math.round(Math.random() * stationsCandidates.length)])
				)



	###
	grossesStations = getStationsParTaille(mondeActuel.stations,30)
	mesStations = getMesStations(monId,mondeActuel.stations)
	mesStationsFoireuse = différence( mesStations, filtrerParTauxDeRemplissage(mesStations,.25,.75) )
	if mesStationsFoireuse.length
		mesStationsTropRemplies = filtrerParTauxDeRemplissage(mesStationsFoireuse, .5)
		mesCamionsDispoPasAssezRemplis = filtrerParTauxDeRemplissage(mesCamionsDispo, 0, .5)
		if(mesStationsTropRemplies.length && mesCamionsDispoPasAssezRemplis.length)
			actions.push(
				construireOrdre(mesCamionsDispoPasAssezRemplis[0], 'move', mesStationsTropRemplies[0])
			)


	for camion in mesCamionsDispo
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
	###
	return actions

construireOrdre = (camion, instruction, stationCible, quantité)->
	#if(!instruction.match(RegExp(instructionsReconnues.join('|')))) throw 'Ordre non reconnu : '+instruction;
	return {
		truckId:camion.id
		targetStationId:stationCible.id
		type:instruction
		bikeNum:quantité
	}
