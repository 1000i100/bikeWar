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
	describe "extraction de données", ->
		it "determine si une station à suffisement de vélo", ->
			station = {slotNum:100,bikeNum:50}
			expect(isStationÉquilibrée(station)).toBeTruthy()
		it "determine si une station à un nombre déséquilibré de vélo", ->
			station = {slotNum:100,bikeNum:0}
			expect(isStationÉquilibrée(station)).toBeFalsy()
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


		describe "selection de camions", ->
			it "liste les camions qui m'appartiennent", ->
				camions = [{owner:{id:1}},{owner:{id:2}}]
				listeMesCamions = [{owner:{id:1}}]
				expect(getMesCamions(monId=1, camions)).toEqual(listeMesCamions)

			it "liste les camions qui m'appartiennent même s'il y en as plusieurs", ->
				camions = [{owner:{id:1}},{owner:{id:1}},{owner:{id:2}}]
				listeMesCamions = [{owner:{id:1}},{owner:{id:1}}]
				expect(getMesCamions(monId=1, camions)).toEqual(listeMesCamions)

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
