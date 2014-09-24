﻿describe("IA Parasite", function() {
    beforeEach(function() {
        jasmine.addMatchers({
            toDeepEqual: function() {
                return {
                    compare: function(actual, expected) {
                        return {
                            pass: JSON.stringify(actual) === JSON.stringify(expected)
                        };
                    }
                };
            }
        });
    });
    describe("extraction de données", function() {
        it("liste les stations ennemi", function() {
            var monId = 1;
            var listeStation = [{owner:{id:1}},{owner:{id:2}},{}];
            var listeStationEnnemi = [{owner:{id:2}}]
            expect(getStationEnnemis(monId, listeStation)).toEqual(listeStationEnnemi);
        });
        it("liste les stations ennemi avec un jeu de données différent", function() {
            var monId = 1;
            var listeStation = [{owner:{id:1}},{owner:{id:3}},{}];
            var listeStationEnnemi = [{owner:{id:3}}]
            expect(getStationEnnemis(monId, listeStation)).toEqual(listeStationEnnemi);
        });
    });
    describe("ordres conditionnés", function() {
        xit("mouvement", function() {
            mesCamionsDispo=1;
            stationEnnemis=1;
            //var order = order.push(new MoveOrder(mesCamionsDispo[0].id, stationEnnemis[0].id));
            expect(envoyerSiPossibleCamionVersStationAdverse(mesCamionsDispo, stationEnnemis)).toEqual();
        });

        it("prise de velo",function() {
            var monCamion = {id:1,currentStation:{id:1,bikeNum:1}};
            var orders = [];
            var newOrders = [ { truckId: 1, targetStationId: 1, type: 'load', bikeNum: 1 } ];

            expect(prendreUnVelo(monCamion, orders)).toDeepEqual(newOrders);

        });
    });

});
