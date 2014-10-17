#= include ./bikeWarUtils.coffee
describe "bikeWarUtils", ->
	beforeEach ->
		jasmine.addMatchers(
			toDeepEqual: ->
				return {
					compare: (actual, expected)->
						return {
							pass: JSON.stringify(actual) == JSON.stringify(expected)
						}
				}
		)
	describe "opérations ensembliste", ->
		it "soustrait un ensemble d'élément à un autre", ->
			ensembleHôte = [1,{plop:4},{plip:4},50]
			ensembleASoustraire = [{plop:4},50]
			ensembleRésultât = [1,{plip:4}]
			expect(différence(ensembleHôte, ensembleASoustraire)).toEqual(ensembleRésultât)

	describe "ordres, instructions, actions...", ->
		it "charge 3 vélo", ->
			camion = {id:1,currentStation:{id:2}}
			ordre = {truckId:1,targetStationId:2,type:'load',bikeNum:3}
			expect(charger(camion,vélo=3)).toEqual(ordre);
		it "charge jusqu'à 3 vélo (2 en pratique pour ne pas dépasser sa capacité maximum", ->
			camion = {id:1,currentStation:{id:2},bikeNum:8}
			ordre = {truckId:1,targetStationId:2,type:'load',bikeNum:2}
			expect(chargerAuPlus(camion,vélo=3)).toEqual(ordre);
		it "décharge jusqu'à 12 vélo (5 en pratique pour ne pas décharger des vélo qu'on a pas", ->
			camion = {id:1,currentStation:{id:2},bikeNum:5}
			ordre = {truckId:1,targetStationId:2,type:'unload',bikeNum:5}
			expect(déchargerAuPlus(camion,vélo=12)).toEqual(ordre);
		it "prend la responsabilité de la station ou le camion se trouve", ->
			camion = {id:1,currentStation:{id:2}}
			ordre = {truckId:1,targetStationId:2,type:'load',bikeNum:0}
			expect(rallierStation(camion)).toEqual(ordre);
		it "déplace un camion jusqu'a une station",->
			camion = {id:1}
			station = {id:2}
			ordre = {truckId:1,targetStationId:2,type:'move'}
			expect(allerA(camion, station)).toEqual(ordre);

	describe "extraction de données", ->
		it "determine si une station à suffisement de vélo", ->
			station = {slotNum:100,bikeNum:50}
			expect(isStationÉquilibrée(station)).toBeTruthy()
		it "determine si une station à un nombre déséquilibré de vélo", ->
			station = {slotNum:100,bikeNum:0}
			expect(isStationÉquilibrée(station)).toBeFalsy()
		it "fourni la station ou est un camion arrêté", ->
			camion = {id:1,currentStation:{id:2}}
			station = {id:2}
			expect(getStation(camion)).toEqual(station)
		it "fourni la station ou va un camion en mouvement", ->
			camion = {id:1,destination:{id:2}}
			station = {id:2}
			expect(getStation(camion)).toEqual(station)

		describe "determine si une station est suffisement équillibré", ->
			it "sans sécurité, frontière haute correcte", ->
				station = {slotNum:100,bikeNum:75}
				expect(isStationSecure(station,securité=0)).toBeTruthy()
			it "sans sécurité, frontière haute incorrecte", ->
				station = {slotNum:100,bikeNum:76}
				expect(isStationSecure(station,securité=0)).toBeFalsy()
			it "avec 1 vélo de sécurité demandé mais non fourni, frontière haute", ->
				station = {slotNum:100,bikeNum:75}
				expect(isStationSecure(station,securité=1)).toBeFalsy()
			it "avec 1 vélo de sécurité demandé et fourni, frontière haute", ->
				station = {slotNum:100,bikeNum:74}
				expect(isStationSecure(station,securité=1)).toBeTruthy()
			it "sans sécurité, frontière basse correcte", ->
				station = {slotNum:100,bikeNum:25}
				expect(isStationSecure(station,securité=0)).toBeTruthy()
			it "sans sécurité, frontière basse incorrecte", ->
				station = {slotNum:100,bikeNum:24}
				expect(isStationSecure(station,securité=0)).toBeFalsy()
			it "avec 2 vélo de sécurité demandés mais non fourni, frontière basse", ->
				station = {slotNum:100,bikeNum:26}
				expect(isStationSecure(station,securité=2)).toBeFalsy()
			it "avec 2 vélo de sécurité demandés et fourni, frontière basse", ->
				station = {slotNum:100,bikeNum:27}
				expect(isStationSecure(station,securité=2)).toBeTruthy()

		it "calcule le nombre de vélo manquant pour atteindre 50% de charge", ->
			entité = {slotNum:100,bikeNum:0}
			expect(deltaCible(entité)).toEqual(50)
		it "calcule le nombre de vélo manquant pour atteindre 75% de charge sur un camion", ->
			entité = {bikeNum:5}
			expect(deltaCible(entité, tauxCible=.75)).toEqual(2.5)
		it "calcule le nombre de vélo manquant pour atteindre 25% de charge sur un camion", ->
			entité = {bikeNum:5}
			expect(deltaCible(entité, tauxCible=.25)).toEqual(-2.5)

		describe "selection de stations", ->

			it "liste les stations ennemies", ->
				stations = [{owner:{id:1}},{owner:{id:2}},{}]
				listeStationEnnemi = [{owner:{id:2}}]
				expect(getStationsEnnemis(monId=1, stations)).toEqual(listeStationEnnemi)

			it "liste mes stations", ->
				stations = [{owner:{id:1}},{owner:{id:3}},{}]
				listeMesStations = [{owner:{id:1}}]
				expect(getMesStations(monId=1, stations)).toEqual(listeMesStations)

			it "liste les stations sans propriétaire", ->
				stations = [{owner:{id:1}},{owner:{id:3}},{}]
				listeStationsNonRevendiquées = [{}]
				expect(getStationsNeutre(stations)).toEqual(listeStationsNonRevendiquées)

			it "liste les stations de capacité superieur ou égale à 20", ->
				stations = [{slotNum:10},{slotNum:20},{slotNum:40}]
				stationsSelectionnées = [{slotNum:20},{slotNum:40}]
				expect(getStationsParTaille(stations,min=20)).toEqual(stationsSelectionnées)
			it "liste les stations de capacité comprise entre 16 et 20 inclues", ->
				stations = [{slotNum:10},{slotNum:20},{slotNum:40}]
				stationsSelectionnées = [{slotNum:20}]
				expect(getStationsParTaille(stations,min=16,max=20)).toEqual(stationsSelectionnées)
			it "liste les stations remplie à au moins 50% et au plus 75%", ->
				stations = [{slotNum:10,bikeNum:2},{slotNum:10,bikeNum:5},{slotNum:20,bikeNum:12},{slotNum:40,bikeNum:35}]
				stationsSelectionnées = [{slotNum:10,bikeNum:5},{slotNum:20,bikeNum:12}]
				expect(filtrerParTauxDeRemplissage(stations,min=.5,max=.75)).toEqual(stationsSelectionnées)
			xit "filtre les stations atteignable en moins de 3 tours", ->

		describe "tri de stations", ->
			it "tri les stations par taille décroissante", ->
				stations = [{slotNum:10},{slotNum:20},{slotNum:15},{slotNum:40}]
				stationsTriées = [{slotNum:40},{slotNum:20},{slotNum:15},{slotNum:10}]
				expect(trierStationsParTaille(stations)).toEqual(stationsTriées)
			xit "tri les stations par temps de trajet croissant", ->
				camion = {}
				stations = [{}]
				stationsTriées = [{}]
				expect(trierStationsParTempsDeTrajet(camion, stations)).toEqual(stationsTriées)

		describe "selection de camions", ->
			it "liste les camions qui m'appartiennent", ->
				camions = [{owner:{id:1}},{owner:{id:2}}]
				listeMesCamions = [{owner:{id:1}}]
				expect(getMesCamions(monId=1, camions)).toEqual(listeMesCamions)

			it "liste les camions qui m'appartiennent même s'il y en as plusieurs", ->
				camions = [{owner:{id:1}},{owner:{id:1}},{owner:{id:2}}]
				listeMesCamions = [{owner:{id:1}},{owner:{id:1}}]
				expect(getMesCamions(monId=1, camions)).toEqual(listeMesCamions)

			it "liste les camions adverses", ->
				camions = [{owner:{id:1}},{owner:{id:1}},{owner:{id:2}}]
				camionsAdverses = [{owner:{id:1}},{owner:{id:1}}]
				expect(getCamionsAdverses(monId=2, camions)).toEqual(camionsAdverses)

			it "liste les camions qui sont à l'arrêt", ->
				camions = [{currentStation:{}},{}]
				listeCamionsArrêtés = [{currentStation:{}}]
				expect(getCamionsArrêtés(camions)).toEqual(listeCamionsArrêtés)

			it "liste les camions qui sont en mouvement", ->
				camions = [{destination:{}},{}]
				listeCamionsEnMouvement = [{destination:{}}]
				expect(getCamionsEnMouvement(camions)).toEqual(listeCamionsEnMouvement)

			it "liste les camions remplie à au moins 50% et au plus 75%", ->
				camions = [{bikeNum:2},{bikeNum:5},{bikeNum:7},{bikeNum:8}]
				camionsSelectionnées = [{bikeNum:5},{bikeNum:7}]
				expect(filtrerParTauxDeRemplissage(camions,min=.5,max=.75)).toEqual(camionsSelectionnées)

	describe "distance, proximité, temps de déplacement", ->
		it "calcule la distance à vol d'oiseau entre deux points", ->
			expect(distanceEntre({x:1,y:1},{x:2,y:1})).toEqual(1)

		it "indique la distance entre deux stations", ->
			stationDépart = {id:1}
			stationArrivée = {id:4}
			expect(tempsTrajet(stationDépart,stationArrivée)).toEqual(3)
		it "indique la distance entre deux stations indépendament de leur ordre", ->
			stationDépart = {id:4}
			stationArrivée = {id:1}
			expect(tempsTrajet(stationDépart,stationArrivée)).toEqual(3)
		it "indique une distance dissuasive entre deux fois la même station", ->
			stationDépart = {id:1}
			stationArrivée = {id:1}
			expect(tempsTrajet(stationDépart,stationArrivée)).toEqual(999999)
