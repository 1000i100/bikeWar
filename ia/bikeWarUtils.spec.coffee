#= require ./bikeWarUtils.coffee
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
	describe "extraction de données", ->
		it "liste les stations ennemi", ->
			monId = 1
			listeStation = [{owner:{id:1}},{owner:{id:2}},{}]
			listeStationEnnemi = [{owner:{id:2}}]
			expect(getStationEnnemis(monId, listeStation)).toEqual(listeStationEnnemi)
		it "liste les stations ennemi avec un jeu de données différent", ->
			monId = 1;
			listeStation = [{owner:{id:1}},{owner:{id:3}},{}]
			listeStationEnnemi = [{owner:{id:3}}]
			expect(getStationEnnemis(monId, listeStation)).toEqual(listeStationEnnemi)
		it "liste les camions qui m'appartiennent", ->
			monId = 1;
			listeCamions = [{owner:{id:1}},{owner:{id:2}}]
			listeMesCamions = [{owner:{id:1}}]
			expect(getMesCamions(monId, listeCamions)).toEqual(listeMesCamions)
		it "liste les camions qui m'appartiennent même s'il y en as plusieurs", ->
			monId = 1;
			listeCamions = [{owner:{id:1}},{owner:{id:1}},{owner:{id:2}}]
			listeMesCamions = [{owner:{id:1}},{owner:{id:1}}]
			expect(getMesCamions(monId, listeCamions)).toEqual(listeMesCamions)
		it "liste les camions qui sont à l'arrêt", ->
			listeCamions = [{currentStation:{}},{}]
			listeCamionsArrêtés = [{currentStation:{}}]
			expect(getCamionsArrêtés(listeCamions)).toEqual(listeCamionsArrêtés)
		it "liste les camions qui sont en mouvement", ->
			listeCamions = [{destination:{}},{}]
			listeCamionsEnMouvement = [{destination:{}}]
			expect(getCamionsEnMouvement(listeCamions)).toEqual(listeCamionsEnMouvement)
