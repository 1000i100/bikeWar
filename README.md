BikeWar_js: Développer en JS pour le Code Of War: Bike War
==========================================================

Votre IA se trouve dans le fichier ia.js à la racine.
Pour tester, lancer index.html et lancez la partie.

Il est possible de passer des options à la partie via l'url :
  index.html?start?j1=otherIA/AQube_75.js?j2=parasite.js?speed=1000?logData
ceci lance automatiquement la partie au chargement de la page, fait s'opposer les deux ia correspondant aux fichiers demandés, fait s'executer la partie 1000x plus vite que normalement et affiche dans la console les données envoyé au workers.

Pour trouver d'autres ia existante:
  http://codeofwar.net/sites/default/files/robots/<nom_ia>.js_1.txt
en remplaçant <nom_ia> par le nom de l'ia supposé
une fois trouvé, on peut incrémenté le numéro de version jusqu'a trouver la version la plus à jour.

Pour trouver les noms probables d'IA, consulter les noms sur la page :
http://codeofwar.net/eo_dashboard