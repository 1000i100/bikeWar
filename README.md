BikeWar_js: Développer en JS pour le Code Of War: Bike War
==========================================================

Votre IA se trouve dans le fichier ia.js à la racine.
Pour tester, lancer index.html et lancez la partie.

Il est possible de passer des options à la partie via l'url :
  index.html?start?j1=conDeMime.js?j2=otherIA/AQube_75.js?speed=1000?logData?trends=3
ceci lance automatiquement la partie au chargement de la page, fait s'opposer les deux ia correspondant aux fichiers demandés, fait s'executer la partie 1000x plus vite que normalement, affiche dans la console les données envoyées au workers et change le mode de remplissage des vélos dans les stations.

Mode de remplissage des vélo dans les stations :

- trends=0 : mode par défaut, seule les station stable varie de -1 0 ou +1 vélo.
- trends=1 (ou absent) : stable -1 0 +1, montante 0 +1 +2 +3, descendante 0 -1 -2 -3
- trends=2 : stable 0, montante 0 +1 +2 +3, descendante 0 -1 -2 -3
- trends=3 : stable 0, montante +1, descendante -1 (pas d'aléatoire)

Mode de coloration des stations :

- color=0 (ou absent) : mode par défaut, les stations sont jaunes si elles ont moins de 1/4 ou + de 3/4 de leur capacité rempli de vélo.
- color=1 : les stations sont rouge si vide ou pleine puis passe progressivement au jaune puis au vert quand elle s'éloigne des cas gênant (3 vélo d'écrat pour jaune, 6 pour vert).
- color=2 : les stations sont coloré selon leur capacité maximum en vélo (vert 41, rouge 14 dégradé passant par le jaune entre les deux).
- color=3 : les stations sont coloré selon leur tendance pour le prochain tour (vert: stable, rouge: baisse, jaune: montée).
- color>=14 : les stations sont coloré selon leur capacité maximum en vélo (jaune pour le niveau de couleur choisi, vert pour les niveaux + 3 et plus, rouge pour les niveau -3 et inferieur).

Mode de calcul du score :

- scoreMode=0 (ou absent) : mode par défaut, chaque station rapporte +1 à son responsable si elle à entre 1/4 et 3/4 de ses vélo, elle rapporte -1 à son responsable sinon.
- scoreMode=1 : chaque station possédé rapporte +1 par tour sauf si elle est vide ou pleine, dans ce cas c'est -10 par tour.

Pour tester le déroulement accéléré d'une partie, nodeGameRunner.js est utilisable en ligne de commande (sous réserve d'avoir node installé) et peut prendre le chemin relatif des IA à faire combatte en paramètre. Des IA par défaut sont exécutées sinon.
