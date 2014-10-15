/**
 * Created by win8g_000 on 14/10/2014.
 */
if (typeof exports === 'undefined') exports = this;

var name = "Id.iot";
var color = 0;
var debugMessage = "";
var id = 0;
var orders = [];
exports.onmessage = function (event) {
	if (event.data != null) {
		var turnMessage = event.data;
		id = turnMessage.playerId;
		orders = [];
		var msg = "";
		try {
			//orders = getOrders(turnMessage.data);
			orders = suivre(turnMessage.data);
			msg = debugMessage;
		} catch (e) {
			msg = 'Error : ' + e;
		}
		exports.postMessage(new TurnResult(orders, msg));
	}
	else exports.postMessage("data null");
};


var _turnNum = 1;
var _movingTruckId = [];

var suivre = function (donneePartie) {
	var monId = id;
	var mesCamions = getMesCamions(monId, donneePartie.trucks);
	var mesCamionsDispo = getCamionsArrêtés(mesCamions);
	var stations = getStationEnnemis(monId,donneePartie.stations);
	var ordres = new Array();
	for(var i =0; i<mesCamionsDispo.length; i++){
		if(mesCamionsDispo[i].currentStation.owner && mesCamionsDispo[i].currentStation.owner.id == monId)
			if(mesCamions[0].id != mesCamionsDispo[i].id) ordres.push(new MoveOrder(mesCamionsDispo[i].id, stations[stations.length-1].id));
			else ordres.push(new MoveOrder(mesCamionsDispo[i].id, stations[0].id));
		else
			ordres.push(new LoadingOrder(mesCamionsDispo[i].id, mesCamionsDispo[i].currentStation.id,0));


	}
	/*
	 for (i = 0; i < donneePartie.stations.length; i++) {
	 if(mesCamionsDispo.length&&mesCamionsDispo[0].currentStation.bikeNum>0&&mesCamionsDispo[0].bikeNum<1
	 && mesCamionsDispo[0].currentStation.owner &&mesCamionsDispo[0].currentStation.owner.id == stationsEnnemis.stations)
	 {
	 orders.push(new LoadingOrder(mesCamionsDispo[0].id,mesCamionsDispo[0].currentStation.id,1));

	 mesCamionsDispo.shift();
	 }
	 else if(mesCamionsDispo.length&&mesCamionsDispo[0].currentStation.slotNum>0&&mesCamionsDispo[0].bikeNum>0)
	 {
	 orders.push(new UnLoadingOrder(mesCamionsDispo[0].id,mesCamionsDispo[0].currentStation.id,1));
	 mesCamionsDispo.shift();
	 }

	 else if (mesCamionsDispo.length && stationsEnnemis.stations
	 && ( !mesCamionsMouvant.length
	 || (mesCamionsMouvant.length && mesCamionsMouvant[0].destination.id != donneePartie.stations[i].id))) {
	 mouvement;
	 //orders.push(new LoadingOrder(mesCamionsDispo[0].id,mesCamionsDispo[0].currentStation.id,1));
	 mesCamionsDispo.shift();
	 }
	 /*else  if(mesCamionsDispo.length && donneePartie.stations[i].owner && donneePartie.stations[i].owner.name != "parasite"
	 &&GameUtils.getTravelDuration(mesCamionsDispo[0],donneePartie.stations[i].owner.id != monId))
	 {
	 orders.push(new MoveOrder(mesCamionsDispo[0].id, donneePartie.stations[i].id));
	 mesCamionsDispo.shift();
	 }
	 for(i=0; i < donneePartie.stations[i].owner.name != "parasite";i++)
	 {
	 if(donneePartie.donneePartie.stations[i].owner.name != "parasite")
	 {
	 stationsEnnemis.push(donneePartie.station[i].owner.name != "parasite")
	 }
	 }
	 //postMessage({'orders':orders,'consoleMessage':'','error':''});

	 }
	 */

	debugMessage= JSON.stringify(ordres);
	return ordres;

};
function getMonJoueur(monId, joueurs) {
	return joueurs.filter(function (e) {
		return e.owner && e.owner.id === monId;
	})[0];
}
function getStationEnnemis(monId, stations) {
	return stations.filter(function (e) {
		return e.owner && e.owner.id !== monId;
	});
}
function getStationsPasAMoi(monId, stations) {
	return stations.filter(function (e) {
		return !e.owner || (e.owner && e.owner.id !== monId);
	});
}
function getMesCamions(monId, camions) {
	return camions.filter(function (e) {
		return e.owner && e.owner.id === monId;
	});
}
function getCamionsAdverses(monId, camions) {
	return camions.filter(function (e) {
		return e.owner && e.owner.id !== monId;
	});
}
function getCamionsArrêtés(camions) {
	return camions.filter(function (e) {
		return e.currentStation;
	});
}
function getCamionsEnMouvement(camions) {
	return camions.filter(function (e) {
		return e.destination;
	});
}
function envoyerSiPossibleCamionsVersStations(camions, stations) {
	for (var i = 0; i < stations.length; i++)
		if (camions.length && stations.length) {
			orders.push(new MoveOrder(camions[0].id, stations[0].id));
			camions.shift();
		}
	return camions;
}
function prendreUnVelo(monCamion, orders) {

	//for (i = 0; i < donneePartie.stations.length; i++)
	if (monCamion.currentStation.bikeNum > 0)
		orders.push(new LoadingOrder(monCamion.id, monCamion.currentStation.id, 1));
	return orders
}

var MapData = function () {
	this.players = [];
	this.stations = [];
	this.trucks = [];
	this.currentTime = new Date();
	this.roads = [];
};
var BikeStation = function () {
	this.id = 0.0;
	this.bikeNum = 0; //actuel
	this.slotNum = 0; //max
	this.position = null;
	this.owner = null;
	this.profile = [];
	this.name = '';
};

var Order = function (truckId, targetStationId, type) {
	this.truckId = truckId;
	this.targetStationId = targetStationId;
	this.type = type;
};
var MoveOrder = function (truckId, targetStationId) {
	MoveOrder.prototype = Object.create(Order.prototype);
	Order.apply(this, [truckId, targetStationId, OrderType.MOVE]);
};

var LoadingOrder = function (truckId, targetStationId, bikeNum) {
	LoadingOrder.prototype = Object.create(Order.prototype);
	Order.apply(this, [truckId, targetStationId, OrderType.LOAD]);
	this.bikeNum = bikeNum;
};
var UnLoadingOrder = function (truckId, targetStationId, bikeNum) {
	UnLoadingOrder.prototype = Object.create(Order.prototype);
	Order.apply(this, [truckId, targetStationId, OrderType.UNLOAD]);
	this.bikeNum = bikeNum;
};
var OrderType = {
	MOVE: "move",
	LOAD: "load",
	UNLOAD: "unload",
	NONE: "none"
};
var Player = function (name, script, color) {
	this.name = name;
	this.script = script;
	this.color = color;
	this.id = UID.get();
};
var TurnMessage = function (playerId, galaxy) {
	this.playerId = playerId;
	this.galaxy = galaxy;
};
var TurnResult = function (orders, message) {
	if (message == null) message = "";
	this.orders = orders;
	this.consoleMessage = message;
	this.error = "";
};
var Point = function (x, y) {
	this.x = x;
	this.y = y;
};
function Junction(x, y, id) {
	Junction.prototype = Object.create(Point.prototype);
	Order.apply(this, [x, y]);
	this.links = [];
	this.id = id;
	this.bikeNum = bikeNum;
}
var Trend = {
	DECREASE: -1,
	INCREASE: 1,
	STABLE: 0
};
function Truck(owner, currentStation) {
	this.id = UID.get();
	this.owner = owner;
	this.bikeNum = 0;
	this.position = currentStation.position;
	this.currentStation = currentStation;
}
var GameUtils = {};
GameUtils.getTravelDuration = function (source, target) {
	return Math.ceil(GameUtil.getDistanceBetween(source.position, target.position) / Game.TRUCK_SPEED);
};
GameUtils.getDistanceBetween = function (p1, p2) {
	return Math.sqrt(Math.pow(( p2.x - p1.x ), 2) + Math.pow(( p2.y - p1.y ), 2));
};
GameUtils.hasStationEnoughBike = function (station) {
	return (station.bikeNum > station.slotNum / 4 && station.bikeNum < station.slotNum / 4 * 3);
};

/* Récupere le chemin le plus court entre deux stations */
GameUtils.getPath = function (fromStation, toStation, map) {
	var p = new PathFinder();
	return p.getPath(fromStation, toStation, map);
};
GameUtils.getBikeStationTrend = function (target, time) {
	var currentIndex = time.getHours() * 4 + Math.floor(time.getMinutes() * 4 / 60);
	var nextIndex = currentIndex + 1;
	if (nextIndex + 1 > target.profile.length) {
		nextIndex = 0;
	}
	return target.profile[nextIndex] - target.profile[currentIndex];
};

/**
 * Classe utilitaire
 * @internal
 */
var UID = {};
UID.lastUID = 0;
UID.get = function () {
	UID.lastUID++;
	return UID.lastUID;
};

var Game = {};
Game.GAME_SPEED = 1000; // La vitesse d'execution d'un tour.
Game.GAME_MAX_NUM_TURN = 500; // Le nombre maximum de tour
Game.TRUCK_SPEED = 60;
Game.TRUCK_NUM_SLOT = 10; // La capacité d'un camion
Game.MAX_TURN_DURATION = 1000; // La durée maximale du tour d'une IA. Si l'IA dépasse cette durée, elle passe en timeout.
Game.TURN_TIME = 1000 * 30 * 15; // La durée d'un tour en ms. ex 15 minutes/tours

var PathFinder = function () {
	this._inc = 0;
	this._paths = [];
};
PathFinder.__name__ = true;
PathFinder.prototype = {
	getPath: function (fromStation, toStation, map) {
		this._map = map;
		this._source = this.getJunctionByStation(fromStation);
		this._target = this.getJunctionByStation(toStation);
		var p = new Path();
		p.push(this._source);
		this._paths.push(p);
		this.find();
		return this._result;
	}, getJunctionByStation: function (station) {
		var result = null;
		var _g1 = 0;
		var _g = this._map.roads.length;
		while (_g1 < _g) {
			var i = _g1++;
			var j = this._map.roads[i];
			if (j.x == station.position.x && j.y == station.position.y) {
				result = j;
				break;
			}
		}
		return result;
	}, find: function () {
		var result = false;
		this._inc++;
		var paths = this._paths.slice();
		var _g1 = 0;
		var _g = paths.length;
		while (_g1 < _g) {
			var i = _g1++;
			if (this.checkPath(paths[i])) {
				result = true;
				break;
			}
		}
		if (!result && this._inc < 50) this.find();
	}, checkPath: function (target) {
		var result = false;
		var currentJunction = target.getLastItem();
		var _g1 = 0;
		var _g = currentJunction.links.length;
		while (_g1 < _g) {
			var i = _g1++;
			var nextJunction = currentJunction.links[i];
			if (nextJunction.id == this._target.id) {
				result = true;
				var p = target.copy();
				p.push(nextJunction);
				this._result = p;
				break;
			} else if (!Path.contains(nextJunction, this._paths)) {
				var p1 = target.copy();
				p1.push(nextJunction);
				this._paths.push(p1);
			}
		}
		HxOverrides.remove(this._paths, target);
		return result;
	}, checkPathDirection: function (currentJunction) {
		var result = true;
		if (this._inc > 2) {
			if (this._source.x < this._target.x && currentJunction.x < this._source.x) result = false; else if (this._source.x > this._target.x && currentJunction.x > this._target.x) result = false;
		}
		return result;
	}
};

var Path = function (content) {
	if (content == null) this._content = []; else this._content = content;
};
Path.__name__ = true;
Path.contains = function (item, list) {
	var result = false;
	var _g1 = 0;
	var _g = list.length;
	while (_g1 < _g) {
		var i = _g1++;
		if (list[i].hasItem(item)) {
			result = true;
			break;
		}
	}
	return result;
};
Path.prototype = {
	getLastItem: function () {
		return this._content[this._content.length - 1];
	}, hasItem: function (item) {
		var result = false;
		var _g1 = 0;
		var _g = this._content.length;
		while (_g1 < _g) {
			var i = _g1++;
			if (item.id == this._content[i].id) {
				result = true;
				break;
			}
		}
		return result;
	}, getGuide: function () {
		var result = [];
		var _g1 = 0;
		var _g = this._content.length;
		while (_g1 < _g) {
			var i = _g1++;
			result.push(this._content[i].x - 8);
			result.push(this._content[i].y - 8);
		}
		return result;
	}, getItemAt: function (index) {
		return this._content[index];
	}, push: function (item) {
		this._content.push(item);
	}, remove: function (item) {
		return HxOverrides.remove(this._content, item);
	}, copy: function () {
		return new Path(this._content.slice());
	}, get_length: function () {
		return this._content.length;
	}
};

var HxOverrides = function () {
};
HxOverrides.__name__ = true;
HxOverrides.indexOf = function (a, obj, i) {
	var len = a.length;
	if (i < 0) {
		i += len;
		if (i < 0) i = 0;
	}
	while (i < len) {
		if (a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function (a, obj) {
	var i = HxOverrides.indexOf(a, obj, 0);
	if (i == -1) return false;
	a.splice(i, 1);
	return true;
};



