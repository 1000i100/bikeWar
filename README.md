BikeWar_js: Développer en JS pour le Code Of War: Bike War
==========================================================

Votre IA se trouve dans le fichier ia.js à la racine.
Pour tester, lancer index.html et lancez la partie.

Il est possible de passer des options à la partie via l'url :
  index.html?start?j1=parasite.js?j2=otherIA/AQube_75.js?speed=1000?logData?trends=3
ceci lance automatiquement la partie au chargement de la page, fait s'opposer les deux ia correspondant aux fichiers demandés, fait s'executer la partie 1000x plus vite que normalement, affiche dans la console les données envoyées au workers et change le mode de remplissage des vélos dans les stations.

Mode de remplissage des vélo dans les stations :
- trends=0 (ou absent) : mode par défaut, seule les station stable varie de -1 0 ou +1 vélo.
- trends=1 : stable -1 0 +1, montante 0 +1 +2 +3, descendante 0 -1 -2 -3
- trends=2 : stable 0, montante 0 +1 +2 +3, descendante 0 -1 -2 -3
- trends=3 : stable 0, montante +1, descendante -1 (pas d'aléatoire)


Pour tester le déroulement accéléré d'une partie, nodeGameRunner.js est utilisable en ligne de commande (sous réserve d'avoir node installé) et peut prendre le chemin relatif des IA à faire combatte en paramètre. Des IA par défaut sont exécutées sinon.

Pour trouver d'autres ia existante:
  http://codeofwar.net/sites/default/files/robots/<nom_ia>.js_1.txt
en remplaçant <nom_ia> par le nom de l'ia supposé
une fois trouvé, on peut incrémenté le numéro de version jusqu'a trouver la version la plus à jour.

Pour trouver les noms probables d'IA, consulter les noms sur la page :
http://codeofwar.net/eo_dashboard