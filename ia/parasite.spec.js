describe("IA Parasite", function() {
	describe("extraction de données", function() {
        it("liste les stations ennemi", function() {
            var monId = 1;
            var listeStation = [{owner:{id:1}},{owner:{id:2}},{}];
            var listeStationEnnemi = [{owner:{id:2}}]
            expect(getStationEnnemi(monId, listeStation)).toEqual(listeStationEnnemi);
        });
        it("liste les stations ennemi avec un jeu de données différent", function() {
            var monId = 1;
            var listeStation = [{owner:{id:1}},{owner:{id:3}},{}];
            var listeStationEnnemi = [{owner:{id:3}}]
            expect(getStationEnnemi(monId, listeStation)).toEqual(listeStationEnnemi);
        });
	});
});