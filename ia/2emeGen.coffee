###
constante modifiable pour trouver des réglages pus efficaces
###
ÉCART_MAX_ÉQUILIBRE_STATION_SANS_CHARGEMENT = 3 # en nombre de vélos
ÉCART_MAX_ÉQUILIBRE_CAMION_SANS_CHARGEMENT = 2 # en nombre de vélos

ÉCART_DANGER_CAPTURE = 1 # en nombre de vélos

ÉCART_DANGER_CHOIX_STATION = 3 # en nombre de vélos
ÉCART_ÉQUILIBRE_CHOIX_STATION_AIDABLE = 3 # en nombre de vélos
ÉCART_DANGER_CHOIX_STATION_RÉCUPÉRABLE = 2 # en nombre de vélos

DISTANCE_MIN_ENTRE_MES_CAMIONS = 5 # en tours de temps de trajet
DISTANCE_MIN_AVEC_CAMIONS_ADVERSES = 4 # en tours de temps de trajet

DISTANCE_SUPPLÉMENTAIRE_MAX_CHOIX_STATION = 2 # en tours de temps de trajet
TAUX_DISTANCE_SUPPLÉMENTAIRE_MAX_CHOIX_STATION = 1.2
NOMBRE_MIN_STATION_A_BONNE_DISTANCE = 10



if !exports
	exports = this
msg=''
###
# compteur pour statistiques
###
statistiquesActivées = true

trèsBonsDéplacements = bonsDéplacements = déplacementsParDéfaut = déplacementsAvorté = 0
minTrajet = 99999
maxTrajet = totalTrajet = 0
chargement = déchargement = capture = repartiSansCapture = 0

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

		if statistiquesActivées
			msg+='choix cible : '+trèsBonsDéplacements+'/'+bonsDéplacements+'/'+déplacementsParDéfaut+'/'+déplacementsAvorté
			nombreDéplacements = trèsBonsDéplacements+bonsDéplacements+déplacementsParDéfaut
			moyenneTrajet = Math.round(100*totalTrajet/nombreDéplacements)/100
			msg+=' temps trajets : '+minTrajet+'/'+moyenneTrajet+'/'+maxTrajet
			msg+=' actions station : '+chargement+'/'+déchargement+'/'+capture+'/'+repartiSansCapture
		#msg+='\n'+JSON.stringify(actions)
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
		# msg += '>>>peutCharger:'+peutChargerDesVélos(camion)+' peutDécharger:'+peutDéchargerDesVélos(camion)+', '+camion.currentStation.bikeNum+'/'+camion.currentStation.slotNum+' delta:'+deltaCible(camion.currentStation)+'<<<\n'

		if(peutChargerDesVélos(camion) && (aTropDeVélos(camion.currentStation, ÉCART_MAX_ÉQUILIBRE_STATION_SANS_CHARGEMENT) || (aTropDeVélos(camion.currentStation) && aBesoinDeVélos(camion,ÉCART_MAX_ÉQUILIBRE_CAMION_SANS_CHARGEMENT))))
			véloAChargerPourÉquilibrer = Math.floor(-deltaCible(camion.currentStation))
			chargement++
			actions.push( chargerAuPlus(camion,véloAChargerPourÉquilibrer) )
		else if(peutDéchargerDesVélos(camion) && (aBesoinDeVélos(camion.currentStation, ÉCART_MAX_ÉQUILIBRE_STATION_SANS_CHARGEMENT) || (aBesoinDeVélos(camion.currentStation) && aTropDeVélos(camion,ÉCART_MAX_ÉQUILIBRE_CAMION_SANS_CHARGEMENT))))
			véloAFournirALaStationPourÉquilibrer = Math.floor(deltaCible(camion.currentStation))
			déchargement++
			actions.push( déchargerAuPlus(camion,véloAFournirALaStationPourÉquilibrer) )
		else if(isStationSecure(camion.currentStation, ÉCART_DANGER_CAPTURE) && pasAMoi(monId,camion.currentStation))
			capture++
			actions.push( rallierStation(camion) )

		else
			repartiSansCapture++ if pasAMoi(monId,camion.currentStation)
			# il va falloir bouger
			stationsTriéesParTempsDeTrajet = trierStationsParTempsDeTrajet(camion,mondeActuel.stations)
			# On évite que mes deux camions aillent au même endroit
			monAutreCamion = getMonAutreCamion(camion, mesCamions)
			stationsTriéesParTempsDeTrajet = stationsTriéesParTempsDeTrajet.filter (e)->
				return tempsTrajet(getStation(monAutreCamion), e)>=DISTANCE_MIN_ENTRE_MES_CAMIONS

			# On évite aussi qu'il aille là ou sont les camions adverses
			camionsAdverses = getCamionsAdverses(monId,mondeActuel.trucks)
			for autreCamion in camionsAdverses
				stationsTriéesParTempsDeTrajet = stationsTriéesParTempsDeTrajet.filter (e)->
					return tempsTrajet(getStation(autreCamion), e)>=DISTANCE_MIN_AVEC_CAMIONS_ADVERSES


			# on ne retient que les stations les plus proches
			duréeMin = tempsTrajet(camion.currentStation, stationsTriéesParTempsDeTrajet[0])
			duréeMax = duréeMin + Math.max(DISTANCE_SUPPLÉMENTAIRE_MAX_CHOIX_STATION,duréeMin*TAUX_DISTANCE_SUPPLÉMENTAIRE_MAX_CHOIX_STATION)
			stationsFiltrée = stationsTriéesParTempsDeTrajet.filter (e)->
				return tempsTrajet(camion.currentStation, e)<=duréeMax
			if stationsFiltrée.length < NOMBRE_MIN_STATION_A_BONNE_DISTANCE
				stationsFiltrée = stationsTriéesParTempsDeTrajet.slice(0,NOMBRE_MIN_STATION_A_BONNE_DISTANCE)

			# tb station ennemis secure
			ennemiSecure =  getStationsEnnemis(monId, stationsFiltrée).filter (e)->
				isStationSecure(e, ÉCART_DANGER_CHOIX_STATION)

			# b station aidable
			if deltaCible(camion)>0
				# on cherche les stations qui ont de 3 à maxDéchargeable(camion) vélos pour redevenir équilibrée
				#stationsCandidates = filtrerParTauxDeRemplissage(mondeActuel.stations,.5)
				aidable = stationsFiltrée.filter (e)->
					return (deltaCible(e)>=ÉCART_ÉQUILIBRE_CHOIX_STATION_AIDABLE && deltaCible(e)<= maxDéchargeable(camion))
			else
				# on cherche les stations qui ont de 3 à maxChargeable(camion) vélos pour redevenir équilibrée
				#stationsCandidates = filtrerParTauxDeRemplissage(mondeActuel.stations,0,.5)
				aidable = stationsFiltrée.filter (e)->
					return (deltaCible(e) <= -ÉCART_ÉQUILIBRE_CHOIX_STATION_AIDABLE && deltaCible(e) >= -maxChargeable(camion))

			# tb station aidable ennemi
			aidableEnnemi = getStationsEnnemis(monId, aidable)

			# tb mesStations foireuse aidable
			aidableAmi = getMesStations(monId,aidable)
			aidableAmiFoireuse = différence( aidableAmi, filtrerParTauxDeRemplissage(aidableAmi,.25,.75) )

			# b station secure neutre
			neutreSecure = getStationsNeutre(stationsFiltrée).filter (e)->
				isStationSecure(e, ÉCART_DANGER_CHOIX_STATION)

			# station récupérable
			if deltaCible(camion)>0
				récupérable = stationsFiltrée.filter (e)->
					return (deltaCible(e)>=ÉCART_ÉQUILIBRE_CHOIX_STATION_AIDABLE && deltaCible(e, .25)<= maxDéchargeable(camion)+ÉCART_DANGER_CHOIX_STATION_RÉCUPÉRABLE)
			else
				récupérable = stationsFiltrée.filter (e)->
					return (deltaCible(e) <= -ÉCART_ÉQUILIBRE_CHOIX_STATION_AIDABLE && deltaCible(e, .75) >= -maxChargeable(camion)-ÉCART_DANGER_CHOIX_STATION_RÉCUPÉRABLE)

			# b mesStation foireuses récupérable
			récupérableAmi = getMesStations(monId,récupérable)
			récupérableAmiFoireuse  = différence( récupérableAmi, filtrerParTauxDeRemplissage(récupérableAmi,.25,.75) )

			tb = trierStationsParTempsDeTrajet(camion, ennemiSecure.concat aidableEnnemi.concat aidableAmiFoireuse )
			b = trierStationsParTailleEtTemps(camion, aidable.concat neutreSecure.concat récupérableAmiFoireuse )
			if tb.length
				trèsBonsDéplacements++
				statTrajet(camion,tb[0],monId)
				actions.push( allerA(camion, tb[0]) )
			else if b.length
				bonsDéplacements++
				statTrajet(camion,b[0],monId)
				actions.push( allerA(camion, b[0]) )
			else if(stationsFiltrée.length)
				stationsFiltrée = trierStationsParTailleEtTemps(camion, stationsFiltrée)
				déplacementsParDéfaut++
				statTrajet(camion,stationsFiltrée[0],monId)
				actions.push( allerA(camion, stationsFiltrée[0]) )
			else
				déplacementsAvorté++
				msg += 'Je ne sais pas où aller !!!\n'
	return actions

peutChargerDesVélos = (camion)->
	!!maxChargeable(camion)
peutDéchargerDesVélos = (camion)->
	!!maxDéchargeable(camion)
aBesoinDeVélos = (entité, minimumSignificatif=1)->
	deltaCible(entité) >= minimumSignificatif
aTropDeVélos = (entité, minimumSignificatif=1)->
	deltaCible(entité) <= -minimumSignificatif
pasAMoi = (monId, entité)->
	!entité.owner || entité.owner.id != monId
statTrajet = (camion, station, monId)->
	temps = tempsTrajet(camion.currentStation,station)
	if !temps

		msg += '\n\n\n\n'
		msg += 'camion('+camion.bikeNum+'/'+CAPACITÉ_CAMION+')'
		msg += camion.currentStation.name+'('+décrirePropriétaire(monId,camion.currentStation)+','+station.bikeNum+'/'+station.slotNum+')'
		msg += '->'+station.name+'('+décrirePropriétaire(monId,station)+','+station.bikeNum+'/'+station.slotNum+')'
		msg += '\n\n\n\n'
	totalTrajet+=temps
	minTrajet = temps if temps<minTrajet
	maxTrajet = temps if temps>maxTrajet
décrirePropriétaire = (monId,entité)->
	return 'neutre' if !entité.owner
	return 'à moi' if entité.owner.id == monId
	return 'ennemi' if entité.owner.id != monId
	return 'bug'

#= require ./bikeWarUtils.coffee
