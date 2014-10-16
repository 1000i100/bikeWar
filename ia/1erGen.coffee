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

queFaireAvec = (monId, mondeActuel) ->
	actions = []
	mesCamions = getMesCamions(monId,mondeActuel.trucks)
	mesCamionsDispo = getCamionsArrêtés(mesCamions)

	for camion in mesCamionsDispo
		# si le camion peu réguler la station ou il se trouve pour la rapprocher de l'équilibre, il le fait.
		if peutChargerDesVélos(camion) && deltaCible(camion.currentStation) <= -2
			véloAChargerPourÉquilibrer = Math.floor(-deltaCible(camion.currentStation))
			actions.push( chargerAuPlus(camion,véloAChargerPourÉquilibrer) )
		else if peutDéchargerDesVélos(camion) && deltaCible(camion.currentStation) >= 2
			véloAFournirALaStationPourÉquilibrer = Math.floor(deltaCible(camion.currentStation))
			actions.push( déchargerAuPlus(camion,véloAFournirALaStationPourÉquilibrer) )
		else if isStationÉquilibrée(camion.currentStation) && pasAMoi(monId,camion.currentStation)
			rallierStation camion

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
				actions.push allerA(camion, trèsBonCandidats[Math.round(Math.random() * trèsBonCandidats.length)])
			else if bonsCandidats.length
				actions.push allerA(camion, bonsCandidats[Math.round(Math.random() * bonsCandidats.length)])
			else
				actions.push allerA(camion, stationsCandidates[Math.round(Math.random() * stationsCandidates.length)])

	return actions

peutChargerDesVélos = (camion)->
	maxChargeable(camion)?
peutDéchargerDesVélos = (camion)->
	maxDéchargeable(camion)?
pasAMoi = (monId, entité)->
	!entité.owner || entité.owner.id != monId
