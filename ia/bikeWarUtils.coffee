getStationEnnemis = (monId, stations)->
	stations.filter (e)->
		e.owner && e.owner.id != monId
getMesCamions = (monId, camions)->
	camions.filter (e)->
		e.owner && e.owner.id == monId
getCamionsArrêtés = (camions)->
	camions.filter (e)->
		e.currentStation
getCamionsEnMouvement = (camions)->
	camions.filter (e)->
		e.destination
