CAPACITÉ_CAMION = 10

getStationsEnnemis = (monId, stations)->
	stations.filter (e)->
		e.owner && e.owner.id != monId
getMesStations = (monId, stations)->
	stations.filter (e)->
		e.owner && e.owner.id == monId
getStationsNeutre = (stations)->
	stations.filter (e)->
		!e.owner
getStationsParTaille = (stations, min=false, max=false)->
	stations.filter (e)->
		sélectionné = true
		sélectionné = false if min && e.slotNum<min
		sélectionné = false if max && e.slotNum>max
		return sélectionné
getMesCamions = (monId, camions)->
	camions.filter (e)->
		e.owner && e.owner.id == monId
getCamionsArrêtés = (camions)->
	camions.filter (e)->
		e.currentStation
getCamionsEnMouvement = (camions)->
	camions.filter (e)->
		e.destination
filtrerParTauxDeRemplissage = (entités, tauxMin=false, tauxMax=false)->
	entités.filter (e)->
		sélectionné = true
		sélectionné = false if tauxMin && e.bikeNum/getCapacité(e)<tauxMin
		sélectionné = false if tauxMax && e.bikeNum/getCapacité(e)>tauxMax
		return sélectionné
isStationÉquilibrée = (station)->
	station.bikeNum > station.slotNum/4 && station.bikeNum < station.slotNum/4*3
deltaCible = (entité,tauxCible=.5)->
	getCapacité(entité)*tauxCible - entité.bikeNum
getCapacité = (entité)->
	entité.slotNum || CAPACITÉ_CAMION

différence = (tableauHôte, tableauASoustraire)->
	tableauHôte.filter (e)->
		!tableauASoustraire.some (e2)->
			JSON.stringify(e2) == JSON.stringify(e)

#Ordres, instructions, actions...
chargerAuPlus = (camion,nombreVélo)->
	charger(camion, Math.min(nombreVélo, maxChargeable(camion)))
déchargerAuPlus = (camion,nombreVélo=0)->
	décharger(camion, Math.min(nombreVélo, maxDéchargeable(camion)))
charger = (camion,nombreVélo=0)->
	construireOrdre(camion, 'load', camion.currentStation, nombreVélo)
décharger = (camion,nombreVélo=0)->
	construireOrdre(camion, 'unload', camion.currentStation, nombreVélo)
rallierStation = (camion)->
	construireOrdre(camion, 'load', camion.currentStation, 0)
allerA = (camion, station)->
	construireOrdre(camion, 'move', station)
construireOrdre = (camion, instruction, stationCible, quantité=0)->
	ordre =
		truckId:camion.id
		targetStationId:stationCible.id
		type:instruction
	ordre.bikeNum = quantité if instruction!='move'
	return ordre

maxChargeable = (camion)->
	CAPACITÉ_CAMION - camion.bikeNum
maxDéchargeable = (camion)->
	camion.bikeNum
