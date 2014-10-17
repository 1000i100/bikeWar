CAPACITÉ_CAMION = 10
VITESSE_CAMION = 60
#= include ./indexTempsTrajet.coffee

tendanceStation = (station, time )-> #non testé, interface a redéfinir pour prévoir plusieurs tours à l'avance
	currentIndex = time.getHours()   4 +  Math.floor(  time.getMinutes()   4 / 60 )
	nextIndex = currentIndex + 1
	if nextIndex + 1 > station.profile.length
		nextIndex = 0
	station.profile[nextIndex] - station.profile[currentIndex]

# extraction de données
isStationÉquilibrée = (station)->
	(station.bikeNum > station.slotNum/4 && station.bikeNum < station.slotNum/4*3)
isStationSecure = (station, sécurité)->
	deltaCible(station, .75) >= sécurité && deltaCible(station, .25) <= -sécurité

deltaCible = (entité,tauxCible=.5)->
	getCapacité(entité)*tauxCible - entité.bikeNum
getCapacité = (entité)->
	entité.slotNum || CAPACITÉ_CAMION
getStation = (camion)->
	camion.currentStation || camion.destination

# selection de stations
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
		sélectionné = false if(min && e.slotNum<min)
		sélectionné = false if(max && e.slotNum>max)
		return sélectionné
getMesCamions = (monId, camions)->
	camions.filter (e)->
		e.owner && e.owner.id == monId
getCamionsAdverses = (monId, camions)->
	camions.filter (e)->
		e.owner && e.owner.id != monId

getMonAutreCamion = (camion, mesCamions)->
	tab1 = mesCamions.filter (e)->
		e.id != camion.id
	return tab1[0]
getCamionsArrêtés = (camions)->
	camions.filter (e)->
		e.currentStation
getCamionsEnMouvement = (camions)->
	camions.filter (e)->
		e.destination
filtrerParTauxDeRemplissage = (entités, tauxMin=false, tauxMax=false)->
	entités.filter (e)->
		sélectionné = true
		sélectionné = false if(tauxMin && e.bikeNum/getCapacité(e)<tauxMin)
		sélectionné = false if(tauxMax && e.bikeNum/getCapacité(e)>tauxMax)
		return sélectionné

# tri de stations
trierStationsParTaille = (stations, croissant=false)->
	triCroissant = (a,b)->
		a.slotNum - b.slotNum
	triDécroissant = (a,b)->
		b.slotNum - a.slotNum
	if croissant
		return stations.sort triCroissant
	else
		return stations.sort triDécroissant

# non testé
trierStationsParTempsDeTrajet = (camion, stations, croissant=true)->
	stationDeDépart = getStation(camion)
	triCroissant = (a,b)->
		tempsTrajet(stationDeDépart, a) - tempsTrajet(stationDeDépart, b)
	triDécroissant = (a,b)->
		tempsTrajet(stationDeDépart, b) - tempsTrajet(stationDeDépart, a)
	if croissant
		return stations.sort triCroissant
	else
		return stations.sort triDécroissant

# non testé
trierStationsParTailleEtTemps = (camion, stations, pondérationTemps=1, pondérationTaille=1)->
	stationDeDépart = getStation(camion)
	return stations.sort (a,b)->
		(tempsTrajet(stationDeDépart, a) - tempsTrajet(stationDeDépart, b))*pondérationTemps + (b.slotNum - a.slotNum)*pondérationTaille


# opérations ensembliste
différence = (tableauHôte, tableauASoustraire)->
	tableauHôte.filter (e)->
		!tableauASoustraire.some (e2)->
			JSON.stringify(e2) == JSON.stringify(e)

# Ordres, instructions, actions...
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
	CAPACITÉ_CAMION-camion.bikeNum
maxDéchargeable = (camion)->
	camion.bikeNum

# distance, proximité, temps de déplacement
distanceEntre = (p1,p2) ->
	Math.sqrt(Math.pow(p2.x - p1.x,2) + Math.pow(p2.y - p1.y,2))

tempsTrajet = (stationDépart,stationArrivée)->
	index = stationDépart.id+'_'+stationArrivée.id
	indexInversé = stationArrivée.id+'_'+stationDépart.id
	return indexTempsTrajet[index] || indexTempsTrajet[indexInversé] || 999999
