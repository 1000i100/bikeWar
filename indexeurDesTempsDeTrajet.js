if (typeof exports === 'undefined') exports = this;

exports.onmessage = function (event) {
	if (event.data != null) {
		var donnéesPartie = event.data.data;
		var indexTempsTrajets = générerIndexTempsTrajet(donnéesPartie);
		//throw JSON.stringify(indexTempsTrajets);

		return exports.postMessage({
			orders: [],
			consoleMessage: JSON.stringify(indexTempsTrajets),
			error: ''
		});
	}
};
function générerIndexTempsTrajet(donnéePartie){
	var indexTempsTrajets = {};
	for (var origine=0;origine<donnéePartie.stations.length;origine++){
		var stationOrigine = donnéePartie.stations[origine];
		for (var arrivée=0;arrivée<donnéePartie.stations.length;arrivée++) {
			var stationArrivée = donnéePartie.stations[arrivée];
			var tempsTrajet = GameUtils.getTravelDuration(stationOrigine,stationArrivée,donnéePartie);
			var indexInversé = stationArrivée.id+'_'+stationOrigine.id;
			if (stationOrigine.id !== stationArrivée.id && indexTempsTrajets[indexInversé] !== tempsTrajet) {
				var index = stationOrigine.id + '_' + stationArrivée.id;
				indexTempsTrajets[index] = tempsTrajet;
			}
		}
	}
	return indexTempsTrajets;
}


var GameUtils = {};
GameUtils.getTravelDuration = function(source, target, map) {
	var result = 0;
	var p = GameUtils.getPath(source, target, map);
	if (p) {
		var _g1 = 0;
		var _g = p.get_length() - 1;
		while (_g1 < _g) {
			var i = _g1++;
			result += Math.ceil(GameUtils.getDistanceBetween(p.getItemAt(i), p.getItemAt(i + 1)) / Game.TRUCK_SPEED);
		}
	}
	return result;
}
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



