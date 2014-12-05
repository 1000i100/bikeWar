(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
Math.__name__ = true;
var WorkerIA = function(name) {
	if(name == null) name = "";
	this.name = name;
	this.debugMessage = "";
};
WorkerIA.__name__ = true;
WorkerIA.prototype = {
	getOrders: function(context) {
		var result = new Array();
		return result;
	}
	,messageHandler: function(event) {
		if(event.data != null) {
			var turnMessage = event.data;
			WorkerIA.instance.id = turnMessage.playerId;
			var orders = null;
			var msg = WorkerIA.instance.debugMessage;
			try {
				orders = WorkerIA.instance.getOrders(turnMessage.data);
			} catch( e ) {
				msg += "\n[" + WorkerIA.instance.name + "] " + Std.string(e);
			}
			exports.postMessage(new com.tamina.bikewar.data.TurnResult(orders,msg));
		} else exports.postMessage("data null");
	}
	,postMessage: function(message) {
	}
};
var ShinoBotV2 = function() {
	this._turnNum = 1;
	WorkerIA.call(this);
	this.parcours = new Array();
	this.parcours.splice(0,0,null);
	this.parcours.splice(1,0,null);
	this.idsEnCours = new Array();
	shino.ShinoTool.init();
};
ShinoBotV2.__name__ = true;
ShinoBotV2.main = function() {
	WorkerIA.instance = new ShinoJohnV1();
};
ShinoBotV2.__super__ = WorkerIA;
ShinoBotV2.prototype = $extend(WorkerIA.prototype,{
	getOrders: function(context) {
		var result = new Array();
		var myTrucks = this.getMyTrucks(context);
		this.debugMessage = "";
		var _g1 = 0;
		var _g = myTrucks.length;
		while(_g1 < _g) {
			var i = _g1++;
			var truck = myTrucks[i];
			if(truck.currentStation != null) {
				var currentStation = truck.currentStation;
				if(this.parcours[i] == null) this.parcours[i] = this.computeParcour(truck,context,false);
				if(this.parcours[i] != null) {
					var parcour = this.parcours[i];
					if(parcour.move) result.push(new com.tamina.bikewar.data.MoveOrder(truck.id,parcour.stationId)); else {
						HxOverrides.remove(this.idsEnCours,parcour.stationId);
						this.debugMessage += "\ncharge/decharge " + currentStation.id + " : ";
						this.debugMessage += " " + currentStation.slotNum / 4 + "<" + currentStation.bikeNum + "<" + currentStation.slotNum / 4 * 3;
						var order = null;
						if(this.isNotMyStation(currentStation)) {
							if(com.tamina.bikewar.game.GameUtils.hasStationEnoughBike(currentStation)) order = this.defineOrderToMiddle(currentStation,parcour,truck);
						} else order = this.defineOrderToMiddle(currentStation,parcour,truck);
						if(order != null) result.push(order); else {
							if(parcour.next != null) this.parcours[i] = parcour.next; else this.parcours[i] = this.computeParcour(truck,context,true);
							if(this.parcours[i] != null) {
								parcour = this.parcours[i];
								if(parcour.move) result.push(new com.tamina.bikewar.data.MoveOrder(truck.id,parcour.stationId));
							}
						}
					}
					this.parcours[i] = parcour.next;
				}
			} else {
			}
		}
		this.debugMessage = "";
		this._turnNum++;
		return result;
	}
	,computeParcour: function(truck,context,ignoreCurrentStation) {
		var bestScore = null;
		var green = 0;
		var red = 0;
		var enemyGreen = 0;
		var myGreen = 0;
		var neutreGreen = 0;
		var enemyRed = 0;
		var myRed = 0;
		var neutreRed = 0;
		var _g = 0;
		var _g1 = context.stations;
		while(_g < _g1.length) {
			var station = _g1[_g];
			++_g;
			if(com.tamina.bikewar.game.GameUtils.hasStationEnoughBike(station)) {
				green++;
				if(this.isMyStation(station)) myGreen++; else if(this.isEnemyStation(station)) enemyGreen++; else neutreGreen++;
			} else {
				red++;
				if(this.isMyStation(station)) myRed++; else if(this.isEnemyStation(station)) enemyRed++; else neutreRed++;
			}
		}
		if(neutreGreen > neutreRed) {
			shino.Score.ME = 0;
			shino.Score.NEUTRE = 1;
		} else {
			shino.Score.ME = 1;
			shino.Score.NEUTRE = 0;
		}
		if(!ignoreCurrentStation) {
			if(this.isNotMyStation(truck.currentStation)) {
				if(com.tamina.bikewar.game.GameUtils.hasStationEnoughBike(truck.currentStation)) {
					var parcour = this.createParcour(null,false,truck.currentStation.id);
					return parcour;
				}
			}
		}
		var _g2 = 0;
		var _g11 = context.stations;
		while(_g2 < _g11.length) {
			var station1 = _g11[_g2];
			++_g2;
			if(station1.id != truck.currentStation.id && !Lambda.has(this.idsEnCours,station1.id)) {
				var score = null;
				var tendance = this.tendanceSurXTour(station1,context.currentTime,1);
				if(this.isMyStation(station1)) {
					if(!this.hasStationEnoughBikeWithTenndace(station1,tendance) && this.isPossibleWithTruck(station1,tendance,truck)) score = new shino.Score(shino.Score.ME,shino.ShinoTool.getChemin(truck.currentStation,station1),station1);
				} else if(this.hasStationEnoughBikeWithTenndace(station1,tendance)) {
					if(this.isEnemyStation(station1)) score = new shino.Score(shino.Score.ENEMY,shino.ShinoTool.getChemin(truck.currentStation,station1),station1); else score = new shino.Score(shino.Score.NEUTRE,shino.ShinoTool.getChemin(truck.currentStation,station1),station1);
				}
				if(score != null) {
					if(bestScore != null) {
						if(bestScore.compareTo(score) == -1) bestScore = score;
					} else bestScore = score;
				}
			}
		}
		if(bestScore != null) {
			this.debugMessage += "create Parcour " + bestScore.station.id;
			var parcour1 = this.createParcour(null,false,bestScore.station.id);
			parcour1 = this.createParcour(parcour1,true,bestScore.station.id);
			this.idsEnCours.push(bestScore.station.id);
			var nextParcour = parcour1;
			if(bestScore.chemin.ids != null && bestScore.chemin.ids.length > 0) {
				var ids = bestScore.chemin.ids;
				this.debugMessage += "   " + Std.string(ids) + " : ";
				var size = ids.length - 1;
				while(size >= 0) {
					var stationId = Std.parseFloat(ids[size]);
					this.debugMessage += stationId + ", ";
					if(!Lambda.has(this.idsEnCours,stationId)) {
						parcour1 = this.createParcour(parcour1,false,stationId);
						parcour1.minBikeAConserver = nextParcour.minBikeAConserver + 1;
						parcour1.maxBikeAConserver = nextParcour.maxBikeAConserver - 1;
						parcour1 = this.createParcour(parcour1,true,stationId);
						parcour1.minBikeAConserver = nextParcour.minBikeAConserver + 1;
						parcour1.maxBikeAConserver = nextParcour.maxBikeAConserver - 1;
						this.idsEnCours.push(stationId);
					}
					size--;
				}
			}
			this.debugMessage += "\n";
			return parcour1;
		}
		return null;
	}
	,isPossibleWithTruck: function(station,tendance,truck) {
		if(station.bikeNum + tendance * 2 < station.slotNum / 4) {
			var ecart = Math.floor(station.slotNum / 4) - (station.bikeNum + tendance * 2);
			return truck.bikeNum > ecart;
		}
		if(station.bikeNum + tendance * 2 <= station.slotNum / 4 * 3) {
			var ecart1 = Math.floor(station.slotNum / 4 * 3) - (station.bikeNum + tendance * 2);
			return truck.bikeNum < ecart1;
		}
		return false;
	}
	,createParcour: function(nextParcour,move,stationId) {
		var newParcour = new shino.Parcour();
		newParcour.next = nextParcour;
		newParcour.move = move;
		newParcour.stationId = stationId;
		return newParcour;
	}
	,hasStationEnoughBikeWithTenndace: function(station,tendance) {
		return station.bikeNum + tendance * 2 >= station.slotNum / 4 + 2 && station.bikeNum + tendance * 2 <= station.slotNum / 4 * 3 - 2;
	}
	,defineOrderToMiddle: function(station,parcour,truck) {
		var nbBikes = this.nbBikesToMiddle(station);
		var order = null;
		this.debugMessage += "   m=" + nbBikes;
		if(nbBikes > 0) {
			nbBikes = Std["int"](Math.min(truck.bikeNum - parcour.minBikeAConserver,nbBikes));
			this.debugMessage += "  1=>+" + nbBikes;
			if(nbBikes > 0) order = new com.tamina.bikewar.data.UnLoadingOrder(truck.id,station.id,nbBikes);
		} else if(nbBikes < 0) {
			nbBikes = -nbBikes;
			nbBikes = Std["int"](Math.min(parcour.maxBikeAConserver - truck.bikeNum,nbBikes));
			this.debugMessage += "  2=>-" + nbBikes;
			if(nbBikes > 0) order = new com.tamina.bikewar.data.LoadingOrder(truck.id,station.id,nbBikes);
		}
		if(order == null && this.isNotMyStation(station)) {
			var unloadBike;
			if(truck.bikeNum - parcour.minBikeAConserver > 0) unloadBike = 1; else unloadBike = 0;
			var loadBike;
			if(parcour.maxBikeAConserver - truck.bikeNum > 0) loadBike = 1; else loadBike = 0;
			if(loadBike != 0 || unloadBike != 0) {
				if(loadBike == 0) {
					this.debugMessage += "  3=>+1";
					order = new com.tamina.bikewar.data.UnLoadingOrder(truck.id,station.id,1);
				} else if(unloadBike == 0) {
					this.debugMessage += "  4=>-1";
					order = new com.tamina.bikewar.data.LoadingOrder(truck.id,station.id,1);
				} else if(this.nbBikesToMiddle(station) >= 0) {
					this.debugMessage += "  5=>+1";
					order = new com.tamina.bikewar.data.UnLoadingOrder(truck.id,station.id,1);
				} else {
					this.debugMessage += "  6=>-1";
					order = new com.tamina.bikewar.data.LoadingOrder(truck.id,station.id,1);
				}
			}
		}
		return order;
	}
	,nbBikesToMiddle: function(station) {
		return Math.floor(station.slotNum * 0.5) - station.bikeNum;
	}
	,tendanceSurXTour: function(station,currentTime,nbTour) {
		var currentIndex = currentTime.getHours() * 4 + Math.floor(currentTime.getMinutes() * 4 / 60);
		var tendance = 0;
		var _g = 0;
		while(_g < nbTour) {
			var i = _g++;
			var nextIndex = currentIndex + 1;
			if(i % 2 == 0) {
				if(nextIndex >= station.profile.length) nextIndex = 0;
				tendance = this.unMoinsZero(station.profile[nextIndex] - station.profile[currentIndex]);
				currentIndex = nextIndex;
			} else tendance = this.unMoinsZero(station.profile[nextIndex] - station.profile[currentIndex]);
		}
		return tendance;
	}
	,unMoinsZero: function(number) {
		if(number > 0) return 1; else if(number < 0) return -1; else return 0;
	}
	,isMyStation: function(station) {
		return station.owner != null && station.owner.id == this.id;
	}
	,isNotMyStation: function(station) {
		return station.owner == null || station.owner.id != this.id;
	}
	,isEnemyStation: function(station) {
		return station.owner != null && station.owner.id != this.id;
	}
	,isNeutreStation: function(station) {
		return station.owner == null;
	}
	,getMyTrucks: function(context) {
		var iTruckNum = 0;
		var aTruck = new Array();
		var _g = 0;
		var _g1 = context.trucks;
		while(_g < _g1.length) {
			var truck = _g1[_g];
			++_g;
			if(truck.owner.id == this.id) {
				aTruck[iTruckNum] = truck;
				iTruckNum++;
			}
		}
		return aTruck;
	}
});
var ShinoJohnV1 = function() {
	this._turnNum = 1;
	WorkerIA.call(this);
	this.parcours = new Array();
	this.parcours.splice(0,0,null);
	this.parcours.splice(1,0,null);
	this.idsEnCours = new Array();
	shino.ShinoTool.init();
};
ShinoJohnV1.__name__ = true;
ShinoJohnV1.main = function() {
	WorkerIA.instance = new ShinoJohnV1();
};
ShinoJohnV1.__super__ = WorkerIA;
ShinoJohnV1.prototype = $extend(WorkerIA.prototype,{
	getOrders: function(context) {
		var result = new Array();
		var myTrucks = this.getMyTrucks(context);
		this.debugMessage = "";
		var _g1 = 0;
		var _g = myTrucks.length;
		while(_g1 < _g) {
			var i = _g1++;
			var truck = myTrucks[i];
			if(truck.currentStation != null) {
				var currentStation = truck.currentStation;
				if(this.parcours[i] == null) this.parcours[i] = this.computeParcour(truck,context,false);
				if(this.parcours[i] != null) {
					var parcour = this.parcours[i];
					if(parcour.move) result.push(new com.tamina.bikewar.data.MoveOrder(truck.id,parcour.stationId)); else {
						HxOverrides.remove(this.idsEnCours,parcour.stationId);
						this.debugMessage += "\ncharge/decharge " + currentStation.id + " : ";
						this.debugMessage += " " + currentStation.slotNum / 4 + "<" + currentStation.bikeNum + "<" + currentStation.slotNum / 4 * 3;
						var order = null;
						if(this.isNotMyStation(currentStation)) {
							if(com.tamina.bikewar.game.GameUtils.hasStationEnoughBike(currentStation)) order = this.defineOrderToMiddle(currentStation,parcour,truck);
						} else order = this.defineOrderToMiddle(currentStation,parcour,truck);
						if(order != null) result.push(order); else {
							if(parcour.next != null) this.parcours[i] = parcour.next; else this.parcours[i] = this.computeParcour(truck,context,true);
							if(this.parcours[i] != null) {
								parcour = this.parcours[i];
								if(parcour.move) result.push(new com.tamina.bikewar.data.MoveOrder(truck.id,parcour.stationId));
							}
						}
					}
					this.parcours[i] = parcour.next;
				}
			} else {
			}
		}
		this.debugMessage = "";
		this._turnNum++;
		return result;
	}
	,computeParcour: function(truck,context,ignoreCurrentStation) {
		var bestScore = null;
		if(!ignoreCurrentStation) {
			if(this.isNotMyStation(truck.currentStation)) {
				if(com.tamina.bikewar.game.GameUtils.hasStationEnoughBike(truck.currentStation)) {
					var parcour = this.createParcour(null,false,truck.currentStation.id);
					return parcour;
				}
			}
		}
		var _g = 0;
		var _g1 = context.stations;
		while(_g < _g1.length) {
			var station = _g1[_g];
			++_g;
			if(station.id != truck.currentStation.id && !Lambda.has(this.idsEnCours,station.id)) {
				var score = null;
				var tendance = this.tendanceSurXTour(station,context.currentTime,8);
				if(this.isMyStation(station)) {
					if(!this.hasStationEnoughBikeWithTenndace(station,tendance) && this.isPossibleWithTruck(station,tendance,truck)) score = new shino.Score(shino.Score.ME,shino.ShinoTool.getChemin(truck.currentStation,station),station);
				} else if(this.hasStationEnoughBikeWithTenndace(station,tendance)) {
					if(this.isEnemyStation(station)) score = new shino.Score(shino.Score.ENEMY,shino.ShinoTool.getChemin(truck.currentStation,station),station); else score = new shino.Score(shino.Score.NEUTRE,shino.ShinoTool.getChemin(truck.currentStation,station),station);
				}
				if(score != null) {
					if(bestScore != null) {
						if(bestScore.compareTo(score) == -1) bestScore = score;
					} else bestScore = score;
				}
			}
		}
		if(bestScore != null) {
			this.debugMessage += "create Parcour " + bestScore.station.id;
			var parcour1 = this.createParcour(null,false,bestScore.station.id);
			parcour1 = this.createParcour(parcour1,true,bestScore.station.id);
			this.idsEnCours.push(bestScore.station.id);
			var nextParcour = parcour1;
			if(bestScore.chemin.ids != null && bestScore.chemin.ids.length > 0) {
				var ids = bestScore.chemin.ids;
				this.debugMessage += "   " + Std.string(ids) + " : ";
				var size = ids.length - 1;
				while(size >= 0) {
					var stationId = Std.parseFloat(ids[size]);
					this.debugMessage += stationId + ", ";
					if(!Lambda.has(this.idsEnCours,stationId)) {
						parcour1 = this.createParcour(parcour1,false,stationId);
						parcour1.minBikeAConserver = nextParcour.minBikeAConserver + 1;
						parcour1.maxBikeAConserver = nextParcour.maxBikeAConserver - 1;
						parcour1 = this.createParcour(parcour1,true,stationId);
						parcour1.minBikeAConserver = nextParcour.minBikeAConserver + 1;
						parcour1.maxBikeAConserver = nextParcour.maxBikeAConserver - 1;
						this.idsEnCours.push(stationId);
					}
					size--;
				}
			}
			this.debugMessage += "\n";
			return parcour1;
		}
		return null;
	}
	,isPossibleWithTruck: function(station,tendance,truck) {
		if(station.bikeNum + tendance * 2 < station.slotNum / 4) {
			var ecart = Math.floor(station.slotNum / 4) - (station.bikeNum + tendance * 2);
			return truck.bikeNum > ecart;
		}
		if(station.bikeNum + tendance * 2 <= station.slotNum / 4 * 3) {
			var ecart1 = Math.floor(station.slotNum / 4 * 3) - (station.bikeNum + tendance * 2);
			return truck.bikeNum < ecart1;
		}
		return false;
	}
	,createParcour: function(nextParcour,move,stationId) {
		var newParcour = new shino.Parcour();
		newParcour.next = nextParcour;
		newParcour.move = move;
		newParcour.stationId = stationId;
		return newParcour;
	}
	,hasStationEnoughBikeWithTenndace: function(station,tendance) {
		return station.bikeNum + tendance * 2 >= station.slotNum / 4 && station.bikeNum + tendance * 2 <= station.slotNum / 4 * 3;
	}
	,defineOrderToMiddle: function(station,parcour,truck) {
		var nbBikes = this.nbBikesToMiddle(station);
		var order = null;
		this.debugMessage += "   m=" + nbBikes;
		if(nbBikes > 0) {
			nbBikes = Std["int"](Math.min(truck.bikeNum - parcour.minBikeAConserver,nbBikes));
			this.debugMessage += "  1=>+" + nbBikes;
			if(nbBikes > 0) order = new com.tamina.bikewar.data.UnLoadingOrder(truck.id,station.id,nbBikes);
		} else if(nbBikes < 0) {
			nbBikes = -nbBikes;
			nbBikes = Std["int"](Math.min(parcour.maxBikeAConserver - truck.bikeNum,nbBikes));
			this.debugMessage += "  2=>-" + nbBikes;
			if(nbBikes > 0) order = new com.tamina.bikewar.data.LoadingOrder(truck.id,station.id,nbBikes);
		}
		if(order == null && this.isNotMyStation(station)) {
			var unloadBike;
			if(truck.bikeNum - parcour.minBikeAConserver > 0) unloadBike = 1; else unloadBike = 0;
			var loadBike;
			if(parcour.maxBikeAConserver - truck.bikeNum > 0) loadBike = 1; else loadBike = 0;
			if(loadBike != 0 || unloadBike != 0) {
				if(loadBike == 0) {
					this.debugMessage += "  3=>+1";
					order = new com.tamina.bikewar.data.UnLoadingOrder(truck.id,station.id,1);
				} else if(unloadBike == 0) {
					this.debugMessage += "  4=>-1";
					order = new com.tamina.bikewar.data.LoadingOrder(truck.id,station.id,1);
				} else if(this.nbBikesToMiddle(station) >= 0) {
					this.debugMessage += "  5=>+1";
					order = new com.tamina.bikewar.data.UnLoadingOrder(truck.id,station.id,1);
				} else {
					this.debugMessage += "  6=>-1";
					order = new com.tamina.bikewar.data.LoadingOrder(truck.id,station.id,1);
				}
			}
		}
		return order;
	}
	,nbBikesToMiddle: function(station) {
		return Math.floor(station.slotNum * 0.5) - station.bikeNum;
	}
	,tendanceSurXTour: function(station,currentTime,nbTour) {
		var currentIndex = currentTime.getHours() * 4 + Math.floor(currentTime.getMinutes() * 4 / 60);
		var tendance = 0;
		var _g = 0;
		while(_g < nbTour) {
			var i = _g++;
			var nextIndex = currentIndex + 1;
			if(i % 2 == 0) {
				if(nextIndex >= station.profile.length) nextIndex = 0;
				tendance = this.unMoinsZero(station.profile[nextIndex] - station.profile[currentIndex]);
				currentIndex = nextIndex;
			} else tendance = this.unMoinsZero(station.profile[nextIndex] - station.profile[currentIndex]);
		}
		return tendance;
	}
	,unMoinsZero: function(number) {
		if(number > 0) return 1; else if(number < 0) return -1; else return 0;
	}
	,isMyStation: function(station) {
		return station.owner != null && station.owner.id == this.id;
	}
	,isNotMyStation: function(station) {
		return station.owner == null || station.owner.id != this.id;
	}
	,isEnemyStation: function(station) {
		return station.owner != null && station.owner.id != this.id;
	}
	,isNeutreStation: function(station) {
		return station.owner == null;
	}
	,getMyTrucks: function(context) {
		var iTruckNum = 0;
		var aTruck = new Array();
		var _g = 0;
		var _g1 = context.trucks;
		while(_g < _g1.length) {
			var truck = _g1[_g];
			++_g;
			if(truck.owner.id == this.id) {
				aTruck[iTruckNum] = truck;
				iTruckNum++;
			}
		}
		return aTruck;
	}
});
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var com = {};
com.tamina = {};
com.tamina.bikewar = {};
com.tamina.bikewar.core = {};
com.tamina.bikewar.core.PathFinder = function() {
	this._inc = 0;
	this._paths = new Array();
};
com.tamina.bikewar.core.PathFinder.__name__ = true;
com.tamina.bikewar.core.PathFinder.prototype = {
	getPath: function(fromStation,toStation,map) {
		this._map = map;
		this._source = this.getJunctionByStation(fromStation);
		this._target = this.getJunctionByStation(toStation);
		var p = new com.tamina.bikewar.data.Path();
		p.push(this._source);
		this._paths.push(p);
		var startDate = new Date();
		this.find();
		return this._result;
	}
	,getJunctionByStation: function(station) {
		var result = null;
		var _g1 = 0;
		var _g = this._map.roads.length;
		while(_g1 < _g) {
			var i = _g1++;
			var j = this._map.roads[i];
			if(j.id == (station.id == null?"null":"" + station.id)) {
				result = j;
				break;
			}
		}
		return result;
	}
	,find: function() {
		var result = false;
		this._inc++;
		var paths = this._paths.slice();
		var _g1 = 0;
		var _g = paths.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.checkPath(paths[i])) {
				result = true;
				break;
			}
		}
		if(!result && this._inc < 50) this.find();
	}
	,checkPath: function(target) {
		var result = false;
		var currentJunction = target.getLastItem();
		var _g1 = 0;
		var _g = currentJunction.links.length;
		while(_g1 < _g) {
			var i = _g1++;
			var nextJunction = currentJunction.links[i];
			if(nextJunction.id == this._target.id) {
				result = true;
				var p = target.copy();
				p.push(nextJunction);
				this._result = p;
				break;
			} else if(!com.tamina.bikewar.data.Path.contains(nextJunction,this._paths)) {
				var p1 = target.copy();
				p1.push(nextJunction);
				this._paths.push(p1);
			}
		}
		HxOverrides.remove(this._paths,target);
		return result;
	}
	,checkPathDirection: function(currentJunction) {
		var result = true;
		if(this._inc > 2) {
			if(this._source.x < this._target.x && currentJunction.x < this._source.x) result = false; else if(this._source.x > this._target.x && currentJunction.x > this._target.x) result = false;
		}
		return result;
	}
};
com.tamina.bikewar.data = {};
com.tamina.bikewar.data.BikeStation = function() {
	this.name = "";
	this.profile = new Array();
	this.id = org.tamina.utils.UID.getUID();
};
com.tamina.bikewar.data.BikeStation.__name__ = true;
com.tamina.bikewar.data.BikeStation.prototype = {
	toString: function() {
		return "" + this.id;
	}
};
com.tamina.bikewar.data.Order = function(truckId,targetStationId,type) {
	this.truckId = truckId;
	this.targetStationId = targetStationId;
	this.type = type;
};
com.tamina.bikewar.data.Order.__name__ = true;
com.tamina.bikewar.data.LoadingOrder = function(truckId,targetStationId,bikeNum) {
	this.bikeNum = 0;
	com.tamina.bikewar.data.Order.call(this,truckId,targetStationId,com.tamina.bikewar.data.OrderType.LOAD);
	this.bikeNum = bikeNum;
};
com.tamina.bikewar.data.LoadingOrder.__name__ = true;
com.tamina.bikewar.data.LoadingOrder.__super__ = com.tamina.bikewar.data.Order;
com.tamina.bikewar.data.LoadingOrder.prototype = $extend(com.tamina.bikewar.data.Order.prototype,{
});
com.tamina.bikewar.data.MapData = function() {
	this.players = new Array();
	this.stations = new Array();
	this.trucks = new Array();
	this.roads = new Array();
};
com.tamina.bikewar.data.MapData.__name__ = true;
com.tamina.bikewar.data.MoveOrder = function(truckId,targetStationId) {
	com.tamina.bikewar.data.Order.call(this,truckId,targetStationId,com.tamina.bikewar.data.OrderType.MOVE);
};
com.tamina.bikewar.data.MoveOrder.__name__ = true;
com.tamina.bikewar.data.MoveOrder.__super__ = com.tamina.bikewar.data.Order;
com.tamina.bikewar.data.MoveOrder.prototype = $extend(com.tamina.bikewar.data.Order.prototype,{
});
com.tamina.bikewar.data.OrderType = function() { };
com.tamina.bikewar.data.OrderType.__name__ = true;
com.tamina.bikewar.data.Path = function(content) {
	if(content == null) this._content = new Array(); else this._content = content;
};
com.tamina.bikewar.data.Path.__name__ = true;
com.tamina.bikewar.data.Path.contains = function(item,list) {
	var result = false;
	var _g1 = 0;
	var _g = list.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(list[i].hasItem(item)) {
			result = true;
			break;
		}
	}
	return result;
};
com.tamina.bikewar.data.Path.prototype = {
	getLastItem: function() {
		return this._content[this._content.length - 1];
	}
	,hasItem: function(item) {
		var result = false;
		var _g1 = 0;
		var _g = this._content.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(item.id == this._content[i].id) {
				result = true;
				break;
			}
		}
		return result;
	}
	,getGuide: function() {
		var result = new Array();
		var _g1 = 0;
		var _g = this._content.length;
		while(_g1 < _g) {
			var i = _g1++;
			result.push(this._content[i].x - 8);
			result.push(this._content[i].y - 8);
		}
		return result;
	}
	,getItemAt: function(index) {
		return this._content[index];
	}
	,push: function(item) {
		this._content.push(item);
	}
	,remove: function(item) {
		return HxOverrides.remove(this._content,item);
	}
	,copy: function() {
		return new com.tamina.bikewar.data.Path(this._content.slice());
	}
	,get_length: function() {
		return this._content.length;
	}
};
com.tamina.bikewar.data.Player = function(name,script,color) {
	if(color == null) color = "";
	if(script == null) script = "";
	if(name == null) name = "";
	this.name = name;
	this.script = script;
	this.color = color;
	this.id = Std.string(org.tamina.utils.UID.getUID());
};
com.tamina.bikewar.data.Player.__name__ = true;
com.tamina.bikewar.data.Player.prototype = {
	getOrders: function(map) {
		var result = new Array();
		return result;
	}
};
com.tamina.bikewar.data._Trend = {};
com.tamina.bikewar.data._Trend.Trend_Impl_ = function() { };
com.tamina.bikewar.data._Trend.Trend_Impl_.__name__ = true;
com.tamina.bikewar.data.Truck = function(owner,currentStation) {
	this.id = org.tamina.utils.UID.getUID();
	this.owner = owner;
	this.currentStation = currentStation;
	this.position = currentStation.position;
	this.bikeNum = 0;
};
com.tamina.bikewar.data.Truck.__name__ = true;
com.tamina.bikewar.data.TurnMessage = function(playerId,data) {
	this.playerId = playerId;
	this.data = data;
};
com.tamina.bikewar.data.TurnMessage.__name__ = true;
com.tamina.bikewar.data.TurnResult = function(orders,message) {
	if(message == null) message = "";
	this.orders = orders;
	this.consoleMessage = message;
	this.error = "";
};
com.tamina.bikewar.data.TurnResult.__name__ = true;
com.tamina.bikewar.data.UnLoadingOrder = function(truckId,targetStationId,bikeNum) {
	this.bikeNum = 0;
	com.tamina.bikewar.data.Order.call(this,truckId,targetStationId,com.tamina.bikewar.data.OrderType.UNLOAD);
	this.bikeNum = bikeNum;
};
com.tamina.bikewar.data.UnLoadingOrder.__name__ = true;
com.tamina.bikewar.data.UnLoadingOrder.__super__ = com.tamina.bikewar.data.Order;
com.tamina.bikewar.data.UnLoadingOrder.prototype = $extend(com.tamina.bikewar.data.Order.prototype,{
});
com.tamina.bikewar.game = {};
com.tamina.bikewar.game.Game = function() { };
com.tamina.bikewar.game.Game.__name__ = true;
com.tamina.bikewar.game.Game.get_START_POINTS = function() {
	var result = new Array();
	result.push(new org.tamina.geom.Point(100,100));
	result.push(new org.tamina.geom.Point(100,500));
	return result;
};
com.tamina.bikewar.game.GameUtils = function() { };
com.tamina.bikewar.game.GameUtils.__name__ = true;
com.tamina.bikewar.game.GameUtils.getTravelDuration = function(source,target,map) {
	var result = 0;
	var p = com.tamina.bikewar.game.GameUtils.getPath(source,target,map);
	var _g1 = 0;
	var _g = p.get_length() - 1;
	while(_g1 < _g) {
		var i = _g1++;
		result += Math.ceil(com.tamina.bikewar.game.GameUtils.getDistanceBetween(p.getItemAt(i),p.getItemAt(i + 1)) / com.tamina.bikewar.game.Game.TRUCK_SPEED);
	}
	return result;
};
com.tamina.bikewar.game.GameUtils.getDistanceBetween = function(p1,p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x,2) + Math.pow(p2.y - p1.y,2));
};
com.tamina.bikewar.game.GameUtils.hasStationEnoughBike = function(station) {
	return station.bikeNum >= station.slotNum / 4 && station.bikeNum <= station.slotNum / 4 * 3;
};
com.tamina.bikewar.game.GameUtils.getPath = function(fromStation,toStation,map) {
	var p = new com.tamina.bikewar.core.PathFinder();
	return p.getPath(fromStation,toStation,map);
};
com.tamina.bikewar.game.GameUtils.getCurrentRoundedDate = function() {
	var now = new Date();
	var minutes = now.getMinutes();
	minutes = Math.floor(minutes * 4 / 60) * 15;
	var t = now.getTime() - (now.getMinutes() - minutes) * 1000 * 60 - now.getSeconds() * 1000;
	var d = new Date();
	d.setTime(t);
	return d;
};
com.tamina.bikewar.game.GameUtils.getBikeStationTrend = function(target,time) {
	var currentIndex = time.getHours() * 4 + Math.floor(time.getMinutes() * 4 / 60);
	var nextIndex = currentIndex + 1;
	if(nextIndex + 1 > target.profile.length) nextIndex = 0;
	return target.profile[nextIndex] - target.profile[currentIndex];
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var org = {};
org.tamina = {};
org.tamina.geom = {};
org.tamina.geom.Point = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
org.tamina.geom.Point.__name__ = true;
org.tamina.geom.Junction = function(x,y,id) {
	if(id == null) id = "";
	if(y == null) y = 0;
	if(x == null) x = 0;
	org.tamina.geom.Point.call(this,x,y);
	this.links = new Array();
	this.id = id;
};
org.tamina.geom.Junction.__name__ = true;
org.tamina.geom.Junction.__super__ = org.tamina.geom.Point;
org.tamina.geom.Junction.prototype = $extend(org.tamina.geom.Point.prototype,{
});
org.tamina.utils = {};
org.tamina.utils.UID = function() { };
org.tamina.utils.UID.__name__ = true;
org.tamina.utils.UID.getUID = function() {
	var result = new Date().getTime();
	if(result <= org.tamina.utils.UID._lastUID) result = org.tamina.utils.UID._lastUID + 1;
	org.tamina.utils.UID._lastUID = result;
	return result;
};
var shino = {};
shino.Chemin = function() {
	this.ids = new Array();
};
shino.Chemin.__name__ = true;
shino.Chemin.prototype = {
	nbTurn: function() {
		return Math.ceil(this.poid / com.tamina.bikewar.game.Game.TRUCK_SPEED);
	}
};
shino.Parcour = function() {
	this.minBikeAConserver = 0;
	this.maxBikeAConserver = 10;
};
shino.Parcour.__name__ = true;
shino.Score = function(ower,chemin,station) {
	this.ower = ower;
	this.distance = chemin.poid;
	this.chemin = chemin;
	this.station = station;
};
shino.Score.__name__ = true;
shino.Score.prototype = {
	compareTo: function(other) {
		var compare = this.compareInt(this.ower,other.ower);
		if(compare == 0) compare = -this.compareInt(this.distance,other.distance);
		return compare;
	}
	,compareInt: function(i1,i2) {
		if(i1 == i2) return 0; else if(i1 < i2) return -1; else return 1;
	}
};
shino.StationState = { __ename__ : true, __constructs__ : ["stationOK","notEnoughBike","tooMuchBikes"] };
shino.StationState.stationOK = ["stationOK",0];
shino.StationState.stationOK.__enum__ = shino.StationState;
shino.StationState.notEnoughBike = ["notEnoughBike",1];
shino.StationState.notEnoughBike.__enum__ = shino.StationState;
shino.StationState.tooMuchBikes = ["tooMuchBikes",2];
shino.StationState.tooMuchBikes.__enum__ = shino.StationState;
shino.ShinoTool = function() { };
shino.ShinoTool.__name__ = true;
shino.ShinoTool.isTruckTravelling = function(truck) {
	return truck.currentStation == null;
};
shino.ShinoTool.getStationState = function(station) {
	if(station.bikeNum < station.slotNum / 4) return shino.StationState.notEnoughBike; else if(station.bikeNum > station.slotNum / 4 * 3) return shino.StationState.tooMuchBikes; else return shino.StationState.stationOK;
};
shino.ShinoTool.hasStationEnoughBikes = function(station) {
	return station.bikeNum >= station.slotNum / 4;
};
shino.ShinoTool.hasStationToMuchBikes = function(station) {
	return station.bikeNum > station.slotNum / 4 * 3;
};
shino.ShinoTool.getChemin = function(start,end) {
	return shino.ShinoTool.chemins[start.id - 1 | 0][end.id - 1 | 0];
};
shino.ShinoTool.init = function() {
	shino.ShinoTool.initChemins();
};
shino.ShinoTool.initChemins = function() {
	shino.ShinoTool.chemins = new Array();
	var _g = 0;
	while(_g < 136) {
		var i = _g++;
		shino.ShinoTool.chemins[i] = new Array();
	}
	var base = "1:6:32|1:7:43|1:2:68|1:8:120:7|1:3:119:2|1:4:75|1:5:90|1:19:155:5|1:18:136:5|1:22:93:6|1:23:72:7|1:25:176:7-23-24|1:9:178:7-8|1:10:275:7-8-9|1:11:226:2-3|1:12:391:4-15|1:31:459:4-15-12|1:13:263:4-15|1:14:222:4-15|1:15:173:4|1:33:309:4-15-14|1:16:556:6-22-41-42-103-123-65-68|1:17:172|1:38:196:17|1:20:180:5-19|1:37:221:5-19|1:39:192:5-19|1:60:237:5-19|1:21:157:6-22-41|1:40:191:6-22-41-21|1:41:116:6-22|1:24:115:7-23|1:28:346:7-8-9|1:29:383:7-8-9|1:30:422:2-3|1:32:338:4-15-14|1:35:217|1:34:289:35|1:53:313:35-34|1:36:258:35|1:56:278:5-19-37|1:101:232:6-22-41-42-102|1:42:148:6-22-41|1:43:152:6-22|1:102:186:6-22-41-42|1:103:179:6-22-41-42|1:104:166:7-23|1:44:133:6-22|1:45:146:7-23|1:106:194:7-23|1:50:413:35-34|1:52:479:35-34-53|1:55:326:5-19-37-56|1:57:308:5-19-37-56|1:59:282:5-19-60|1:58:349:5-19-60-59|1:100:410:5-19-60-59-58|1:61:433:6-22-41-42-103-123-66|1:66:343:6-22-41-42-103-123|1:67:413:6-22-41-42-103-123-66|1:62:730:6-22-41-42-103-123-65-68-16|1:63:890:6-22-41-42-103-123-124-125|1:64:365:6-22-41-42-103-123|1:65:331:6-22-41-42-103-123|1:68:394:6-22-41-42-103-123-65|1:69:476:6-22-41-42-103-123-65-68|1:72:974:6-22-41-42-103-123-65-68-16-62|1:98:535:5-19-60-59-58-100-99|1:99:480:5-19-60-59-58-100|1:123:216:6-22-41-42-103|1:105:210:7-23-104|1:134:255:7-23-104-105|1:135:270:7-23-104-105|1:133:254:7-23-106|1:121:434:5-19-37-56|1:122:402:5-19-37-56|1:124:299:6-22-41-42-103-123|1:125:348:6-22-41-42-103-123-124|1:136:335:7-23-106-133|6:7:30|6:8:107:7|6:19:128:5|6:18:109:5|6:22:61|6:23:59:7|6:25:163:7-23-24|6:9:165:7-8|6:10:262:7-8-9|6:11:258:1-2-3|6:12:423:1-4-15|6:31:491:1-4-15-12|6:13:295:1-4-15|6:14:254:1-4-15|6:15:205:1-4|6:33:320:5-18-17-35|6:16:524:22-41-42-103-123-65-68|6:17:153:5-18|6:38:171:5-19|6:20:153:5-19|6:37:194:5-19|" + "6:39:165:5-19|6:60:210:5-19|6:21:125:22-41|6:40:159:22-41-21|6:41:84:22|6:24:102:7-23|6:28:333:7-8-9|6:29:370:7-8-9|6:30:454:1-2-3|6:32:370:1-4-15-14|6:35:220:5-18-17|6:34:292:5-18-17-35|6:53:316:5-18-17-35-34|6:36:261:5-18-17-35|6:56:251:5-19-37|6:101:200:22-41-42-102|6:42:116:22-41|6:43:120:22|6:102:154:22-41-42|6:103:147:22-41-42|6:104:152:22-43|6:44:101:22|6:45:133:7-23|6:106:181:7-23|6:50:416:5-18-17-35-34|6:52:463:5-19-37|6:55:299:5-19-37-56|6:57:281:5-19-37-56|6:59:255:5-19-60|6:58:322:5-19-60-59|6:100:383:5-19-60-59-58|6:61:401:22-41-42-103-123-66|6:66:311:22-41-42-103-123|6:67:381:22-41-42-103-123-66|6:62:698:22-41-42-103-123-65-68-16|6:63:858:22-41-42-103-123-124-125|6:64:333:22-41-42-103-123|6:65:299:22-41-42-103-123|6:68:362:22-41-42-103-123-65|6:69:444:22-41-42-103-123-65-68|6:72:942:22-41-42-103-123-65-68-16-62|6:98:508:5-19-60-59-58-100-99|6:99:453:5-19-60-59-58-100|6:123:184:22-41-42-103|6:105:196:22-43-104|6:134:241:22-43-104-105|6:135:245:22-41-42-103-123|6:133:241:7-23-106|6:121:407:5-19-37-56|6:122:375:5-19-37-56|6:124:267:22-41-42-103-123|6:125:316:22-41-42-103-123-124|6:136:312:22-41-42-103-123-124|7:8:77|7:19:158:6-5|7:18:139:6-5|7:22:83|7:23:29|7:25:133:23-24|7:9:135:8|7:10:232:8-9|7:11:269:1-2-3|7:12:434:1-4-15|7:31:502:1-4-15-12|7:13:306:1-4-15|7:14:265:1-4-15|7:15:216:1-4|7:33:350:6-5-18-17-35|7:16:519:23-104-65-68|7:17:183:6-5-18|7:38:201:6-5-19|7:20:183:6-5-19|7:37:224:6-5-19|7:39:195:6-5-19|7:60:240:6-5-19|7:21:147:22-41|7:40:181:22-41-21|7:41:106:22|7:24:72:23|7:28:303:8-9|7:29:340:8-9|7:30:465:1-2-3|7:32:381:1-4-15-14|7:35:250:6-5-18-17|7:34:322:6-5-18-17-35|7:53:346:6-5-18-17-35-34|7:36:291:6-5-18-17-35|7:56:281:6-5-19-37|7:101:222:22-41-42-102|7:42:138:22-41|7:43:112|7:102:176:22-41-42|7:103:142:43|7:104:123:23|7:44:93|7:45:103:23|7:106:151:23|7:50:446:6-5-18-17-35-34|7:52:493:6-5-19-37|7:55:329:6-5-19-37-56|" + "7:57:311:6-5-19-37-56|7:59:285:6-5-19-60|7:58:352:6-5-19-60-59|7:100:413:6-5-19-60-59-58|7:61:396:23-104-66|7:66:306:23-104|7:67:376:23-104-66|7:62:693:23-104-65-68-16|7:63:853:23-104-124-125|7:64:328:23-104|7:65:294:23-104|7:68:357:23-104-65|7:69:439:23-104-65-68|7:72:937:23-104-65-68-16-62|7:98:538:6-5-19-60-59-58-100-99|7:99:483:6-5-19-60-59-58-100|7:123:179:43-103|7:105:167:23-104|7:134:212:23-104-105|7:135:227:23-104-105|7:133:211:23-106|7:121:437:6-5-19-37-56|7:122:405:6-5-19-37-56|7:124:262:23-104|7:125:311:23-104-124|7:136:292:23-106-133|2:6:100:1|2:7:111:1|2:8:62|2:3:51|2:4:123|2:5:138|2:19:203:5|2:18:184:5|2:22:161:1-6|2:23:140:1-7|2:25:118:8|2:9:120:8|2:10:217:8-9|2:11:158:3|2:12:346:3|2:31:414:3-12|2:13:218:3|2:14:223:3-15|2:15:174:3|2:33:310:3-15-14|2:16:624:1-6-22-41-42-103-123-65-68|2:17:220|2:38:244:17|2:20:228:5-19|2:37:269:5-19|2:39:240:5-19|2:60:285:5-19|2:21:225:1-6-22-41|2:40:259:1-6-22-41-21|2:41:184:1-6-22|2:24:136:8|2:28:288:8-9|2:29:325:8-9|2:30:354:3|2:32:325:3-13|2:35:265|2:34:337:35|2:53:361:35-34|2:36:306:35|2:56:326:5-19-37|2:101:300:1-6-22-41-42-102|2:42:216:1-6-22-41|2:43:220:1-6-22|2:102:254:1-6-22-41-42|2:103:247:1-6-22-41-42|2:104:234:1-7-23|2:44:201:1-6-22|2:45:211:8-24|2:106:259:8-24|2:50:440:3-13|2:52:509:3-13|2:55:374:5-19-37-56|2:57:356:5-19-37-56|2:59:330:5-19-60|2:58:397:5-19-60-59|2:100:458:5-19-60-59-58|2:61:501:1-6-22-41-42-103-123-66|2:66:411:1-6-22-41-42-103-123|2:67:481:1-6-22-41-42-103-123-66|2:62:798:1-6-22-41-42-103-123-65-68-16|2:63:958:1-6-22-41-42-103-123-124-125|2:64:433:1-6-22-41-42-103-123|2:65:399:1-6-22-41-42-103-123|2:68:462:1-6-22-41-42-103-123-65|2:69:544:1-6-22-41-42-103-123-65-68|2:72:1042:1-6-22-41-42-103-123-65-68-16-62|2:98:583:5-19-60-59-58-100-99|2:99:528:5-19-60-59-58-100|2:123:284:1-6-22-41-42-103|2:105:278:1-7-23-104|2:134:323:1-7-23-104-105|2:135:338:1-7-23-104-105|2:133:319:8-24-106|2:121:482:5-19-37-56|" + "2:122:450:5-19-37-56|2:124:367:1-6-22-41-42-103-123|2:125:416:1-6-22-41-42-103-123-124|2:136:400:8-24-106-133|8:19:235:7-6-5|8:18:216:7-6-5|8:22:160:7|8:23:106:7|8:25:56|8:9:58|8:10:155:9|8:11:220:2-3|8:12:408:2-3|8:31:476:2-3-12|8:13:280:2-3|8:14:285:2-3-15|8:15:236:2-3|8:33:372:2-3-15-14|8:16:596:7-23-104-65-68|8:17:260:7-6-5-18|8:38:278:7-6-5-19|8:20:260:7-6-5-19|8:37:301:7-6-5-19|8:39:272:7-6-5-19|8:60:317:7-6-5-19|8:21:224:7-22-41|8:40:258:7-22-41-21|8:41:183:7-22|8:24:74|8:28:226:9|8:29:263:9|8:30:416:2-3|8:32:387:2-3-13|8:35:327:2|8:34:399:2-35|8:53:423:2-35-34|8:36:368:2-35|8:56:358:7-6-5-19-37|8:101:299:7-22-41-42-102|8:42:215:7-22-41|8:43:189:7|8:102:253:7-22-41-42|8:103:219:7-43|8:104:200:7-23|8:44:170:7|8:45:149:24|8:106:197:24|8:50:502:2-3-13|8:52:570:7-6-5-19-37|8:55:406:7-6-5-19-37-56|8:57:388:7-6-5-19-37-56|8:59:362:7-6-5-19-60|8:58:429:7-6-5-19-60-59|8:100:490:7-6-5-19-60-59-58|8:61:473:7-23-104-66|8:66:383:7-23-104|8:67:453:7-23-104-66|8:62:770:7-23-104-65-68-16|8:63:902:24-106-133-136-125|8:64:405:7-23-104|8:65:371:7-23-104|8:68:434:7-23-104-65|8:69:516:7-23-104-65-68|8:72:1014:7-23-104-65-68-16-62|8:98:615:7-6-5-19-60-59-58-100-99|8:99:560:7-6-5-19-60-59-58-100|8:123:256:7-43-103|8:105:239:24-106|8:134:284:24-106-105|8:135:299:24-106-105|8:133:257:24-106|8:121:514:7-6-5-19-37-56|8:122:482:7-6-5-19-37-56|8:124:339:7-23-104|8:125:360:24-106-133-136|8:136:338:24-106-133|3:6:151:2-1|3:7:162:2-1|3:8:113:2|3:4:104|3:5:119|3:19:184:5|3:18:165:5|3:22:212:2-1-6|3:23:191:2-1-7|3:25:169:2-8|3:9:171:2-8|3:10:240|3:11:107|3:12:295|3:31:363:12|3:13:167|3:14:172:15|3:15:123|3:33:259:15-14|3:16:675:2-1-6-22-41-42-103-123-65-68|3:17:201|3:38:225:17|3:20:209:5-19|3:37:250:5-19|" + "3:39:221:5-19|3:60:266:5-19|3:21:246:5-19-20|3:40:244:5-19-39|3:41:235:2-1-6-22|3:24:187:2-8|3:28:311|3:29:348|3:30:303|3:32:274:13|3:35:246|3:34:318:35|3:53:342:35-34|3:36:287:35|3:56:307:5-19-37|3:101:285:5-19-39-40|3:42:267:2-1-6-22-41|3:43:271:2-1-6-22|3:102:305:2-1-6-22-41-42|3:103:298:2-1-6-22-41-42|3:104:285:2-1-7-23|3:44:252:2-1-6-22|3:45:262:2-8-24|3:106:310:2-8-24|3:50:389:13|3:52:458:13|3:55:355:5-19-37-56|3:57:337:5-19-37-56|3:59:311:5-19-60|3:58:378:5-19-60-59|3:100:439:5-19-60-59-58|3:61:552:2-1-6-22-41-42-103-123-66|3:66:462:2-1-6-22-41-42-103-123|3:67:532:2-1-6-22-41-42-103-123-66|3:62:849:2-1-6-22-41-42-103-123-65-68-16|3:63:1009:2-1-6-22-41-42-103-123-124-125|3:64:484:2-1-6-22-41-42-103-123|3:65:450:2-1-6-22-41-42-103-123|3:68:513:2-1-6-22-41-42-103-123-65|3:69:595:2-1-6-22-41-42-103-123-65-68|3:72:1093:2-1-6-22-41-42-103-123-65-68-16-62|3:98:564:5-19-60-59-58-100-99|3:99:509:5-19-60-59-58-100|3:123:335:2-1-6-22-41-42-103|3:105:329:2-1-7-23-104|3:134:374:2-1-7-23-104-105|3:135:389:2-1-7-23-104-105|3:133:370:2-8-24-106|3:121:463:5-19-37-56|3:122:431:5-19-37-56|3:124:418:2-1-6-22-41-42-103-123|3:125:467:2-1-6-22-41-42-103-123-124|3:136:451:2-8-24-106-133|4:6:107:1|4:7:118:1|4:8:185:2|4:5:53|4:19:118:5|4:18:99:5|4:22:168:1-6|4:23:147:1-7|4:25:241:2-8|4:9:243:2-8|4:10:340:2-8-9|4:11:182|4:12:316:15|4:31:384:15-12|4:13:188:15|4:14:147:15|4:15:98|4:33:234:15-14|4:16:631:1-6-22-41-42-103-123-65-68|4:17:121|4:38:145:17|4:20:143:5-19|4:37:184:5-19|4:39:155:5-19|4:60:200:5-19|4:21:180:5-19-20|4:40:178:5-19-39|4:41:191:1-6-22|4:24:190:1-7-23|4:28:411:2-8-9|4:29:448:2-8-9|4:30:407:3|4:32:263:15-14|4:35:166|4:34:238:35|4:53:262:35-34|4:36:207:35|4:56:241:5-19-37|4:101:219:5-19-39-40|4:42:223:1-6-22-41|4:43:227:1-6-22|4:102:261:1-6-22-41-42|4:103:254:1-6-22-41-42|4:104:241:1-7-23|4:44:208:1-6-22|4:45:221:1-7-23|4:106:269:1-7-23|" + "4:50:362:35-34|4:52:428:35-34-53|4:55:289:5-19-37-56|4:57:271:5-19-37-56|4:59:245:5-19-60|4:58:312:5-19-60-59|4:100:373:5-19-60-59-58|4:61:508:1-6-22-41-42-103-123-66|4:66:418:1-6-22-41-42-103-123|4:67:488:1-6-22-41-42-103-123-66|4:62:796:5-19-60-59-58-100-99-98|4:63:965:1-6-22-41-42-103-123-124-125|4:64:440:1-6-22-41-42-103-123|4:65:406:1-6-22-41-42-103-123|4:68:469:1-6-22-41-42-103-123-65|4:69:551:1-6-22-41-42-103-123-65-68|4:72:1040:5-19-60-59-58-100-99-98-62|4:98:498:5-19-60-59-58-100-99|4:99:443:5-19-60-59-58-100|4:123:291:1-6-22-41-42-103|4:105:285:1-7-23-104|4:134:330:1-7-23-104-105|4:135:345:1-7-23-104-105|4:133:329:1-7-23-106|4:121:397:5-19-37-56|4:122:365:5-19-37-56|4:124:374:1-6-22-41-42-103-123|4:125:423:1-6-22-41-42-103-123-124|4:136:410:1-7-23-106-133|5:6:63|5:7:93:6|5:8:170:6-7|5:19:65|5:18:46|5:22:124:6|5:23:122:6-7|5:25:226:6-7-23-24|5:9:228:6-7-8|5:10:325:6-7-8-9|5:11:226:3|5:12:369:4-15|5:31:437:4-15-12|5:13:241:4-15|5:14:200:4-15|5:15:151:4|5:33:257:18-17-35|5:16:587:6-22-41-42-103-123-65-68|5:17:90:18|5:38:108:19|5:20:90:19|5:37:131:19|5:39:102:19|5:60:147:19|5:21:127:19-20|5:40:125:19-39|5:41:147:6-22|5:24:165:6-7-23|5:28:396:6-7-8-9|5:29:433:6-7-8-9|5:30:422:3|5:32:316:4-15-14|5:35:157:18-17|5:34:229:18-17-35|5:53:253:18-17-35-34|5:36:198:18-17-35|5:56:188:19-37|5:101:166:19-39-40|5:42:179:6-22-41|5:43:183:6-22|5:102:212:19-39-40-101|5:103:210:6-22-41-42|5:104:215:6-22-43|5:44:164:6-22|5:45:196:6-7-23|5:106:244:6-7-23|5:50:353:18-17-35-34|5:52:400:19-37|5:55:236:19-37-56|5:57:218:19-37-56|5:59:192:19-60|5:58:259:19-60-59|5:100:320:19-60-59-58|5:61:464:6-22-41-42-103-123-66|5:66:374:6-22-41-42-103-123|5:67:444:6-22-41-42-103-123-66|5:62:743:19-60-59-58-100-99-98|5:63:921:6-22-41-42-103-123-124-125|5:64:396:6-22-41-42-103-123|5:65:362:6-22-41-42-103-123|5:68:425:6-22-41-42-103-123-65|5:69:507:6-22-41-42-103-123-65-68|5:72:987:19-60-59-58-100-99-98-62|5:98:445:19-60-59-58-100-99|5:99:390:19-60-59-58-100|5:123:247:6-22-41-42-103|5:105:259:6-22-43-104|5:134:304:6-22-43-104-105|5:135:308:6-22-41-42-103-123|5:133:304:6-7-23-106|5:121:344:19-37-56|" + "5:122:312:19-37-56|5:124:330:6-22-41-42-103-123|5:125:379:6-22-41-42-103-123-124|5:136:375:6-22-41-42-103-123-124|19:22:126:20-21-41|19:23:187:5-6-7|19:25:291:5-6-7-23-24|19:31:502:5-4-15-12|19:33:234:38-17-35|19:38:43|19:20:25|19:37:66|19:39:37|19:60:82|19:21:62:20|19:40:60:39|19:41:103:20-21|19:24:230:5-6-7-23|19:28:461:5-6-7-8-9|19:29:498:5-6-7-8-9|19:30:487:5-3|19:32:302:38-17-14|19:35:134:38-17|19:34:206:38-17-35|19:53:230:38-17-35-34|19:36:155:37|19:56:123:37|19:101:101:39-40|19:42:135:20-21-41|19:43:140:20-21-41|19:102:147:39-40-101|19:103:166:20-21-41-42|19:104:172:20-21-41-43|19:44:166:20-21-41-22|19:45:219:20-21-41-22-44|19:106:258:20-21-41-43-104-105|19:50:312:37|19:52:335:37|19:55:171:37-56|19:57:153:37-56|19:59:127:60|19:58:194:60-59|19:100:255:60-59-58|19:61:412:39-40-101-102-123-66|19:66:322:39-40-101-102-123|19:67:392:39-40-101-102-123-66|19:62:678:60-59-58-100-99-98|19:63:869:39-40-101-102-123-124-125|19:64:344:39-40-101-102-123|19:65:310:39-40-101-102-123|19:68:373:39-40-101-102-123-65|19:69:455:39-40-101-102-123-65-68|19:72:922:60-59-58-100-99-98-62|19:98:380:60-59-58-100-99|19:99:325:60-59-58-100|19:123:195:39-40-101-102|19:105:216:20-21-41-43-104|19:134:261:20-21-41-43-104-105|19:135:256:39-40-101-102-123|19:133:308:20-21-41-43-104-105-134|19:121:279:37-56|19:122:247:37-56|19:124:278:39-40-101-102-123|19:125:327:39-40-101-102-123-124|19:136:323:39-40-101-102-123-124|18:19:49|18:22:170:5-6|18:23:168:5-6-7|18:25:272:5-6-7-23-24|18:31:483:5-4-15-12|18:33:211:17-35|18:38:68:17|18:20:74:19|18:37:115:19|18:39:86:19|18:60:131:19|18:21:111:19-20|18:40:109:19-39|18:41:152:19-20-21|18:24:211:5-6-7-23|18:28:442:5-6-7-8-9|18:29:479:5-6-7-8-9|18:30:468:5-3|18:32:279:17-14|18:35:111:17|18:34:183:17-35|18:53:207:17-35-34|18:36:152:17-35|18:56:172:19-37|18:101:150:19-39-40|18:42:184:19-20-21-41|18:43:189:19-20-21-41|18:102:196:19-39-40-101|18:103:215:19-20-21-41-42|18:104:221:19-20-21-41-43|18:44:210:5-6-22|18:45:242:5-6-7-23|18:106:290:5-6-7-23|18:50:307:17-35-34|18:52:373:17-35-34-53|" + "18:55:220:19-37-56|18:57:202:19-37-56|18:59:176:19-60|18:58:243:19-60-59|18:100:304:19-60-59-58|18:61:461:19-39-40-101-102-123-66|18:66:371:19-39-40-101-102-123|18:67:441:19-39-40-101-102-123-66|18:62:727:19-60-59-58-100-99-98|18:63:918:19-39-40-101-102-123-124-125|18:64:393:19-39-40-101-102-123|18:65:359:19-39-40-101-102-123|18:68:422:19-39-40-101-102-123-65|18:69:504:19-39-40-101-102-123-65-68|18:72:971:19-60-59-58-100-99-98-62|18:98:429:19-60-59-58-100-99|18:99:374:19-60-59-58-100|18:123:244:19-39-40-101-102|18:105:265:19-20-21-41-43-104|18:134:310:19-20-21-41-43-104-105|18:135:305:19-39-40-101-102-123|18:133:350:5-6-7-23-106|18:121:328:19-37-56|18:122:296:19-37-56|18:124:327:19-39-40-101-102-123|18:125:376:19-39-40-101-102-123-124|18:136:372:19-39-40-101-102-123-124|22:23:110:44|22:25:214:44-23-24|22:31:552:6-1-4-15-12|22:33:360:41-21-20-19-38-17-35|22:38:169:41-21-20-19|22:37:192:41-21-20-19|22:39:121:41-21-40|22:60:200:41-21-40-39|22:40:98:41-21|22:41:23|22:24:153:44-23|22:28:386:7-8-9|22:29:423:7-8-9|22:30:515:6-1-2-3|22:32:428:41-21-20-19-38-17-14|22:35:260:41-21-20-19-38-17|22:34:332:41-21-20-19-38-17-35|22:53:356:41-21-20-19-38-17-35-34|22:36:281:41-21-20-19-37|22:56:249:41-21-20-19-37|22:101:139:41-42-102|22:42:55:41|22:43:59|22:102:93:41-42|22:103:86:41-42|22:104:91:43|22:44:40|22:45:93:44|22:106:135:44|22:50:438:41-21-20-19-37|22:52:461:41-21-20-19-37|22:55:297:41-21-20-19-37-56|22:57:278:41-21-40-39-60-59|22:59:245:41-21-40-39-60|22:58:312:41-21-40-39-60-59|22:100:373:41-21-40-39-60-59-58|22:61:340:41-42-103-123-66|22:66:250:41-42-103-123|22:67:320:41-42-103-123-66|22:62:637:41-42-103-123-65-68-16|22:63:797:41-42-103-123-124-125|22:64:272:41-42-103-123|22:65:238:41-42-103-123|22:68:301:41-42-103-123-65|22:69:383:41-42-103-123-65-68|22:72:881:41-42-103-123-65-68-16-62|22:98:498:41-21-40-39-60-59-58-100-99|22:99:443:41-21-40-39-60-59-58-100|22:123:123:41-42-103|22:105:135:43-104|22:134:180:43-104-105|22:135:184:41-42-103-123|22:133:195:44-106|22:121:405:41-21-20-19-37-56|22:122:373:41-21-20-19-37-56|22:124:206:41-42-103-123|22:125:255:41-42-103-123-124|22:136:251:41-42-103-123-124|23:25:104:24|23:31:531:7-1-4-15-12|23:33:379:7-6-5-18-17-35|23:38:230:7-6-5-19|23:37:253:7-6-5-19|23:39:224:7-6-5-19|23:60:269:7-6-5-19|23:40:208:44-22-41-21|23:41:133:44-22|23:24:43|23:28:332:7-8-9|23:29:369:7-8-9|23:30:494:7-1-2-3|23:32:410:7-1-4-15-14|23:35:279:7-6-5-18-17|" + "23:34:351:7-6-5-18-17-35|23:53:375:7-6-5-18-17-35-34|23:36:320:7-6-5-18-17-35|23:56:310:7-6-5-19-37|23:101:249:44-22-41-42-102|23:42:165:44-22-41|23:43:126:104|23:102:203:44-22-41-42|23:103:156:104-43|23:104:94|23:44:70|23:45:74|23:106:122|23:50:475:7-6-5-18-17-35-34|23:52:522:7-6-5-19-37|23:55:358:7-6-5-19-37-56|23:57:340:7-6-5-19-37-56|23:59:314:7-6-5-19-60|23:58:381:7-6-5-19-60-59|23:100:442:7-6-5-19-60-59-58|23:61:367:104-66|23:66:277:104|23:67:347:104-66|23:62:664:104-65-68-16|23:63:824:104-124-125|23:64:299:104|23:65:265:104|23:68:328:104-65|23:69:410:104-65-68|23:72:908:104-65-68-16-62|23:98:567:7-6-5-19-60-59-58-100-99|23:99:512:7-6-5-19-60-59-58-100|23:123:193:104-43-103|23:105:138:104|23:134:183:104-105|23:135:198:104-105|23:133:182:106|23:121:466:7-6-5-19-37-56|23:122:434:7-6-5-19-37-56|23:124:233:104|23:125:282:104-124|23:136:263:106-133|25:31:532:8-2-3-12|25:33:428:8-2-3-15-14|25:38:334:8-7-6-5-19|25:37:357:8-7-6-5-19|25:39:328:8-7-6-5-19|25:60:373:8-7-6-5-19|25:40:312:24-23-44-22-41-21|25:41:237:24-23-44-22|25:28:282:8-9|25:29:319:8-9|25:30:472:8-2-3|25:32:443:8-2-3-13|25:35:383:8-2|25:34:455:8-2-35|25:53:479:8-2-35-34|25:36:424:8-2-35|25:56:414:8-7-6-5-19-37|25:101:353:24-23-44-22-41-42-102|25:42:269:24-23-44-22-41|25:43:230:24-23-104|25:102:307:24-23-44-22-41-42|25:103:260:24-23-104-43|25:104:198:24-23|25:44:174:24-23|25:45:136:24|25:106:184:24|25:50:558:8-2-3-13|25:52:626:8-7-6-5-19-37|25:55:462:8-7-6-5-19-37-56|25:57:444:8-7-6-5-19-37-56|25:59:418:8-7-6-5-19-60|25:58:485:8-7-6-5-19-60-59|25:100:546:8-7-6-5-19-60-59-58|25:61:471:24-23-104-66|25:66:381:24-23-104|25:67:451:24-23-104-66|25:62:768:24-23-104-65-68-16|25:63:889:24-106-133-136-125|25:64:403:24-23-104|25:65:369:24-23-104|25:68:432:24-23-104-65|25:69:514:24-23-104-65-68|25:72:1012:24-23-104-65-68-16-62|25:98:671:8-7-6-5-19-60-59-58-100-99|25:99:616:8-7-6-5-19-60-59-58-100|25:123:297:24-23-104-43-103|25:105:226:24-106|25:134:271:24-106-105|25:135:286:24-106-105|25:133:244:24-106|25:121:570:8-7-6-5-19-37-56|25:122:538:8-7-6-5-19-37-56|25:124:326:24-106-105-134|25:125:347:24-106-133-136|25:136:325:24-106-133|9:19:293:8-7-6-5|9:18:274:8-7-6-5|9:22:218:8-7|" + "9:23:164:8-7|9:25:114:8|9:10:97|9:11:211|9:12:432:11|9:31:487:11|9:13:324:11|9:14:343:8-2-3-15|9:15:294:8-2-3|9:33:430:8-2-3-15-14|9:16:654:8-7-23-104-65-68|9:17:318:8-7-6-5-18|9:38:336:8-7-6-5-19|9:20:318:8-7-6-5-19|9:37:359:8-7-6-5-19|9:39:330:8-7-6-5-19|9:60:375:8-7-6-5-19|9:21:282:8-7-22-41|9:40:316:8-7-22-41-21|9:41:241:8-7-22|9:24:132:8|9:28:168|9:29:205|9:30:373:29|9:32:431:11-13|9:35:385:8-2|9:34:457:8-2-35|9:53:481:8-2-35-34|9:36:426:8-2-35|9:56:416:8-7-6-5-19-37|9:101:357:8-7-22-41-42-102|9:42:273:8-7-22-41|9:43:247:8-7|9:102:311:8-7-22-41-42|9:103:277:8-7-43|9:104:258:8-7-23|9:44:228:8-7|9:45:207:8-24|9:106:255:8-24|9:50:546:11-13|9:52:615:11-13|9:55:464:8-7-6-5-19-37-56|9:57:446:8-7-6-5-19-37-56|9:59:420:8-7-6-5-19-60|9:58:487:8-7-6-5-19-60-59|9:100:548:8-7-6-5-19-60-59-58|9:61:531:8-7-23-104-66|9:66:441:8-7-23-104|9:67:511:8-7-23-104-66|9:62:828:8-7-23-104-65-68-16|9:63:960:8-24-106-133-136-125|9:64:463:8-7-23-104|9:65:429:8-7-23-104|9:68:492:8-7-23-104-65|9:69:574:8-7-23-104-65-68|9:72:1072:8-7-23-104-65-68-16-62|9:98:673:8-7-6-5-19-60-59-58-100-99|9:99:618:8-7-6-5-19-60-59-58-100|9:123:314:8-7-43-103|9:105:297:8-24-106|9:134:342:8-24-106-105|9:135:357:8-24-106-105|9:133:315:8-24-106|9:121:572:8-7-6-5-19-37-56|9:122:540:8-7-6-5-19-37-56|9:124:397:8-7-23-104|9:125:418:8-24-106-133-136|9:136:396:8-24-106-133|10:19:390:9-8-7-6-5|10:18:371:9-8-7-6-5|10:22:315:9-8-7|10:23:261:9-8-7|10:25:211:9-8|10:11:164|10:12:385:11|10:31:440:11|10:13:277:11|10:14:353:11-15|10:15:304:11|10:33:387:11-13|10:16:751:9-8-7-23-104-65-68|10:17:403:11|10:38:427:11-17|10:20:415:9-8-7-6-5-19|10:37:456:9-8-7-6-5-19|10:39:427:9-8-7-6-5-19|10:60:472:9-8-7-6-5-19|10:21:379:9-8-7-22-41|10:40:413:9-8-7-22-41-21|10:41:338:9-8-7-22|10:24:229:9-8|10:28:121|10:29:158|10:30:326:29|10:32:384:11-13|10:35:448:11|10:34:503:11-13|10:53:527:11-13-34|10:36:489:11-35|10:56:513:9-8-7-6-5-19-37|" + "10:101:454:9-8-7-22-41-42-102|10:42:370:9-8-7-22-41|10:43:344:9-8-7|10:102:408:9-8-7-22-41-42|10:103:374:9-8-7-43|10:104:355:9-8-7-23|10:44:325:9-8-7|10:45:304:9-8-24|10:106:352:9-8-24|10:50:499:11-13|10:52:568:11-13|10:55:561:9-8-7-6-5-19-37-56|10:57:543:9-8-7-6-5-19-37-56|10:59:517:9-8-7-6-5-19-60|10:58:584:9-8-7-6-5-19-60-59|10:100:645:9-8-7-6-5-19-60-59-58|10:61:628:9-8-7-23-104-66|10:66:538:9-8-7-23-104|10:67:608:9-8-7-23-104-66|10:62:925:9-8-7-23-104-65-68-16|10:63:1057:9-8-24-106-133-136-125|10:64:560:9-8-7-23-104|10:65:526:9-8-7-23-104|10:68:589:9-8-7-23-104-65|10:69:671:9-8-7-23-104-65-68|10:72:1169:9-8-7-23-104-65-68-16-62|10:98:770:9-8-7-6-5-19-60-59-58-100-99|10:99:715:9-8-7-6-5-19-60-59-58-100|10:123:411:9-8-7-43-103|10:105:394:9-8-24-106|10:134:439:9-8-24-106-105|10:135:454:9-8-24-106-105|10:133:412:9-8-24-106|10:121:669:9-8-7-6-5-19-37-56|10:122:637:9-8-7-6-5-19-37-56|10:124:494:9-8-7-23-104|10:125:515:9-8-24-106-133-136|10:136:493:9-8-24-106-133|11:19:291:3-5|11:18:272:3-5|11:22:319:3-2-1-6|11:23:298:3-2-1-7|11:25:276:3-2-8|11:12:221|11:31:276|11:13:113|11:14:189:15|11:15:140|11:33:223:13|11:16:782:3-2-1-6-22-41-42-103-123-65-68|11:17:239|11:38:263:17|11:20:316:3-5-19|11:37:357:3-5-19|11:39:328:3-5-19|11:60:373:3-5-19|11:21:353:3-5-19-20|11:40:351:3-5-19-39|11:41:342:3-2-1-6-22|11:24:294:3-2-8|11:28:235|11:29:272|11:30:227|11:32:220:13|11:35:284|11:34:339:13|11:53:363:13-34|11:36:325:35|11:56:414:3-5-19-37|11:101:392:3-5-19-39-40|11:42:374:3-2-1-6-22-41|11:43:378:3-2-1-6-22|11:102:412:3-2-1-6-22-41-42|11:103:405:3-2-1-6-22-41-42|11:104:392:3-2-1-7-23|11:44:359:3-2-1-6-22|11:45:369:3-2-8-24|11:106:417:3-2-8-24|11:50:335:13|11:52:404:13|11:55:462:3-5-19-37-56|11:57:444:3-5-19-37-56|11:59:418:3-5-19-60|11:58:485:3-5-19-60-59|11:100:546:3-5-19-60-59-58|11:61:659:3-2-1-6-22-41-42-103-123-66|11:66:569:3-2-1-6-22-41-42-103-123|11:67:639:3-2-1-6-22-41-42-103-123-66|11:62:956:3-2-1-6-22-41-42-103-123-65-68-16|11:63:1116:3-2-1-6-22-41-42-103-123-124-125|11:64:591:3-2-1-6-22-41-42-103-123|11:65:557:3-2-1-6-22-41-42-103-123|11:68:620:3-2-1-6-22-41-42-103-123-65|11:69:702:3-2-1-6-22-41-42-103-123-65-68|11:72:1200:3-2-1-6-22-41-42-103-123-65-68-16-62|11:98:671:3-5-19-60-59-58-100-99|11:99:616:3-5-19-60-59-58-100|11:123:442:3-2-1-6-22-41-42-103|11:105:436:3-2-1-7-23-104|11:134:481:3-2-1-7-23-104-105|" + "11:135:496:3-2-1-7-23-104-105|11:133:477:3-2-8-24-106|11:121:570:3-5-19-37-56|11:122:538:3-5-19-37-56|11:124:525:3-2-1-6-22-41-42-103-123|11:125:574:3-2-1-6-22-41-42-103-123-124|11:136:558:3-2-8-24-106-133|12:19:434:15-4-5|12:18:415:15-4-5|12:22:484:15-4-1-6|12:23:463:15-4-1-7|12:25:464:3-2-8|12:31:68|12:13:131|12:14:260:13|12:15:218|12:33:241:32|12:16:947:15-4-1-6-22-41-42-103-123-65-68|12:17:373:15|12:38:397:15-17|12:20:459:15-4-5-19|12:37:471:32-33-35-36|12:39:471:15-4-5-19|12:60:516:15-4-5-19|12:21:496:15-4-5-19-20|12:40:494:15-4-5-19-39|12:41:507:15-4-1-6-22|12:24:482:3-2-8|12:28:456:11|12:29:463:31-30|12:30:295:31|12:32:145|12:35:341:32-33|12:34:357:32|12:53:381:32-34|12:36:382:32-33-35|12:56:476:32-33-35-36|12:101:535:15-4-5-19-39-40|12:42:539:15-4-1-6-22-41|12:43:543:15-4-1-6-22|12:102:577:15-4-1-6-22-41-42|12:103:570:15-4-1-6-22-41-42|12:104:557:15-4-1-7-23|12:44:524:15-4-1-6-22|12:45:537:15-4-1-7-23|12:106:585:15-4-1-7-23|12:50:353:32|12:52:422:32|12:55:508:32|12:57:506:32-33-35-36-56|12:59:539:32-33-35-36-56-57|12:58:606:32-33-35-36-56-57-59|12:100:667:32-33-35-36-56-57-59-58|12:61:824:15-4-1-6-22-41-42-103-123-66|12:66:734:15-4-1-6-22-41-42-103-123|12:67:804:15-4-1-6-22-41-42-103-123-66|12:62:1090:32-33-35-36-56-57-59-58-100-99-98|12:63:1281:15-4-1-6-22-41-42-103-123-124-125|12:64:756:15-4-1-6-22-41-42-103-123|12:65:722:15-4-1-6-22-41-42-103-123|12:68:785:15-4-1-6-22-41-42-103-123-65|12:69:867:15-4-1-6-22-41-42-103-123-65-68|12:72:1334:32-33-35-36-56-57-59-58-100-99-98-62|12:98:792:32-33-35-36-56-57-59-58-100-99|12:99:737:32-33-35-36-56-57-59-58-100|12:123:607:15-4-1-6-22-41-42-103|12:105:601:15-4-1-7-23-104|12:134:646:15-4-1-7-23-104-105|12:135:661:15-4-1-7-23-104-105|12:133:645:15-4-1-7-23-106|12:121:631:32-55|12:122:599:32-55|12:124:690:15-4-1-6-22-41-42-103-123|12:125:739:15-4-1-6-22-41-42-103-123-124|12:136:726:15-4-1-7-23-106-133|31:33:309:12-32|31:38:465:12-15-17|31:37:539:12-32-33-35-36|31:39:539:12-15-4-5-19|31:60:584:12-15-4-5-19|31:40:562:12-15-4-5-19-39|31:41:575:12-15-4-1-6-22|31:32:213:12|31:35:409:12-32-33|31:34:425:12-32|31:53:449:12-32-34|31:36:450:12-32-33-35|31:56:544:12-32-33-35-36|31:101:603:12-15-4-5-19-39-40|31:42:607:12-15-4-1-6-22-41|31:43:611:12-15-4-1-6-22|31:102:645:12-15-4-1-6-22-41-42|31:103:638:12-15-4-1-6-22-41-42|31:104:625:12-15-4-1-7-23|31:44:592:12-15-4-1-6-22|31:45:605:12-15-4-1-7-23|31:106:653:12-15-4-1-7-23|31:50:421:12-32|31:52:490:12-32|31:55:576:12-32|" + "31:57:574:12-32-33-35-36-56|31:59:607:12-32-33-35-36-56-57|31:58:674:12-32-33-35-36-56-57-59|31:100:735:12-32-33-35-36-56-57-59-58|31:61:892:12-15-4-1-6-22-41-42-103-123-66|31:66:802:12-15-4-1-6-22-41-42-103-123|31:67:872:12-15-4-1-6-22-41-42-103-123-66|31:62:1158:12-32-33-35-36-56-57-59-58-100-99-98|31:63:1349:12-15-4-1-6-22-41-42-103-123-124-125|31:64:824:12-15-4-1-6-22-41-42-103-123|31:65:790:12-15-4-1-6-22-41-42-103-123|31:68:853:12-15-4-1-6-22-41-42-103-123-65|31:69:935:12-15-4-1-6-22-41-42-103-123-65-68|31:72:1402:12-32-33-35-36-56-57-59-58-100-99-98-62|31:98:860:12-32-33-35-36-56-57-59-58-100-99|31:99:805:12-32-33-35-36-56-57-59-58-100|31:123:675:12-15-4-1-6-22-41-42-103|31:105:669:12-15-4-1-7-23-104|31:134:714:12-15-4-1-7-23-104-105|31:135:729:12-15-4-1-7-23-104-105|31:133:713:12-15-4-1-7-23-106|31:121:699:12-32-55|31:122:667:12-32-55|31:124:758:12-15-4-1-6-22-41-42-103-123|31:125:807:12-15-4-1-6-22-41-42-103-123-124|31:136:794:12-15-4-1-7-23-106-133|13:19:306:15-4-5|13:18:287:15-4-5|13:22:356:15-4-1-6|13:23:335:15-4-1-7|13:25:336:3-2-8|13:31:199:12|13:14:129|13:15:90|13:33:110|13:16:819:15-4-1-6-22-41-42-103-123-65-68|13:17:245:15|13:38:269:15-17|13:20:331:15-4-5-19|13:37:340:33-35-36|13:39:343:15-4-5-19|13:60:388:15-4-5-19|13:21:368:15-4-5-19-20|13:40:366:15-4-5-19-39|13:41:379:15-4-1-6-22|13:24:354:3-2-8|13:28:348:11|13:29:385:11|13:30:340:11|13:32:107|13:35:210:33|13:34:226|13:53:250:34|13:36:251:33-35|13:56:345:33-35-36|13:101:407:15-4-5-19-39-40|13:42:411:15-4-1-6-22-41|13:43:415:15-4-1-6-22|13:102:449:15-4-1-6-22-41-42|13:103:442:15-4-1-6-22-41-42|13:104:429:15-4-1-7-23|13:44:396:15-4-1-6-22|13:45:409:15-4-1-7-23|13:106:457:15-4-1-7-23|13:50:222|13:52:291|13:55:377|13:57:375:33-35-36-56|13:59:408:33-35-36-56-57|13:58:475:33-35-36-56-57-59|13:100:536:33-35-36-56-57-59-58|13:61:696:15-4-1-6-22-41-42-103-123-66|13:66:606:15-4-1-6-22-41-42-103-123|13:67:676:15-4-1-6-22-41-42-103-123-66|13:62:959:33-35-36-56-57-59-58-100-99-98|13:63:1153:15-4-1-6-22-41-42-103-123-124-125|13:64:628:15-4-1-6-22-41-42-103-123|13:65:594:15-4-1-6-22-41-42-103-123|13:68:657:15-4-1-6-22-41-42-103-123-65|13:69:739:15-4-1-6-22-41-42-103-123-65-68|13:72:1203:33-35-36-56-57-59-58-100-99-98-62|13:98:661:33-35-36-56-57-59-58-100-99|13:99:606:33-35-36-56-57-59-58-100|13:123:479:15-4-1-6-22-41-42-103|13:105:473:15-4-1-7-23-104|13:134:518:15-4-1-7-23-104-105|13:135:533:15-4-1-7-23-104-105|13:133:517:15-4-1-7-23-106|13:121:500:55|13:122:468:55|13:124:562:15-4-1-6-22-41-42-103-123|13:125:611:15-4-1-6-22-41-42-103-123-124|13:136:598:15-4-1-7-23-106-133|14:19:186:17-38|14:18:163:17|14:22:312:17-38-19-20-21-41|14:23:294:15-4-1-7|14:25:341:15-3-2-8|14:31:328:13-12|14:15:49|" + "14:33:87|14:16:721:17-38-19-39-40-101-102-123-65-68|14:17:119|14:38:143:17|14:20:211:17-38-19|14:37:252:17-38-19|14:39:223:17-38-19|14:60:268:17-38-19|14:21:248:17-38-19-20|14:40:246:17-38-19-39|14:41:289:17-38-19-20-21|14:24:337:15-4-1-7-23|14:28:424:15-11|14:29:461:15-11|14:30:416:15-11|14:32:116|14:35:164|14:34:235|14:53:259:34|14:36:205:35|14:56:299:35-36|14:101:287:17-38-19-39-40|14:42:321:17-38-19-20-21-41|14:43:326:17-38-19-20-21-41|14:102:333:17-38-19-39-40-101|14:103:352:17-38-19-20-21-41-42|14:104:358:17-38-19-20-21-41-43|14:44:352:17-38-19-20-21-41-22|14:45:368:15-4-1-7-23|14:106:416:15-4-1-7-23|14:50:231|14:52:300|14:55:347:35-36-56|14:57:329:35-36-56|14:59:313:17-38-19-60|14:58:380:17-38-19-60-59|14:100:441:17-38-19-60-59-58|14:61:598:17-38-19-39-40-101-102-123-66|14:66:508:17-38-19-39-40-101-102-123|14:67:578:17-38-19-39-40-101-102-123-66|14:62:864:17-38-19-60-59-58-100-99-98|14:63:1055:17-38-19-39-40-101-102-123-124-125|14:64:530:17-38-19-39-40-101-102-123|14:65:496:17-38-19-39-40-101-102-123|14:68:559:17-38-19-39-40-101-102-123-65|14:69:641:17-38-19-39-40-101-102-123-65-68|14:72:1108:17-38-19-60-59-58-100-99-98-62|14:98:566:17-38-19-60-59-58-100-99|14:99:511:17-38-19-60-59-58-100|14:123:381:17-38-19-39-40-101-102|14:105:402:17-38-19-20-21-41-43-104|14:134:447:17-38-19-20-21-41-43-104-105|14:135:442:17-38-19-39-40-101-102-123|14:133:476:15-4-1-7-23-106|14:121:455:35-36-56|14:122:423:35-36-56|14:124:464:17-38-19-39-40-101-102-123|14:125:513:17-38-19-39-40-101-102-123-124|14:136:509:17-38-19-39-40-101-102-123-124|15:19:216:4-5|15:18:197:4-5|15:22:266:4-1-6|15:23:245:4-1-7|15:25:292:3-2-8|15:31:286:12|15:33:136:14|15:16:729:4-1-6-22-41-42-103-123-65-68|15:17:155|15:38:179:17|15:20:241:4-5-19|15:37:282:4-5-19|15:39:253:4-5-19|15:60:298:4-5-19|15:21:278:4-5-19-20|15:40:276:4-5-19-39|15:41:289:4-1-6-22|15:24:288:4-1-7-23|15:28:375:11|15:29:412:11|15:30:367:11|15:32:165:14|15:35:200|15:34:272:35|15:53:296:35-34|15:36:241:35|15:56:335:35-36|15:101:317:4-5-19-39-40|15:42:321:4-1-6-22-41|15:43:325:4-1-6-22|15:102:359:4-1-6-22-41-42|15:103:352:4-1-6-22-41-42|15:104:339:4-1-7-23|15:44:306:4-1-6-22|15:45:319:4-1-7-23|15:106:367:4-1-7-23|15:50:280:14|15:52:349:14|15:55:383:35-36-56|15:57:365:35-36-56|15:59:343:4-5-19-60|" + "15:58:410:4-5-19-60-59|15:100:471:4-5-19-60-59-58|15:61:606:4-1-6-22-41-42-103-123-66|15:66:516:4-1-6-22-41-42-103-123|15:67:586:4-1-6-22-41-42-103-123-66|15:62:894:4-5-19-60-59-58-100-99-98|15:63:1063:4-1-6-22-41-42-103-123-124-125|15:64:538:4-1-6-22-41-42-103-123|15:65:504:4-1-6-22-41-42-103-123|15:68:567:4-1-6-22-41-42-103-123-65|15:69:649:4-1-6-22-41-42-103-123-65-68|15:72:1138:4-5-19-60-59-58-100-99-98-62|15:98:596:4-5-19-60-59-58-100-99|15:99:541:4-5-19-60-59-58-100|15:123:389:4-1-6-22-41-42-103|15:105:383:4-1-7-23-104|15:134:428:4-1-7-23-104-105|15:135:443:4-1-7-23-104-105|15:133:427:4-1-7-23-106|15:121:491:35-36-56|15:122:459:35-36-56|15:124:472:4-1-6-22-41-42-103-123|15:125:521:4-1-6-22-41-42-103-123-124|15:136:508:4-1-7-23-106-133|33:38:191:35-17|33:37:230:35-36|33:39:271:35-17-38-19|33:60:286:35-36-37|33:40:294:35-17-38-19-39|33:41:337:35-17-38-19-20-21|33:35:100|33:34:160|33:53:184:34|33:36:141:35|33:56:235:35-36|33:101:335:35-17-38-19-39-40|33:42:369:35-17-38-19-20-21-41|33:43:374:35-17-38-19-20-21-41|33:102:381:35-17-38-19-39-40-101|33:103:400:35-17-38-19-20-21-41-42|33:104:406:35-17-38-19-20-21-41-43|33:44:400:35-17-38-19-20-21-41-22|33:45:453:35-17-38-19-20-21-41-22-44|33:106:492:35-17-38-19-20-21-41-43-104-105|33:50:156|33:52:225|33:55:283:35-36-56|33:57:265:35-36-56|33:59:298:35-36-56-57|33:58:365:35-36-56-57-59|33:100:426:35-36-56-57-59-58|33:61:646:35-17-38-19-39-40-101-102-123-66|33:66:556:35-17-38-19-39-40-101-102-123|33:67:626:35-17-38-19-39-40-101-102-123-66|33:62:849:35-36-56-57-59-58-100-99-98|33:63:1103:35-17-38-19-39-40-101-102-123-124-125|33:64:578:35-17-38-19-39-40-101-102-123|33:65:544:35-17-38-19-39-40-101-102-123|33:68:607:35-17-38-19-39-40-101-102-123-65|33:69:689:35-17-38-19-39-40-101-102-123-65-68|33:72:1093:35-36-56-57-59-58-100-99-98-62|33:98:551:35-36-56-57-59-58-100-99|33:99:496:35-36-56-57-59-58-100|33:123:429:35-17-38-19-39-40-101-102|33:105:450:35-17-38-19-20-21-41-43-104|33:134:495:35-17-38-19-20-21-41-43-104-105|33:135:490:35-17-38-19-39-40-101-102-123|33:133:542:35-17-38-19-20-21-41-43-104-105-134|33:121:391:35-36-56|33:122:359:35-36-56|33:124:512:35-17-38-19-39-40-101-102-123|33:125:561:35-17-38-19-39-40-101-102-123-124|33:136:557:35-17-38-19-39-40-101-102-123-124|16:19:535:68-65-123-102-101-40-39|16:18:584:68-65-123-102-101-40-39-19|16:22:463:68-65-123-103-42-41|16:23:490:68-65-104|16:25:594:68-65-104-23-24|16:31:1015:68-65-123-103-42-41-22-6-1-4-15-12|16:33:769:68-65-123-102-101-40-39-19-38-17-35|16:17:602:68-65-123-102-101-40-39-19-38|16:38:578:68-65-123-102-101-40-39-19|16:20:514:68-65-123-102-101-40|16:37:561:68-65-123-102-101-60|16:39:498:68-65-123-102-101-40|16:60:505:68-65-123-102-101|16:21:481:68-65-123-103-42-41|16:40:475:68-65-123-102-101|16:41:440:68-65-123-103-42|16:24:533:68-65-104-23|16:28:822:68-65-123-103-43-7-8-9|16:29:859:68-65-123-103-43-7-8-9|16:30:978:68-65-123-103-42-41-22-6-1-2-3|16:32:837:68-65-123-102-101-40-39-19-38-17-14|16:35:669:68-65-123-102-101-40-39-19-38-17|16:34:741:68-65-123-102-101-40-39-19-38-17-35|16:53:736:68-65-123-102-101-60-37|16:36:650:68-65-123-102-101-60-37|16:56:613:68-65-123-102-101-60-59-57|16:101:434:68-65-123-102|" + "16:42:408:68-65-123-103|16:43:407:68-65-123-103|16:102:388:68-65-123|16:103:377:68-65-123|16:104:396:68-65|16:44:452:68-65-104|16:45:473:68-65-104|16:106:457:68-65-135-105|16:50:807:68-65-123-102-101-60-37|16:52:711:98-99-100|16:55:610:98-99-100|16:57:583:68-65-123-102-101-60-59|16:59:550:68-65-123-102-101-60|16:58:504:98-99-100|16:100:443:98-99|16:61:282:68-67|16:66:257:68-67|16:67:187:68|16:62:174|16:63:431|16:64:263:68-65|16:65:225:68|16:68:162|16:69:162|16:72:418:62|16:98:318|16:99:373:98|16:123:340:68-65|16:105:415:68-65-135|16:134:388:68-65-135|16:135:355:68-65|16:133:435:68-65-135-134|16:121:511:98-99|16:122:535:98-99-100|16:124:377:68-65|16:125:426:68-65-124|16:136:422:68-65-124|17:19:67:38|17:18:44|17:22:193:38-19-20-21-41|17:23:212:18-5-6-7|17:25:316:18-5-6-7-23-24|17:31:441:15-12|17:33:167:35|17:38:24|17:20:92:38-19|17:37:133:38-19|17:39:104:38-19|17:60:149:38-19|17:21:129:38-19-20|17:40:127:38-19-39|17:41:170:38-19-20-21|17:24:255:18-5-6-7-23|17:28:474:11|17:29:511:11|17:30:466:11|17:32:235:14|17:35:67|17:34:139:35|17:53:163:35-34|17:36:108:35|17:56:190:38-19-37|17:101:168:38-19-39-40|17:42:202:38-19-20-21-41|17:43:207:38-19-20-21-41|17:102:214:38-19-39-40-101|17:103:233:38-19-20-21-41-42|17:104:239:38-19-20-21-41-43|17:44:233:38-19-20-21-41-22|17:45:286:38-19-20-21-41-22-44|17:106:325:38-19-20-21-41-43-104-105|17:50:263:35-34|17:52:329:35-34-53|17:55:238:38-19-37-56|17:57:220:38-19-37-56|17:59:194:38-19-60|17:58:261:38-19-60-59|17:100:322:38-19-60-59-58|17:61:479:38-19-39-40-101-102-123-66|17:66:389:38-19-39-40-101-102-123|17:67:459:38-19-39-40-101-102-123-66|17:62:745:38-19-60-59-58-100-99-98|17:63:936:38-19-39-40-101-102-123-124-125|17:64:411:38-19-39-40-101-102-123|17:65:377:38-19-39-40-101-102-123|17:68:440:38-19-39-40-101-102-123-65|17:69:522:38-19-39-40-101-102-123-65-68|17:72:989:38-19-60-59-58-100-99-98-62|17:98:447:38-19-60-59-58-100-99|17:99:392:38-19-60-59-58-100|17:123:262:38-19-39-40-101-102|17:105:283:38-19-20-21-41-43-104|17:134:328:38-19-20-21-41-43-104-105|17:135:323:38-19-39-40-101-102-123|17:133:375:38-19-20-21-41-43-104-105-134|17:121:346:38-19-37-56|17:122:314:38-19-37-56|17:124:345:38-19-39-40-101-102-123|17:125:394:38-19-39-40-101-102-123-124|17:136:390:38-19-39-40-101-102-123-124|" + "38:39:80:19|38:60:125:19|38:40:103:19-39|38:41:146:19-20-21|38:53:187:17-35-34|38:56:166:19-37|38:101:144:19-39-40|38:42:178:19-20-21-41|38:43:183:19-20-21-41|38:102:190:19-39-40-101|38:103:209:19-20-21-41-42|38:104:215:19-20-21-41-43|38:44:209:19-20-21-41-22|38:45:262:19-20-21-41-22-44|38:106:301:19-20-21-41-43-104-105|38:50:287:17-35-34|38:52:353:17-35-34-53|38:55:214:19-37-56|38:57:196:19-37-56|38:59:170:19-60|38:58:237:19-60-59|38:100:298:19-60-59-58|38:61:455:19-39-40-101-102-123-66|38:66:365:19-39-40-101-102-123|38:67:435:19-39-40-101-102-123-66|38:62:721:19-60-59-58-100-99-98|38:63:912:19-39-40-101-102-123-124-125|38:64:387:19-39-40-101-102-123|38:65:353:19-39-40-101-102-123|38:68:416:19-39-40-101-102-123-65|38:69:498:19-39-40-101-102-123-65-68|38:72:965:19-60-59-58-100-99-98-62|38:98:423:19-60-59-58-100-99|38:99:368:19-60-59-58-100|38:123:238:19-39-40-101-102|38:105:259:19-20-21-41-43-104|38:134:304:19-20-21-41-43-104-105|38:135:299:19-39-40-101-102-123|38:133:351:19-20-21-41-43-104-105-134|38:121:322:19-37-56|38:122:290:19-37-56|38:124:321:19-39-40-101-102-123|38:125:370:19-39-40-101-102-123-124|38:136:366:19-39-40-101-102-123-124|20:22:101:21-41|20:23:211:21-41-22-44|20:25:315:21-41-22-44-23-24|20:31:527:19-5-4-15-12|20:33:259:19-38-17-35|20:38:68:19|20:37:91:19|20:39:62:19|20:60:107:19|20:21:37|20:40:39|20:41:78:21|20:24:254:21-41-22-44-23|20:28:486:19-5-6-7-8-9|20:29:523:19-5-6-7-8-9|20:30:512:19-5-3|20:32:327:19-38-17-14|20:35:159:19-38-17|20:34:231:19-38-17-35|20:53:255:19-38-17-35-34|20:36:180:19-37|20:56:148:19-37|20:101:80:40|20:42:110:21-41|20:43:115:21-41|20:102:126:40-101|20:103:141:21-41-42|20:104:147:21-41-43|20:44:141:21-41-22|20:45:194:21-41-22-44|20:106:233:21-41-43-104-105|20:50:337:19-37|20:52:360:19-37|20:55:196:19-37-56|20:57:178:19-37-56|20:59:152:19-60|20:58:219:19-60-59|20:100:280:19-60-59-58|20:61:391:40-101-102-123-66|20:66:301:40-101-102-123|20:67:371:40-101-102-123-66|20:62:688:40-101-102-123-65-68-16|20:63:848:40-101-102-123-124-125|20:64:323:40-101-102-123|20:65:289:40-101-102-123|20:68:352:40-101-102-123-65|20:69:434:40-101-102-123-65-68|20:72:932:40-101-102-123-65-68-16-62|20:98:405:19-60-59-58-100-99|20:99:350:19-60-59-58-100|20:123:174:40-101-102|20:105:191:21-41-43-104|20:134:236:21-41-43-104-105|20:135:235:40-101-102-123|20:133:283:21-41-43-104-105-134|20:121:304:19-37-56|" + "20:122:272:19-37-56|20:124:257:40-101-102-123|20:125:306:40-101-102-123-124|20:136:302:40-101-102-123-124|37:38:109:19|37:39:103:19|37:60:56|37:40:126:19-39|37:41:169:19-20-21|37:53:175|37:56:57|37:101:127:60|37:42:201:19-20-21-41|37:43:206:19-20-21-41|37:102:173:60-101|37:103:232:19-20-21-41-42|37:104:238:19-20-21-41-43|37:44:232:19-20-21-41-22|37:45:285:19-20-21-41-22-44|37:106:324:19-20-21-41-43-104-105|37:50:246|37:52:269|37:55:105:56|37:57:87:56|37:59:101:60|37:58:168:60-59|37:100:229:60-59-58|37:61:438:60-101-102-123-66|37:66:348:60-101-102-123|37:67:418:60-101-102-123-66|37:62:652:60-59-58-100-99-98|37:63:895:60-101-102-123-124-125|37:64:370:60-101-102-123|37:65:336:60-101-102-123|37:68:399:60-101-102-123-65|37:69:481:60-101-102-123-65-68|37:72:896:60-59-58-100-99-98-62|37:98:354:60-59-58-100-99|37:99:299:60-59-58-100|37:123:221:60-101-102|37:105:282:19-20-21-41-43-104|37:134:315:60-101-102-123-135|37:135:282:60-101-102-123|37:133:362:60-101-102-123-135-134|37:121:213:56|37:122:181:56|37:124:304:60-101-102-123|37:125:353:60-101-102-123-124|37:136:349:60-101-102-123-124|39:60:79|39:40:23|39:41:98:40-21|39:53:267:19-38-17-35-34|39:56:160:19-37|39:101:64:40|39:42:130:40-21-41|39:43:135:40-21-41|39:102:110:40-101|39:103:161:40-21-41-42|39:104:167:40-21-41-43|39:44:161:40-21-41-22|39:45:214:40-21-41-22-44|39:106:253:40-21-41-43-104-105|39:50:349:19-37|39:52:372:19-37|39:55:208:19-37-56|39:57:157:60-59|39:59:124:60|39:58:191:60-59|39:100:252:60-59-58|39:61:375:40-101-102-123-66|39:66:285:40-101-102-123|39:67:355:40-101-102-123-66|39:62:672:40-101-102-123-65-68-16|39:63:832:40-101-102-123-124-125|39:64:307:40-101-102-123|39:65:273:40-101-102-123|39:68:336:40-101-102-123-65|39:69:418:40-101-102-123-65-68|39:72:916:40-101-102-123-65-68-16-62|39:98:377:60-59-58-100-99|39:99:322:60-59-58-100|39:123:158:40-101-102|39:105:211:40-21-41-43-104|39:134:252:40-101-102-123-135|39:135:219:40-101-102-123|39:133:299:40-101-102-123-135-134|39:121:316:19-37-56|39:122:284:19-37-56|39:124:241:40-101-102-123|39:125:290:40-101-102-123-124|39:136:286:40-101-102-123-124|60:101:71|60:102:117:101|60:103:186:101-102-42|60:104:246:39-40-21-41-43|60:106:328:101-102-123-135-105|60:100:173:59-58|60:61:382:101-102-123-66|60:66:292:101-102-123|" + "60:67:362:101-102-123-66|60:62:596:59-58-100-99-98|60:63:839:101-102-123-124-125|60:64:314:101-102-123|60:65:280:101-102-123|60:68:343:101-102-123-65|60:69:425:101-102-123-65-68|60:72:840:59-58-100-99-98-62|60:98:298:59-58-100-99|60:99:243:59-58-100|60:123:165:101-102|60:105:286:101-102-123-135|60:134:259:101-102-123-135|60:135:226:101-102-123|60:133:306:101-102-123-135-134|60:121:255:59-58-100|60:122:232:59-57-56|60:124:248:101-102-123|60:125:297:101-102-123-124|60:136:293:101-102-123-124|21:22:64:41|21:23:174:41-22-44|21:25:278:41-22-44-23-24|21:31:564:20-19-5-4-15-12|21:33:296:20-19-38-17-35|21:38:105:20-19|21:37:128:20-19|21:39:57:40|21:60:136:40-39|21:40:34|21:41:41|21:24:217:41-22-44-23|21:28:450:41-22-7-8-9|21:29:487:41-22-7-8-9|21:30:549:20-19-5-3|21:32:364:20-19-38-17-14|21:35:196:20-19-38-17|21:34:268:20-19-38-17-35|21:53:292:20-19-38-17-35-34|21:36:217:20-19-37|21:56:185:20-19-37|21:101:75:40|21:42:73:41|21:43:78:41|21:102:111:41-42|21:103:104:41-42|21:104:110:41-43|21:44:104:41-22|21:45:157:41-22-44|21:106:196:41-43-104-105|21:50:374:20-19-37|21:52:397:20-19-37|21:55:233:20-19-37-56|21:57:214:40-39-60-59|21:59:181:40-39-60|21:58:248:40-39-60-59|21:100:309:40-39-60-59-58|21:61:358:41-42-103-123-66|21:66:268:41-42-103-123|21:67:338:41-42-103-123-66|21:62:655:41-42-103-123-65-68-16|21:63:815:41-42-103-123-124-125|21:64:290:41-42-103-123|21:65:256:41-42-103-123|21:68:319:41-42-103-123-65|21:69:401:41-42-103-123-65-68|21:72:899:41-42-103-123-65-68-16-62|21:98:434:40-39-60-59-58-100-99|21:99:379:40-39-60-59-58-100|21:123:141:41-42-103|21:105:154:41-43-104|21:134:199:41-43-104-105|21:135:202:41-42-103-123|21:133:246:41-43-104-105-134|21:121:341:20-19-37-56|21:122:309:20-19-37-56|21:124:224:41-42-103-123|21:125:273:41-42-103-123-124|21:136:269:41-42-103-123-124|40:60:102:39|40:41:75:21|40:53:290:39-19-38-17-35-34|40:56:183:39-19-37|40:101:41|40:42:107:21-41|40:43:112:21-41|40:102:87:101|40:103:138:21-41-42|40:104:144:21-41-43|40:44:138:21-41-22|40:45:191:21-41-22-44|40:106:230:21-41-43-104-105|40:50:372:39-19-37|40:52:395:39-19-37|40:55:231:39-19-37-56|40:57:180:39-60-59|40:59:147:39-60|40:58:214:39-60-59|40:100:275:39-60-59-58|40:61:352:101-102-123-66|" + "40:66:262:101-102-123|40:67:332:101-102-123-66|40:62:649:101-102-123-65-68-16|40:63:809:101-102-123-124-125|40:64:284:101-102-123|40:65:250:101-102-123|40:68:313:101-102-123-65|40:69:395:101-102-123-65-68|40:72:893:101-102-123-65-68-16-62|40:98:400:39-60-59-58-100-99|40:99:345:39-60-59-58-100|40:123:135:101-102|40:105:188:21-41-43-104|40:134:229:101-102-123-135|40:135:196:101-102-123|40:133:276:101-102-123-135-134|40:121:339:39-19-37-56|40:122:307:39-19-37-56|40:124:218:101-102-123|40:125:267:101-102-123-124|40:136:263:101-102-123-124|41:60:177:21-40-39|41:53:333:21-20-19-38-17-35-34|41:56:226:21-20-19-37|41:101:116:42-102|41:42:32|41:43:37|41:102:70:42|41:103:63:42|41:104:69:43|41:44:63:22|41:45:116:22-44|41:106:155:43-104-105|41:50:415:21-20-19-37|41:52:438:21-20-19-37|41:55:274:21-20-19-37-56|41:57:255:21-40-39-60-59|41:59:222:21-40-39-60|41:58:289:21-40-39-60-59|41:100:350:21-40-39-60-59-58|41:61:317:42-103-123-66|41:66:227:42-103-123|41:67:297:42-103-123-66|41:62:614:42-103-123-65-68-16|41:63:774:42-103-123-124-125|41:64:249:42-103-123|41:65:215:42-103-123|41:68:278:42-103-123-65|41:69:360:42-103-123-65-68|41:72:858:42-103-123-65-68-16-62|41:98:475:21-40-39-60-59-58-100-99|41:99:420:21-40-39-60-59-58-100|41:123:100:42-103|41:105:113:43-104|41:134:158:43-104-105|41:135:161:42-103-123|41:133:205:43-104-105-134|41:121:382:21-20-19-37-56|41:122:350:21-20-19-37-56|41:124:183:42-103-123|41:125:232:42-103-123-124|41:136:228:42-103-123-124|24:25:61|24:31:550:8-2-3-12|24:33:422:23-7-6-5-18-17-35|24:38:273:23-7-6-5-19|24:37:296:23-7-6-5-19|24:39:267:23-7-6-5-19|24:60:312:23-7-6-5-19|24:40:251:23-44-22-41-21|24:41:176:23-44-22|24:28:300:8-9|24:29:337:8-9|24:30:490:8-2-3|24:32:453:23-7-1-4-15-14|24:35:322:23-7-6-5-18-17|24:34:394:23-7-6-5-18-17-35|24:53:418:23-7-6-5-18-17-35-34|24:36:363:23-7-6-5-18-17-35|24:56:353:23-7-6-5-19-37|24:101:292:23-44-22-41-42-102|24:42:208:23-44-22-41|24:43:169:23-104|24:102:246:23-44-22-41-42|24:103:199:23-104-43|24:104:137:23|24:44:113:23|24:45:75|24:106:123|24:50:518:23-7-6-5-18-17-35-34|24:52:565:23-7-6-5-19-37|24:55:401:23-7-6-5-19-37-56|24:57:383:23-7-6-5-19-37-56|24:59:357:23-7-6-5-19-60|24:58:424:23-7-6-5-19-60-59|24:100:485:23-7-6-5-19-60-59-58|24:61:410:23-104-66|24:66:320:23-104|24:67:390:23-104-66|24:62:707:23-104-65-68-16|" + "24:63:828:106-133-136-125|24:64:342:23-104|24:65:308:23-104|24:68:371:23-104-65|24:69:453:23-104-65-68|24:72:951:23-104-65-68-16-62|24:98:610:23-7-6-5-19-60-59-58-100-99|24:99:555:23-7-6-5-19-60-59-58-100|24:123:236:23-104-43-103|24:105:165:106|24:134:210:106-105|24:135:225:106-105|24:133:183:106|24:121:509:23-7-6-5-19-37-56|24:122:477:23-7-6-5-19-37-56|24:124:265:106-105-134|24:125:286:106-133-136|24:136:264:106-133|28:31:487:29-30|28:33:458:11-13|28:38:498:11-17|28:37:527:9-8-7-6-5-19|28:39:498:9-8-7-6-5-19|28:60:543:9-8-7-6-5-19|28:40:484:9-8-7-22-41-21|28:41:409:9-8-7-22|28:29:92|28:30:260:29|28:32:455:11-13|28:35:519:11|28:34:574:11-13|28:53:598:11-13-34|28:36:560:11-35|28:56:584:9-8-7-6-5-19-37|28:101:525:9-8-7-22-41-42-102|28:42:441:9-8-7-22-41|28:43:415:9-8-7|28:102:479:9-8-7-22-41-42|28:103:445:9-8-7-43|28:104:426:9-8-7-23|28:44:396:9-8-7|28:45:375:9-8-24|28:106:423:9-8-24|28:50:570:11-13|28:52:639:11-13|28:55:632:9-8-7-6-5-19-37-56|28:57:614:9-8-7-6-5-19-37-56|28:59:588:9-8-7-6-5-19-60|28:58:655:9-8-7-6-5-19-60-59|28:100:716:9-8-7-6-5-19-60-59-58|28:61:699:9-8-7-23-104-66|28:66:609:9-8-7-23-104|28:67:679:9-8-7-23-104-66|28:62:996:9-8-7-23-104-65-68-16|28:63:1128:9-8-24-106-133-136-125|28:64:631:9-8-7-23-104|28:65:597:9-8-7-23-104|28:68:660:9-8-7-23-104-65|28:69:742:9-8-7-23-104-65-68|28:72:1240:9-8-7-23-104-65-68-16-62|28:98:841:9-8-7-6-5-19-60-59-58-100-99|28:99:786:9-8-7-6-5-19-60-59-58-100|28:123:482:9-8-7-43-103|28:105:465:9-8-24-106|28:134:510:9-8-24-106-105|28:135:525:9-8-24-106-105|28:133:483:9-8-24-106|28:121:740:9-8-7-6-5-19-37-56|28:122:708:9-8-7-6-5-19-37-56|28:124:565:9-8-7-23-104|28:125:586:9-8-24-106-133-136|28:136:564:9-8-24-106-133|29:31:395:30|29:33:495:11-13|29:38:535:11-17|29:37:564:9-8-7-6-5-19|29:39:535:9-8-7-6-5-19|29:60:580:9-8-7-6-5-19|29:40:521:9-8-7-22-41-21|29:41:446:9-8-7-22|29:30:168|29:32:492:11-13|29:35:556:11|29:34:611:11-13|29:53:635:11-13-34|29:36:597:11-35|29:56:621:9-8-7-6-5-19-37|29:101:562:9-8-7-22-41-42-102|29:42:478:9-8-7-22-41|29:43:452:9-8-7|29:102:516:9-8-7-22-41-42|29:103:482:9-8-7-43|29:104:463:9-8-7-23|29:44:433:9-8-7|29:45:412:9-8-24|29:106:460:9-8-24|29:50:607:11-13|29:52:676:11-13|29:55:669:9-8-7-6-5-19-37-56|29:57:651:9-8-7-6-5-19-37-56|" + "29:59:625:9-8-7-6-5-19-60|29:58:692:9-8-7-6-5-19-60-59|29:100:753:9-8-7-6-5-19-60-59-58|29:61:736:9-8-7-23-104-66|29:66:646:9-8-7-23-104|29:67:716:9-8-7-23-104-66|29:62:1033:9-8-7-23-104-65-68-16|29:63:1165:9-8-24-106-133-136-125|29:64:668:9-8-7-23-104|29:65:634:9-8-7-23-104|29:68:697:9-8-7-23-104-65|29:69:779:9-8-7-23-104-65-68|29:72:1277:9-8-7-23-104-65-68-16-62|29:98:878:9-8-7-6-5-19-60-59-58-100-99|29:99:823:9-8-7-6-5-19-60-59-58-100|29:123:519:9-8-7-43-103|29:105:502:9-8-24-106|29:134:547:9-8-24-106-105|29:135:562:9-8-24-106-105|29:133:520:9-8-24-106|29:121:777:9-8-7-6-5-19-37-56|29:122:745:9-8-7-6-5-19-37-56|29:124:602:9-8-7-23-104|29:125:623:9-8-24-106-133-136|29:136:601:9-8-24-106-133|30:31:227|30:33:450:11-13|30:38:490:11-17|30:37:553:3-5-19|30:39:524:3-5-19|30:60:569:3-5-19|30:40:547:3-5-19-39|30:41:538:3-2-1-6-22|30:32:440:31-12|30:35:511:11|30:34:566:11-13|30:53:590:11-13-34|30:36:552:11-35|30:56:610:3-5-19-37|30:101:588:3-5-19-39-40|30:42:570:3-2-1-6-22-41|30:43:574:3-2-1-6-22|30:102:608:3-2-1-6-22-41-42|30:103:601:3-2-1-6-22-41-42|30:104:588:3-2-1-7-23|30:44:555:3-2-1-6-22|30:45:565:3-2-8-24|30:106:613:3-2-8-24|30:50:562:11-13|30:52:631:11-13|30:55:658:3-5-19-37-56|30:57:640:3-5-19-37-56|30:59:614:3-5-19-60|30:58:681:3-5-19-60-59|30:100:742:3-5-19-60-59-58|30:61:855:3-2-1-6-22-41-42-103-123-66|30:66:765:3-2-1-6-22-41-42-103-123|30:67:835:3-2-1-6-22-41-42-103-123-66|30:62:1152:3-2-1-6-22-41-42-103-123-65-68-16|30:63:1312:3-2-1-6-22-41-42-103-123-124-125|30:64:787:3-2-1-6-22-41-42-103-123|30:65:753:3-2-1-6-22-41-42-103-123|30:68:816:3-2-1-6-22-41-42-103-123-65|30:69:898:3-2-1-6-22-41-42-103-123-65-68|30:72:1396:3-2-1-6-22-41-42-103-123-65-68-16-62|30:98:867:3-5-19-60-59-58-100-99|30:99:812:3-5-19-60-59-58-100|30:123:638:3-2-1-6-22-41-42-103|30:105:632:3-2-1-7-23-104|30:134:677:3-2-1-7-23-104-105|30:135:692:3-2-1-7-23-104-105|30:133:673:3-2-8-24-106|30:121:766:3-5-19-37-56|30:122:734:3-5-19-37-56|30:124:721:3-2-1-6-22-41-42-103-123|30:125:770:3-2-1-6-22-41-42-103-123-124|30:136:754:3-2-8-24-106-133|32:33:96|32:38:259:14-17|32:37:326:33-35-36|32:39:339:14-17-38-19|32:60:382:33-35-36-37|32:40:362:14-17-38-19-39|32:41:405:14-17-38-19-20-21|32:35:196:33|32:34:212|32:53:236:34|32:36:237:33-35|32:56:331:33-35-36|32:101:403:14-17-38-19-39-40|32:42:437:14-17-38-19-20-21-41|32:43:442:14-17-38-19-20-21-41|32:102:449:14-17-38-19-39-40-101|32:103:468:14-17-38-19-20-21-41-42|32:104:474:14-17-38-19-20-21-41-43|32:44:468:14-17-38-19-20-21-41-22|32:45:484:14-15-4-1-7-23|32:106:532:14-15-4-1-7-23|32:50:208|32:52:277|" + "32:55:363|32:57:361:33-35-36-56|32:59:394:33-35-36-56-57|32:58:461:33-35-36-56-57-59|32:100:522:33-35-36-56-57-59-58|32:61:714:14-17-38-19-39-40-101-102-123-66|32:66:624:14-17-38-19-39-40-101-102-123|32:67:694:14-17-38-19-39-40-101-102-123-66|32:62:945:33-35-36-56-57-59-58-100-99-98|32:63:1171:14-17-38-19-39-40-101-102-123-124-125|32:64:646:14-17-38-19-39-40-101-102-123|32:65:612:14-17-38-19-39-40-101-102-123|32:68:675:14-17-38-19-39-40-101-102-123-65|32:69:757:14-17-38-19-39-40-101-102-123-65-68|32:72:1189:33-35-36-56-57-59-58-100-99-98-62|32:98:647:33-35-36-56-57-59-58-100-99|32:99:592:33-35-36-56-57-59-58-100|32:123:497:14-17-38-19-39-40-101-102|32:105:518:14-17-38-19-20-21-41-43-104|32:134:563:14-17-38-19-20-21-41-43-104-105|32:135:558:14-17-38-19-39-40-101-102-123|32:133:592:14-15-4-1-7-23-106|32:121:486:55|32:122:454:55|32:124:580:14-17-38-19-39-40-101-102-123|32:125:629:14-17-38-19-39-40-101-102-123-124|32:136:625:14-17-38-19-39-40-101-102-123-124|35:38:91:17|35:37:130:36|35:39:171:17-38-19|35:60:186:36-37|35:40:194:17-38-19-39|35:41:237:17-38-19-20-21|35:53:96:34|35:36:41|35:56:135:36|35:101:235:17-38-19-39-40|35:42:269:17-38-19-20-21-41|35:43:274:17-38-19-20-21-41|35:102:281:17-38-19-39-40-101|35:103:300:17-38-19-20-21-41-42|35:104:306:17-38-19-20-21-41-43|35:44:300:17-38-19-20-21-41-22|35:45:353:17-38-19-20-21-41-22-44|35:106:392:17-38-19-20-21-41-43-104-105|35:50:196:34|35:52:262:34-53|35:55:183:36-56|35:57:165:36-56|35:59:198:36-56-57|35:58:265:36-56-57-59|35:100:326:36-56-57-59-58|35:61:546:17-38-19-39-40-101-102-123-66|35:66:456:17-38-19-39-40-101-102-123|35:67:526:17-38-19-39-40-101-102-123-66|35:62:749:36-56-57-59-58-100-99-98|35:63:1003:17-38-19-39-40-101-102-123-124-125|35:64:478:17-38-19-39-40-101-102-123|35:65:444:17-38-19-39-40-101-102-123|35:68:507:17-38-19-39-40-101-102-123-65|35:69:589:17-38-19-39-40-101-102-123-65-68|35:72:993:36-56-57-59-58-100-99-98-62|35:98:451:36-56-57-59-58-100-99|35:99:396:36-56-57-59-58-100|35:123:329:17-38-19-39-40-101-102|35:105:350:17-38-19-20-21-41-43-104|35:134:395:17-38-19-20-21-41-43-104-105|35:135:390:17-38-19-39-40-101-102-123|35:133:442:17-38-19-20-21-41-43-104-105-134|35:121:291:36-56|35:122:259:36-56|35:124:412:17-38-19-39-40-101-102-123|35:125:461:17-38-19-39-40-101-102-123-124|35:136:457:17-38-19-39-40-101-102-123-124|34:38:163:35-17|34:37:199:53|34:39:243:35-17-38-19|34:60:255:53-37|34:40:266:35-17-38-19-39|34:41:309:35-17-38-19-20-21|34:35:72|34:53:24|34:36:113:35|34:56:204:53|34:101:307:35-17-38-19-39-40|34:42:341:35-17-38-19-20-21-41|34:43:346:35-17-38-19-20-21-41|34:102:353:35-17-38-19-39-40-101|34:103:372:35-17-38-19-20-21-41-42|34:104:378:35-17-38-19-20-21-41-43|34:44:372:35-17-38-19-20-21-41-22|34:45:425:35-17-38-19-20-21-41-22-44|34:106:464:35-17-38-19-20-21-41-43-104-105|34:50:124|34:52:190:53|34:55:168:53|34:57:234:53-56|34:59:267:53-56-57|34:58:334:53-56-57-59|34:100:335:53-55|" + "34:61:618:35-17-38-19-39-40-101-102-123-66|34:66:528:35-17-38-19-39-40-101-102-123|34:67:598:35-17-38-19-39-40-101-102-123-66|34:62:758:53-55-100-99-98|34:63:1075:35-17-38-19-39-40-101-102-123-124-125|34:64:550:35-17-38-19-39-40-101-102-123|34:65:516:35-17-38-19-39-40-101-102-123|34:68:579:35-17-38-19-39-40-101-102-123-65|34:69:661:35-17-38-19-39-40-101-102-123-65-68|34:72:1002:53-55-100-99-98-62|34:98:460:53-55-100-99|34:99:405:53-55-100|34:123:401:35-17-38-19-39-40-101-102|34:105:422:35-17-38-19-20-21-41-43-104|34:134:467:35-17-38-19-20-21-41-43-104-105|34:135:462:35-17-38-19-39-40-101-102-123|34:133:514:35-17-38-19-20-21-41-43-104-105-134|34:121:291:53-55|34:122:259:53-55|34:124:484:35-17-38-19-39-40-101-102-123|34:125:533:35-17-38-19-39-40-101-102-123-124|34:136:529:35-17-38-19-39-40-101-102-123-124|53:60:231:37|53:56:180|53:101:302:37-60|53:102:348:37-60-101|53:103:396:34-35-17-38-19-20-21-41-42|53:104:402:34-35-17-38-19-20-21-41-43|53:106:488:34-35-17-38-19-20-21-41-43-104-105|53:55:144|53:57:210:56|53:59:243:56-57|53:58:310:56-57-59|53:100:311:55|53:61:613:37-60-101-102-123-66|53:66:523:37-60-101-102-123|53:67:593:37-60-101-102-123-66|53:62:734:55-100-99-98|53:63:1070:37-60-101-102-123-124-125|53:64:545:37-60-101-102-123|53:65:511:37-60-101-102-123|53:68:574:37-60-101-102-123-65|53:69:656:37-60-101-102-123-65-68|53:72:978:55-100-99-98-62|53:98:436:55-100-99|53:99:381:55-100|53:123:396:37-60-101-102|53:105:446:34-35-17-38-19-20-21-41-43-104|53:134:490:37-60-101-102-123-135|53:135:457:37-60-101-102-123|53:133:537:37-60-101-102-123-135-134|53:121:267:55|53:122:235:55|53:124:479:37-60-101-102-123|53:125:528:37-60-101-102-123-124|53:136:524:37-60-101-102-123-124|36:38:132:35-17|36:37:89|36:39:192:37-19|36:60:145:37|36:40:215:37-19-39|36:41:258:37-19-20-21|36:53:137:35-34|36:56:94|36:101:216:37-60|36:42:290:37-19-20-21-41|36:43:295:37-19-20-21-41|36:102:262:37-60-101|36:103:321:37-19-20-21-41-42|36:104:327:37-19-20-21-41-43|36:44:321:37-19-20-21-41-22|36:45:374:37-19-20-21-41-22-44|36:106:413:37-19-20-21-41-43-104-105|36:50:227|36:52:250|36:55:142:56|36:57:124:56|36:59:157:56-57|36:58:224:56-57-59|36:100:285:56-57-59-58|36:61:527:37-60-101-102-123-66|36:66:437:37-60-101-102-123|36:67:507:37-60-101-102-123-66|36:62:708:56-57-59-58-100-99-98|36:63:984:37-60-101-102-123-124-125|36:64:459:37-60-101-102-123|36:65:425:37-60-101-102-123|36:68:488:37-60-101-102-123-65|36:69:570:37-60-101-102-123-65-68|36:72:952:56-57-59-58-100-99-98-62|36:98:410:56-57-59-58-100-99|36:99:355:56-57-59-58-100|36:123:310:37-60-101-102|36:105:371:37-19-20-21-41-43-104|36:134:404:37-60-101-102-123-135|36:135:371:37-60-101-102-123|36:133:451:37-60-101-102-123-135-134|36:121:250:56|36:122:218:56|36:124:393:37-60-101-102-123|" + "36:125:442:37-60-101-102-123-124|36:136:438:37-60-101-102-123-124|56:60:108:57-59|56:101:179:57-59-60|56:102:225:57-59-60-101|56:103:289:37-19-20-21-41-42|56:104:295:37-19-20-21-41-43|56:106:381:37-19-20-21-41-43-104-105|56:57:30|56:59:63:57|56:58:130:57-59|56:100:191:57-59-58|56:61:490:57-59-60-101-102-123-66|56:66:400:57-59-60-101-102-123|56:67:470:57-59-60-101-102-123-66|56:62:614:57-59-58-100-99-98|56:63:947:57-59-60-101-102-123-124-125|56:64:422:57-59-60-101-102-123|56:65:388:57-59-60-101-102-123|56:68:451:57-59-60-101-102-123-65|56:69:533:57-59-60-101-102-123-65-68|56:72:858:57-59-58-100-99-98-62|56:98:316:57-59-58-100-99|56:99:261:57-59-58-100|56:123:273:57-59-60-101-102|56:105:339:37-19-20-21-41-43-104|56:134:367:57-59-60-101-102-123-135|56:135:334:57-59-60-101-102-123|56:133:414:57-59-60-101-102-123-135-134|56:121:156|56:122:124|56:124:356:57-59-60-101-102-123|56:125:405:57-59-60-101-102-123-124|56:136:401:57-59-60-101-102-123-124|101:102:46|101:103:115:102-42|101:104:177:102-42-103-43|101:106:257:102-123-135-105|101:123:94:102|101:105:215:102-123-135|101:134:188:102-123-135|101:135:155:102-123|101:133:235:102-123-135-134|101:121:326:60-59-58-100|101:122:303:60-59-57-56|101:124:177:102-123|101:125:226:102-123-124|101:136:222:102-123-124|42:60:155:102-101|42:53:365:41-21-20-19-38-17-35-34|42:56:258:41-21-20-19-37|42:101:84:102|42:43:61:103|42:102:38|42:103:31|42:104:93:103-43|42:44:95:41-22|42:45:148:41-22-44|42:106:179:103-43-104-105|42:50:447:41-21-20-19-37|42:52:470:41-21-20-19-37|42:55:306:41-21-20-19-37-56|42:57:233:102-101-60-59|42:59:200:102-101-60|42:58:267:102-101-60-59|42:100:328:102-101-60-59-58|42:61:285:103-123-66|42:66:195:103-123|42:67:265:103-123-66|42:62:582:103-123-65-68-16|42:63:742:103-123-124-125|42:64:217:103-123|42:65:183:103-123|42:68:246:103-123-65|42:69:328:103-123-65-68|42:72:826:103-123-65-68-16-62|42:98:453:102-101-60-59-58-100-99|42:99:398:102-101-60-59-58-100|42:123:68:103|42:105:137:103-43-104|42:134:162:103-123-135|42:135:129:103-123|42:133:209:103-123-135-134|42:121:410:102-101-60-59-58-100|42:122:382:41-21-20-19-37-56|42:124:151:103-123|42:125:200:103-123-124|42:136:196:103-123-124|43:60:214:41-21-40-39|43:53:370:41-21-20-19-38-17-35-34|43:56:263:41-21-20-19-37|43:101:145:103-42-102|43:102:99:103-42|43:103:30|43:104:32|43:44:69|43:45:109:104|43:106:118:104-105|43:50:452:41-21-20-19-37|43:52:475:41-21-20-19-37|" + "43:55:311:41-21-20-19-37-56|43:57:292:41-21-40-39-60-59|43:59:259:41-21-40-39-60|43:58:326:41-21-40-39-60-59|43:100:387:41-21-40-39-60-59-58|43:61:284:103-123-66|43:66:194:103-123|43:67:264:103-123-66|43:62:581:103-123-65-68-16|43:63:741:103-123-124-125|43:64:216:103-123|43:65:182:103-123|43:68:245:103-123-65|43:69:327:103-123-65-68|43:72:825:103-123-65-68-16-62|43:98:512:41-21-40-39-60-59-58-100-99|43:99:457:41-21-40-39-60-59-58-100|43:123:67:103|43:105:76:104|43:134:121:104-105|43:135:128:103-123|43:133:168:104-105-134|43:121:419:41-21-20-19-37-56|43:122:387:41-21-20-19-37-56|43:124:150:103-123|43:125:199:103-123-124|43:136:195:103-123-124|102:103:69:42|102:104:131:42-103-43|102:106:211:123-135-105|102:123:48|102:105:169:123-135|102:134:142:123-135|102:135:109:123|102:133:189:123-135-134|102:121:372:101-60-59-58-100|102:122:349:101-60-59-57-56|102:124:131:123|102:125:180:123-124|102:136:176:123-124|103:104:62:43|103:106:148:43-104-105|103:123:37|103:105:106:43-104|103:134:131:123-135|103:135:98:123|103:133:178:123-135-134|103:121:441:42-102-101-60-59-58-100|103:122:413:42-41-21-20-19-37-56|103:124:120:123|103:125:169:123-124|103:136:165:123-124|104:106:86:105|104:123:99:43-103|104:105:44|104:134:89:105|104:135:104:105|104:133:136:105-134|104:121:451:43-41-21-20-19-37-56|104:122:419:43-41-21-20-19-37-56|104:124:139|104:125:188:124|104:136:184:124|44:60:240:22-41-21-40-39|44:53:396:22-41-21-20-19-38-17-35-34|44:56:289:22-41-21-20-19-37|44:101:179:22-41-42-102|44:102:133:22-41-42|44:103:99:43|44:104:56|44:45:53|44:106:95|44:50:478:22-41-21-20-19-37|44:52:501:22-41-21-20-19-37|44:55:337:22-41-21-20-19-37-56|44:57:318:22-41-21-40-39-60-59|44:59:285:22-41-21-40-39-60|44:58:352:22-41-21-40-39-60-59|44:100:413:22-41-21-40-39-60-59-58|44:61:329:104-66|44:66:239:104|44:67:309:104-66|44:62:626:104-65-68-16|44:63:786:104-124-125|44:64:261:104|44:65:227:104|44:68:290:104-65|44:69:372:104-65-68|44:72:870:104-65-68-16-62|44:98:538:22-41-21-40-39-60-59-58-100-99|44:99:483:22-41-21-40-39-60-59-58-100|44:123:136:43-103|44:105:100:104|44:134:145:104-105|44:135:160:104-105|44:133:155:106|44:121:445:22-41-21-20-19-37-56|44:122:413:22-41-21-20-19-37-56|44:124:195:104|44:125:244:104-124|" + "44:136:236:106-133|45:60:293:44-22-41-21-40-39|45:53:449:23-7-6-5-18-17-35-34|45:56:342:44-22-41-21-20-19-37|45:101:232:44-22-41-42-102|45:102:186:44-22-41-42|45:103:139:104-43|45:104:77|45:106:60|45:50:531:44-22-41-21-20-19-37|45:52:554:44-22-41-21-20-19-37|45:55:390:44-22-41-21-20-19-37-56|45:57:371:44-22-41-21-40-39-60-59|45:59:338:44-22-41-21-40-39-60|45:58:405:44-22-41-21-40-39-60-59|45:100:466:44-22-41-21-40-39-60-59-58|45:61:350:104-66|45:66:260:104|45:67:330:104-66|45:62:647:104-65-68-16|45:63:765:106-133-136-125|45:64:282:104|45:65:248:104|45:68:311:104-65|45:69:393:104-65-68|45:72:891:104-65-68-16-62|45:98:591:44-22-41-21-40-39-60-59-58-100-99|45:99:536:44-22-41-21-40-39-60-59-58-100|45:123:176:104-43-103|45:105:102:106|45:134:147:106-105|45:135:162:106-105|45:133:120:106|45:121:498:44-22-41-21-20-19-37-56|45:122:466:44-22-41-21-20-19-37-56|45:124:202:106-105-134|45:125:223:106-133-136|45:136:201:106-133|106:123:163:105-135|106:134:87:105|106:135:102:105|106:133:60|106:121:537:105-104-43-41-21-20-19-37-56|106:122:505:105-104-43-41-21-20-19-37-56|106:124:142:105-134|106:125:163:133-136|106:136:141:133|50:60:302:37|50:53:143|50:56:251|50:101:373:37-60|50:102:419:37-60-101|50:103:478:37-19-20-21-41-42|50:104:484:37-19-20-21-41-43|50:106:570:37-19-20-21-41-43-104-105|50:52:129|50:55:215|50:57:281:56|50:59:314:56-57|50:58:381:56-57-59|50:100:382:55|50:61:684:37-60-101-102-123-66|50:66:594:37-60-101-102-123|50:67:664:37-60-101-102-123-66|50:62:805:55-100-99-98|50:63:1141:37-60-101-102-123-124-125|50:64:616:37-60-101-102-123|50:65:582:37-60-101-102-123|50:68:645:37-60-101-102-123-65|50:69:727:37-60-101-102-123-65-68|50:72:1049:55-100-99-98-62|50:98:507:55-100-99|50:99:452:55-100|50:123:467:37-60-101-102|50:105:528:37-19-20-21-41-43-104|50:134:561:37-60-101-102-123-135|50:135:528:37-60-101-102-123|50:133:608:37-60-101-102-123-135-134|50:121:338:55|50:122:306:55|50:124:550:37-60-101-102-123|50:125:599:37-60-101-102-123-124|50:136:595:37-60-101-102-123-124|52:60:325:37|52:53:166|52:56:217:55|52:101:396:37-60|52:102:442:37-60-101|52:103:501:37-19-20-21-41-42|52:104:507:37-19-20-21-41-43|52:106:593:37-19-20-21-41-43-104-105|52:55:169|52:57:247:55-56|52:59:280:55-56-57|52:58:329:100|52:100:268|52:61:707:37-60-101-102-123-66|52:66:617:37-60-101-102-123|52:67:687:37-60-101-102-123-66|52:62:691:100-99-98|" + "52:63:1074:100-99-98|52:64:639:37-60-101-102-123|52:65:605:37-60-101-102-123|52:68:668:37-60-101-102-123-65|52:69:750:37-60-101-102-123-65-68|52:72:935:100-99-98-62|52:98:393:100-99|52:99:338:100|52:123:490:37-60-101-102|52:105:551:37-19-20-21-41-43-104|52:134:584:37-60-101-102-123-135|52:135:551:37-60-101-102-123|52:133:631:37-60-101-102-123-135-134|52:121:224|52:122:194|52:124:573:37-60-101-102-123|52:125:622:37-60-101-102-123-124|52:136:618:37-60-101-102-123-124|55:60:156:56-57-59|55:56:48|55:101:227:56-57-59-60|55:102:273:56-57-59-60-101|55:103:337:56-37-19-20-21-41-42|55:104:343:56-37-19-20-21-41-43|55:106:429:56-37-19-20-21-41-43-104-105|55:57:78:56|55:59:111:56-57|55:58:178:56-57-59|55:100:167|55:61:538:56-57-59-60-101-102-123-66|55:66:448:56-57-59-60-101-102-123|55:67:518:56-57-59-60-101-102-123-66|55:62:590:100-99-98|55:63:973:100-99-98|55:64:470:56-57-59-60-101-102-123|55:65:436:56-57-59-60-101-102-123|55:68:499:56-57-59-60-101-102-123-65|55:69:581:56-57-59-60-101-102-123-65-68|55:72:834:100-99-98-62|55:98:292:100-99|55:99:237:100|55:123:321:56-57-59-60-101-102|55:105:387:56-37-19-20-21-41-43-104|55:134:415:56-57-59-60-101-102-123-135|55:135:382:56-57-59-60-101-102-123|55:133:462:56-57-59-60-101-102-123-135-134|55:121:123|55:122:91|55:124:404:56-57-59-60-101-102-123|55:125:453:56-57-59-60-101-102-123-124|55:136:449:56-57-59-60-101-102-123-124|57:60:78:59|57:101:149:59-60|57:102:195:59-60-101|57:103:264:59-60-101-102-42|57:104:324:59-60-39-40-21-41-43|57:106:406:59-60-101-102-123-135-105|57:59:33|57:58:100:59|57:100:161:59-58|57:61:460:59-60-101-102-123-66|57:66:370:59-60-101-102-123|57:67:440:59-60-101-102-123-66|57:62:584:59-58-100-99-98|57:63:917:59-60-101-102-123-124-125|57:64:392:59-60-101-102-123|57:65:358:59-60-101-102-123|57:68:421:59-60-101-102-123-65|57:69:503:59-60-101-102-123-65-68|57:72:828:59-58-100-99-98-62|57:98:286:59-58-100-99|57:99:231:59-58-100|57:123:243:59-60-101-102|57:105:364:59-60-101-102-123-135|57:134:337:59-60-101-102-123-135|57:135:304:59-60-101-102-123|57:133:384:59-60-101-102-123-135-134|57:121:186:56|57:122:154:56|57:124:326:59-60-101-102-123|57:125:375:59-60-101-102-123-124|57:136:371:59-60-101-102-123-124|59:60:45|59:101:116:60|59:102:162:60-101|59:103:231:60-101-102-42|59:104:291:60-39-40-21-41-43|59:106:373:60-101-102-123-135-105|59:100:128:58|59:61:427:60-101-102-123-66|59:66:337:60-101-102-123|59:67:407:60-101-102-123-66|59:62:551:58-100-99-98|59:63:884:60-101-102-123-124-125|59:64:359:60-101-102-123|59:65:325:60-101-102-123|59:68:388:60-101-102-123-65|59:69:470:60-101-102-123-65-68|59:72:795:58-100-99-98-62|59:98:253:58-100-99|" + "59:99:198:58-100|59:123:210:60-101-102|59:105:331:60-101-102-123-135|59:134:304:60-101-102-123-135|59:135:271:60-101-102-123|59:133:351:60-101-102-123-135-134|59:121:210:58-100|59:122:187:57-56|59:124:293:60-101-102-123|59:125:342:60-101-102-123-124|59:136:338:60-101-102-123-124|58:60:112:59|58:101:183:59-60|58:102:229:59-60-101|58:103:298:59-60-101-102-42|58:104:358:59-60-39-40-21-41-43|58:106:440:59-60-101-102-123-135-105|58:59:67|58:100:61|58:61:494:59-60-101-102-123-66|58:66:404:59-60-101-102-123|58:67:474:59-60-101-102-123-66|58:62:484:100-99-98|58:63:867:100-99-98|58:64:426:59-60-101-102-123|58:65:392:59-60-101-102-123|58:68:455:59-60-101-102-123-65|58:69:537:59-60-101-102-123-65-68|58:72:728:100-99-98-62|58:98:186:100-99|58:99:131:100|58:123:277:59-60-101-102|58:105:398:59-60-101-102-123-135|58:134:371:59-60-101-102-123-135|58:135:338:59-60-101-102-123|58:133:418:59-60-101-102-123-135-134|58:121:143:100|58:122:153:100|58:124:360:59-60-101-102-123|58:125:409:59-60-101-102-123-124|58:136:405:59-60-101-102-123-124|100:101:244:58-59-60|100:102:290:58-59-60-101|100:103:359:58-59-60-101-102-42|100:104:419:58-59-60-39-40-21-41-43|100:106:501:58-59-60-101-102-123-135-105|100:123:338:58-59-60-101-102|100:105:459:58-59-60-101-102-123-135|100:134:432:58-59-60-101-102-123-135|100:135:399:58-59-60-101-102-123|100:133:479:58-59-60-101-102-123-135-134|100:121:82|100:122:92|100:124:421:58-59-60-101-102-123|100:125:470:58-59-60-101-102-123-124|100:136:466:58-59-60-101-102-123-124|61:101:311:66-123-102|61:102:265:66-123|61:103:254:66-123|61:104:273:66|61:106:334:66-135-105|61:100:478:98-99|61:66:90|61:67:95|61:62:456:67-68-16|61:63:698:67-68-69|61:64:168:66|61:65:134:66|61:68:120:67|61:69:202:67-68|61:72:700:67-68-16-62|61:98:353|61:99:408:98|61:123:217:66|61:105:292:66-135|61:134:265:66-135|61:135:232:66|61:133:312:66-135-134|61:121:546:98-99|61:122:570:98-99-100|61:124:254:66|61:125:303:66-124|61:136:299:66-124|66:101:221:123-102|66:102:175:123|66:103:164:123|66:104:183|66:106:244:135-105|66:100:465:123-102-101-60-59-58|66:67:70|66:68:95:67|66:69:177:67-68|66:72:675:67-68-16-62|66:98:443:61|66:99:498:61-98|66:123:127|66:105:202:135|66:134:175:135|66:135:142|66:133:222:135-134|" + "66:121:547:123-102-101-60-59-58-100|66:122:524:123-102-101-60-59-57-56|66:124:164|66:125:213:124|66:136:209:124|67:101:291:66-123-102|67:102:245:66-123|67:103:234:66-123|67:104:253:66|67:106:314:66-135-105|67:100:526:98-99|67:68:25|67:69:107:68|67:72:605:68-16-62|67:98:401|67:99:456:98|67:123:197:66|67:105:272:66-135|67:134:245:66-135|67:135:212:66|67:133:292:66-135-134|67:121:594:98-99|67:122:594:66-123-102-101-60-59-57-56|67:124:234:66|67:125:283:66-124|67:136:279:66-124|62:101:608:16-68-65-123-102|62:102:562:16-68-65-123|62:103:551:16-68-65-123|62:104:570:16-68-65|62:106:631:16-68-65-135-105|62:100:423:98-99|62:66:431:16-68-67|62:67:361:16-68|62:63:537|62:64:433|62:65:399:16-68|62:68:336:16|62:69:336:16|62:72:244|62:98:298|62:99:353:98|62:123:514:16-68-65|62:105:589:16-68-65-135|62:134:562:16-68-65-135|62:135:529:16-68-65|62:133:609:16-68-65-135-134|62:121:491:98-99|62:122:515:98-99-100|62:124:551:16-68-65|62:125:560|62:136:582:125|63:101:768:125-124-123-102|63:102:722:125-124-123|63:103:711:125-124-123|63:104:730:125-124|63:106:705:125-136-133|63:100:806:98-99|63:66:640:64|63:67:603:69-68|63:64:562|63:65:600:64|63:68:578:69|63:69:496|63:72:507|63:98:681|63:99:736:98|63:123:674:125-124|63:105:691:125-124-134|63:134:646:125-124|63:135:679:125-124-134|63:133:645:125-136|63:121:874:98-99|63:122:898:98-99-100|63:124:591:125|63:125:542|63:136:564:125|64:101:243:123-102|64:102:197:123|64:103:186:123|64:104:205|64:106:266:135-105|64:100:487:123-102-101-60-59-58|64:66:78|64:67:126:65-68|64:65:38|64:68:101:65|64:69:160|64:72:613|64:98:521:66-61|64:99:557:123-102-101-60-59-58-100|64:123:149|64:105:224:135|64:134:197:135|64:135:164|64:133:244:135-134|64:121:569:123-102-101-60-59-58-100|64:122:546:123-102-101-60-59-57-56|64:124:186|64:125:235:124|" + "64:136:231:124|65:101:209:123-102|65:102:163:123|65:103:152:123|65:104:171|65:106:232:135-105|65:100:453:123-102-101-60-59-58|65:66:44|65:67:88:68|65:68:63|65:69:145:68|65:72:643:68-16-62|65:98:487:66-61|65:99:523:123-102-101-60-59-58-100|65:123:115|65:105:190:135|65:134:163:135|65:135:130|65:133:210:135-134|65:121:535:123-102-101-60-59-58-100|65:122:512:123-102-101-60-59-57-56|65:124:152|65:125:201:124|65:136:197:124|68:101:272:65-123-102|68:102:226:65-123|68:103:215:65-123|68:104:234:65|68:106:295:65-135-105|68:100:516:65-123-102-101-60-59-58|68:69:82|68:72:580:16-62|68:98:426:67|68:99:481:67-98|68:123:178:65|68:105:253:65-135|68:134:226:65-135|68:135:193:65|68:133:273:65-135-134|68:121:598:65-123-102-101-60-59-58-100|68:122:575:65-123-102-101-60-59-57-56|68:124:215:65|68:125:264:65-124|68:136:260:65-124|69:101:354:68-65-123-102|69:102:308:68-65-123|69:103:297:68-65-123|69:104:316:68-65|69:106:377:68-65-135-105|69:100:598:68-65-123-102-101-60-59-58|69:72:547|69:98:480:16|69:99:535:16-98|69:123:260:68-65|69:105:335:68-65-135|69:134:308:68-65-135|69:135:275:68-65|69:133:355:68-65-135-134|69:121:673:16-98-99|69:122:657:68-65-123-102-101-60-59-57-56|69:124:297:68-65|69:125:310|69:136:332:125|72:101:852:62-16-68-65-123-102|72:102:806:62-16-68-65-123|72:103:795:62-16-68-65-123|72:104:814:62-16-68-65|72:106:875:62-16-68-65-135-105|72:100:667:62-98-99|72:98:542:62|72:99:597:62-98|72:123:758:62-16-68-65|72:105:833:62-16-68-65-135|72:134:806:62-16-68-65-135|72:135:773:62-16-68-65|72:133:843:125-136|72:121:735:62-98-99|72:122:759:62-98-99-100|72:124:789:125|72:125:740|72:136:762:125|98:101:369:99-100-58-59-60|98:102:415:99-100-58-59-60-101|98:103:484:99-100-58-59-60-101-102-42|98:104:544:99-100-58-59-60-39-40-21-41-43|98:106:626:99-100-58-59-60-101-102-123-135-105|98:100:125:99|98:99:55|98:123:463:99-100-58-59-60-101-102|98:105:584:99-100-58-59-60-101-102-123-135|98:134:557:99-100-58-59-60-101-102-123-135|98:135:524:99-100-58-59-60-101-102-123|98:133:604:99-100-58-59-60-101-102-123-135-134|98:121:193:99|98:122:217:99-100|98:124:546:99-100-58-59-60-101-102-123|98:125:595:99-100-58-59-60-101-102-123-124|98:136:591:99-100-58-59-60-101-102-123-124|99:101:314:100-58-59-60|99:102:360:100-58-59-60-101|" + "99:103:429:100-58-59-60-101-102-42|99:104:489:100-58-59-60-39-40-21-41-43|99:106:571:100-58-59-60-101-102-123-135-105|99:100:70|99:123:408:100-58-59-60-101-102|99:105:529:100-58-59-60-101-102-123-135|99:134:502:100-58-59-60-101-102-123-135|99:135:469:100-58-59-60-101-102-123|99:133:549:100-58-59-60-101-102-123-135-134|99:121:138|99:122:162:100|99:124:491:100-58-59-60-101-102-123|99:125:540:100-58-59-60-101-102-123-124|99:136:536:100-58-59-60-101-102-123-124|123:134:94:135|123:135:61|123:133:141:135-134|123:124:83|123:125:132:124|123:136:128:124|105:106:42|105:123:121:135|105:134:45|105:135:60|105:133:92:134|105:121:495:104-43-41-21-20-19-37-56|105:122:463:104-43-41-21-20-19-37-56|105:124:100:134|105:125:149:134-124|105:136:145:134-124|134:135:33|134:136:100:124|135:136:133:134-124|133:134:47|133:135:80:134|133:136:81|121:123:420:100-58-59-60-101-102|121:134:514:100-58-59-60-101-102-123-135|121:135:481:100-58-59-60-101-102-123|121:133:561:100-58-59-60-101-102-123-135-134|121:122:48|121:124:503:100-58-59-60-101-102-123|121:125:552:100-58-59-60-101-102-123-124|121:136:548:100-58-59-60-101-102-123-124|122:123:397:56-57-59-60-101-102|122:134:491:56-57-59-60-101-102-123-135|122:135:458:56-57-59-60-101-102-123|122:133:538:56-57-59-60-101-102-123-135-134|122:124:480:56-57-59-60-101-102-123|122:125:529:56-57-59-60-101-102-123-124|122:136:525:56-57-59-60-101-102-123-124|124:134:55|124:135:88:134|124:133:102:134|124:125:49|124:136:45|125:134:104:124|125:135:137:124-134|125:133:103:136|125:136:22";
	var paths = base.split("|");
	var _g1 = 0;
	while(_g1 < paths.length) {
		var path = paths[_g1];
		++_g1;
		var infos = path.split(":");
		var start = Std.parseInt(infos[0]);
		var end = Std.parseInt(infos[1]);
		var poid = Std.parseInt(infos[2]);
		var chemin = new shino.Chemin();
		var cheminReverse = new shino.Chemin();
		chemin.poid = poid;
		cheminReverse.poid = poid;
		if(infos.length == 4) {
			var ids = infos[3];
			if(ids != null && ids.length > 0) {
				var tmp = ids.split("-");
				var _g11 = 0;
				while(_g11 < tmp.length) {
					var id = tmp[_g11];
					++_g11;
					if(id != null) {
						chemin.ids.push(id);
						cheminReverse.ids.push(id);
					}
				}
				cheminReverse.ids.reverse();
			}
		}
		shino.ShinoTool.chemins[start - 1][end - 1] = chemin;
		shino.ShinoTool.chemins[end - 1][start - 1] = cheminReverse;
	}
	var _g2 = 0;
	while(_g2 < 136) {
		var i1 = _g2++;
		var chemin1 = new shino.Chemin();
		chemin1.poid = 0;
		shino.ShinoTool.chemins[i1][i1] = chemin1;
	}
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
exports.onmessage = WorkerIA.prototype.messageHandler;
String.__name__ = true;
Array.__name__ = true;
Date.__name__ = ["Date"];
com.tamina.bikewar.data.OrderType.MOVE = "move";
com.tamina.bikewar.data.OrderType.LOAD = "load";
com.tamina.bikewar.data.OrderType.UNLOAD = "unload";
com.tamina.bikewar.data.OrderType.NONE = "none";
com.tamina.bikewar.data._Trend.Trend_Impl_.DECREASE = -1;
com.tamina.bikewar.data._Trend.Trend_Impl_.INCREASE = 1;
com.tamina.bikewar.data._Trend.Trend_Impl_.STABLE = 0;
com.tamina.bikewar.game.Game.GAME_MAX_NUM_TURN = 500;
com.tamina.bikewar.game.Game.GAME_SPEED = 1000;
com.tamina.bikewar.game.Game.TRUCK_SPEED = 60;
com.tamina.bikewar.game.Game.TRUCK_NUM_SLOT = 10;
com.tamina.bikewar.game.Game.MAX_TURN_DURATION = 1000;
com.tamina.bikewar.game.Game.TURN_TIME = 450000;
org.tamina.utils.UID._lastUID = 0;
shino.Score.ENEMY = 2;
shino.Score.ME = 1;
shino.Score.NEUTRE = 0;
ShinoBotV2.main();
})();
