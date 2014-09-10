(function ($hx_exports) {
	"use strict";
	$hx_exports.com = $hx_exports.com || {};
	$hx_exports.com.tamina = $hx_exports.com.tamina || {};
	$hx_exports.com.tamina.bikewar = $hx_exports.com.tamina.bikewar || {};
	var $hxClasses = {}, $estr = function () {
		return js.Boot.__string_rec(this, '');
	};

	function $extend(from, fields) {
		function Inherit() {
		}

		Inherit.prototype = from;
		var proto = new Inherit();
		for (var name in fields) proto[name] = fields[name];
		if (fields.toString !== Object.prototype.toString) proto.toString = fields.toString;
		return proto;
	}

	var HxOverrides = function () {
	};
	$hxClasses["HxOverrides"] = HxOverrides;
	HxOverrides.__name__ = ["HxOverrides"];
	HxOverrides.dateStr = function (date) {
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var h = date.getHours();
		var mi = date.getMinutes();
		var s = date.getSeconds();
		return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s);
	};
	HxOverrides.strDate = function (s) {
		var _g = s.length;
		switch (_g) {
			case 8:
				var k = s.split(":");
				var d = new Date();
				d.setTime(0);
				d.setUTCHours(k[0]);
				d.setUTCMinutes(k[1]);
				d.setUTCSeconds(k[2]);
				return d;
			case 10:
				var k1 = s.split("-");
				return new Date(k1[0], k1[1] - 1, k1[2], 0, 0, 0);
			case 19:
				var k2 = s.split(" ");
				var y = k2[0].split("-");
				var t = k2[1].split(":");
				return new Date(y[0], y[1] - 1, y[2], t[0], t[1], t[2]);
			default:
				throw "Invalid date format : " + s;
		}
	};
	HxOverrides.cca = function (s, index) {
		var x = s.charCodeAt(index);
		if (x != x) return undefined;
		return x;
	};
	HxOverrides.substr = function (s, pos, len) {
		if (pos != null && pos != 0 && len != null && len < 0) return "";
		if (len == null) len = s.length;
		if (pos < 0) {
			pos = s.length + pos;
			if (pos < 0) pos = 0;
		} else if (len < 0) len = s.length + len - pos;
		return s.substr(pos, len);
	};
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
	HxOverrides.iter = function (a) {
		return { cur: 0, arr: a, hasNext: function () {
			return this.cur < this.arr.length;
		}, next: function () {
			return this.arr[this.cur++];
		}};
	};
	var Lambda = function () {
	};
	$hxClasses["Lambda"] = Lambda;
	Lambda.__name__ = ["Lambda"];
	Lambda.exists = function (it, f) {
		var $it0 = $iterator(it)();
		while ($it0.hasNext()) {
			var x = $it0.next();
			if (f(x)) return true;
		}
		return false;
	};
	Lambda.filter = function (it, f) {
		var l = new List();
		var $it0 = $iterator(it)();
		while ($it0.hasNext()) {
			var x = $it0.next();
			if (f(x)) l.add(x);
		}
		return l;
	};
	var List = function () {
		this.length = 0;
	};
	$hxClasses["List"] = List;
	List.__name__ = ["List"];
	List.prototype = {
		add: function (item) {
			var x = [item];
			if (this.h == null) this.h = x; else this.q[1] = x;
			this.q = x;
			this.length++;
		}, push: function (item) {
			var x = [item, this.h];
			this.h = x;
			if (this.q == null) this.q = x;
			this.length++;
		}, iterator: function () {
			return { h: this.h, hasNext: function () {
				return this.h != null;
			}, next: function () {
				if (this.h == null) return null;
				var x = this.h[0];
				this.h = this.h[1];
				return x;
			}};
		}, __class__: List
	};
	var IMap = function () {
	};
	$hxClasses["IMap"] = IMap;
	IMap.__name__ = ["IMap"];
	IMap.prototype = {
		__class__: IMap
	};
	Math.__name__ = ["Math"];
	var Reflect = function () {
	};
	$hxClasses["Reflect"] = Reflect;
	Reflect.__name__ = ["Reflect"];
	Reflect.field = function (o, field) {
		try {
			return o[field];
		} catch (e) {
			return null;
		}
	};
	Reflect.setField = function (o, field, value) {
		o[field] = value;
	};
	Reflect.fields = function (o) {
		var a = [];
		if (o != null) {
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			for (var f in o) {
				if (f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o, f)) a.push(f);
			}
		}
		return a;
	};
	Reflect.isFunction = function (f) {
		return typeof(f) == "function" && !(f.__name__ || f.__ename__);
	};
	Reflect.compareMethods = function (f1, f2) {
		if (f1 == f2) return true;
		if (!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
		return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
	};
	Reflect.deleteField = function (o, field) {
		if (!Object.prototype.hasOwnProperty.call(o, field)) return false;
		delete(o[field]);
		return true;
	};
	var Std = function () {
	};
	$hxClasses["Std"] = Std;
	Std.__name__ = ["Std"];
	Std.string = function (s) {
		return js.Boot.__string_rec(s, "");
	};
	Std["int"] = function (x) {
		return x | 0;
	};
	Std.parseInt = function (x) {
		var v = parseInt(x, 10);
		if (v == 0 && (HxOverrides.cca(x, 1) == 120 || HxOverrides.cca(x, 1) == 88)) v = parseInt(x);
		if (isNaN(v)) return null;
		return v;
	};
	Std.parseFloat = function (x) {
		return parseFloat(x);
	};
	var StringBuf = function () {
		this.b = "";
	};
	$hxClasses["StringBuf"] = StringBuf;
	StringBuf.__name__ = ["StringBuf"];
	StringBuf.prototype = {
		add: function (x) {
			this.b += Std.string(x);
		}, __class__: StringBuf
	};
	var StringTools = function () {
	};
	$hxClasses["StringTools"] = StringTools;
	StringTools.__name__ = ["StringTools"];
	StringTools.lpad = function (s, c, l) {
		if (c.length <= 0) return s;
		while (s.length < l) s = c + s;
		return s;
	};
	StringTools.fastCodeAt = function (s, index) {
		return s.charCodeAt(index);
	};
	var ValueType = $hxClasses["ValueType"] = { __ename__: ["ValueType"], __constructs__: ["TNull", "TInt", "TFloat", "TBool", "TObject", "TFunction", "TClass", "TEnum", "TUnknown"] };
	ValueType.TNull = ["TNull", 0];
	ValueType.TNull.toString = $estr;
	ValueType.TNull.__enum__ = ValueType;
	ValueType.TInt = ["TInt", 1];
	ValueType.TInt.toString = $estr;
	ValueType.TInt.__enum__ = ValueType;
	ValueType.TFloat = ["TFloat", 2];
	ValueType.TFloat.toString = $estr;
	ValueType.TFloat.__enum__ = ValueType;
	ValueType.TBool = ["TBool", 3];
	ValueType.TBool.toString = $estr;
	ValueType.TBool.__enum__ = ValueType;
	ValueType.TObject = ["TObject", 4];
	ValueType.TObject.toString = $estr;
	ValueType.TObject.__enum__ = ValueType;
	ValueType.TFunction = ["TFunction", 5];
	ValueType.TFunction.toString = $estr;
	ValueType.TFunction.__enum__ = ValueType;
	ValueType.TClass = function (c) {
		var $x = ["TClass", 6, c];
		$x.__enum__ = ValueType;
		$x.toString = $estr;
		return $x;
	};
	ValueType.TEnum = function (e) {
		var $x = ["TEnum", 7, e];
		$x.__enum__ = ValueType;
		$x.toString = $estr;
		return $x;
	};
	ValueType.TUnknown = ["TUnknown", 8];
	ValueType.TUnknown.toString = $estr;
	ValueType.TUnknown.__enum__ = ValueType;
	var Type = function () {
	};
	$hxClasses["Type"] = Type;
	Type.__name__ = ["Type"];
	Type.getClass = function (o) {
		if (o == null) return null;
		if ((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
	};
	Type.getClassName = function (c) {
		var a = c.__name__;
		return a.join(".");
	};
	Type.getEnumName = function (e) {
		var a = e.__ename__;
		return a.join(".");
	};
	Type.resolveClass = function (name) {
		var cl = $hxClasses[name];
		if (cl == null || !cl.__name__) return null;
		return cl;
	};
	Type.resolveEnum = function (name) {
		var e = $hxClasses[name];
		if (e == null || !e.__ename__) return null;
		return e;
	};
	Type.createEmptyInstance = function (cl) {
		function empty() {
		};
		empty.prototype = cl.prototype;
		return new empty();
	};
	Type.createEnum = function (e, constr, params) {
		var f = Reflect.field(e, constr);
		if (f == null) throw "No such constructor " + constr;
		if (Reflect.isFunction(f)) {
			if (params == null) throw "Constructor " + constr + " need parameters";
			return f.apply(e, params);
		}
		if (params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
		return f;
	};
	Type.getEnumConstructs = function (e) {
		var a = e.__constructs__;
		return a.slice();
	};
	Type["typeof"] = function (v) {
		var _g = typeof(v);
		switch (_g) {
			case "boolean":
				return ValueType.TBool;
			case "string":
				return ValueType.TClass(String);
			case "number":
				if (Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
				return ValueType.TFloat;
			case "object":
				if (v == null) return ValueType.TNull;
				var e = v.__enum__;
				if (e != null) return ValueType.TEnum(e);
				var c;
				if ((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
				if (c != null) return ValueType.TClass(c);
				return ValueType.TObject;
			case "function":
				if (v.__name__ || v.__ename__) return ValueType.TObject;
				return ValueType.TFunction;
			case "undefined":
				return ValueType.TNull;
			default:
				return ValueType.TUnknown;
		}
	};
	Type.enumConstructor = function (e) {
		return e[0];
	};
	Type.enumParameters = function (e) {
		return e.slice(2);
	};
	var XmlType = $hxClasses["XmlType"] = { __ename__: ["XmlType"], __constructs__: [] };
	var Xml = function () {
	};
	$hxClasses["Xml"] = Xml;
	Xml.__name__ = ["Xml"];
	var com = {};
	com.tamina = {};
	com.tamina.bikewar = {};
	com.tamina.bikewar.PlayerUI = $hx_exports.com.tamina.bikewar.PlayerUI = function () {
	};
	$hxClasses["com.tamina.bikewar.PlayerUI"] = com.tamina.bikewar.PlayerUI;
	com.tamina.bikewar.PlayerUI.__name__ = ["com", "tamina", "bikewar", "PlayerUI"];
	com.tamina.bikewar.PlayerUI.main = function () {
		mconsole.Console.start();
		org.tamina.log.QuickLogger.info("instantiation de l'application ");
	};
	com.tamina.bikewar.PlayerUI.setPaths = function (savePath, redirectPath, imgBasePath) {
		if (imgBasePath == null) imgBasePath = "";
		if (redirectPath == null) redirectPath = "";
		if (savePath == null) savePath = "";
		com.tamina.bikewar.core.Global.REDIRECT_URL = redirectPath;
		com.tamina.bikewar.core.Global.IMG_BASE_PATH = imgBasePath;
		com.tamina.bikewar.core.Global.SAVE_URL = savePath;
	};
	com.tamina.bikewar.PlayerUI.init = function (firstPlayerName, firstPlayerScript, secondPlayerName, secondPlayerScript, debugMode, speed) {
		if(!speed) speed = com.tamina.bikewar.game.Game.GAME_SPEED;
		com.tamina.bikewar.game.Game.GAME_SPEED = speed;
		if (debugMode == null) debugMode = false;
		org.tamina.log.QuickLogger.info("init " + firstPlayerName + " vs " + secondPlayerName);
		var applicationCanvas = window.document.getElementById("applicationCanvas");
		applicationCanvas.width = com.tamina.bikewar.PlayerUI.DEFAULT_WIDTH;
		applicationCanvas.height = com.tamina.bikewar.PlayerUI.DEFAULT_HEIGHT;
		var players = new Array();
		players.push(new com.tamina.bikewar.data.Player(firstPlayerName, firstPlayerScript, com.tamina.bikewar.data.PlayerColor.RED));
		players.push(new com.tamina.bikewar.data.Player(secondPlayerName, secondPlayerScript, com.tamina.bikewar.data.PlayerColor.BLUE));
		com.tamina.bikewar.PlayerUI._renderer = new com.tamina.bikewar.core.BattleRenderer(applicationCanvas, com.tamina.bikewar.PlayerUI.DEFAULT_WIDTH, com.tamina.bikewar.PlayerUI.DEFAULT_HEIGHT, com.tamina.bikewar.data.Mock.getMap(com.tamina.bikewar.PlayerUI.DEFAULT_WIDTH, com.tamina.bikewar.PlayerUI.DEFAULT_HEIGHT, players), debugMode);
		com.tamina.bikewar.PlayerUI._renderer.battle_completeSignal.add(com.tamina.bikewar.PlayerUI.gameCompleteHandler);
		if (com.tamina.bikewar.core.Global.SAVE_URL != "") com.tamina.bikewar.PlayerUI._renderer.start();
	};
	com.tamina.bikewar.PlayerUI.redirect = function (playerStatus) {
		if (com.tamina.bikewar.core.Global.REDIRECT_URL != "") window.location.assign(com.tamina.bikewar.core.Global.REDIRECT_URL + "?playerStatus=" + (playerStatus == null ? "null" : "" + playerStatus));
	};
	com.tamina.bikewar.PlayerUI.addScore_completeHandler = function (event) {
		haxe.Log.trace("status : " + (event == null ? "null" : "" + event), { fileName: "PlayerUI.hx", lineNumber: 60, className: "com.tamina.bikewar.PlayerUI", methodName: "addScore_completeHandler"});
		com.tamina.bikewar.PlayerUI.redirect(2);
	};
	com.tamina.bikewar.PlayerUI.gameCompleteHandler = function (r) {
		if (com.tamina.bikewar.core.Global.SAVE_URL != "" && r.winner.id == com.tamina.bikewar.PlayerUI._renderer.getData().players[0].id) {
			haxe.Log.trace("sauvegarde du score", { fileName: "PlayerUI.hx", lineNumber: 66, className: "com.tamina.bikewar.PlayerUI", methodName: "gameCompleteHandler"});
			var request = new haxe.Http(com.tamina.bikewar.core.Global.SAVE_URL);
			request.onStatus = com.tamina.bikewar.PlayerUI.addScore_completeHandler;
			request.setParameter("player", r.winner.name);
			request.setParameter("score", Std.string(r.playerList[0].score / r.numTurn * 1000));
			request.request(true);
		} else if (com.tamina.bikewar.core.Global.SAVE_URL != "") com.tamina.bikewar.PlayerUI.redirect(1); else com.tamina.bikewar.PlayerUI.redirect(0);
	};
	com.tamina.bikewar.PlayerUI.prototype = {
		__class__: com.tamina.bikewar.PlayerUI
	};
	com.tamina.bikewar.core = {};
	com.tamina.bikewar.core.BaseGameEngine = function () {
		this.turn_completeSignal = new msignal.Signal0();
		this.battle_completeSignal = new msignal.Signal1();
		this.truck_moveSignal = new msignal.Signal2();
	};
	$hxClasses["com.tamina.bikewar.core.BaseGameEngine"] = com.tamina.bikewar.core.BaseGameEngine;
	com.tamina.bikewar.core.BaseGameEngine.__name__ = ["com", "tamina", "bikewar", "core", "BaseGameEngine"];
	com.tamina.bikewar.core.BaseGameEngine.prototype = {
		get_isComputing: function () {
			return this._isComputing;
		}, getBattleResult: function (data, turnSpeed) {
			if (turnSpeed == null) turnSpeed = 1;
			this._currentTurn = 0;
			this._isComputing = false;
			this._data = data;
			this.playerList = new Array();
			this.playerList.push(new com.tamina.bikewar.data.PlayerResult(this._data.players[0]));
			this.playerList.push(new com.tamina.bikewar.data.PlayerResult(this._data.players[1]));
			this._IAList[0].turnResult_completeSignal.add($bind(this, this.IA_ordersResultHandler));
			this._IAList[0].turnMaxDuration_reachSignal.add($bind(this, this.maxDuration_reachHandler));
			this._IAList[0].turnResult_errorSignal.add($bind(this, this.turnResultErrorHandler));
			this._IAList[1].turnResult_completeSignal.add($bind(this, this.IA_ordersResultHandler));
			this._IAList[1].turnMaxDuration_reachSignal.add($bind(this, this.maxDuration_reachHandler));
			this._IAList[1].turnResult_errorSignal.add($bind(this, this.turnResultErrorHandler));
			this._maxNumTurn = com.tamina.bikewar.game.Game.GAME_MAX_NUM_TURN;
			this._startBattleDate = new Date();
			this._currentTurn = 0;
			this._isComputing = true;
		}, maxDuration_reachHandler: function (playerId) {
			haxe.Log.trace("max duration reached", { fileName: "BaseGameEngine.hx", lineNumber: 76, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "maxDuration_reachHandler"});
			if (playerId == this.playerList[0].player.id) this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[1].player, "DUREE DU TOUR TROP LONGUE")); else this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[0].player, "DUREE DU TOUR TROP LONGUE"));
		}, IA_ordersResultHandler: function (event) {
			if (this._IAList[0].get_turnOrders() != null && this._IAList[1].get_turnOrders() != null) this.computeCurrentTurn();
		}, turnResultErrorHandler: function (playerId) {
			haxe.Log.trace("turn result error", { fileName: "BaseGameEngine.hx", lineNumber: 92, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "turnResultErrorHandler"});
			if (playerId == this.playerList[0].player.id) this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[1].player, "RESULTAT DU TOUR INATTENDU")); else this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[0].player, "RESULTAT DU TOUR INATTENDU"));
		}, computeCurrentTurn: function () {
			this.parseOrder();
			this.updateBikeStations();
			this.updateTrucks();
			this.updatePlayerScore();
			var t = this._data.currentTime.getTime() + com.tamina.bikewar.game.Game.TURN_TIME;
			var d = new Date();
			d.setTime(t);
			this._data.currentTime = d;
			this.turn_completeSignal.dispatch();
			this._currentTurn++;
			if (this._isComputing && this._currentTurn >= this._maxNumTurn) {
				if (this.playerList[0].score > this.playerList[1].score) this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[0].player, "DUREE MAX ATTEINTE")); else this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[1].player, "DUREE MAX ATTEINTE"));
			}
		}, updateTrucks: function () {
			var _g1 = 0;
			var _g = this._data.trucks.length;
			while (_g1 < _g) {
				var i = _g1++;
				var t = this._data.trucks[i];
				if (t.travelDuration > 0) {
					t.currentStation = null;
					t.travelDuration--;
				} else if (t.destination != null) {
					t.currentStation = t.destination;
					t.destination = null;
				}
			}
		}, updatePlayerScore: function () {
			var _g1 = 0;
			var _g = this._data.stations.length;
			while (_g1 < _g) {
				var i = _g1++;
				var s = this._data.stations[i];
				if (s.owner != null && s.owner.id == this.playerList[0].player.id) {
					if (com.tamina.bikewar.game.GameUtils.hasStationEnoughBike(s)) this.playerList[0].score++; else this.playerList[0].score--;
				} else if (s.owner != null && s.owner.id == this.playerList[1].player.id) {
					if (com.tamina.bikewar.game.GameUtils.hasStationEnoughBike(s)) this.playerList[1].score++; else this.playerList[1].score--;
				}
			}
			if (this.playerList[0].score >= com.tamina.bikewar.game.Game.MAX_SCORE) this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[0].player, "SCORE MAX")); else if (this.playerList[1].score >= com.tamina.bikewar.game.Game.MAX_SCORE) this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[1].player, "SCORE MAX"));
		}, parseOrder: function () {
			var delta = Math.random() * 2 - 1;
			if (delta > 0) {
				this.executeIAOrders(this._IAList[0]);
				this.executeIAOrders(this._IAList[1]);
			} else {
				this.executeIAOrders(this._IAList[1]);
				this.executeIAOrders(this._IAList[0]);
			}
		}, executeIAOrders: function (ordersOwner) {
			var orders = ordersOwner.get_turnOrders();
			if (orders.length > 2) {
				if (ordersOwner.get_playerId() == this.playerList[0].player.id) {
					this.playerList[0].score = -100;
					this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[1].player, "Son adversaire a dépassé le nombre d'ordre authorisé"));
				} else {
					this.playerList[1].score = -100;
					this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[0].player, "Son adversaire a dépassé le nombre d'ordre authorisé"));
				}
			} else {
				var _g1 = 0;
				var _g = orders.length;
				while (_g1 < _g) {
					var i = _g1++;
					var element = orders[i];
					if (this.isValidOrder(element, ordersOwner.get_playerId())) {
						var source = this.getTruckByID(element.truckId);
						var target = this.getStationByID(element.targetStationId);
						if (element.type == com.tamina.bikewar.data.OrderType.MOVE) {
							source.destination = target;
							source.travelDuration = com.tamina.bikewar.game.GameUtils.getTravelDuration(source.currentStation, source.destination, this._data);
							this.truck_moveSignal.dispatch(source, target);
						} else if (element.type == com.tamina.bikewar.data.OrderType.LOAD) {
							var lo = element;
							source.bikeNum += lo.bikeNum;
							target.bikeNum -= lo.bikeNum;
							target.owner = source.owner;
							source.destination = null;
						} else if (element.type == com.tamina.bikewar.data.OrderType.UNLOAD) {
							var lo1 = element;
							source.bikeNum -= lo1.bikeNum;
							target.bikeNum += lo1.bikeNum;
							target.owner = source.owner;
							source.destination = null;
						} else {
						}
					} else if (ordersOwner.get_playerId() == this.playerList[0].player.id) {
						this.playerList[0].score = -100;
						this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[1].player, "Son adversaire a construit un ordre invalide"));
					} else {
						this.playerList[1].score = -100;
						this.endBattle(new com.tamina.bikewar.data.BattleResult(this.playerList, this._currentTurn, this.playerList[0].player, "Son adversaire a construit un ordre invalide"));
					}
				}
			}
		}, isValidOrder: function (order, orderOwnerId) {
			var result = true;
			var source = this.getTruckByID(order.truckId);
			var target = this.getStationByID(order.targetStationId);
			if (source == null) {
				haxe.Log.trace("Invalid Order : source inconnue", { fileName: "BaseGameEngine.hx", lineNumber: 232, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
				result = false;
			} else if (target == null) {
				haxe.Log.trace("Invalid Order : target inconnue", { fileName: "BaseGameEngine.hx", lineNumber: 236, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
				result = false;
			} else if (order.type == com.tamina.bikewar.data.OrderType.LOAD) {
				var loadOrder = order;
				if (loadOrder.bikeNum + source.bikeNum > com.tamina.bikewar.game.Game.TRUCK_NUM_SLOT) {
					haxe.Log.trace("Invalid Order : pas assez de place dans le camion", { fileName: "BaseGameEngine.hx", lineNumber: 242, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				}
				if (loadOrder.bikeNum > target.bikeNum) {
					haxe.Log.trace("Invalid Order : pas assez de vélo en station", { fileName: "BaseGameEngine.hx", lineNumber: 246, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				}
				if (loadOrder.bikeNum < 0 || loadOrder.bikeNum % 1 != 0) {
					haxe.Log.trace("Invalid Order : nombre de velo negatif ou flotant", { fileName: "BaseGameEngine.hx", lineNumber: 250, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				}
				if (source.currentStation == null) {
					haxe.Log.trace("Invalid Order : impossible de charger des vélos en cours de route !!!", { fileName: "BaseGameEngine.hx", lineNumber: 254, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				} else if (loadOrder.targetStationId != source.currentStation.id) {
					haxe.Log.trace("Invalid Order : la station de destination ne corresond pas à l'actuelle", { fileName: "BaseGameEngine.hx", lineNumber: 258, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				}
			} else if (order.type == com.tamina.bikewar.data.OrderType.UNLOAD) {
				var unloadOrder = order;
				if (unloadOrder.bikeNum + target.bikeNum > target.slotNum) {
					haxe.Log.trace("Invalid Order : pas assez de place en station", { fileName: "BaseGameEngine.hx", lineNumber: 266, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				}
				if (unloadOrder.bikeNum > source.bikeNum) {
					haxe.Log.trace("Invalid Order : pas assez de vélo " + unloadOrder.bikeNum + "//" + target.bikeNum, { fileName: "BaseGameEngine.hx", lineNumber: 270, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				}
				if (unloadOrder.bikeNum < 0 || unloadOrder.bikeNum % 1 != 0) {
					haxe.Log.trace("Invalid Order : nombre de velo negatif ou flotant", { fileName: "BaseGameEngine.hx", lineNumber: 274, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				}
				if (source.currentStation == null) {
					haxe.Log.trace("Invalid Order : impossible de vider des vélos en cours de route !!!", { fileName: "BaseGameEngine.hx", lineNumber: 278, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				} else if (unloadOrder.targetStationId != source.currentStation.id) {
					haxe.Log.trace("Invalid Order : la station de destination ne corresond pas à l'actuelle", { fileName: "BaseGameEngine.hx", lineNumber: 282, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				}
			} else if (order.type == com.tamina.bikewar.data.OrderType.MOVE) {
				var moveOrder = order;
				if (source.currentStation == null) {
					haxe.Log.trace("Invalid Order : interdiction de déplacer de changer la direction d'un camion en cours de route", { fileName: "BaseGameEngine.hx", lineNumber: 289, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
					result = false;
				}
			} else if (source.owner.id != orderOwnerId) {
				haxe.Log.trace("Invalid Order : le proprietaire du camion n'est pas le meme que celui de l'ordre", { fileName: "BaseGameEngine.hx", lineNumber: 295, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
				haxe.Log.trace("Order source owner id : " + source.owner.id, { fileName: "BaseGameEngine.hx", lineNumber: 296, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
				result = false;
			}
			if (result == false) {
				haxe.Log.trace("Order Owner : " + orderOwnerId, { fileName: "BaseGameEngine.hx", lineNumber: 300, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
				haxe.Log.trace("Order sourceID : " + order.truckId, { fileName: "BaseGameEngine.hx", lineNumber: 301, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
				haxe.Log.trace("Order targetID : " + order.targetStationId, { fileName: "BaseGameEngine.hx", lineNumber: 302, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "isValidOrder"});
			}
			return result;
		}, getTruckByID: function (truckId) {
			var result = null;
			var _g1 = 0;
			var _g = this._data.trucks.length;
			while (_g1 < _g) {
				var i = _g1++;
				var p = this._data.trucks[i];
				if (p.id == truckId) {
					result = p;
					break;
				}
			}
			return result;
		}, getStationByID: function (stationId) {
			var result = null;
			var _g1 = 0;
			var _g = this._data.stations.length;
			while (_g1 < _g) {
				var i = _g1++;
				var p = this._data.stations[i];
				if (p.id == stationId) {
					result = p;
					break;
				}
			}
			return result;
		}, retrieveIAOrders: function () {
			if (!this._IAList[0].isRunning() && !this._IAList[1].isRunning()) {
				this._IAList[0].init();
				this._IAList[1].init();
				this._IAList[0].send(this._data);
				this._IAList[1].send(this._data);
			}
		}, updateBikeStations: function () {
			var _g1 = 0;
			var _g = this._data.stations.length;
			while (_g1 < _g) {
				var i = _g1++;
				var station = this._data.stations[i];
				var trend = com.tamina.bikewar.game.GameUtils.getBikeStationTrend(station, this._data.currentTime);
				var trendNum = 0;
				switch (trend[1]) {
					case 1:
						Math.round(Math.random() * 3);
						break;
					case 0:
						-Math.round(Math.random() * 3);
						break;
					case 2:
						trendNum = Math.round(Math.random() * 2) - 1;
						break;
				}
				station.bikeNum += trendNum;
				if (station.bikeNum < 0) station.bikeNum = 0;
				if (station.bikeNum > station.slotNum) station.bikeNum = station.slotNum;
			}
		}, endBattle: function (result) {
			this._isComputing = false;
			this._endBattleDate = new Date();
			haxe.Log.trace("fin du match : " + this.playerList[0].player.name + " = " + this.playerList[0].score + "// " + this.playerList[1].player.name + " = " + this.playerList[1].score + " // WINNER " + result.winner.name, { fileName: "BaseGameEngine.hx", lineNumber: 363, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "endBattle"});
			haxe.Log.trace("battle duration " + (this._endBattleDate.getTime() - this._startBattleDate.getTime()) / 1000 + " sec", { fileName: "BaseGameEngine.hx", lineNumber: 364, className: "com.tamina.bikewar.core.BaseGameEngine", methodName: "endBattle"});
			this.battle_completeSignal.dispatch(result);
			return result.winner;
		}, __class__: com.tamina.bikewar.core.BaseGameEngine
	};
	com.tamina.bikewar.core.BattleRenderer = function (canvas, width, height, data, debugMode) {
		if (debugMode == null) debugMode = false;
		this.battle_completeSignal = new msignal.Signal1();
		this._debugMode = debugMode;
		this._data = data;
		this._width = width;
		this._height = height;
		this._display = new com.tamina.bikewar.ui.MapUI(canvas, this._width, this._height);
		this._display.init(this._data, debugMode);
		this._engine = new com.tamina.bikewar.core.LiveGameEngine();
		this._engine.turn_completeSignal.add($bind(this, this.turnCompleteHandler));
		this._engine.truck_moveSignal.add($bind(this, this.moveTruckHandler));
		this._engine.battle_completeSignal.add($bind(this, this.endBattleHandler));
		window.document.getElementById("playerOneName").innerHTML = this._data.players[0].name;
		window.document.getElementById("playerTwoName").innerHTML = this._data.players[1].name;
		var fightButton = window.document.getElementById("fightButton");
		fightButton.addEventListener("click", $bind(this, this.fightHandler));
	};
	$hxClasses["com.tamina.bikewar.core.BattleRenderer"] = com.tamina.bikewar.core.BattleRenderer;
	com.tamina.bikewar.core.BattleRenderer.__name__ = ["com", "tamina", "bikewar", "core", "BattleRenderer"];
	com.tamina.bikewar.core.BattleRenderer.prototype = {
		getData: function () {
			return this._data;
		}, start: function () {
			if (!this._engine.get_isComputing()) {
				this._engine.getBattleResult(this._data, com.tamina.bikewar.game.Game.GAME_SPEED);
				window.document.getElementById("fightButton").style.display = "none";
				window.document.getElementById("time").style.display = "block";
				window.document.getElementById("fightRunningImage").style.display = "block";
			} else haxe.Log.trace("battle already started", { fileName: "BattleRenderer.hx", lineNumber: 58, className: "com.tamina.bikewar.core.BattleRenderer", methodName: "start"});
		}, fightHandler: function (event) {
			org.tamina.log.QuickLogger.info("FIGHT");
			this.start();
		}, endBattleHandler: function (result) {
			this._display.showResultScreen(result.winner.name, result.message);
			this.battle_completeSignal.dispatch(result);
		}, moveTruckHandler: function (truck, destination) {
			this._display.moveTruck(truck, destination);
		}, turnCompleteHandler: function () {
			window.document.getElementById("playerOneScore").innerHTML = Std.string(this._engine.playerList[0].score);
			window.document.getElementById("playerTwoScore").innerHTML = Std.string(this._engine.playerList[1].score);
			var score1 = 100;
			if (this._engine.playerList[0].score > this._engine.playerList[1].score) {
				score1 += this._engine.playerList[0].score - this._engine.playerList[1].score;
				if (score1 > 500) score1 = 500;
			}
			window.document.getElementById("playerOneScoreBar").style.width = score1 + "px";
			var score2 = 100;
			if (this._engine.playerList[1].score > this._engine.playerList[0].score) {
				score2 += this._engine.playerList[1].score - this._engine.playerList[0].score;
				if (score2 > 500) score2 = 500;
			}
			window.document.getElementById("playerTwoScoreBar").style.width = score2 + "px";
			this._display.updateData();
		}, __class__: com.tamina.bikewar.core.BattleRenderer
	};
	com.tamina.bikewar.core.Global = function () {
	};
	$hxClasses["com.tamina.bikewar.core.Global"] = com.tamina.bikewar.core.Global;
	com.tamina.bikewar.core.Global.__name__ = ["com", "tamina", "bikewar", "core", "Global"];
	com.tamina.bikewar.core.LiveGameEngine = function () {
		com.tamina.bikewar.core.BaseGameEngine.call(this);
	};
	$hxClasses["com.tamina.bikewar.core.LiveGameEngine"] = com.tamina.bikewar.core.LiveGameEngine;
	com.tamina.bikewar.core.LiveGameEngine.__name__ = ["com", "tamina", "bikewar", "core", "LiveGameEngine"];
	com.tamina.bikewar.core.LiveGameEngine.__super__ = com.tamina.bikewar.core.BaseGameEngine;
	com.tamina.bikewar.core.LiveGameEngine.prototype = $extend(com.tamina.bikewar.core.BaseGameEngine.prototype, {
		getBattleResult: function (data, turnSpeed) {
			if (turnSpeed == null) turnSpeed = 1;
			this._IAList = new Array();
			this._IAList.push(new com.tamina.bikewar.data.IA(new Worker(data.players[0].script), data.players[0].id));
			this._IAList.push(new com.tamina.bikewar.data.IA(new Worker(data.players[1].script), data.players[1].id));
			com.tamina.bikewar.core.BaseGameEngine.prototype.getBattleResult.call(this, data, turnSpeed);
			this._turnTimer = new haxe.Timer(turnSpeed);
			this._turnTimer.run = $bind(this, this.retrieveIAOrders);
		}, endBattle: function (result) {
			this._turnTimer.stop();
			return com.tamina.bikewar.core.BaseGameEngine.prototype.endBattle.call(this, result);
		}, __class__: com.tamina.bikewar.core.LiveGameEngine
	});
	com.tamina.bikewar.core.PathFinder = function () {
		this._inc = 0;
		this._paths = new Array();
	};
	$hxClasses["com.tamina.bikewar.core.PathFinder"] = com.tamina.bikewar.core.PathFinder;
	com.tamina.bikewar.core.PathFinder.__name__ = ["com", "tamina", "bikewar", "core", "PathFinder"];
	com.tamina.bikewar.core.PathFinder.prototype = {
		getPath: function (fromStation, toStation, map) {
			this._map = map;
			this._source = this.getJunctionByStation(fromStation);
			this._target = this.getJunctionByStation(toStation);
			var p = new com.tamina.bikewar.data.Path();
			p.push(this._source);
			this._paths.push(p);
			var startDate = new Date();
			this.find();
			return this._result;
		}, getJunctionByStation: function (station) {
			var result = null;
			var _g1 = 0;
			var _g = this._map.roads.length;
			while (_g1 < _g) {
				var i = _g1++;
				var j = this._map.roads[i];
				if (j.id == (station.id == null ? "null" : "" + station.id)) {
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
				} else if (!com.tamina.bikewar.data.Path.contains(nextJunction, this._paths)) {
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
		}, __class__: com.tamina.bikewar.core.PathFinder
	};
	com.tamina.bikewar.data = {};
	com.tamina.bikewar.data.BattleResult = function (playerResults, numTurn, winner, message, errorCode) {
		if (errorCode == null) errorCode = 0;
		if (numTurn == null) numTurn = 0;
		this.playerList = playerResults;
		this.numTurn = numTurn;
		this.winner = winner;
		this.message = message;
		this.errorCode = errorCode;
	};
	$hxClasses["com.tamina.bikewar.data.BattleResult"] = com.tamina.bikewar.data.BattleResult;
	com.tamina.bikewar.data.BattleResult.__name__ = ["com", "tamina", "bikewar", "data", "BattleResult"];
	com.tamina.bikewar.data.BattleResult.prototype = {
		__class__: com.tamina.bikewar.data.BattleResult
	};
	com.tamina.bikewar.data.BikeStation = function () {
		this.name = "";
		this.profile = new Array();
		this.id = org.tamina.utils.UID.getUID();
	};
	$hxClasses["com.tamina.bikewar.data.BikeStation"] = com.tamina.bikewar.data.BikeStation;
	com.tamina.bikewar.data.BikeStation.__name__ = ["com", "tamina", "bikewar", "data", "BikeStation"];
	com.tamina.bikewar.data.BikeStation.prototype = {
		__class__: com.tamina.bikewar.data.BikeStation
	};
	com.tamina.bikewar.data.IIA = function () {
	};
	$hxClasses["com.tamina.bikewar.data.IIA"] = com.tamina.bikewar.data.IIA;
	com.tamina.bikewar.data.IIA.__name__ = ["com", "tamina", "bikewar", "data", "IIA"];
	com.tamina.bikewar.data.IIA.prototype = {
		__class__: com.tamina.bikewar.data.IIA
	};
	com.tamina.bikewar.data.IA = function (worker, playerId) {
		this.turnMaxDuration_reachSignal = new msignal.Signal1();
		this.turnResult_completeSignal = new msignal.Signal1();
		this.turnResult_errorSignal = new msignal.Signal1();
		this.init();
		this._playerId = playerId;
		this._worker = worker;
		this._worker.onmessage = $bind(this, this.worker_messageHandler);
		this._turnTimer = new haxe.Timer(10);
		this._turnTimer.run = $bind(this, this.maxDuration_reachHandler);
		this._startTime = 0;
	};
	$hxClasses["com.tamina.bikewar.data.IA"] = com.tamina.bikewar.data.IA;
	com.tamina.bikewar.data.IA.__name__ = ["com", "tamina", "bikewar", "data", "IA"];
	com.tamina.bikewar.data.IA.__interfaces__ = [com.tamina.bikewar.data.IIA];
	com.tamina.bikewar.data.IA.prototype = {
		init: function () {
			this._turnOrders = null;
		}, dispose: function () {
			this._worker = null;
		}, send: function (data) {
			this._startTime = new Date().getTime();
			this._worker.postMessage(new com.tamina.bikewar.data.TurnMessage(this.get_playerId(), data));
		}, isRunning: function () {
			return this._startTime > 0;
		}, maxDuration_reachHandler: function () {
			if (this._startTime > 0) {
				var t0 = new Date().getTime();
				if (t0 - this._startTime > com.tamina.bikewar.game.Game.MAX_TURN_DURATION) {
					haxe.Log.trace("maxDuration_reachHandler", { fileName: "IA.hx", lineNumber: 64, className: "com.tamina.bikewar.data.IA", methodName: "maxDuration_reachHandler"});
					this._turnTimer.stop();
					this._turnTimer = null;
					this.turnMaxDuration_reachSignal.dispatch(this.get_playerId());
				}
			}
		}, worker_messageHandler: function (message) {
			this._startTime = 0;
			if (message.data != null) {
				var turnResult = message.data;
				if (turnResult.consoleMessage.length > 0) haxe.Log.trace(turnResult.consoleMessage, { fileName: "IA.hx", lineNumber: 78, className: "com.tamina.bikewar.data.IA", methodName: "worker_messageHandler"});
				this._turnOrders = turnResult.orders;
				this.turnResult_completeSignal.dispatch(turnResult);
			} else this.turnResult_errorSignal.dispatch(this.get_playerId());
		}, get_turnOrders: function () {
			return this._turnOrders;
		}, get_playerId: function () {
			return this._playerId;
		}, __class__: com.tamina.bikewar.data.IA
	};
	com.tamina.bikewar.data.Order = function (truckId, targetStationId, type) {
		this.truckId = truckId;
		this.targetStationId = targetStationId;
		this.type = type;
	};
	$hxClasses["com.tamina.bikewar.data.Order"] = com.tamina.bikewar.data.Order;
	com.tamina.bikewar.data.Order.__name__ = ["com", "tamina", "bikewar", "data", "Order"];
	com.tamina.bikewar.data.Order.prototype = {
		__class__: com.tamina.bikewar.data.Order
	};
	com.tamina.bikewar.data.LoadingOrder = function (truckId, targetStationId, bikeNum) {
		this.bikeNum = 0;
		com.tamina.bikewar.data.Order.call(this, truckId, targetStationId, com.tamina.bikewar.data.OrderType.LOAD);
		this.bikeNum = bikeNum;
	};
	$hxClasses["com.tamina.bikewar.data.LoadingOrder"] = com.tamina.bikewar.data.LoadingOrder;
	com.tamina.bikewar.data.LoadingOrder.__name__ = ["com", "tamina", "bikewar", "data", "LoadingOrder"];
	com.tamina.bikewar.data.LoadingOrder.__super__ = com.tamina.bikewar.data.Order;
	com.tamina.bikewar.data.LoadingOrder.prototype = $extend(com.tamina.bikewar.data.Order.prototype, {
		__class__: com.tamina.bikewar.data.LoadingOrder
	});
	com.tamina.bikewar.data.MapData = function () {
		this.players = new Array();
		this.stations = new Array();
		this.trucks = new Array();
		this.roads = new Array();
	};
	$hxClasses["com.tamina.bikewar.data.MapData"] = com.tamina.bikewar.data.MapData;
	com.tamina.bikewar.data.MapData.__name__ = ["com", "tamina", "bikewar", "data", "MapData"];
	com.tamina.bikewar.data.MapData.prototype = {
		__class__: com.tamina.bikewar.data.MapData
	};
	com.tamina.bikewar.data.Mock = function () {
	};
	$hxClasses["com.tamina.bikewar.data.Mock"] = com.tamina.bikewar.data.Mock;
	com.tamina.bikewar.data.Mock.__name__ = ["com", "tamina", "bikewar", "data", "Mock"];
	com.tamina.bikewar.data.Mock.get_profiles = function () {
		if (com.tamina.bikewar.data.Mock._profiles == null) com.tamina.bikewar.data.Mock._profiles = com.tamina.bikewar.data.Mock.getProfiles();
		return com.tamina.bikewar.data.Mock._profiles;
	};
	com.tamina.bikewar.data.Mock.getMap = function (width, height, players) {
		var result = new com.tamina.bikewar.data.MapData();
		result.currentTime = com.tamina.bikewar.game.GameUtils.getCurrentRoundedDate();
		result.players = players;
		var stationsVO = com.tamina.bikewar.data.Mock.getStationsVO();
		var _g1 = 0;
		var _g = stationsVO.length;
		while (_g1 < _g) {
			var i = _g1++;
			var station = stationsVO[i].toBikeStation(width, height);
			if (station.position.x > 0 && station.position.y > 0 && station.position.x < width && station.position.y < height) result.stations.push(station);
		}
		result.roads = haxe.Unserializer.run("acy24:org.tamina.geom.Junctiony1:xi436y1:yi400y5:linksacR0R1i468R2i404R3acR0R1i528R2i396R3acR0R1i527R2i411R3ar5cR0R1i571R2i416R3acR0R1i599R2i404R3acR0R1i636R2i404R3acR0R1i653R2i420R3acR0R1i710R2i370R3acR0R1i760R2i374R3acR0R1i869R2i345R3acR0R1i962R2i276R3acR0R1i890R2i210R3acR0R1i965R2i149R3acR0R1i1025R2i100R3ar27cR0R1i1222R2i131R3acR0R1i1267R2i132R3ar31cR0R1i1322R2i149R3ar33cR0R1i1289R2i300R3ar35cR0R1i1059R2i304R3ar23cR0R1i1062R2i428R3ar39cR0R1i1103R2i528R3ar41r37hy2:idy0:gcR0R1i987R2i418R3ar41cR0R1i897R2i520R3ar45cR0R1i810R2i460R3ar47cR0R1i768R2i515R3ar49cR0R1i723R2i503R3ar51cR0R1i703R2i511R3ar53cR0R1i688R2i469R3ar53r15cR0R1i637R2i489R3acR0R1i592R2i489R3acR0R1i566R2i522R3acR0R1i625R2i534R3ar63r59r55hR4R5gr61cR0R1i539R2i448R3acR0R1i540R2i432R3ar7r67hR4R5gcR0R1i579R2i447R3ar67r15r9r61hR4R5gcR0R1i522R2i481R3ar67r63cR0R1i489R2i492R3ar73r63cR0R1i451R2i479R3ar75cR0R1i485R2i453R3ar77r75r67cR0R1i463R2i434R3ar79cR0R1i414R2i448R3acR0R1i391R2i461R3acR0R1i402R2i516R3ar85r77hR4R5gr83cR0R1i337R2i483R3ar85cR0R1i265R2i479R3ar89cR0R1i270R2i504R3ar91hR4R5gcR0R1i227R2i478R3ar91cR0R1i214R2i535R3ar95cR0R1i133R2i491R3ar97r95cR0R1i48R2i474R3ar99cR0R1i59R2i394R3ar101cR0R1i259R2i365R3ar91r103cR0R1i359R2i353R3ar105cR0R1i444R2i345R3ar107cR0R1i444R2i364R3ar1cR0R1i368R2i403R3ar85r1r111r107hR4R5gr109hR4R5gcR0R1i431R2i331R3ar109cR0R1i405R2i312R3ar115cR0R1i319R2i332R3ar117cR0R1i258R2i340R3ar119cR0R1i96R2i272R3ar103cR0R1i98R2i220R3ar123cR0R1i88R2i173R3ar125cR0R1i155R2i182R3ar127cR0R1i270R2i258R3ar125r121r129cR0R1i277R2i229R3acR0R1i234R2i211R3ar129r133cR0R1i264R2i158R3ar135cR0R1i272R2i135R3ar137cR0R1i319R2i152R3ar139cR0R1i307R2i177R3ar137r133r141cR0R1i348R2i232R3acR0R1i433R2i260R3ar117r145cR0R1i450R2i226R3acR0R1i423R2i201R3acR0R1i340R2i145R3ar141r151r145hR4R5gr149cR0R1i387R2i139R3acR0R1i352R2i86R3ar141cR0R1i385R2i36R3ar157cR0R1i405R2i85R3ar159r157cR0R1i474R2i54R3ar161cR0R1i541R2i29R3ar163cR0R1i581R2i2R3ar165cR0R1i615R2i41R3ar167cR0R1i607R2i61R3acR0R1i580R2i118R3acR0R1i554R2i173R3acR0R1i497R2i189R3acR0R1i464R2i201R3ar151r177hR4R5gcR0R1i445R2i122R3acR0R1i410R2i132R3ar155r181hR4R5gr161cR0R1i553R2i125R3ar181r175r165r173hR4R5gr177hR4R5gr175cR0R1i536R2i227R3ar177cR0R1i517R2i290R3acR0R1i478R2i342R3ar109r3r189cR0R1i468R2i297R3ar191cR0R1i462R2i253R3ar149r147r193cR0R1i485R2i261R3ar195r189hR4R5ghR4R5gr189hR4R5ghR4R5gcR0R1i519R2i315R3ar189cR0R1i538R2i347R3acR0R1i558R2i319R3acR0R1i599R2i318R3acR0R1i613R2i362R3ar13cR0R1i580R2i380R3ar207r11cR0R1i549R2i386R3ar209r9r5r201hR4R5ghR4R5gr205hR4R5gr203cR0R1i593R2i285R3acR0R1i553R2i297R3ar189r203r213hR4R5gr205cR0R1i588R2i248R3ar213r189r187cR0R1i600R2i205R3ar217cR0R1i584R2i176R3ar175r219hR4R5gcR0R1i635R2i148R3acR0R1i682R2i109R3acR0R1i741R2i71R3acR0R1i783R2i35R3acR0R1i857R2i90R3acR0R1i906R2i43R3acR0R1i965R2i48R3ar27r233hR4R5gr231hR4R5gr229cR0R1i662R2i264R3ar231cR0R1i693R2i348R3ar237r17cR0R1i748R2i305R3ar239cR0R1i769R2i318R3ar241cR0R1i800R2i291R3ar25cR0R1i831R2i318R3ar245r21hR4R5gr243hR4R5gcR0R1i724R2i362R3ar243r17r19hR4R5ghR4R5gr237cR0R1i913R2i141R3ar241r231r27hR4R5ghR4R5ghR4R5gr241hR4R5gr251hR4R5gr227hR4R5gr225cR0R1i691R2i10R3acR0R1i651R2i54R3acR0R1i636R2i66R3ar173r171r169r255r225hR4R5gr253hR4R5gr227hR4R5ghR4R5gr257r223hR4R5gr219hR4R5ghR4R5ghR4R5ghR4R5ghR4R5gr201r199r215hR4R5gr211r199hR4R5gr203hR4R5gr197r193r187r215r217hR4R5gr175r217hR4R5ghR4R5gr185r187r221r173hR4R5gr185r171r257hR4R5gr257r169hR4R5gr257hR4R5ghR4R5gr185hR4R5ghR4R5gr181hR4R5ghR4R5gr161r155hR4R5gr151r183hR4R5gr179hR4R5gr147r195hR4R5gr195r109hR4R5gcR0R1i347R2i281R3acR0R1i324R2i277R3ar131r133r119r259hR4R5gr117r145hR4R5gr143r153hR4R5ghR4R5gr153r157hR4R5ghR4R5gr143hR4R5ghR4R5gr131r143r261hR4R5gr261hR4R5gr135hR4R5ghR4R5gr131hR4R5gr121hR4R5gr105r131hR4R5gr107r261hR4R5gr259r147hR4R5ghR4R5gr191r147hR4R5gr119r113hR4R5gr121hR4R5gr123hR4R5ghR4R5ghR4R5ghR4R5gr99hR4R5gr105hR4R5ghR4R5gr113hR4R5gr77r81hR4R5gr3r7r1hR4R5ghR4R5gr87r83hR4R5gr79hR4R5ghR4R5gr63r79hR4R5gr73r75hR4R5gr59cR0R1i642R2i456R3ar59r61r15hR4R5gr71hR4R5gr65r263r57hR4R5gr55hR4R5gr65hR4R5gr57hR4R5ghR4R5gcR0R1i881R2i390R3ar49r23r21hR4R5ghR4R5ghR4R5ghR4R5ghR4R5gr37r31hR4R5gr43hR4R5ghR4R5ghR4R5gr39r29hR4R5ghR4R5gr235r25r23r251hR4R5gr23r245hR4R5gr27r39r265r21hR4R5gr265r247r19hR4R5gr17r249hR4R5gr15r239r249hR4R5gr263r13r71r57hR4R5gr11r207hR4R5gr9r209hR4R5gr7r71r211hR4R5gr69r81hR4R5gr211r3hR4R5gr81r1r191hR4R5gr81r113r111hR4R5gr113r107r115r191r3r81r85r89r93r121r129r133r145r259r25r195r193r189r199r201r5r79r77r87r97r99r103r127r137r153r155r151r179r187r197r215r203r211r209r9r69r73r159r163r183r185r175r221r223r219r217r237r29r43r19r249r239r241r243r247r33r229r227r225r205r207r11r71r61r63r255r171r13r57r53r65r59r263r55r27r235r233r231r17r15r49r51r265r21r23r39r41r45r47r245r251r37r35r31r7r67r75r83r91r95r101r105r111r117r109r119r143r135r139r141r213r257r253r147r149r131r125r123r261r157r181r161r177r173r165r167r169h");
		var _g11 = 0;
		var _g2 = result.roads.length;
		while (_g11 < _g2) {
			var i1 = _g11++;
			var r = result.roads[i1];
			r.id = Std.string(org.tamina.utils.UID.getUID());
			var _g3 = 0;
			var _g21 = result.stations.length;
			while (_g3 < _g21) {
				var j = _g3++;
				var s = result.stations[j];
				if (r.x == s.position.x && r.y == s.position.y) if (s.id == null) r.id = "null"; else r.id = "" + s.id;
			}
		}
		result.trucks.push(new com.tamina.bikewar.data.Truck(result.players[0], result.stations[Math.floor(Math.random() * result.stations.length)]));
		result.trucks.push(new com.tamina.bikewar.data.Truck(result.players[0], result.stations[Math.floor(Math.random() * result.stations.length)]));
		result.trucks.push(new com.tamina.bikewar.data.Truck(result.players[1], result.stations[Math.floor(Math.random() * result.stations.length)]));
		result.trucks.push(new com.tamina.bikewar.data.Truck(result.players[1], result.stations[Math.floor(Math.random() * result.stations.length)]));
		return result;
	};
	com.tamina.bikewar.data.Mock.getStation = function (width, height) {
		var result = new com.tamina.bikewar.data.BikeStation();
		result.position = new org.tamina.geom.Junction(Math.round(Math.random() * width), Math.round(Math.random() * height));
		result.slotNum = Math.round(Math.random() * 30);
		result.bikeNum = Math.round(Math.random() * result.slotNum);
		var _g = 0;
		while (_g < 96) {
			var i = _g++;
			result.profile.push(Math.round(Math.random() * result.slotNum));
		}
		return result;
	};
	com.tamina.bikewar.data.Mock.getRoads = function () {
		var result = new Array();
		return result;
	};
	com.tamina.bikewar.data.Mock.getProfilesByStationId = function (id) {
		var result = new Array();
		var _g1 = 0;
		var _g = com.tamina.bikewar.data.Mock.get_profiles().length;
		while (_g1 < _g) {
			var i = _g1++;
			var p = com.tamina.bikewar.data.Mock.get_profiles()[i];
			if (p.id == id) result.push(p);
		}
		return result;
	};
	com.tamina.bikewar.data.Mock.getProfiles = function () {
		var result = new Array();
		result.push({ id: "1", num: 2.05839416058394});
		result.push({ id: "1", num: 1.82082324455206});
		result.push({ id: "1", num: 1.53789731051345});
		result.push({ id: "1", num: 1.11302211302211});
		result.push({ id: "1", num: 1.19660194174757});
		result.push({ id: "1", num: 1.32518337408313});
		result.push({ id: "1", num: 1.54878048780488});
		result.push({ id: "1", num: 2.27250608272506});
		result.push({ id: "1", num: 5.14146341463415});
		result.push({ id: "1", num: 7.79310344827586});
		result.push({ id: "1", num: 9.43069306930693});
		result.push({ id: "1", num: 10.5925925925926});
		result.push({ id: "1", num: 10.605459057072});
		result.push({ id: "1", num: 10.5281173594132});
		result.push({ id: "1", num: 10.8034398034398});
		result.push({ id: "1", num: 10.9365853658537});
		result.push({ id: "1", num: 8.60722891566265});
		result.push({ id: "1", num: 6.98789346246973});
		result.push({ id: "1", num: 6.6433734939759});
		result.push({ id: "1", num: 5.3695652173913});
		result.push({ id: "1", num: 4.20823244552058});
		result.push({ id: "1", num: 3.65270935960591});
		result.push({ id: "1", num: 2.36430317848411});
		result.push({ id: "1", num: 2.29339853300733});
		result.push({ id: "2", num: 4.95620437956204});
		result.push({ id: "2", num: 5.09927360774818});
		result.push({ id: "2", num: 5.25980392156863});
		result.push({ id: "2", num: 5.2320987654321});
		result.push({ id: "2", num: 5.19902912621359});
		result.push({ id: "2", num: 5.20343137254902});
		result.push({ id: "2", num: 5.23227383863081});
		result.push({ id: "2", num: 5.49024390243902});
		result.push({ id: "2", num: 5.63569682151589});
		result.push({ id: "2", num: 6.11576354679803});
		result.push({ id: "2", num: 6.92269326683292});
		result.push({ id: "2", num: 7.22693266832918});
		result.push({ id: "2", num: 7.05764411027569});
		result.push({ id: "2", num: 6.93086419753086});
		result.push({ id: "2", num: 6.67085427135678});
		result.push({ id: "2", num: 6.6641975308642});
		result.push({ id: "2", num: 5.97566909975669});
		result.push({ id: "2", num: 5.52696078431373});
		result.push({ id: "2", num: 5.55961070559611});
		result.push({ id: "2", num: 5.73658536585366});
		result.push({ id: "2", num: 5.4841075794621});
		result.push({ id: "2", num: 5.30521091811414});
		result.push({ id: "2", num: 5.20493827160494});
		result.push({ id: "2", num: 5.18069306930693});
		result.push({ id: "3", num: 4.8029197080292});
		result.push({ id: "3", num: 5.50121065375303});
		result.push({ id: "3", num: 5.95522388059702});
		result.push({ id: "3", num: 6.05405405405405});
		result.push({ id: "3", num: 6.10922330097087});
		result.push({ id: "3", num: 6.47677261613692});
		result.push({ id: "3", num: 6.63658536585366});
		result.push({ id: "3", num: 6.26341463414634});
		result.push({ id: "3", num: 5.44390243902439});
		result.push({ id: "3", num: 5.2192118226601});
		result.push({ id: "3", num: 4.48762376237624});
		result.push({ id: "3", num: 4.64444444444444});
		result.push({ id: "3", num: 6.04477611940298});
		result.push({ id: "3", num: 6.95110024449878});
		result.push({ id: "3", num: 5.0982800982801});
		result.push({ id: "3", num: 5.31873479318735});
		result.push({ id: "3", num: 5.92530120481928});
		result.push({ id: "3", num: 6.34866828087167});
		result.push({ id: "3", num: 6.18072289156627});
		result.push({ id: "3", num: 6.756038647343});
		result.push({ id: "3", num: 6.8910411622276});
		result.push({ id: "3", num: 5.78325123152709});
		result.push({ id: "3", num: 5.29656862745098});
		result.push({ id: "3", num: 5.2958435207824});
		result.push({ id: "4", num: 3.75380710659898});
		result.push({ id: "4", num: 3.72081218274112});
		result.push({ id: "4", num: 3.04370179948586});
		result.push({ id: "4", num: 2.87080103359173});
		result.push({ id: "4", num: 3.11479591836735});
		result.push({ id: "4", num: 3.22164948453608});
		result.push({ id: "4", num: 3.36363636363636});
		result.push({ id: "4", num: 3.97448979591837});
		result.push({ id: "4", num: 4.89086294416244});
		result.push({ id: "4", num: 4.2});
		result.push({ id: "4", num: 5.33161953727506});
		result.push({ id: "4", num: 7.49357326478149});
		result.push({ id: "4", num: 7.53865979381443});
		result.push({ id: "4", num: 6.58567774936061});
		result.push({ id: "4", num: 6.1343669250646});
		result.push({ id: "4", num: 6.72292191435768});
		result.push({ id: "4", num: 6.94});
		result.push({ id: "4", num: 6.85390428211587});
		result.push({ id: "4", num: 7.21945137157107});
		result.push({ id: "4", num: 6.23115577889447});
		result.push({ id: "4", num: 5.39240506329114});
		result.push({ id: "4", num: 4.92764857881137});
		result.push({ id: "4", num: 5.08651399491094});
		result.push({ id: "4", num: 5.25192802056555});
		result.push({ id: "5", num: 1.86585365853659});
		result.push({ id: "5", num: 1.17191283292978});
		result.push({ id: "5", num: 0.691176470588235});
		result.push({ id: "5", num: 0.732186732186732});
		result.push({ id: "5", num: 0.970873786407767});
		result.push({ id: "5", num: 1.440097799511});
		result.push({ id: "5", num: 2.24390243902439});
		result.push({ id: "5", num: 3.00973236009732});
		result.push({ id: "5", num: 4.31219512195122});
		result.push({ id: "5", num: 5.55172413793103});
		result.push({ id: "5", num: 7.88641975308642});
		result.push({ id: "5", num: 10.0544554455446});
		result.push({ id: "5", num: 9.85643564356436});
		result.push({ id: "5", num: 10.2141119221411});
		result.push({ id: "5", num: 9.61425061425062});
		result.push({ id: "5", num: 9.81751824817518});
		result.push({ id: "5", num: 9.51325301204819});
		result.push({ id: "5", num: 8.75786924939467});
		result.push({ id: "5", num: 7.05301204819277});
		result.push({ id: "5", num: 5.76086956521739});
		result.push({ id: "5", num: 5.74818401937046});
		result.push({ id: "5", num: 6.52088452088452});
		result.push({ id: "5", num: 7.84558823529412});
		result.push({ id: "5", num: 6.05882352941176});
		result.push({ id: "6", num: 4.07125307125307});
		result.push({ id: "6", num: 3.46943765281174});
		result.push({ id: "6", num: 2.59012345679012});
		result.push({ id: "6", num: 2.11166253101737});
		result.push({ id: "6", num: 2.03186274509804});
		result.push({ id: "6", num: 2.03456790123457});
		result.push({ id: "6", num: 2.01231527093596});
		result.push({ id: "6", num: 2.23414634146341});
		result.push({ id: "6", num: 3.39268292682927});
		result.push({ id: "6", num: 5.37192118226601});
		result.push({ id: "6", num: 6.02962962962963});
		result.push({ id: "6", num: 6.9679012345679});
		result.push({ id: "6", num: 7.53731343283582});
		result.push({ id: "6", num: 7.91687041564792});
		result.push({ id: "6", num: 8.11547911547911});
		result.push({ id: "6", num: 8.56204379562044});
		result.push({ id: "6", num: 8.43478260869565});
		result.push({ id: "6", num: 7.29297820823245});
		result.push({ id: "6", num: 6.84019370460048});
		result.push({ id: "6", num: 6.39855072463768});
		result.push({ id: "6", num: 5.80387409200969});
		result.push({ id: "6", num: 5.44963144963145});
		result.push({ id: "6", num: 5.15158924205379});
		result.push({ id: "6", num: 4.56479217603912});
		result.push({ id: "7", num: 3.88077858880779});
		result.push({ id: "7", num: 3.68038740920097});
		result.push({ id: "7", num: 2.14004914004914});
		result.push({ id: "7", num: 1.66334164588529});
		result.push({ id: "7", num: 1.85049019607843});
		result.push({ id: "7", num: 2.24197530864198});
		result.push({ id: "7", num: 2.68888888888889});
		result.push({ id: "7", num: 3.16461916461916});
		result.push({ id: "7", num: 3.78465346534653});
		result.push({ id: "7", num: 5.37185929648241});
		result.push({ id: "7", num: 5.7103274559194});
		result.push({ id: "7", num: 5.70025188916877});
		result.push({ id: "7", num: 5.66334164588529});
		result.push({ id: "7", num: 5.88697788697789});
		result.push({ id: "7", num: 6.17661691542289});
		result.push({ id: "7", num: 6.13022113022113});
		result.push({ id: "7", num: 5.17761557177616});
		result.push({ id: "7", num: 4.19804400977995});
		result.push({ id: "7", num: 3.67639902676399});
		result.push({ id: "7", num: 3.55609756097561});
		result.push({ id: "7", num: 3.01711491442543});
		result.push({ id: "7", num: 2.79850746268657});
		result.push({ id: "7", num: 2.74567901234568});
		result.push({ id: "7", num: 2.77530864197531});
		result.push({ id: "8", num: 3.37592137592138});
		result.push({ id: "8", num: 4.24938875305623});
		result.push({ id: "8", num: 3.85643564356436});
		result.push({ id: "8", num: 3.12158808933002});
		result.push({ id: "8", num: 3.26960784313725});
		result.push({ id: "8", num: 3.55555555555556});
		result.push({ id: "8", num: 3.7807881773399});
		result.push({ id: "8", num: 4.35061728395062});
		result.push({ id: "8", num: 5.3128078817734});
		result.push({ id: "8", num: 6.41791044776119});
		result.push({ id: "8", num: 6.7875});
		result.push({ id: "8", num: 7.02756892230576});
		result.push({ id: "8", num: 6.68686868686869});
		result.push({ id: "8", num: 6.48628428927681});
		result.push({ id: "8", num: 7.29072681704261});
		result.push({ id: "8", num: 8.07352941176471});
		result.push({ id: "8", num: 7.6231884057971});
		result.push({ id: "8", num: 6.08716707021792});
		result.push({ id: "8", num: 5.09879518072289});
		result.push({ id: "8", num: 5.49033816425121});
		result.push({ id: "8", num: 5.53026634382567});
		result.push({ id: "8", num: 4.27832512315271});
		result.push({ id: "8", num: 3.87775061124694});
		result.push({ id: "8", num: 3.48655256723716});
		result.push({ id: "9", num: 5.45012165450122});
		result.push({ id: "9", num: 6.57766990291262});
		result.push({ id: "9", num: 7.53789731051345});
		result.push({ id: "9", num: 8.17690417690418});
		result.push({ id: "9", num: 8.3495145631068});
		result.push({ id: "9", num: 8.77506112469438});
		result.push({ id: "9", num: 9.04634146341463});
		result.push({ id: "9", num: 8.75912408759124});
		result.push({ id: "9", num: 8.50975609756098});
		result.push({ id: "9", num: 8.71182266009852});
		result.push({ id: "9", num: 7.66089108910891});
		result.push({ id: "9", num: 7.41728395061728});
		result.push({ id: "9", num: 7.22029702970297});
		result.push({ id: "9", num: 7.02211302211302});
		result.push({ id: "9", num: 7.12530712530712});
		result.push({ id: "9", num: 7.03406326034063});
		result.push({ id: "9", num: 6.58313253012048});
		result.push({ id: "9", num: 5.97094430992736});
		result.push({ id: "9", num: 6.32211538461539});
		result.push({ id: "9", num: 7.31884057971014});
		result.push({ id: "9", num: 7.28087167070218});
		result.push({ id: "9", num: 6.42610837438424});
		result.push({ id: "9", num: 5.63814180929095});
		result.push({ id: "9", num: 5.53056234718826});
		result.push({ id: "10", num: 5.02743142144638});
		result.push({ id: "10", num: 5.5475});
		result.push({ id: "10", num: 6.57800511508951});
		result.push({ id: "10", num: 7.42493638676845});
		result.push({ id: "10", num: 7.75757575757576});
		result.push({ id: "10", num: 8.06835443037975});
		result.push({ id: "10", num: 8.08695652173913});
		result.push({ id: "10", num: 8.31909547738693});
		result.push({ id: "10", num: 8.445});
		result.push({ id: "10", num: 9.5});
		result.push({ id: "10", num: 9.66412213740458});
		result.push({ id: "10", num: 9.59796437659033});
		result.push({ id: "10", num: 9.35443037974684});
		result.push({ id: "10", num: 9.01503759398496});
		result.push({ id: "10", num: 9.13265306122449});
		result.push({ id: "10", num: 8.82828282828283});
		result.push({ id: "10", num: 8.64356435643564});
		result.push({ id: "10", num: 8.05486284289277});
		result.push({ id: "10", num: 7.85891089108911});
		result.push({ id: "10", num: 8.43103448275862});
		result.push({ id: "10", num: 7.94059405940594});
		result.push({ id: "10", num: 6.60902255639098});
		result.push({ id: "10", num: 5.67676767676768});
		result.push({ id: "10", num: 5.3407960199005});
		result.push({ id: "11", num: 4.24087591240876});
		result.push({ id: "11", num: 5.00242718446602});
		result.push({ id: "11", num: 6.29455445544555});
		result.push({ id: "11", num: 7.53349875930521});
		result.push({ id: "11", num: 8.72794117647059});
		result.push({ id: "11", num: 9.66172839506173});
		result.push({ id: "11", num: 9.80541871921182});
		result.push({ id: "11", num: 9.74201474201474});
		result.push({ id: "11", num: 8.90617283950617});
		result.push({ id: "11", num: 9.8019801980198});
		result.push({ id: "11", num: 9.48395061728395});
		result.push({ id: "11", num: 9.11851851851852});
		result.push({ id: "11", num: 8.38669950738916});
		result.push({ id: "11", num: 7.96829268292683});
		result.push({ id: "11", num: 8.39312039312039});
		result.push({ id: "11", num: 7.52682926829268});
		result.push({ id: "11", num: 6.56174334140436});
		result.push({ id: "11", num: 5.58823529411765});
		result.push({ id: "11", num: 5.91545893719807});
		result.push({ id: "11", num: 6.4975845410628});
		result.push({ id: "11", num: 6});
		result.push({ id: "11", num: 5.37530864197531});
		result.push({ id: "11", num: 5.03422982885086});
		result.push({ id: "11", num: 4.92909535452323});
		result.push({ id: "12", num: 6.46228710462287});
		result.push({ id: "12", num: 7.02421307506053});
		result.push({ id: "12", num: 7.64460784313725});
		result.push({ id: "12", num: 8.53482587064677});
		result.push({ id: "12", num: 9.09313725490196});
		result.push({ id: "12", num: 9.59753086419753});
		result.push({ id: "12", num: 9.92345679012346});
		result.push({ id: "12", num: 10.0614250614251});
		result.push({ id: "12", num: 10.0369458128079});
		result.push({ id: "12", num: 9.53233830845771});
		result.push({ id: "12", num: 9.33416458852868});
		result.push({ id: "12", num: 8.93734335839599});
		result.push({ id: "12", num: 8.5175});
		result.push({ id: "12", num: 8.47783251231527});
		result.push({ id: "12", num: 8.41191066997519});
		result.push({ id: "12", num: 8.26781326781327});
		result.push({ id: "12", num: 8.0632603406326});
		result.push({ id: "12", num: 7.90464547677262});
		result.push({ id: "12", num: 8.07766990291262});
		result.push({ id: "12", num: 7.90487804878049});
		result.push({ id: "12", num: 7.9119804400978});
		result.push({ id: "12", num: 7.82338308457711});
		result.push({ id: "12", num: 7.75742574257426});
		result.push({ id: "12", num: 8.10123456790124});
		result.push({ id: "13", num: 6.30049261083744});
		result.push({ id: "13", num: 6.78728606356968});
		result.push({ id: "13", num: 7.48762376237624});
		result.push({ id: "13", num: 8.31094527363184});
		result.push({ id: "13", num: 8.7671568627451});
		result.push({ id: "13", num: 9.28888888888889});
		result.push({ id: "13", num: 9.59259259259259});
		result.push({ id: "13", num: 9.5995085995086});
		result.push({ id: "13", num: 9.31358024691358});
		result.push({ id: "13", num: 9.06716417910448});
		result.push({ id: "13", num: 8.65});
		result.push({ id: "13", num: 8.22693266832918});
		result.push({ id: "13", num: 7.89578163771712});
		result.push({ id: "13", num: 7.26044226044226});
		result.push({ id: "13", num: 7.31761786600496});
		result.push({ id: "13", num: 7.21375921375921});
		result.push({ id: "13", num: 6.91687041564792});
		result.push({ id: "13", num: 6.30864197530864});
		result.push({ id: "13", num: 6.21813725490196});
		result.push({ id: "13", num: 6.28571428571429});
		result.push({ id: "13", num: 6.12592592592593});
		result.push({ id: "13", num: 5.70426065162907});
		result.push({ id: "13", num: 5.22693266832918});
		result.push({ id: "13", num: 5.32917705735661});
		result.push({ id: "14", num: 8.32360097323601});
		result.push({ id: "14", num: 8.95641646489104});
		result.push({ id: "14", num: 9.76470588235294});
		result.push({ id: "14", num: 10.2487684729064});
		result.push({ id: "14", num: 10.5800970873786});
		result.push({ id: "14", num: 10.9339853300733});
		result.push({ id: "14", num: 10.6821515892421});
		result.push({ id: "14", num: 10.2707317073171});
		result.push({ id: "14", num: 9.36585365853658});
		result.push({ id: "14", num: 8.06896551724138});
		result.push({ id: "14", num: 7.12592592592593});
		result.push({ id: "14", num: 6.69306930693069});
		result.push({ id: "14", num: 6.36386138613861});
		result.push({ id: "14", num: 6.18965517241379});
		result.push({ id: "14", num: 5.82063882063882});
		result.push({ id: "14", num: 5.57664233576642});
		result.push({ id: "14", num: 5.34698795180723});
		result.push({ id: "14", num: 5.75060532687651});
		result.push({ id: "14", num: 6.43509615384615});
		result.push({ id: "14", num: 7.20531400966184});
		result.push({ id: "14", num: 7.41888619854722});
		result.push({ id: "14", num: 7.55911330049261});
		result.push({ id: "14", num: 7.39705882352941});
		result.push({ id: "14", num: 7.34229828850856});
		result.push({ id: "15", num: 8.38442822384428});
		result.push({ id: "15", num: 8.97820823244552});
		result.push({ id: "15", num: 9.55086848635236});
		result.push({ id: "15", num: 10.0223325062035});
		result.push({ id: "15", num: 10.3382352941176});
		result.push({ id: "15", num: 10.5432098765432});
		result.push({ id: "15", num: 10.2772277227723});
		result.push({ id: "15", num: 9.96560196560197});
		result.push({ id: "15", num: 9.82758620689655});
		result.push({ id: "15", num: 8.71144278606965});
		result.push({ id: "15", num: 8.33168316831683});
		result.push({ id: "15", num: 8.05185185185185});
		result.push({ id: "15", num: 7.90570719602978});
		result.push({ id: "15", num: 7.49144254278729});
		result.push({ id: "15", num: 6.87223587223587});
		result.push({ id: "15", num: 6.18978102189781});
		result.push({ id: "15", num: 6.04578313253012});
		result.push({ id: "15", num: 5.97336561743341});
		result.push({ id: "15", num: 6.09638554216868});
		result.push({ id: "15", num: 6.98550724637681});
		result.push({ id: "15", num: 7.08716707021792});
		result.push({ id: "15", num: 7.21375921375921});
		result.push({ id: "15", num: 7.42542787286064});
		result.push({ id: "15", num: 7.68215158924205});
		result.push({ id: "16", num: 13.4014778325123});
		result.push({ id: "16", num: 13.6176470588235});
		result.push({ id: "16", num: 13.8267326732673});
		result.push({ id: "16", num: 14.5285359801489});
		result.push({ id: "16", num: 14.9387254901961});
		result.push({ id: "16", num: 15.1925925925926});
		result.push({ id: "16", num: 14.9778325123153});
		result.push({ id: "16", num: 14.0172413793103});
		result.push({ id: "16", num: 12.7881773399015});
		result.push({ id: "16", num: 10.9278606965174});
		result.push({ id: "16", num: 10.0675});
		result.push({ id: "16", num: 9.57605985037407});
		result.push({ id: "16", num: 9.23809523809524});
		result.push({ id: "16", num: 9.33827160493827});
		result.push({ id: "16", num: 9.38709677419355});
		result.push({ id: "16", num: 9.36699507389163});
		result.push({ id: "16", num: 10.2427184466019});
		result.push({ id: "16", num: 11.1428571428571});
		result.push({ id: "16", num: 12.1404358353511});
		result.push({ id: "16", num: 12.7173913043478});
		result.push({ id: "16", num: 13.380487804878});
		result.push({ id: "16", num: 13.3980343980344});
		result.push({ id: "16", num: 13.4054054054054});
		result.push({ id: "16", num: 13.4730392156863});
		result.push({ id: "17", num: 7.42014742014742});
		result.push({ id: "17", num: 8.28361858190709});
		result.push({ id: "17", num: 8.81728395061728});
		result.push({ id: "17", num: 9.01980198019802});
		result.push({ id: "17", num: 9.03921568627451});
		result.push({ id: "17", num: 9.16296296296296});
		result.push({ id: "17", num: 9.24691358024691});
		result.push({ id: "17", num: 8.75365853658537});
		result.push({ id: "17", num: 6.57002457002457});
		result.push({ id: "17", num: 4.87313432835821});
		result.push({ id: "17", num: 3.21695760598504});
		result.push({ id: "17", num: 2.57605985037406});
		result.push({ id: "17", num: 2.54228855721393});
		result.push({ id: "17", num: 3.01474201474201});
		result.push({ id: "17", num: 3.48379052369077});
		result.push({ id: "17", num: 3.87960687960688});
		result.push({ id: "17", num: 4.23373493975904});
		result.push({ id: "17", num: 4.24455205811138});
		result.push({ id: "17", num: 4.69733656174334});
		result.push({ id: "17", num: 5.47101449275362});
		result.push({ id: "17", num: 5.61743341404358});
		result.push({ id: "17", num: 4.91400491400491});
		result.push({ id: "17", num: 4.78484107579462});
		result.push({ id: "17", num: 4.87041564792176});
		result.push({ id: "18", num: 6.32923832923833});
		result.push({ id: "18", num: 6.23716381418093});
		result.push({ id: "18", num: 6.34814814814815});
		result.push({ id: "18", num: 6.21588089330025});
		result.push({ id: "18", num: 6.06372549019608});
		result.push({ id: "18", num: 5.92345679012346});
		result.push({ id: "18", num: 6.00247524752475});
		result.push({ id: "18", num: 6.14285714285714});
		result.push({ id: "18", num: 5.37931034482759});
		result.push({ id: "18", num: 5.16169154228856});
		result.push({ id: "18", num: 4.93765586034913});
		result.push({ id: "18", num: 4.66084788029925});
		result.push({ id: "18", num: 4.69950738916256});
		result.push({ id: "18", num: 5.53771289537713});
		result.push({ id: "18", num: 5.37346437346437});
		result.push({ id: "18", num: 5.30170316301703});
		result.push({ id: "18", num: 5.38498789346247});
		result.push({ id: "18", num: 5.57142857142857});
		result.push({ id: "18", num: 5.89423076923077});
		result.push({ id: "18", num: 6.27536231884058});
		result.push({ id: "18", num: 5.84503631961259});
		result.push({ id: "18", num: 5.90663390663391});
		result.push({ id: "18", num: 5.96577017114914});
		result.push({ id: "18", num: 5.88264058679707});
		result.push({ id: "19", num: 3.0125313283208});
		result.push({ id: "19", num: 2.39900249376559});
		result.push({ id: "19", num: 1.70886075949367});
		result.push({ id: "19", num: 1.56455696202532});
		result.push({ id: "19", num: 1.3375});
		result.push({ id: "19", num: 1.26952141057935});
		result.push({ id: "19", num: 2.5925});
		result.push({ id: "19", num: 3.89189189189189});
		result.push({ id: "19", num: 4.12807881773399});
		result.push({ id: "19", num: 6.15174129353234});
		result.push({ id: "19", num: 7.97022332506203});
		result.push({ id: "19", num: 8.70617283950617});
		result.push({ id: "19", num: 8.19900497512438});
		result.push({ id: "19", num: 7.56265356265356});
		result.push({ id: "19", num: 7.61616161616162});
		result.push({ id: "19", num: 7.79404466501241});
		result.push({ id: "19", num: 6.93203883495146});
		result.push({ id: "19", num: 5.89588377723971});
		result.push({ id: "19", num: 4.54106280193237});
		result.push({ id: "19", num: 3.70048309178744});
		result.push({ id: "19", num: 3.18886198547216});
		result.push({ id: "19", num: 3.29484029484029});
		result.push({ id: "19", num: 3.36185819070905});
		result.push({ id: "19", num: 3.49144254278729});
		result.push({ id: "20", num: 2.39172749391728});
		result.push({ id: "20", num: 2.1626213592233});
		result.push({ id: "20", num: 1.6044226044226});
		result.push({ id: "20", num: 1.19554455445545});
		result.push({ id: "20", num: 1.13106796116505});
		result.push({ id: "20", num: 1.14987714987715});
		result.push({ id: "20", num: 2.72524752475248});
		result.push({ id: "20", num: 3.28888888888889});
		result.push({ id: "20", num: 4.84729064039409});
		result.push({ id: "20", num: 6.99502487562189});
		result.push({ id: "20", num: 8.97007481296758});
		result.push({ id: "20", num: 9.8503740648379});
		result.push({ id: "20", num: 10.145});
		result.push({ id: "20", num: 9.90909090909091});
		result.push({ id: "20", num: 9.52109181141439});
		result.push({ id: "20", num: 9.34889434889435});
		result.push({ id: "20", num: 9.004914004914});
		result.push({ id: "20", num: 7.67821782178218});
		result.push({ id: "20", num: 6.29901960784314});
		result.push({ id: "20", num: 4.2636815920398});
		result.push({ id: "20", num: 2.7825});
		result.push({ id: "20", num: 2.92911392405063});
		result.push({ id: "20", num: 3.19647355163728});
		result.push({ id: "20", num: 3.20151133501259});
		result.push({ id: "21", num: 2.96457765667575});
		result.push({ id: "21", num: 2.60597826086957});
		result.push({ id: "21", num: 1.83606557377049});
		result.push({ id: "21", num: 1.60055096418733});
		result.push({ id: "21", num: 1.45108695652174});
		result.push({ id: "21", num: 1.41256830601093});
		result.push({ id: "21", num: 1.68306010928962});
		result.push({ id: "21", num: 2.25340599455041});
		result.push({ id: "21", num: 2.90217391304348});
		result.push({ id: "21", num: 4.56353591160221});
		result.push({ id: "21", num: 5.89226519337017});
		result.push({ id: "21", num: 6.45879120879121});
		result.push({ id: "21", num: 6.73333333333333});
		result.push({ id: "21", num: 6.68493150684932});
		result.push({ id: "21", num: 6.75206611570248});
		result.push({ id: "21", num: 6.34246575342466});
		result.push({ id: "21", num: 5.87935656836461});
		result.push({ id: "21", num: 5.35561497326203});
		result.push({ id: "21", num: 4.368});
		result.push({ id: "21", num: 3.55882352941176});
		result.push({ id: "21", num: 3.05420054200542});
		result.push({ id: "21", num: 3.00550964187328});
		result.push({ id: "21", num: 3.02472527472527});
		result.push({ id: "21", num: 3.23497267759563});
		result.push({ id: "22", num: 6.22871046228711});
		result.push({ id: "22", num: 3.58837772397094});
		result.push({ id: "22", num: 1.40097799511002});
		result.push({ id: "22", num: 0.901719901719902});
		result.push({ id: "22", num: 1.02912621359223});
		result.push({ id: "22", num: 1.37652811735941});
		result.push({ id: "22", num: 2.58536585365854});
		result.push({ id: "22", num: 4.07334963325183});
		result.push({ id: "22", num: 5.95609756097561});
		result.push({ id: "22", num: 9.39408866995074});
		result.push({ id: "22", num: 13.441975308642});
		result.push({ id: "22", num: 17.1064356435644});
		result.push({ id: "22", num: 18.4826732673267});
		result.push({ id: "22", num: 18.5916870415648});
		result.push({ id: "22", num: 19.5577395577396});
		result.push({ id: "22", num: 20.5547445255474});
		result.push({ id: "22", num: 20.2311435523114});
		result.push({ id: "22", num: 18.8740920096852});
		result.push({ id: "22", num: 16.9639423076923});
		result.push({ id: "22", num: 11.7004830917874});
		result.push({ id: "22", num: 9.58111380145279});
		result.push({ id: "22", num: 9.75615763546798});
		result.push({ id: "22", num: 9.87775061124694});
		result.push({ id: "22", num: 9.23471882640587});
		result.push({ id: "23", num: 4.15815085158151});
		result.push({ id: "23", num: 4.13075060532688});
		result.push({ id: "23", num: 3.56127450980392});
		result.push({ id: "23", num: 3.01719901719902});
		result.push({ id: "23", num: 2.88834951456311});
		result.push({ id: "23", num: 2.94865525672372});
		result.push({ id: "23", num: 3.1390243902439});
		result.push({ id: "23", num: 3.74209245742092});
		result.push({ id: "23", num: 4.5390243902439});
		result.push({ id: "23", num: 6.26354679802956});
		result.push({ id: "23", num: 6.46913580246914});
		result.push({ id: "23", num: 6.31851851851852});
		result.push({ id: "23", num: 5.83084577114428});
		result.push({ id: "23", num: 5.50611246943765});
		result.push({ id: "23", num: 5.46517412935323});
		result.push({ id: "23", num: 5.27804878048781});
		result.push({ id: "23", num: 4.84096385542169});
		result.push({ id: "23", num: 4.46973365617433});
		result.push({ id: "23", num: 3.8719806763285});
		result.push({ id: "23", num: 3.42270531400966});
		result.push({ id: "23", num: 3.44309927360775});
		result.push({ id: "23", num: 3.48029556650246});
		result.push({ id: "23", num: 3.71638141809291});
		result.push({ id: "23", num: 3.65525672371638});
		result.push({ id: "24", num: 10.0864864864865});
		result.push({ id: "24", num: 11.2103825136612});
		result.push({ id: "24", num: 11.7016574585635});
		result.push({ id: "24", num: 11.8467966573816});
		result.push({ id: "24", num: 12.0686813186813});
		result.push({ id: "24", num: 12.0524861878453});
		result.push({ id: "24", num: 11.817679558011});
		result.push({ id: "24", num: 10.8681318681319});
		result.push({ id: "24", num: 9.0521978021978});
		result.push({ id: "24", num: 6.56424581005587});
		result.push({ id: "24", num: 5});
		result.push({ id: "24", num: 4.50555555555556});
		result.push({ id: "24", num: 4.65555555555556});
		result.push({ id: "24", num: 4.70958904109589});
		result.push({ id: "24", num: 4.42424242424242});
		result.push({ id: "24", num: 4.74659400544959});
		result.push({ id: "24", num: 5.38378378378378});
		result.push({ id: "24", num: 5.86058981233244});
		result.push({ id: "24", num: 6.50133333333333});
		result.push({ id: "24", num: 7.50534759358289});
		result.push({ id: "24", num: 7.92162162162162});
		result.push({ id: "24", num: 7.75549450549451});
		result.push({ id: "24", num: 7.95068493150685});
		result.push({ id: "24", num: 8.23497267759563});
		result.push({ id: "29", num: 7.49391727493917});
		result.push({ id: "29", num: 8.04126213592233});
		result.push({ id: "29", num: 9.3080684596577});
		result.push({ id: "29", num: 10.8157248157248});
		result.push({ id: "29", num: 11.752427184466});
		result.push({ id: "29", num: 12.3300733496333});
		result.push({ id: "29", num: 12.2469437652812});
		result.push({ id: "29", num: 11.5936739659367});
		result.push({ id: "29", num: 10.680487804878});
		result.push({ id: "29", num: 9.84729064039409});
		result.push({ id: "29", num: 9.56049382716049});
		result.push({ id: "29", num: 9.18271604938272});
		result.push({ id: "29", num: 8.86848635235732});
		result.push({ id: "29", num: 8.69756097560976});
		result.push({ id: "29", num: 8.05405405405405});
		result.push({ id: "29", num: 7.12990196078431});
		result.push({ id: "29", num: 6.89638554216867});
		result.push({ id: "29", num: 7.56174334140436});
		result.push({ id: "29", num: 8.10120481927711});
		result.push({ id: "29", num: 8.36319612590799});
		result.push({ id: "29", num: 8.2590799031477});
		result.push({ id: "29", num: 7.83456790123457});
		result.push({ id: "29", num: 7.36855036855037});
		result.push({ id: "29", num: 7.6039119804401});
		result.push({ id: "30", num: 11.0827250608273});
		result.push({ id: "30", num: 11.3975609756098});
		result.push({ id: "30", num: 12.0220588235294});
		result.push({ id: "30", num: 12.7739557739558});
		result.push({ id: "30", num: 13.1820388349515});
		result.push({ id: "30", num: 13.4278728606357});
		result.push({ id: "30", num: 13.8357843137255});
		result.push({ id: "30", num: 13.2189781021898});
		result.push({ id: "30", num: 12.4243902439024});
		result.push({ id: "30", num: 11.9358024691358});
		result.push({ id: "30", num: 11.6485148514851});
		result.push({ id: "30", num: 11.0197530864198});
		result.push({ id: "30", num: 10.4507389162562});
		result.push({ id: "30", num: 10.4939172749392});
		result.push({ id: "30", num: 10.1523341523342});
		result.push({ id: "30", num: 9.82238442822384});
		result.push({ id: "30", num: 9.78072289156627});
		result.push({ id: "30", num: 9.78640776699029});
		result.push({ id: "30", num: 10.6538461538462});
		result.push({ id: "30", num: 11.1884057971014});
		result.push({ id: "30", num: 11.455205811138});
		result.push({ id: "30", num: 11.5665024630542});
		result.push({ id: "30", num: 11.5256723716381});
		result.push({ id: "30", num: 11.5794621026895});
		result.push({ id: "31", num: 8.54590570719603});
		result.push({ id: "31", num: 8.9358024691358});
		result.push({ id: "31", num: 9.5025});
		result.push({ id: "31", num: 10.1704260651629});
		result.push({ id: "31", num: 10.6559405940594});
		result.push({ id: "31", num: 11.1221945137157});
		result.push({ id: "31", num: 11.1138613861386});
		result.push({ id: "31", num: 10.4753694581281});
		result.push({ id: "31", num: 9.67574257425743});
		result.push({ id: "31", num: 8.80099502487562});
		result.push({ id: "31", num: 8.54114713216958});
		result.push({ id: "31", num: 8.42964824120603});
		result.push({ id: "31", num: 8.22388059701493});
		result.push({ id: "31", num: 8.07769423558897});
		result.push({ id: "31", num: 7.87531806615776});
		result.push({ id: "31", num: 7.80597014925373});
		result.push({ id: "31", num: 7.68126520681265});
		result.push({ id: "31", num: 7.75544794188862});
		result.push({ id: "31", num: 8.25721153846154});
		result.push({ id: "31", num: 8.53140096618358});
		result.push({ id: "31", num: 8.82439024390244});
		result.push({ id: "31", num: 9.01015228426396});
		result.push({ id: "31", num: 8.89420654911839});
		result.push({ id: "31", num: 9.00755667506297});
		result.push({ id: "32", num: 6.78102189781022});
		result.push({ id: "32", num: 6.96125907990315});
		result.push({ id: "32", num: 7.40586797066015});
		result.push({ id: "32", num: 7.88697788697789});
		result.push({ id: "32", num: 8.14320388349515});
		result.push({ id: "32", num: 8.34474327628362});
		result.push({ id: "32", num: 8.50611246943765});
		result.push({ id: "32", num: 8.43552311435523});
		result.push({ id: "32", num: 7.84390243902439});
		result.push({ id: "32", num: 7.70864197530864});
		result.push({ id: "32", num: 7.51358024691358});
		result.push({ id: "32", num: 7.32592592592593});
		result.push({ id: "32", num: 6.98019801980198});
		result.push({ id: "32", num: 6.9559902200489});
		result.push({ id: "32", num: 6.9454094292804});
		result.push({ id: "32", num: 6.89975550122249});
		result.push({ id: "32", num: 6.84578313253012});
		result.push({ id: "32", num: 6.79661016949153});
		result.push({ id: "32", num: 6.62650602409639});
		result.push({ id: "32", num: 6.39371980676329});
		result.push({ id: "32", num: 6.45520581113801});
		result.push({ id: "32", num: 6.66830466830467});
		result.push({ id: "32", num: 6.55256723716381});
		result.push({ id: "32", num: 6.61369193154034});
		result.push({ id: "33", num: 5.52926829268293});
		result.push({ id: "33", num: 6.17433414043584});
		result.push({ id: "33", num: 7.09558823529412});
		result.push({ id: "33", num: 7.88943488943489});
		result.push({ id: "33", num: 8.39320388349515});
		result.push({ id: "33", num: 8.86552567237164});
		result.push({ id: "33", num: 9.03911980440098});
		result.push({ id: "33", num: 9.09002433090024});
		result.push({ id: "33", num: 9.56829268292683});
		result.push({ id: "33", num: 9.1871921182266});
		result.push({ id: "33", num: 8.98024691358025});
		result.push({ id: "33", num: 8.4320987654321});
		result.push({ id: "33", num: 7.52709359605911});
		result.push({ id: "33", num: 7.34549878345499});
		result.push({ id: "33", num: 6.63793103448276});
		result.push({ id: "33", num: 5.91463414634146});
		result.push({ id: "33", num: 4.84299516908213});
		result.push({ id: "33", num: 4.24514563106796});
		result.push({ id: "33", num: 4.44951923076923});
		result.push({ id: "33", num: 5.35265700483092});
		result.push({ id: "33", num: 5.94673123486683});
		result.push({ id: "33", num: 6.01474201474201});
		result.push({ id: "33", num: 5.38630806845966});
		result.push({ id: "33", num: 5.20537897310513});
		result.push({ id: "34", num: 8.74695863746959});
		result.push({ id: "34", num: 9.59806295399516});
		result.push({ id: "34", num: 10.2549019607843});
		result.push({ id: "34", num: 10.692118226601});
		result.push({ id: "34", num: 11});
		result.push({ id: "34", num: 11.1466992665037});
		result.push({ id: "34", num: 11.2518337408313});
		result.push({ id: "34", num: 10.7688564476886});
		result.push({ id: "34", num: 9.89512195121951});
		result.push({ id: "34", num: 8.78817733990148});
		result.push({ id: "34", num: 8.21481481481482});
		result.push({ id: "34", num: 7.3283950617284});
		result.push({ id: "34", num: 6.60493827160494});
		result.push({ id: "34", num: 7.03649635036496});
		result.push({ id: "34", num: 6.91891891891892});
		result.push({ id: "34", num: 6.53771289537713});
		result.push({ id: "34", num: 6.3421686746988});
		result.push({ id: "34", num: 6.15254237288136});
		result.push({ id: "34", num: 6.46987951807229});
		result.push({ id: "34", num: 6.85990338164251});
		result.push({ id: "34", num: 7.56174334140436});
		result.push({ id: "34", num: 8.01477832512315});
		result.push({ id: "34", num: 7.84520884520885});
		result.push({ id: "34", num: 7.96332518337408});
		result.push({ id: "35", num: 9.14177215189873});
		result.push({ id: "35", num: 10.0251889168766});
		result.push({ id: "35", num: 10.6061381074169});
		result.push({ id: "35", num: 10.9664082687339});
		result.push({ id: "35", num: 11.2091836734694});
		result.push({ id: "35", num: 11.1670951156812});
		result.push({ id: "35", num: 10.9307692307692});
		result.push({ id: "35", num: 9.87277353689568});
		result.push({ id: "35", num: 7.41878172588832});
		result.push({ id: "35", num: 4.77002583979328});
		result.push({ id: "35", num: 3.24742268041237});
		result.push({ id: "35", num: 2.84061696658098});
		result.push({ id: "35", num: 3.21483375959079});
		result.push({ id: "35", num: 3.76275510204082});
		result.push({ id: "35", num: 3.68134715025907});
		result.push({ id: "35", num: 4.22879177377892});
		result.push({ id: "35", num: 4.32151898734177});
		result.push({ id: "35", num: 4.85714285714286});
		result.push({ id: "35", num: 5.98227848101266});
		result.push({ id: "35", num: 7.21012658227848});
		result.push({ id: "35", num: 6.77608142493639});
		result.push({ id: "35", num: 5.83547557840617});
		result.push({ id: "35", num: 5.4318766066838});
		result.push({ id: "35", num: 5.6452442159383});
		result.push({ id: "36", num: 8.69272237196765});
		result.push({ id: "36", num: 9.76407506702413});
		result.push({ id: "36", num: 10.627027027027});
		result.push({ id: "36", num: 11.3623978201635});
		result.push({ id: "36", num: 11.4343163538874});
		result.push({ id: "36", num: 11.7181571815718});
		result.push({ id: "36", num: 11.7304582210243});
		result.push({ id: "36", num: 11.2021563342318});
		result.push({ id: "36", num: 10.1405405405405});
		result.push({ id: "36", num: 8.10655737704918});
		result.push({ id: "36", num: 6.42349726775956});
		result.push({ id: "36", num: 5.11232876712329});
		result.push({ id: "36", num: 4.48360655737705});
		result.push({ id: "36", num: 4.49593495934959});
		result.push({ id: "36", num: 4.39509536784741});
		result.push({ id: "36", num: 4.30913978494624});
		result.push({ id: "36", num: 4.08});
		result.push({ id: "36", num: 4.49329758713137});
		result.push({ id: "36", num: 5.304});
		result.push({ id: "36", num: 5.99465240641711});
		result.push({ id: "36", num: 6.03217158176944});
		result.push({ id: "36", num: 5.51212938005391});
		result.push({ id: "36", num: 5.31707317073171});
		result.push({ id: "36", num: 5.73441734417344});
		result.push({ id: "37", num: 4.11192214111922});
		result.push({ id: "37", num: 3.73607748184019});
		result.push({ id: "37", num: 2.8406862745098});
		result.push({ id: "37", num: 2.29238329238329});
		result.push({ id: "37", num: 1.93203883495146});
		result.push({ id: "37", num: 1.87041564792176});
		result.push({ id: "37", num: 2.01219512195122});
		result.push({ id: "37", num: 2.32603406326034});
		result.push({ id: "37", num: 3.65121951219512});
		result.push({ id: "37", num: 6.62315270935961});
		result.push({ id: "37", num: 7.61633663366337});
		result.push({ id: "37", num: 8});
		result.push({ id: "37", num: 7.21039603960396});
		result.push({ id: "37", num: 6.60294117647059});
		result.push({ id: "37", num: 7.80788177339902});
		result.push({ id: "37", num: 8.55853658536585});
		result.push({ id: "37", num: 8.40240963855422});
		result.push({ id: "37", num: 6.34866828087167});
		result.push({ id: "37", num: 4.27163461538461});
		result.push({ id: "37", num: 3.59178743961353});
		result.push({ id: "37", num: 3.64406779661017});
		result.push({ id: "37", num: 3.79064039408867});
		result.push({ id: "37", num: 3.93154034229829});
		result.push({ id: "37", num: 4.07090464547677});
		result.push({ id: "38", num: 5.76904176904177});
		result.push({ id: "38", num: 5.54278728606357});
		result.push({ id: "38", num: 5.26172839506173});
		result.push({ id: "38", num: 5.04477611940298});
		result.push({ id: "38", num: 4.99264705882353});
		result.push({ id: "38", num: 5.06913580246914});
		result.push({ id: "38", num: 5.14851485148515});
		result.push({ id: "38", num: 5.02702702702703});
		result.push({ id: "38", num: 4.08128078817734});
		result.push({ id: "38", num: 4.00498753117207});
		result.push({ id: "38", num: 3.45885286783042});
		result.push({ id: "38", num: 3.64691358024691});
		result.push({ id: "38", num: 3.3539603960396});
		result.push({ id: "38", num: 3.41564792176039});
		result.push({ id: "38", num: 4.39312039312039});
		result.push({ id: "38", num: 4.28467153284672});
		result.push({ id: "38", num: 4.25181598062954});
		result.push({ id: "38", num: 4.45036319612591});
		result.push({ id: "38", num: 4.3768115942029});
		result.push({ id: "38", num: 4.5024154589372});
		result.push({ id: "38", num: 4.26150121065375});
		result.push({ id: "38", num: 3.76543209876543});
		result.push({ id: "38", num: 3.83703703703704});
		result.push({ id: "38", num: 4});
		result.push({ id: "39", num: 4.2676399026764});
		result.push({ id: "39", num: 2.75302663438257});
		result.push({ id: "39", num: 1.4278728606357});
		result.push({ id: "39", num: 1.17199017199017});
		result.push({ id: "39", num: 1.09708737864078});
		result.push({ id: "39", num: 1.05134474327628});
		result.push({ id: "39", num: 2.01965601965602});
		result.push({ id: "39", num: 4.18780487804878});
		result.push({ id: "39", num: 6.50731707317073});
		result.push({ id: "39", num: 13.7733990147783});
		result.push({ id: "39", num: 17.1930693069307});
		result.push({ id: "39", num: 19.5827160493827});
		result.push({ id: "39", num: 20.1604938271605});
		result.push({ id: "39", num: 19.1995133819951});
		result.push({ id: "39", num: 20.2678132678133});
		result.push({ id: "39", num: 20.338199513382});
		result.push({ id: "39", num: 19.8});
		result.push({ id: "39", num: 17.4624697336562});
		result.push({ id: "39", num: 12.3927710843373});
		result.push({ id: "39", num: 8.72946859903382});
		result.push({ id: "39", num: 7.71912832929782});
		result.push({ id: "39", num: 8.07881773399015});
		result.push({ id: "39", num: 8.33496332518337});
		result.push({ id: "39", num: 7.77017114914425});
		result.push({ id: "40", num: 4.35626535626536});
		result.push({ id: "40", num: 3.00977995110024});
		result.push({ id: "40", num: 0.935802469135802});
		result.push({ id: "40", num: 0.661691542288557});
		result.push({ id: "40", num: 0.595588235294118});
		result.push({ id: "40", num: 0.679012345679012});
		result.push({ id: "40", num: 1.24384236453202});
		result.push({ id: "40", num: 1.63300492610837});
		result.push({ id: "40", num: 3.70443349753695});
		result.push({ id: "40", num: 9.24875621890547});
		result.push({ id: "40", num: 11.0174563591022});
		result.push({ id: "40", num: 11.8225});
		result.push({ id: "40", num: 12.0375939849624});
		result.push({ id: "40", num: 12.2864197530864});
		result.push({ id: "40", num: 12.7475247524752});
		result.push({ id: "40", num: 12.4355231143552});
		result.push({ id: "40", num: 11.633734939759});
		result.push({ id: "40", num: 9.80629539951574});
		result.push({ id: "40", num: 7.71875});
		result.push({ id: "40", num: 6.73429951690821});
		result.push({ id: "40", num: 6.80145278450363});
		result.push({ id: "40", num: 8.31203931203931});
		result.push({ id: "40", num: 9.33251833740831});
		result.push({ id: "40", num: 8.33251833740831});
		result.push({ id: "41", num: 6.56934306569343});
		result.push({ id: "41", num: 4.39709443099274});
		result.push({ id: "41", num: 1.68872549019608});
		result.push({ id: "41", num: 1.15233415233415});
		result.push({ id: "41", num: 1.05825242718447});
		result.push({ id: "41", num: 1.14950980392157});
		result.push({ id: "41", num: 1.28850855745721});
		result.push({ id: "41", num: 2.02676399026764});
		result.push({ id: "41", num: 2.40097799511002});
		result.push({ id: "41", num: 3.40886699507389});
		result.push({ id: "41", num: 5.53712871287129});
		result.push({ id: "41", num: 6.68888888888889});
		result.push({ id: "41", num: 7.1439205955335});
		result.push({ id: "41", num: 7.44254278728606});
		result.push({ id: "41", num: 7.4029484029484});
		result.push({ id: "41", num: 7.70802919708029});
		result.push({ id: "41", num: 7.98795180722892});
		result.push({ id: "41", num: 7.68765133171913});
		result.push({ id: "41", num: 7.02650602409639});
		result.push({ id: "41", num: 5.18115942028986});
		result.push({ id: "41", num: 4.60290556900726});
		result.push({ id: "41", num: 6.54791154791155});
		result.push({ id: "41", num: 8.10268948655257});
		result.push({ id: "41", num: 7.7799511002445});
		result.push({ id: "42", num: 9.03170731707317});
		result.push({ id: "42", num: 5.41162227602906});
		result.push({ id: "42", num: 1.5281173594132});
		result.push({ id: "42", num: 0.884520884520885});
		result.push({ id: "42", num: 0.898058252427185});
		result.push({ id: "42", num: 1.09535452322738});
		result.push({ id: "42", num: 1.24205378973105});
		result.push({ id: "42", num: 1.42751842751843});
		result.push({ id: "42", num: 1.57560975609756});
		result.push({ id: "42", num: 2.62315270935961});
		result.push({ id: "42", num: 4.11111111111111});
		result.push({ id: "42", num: 5.49382716049383});
		result.push({ id: "42", num: 7.04679802955665});
		result.push({ id: "42", num: 8.67892156862745});
		result.push({ id: "42", num: 9.11822660098522});
		result.push({ id: "42", num: 9.330900243309});
		result.push({ id: "42", num: 9.32608695652174});
		result.push({ id: "42", num: 10.3252427184466});
		result.push({ id: "42", num: 11.7908653846154});
		result.push({ id: "42", num: 11.6763285024155});
		result.push({ id: "42", num: 12.09200968523});
		result.push({ id: "42", num: 14.4742014742015});
		result.push({ id: "42", num: 15.239608801956});
		result.push({ id: "42", num: 13.5916870415648});
		result.push({ id: "43", num: 9.85111662531017});
		result.push({ id: "43", num: 8.18024691358025});
		result.push({ id: "43", num: 4.5678391959799});
		result.push({ id: "43", num: 2.55189873417722});
		result.push({ id: "43", num: 1.9625});
		result.push({ id: "43", num: 1.94206549118388});
		result.push({ id: "43", num: 2.78643216080402});
		result.push({ id: "43", num: 3.10526315789474});
		result.push({ id: "43", num: 2.66834170854271});
		result.push({ id: "43", num: 2.41624365482234});
		result.push({ id: "43", num: 2.9846547314578});
		result.push({ id: "43", num: 3.13197969543147});
		result.push({ id: "43", num: 4.03807106598985});
		result.push({ id: "43", num: 5.0475});
		result.push({ id: "43", num: 5.42569269521411});
		result.push({ id: "43", num: 5.80200501253133});
		result.push({ id: "43", num: 5.77915632754342});
		result.push({ id: "43", num: 5.85785536159601});
		result.push({ id: "43", num: 5.56575682382134});
		result.push({ id: "43", num: 5.3134328358209});
		result.push({ id: "43", num: 6.36159600997506});
		result.push({ id: "43", num: 7.81979695431472});
		result.push({ id: "43", num: 9.10831234256927});
		result.push({ id: "43", num: 9.41561712846348});
		result.push({ id: "44", num: 7.7639902676399});
		result.push({ id: "44", num: 5.42857142857143});
		result.push({ id: "44", num: 2.14496314496315});
		result.push({ id: "44", num: 1.19410319410319});
		result.push({ id: "44", num: 1.1747572815534});
		result.push({ id: "44", num: 1.78973105134474});
		result.push({ id: "44", num: 2.97794117647059});
		result.push({ id: "44", num: 3.90953545232274});
		result.push({ id: "44", num: 4.29512195121951});
		result.push({ id: "44", num: 3.75862068965517});
		result.push({ id: "44", num: 4.37});
		result.push({ id: "44", num: 5.07654320987654});
		result.push({ id: "44", num: 5.48387096774194});
		result.push({ id: "44", num: 5.94376528117359});
		result.push({ id: "44", num: 6.16216216216216});
		result.push({ id: "44", num: 6.35365853658537});
		result.push({ id: "44", num: 6.48674698795181});
		result.push({ id: "44", num: 6.95399515738499});
		result.push({ id: "44", num: 7.19806763285024});
		result.push({ id: "44", num: 6.86473429951691});
		result.push({ id: "44", num: 7.30508474576271});
		result.push({ id: "44", num: 8.41625615763547});
		result.push({ id: "44", num: 9.16176470588235});
		result.push({ id: "44", num: 8.96078431372549});
		result.push({ id: "45", num: 4.31143552311435});
		result.push({ id: "45", num: 4.79903147699758});
		result.push({ id: "45", num: 4.37163814180929});
		result.push({ id: "45", num: 3.96560196560197});
		result.push({ id: "45", num: 3.96601941747573});
		result.push({ id: "45", num: 4.22982885085575});
		result.push({ id: "45", num: 4.61463414634146});
		result.push({ id: "45", num: 5.06341463414634});
		result.push({ id: "45", num: 5.49512195121951});
		result.push({ id: "45", num: 6.85467980295566});
		result.push({ id: "45", num: 5.88148148148148});
		result.push({ id: "45", num: 5.22222222222222});
		result.push({ id: "45", num: 4.29601990049751});
		result.push({ id: "45", num: 4.05378973105134});
		result.push({ id: "45", num: 4.17936117936118});
		result.push({ id: "45", num: 4.06601466992665});
		result.push({ id: "45", num: 3.18795180722892});
		result.push({ id: "45", num: 2.78883495145631});
		result.push({ id: "45", num: 2.60869565217391});
		result.push({ id: "45", num: 2.72222222222222});
		result.push({ id: "45", num: 2.89346246973366});
		result.push({ id: "45", num: 3.19164619164619});
		result.push({ id: "45", num: 3.06601466992665});
		result.push({ id: "45", num: 3.63814180929095});
		result.push({ id: "50", num: 7.55961070559611});
		result.push({ id: "50", num: 8.02179176755448});
		result.push({ id: "50", num: 8.46437346437346});
		result.push({ id: "50", num: 8.84653465346535});
		result.push({ id: "50", num: 9.12135922330097});
		result.push({ id: "50", num: 9.32273838630807});
		result.push({ id: "50", num: 9.4656862745098});
		result.push({ id: "50", num: 9.36739659367397});
		result.push({ id: "50", num: 8.72926829268293});
		result.push({ id: "50", num: 7.93333333333333});
		result.push({ id: "50", num: 7.67407407407407});
		result.push({ id: "50", num: 7.43456790123457});
		result.push({ id: "50", num: 7.50495049504951});
		result.push({ id: "50", num: 7.54034229828851});
		result.push({ id: "50", num: 7.23341523341523});
		result.push({ id: "50", num: 7.0609756097561});
		result.push({ id: "50", num: 6.90361445783132});
		result.push({ id: "50", num: 6.88135593220339});
		result.push({ id: "50", num: 7.10361445783133});
		result.push({ id: "50", num: 7.52173913043478});
		result.push({ id: "50", num: 8.11407766990291});
		result.push({ id: "50", num: 8.28817733990148});
		result.push({ id: "50", num: 8.09290953545232});
		result.push({ id: "50", num: 8.19315403422983});
		result.push({ id: "52", num: 9.0705596107056});
		result.push({ id: "52", num: 9.35108958837772});
		result.push({ id: "52", num: 9.56862745098039});
		result.push({ id: "52", num: 9.95085995085995});
		result.push({ id: "52", num: 10.2742718446602});
		result.push({ id: "52", num: 10.4498777506112});
		result.push({ id: "52", num: 10.7829268292683});
		result.push({ id: "52", num: 10.7931873479319});
		result.push({ id: "52", num: 10.5609756097561});
		result.push({ id: "52", num: 10.3571428571429});
		result.push({ id: "52", num: 9.78960396039604});
		result.push({ id: "52", num: 9.31604938271605});
		result.push({ id: "52", num: 8.74009900990099});
		result.push({ id: "52", num: 8.44987775061125});
		result.push({ id: "52", num: 7.66584766584767});
		result.push({ id: "52", num: 7.78048780487805});
		result.push({ id: "52", num: 7.8289156626506});
		result.push({ id: "52", num: 8.11622276029056});
		result.push({ id: "52", num: 8.39277108433735});
		result.push({ id: "52", num: 8.5024154589372});
		result.push({ id: "52", num: 8.56067961165049});
		result.push({ id: "52", num: 8.50864197530864});
		result.push({ id: "52", num: 8.24019607843137});
		result.push({ id: "52", num: 8.31051344743276});
		result.push({ id: "53", num: 9.27493917274939});
		result.push({ id: "53", num: 9.71046228710462});
		result.push({ id: "53", num: 10.2727272727273});
		result.push({ id: "53", num: 10.6904176904177});
		result.push({ id: "53", num: 11.0679611650485});
		result.push({ id: "53", num: 11.1760391198044});
		result.push({ id: "53", num: 10.9951100244499});
		result.push({ id: "53", num: 10.5121951219512});
		result.push({ id: "53", num: 9.41463414634146});
		result.push({ id: "53", num: 8.3128078817734});
		result.push({ id: "53", num: 7.40740740740741});
		result.push({ id: "53", num: 6.96049382716049});
		result.push({ id: "53", num: 6.70197044334975});
		result.push({ id: "53", num: 6.79805352798054});
		result.push({ id: "53", num: 6.63546798029557});
		result.push({ id: "53", num: 6.30656934306569});
		result.push({ id: "53", num: 6.22650602409639});
		result.push({ id: "53", num: 6.42615012106538});
		result.push({ id: "53", num: 7.26746987951807});
		result.push({ id: "53", num: 8.1231884057971});
		result.push({ id: "53", num: 8.72572815533981});
		result.push({ id: "53", num: 8.8320987654321});
		result.push({ id: "53", num: 8.85330073349633});
		result.push({ id: "53", num: 9.04156479217604});
		result.push({ id: "55", num: 8.70967741935484});
		result.push({ id: "55", num: 9.39012345679012});
		result.push({ id: "55", num: 10.0225});
		result.push({ id: "55", num: 10.2481203007519});
		result.push({ id: "55", num: 10.6262376237624});
		result.push({ id: "55", num: 11.0249376558603});
		result.push({ id: "55", num: 10.5511221945137});
		result.push({ id: "55", num: 9.94789081885856});
		result.push({ id: "55", num: 8.90796019900498});
		result.push({ id: "55", num: 8.4572864321608});
		result.push({ id: "55", num: 8.3325});
		result.push({ id: "55", num: 7.87128712871287});
		result.push({ id: "55", num: 7.95555555555556});
		result.push({ id: "55", num: 7.84352078239609});
		result.push({ id: "55", num: 7.67321867321867});
		result.push({ id: "55", num: 7.00975609756098});
		result.push({ id: "55", num: 6.81927710843373});
		result.push({ id: "55", num: 7.16990291262136});
		result.push({ id: "55", num: 7.3698296836983});
		result.push({ id: "55", num: 7.79512195121951});
		result.push({ id: "55", num: 7.04656862745098});
		result.push({ id: "55", num: 6.10379746835443});
		result.push({ id: "55", num: 6.27959697732997});
		result.push({ id: "55", num: 6.5919395465995});
		result.push({ id: "56", num: 11.0486618004866});
		result.push({ id: "56", num: 11.1743341404358});
		result.push({ id: "56", num: 10.4889434889435});
		result.push({ id: "56", num: 10.0958230958231});
		result.push({ id: "56", num: 9.76699029126214});
		result.push({ id: "56", num: 9.98777506112469});
		result.push({ id: "56", num: 10.0073349633252});
		result.push({ id: "56", num: 9.59512195121951});
		result.push({ id: "56", num: 8.6609756097561});
		result.push({ id: "56", num: 8.1283950617284});
		result.push({ id: "56", num: 8.35802469135803});
		result.push({ id: "56", num: 7.5037037037037});
		result.push({ id: "56", num: 7.18610421836228});
		result.push({ id: "56", num: 7.78728606356968});
		result.push({ id: "56", num: 6.83046683046683});
		result.push({ id: "56", num: 5.85365853658537});
		result.push({ id: "56", num: 6.18072289156627});
		result.push({ id: "56", num: 7.01210653753027});
		result.push({ id: "56", num: 7.91084337349398});
		result.push({ id: "56", num: 9.56280193236715});
		result.push({ id: "56", num: 9.82324455205811});
		result.push({ id: "56", num: 9.26781326781327});
		result.push({ id: "56", num: 8.66992665036675});
		result.push({ id: "56", num: 8.12990196078431});
		result.push({ id: "57", num: 8.95377128953771});
		result.push({ id: "57", num: 8.67312348668281});
		result.push({ id: "57", num: 8.21323529411765});
		result.push({ id: "57", num: 8.07616707616708});
		result.push({ id: "57", num: 8.20975609756097});
		result.push({ id: "57", num: 8.3838630806846});
		result.push({ id: "57", num: 8.35121951219512});
		result.push({ id: "57", num: 8.11678832116788});
		result.push({ id: "57", num: 7.03439803439803});
		result.push({ id: "57", num: 7.50492610837438});
		result.push({ id: "57", num: 8.05185185185185});
		result.push({ id: "57", num: 7.66666666666667});
		result.push({ id: "57", num: 7.36138613861386});
		result.push({ id: "57", num: 8.12439024390244});
		result.push({ id: "57", num: 7.93827160493827});
		result.push({ id: "57", num: 7.38292682926829});
		result.push({ id: "57", num: 7.65217391304348});
		result.push({ id: "57", num: 7.45985401459854});
		result.push({ id: "57", num: 7.80288461538461});
		result.push({ id: "57", num: 7.78450363196126});
		result.push({ id: "57", num: 7.68765133171913});
		result.push({ id: "57", num: 8.18181818181818});
		result.push({ id: "57", num: 8.19070904645477});
		result.push({ id: "57", num: 7.92909535452323});
		result.push({ id: "58", num: 8.44852941176471});
		result.push({ id: "58", num: 8.00977995110024});
		result.push({ id: "58", num: 6.3019801980198});
		result.push({ id: "58", num: 5.66997518610422});
		result.push({ id: "58", num: 5.39705882352941});
		result.push({ id: "58", num: 5.77530864197531});
		result.push({ id: "58", num: 6.00246913580247});
		result.push({ id: "58", num: 6.12068965517241});
		result.push({ id: "58", num: 6.87654320987654});
		result.push({ id: "58", num: 7.57320099255583});
		result.push({ id: "58", num: 7.59506172839506});
		result.push({ id: "58", num: 7.28888888888889});
		result.push({ id: "58", num: 7.00990099009901});
		result.push({ id: "58", num: 6.92909535452323});
		result.push({ id: "58", num: 7.3980343980344});
		result.push({ id: "58", num: 7.2043795620438});
		result.push({ id: "58", num: 7.09879518072289});
		result.push({ id: "58", num: 6.87135922330097});
		result.push({ id: "58", num: 6.26682692307692});
		result.push({ id: "58", num: 6.39077669902913});
		result.push({ id: "58", num: 7.04842615012106});
		result.push({ id: "58", num: 7.2512315270936});
		result.push({ id: "58", num: 7.60880195599022});
		result.push({ id: "58", num: 7.62591687041565});
		result.push({ id: "59", num: 3.8968058968059});
		result.push({ id: "59", num: 3.31784841075795});
		result.push({ id: "59", num: 2.5283950617284});
		result.push({ id: "59", num: 2.27543424317618});
		result.push({ id: "59", num: 2.15403422982885});
		result.push({ id: "59", num: 2.30864197530864});
		result.push({ id: "59", num: 2.48019801980198});
		result.push({ id: "59", num: 3.35802469135802});
		result.push({ id: "59", num: 5.29382716049383});
		result.push({ id: "59", num: 8.21641791044776});
		result.push({ id: "59", num: 8.985});
		result.push({ id: "59", num: 8.55112219451372});
		result.push({ id: "59", num: 7.49009900990099});
		result.push({ id: "59", num: 6.84275184275184});
		result.push({ id: "59", num: 8.1592039800995});
		result.push({ id: "59", num: 7.94840294840295});
		result.push({ id: "59", num: 7.01703163017032});
		result.push({ id: "59", num: 4.49264705882353});
		result.push({ id: "59", num: 3.37346437346437});
		result.push({ id: "59", num: 3.49753694581281});
		result.push({ id: "59", num: 3.61786600496278});
		result.push({ id: "59", num: 3.60453400503778});
		result.push({ id: "59", num: 3.8428927680798});
		result.push({ id: "59", num: 4.10526315789474});
		result.push({ id: "60", num: 3.03406326034063});
		result.push({ id: "60", num: 2.48426150121065});
		result.push({ id: "60", num: 1.60880195599022});
		result.push({ id: "60", num: 1.14496314496314});
		result.push({ id: "60", num: 0.973300970873786});
		result.push({ id: "60", num: 0.990220048899755});
		result.push({ id: "60", num: 1.03649635036496});
		result.push({ id: "60", num: 1.64963503649635});
		result.push({ id: "60", num: 3.31372549019608});
		result.push({ id: "60", num: 7.85960591133005});
		result.push({ id: "60", num: 9.14108910891089});
		result.push({ id: "60", num: 9.64356435643564});
		result.push({ id: "60", num: 9.46551724137931});
		result.push({ id: "60", num: 8.50245098039216});
		result.push({ id: "60", num: 9.06965174129353});
		result.push({ id: "60", num: 9.22413793103448});
		result.push({ id: "60", num: 8.87317073170732});
		result.push({ id: "60", num: 6.76283618581907});
		result.push({ id: "60", num: 4.49514563106796});
		result.push({ id: "60", num: 3.91951219512195});
		result.push({ id: "60", num: 3.98058252427184});
		result.push({ id: "60", num: 4.11056511056511});
		result.push({ id: "60", num: 4.15196078431373});
		result.push({ id: "60", num: 3.82885085574572});
		result.push({ id: "61", num: 9.71111111111111});
		result.push({ id: "61", num: 9.46699266503667});
		result.push({ id: "61", num: 9.32673267326733});
		result.push({ id: "61", num: 9.24565756823821});
		result.push({ id: "61", num: 9.31862745098039});
		result.push({ id: "61", num: 9.40740740740741});
		result.push({ id: "61", num: 9.37931034482759});
		result.push({ id: "61", num: 9.18965517241379});
		result.push({ id: "61", num: 8.51724137931035});
		result.push({ id: "61", num: 7.80597014925373});
		result.push({ id: "61", num: 7.44776119402985});
		result.push({ id: "61", num: 6.72098765432099});
		result.push({ id: "61", num: 6.29382716049383});
		result.push({ id: "61", num: 6.47432762836186});
		result.push({ id: "61", num: 6.1871921182266});
		result.push({ id: "61", num: 5.71776155717762});
		result.push({ id: "61", num: 5.48433734939759});
		result.push({ id: "61", num: 5.78450363196126});
		result.push({ id: "61", num: 6.54457831325301});
		result.push({ id: "61", num: 7.64164648910412});
		result.push({ id: "61", num: 8.27845036319613});
		result.push({ id: "61", num: 8.55773955773956});
		result.push({ id: "61", num: 8.66259168704156});
		result.push({ id: "61", num: 8.27383863080685});
		result.push({ id: "62", num: 12.7926829268293});
		result.push({ id: "62", num: 12.9927184466019});
		result.push({ id: "62", num: 13.2586206896552});
		result.push({ id: "62", num: 13.6782178217822});
		result.push({ id: "62", num: 13.9878640776699});
		result.push({ id: "62", num: 14.2469437652812});
		result.push({ id: "62", num: 14.3560975609756});
		result.push({ id: "62", num: 13.8394160583942});
		result.push({ id: "62", num: 12.7121951219512});
		result.push({ id: "62", num: 12.1724137931034});
		result.push({ id: "62", num: 11.479012345679});
		result.push({ id: "62", num: 11.0888888888889});
		result.push({ id: "62", num: 10.9117647058824});
		result.push({ id: "62", num: 10.8077858880779});
		result.push({ id: "62", num: 10.3481481481481});
		result.push({ id: "62", num: 10.2867647058824});
		result.push({ id: "62", num: 10.0410628019324});
		result.push({ id: "62", num: 10.301703163017});
		result.push({ id: "62", num: 11.0917874396135});
		result.push({ id: "62", num: 11.5338164251208});
		result.push({ id: "62", num: 11.8474576271186});
		result.push({ id: "62", num: 11.958230958231});
		result.push({ id: "62", num: 11.9336609336609});
		result.push({ id: "62", num: 11.9853300733496});
		result.push({ id: "64", num: 11.8691358024691});
		result.push({ id: "64", num: 12.0929095354523});
		result.push({ id: "64", num: 12.3168316831683});
		result.push({ id: "64", num: 12.5856079404466});
		result.push({ id: "64", num: 12.8014705882353});
		result.push({ id: "64", num: 12.962962962963});
		result.push({ id: "64", num: 12.8694581280788});
		result.push({ id: "64", num: 12.4176904176904});
		result.push({ id: "64", num: 11.320197044335});
		result.push({ id: "64", num: 9.32338308457711});
		result.push({ id: "64", num: 8.83790523690773});
		result.push({ id: "64", num: 8.42643391521197});
		result.push({ id: "64", num: 7.9175});
		result.push({ id: "64", num: 7.87407407407407});
		result.push({ id: "64", num: 7.64089775561097});
		result.push({ id: "64", num: 7.51477832512315});
		result.push({ id: "64", num: 7.54054054054054});
		result.push({ id: "64", num: 8.17037037037037});
		result.push({ id: "64", num: 9.50490196078431});
		result.push({ id: "64", num: 10.5394088669951});
		result.push({ id: "64", num: 10.7407407407407});
		result.push({ id: "64", num: 10.6065162907268});
		result.push({ id: "64", num: 10.6334164588529});
		result.push({ id: "64", num: 10.7431421446384});
		result.push({ id: "65", num: 27.2457420924574});
		result.push({ id: "65", num: 27.2106537530266});
		result.push({ id: "65", num: 26.7248157248157});
		result.push({ id: "65", num: 26.6535626535627});
		result.push({ id: "65", num: 27.1359223300971});
		result.push({ id: "65", num: 27.4841075794621});
		result.push({ id: "65", num: 26.1707317073171});
		result.push({ id: "65", num: 24.8102189781022});
		result.push({ id: "65", num: 21.9536585365854});
		result.push({ id: "65", num: 19.883950617284});
		result.push({ id: "65", num: 18.4356435643564});
		result.push({ id: "65", num: 17.1439205955335});
		result.push({ id: "65", num: 16.7925925925926});
		result.push({ id: "65", num: 16.6268292682927});
		result.push({ id: "65", num: 16.5872235872236});
		result.push({ id: "65", num: 15.8731707317073});
		result.push({ id: "65", num: 16.2939759036145});
		result.push({ id: "65", num: 18.680387409201});
		result.push({ id: "65", num: 21.4806763285024});
		result.push({ id: "65", num: 23.6932367149758});
		result.push({ id: "65", num: 24.7602905569007});
		result.push({ id: "65", num: 24.6034482758621});
		result.push({ id: "65", num: 23.9315403422983});
		result.push({ id: "65", num: 23.3691931540342});
		result.push({ id: "66", num: 6.37745098039216});
		result.push({ id: "66", num: 6.30317848410758});
		result.push({ id: "66", num: 6.30617283950617});
		result.push({ id: "66", num: 6.35483870967742});
		result.push({ id: "66", num: 6.46813725490196});
		result.push({ id: "66", num: 6.67901234567901});
		result.push({ id: "66", num: 6.77777777777778});
		result.push({ id: "66", num: 6.66339066339066});
		result.push({ id: "66", num: 6.94581280788177});
		result.push({ id: "66", num: 8.25870646766169});
		result.push({ id: "66", num: 8.75810473815461});
		result.push({ id: "66", num: 8.45885286783042});
		result.push({ id: "66", num: 7.95238095238095});
		result.push({ id: "66", num: 7.26666666666667});
		result.push({ id: "66", num: 7.33084577114428});
		result.push({ id: "66", num: 6.92059553349876});
		result.push({ id: "66", num: 6.7956204379562});
		result.push({ id: "66", num: 6.32843137254902});
		result.push({ id: "66", num: 6.14320388349515});
		result.push({ id: "66", num: 6.76585365853659});
		result.push({ id: "66", num: 7.37897310513447});
		result.push({ id: "66", num: 7.24317617866005});
		result.push({ id: "66", num: 6.99753086419753});
		result.push({ id: "66", num: 6.5679012345679});
		result.push({ id: "67", num: 11.8641025641026});
		result.push({ id: "67", num: 12.4274809160305});
		result.push({ id: "67", num: 12.9408740359897});
		result.push({ id: "67", num: 13.3565891472868});
		result.push({ id: "67", num: 13.7091836734694});
		result.push({ id: "67", num: 13.9228791773779});
		result.push({ id: "67", num: 13.7435897435897});
		result.push({ id: "67", num: 12.9872122762148});
		result.push({ id: "67", num: 12.3461538461538});
		result.push({ id: "67", num: 12.2051948051948});
		result.push({ id: "67", num: 11.5544041450777});
		result.push({ id: "67", num: 11.3213367609254});
		result.push({ id: "67", num: 10.9329896907216});
		result.push({ id: "67", num: 10.6269035532995});
		result.push({ id: "67", num: 10.7474226804124});
		result.push({ id: "67", num: 10.2046035805627});
		result.push({ id: "67", num: 9.83502538071066});
		result.push({ id: "67", num: 10.0205655526992});
		result.push({ id: "67", num: 10.9538461538462});
		result.push({ id: "67", num: 11.8994845360825});
		result.push({ id: "67", num: 12.0935064935065});
		result.push({ id: "67", num: 12.0396825396825});
		result.push({ id: "67", num: 11.8815789473684});
		result.push({ id: "67", num: 11.9710526315789});
		result.push({ id: "68", num: 9.88321167883212});
		result.push({ id: "68", num: 10.1646489104116});
		result.push({ id: "68", num: 9.69117647058824});
		result.push({ id: "68", num: 10.4103194103194});
		result.push({ id: "68", num: 11.0655339805825});
		result.push({ id: "68", num: 11.6259168704156});
		result.push({ id: "68", num: 11.8219512195122});
		result.push({ id: "68", num: 11.3990267639903});
		result.push({ id: "68", num: 10.7609756097561});
		result.push({ id: "68", num: 9.67980295566502});
		result.push({ id: "68", num: 8.87128712871287});
		result.push({ id: "68", num: 8.47642679900744});
		result.push({ id: "68", num: 8.06203473945409});
		result.push({ id: "68", num: 8.17114914425428});
		result.push({ id: "68", num: 8.06388206388206});
		result.push({ id: "68", num: 7.2360097323601});
		result.push({ id: "68", num: 6.94698795180723});
		result.push({ id: "68", num: 7.57142857142857});
		result.push({ id: "68", num: 8.8});
		result.push({ id: "68", num: 9.92753623188406});
		result.push({ id: "68", num: 10.0048426150121});
		result.push({ id: "68", num: 9.27586206896552});
		result.push({ id: "68", num: 8.65770171149144});
		result.push({ id: "68", num: 8.47058823529412});
		result.push({ id: "69", num: 10.6034063260341});
		result.push({ id: "69", num: 10.9661016949153});
		result.push({ id: "69", num: 11.2762836185819});
		result.push({ id: "69", num: 11.6240786240786});
		result.push({ id: "69", num: 11.8252427184466});
		result.push({ id: "69", num: 11.8777506112469});
		result.push({ id: "69", num: 11.7579462102689});
		result.push({ id: "69", num: 11.5279805352798});
		result.push({ id: "69", num: 10.5975609756098});
		result.push({ id: "69", num: 9.08620689655172});
		result.push({ id: "69", num: 8.47407407407407});
		result.push({ id: "69", num: 8.0074812967581});
		result.push({ id: "69", num: 8.01980198019802});
		result.push({ id: "69", num: 8.10487804878049});
		result.push({ id: "69", num: 7.60837438423645});
		result.push({ id: "69", num: 7.60487804878049});
		result.push({ id: "69", num: 7.60290556900726});
		result.push({ id: "69", num: 8.28571428571429});
		result.push({ id: "69", num: 8.83894230769231});
		result.push({ id: "69", num: 8.94673123486683});
		result.push({ id: "69", num: 9.11138014527845});
		result.push({ id: "69", num: 9.02955665024631});
		result.push({ id: "69", num: 8.92137592137592});
		result.push({ id: "69", num: 9.21271393643032});
		result.push({ id: "98", num: 7.50366748166259});
		result.push({ id: "98", num: 7.48543689320388});
		result.push({ id: "98", num: 6.33823529411765});
		result.push({ id: "98", num: 5.53940886699507});
		result.push({ id: "98", num: 3.93446601941748});
		result.push({ id: "98", num: 3.53545232273839});
		result.push({ id: "98", num: 3.64146341463415});
		result.push({ id: "98", num: 4.20975609756098});
		result.push({ id: "98", num: 4.61951219512195});
		result.push({ id: "98", num: 6.71464019851117});
		result.push({ id: "98", num: 7.63});
		result.push({ id: "98", num: 8.0250626566416});
		result.push({ id: "98", num: 7.945});
		result.push({ id: "98", num: 7.59305210918114});
		result.push({ id: "98", num: 8.14861460957179});
		result.push({ id: "98", num: 8.86318407960199});
		result.push({ id: "98", num: 8.4320987654321});
		result.push({ id: "98", num: 8.02457002457002});
		result.push({ id: "98", num: 7.51833740831296});
		result.push({ id: "98", num: 7.27073170731707});
		result.push({ id: "98", num: 7.24938875305623});
		result.push({ id: "98", num: 7.34335839598998});
		result.push({ id: "98", num: 7.69975186104218});
		result.push({ id: "98", num: 7.89356435643564});
		result.push({ id: "99", num: 8.91240875912409});
		result.push({ id: "99", num: 8.93689320388349});
		result.push({ id: "99", num: 8.28746928746929});
		result.push({ id: "99", num: 8.06142506142506});
		result.push({ id: "99", num: 7.32038834951456});
		result.push({ id: "99", num: 7.44254278728606});
		result.push({ id: "99", num: 7.68048780487805});
		result.push({ id: "99", num: 7.95377128953771});
		result.push({ id: "99", num: 8.45833333333333});
		result.push({ id: "99", num: 10.6896551724138});
		result.push({ id: "99", num: 12.7185185185185});
		result.push({ id: "99", num: 12.8765432098765});
		result.push({ id: "99", num: 12.5594059405941});
		result.push({ id: "99", num: 12.3832923832924});
		result.push({ id: "99", num: 12.7076167076167});
		result.push({ id: "99", num: 12.2738386308068});
		result.push({ id: "99", num: 11.9566265060241});
		result.push({ id: "99", num: 11.0533980582524});
		result.push({ id: "99", num: 9.67710843373494});
		result.push({ id: "99", num: 8.10628019323672});
		result.push({ id: "99", num: 8.01941747572815});
		result.push({ id: "99", num: 7.92118226600985});
		result.push({ id: "99", num: 8.33088235294118});
		result.push({ id: "99", num: 8.66911764705882});
		result.push({ id: "100", num: 10.6432291666667});
		result.push({ id: "100", num: 10.4175257731959});
		result.push({ id: "100", num: 9.015625});
		result.push({ id: "100", num: 8.45549738219895});
		result.push({ id: "100", num: 7.27720207253886});
		result.push({ id: "100", num: 7.74015748031496});
		result.push({ id: "100", num: 8.139896373057});
		result.push({ id: "100", num: 8.33670886075949});
		result.push({ id: "100", num: 9.03299492385787});
		result.push({ id: "100", num: 10.3705583756345});
		result.push({ id: "100", num: 10.6412213740458});
		result.push({ id: "100", num: 10.5923076923077});
		result.push({ id: "100", num: 10.9338422391858});
		result.push({ id: "100", num: 11.6315789473684});
		result.push({ id: "100", num: 12.5583756345178});
		result.push({ id: "100", num: 12.6307692307692});
		result.push({ id: "100", num: 12.7055837563452});
		result.push({ id: "100", num: 12.5575447570332});
		result.push({ id: "100", num: 11.6691919191919});
		result.push({ id: "100", num: 9.98721227621483});
		result.push({ id: "100", num: 9.58673469387755});
		result.push({ id: "100", num: 9.49100257069409});
		result.push({ id: "100", num: 9.39588688946015});
		result.push({ id: "100", num: 9.26546391752577});
		result.push({ id: "101", num: 9.3970223325062});
		result.push({ id: "101", num: 7.25925925925926});
		result.push({ id: "101", num: 4.18204488778055});
		result.push({ id: "101", num: 2.54135338345865});
		result.push({ id: "101", num: 2.19259259259259});
		result.push({ id: "101", num: 2.13715710723192});
		result.push({ id: "101", num: 2.44197530864198});
		result.push({ id: "101", num: 2.71498771498772});
		result.push({ id: "101", num: 3.9679802955665});
		result.push({ id: "101", num: 7.10199004975124});
		result.push({ id: "101", num: 8.38902743142145});
		result.push({ id: "101", num: 8.82920792079208});
		result.push({ id: "101", num: 8.70822942643392});
		result.push({ id: "101", num: 9.18337408312958});
		result.push({ id: "101", num: 10.5945945945946});
		result.push({ id: "101", num: 10.3634146341463});
		result.push({ id: "101", num: 10.3405797101449});
		result.push({ id: "101", num: 9.72397094430993});
		result.push({ id: "101", num: 8.69397590361446});
		result.push({ id: "101", num: 8.34782608695652});
		result.push({ id: "101", num: 9.590799031477});
		result.push({ id: "101", num: 11.9384236453202});
		result.push({ id: "101", num: 12.7432098765432});
		result.push({ id: "101", num: 12.1851851851852});
		result.push({ id: "102", num: 11.4609756097561});
		result.push({ id: "102", num: 7.53883495145631});
		result.push({ id: "102", num: 4.26044226044226});
		result.push({ id: "102", num: 3.32923832923833});
		result.push({ id: "102", num: 3.17031630170316});
		result.push({ id: "102", num: 3.14914425427873});
		result.push({ id: "102", num: 3.47549019607843});
		result.push({ id: "102", num: 4.00243902439024});
		result.push({ id: "102", num: 4.06862745098039});
		result.push({ id: "102", num: 4.05940594059406});
		result.push({ id: "102", num: 5.44638403990025});
		result.push({ id: "102", num: 6.51604938271605});
		result.push({ id: "102", num: 7.11166253101737});
		result.push({ id: "102", num: 9.05159705159705});
		result.push({ id: "102", num: 9.84691358024691});
		result.push({ id: "102", num: 9.32682926829268});
		result.push({ id: "102", num: 9.42995169082126});
		result.push({ id: "102", num: 9.8135593220339});
		result.push({ id: "102", num: 11.1253012048193});
		result.push({ id: "102", num: 11.8019323671498});
		result.push({ id: "102", num: 13.6295399515739});
		result.push({ id: "102", num: 15.935960591133});
		result.push({ id: "102", num: 16.5794621026895});
		result.push({ id: "102", num: 15.3995098039216});
		result.push({ id: "103", num: 13.3187347931873});
		result.push({ id: "103", num: 9.78450363196126});
		result.push({ id: "103", num: 4.05134474327628});
		result.push({ id: "103", num: 2.51105651105651});
		result.push({ id: "103", num: 2.02427184466019});
		result.push({ id: "103", num: 1.96577017114914});
		result.push({ id: "103", num: 2.64878048780488});
		result.push({ id: "103", num: 3.32360097323601});
		result.push({ id: "103", num: 2.71219512195122});
		result.push({ id: "103", num: 1.97290640394089});
		result.push({ id: "103", num: 2.27407407407407});
		result.push({ id: "103", num: 3.06930693069307});
		result.push({ id: "103", num: 4.59653465346535});
		result.push({ id: "103", num: 6.10024449877751});
		result.push({ id: "103", num: 5.66584766584767});
		result.push({ id: "103", num: 5.55717761557178});
		result.push({ id: "103", num: 5.86714975845411});
		result.push({ id: "103", num: 7.40677966101695});
		result.push({ id: "103", num: 8.87710843373494});
		result.push({ id: "103", num: 9.31400966183575});
		result.push({ id: "103", num: 10.6077481840194});
		result.push({ id: "103", num: 12.6576354679803});
		result.push({ id: "103", num: 13.8557457212714});
		result.push({ id: "103", num: 14.078239608802});
		result.push({ id: "104", num: 8.52554744525547});
		result.push({ id: "104", num: 7.93220338983051});
		result.push({ id: "104", num: 5.74572127139364});
		result.push({ id: "104", num: 3.83004926108374});
		result.push({ id: "104", num: 3.20388349514563});
		result.push({ id: "104", num: 3.34718826405868});
		result.push({ id: "104", num: 4.64146341463415});
		result.push({ id: "104", num: 4.95609756097561});
		result.push({ id: "104", num: 6.17073170731707});
		result.push({ id: "104", num: 4.98768472906404});
		result.push({ id: "104", num: 4.37037037037037});
		result.push({ id: "104", num: 3.79259259259259});
		result.push({ id: "104", num: 3.88585607940447});
		result.push({ id: "104", num: 4.34320987654321});
		result.push({ id: "104", num: 4.43424317617866});
		result.push({ id: "104", num: 4.50735294117647});
		result.push({ id: "104", num: 4.61204819277108});
		result.push({ id: "104", num: 4.56174334140436});
		result.push({ id: "104", num: 4.31730769230769});
		result.push({ id: "104", num: 5});
		result.push({ id: "104", num: 5.49394673123487});
		result.push({ id: "104", num: 6.1871921182266});
		result.push({ id: "104", num: 6.91687041564792});
		result.push({ id: "104", num: 7.40342298288509});
		result.push({ id: "105", num: 10.1351351351351});
		result.push({ id: "105", num: 9.48166259168704});
		result.push({ id: "105", num: 6.17866004962779});
		result.push({ id: "105", num: 4.13366336633663});
		result.push({ id: "105", num: 3.48774509803922});
		result.push({ id: "105", num: 3.63950617283951});
		result.push({ id: "105", num: 4.42118226600985});
		result.push({ id: "105", num: 4.37592137592138});
		result.push({ id: "105", num: 4.11822660098522});
		result.push({ id: "105", num: 3.0273631840796});
		result.push({ id: "105", num: 2.51870324189526});
		result.push({ id: "105", num: 2.60349127182045});
		result.push({ id: "105", num: 3.10945273631841});
		result.push({ id: "105", num: 3.30882352941176});
		result.push({ id: "105", num: 3.18918918918919});
		result.push({ id: "105", num: 3.16216216216216});
		result.push({ id: "105", num: 3.33734939759036});
		result.push({ id: "105", num: 3.52784503631961});
		result.push({ id: "105", num: 3.59518072289157});
		result.push({ id: "105", num: 3.86473429951691});
		result.push({ id: "105", num: 4.60774818401937});
		result.push({ id: "105", num: 5.8743842364532});
		result.push({ id: "105", num: 6.38141809290954});
		result.push({ id: "105", num: 7.06112469437653});
		result.push({ id: "121", num: 9.85995085995086});
		result.push({ id: "121", num: 10.3712871287129});
		result.push({ id: "121", num: 10.8891687657431});
		result.push({ id: "121", num: 11.3511450381679});
		result.push({ id: "121", num: 11.495});
		result.push({ id: "121", num: 11.5465994962217});
		result.push({ id: "121", num: 11.0301507537688});
		result.push({ id: "121", num: 10.1228070175439});
		result.push({ id: "121", num: 9.45088161209068});
		result.push({ id: "121", num: 9.73815461346633});
		result.push({ id: "121", num: 9.35061728395062});
		result.push({ id: "121", num: 8.76296296296296});
		result.push({ id: "121", num: 8.50246305418719});
		result.push({ id: "121", num: 8.46715328467153});
		result.push({ id: "121", num: 8.53808353808354});
		result.push({ id: "121", num: 8.32603406326034});
		result.push({ id: "121", num: 8.09397590361446});
		result.push({ id: "121", num: 8.20581113801453});
		result.push({ id: "121", num: 8.44096385542169});
		result.push({ id: "121", num: 8.86231884057971});
		result.push({ id: "121", num: 9.03640776699029});
		result.push({ id: "121", num: 9.34643734643735});
		result.push({ id: "121", num: 9.45721271393643});
		result.push({ id: "121", num: 9.53056234718826});
		result.push({ id: "122", num: 6.51338199513382});
		result.push({ id: "122", num: 7.26941747572816});
		result.push({ id: "122", num: 8.01955990220049});
		result.push({ id: "122", num: 8.88697788697789});
		result.push({ id: "122", num: 9.57281553398058});
		result.push({ id: "122", num: 9.92176039119804});
		result.push({ id: "122", num: 9.94865525672372});
		result.push({ id: "122", num: 9.48418491484185});
		result.push({ id: "122", num: 8.64303178484108});
		result.push({ id: "122", num: 8.13333333333333});
		result.push({ id: "122", num: 7.03456790123457});
		result.push({ id: "122", num: 5.99259259259259});
		result.push({ id: "122", num: 5.38669950738916});
		result.push({ id: "122", num: 5.04156479217604});
		result.push({ id: "122", num: 4.83663366336634});
		result.push({ id: "122", num: 5.03892944038929});
		result.push({ id: "122", num: 5.34457831325301});
		result.push({ id: "122", num: 5.15291262135922});
		result.push({ id: "122", num: 5.30288461538461});
		result.push({ id: "122", num: 5.48792270531401});
		result.push({ id: "122", num: 5.32203389830508});
		result.push({ id: "122", num: 4.63390663390663});
		result.push({ id: "122", num: 4.56968215158924});
		result.push({ id: "122", num: 4.68459657701711});
		result.push({ id: "123", num: 21.8734793187348});
		result.push({ id: "123", num: 19.0799031476998});
		result.push({ id: "123", num: 11.8117359413203});
		result.push({ id: "123", num: 6.8009828009828});
		result.push({ id: "123", num: 5.20631067961165});
		result.push({ id: "123", num: 4.86308068459658});
		result.push({ id: "123", num: 5.48780487804878});
		result.push({ id: "123", num: 6.36739659367397});
		result.push({ id: "123", num: 6.70487804878049});
		result.push({ id: "123", num: 5.93596059113301});
		result.push({ id: "123", num: 7.45185185185185});
		result.push({ id: "123", num: 9.14074074074074});
		result.push({ id: "123", num: 10.7369727047146});
		result.push({ id: "123", num: 11.7677261613692});
		result.push({ id: "123", num: 11.2167487684729});
		result.push({ id: "123", num: 11.1536585365854});
		result.push({ id: "123", num: 11.0531400966184});
		result.push({ id: "123", num: 11.4939467312349});
		result.push({ id: "123", num: 12.1686746987952});
		result.push({ id: "123", num: 14.3236714975845});
		result.push({ id: "123", num: 16.6585956416465});
		result.push({ id: "123", num: 19.7272727272727});
		result.push({ id: "123", num: 21.4156479217604});
		result.push({ id: "123", num: 21.9289215686275});
		result.push({ id: "124", num: 13.9679012345679});
		result.push({ id: "124", num: 13.6185819070905});
		result.push({ id: "124", num: 12.7722772277228});
		result.push({ id: "124", num: 11.5646766169154});
		result.push({ id: "124", num: 10.343137254902});
		result.push({ id: "124", num: 9.07901234567901});
		result.push({ id: "124", num: 9.14851485148515});
		result.push({ id: "124", num: 8.78132678132678});
		result.push({ id: "124", num: 7.56296296296296});
		result.push({ id: "124", num: 7.6318407960199});
		result.push({ id: "124", num: 7.57});
		result.push({ id: "124", num: 7.6825});
		result.push({ id: "124", num: 8.09725685785536});
		result.push({ id: "124", num: 8.40886699507389});
		result.push({ id: "124", num: 8.67487684729064});
		result.push({ id: "124", num: 8.58088235294118});
		result.push({ id: "124", num: 8.66506024096386});
		result.push({ id: "124", num: 9.77966101694915});
		result.push({ id: "124", num: 10.2819277108434});
		result.push({ id: "124", num: 11.3502415458937});
		result.push({ id: "124", num: 11.7578692493947});
		result.push({ id: "124", num: 11.9778325123153});
		result.push({ id: "124", num: 12.4914425427873});
		result.push({ id: "124", num: 12.7970660146699});
		result.push({ id: "125", num: 11.9172749391727});
		result.push({ id: "125", num: 12.6537530266344});
		result.push({ id: "125", num: 14.4841075794621});
		result.push({ id: "125", num: 12.8688118811881});
		result.push({ id: "125", num: 7.08823529411765});
		result.push({ id: "125", num: 3.63703703703704});
		result.push({ id: "125", num: 3.89135802469136});
		result.push({ id: "125", num: 3.91871921182266});
		result.push({ id: "125", num: 3.97044334975369});
		result.push({ id: "125", num: 4.40897755610973});
		result.push({ id: "125", num: 5.15461346633416});
		result.push({ id: "125", num: 6.25436408977556});
		result.push({ id: "125", num: 6.3019801980198});
		result.push({ id: "125", num: 6.52825552825553});
		result.push({ id: "125", num: 6.97766749379653});
		result.push({ id: "125", num: 7.77339901477832});
		result.push({ id: "125", num: 8.21897810218978});
		result.push({ id: "125", num: 9.23227383863081});
		result.push({ id: "125", num: 9.97572815533981});
		result.push({ id: "125", num: 10.3545232273839});
		result.push({ id: "125", num: 10.7359413202934});
		result.push({ id: "125", num: 10.409429280397});
		result.push({ id: "125", num: 10.6098765432099});
		result.push({ id: "125", num: 10.7728395061728});
		result.push({ id: "134", num: 8.49789029535865});
		result.push({ id: "134", num: 8.18987341772152});
		result.push({ id: "134", num: 7.84549356223176});
		result.push({ id: "134", num: 7.5531914893617});
		result.push({ id: "134", num: 7.50210970464135});
		result.push({ id: "134", num: 7.41452991452991});
		result.push({ id: "134", num: 7.31330472103004});
		result.push({ id: "134", num: 6.93191489361702});
		result.push({ id: "134", num: 5.54700854700855});
		result.push({ id: "134", num: 4.01724137931035});
		result.push({ id: "134", num: 3.44444444444444});
		result.push({ id: "134", num: 3.43162393162393});
		result.push({ id: "134", num: 4.29831932773109});
		result.push({ id: "134", num: 4.70292887029289});
		result.push({ id: "134", num: 4.35169491525424});
		result.push({ id: "134", num: 3.82478632478632});
		result.push({ id: "134", num: 3.6652719665272});
		result.push({ id: "134", num: 3.73109243697479});
		result.push({ id: "134", num: 4.1});
		result.push({ id: "134", num: 4.94142259414226});
		result.push({ id: "134", num: 5.20502092050209});
		result.push({ id: "134", num: 5.89029535864979});
		result.push({ id: "134", num: 6.56652360515021});
		result.push({ id: "134", num: 6.8412017167382});
		result.push({ id: "135", num: 10.4064171122995});
		result.push({ id: "135", num: 9.55702917771883});
		result.push({ id: "135", num: 7.83914209115281});
		result.push({ id: "135", num: 6.79784366576819});
		result.push({ id: "135", num: 6.71010638297872});
		result.push({ id: "135", num: 6.40750670241287});
		result.push({ id: "135", num: 6.25268817204301});
		result.push({ id: "135", num: 5.856});
		result.push({ id: "135", num: 4.8048128342246});
		result.push({ id: "135", num: 3.15094339622642});
		result.push({ id: "135", num: 3.07859078590786});
		result.push({ id: "135", num: 3.95121951219512});
		result.push({ id: "135", num: 5.15760869565217});
		result.push({ id: "135", num: 5.81818181818182});
		result.push({ id: "135", num: 5.02949061662198});
		result.push({ id: "135", num: 4.42666666666667});
		result.push({ id: "135", num: 4.11671087533156});
		result.push({ id: "135", num: 4.6763925729443});
		result.push({ id: "135", num: 6.26912928759894});
		result.push({ id: "135", num: 7.85449735449735});
		result.push({ id: "135", num: 8.73809523809524});
		result.push({ id: "135", num: 9.49322493224932});
		result.push({ id: "135", num: 10.0373333333333});
		result.push({ id: "135", num: 9.95174262734584});
		result.push({ id: "136", num: 9.19464720194647});
		result.push({ id: "136", num: 9.6479217603912});
		result.push({ id: "136", num: 9.78465346534654});
		result.push({ id: "136", num: 10.0272952853598});
		result.push({ id: "136", num: 9.64460784313725});
		result.push({ id: "136", num: 9.07901234567901});
		result.push({ id: "136", num: 8.58620689655172});
		result.push({ id: "136", num: 8.20638820638821});
		result.push({ id: "136", num: 7.86945812807882});
		result.push({ id: "136", num: 8.05223880597015});
		result.push({ id: "136", num: 8.49875311720698});
		result.push({ id: "136", num: 8.01995012468828});
		result.push({ id: "136", num: 7.1775});
		result.push({ id: "136", num: 6.38461538461539});
		result.push({ id: "136", num: 6.70223325062035});
		result.push({ id: "136", num: 6.6977886977887});
		result.push({ id: "136", num: 6.24817518248175});
		result.push({ id: "136", num: 6.3838630806846});
		result.push({ id: "136", num: 7.1747572815534});
		result.push({ id: "136", num: 7.9294403892944});
		result.push({ id: "136", num: 8.14914425427873});
		result.push({ id: "136", num: 8.1865671641791});
		result.push({ id: "136", num: 8.39303482587065});
		result.push({ id: "136", num: 8.51358024691358});
		result.push({ id: "25", num: 9.19464720194647});
		result.push({ id: "25", num: 9.6479217603912});
		result.push({ id: "25", num: 9.78465346534654});
		result.push({ id: "25", num: 10.0272952853598});
		result.push({ id: "25", num: 9.64460784313725});
		result.push({ id: "25", num: 9.07901234567901});
		result.push({ id: "25", num: 8.58620689655172});
		result.push({ id: "25", num: 8.20638820638821});
		result.push({ id: "25", num: 7.86945812807882});
		result.push({ id: "25", num: 8.05223880597015});
		result.push({ id: "25", num: 8.49875311720698});
		result.push({ id: "25", num: 8.01995012468828});
		result.push({ id: "25", num: 7.1775});
		result.push({ id: "25", num: 6.38461538461539});
		result.push({ id: "25", num: 6.70223325062035});
		result.push({ id: "25", num: 6.6977886977887});
		result.push({ id: "25", num: 6.24817518248175});
		result.push({ id: "25", num: 6.3838630806846});
		result.push({ id: "25", num: 7.1747572815534});
		result.push({ id: "25", num: 7.9294403892944});
		result.push({ id: "25", num: 8.14914425427873});
		result.push({ id: "25", num: 8.1865671641791});
		result.push({ id: "25", num: 8.39303482587065});
		result.push({ id: "25", num: 8.51358024691358});
		result.push({ id: "28", num: 9.19464720194647});
		result.push({ id: "28", num: 9.6479217603912});
		result.push({ id: "28", num: 9.78465346534654});
		result.push({ id: "28", num: 10.0272952853598});
		result.push({ id: "28", num: 9.64460784313725});
		result.push({ id: "28", num: 9.07901234567901});
		result.push({ id: "28", num: 8.58620689655172});
		result.push({ id: "28", num: 8.20638820638821});
		result.push({ id: "28", num: 7.86945812807882});
		result.push({ id: "28", num: 8.05223880597015});
		result.push({ id: "28", num: 8.49875311720698});
		result.push({ id: "28", num: 8.01995012468828});
		result.push({ id: "28", num: 7.1775});
		result.push({ id: "28", num: 6.38461538461539});
		result.push({ id: "28", num: 6.70223325062035});
		result.push({ id: "28", num: 6.6977886977887});
		result.push({ id: "28", num: 6.24817518248175});
		result.push({ id: "28", num: 6.3838630806846});
		result.push({ id: "28", num: 7.1747572815534});
		result.push({ id: "28", num: 7.9294403892944});
		result.push({ id: "28", num: 8.14914425427873});
		result.push({ id: "28", num: 8.1865671641791});
		result.push({ id: "28", num: 8.39303482587065});
		result.push({ id: "28", num: 8.51358024691358});
		result.push({ id: "63", num: 9.19464720194647});
		result.push({ id: "63", num: 9.6479217603912});
		result.push({ id: "63", num: 9.78465346534654});
		result.push({ id: "63", num: 10.0272952853598});
		result.push({ id: "63", num: 9.64460784313725});
		result.push({ id: "63", num: 9.07901234567901});
		result.push({ id: "63", num: 8.58620689655172});
		result.push({ id: "63", num: 8.20638820638821});
		result.push({ id: "63", num: 7.86945812807882});
		result.push({ id: "63", num: 8.05223880597015});
		result.push({ id: "63", num: 8.49875311720698});
		result.push({ id: "63", num: 8.01995012468828});
		result.push({ id: "63", num: 7.1775});
		result.push({ id: "63", num: 6.38461538461539});
		result.push({ id: "63", num: 6.70223325062035});
		result.push({ id: "63", num: 6.6977886977887});
		result.push({ id: "63", num: 6.24817518248175});
		result.push({ id: "63", num: 6.3838630806846});
		result.push({ id: "63", num: 7.1747572815534});
		result.push({ id: "63", num: 7.9294403892944});
		result.push({ id: "63", num: 8.14914425427873});
		result.push({ id: "63", num: 8.1865671641791});
		result.push({ id: "63", num: 8.39303482587065});
		result.push({ id: "63", num: 8.51358024691358});
		result.push({ id: "72", num: 9.19464720194647});
		result.push({ id: "72", num: 9.6479217603912});
		result.push({ id: "72", num: 9.78465346534654});
		result.push({ id: "72", num: 10.0272952853598});
		result.push({ id: "72", num: 9.64460784313725});
		result.push({ id: "72", num: 9.07901234567901});
		result.push({ id: "72", num: 8.58620689655172});
		result.push({ id: "72", num: 8.20638820638821});
		result.push({ id: "72", num: 7.86945812807882});
		result.push({ id: "72", num: 8.05223880597015});
		result.push({ id: "72", num: 8.49875311720698});
		result.push({ id: "72", num: 8.01995012468828});
		result.push({ id: "72", num: 7.1775});
		result.push({ id: "72", num: 6.38461538461539});
		result.push({ id: "72", num: 6.70223325062035});
		result.push({ id: "72", num: 6.6977886977887});
		result.push({ id: "72", num: 6.24817518248175});
		result.push({ id: "72", num: 6.3838630806846});
		result.push({ id: "72", num: 7.1747572815534});
		result.push({ id: "72", num: 7.9294403892944});
		result.push({ id: "72", num: 8.14914425427873});
		result.push({ id: "72", num: 8.1865671641791});
		result.push({ id: "72", num: 8.39303482587065});
		result.push({ id: "72", num: 8.51358024691358});
		result.push({ id: "106", num: 9.19464720194647});
		result.push({ id: "106", num: 9.6479217603912});
		result.push({ id: "106", num: 9.78465346534654});
		result.push({ id: "106", num: 10.0272952853598});
		result.push({ id: "106", num: 9.64460784313725});
		result.push({ id: "106", num: 9.07901234567901});
		result.push({ id: "106", num: 8.58620689655172});
		result.push({ id: "106", num: 8.20638820638821});
		result.push({ id: "106", num: 7.86945812807882});
		result.push({ id: "106", num: 8.05223880597015});
		result.push({ id: "106", num: 8.49875311720698});
		result.push({ id: "106", num: 8.01995012468828});
		result.push({ id: "106", num: 7.1775});
		result.push({ id: "106", num: 6.38461538461539});
		result.push({ id: "106", num: 6.70223325062035});
		result.push({ id: "106", num: 6.6977886977887});
		result.push({ id: "106", num: 6.24817518248175});
		result.push({ id: "106", num: 6.3838630806846});
		result.push({ id: "106", num: 7.1747572815534});
		result.push({ id: "106", num: 7.9294403892944});
		result.push({ id: "106", num: 8.14914425427873});
		result.push({ id: "106", num: 8.1865671641791});
		result.push({ id: "106", num: 8.39303482587065});
		result.push({ id: "106", num: 8.51358024691358});
		result.push({ id: "133", num: 9.19464720194647});
		result.push({ id: "133", num: 9.6479217603912});
		result.push({ id: "133", num: 9.78465346534654});
		result.push({ id: "133", num: 10.0272952853598});
		result.push({ id: "133", num: 9.64460784313725});
		result.push({ id: "133", num: 9.07901234567901});
		result.push({ id: "133", num: 8.58620689655172});
		result.push({ id: "133", num: 8.20638820638821});
		result.push({ id: "133", num: 7.86945812807882});
		result.push({ id: "133", num: 8.05223880597015});
		result.push({ id: "133", num: 8.49875311720698});
		result.push({ id: "133", num: 8.01995012468828});
		result.push({ id: "133", num: 7.1775});
		result.push({ id: "133", num: 6.38461538461539});
		result.push({ id: "133", num: 6.70223325062035});
		result.push({ id: "133", num: 6.6977886977887});
		result.push({ id: "133", num: 6.24817518248175});
		result.push({ id: "133", num: 6.3838630806846});
		result.push({ id: "133", num: 7.1747572815534});
		result.push({ id: "133", num: 7.9294403892944});
		result.push({ id: "133", num: 8.14914425427873});
		result.push({ id: "133", num: 8.1865671641791});
		result.push({ id: "133", num: 8.39303482587065});
		result.push({ id: "133", num: 8.51358024691358});
		return result;
	};
	com.tamina.bikewar.data.Mock.getStationsVO = function () {
		var result = new Array();
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("1", "Mériadeck", "20", "44.83803", "-0.58437", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("2", "Saint Bruno", "20", "44.83784", "-0.59028", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("3", "Place Tartas", "18", "44.84088", "-0.59104", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("4", "Saint Seurin", "20", "44.84221", "-0.58482", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("5", "Place Gambetta", "20", "44.84150", "-0.58080", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("6", "Square André Lhote", "20", "44.83779", "-0.58166", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("7", "Palais de Justice", "18", "44.83594", "-0.58211", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("8", "Patinoire", "20", "44.83436", "-0.58825", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("9", "Gaviniès", "20", "44.83303", "-0.59289", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("10", "Stade Chaban Delmas", "22", "44.83176", "-0.59868", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("11", "Cité Administrative", "20", "44.84166", "-0.59970", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("12", "Grand Lebrun", "16", "44.85115", "-0.60861", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("13", "Barrière Saint Médard", "20", "44.84837", "-0.59810", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("14", "Dubreuil-Turenne", "14", "44.84819", "-0.59197", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("15", "rue de la Croix Blanche", "14", "44.84521", "-0.59206", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("16", "Galin", "18", "44.84947", "-0.54525", "Vcub", "FAUX", "2", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("17", "Palais Gallien", "14", "44.84690", "-0.58219", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("18", "Huguerie", "14", "44.84423", "-0.58164", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("19", "Place Tourny", "20", "44.84465", "-0.57745", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("20", "Place des Grands Hommes", "20", "44.84314", "-0.57724", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("21", "Place Puy Paulin", "15", "44.84122", "-0.57560", "Vcub", "FAUX", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("22", "Hotel de Ville", "33", "44.83826", "-0.57648", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("23", "République", "20", "44.83483", "-0.58019", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("24", "Libération", "16", "44.83325", "-0.58308", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("25", "Rue François de Sourdis", "14", "44.83100", "-0.58734", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("26", "Xaintrailles", "16", "44.82797", "-0.59349", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("27", "Université Bordeaux II", "20", "44.82654", "-0.60184", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("28", "Pellegrin", "20", "44.82986", "-0.60351", "Vcub", "VRAI", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("29", "Saint Augustin", "20", "44.83251", "-0.61047", "Vcub", "VRAI", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("30", "La Glaciere Mondésir", "18", "44.83838", "-0.61689", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("31", "Caudéran", "16", "44.85175", "-0.61438", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("32", "Parc Bordelais", "16", "44.85261", "-0.59923", "Vcub", "VRAI", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("33", "Barrière du Médoc", "18", "44.85343", "-0.59264", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("34", "Tivoli", "14", "44.85379", "-0.58864", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("35", "Place Marie Brizard", "16", "44.85005", "-0.58547", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("36", "Place de Longchamps", "18", "44.85005", "-0.58200", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("37", "Jardin Public", "20", "44.84849", "-0.57581", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("38", "Place Charles Gruet", "16", "44.84641", "-0.58020", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("39", "Quinconces", "40", "44.84423", "-0.57434", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("40", "Grand Théâtre", "20", "44.84293", "-0.57390", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("41", "Place Saint Projet", "18", "44.83889", "-0.57466", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("42", "Place Camille Jullian", "20", "44.83924", "-0.57203", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("43", "Saint Paul", "18", "44.83707", "-0.57279", "Vcub", "FAUX", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("44", "Musée d Aquitaine", "20", "44.83606", "-0.57544", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("45", "Place Sainte Eulalie", "20", "44.83312", "-0.57695", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("46", "Belcier", "21", "44.82278", "-0.55296", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("47", "Magendie", "16", "44.82789", "-0.58605", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("48", "Barrière de Pessac", "18", "44.82578", "-0.58975", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("49", "Le Bouscat Mairie", "18", "44.86329", "-0.59995", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("50", "Mandron Godard", "14", "44.85999", "-0.58876", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("51", "Place Ampère", "20", "44.86260", "-0.58328", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("52", "Place de l Europe", "18", "44.85890", "-0.58108", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("53", "Parc Rivière", "14", "44.85417", "-0.58659", "Vcub", "FAUX", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("54", "Rue St Vincent de Paul", "22", "44.82642", "-0.55732", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("55", "Camille Godard", "16", "44.85462", "-0.57435", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("56", "Place Paul Doumer", "20", "44.85171", "-0.57427", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("57", "Eglise Saint-Louis", "16", "44.85155", "-0.57163", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("58", "Chartrons", "18", "44.85321", "-0.56727", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("59", "CAPC", "18", "44.84978", "-0.57024", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("60", "Allées de Chartres", "20", "44.84718", "-0.57131", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("61", "Parc aux Angéliques", "16", "44.84625", "-0.56495", "Vcub", "VRAI", "2", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("62", "Cenon Gare", "18", "44.85614", "-0.53364", "Vcub+", "FAUX", "3", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("63", "François Mitterrand", "18", "44.83028", "-0.52697", "Vcub+", "FAUX", "3", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("64", "La Benauge", "18", "44.83960", "-0.55645", "Vcub", "VRAI", "2", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("65", "Stalingrad", "41", "44.84034", "-0.55955", "Vcub", "VRAI", "1", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("66", "Gare d Orléans", "20", "44.84114", "-0.56224", "Vcub", "VRAI", "1", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("67", "Allée de Serr - Abadie", "18", "44.84377", "-0.55751", "Vcub", "FAUX", "2", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("68", "Thiers Jardin Botanique", "18", "44.84298", "-0.55573", "Vcub", "VRAI", "3", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("69", "Cours Le Rouzic", "14", "44.84300", "-0.55033", "Vcub", "FAUX", "2", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("70", "Buttinière", "20", "44.86428", "-0.52420", "Vcub+", "FAUX", "3", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("71", "La Gardette", "18", "44.88750", "-0.51763", "Vcub+", "FAUX", "3", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("72", "Jean Zay", "24", "44.85418", "-0.51282", "Vcub+", "FAUX", "3", "VRAI"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("73", "Terres Neuves", "21", "44.81535", "-0.55115", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("74", "Place du 14 Juillet", "22", "44.80770", "-0.54821", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("75", "Ferdinand Buisson", "18", "44.80329", "-0.55774", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("76", "Pont de la Maye", "21", "44.78215", "-0.56616", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("77", "Place Bernard Roumegoux", "20", "44.77353", "-0.61432", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("78", "Bougnard", "20", "44.79387", "-0.63530", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("79", "Pessac Bersol", "20", "44.78620", "-0.63874", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("80", "Gare Alouette", "18", "44.79329", "-0.65926", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("81", "L. Morin Cazalet", "18", "44.79588", "-0.66733", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("82", "La Châtaigneraie", "18", "44.79326", "-0.64731", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("83", "Pessac Centre", "21", "44.80446", "-0.63267", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("84", "Le Burck", "18", "44.81535", "-0.63444", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("85", "Mérignac Quatre Chemins", "18", "44.83242", "-0.64594", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("86", "Mérignac Soleil", "20", "44.83256", "-0.65698", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("87", "Kennedy Parc Hotelier", "20", "44.83628", "-0.68713", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("88", "Mérignac Capeyron", "18", "44.85097", "-0.64475", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("89", "Mérignac Centre", "21", "44.84105", "-0.64707", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("90", "Fontaine d Arlac", "18", "44.82650", "-0.62577", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("91", "Mairie du Haillan", "16", "44.87369", "-0.67753", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("92", "St Médard Place de la République", "16", "44.89530", "-0.71467", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("93", "Eysines Centre", "16", "44.88396", "-0.64992", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("94", "Gare de Blanquefort", "18", "44.91730", "-0.62382", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("95", "Bruges Hôtel de Ville", "16", "44.88145", "-0.61337", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("96", "Les Aubiers", "26", "44.87389", "-0.57401", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("97", "Claveau", "20", "44.87738", "-0.54433", "Vcub+", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("98", "Bassins à Flot", "18", "44.86007", "-0.55447", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("99", "Les Hangars", "20", "44.85787", "-0.55808", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("100", "Cours du Médoc", "20", "44.85560", "-0.56319", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("101", "Place Jean Jaurès", "20", "44.84295", "-0.57037", "Vcub", "FAUX", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("102", "Place de la Bourse", "20", "44.84030", "-0.56914", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("103", "Place du Palais", "20", "44.83779", "-0.57034", "Vcub", "FAUX", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("104", "Grosse Cloche", "17", "44.83518", "-0.57205", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("105", "Rue du Mirail", "20", "44.83262", "-0.57097", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("106", "Place de la Victoire", "40", "44.83064", "-0.57321", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("107", "Saint-Nicolas", "15", "44.82751", "-0.57589", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("108", "Bergonié", "16", "44.82471", "-0.57815", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("109", "Barrière Saint Genès", "36", "44.82209", "-0.58178", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("110", "Forum", "41", "44.81238", "-0.59103", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("111", "Peixotto", "40", "44.80681", "-0.59245", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("112", "Arts et Métiers", "40", "44.80591", "-0.60232", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("113", "Ecole de Management", "20", "44.79688", "-0.60187", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("114", "Compostelle", "27", "44.79313", "-0.60547", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("115", "CREPS", "32", "44.80091", "-0.59651", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("116", "Montaigne Montesquieu", "40", "44.79667", "-0.61704", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("117", "Doyen Brus", "20", "44.80038", "-0.60986", "Vcub", "FAUX", "3", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("118", "Le Bouscat Ravezies", "20", "44.86694", "-0.57608", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("119", "Tram station Grand Parc", "20", "44.86260", "-0.57576", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("120", "Saint Louis Haussmann", "18", "44.86261", "-0.56718", "Vcub", "FAUX", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("121", "Place Saint Martial", "14", "44.85891", "-0.56584", "Vcub", "FAUX", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("122", "Cours Saint Louis Médoc", "16", "44.85849", "-0.56966", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("123", "Porte de Bourgogne", "36", "44.83779", "-0.56716", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("124", "Parc des sports", "20", "44.83387", "-0.56271", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("125", "Conservatoire", "20", "44.83183", "-0.55966", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("126", "Quai de Paludate", "12", "44.82670", "-0.54983", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("127", "Gare Saint-Jean", "22", "44.82630", "-0.55707", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("128", "Sacré Coeur", "16", "44.82218", "-0.56308", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("129", "Barrière de Bègles", "17", "44.81308", "-0.56420", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("130", "Barrière de Toulouse", "19", "44.81456", "-0.57082", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("131", "Nansouty", "16", "44.82032", "-0.57185", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("132", "Cours de la Somme", "14", "44.82628", "-0.57248", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("133", "Capucins", "20", "44.82995", "-0.56812", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("134", "Place du Maucaillou", "19", "44.83263", "-0.56711", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("135", "Place Saint Michel", "20", "44.83462", "-0.56661", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("136", "Eglise Sainte Croix", "18", "44.83131", "-0.56139", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("137", "Place André Meunier", "25", "44.82831", "-0.56229", "Vcub", "VRAI", "1", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("138", "Barbey", "18", "44.82656", "-0.56455", "Vcub", "VRAI", "2", "FAUX"));
		result.push(new com.tamina.bikewar.data.vo.BikeStationVO("139", "Lycée Brémontier", "18", "44.82405", "-0.57024", "Vcub", "VRAI", "2", "FAUX"));
		return result;
	};
	com.tamina.bikewar.data.MoveOrder = function (truckId, targetStationId) {
		com.tamina.bikewar.data.Order.call(this, truckId, targetStationId, com.tamina.bikewar.data.OrderType.MOVE);
	};
	$hxClasses["com.tamina.bikewar.data.MoveOrder"] = com.tamina.bikewar.data.MoveOrder;
	com.tamina.bikewar.data.MoveOrder.__name__ = ["com", "tamina", "bikewar", "data", "MoveOrder"];
	com.tamina.bikewar.data.MoveOrder.__super__ = com.tamina.bikewar.data.Order;
	com.tamina.bikewar.data.MoveOrder.prototype = $extend(com.tamina.bikewar.data.Order.prototype, {
		__class__: com.tamina.bikewar.data.MoveOrder
	});
	com.tamina.bikewar.data.OrderType = function () {
	};
	$hxClasses["com.tamina.bikewar.data.OrderType"] = com.tamina.bikewar.data.OrderType;
	com.tamina.bikewar.data.OrderType.__name__ = ["com", "tamina", "bikewar", "data", "OrderType"];
	com.tamina.bikewar.data.Path = function (content) {
		if (content == null) this._content = new Array(); else this._content = content;
	};
	$hxClasses["com.tamina.bikewar.data.Path"] = com.tamina.bikewar.data.Path;
	com.tamina.bikewar.data.Path.__name__ = ["com", "tamina", "bikewar", "data", "Path"];
	com.tamina.bikewar.data.Path.contains = function (item, list) {
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
	com.tamina.bikewar.data.Path.prototype = {
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
			var result = new Array();
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
			return new com.tamina.bikewar.data.Path(this._content.slice());
		}, get_length: function () {
			return this._content.length;
		}, __class__: com.tamina.bikewar.data.Path
	};
	com.tamina.bikewar.data.Player = function (name, script, color) {
		if (color == null) color = "";
		if (script == null) script = "";
		if (name == null) name = "";
		this.name = name;
		this.script = script;
		this.color = color;
		this.id = Std.string(org.tamina.utils.UID.getUID());
	};
	$hxClasses["com.tamina.bikewar.data.Player"] = com.tamina.bikewar.data.Player;
	com.tamina.bikewar.data.Player.__name__ = ["com", "tamina", "bikewar", "data", "Player"];
	com.tamina.bikewar.data.Player.prototype = {
		getOrders: function (map) {
			var result = new Array();
			return result;
		}, __class__: com.tamina.bikewar.data.Player
	};
	com.tamina.bikewar.data.PlayerColor = function () {
	};
	$hxClasses["com.tamina.bikewar.data.PlayerColor"] = com.tamina.bikewar.data.PlayerColor;
	com.tamina.bikewar.data.PlayerColor.__name__ = ["com", "tamina", "bikewar", "data", "PlayerColor"];
	com.tamina.bikewar.data.PlayerResult = function (player) {
		this.player = player;
		this.score = 100;
	};
	$hxClasses["com.tamina.bikewar.data.PlayerResult"] = com.tamina.bikewar.data.PlayerResult;
	com.tamina.bikewar.data.PlayerResult.__name__ = ["com", "tamina", "bikewar", "data", "PlayerResult"];
	com.tamina.bikewar.data.PlayerResult.prototype = {
		__class__: com.tamina.bikewar.data.PlayerResult
	};
	com.tamina.bikewar.data.Trend = $hxClasses["com.tamina.bikewar.data.Trend"] = { __ename__: ["com", "tamina", "bikewar", "data", "Trend"], __constructs__: ["DECREASE", "INCREASE", "STABLE"] };
	com.tamina.bikewar.data.Trend.DECREASE = ["DECREASE", 0];
	com.tamina.bikewar.data.Trend.DECREASE.toString = $estr;
	com.tamina.bikewar.data.Trend.DECREASE.__enum__ = com.tamina.bikewar.data.Trend;
	com.tamina.bikewar.data.Trend.INCREASE = ["INCREASE", 1];
	com.tamina.bikewar.data.Trend.INCREASE.toString = $estr;
	com.tamina.bikewar.data.Trend.INCREASE.__enum__ = com.tamina.bikewar.data.Trend;
	com.tamina.bikewar.data.Trend.STABLE = ["STABLE", 2];
	com.tamina.bikewar.data.Trend.STABLE.toString = $estr;
	com.tamina.bikewar.data.Trend.STABLE.__enum__ = com.tamina.bikewar.data.Trend;
	com.tamina.bikewar.data.Trends = function () {
	};
	$hxClasses["com.tamina.bikewar.data.Trends"] = com.tamina.bikewar.data.Trends;
	com.tamina.bikewar.data.Trends.__name__ = ["com", "tamina", "bikewar", "data", "Trends"];
	com.tamina.bikewar.data.Trends.fromInt = function (value) {
		var result = com.tamina.bikewar.data.Trend.STABLE;
		if (value > 0) result = com.tamina.bikewar.data.Trend.INCREASE; else if (value == 0) result = com.tamina.bikewar.data.Trend.STABLE; else result = com.tamina.bikewar.data.Trend.DECREASE;
		return result;
	};
	com.tamina.bikewar.data.Truck = function (owner, currentStation) {
		this.travelDuration = 0;
		this.id = org.tamina.utils.UID.getUID();
		this.owner = owner;
		this.currentStation = currentStation;
		this.position = currentStation.position;
		this.bikeNum = 0;
	};
	$hxClasses["com.tamina.bikewar.data.Truck"] = com.tamina.bikewar.data.Truck;
	com.tamina.bikewar.data.Truck.__name__ = ["com", "tamina", "bikewar", "data", "Truck"];
	com.tamina.bikewar.data.Truck.prototype = {
		__class__: com.tamina.bikewar.data.Truck
	};
	com.tamina.bikewar.data.TurnMessage = function (playerId, data) {
		this.playerId = playerId;
		this.data = data;
	};
	$hxClasses["com.tamina.bikewar.data.TurnMessage"] = com.tamina.bikewar.data.TurnMessage;
	com.tamina.bikewar.data.TurnMessage.__name__ = ["com", "tamina", "bikewar", "data", "TurnMessage"];
	com.tamina.bikewar.data.TurnMessage.prototype = {
		__class__: com.tamina.bikewar.data.TurnMessage
	};
	com.tamina.bikewar.data.TurnResult = function (orders, message) {
		if (message == null) message = "";
		this.orders = orders;
		this.consoleMessage = message;
		this.error = "";
	};
	$hxClasses["com.tamina.bikewar.data.TurnResult"] = com.tamina.bikewar.data.TurnResult;
	com.tamina.bikewar.data.TurnResult.__name__ = ["com", "tamina", "bikewar", "data", "TurnResult"];
	com.tamina.bikewar.data.TurnResult.prototype = {
		__class__: com.tamina.bikewar.data.TurnResult
	};
	com.tamina.bikewar.data.UnLoadingOrder = function (truckId, targetStationId, bikeNum) {
		this.bikeNum = 0;
		com.tamina.bikewar.data.Order.call(this, truckId, targetStationId, com.tamina.bikewar.data.OrderType.UNLOAD);
		this.bikeNum = bikeNum;
	};
	$hxClasses["com.tamina.bikewar.data.UnLoadingOrder"] = com.tamina.bikewar.data.UnLoadingOrder;
	com.tamina.bikewar.data.UnLoadingOrder.__name__ = ["com", "tamina", "bikewar", "data", "UnLoadingOrder"];
	com.tamina.bikewar.data.UnLoadingOrder.__super__ = com.tamina.bikewar.data.Order;
	com.tamina.bikewar.data.UnLoadingOrder.prototype = $extend(com.tamina.bikewar.data.Order.prototype, {
		__class__: com.tamina.bikewar.data.UnLoadingOrder
	});
	com.tamina.bikewar.data.vo = {};
	com.tamina.bikewar.data.vo.BikeStationVO = function (id, name, numSlot, latitude, longitude, type, CB, zone, riveDroite, rocade) {
		if (rocade == null) rocade = "In";
		this.id = id;
		this.name = name;
		this.numSlot = Std.parseInt(numSlot);
		this.latitude = Std.parseFloat(latitude);
		this.longitude = Std.parseFloat(longitude);
		this.type = type;
		this.CB = CB;
		this.zone = Std.parseInt(zone);
		this.riveDroite = riveDroite;
		this.rocade = rocade;
		com.tamina.bikewar.data.vo.BikeStationVO.northEastGPS = new org.tamina.geom.Point(-0.621948, 44.862166);
		com.tamina.bikewar.data.vo.BikeStationVO.southWestGPS = new org.tamina.geom.Point(-0.505407, 44.829026);
	};
	$hxClasses["com.tamina.bikewar.data.vo.BikeStationVO"] = com.tamina.bikewar.data.vo.BikeStationVO;
	com.tamina.bikewar.data.vo.BikeStationVO.__name__ = ["com", "tamina", "bikewar", "data", "vo", "BikeStationVO"];
	com.tamina.bikewar.data.vo.BikeStationVO.prototype = {
		toBikeStation: function (width, height) {
			var result = new com.tamina.bikewar.data.BikeStation();
			result.position = new org.tamina.geom.Junction(Math.round(width * (this.longitude - com.tamina.bikewar.data.vo.BikeStationVO.northEastGPS.x) / (com.tamina.bikewar.data.vo.BikeStationVO.southWestGPS.x - com.tamina.bikewar.data.vo.BikeStationVO.northEastGPS.x)), Math.round(height * (com.tamina.bikewar.data.vo.BikeStationVO.northEastGPS.y - this.latitude) / (com.tamina.bikewar.data.vo.BikeStationVO.northEastGPS.y - com.tamina.bikewar.data.vo.BikeStationVO.southWestGPS.y)), this.id);
			result.slotNum = this.numSlot;
			result.id = Std.parseFloat(this.id);
			result.name = this.name;
			var pl = com.tamina.bikewar.data.Mock.getProfilesByStationId(this.id);
			var _g1 = 0;
			var _g = pl.length;
			while (_g1 < _g) {
				var i = _g1++;
				if (i >= 0) {
					var _g2 = 0;
					while (_g2 < 3) {
						var j = _g2++;
						result.profile.push(Math.round(pl[i].num));
					}
				}
				result.profile.push(Math.round(pl[i].num));
			}
			var time = new Date();
			var currentIndex = time.getHours() * 4 + Math.floor(time.getMinutes() * 4 / 60);
			if (result.profile[currentIndex] != null) result.bikeNum = result.profile[currentIndex];
			return result;
		}, __class__: com.tamina.bikewar.data.vo.BikeStationVO
	};
	com.tamina.bikewar.game = {};
	com.tamina.bikewar.game.Game = function () {
	};
	$hxClasses["com.tamina.bikewar.game.Game"] = com.tamina.bikewar.game.Game;
	com.tamina.bikewar.game.Game.__name__ = ["com", "tamina", "bikewar", "game", "Game"];
	com.tamina.bikewar.game.Game.get_START_POINTS = function () {
		var result = new Array();
		result.push(new org.tamina.geom.Point(100, 100));
		result.push(new org.tamina.geom.Point(100, 500));
		return result;
	};
	com.tamina.bikewar.game.GameUtils = function () {
	};
	$hxClasses["com.tamina.bikewar.game.GameUtils"] = com.tamina.bikewar.game.GameUtils;
	com.tamina.bikewar.game.GameUtils.__name__ = ["com", "tamina", "bikewar", "game", "GameUtils"];
	com.tamina.bikewar.game.GameUtils.getTravelDuration = function (source, target, map) {
		var result = 0;
		var p = com.tamina.bikewar.game.GameUtils.getPath(source, target, map);
		var _g1 = 0;
		var _g = p.get_length() - 1;
		while (_g1 < _g) {
			var i = _g1++;
			result += Math.ceil(com.tamina.bikewar.game.GameUtils.getDistanceBetween(p.getItemAt(i), p.getItemAt(i + 1)) / com.tamina.bikewar.game.Game.TRUCK_SPEED);
		}
		return result;
	};
	com.tamina.bikewar.game.GameUtils.getDistanceBetween = function (p1, p2) {
		return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
	};
	com.tamina.bikewar.game.GameUtils.hasStationEnoughBike = function (station) {
		return station.bikeNum >= station.slotNum / 4 && station.bikeNum <= station.slotNum / 4 * 3;
	};
	com.tamina.bikewar.game.GameUtils.getPath = function (fromStation, toStation, map) {
		var p = new com.tamina.bikewar.core.PathFinder();
		return p.getPath(fromStation, toStation, map);
	};
	com.tamina.bikewar.game.GameUtils.getCurrentRoundedDate = function () {
		var now = new Date();
		var minutes = now.getMinutes();
		minutes = Math.floor(minutes * 4 / 60) * 15;
		var t = now.getTime() - (now.getMinutes() - minutes) * 1000 * 60 - now.getSeconds() * 1000;
		var d = new Date();
		d.setTime(t);
		return d;
	};
	com.tamina.bikewar.game.GameUtils.getBikeStationTrend = function (target, time) {
		var currentIndex = time.getHours() * 4 + Math.floor(time.getMinutes() * 4 / 60);
		var nextIndex = currentIndex + 1;
		if (nextIndex + 1 > target.profile.length) nextIndex = 0;
		return com.tamina.bikewar.data.Trends.fromInt(target.profile[nextIndex] - target.profile[currentIndex]);
	};
	com.tamina.bikewar.tween = {};
	com.tamina.bikewar.tween.AnimatePath = function (target) {
		this._target = target;
		this.moveSignal = new msignal.Signal0();
		this.completeSignal = new msignal.Signal0();
	};
	$hxClasses["com.tamina.bikewar.tween.AnimatePath"] = com.tamina.bikewar.tween.AnimatePath;
	com.tamina.bikewar.tween.AnimatePath.__name__ = ["com", "tamina", "bikewar", "tween", "AnimatePath"];
	com.tamina.bikewar.tween.AnimatePath.prototype = {
		animate: function (path) {
			if (this._tween != null) createjs.Tween.removeTweens(this._target);
			this._tween = new createjs.Tween(this._target);
			this._tween.addEventListener("change", $bind(this, this.moveChangeHandler));
			var _g1 = 1;
			var _g = path.get_length();
			while (_g1 < _g) {
				var i = _g1++;
				this._tween.to({ x: path.getItemAt(i).x, y: path.getItemAt(i).y}, Math.ceil(com.tamina.bikewar.game.GameUtils.getDistanceBetween(path.getItemAt(i - 1), path.getItemAt(i)) / com.tamina.bikewar.game.Game.TRUCK_SPEED) * com.tamina.bikewar.game.Game.GAME_SPEED);
			}
			this._tween.call($bind(this, this.moveEndedHandler));
		}, moveChangeHandler: function (event) {
			this.moveSignal.dispatch();
		}, moveEndedHandler: function () {
			this.completeSignal.dispatch();
		}, __class__: com.tamina.bikewar.tween.AnimatePath
	};
	com.tamina.bikewar.ui = {};
	com.tamina.bikewar.ui.BikeStationSprite = function (data, currentTime) {
		createjs.Container.call(this);
		this._data = data;
		this._currentTime = currentTime;
		this._defaultBackgroundBitmap = new createjs.Bitmap(com.tamina.bikewar.core.Global.IMG_BASE_PATH + "images/stationBackground_defaut.png");
		this._outBackgroundBitmap = new createjs.Bitmap(com.tamina.bikewar.core.Global.IMG_BASE_PATH + "images/stationBackground_out.png");
		this._player0Bitmap = new createjs.Bitmap(com.tamina.bikewar.core.Global.IMG_BASE_PATH + "images/stationFlag_0.png");
		this._player1Bitmap = new createjs.Bitmap(com.tamina.bikewar.core.Global.IMG_BASE_PATH + "images/stationFlag_1.png");
		this._backgroundContainer = new createjs.Container();
		this.addChild(this._backgroundContainer);
		this._ownerFlagContainer = new createjs.Container();
		this.addChild(this._ownerFlagContainer);
		this._label = new createjs.Text();
		this._label.x = 18;
		this._label.y = 12;
		this._label.textAlign = "center";
		this._label.color = "#FFFFFF";
		this._label.font = "08px Pixel01";
		this._label.text = Std.string(this._data.bikeNum);
		this.addChild(this._label);
		this.updateBackground();
	};
	$hxClasses["com.tamina.bikewar.ui.BikeStationSprite"] = com.tamina.bikewar.ui.BikeStationSprite;
	com.tamina.bikewar.ui.BikeStationSprite.__name__ = ["com", "tamina", "bikewar", "ui", "BikeStationSprite"];
	com.tamina.bikewar.ui.BikeStationSprite.__super__ = createjs.Container;
	com.tamina.bikewar.ui.BikeStationSprite.prototype = $extend(createjs.Container.prototype, {
		updateData: function (currentTime) {
			this._label.text = Std.string(this._data.bikeNum);
			this._currentTime = currentTime;
			this.updateOwnerFlag();
			this.updateBackground();
		}, updateOwnerFlag: function () {
			if (this._data.owner != null) {
				this._ownerFlagContainer.removeAllChildren();
				var targetFlag = this._player0Bitmap;
				if (this._data.owner.color == com.tamina.bikewar.data.PlayerColor.BLUE) targetFlag = this._player1Bitmap;
				this._ownerFlagContainer.addChild(targetFlag);
			}
		}, updateBackground: function () {
			this._backgroundContainer.removeAllChildren();
			var targetBackground = this._defaultBackgroundBitmap;
			if (!com.tamina.bikewar.game.GameUtils.hasStationEnoughBike(this._data)) targetBackground = this._outBackgroundBitmap;
			this._backgroundContainer.addChild(targetBackground);
		}, __class__: com.tamina.bikewar.ui.BikeStationSprite
	});
	com.tamina.bikewar.ui.JunctionShape = function (data) {
		createjs.Shape.call(this);
		this.data = data;
		this.x = data.x;
		this.y = data.y;
		this.graphics.beginFill("#FF0000");
		this.graphics.drawRect(-3, -3, 6, 6);
		this.graphics.endFill();
	};
	$hxClasses["com.tamina.bikewar.ui.JunctionShape"] = com.tamina.bikewar.ui.JunctionShape;
	com.tamina.bikewar.ui.JunctionShape.__name__ = ["com", "tamina", "bikewar", "ui", "JunctionShape"];
	com.tamina.bikewar.ui.JunctionShape.__super__ = createjs.Shape;
	com.tamina.bikewar.ui.JunctionShape.prototype = $extend(createjs.Shape.prototype, {
		select: function () {
			this.graphics.clear();
			this.graphics.beginFill("#00FF00");
			this.graphics.drawRect(-3, -3, 6, 6);
			this.graphics.endFill();
		}, __class__: com.tamina.bikewar.ui.JunctionShape
	});
	com.tamina.bikewar.ui.MapUI = function (display, width, height) {
		createjs.Stage.call(this, display);
		createjs.MotionGuidePlugin.install();
		this._width = width;
		this._height = height;
		this._stationsContainer = new org.tamina.view.Group();
		this._trucksContainer = new org.tamina.view.Group();
		this.addChild(this._stationsContainer);
		this.addChild(this._trucksContainer);
		var textBackgroundShape = new createjs.Shape();
		textBackgroundShape.graphics.beginFill("#FFFF00");
		textBackgroundShape.graphics.drawRect(0, 0, 285, 35);
		textBackgroundShape.graphics.endFill();
		this._dateText = new createjs.Text();
		this._dateText.color = "#000000";
		this._dateText.font = "30px Arial";
		this._dateText.textAlign = "left";
		this._roadsSprite = new com.tamina.bikewar.ui.RoadSprite(width, height);
		createjs.Ticker.addEventListener("tick", $bind(this, this.tickerHandler));
	};
	$hxClasses["com.tamina.bikewar.ui.MapUI"] = com.tamina.bikewar.ui.MapUI;
	com.tamina.bikewar.ui.MapUI.__name__ = ["com", "tamina", "bikewar", "ui", "MapUI"];
	com.tamina.bikewar.ui.MapUI.__super__ = createjs.Stage;
	com.tamina.bikewar.ui.MapUI.prototype = $extend(createjs.Stage.prototype, {
		showResultScreen: function (winner, resultMessage) {
			this._resultScreen = new com.tamina.bikewar.ui.ResultScreen(winner, resultMessage, this._width, this._height);
			this.addChild(this._resultScreen);
		}, init: function (data, debugMode) {
			if (debugMode == null) debugMode = false;
			this._data = data;
			this._debugMode = debugMode;
			this._dateText.text = HxOverrides.dateStr(this._data.currentTime);
			window.document.getElementById("time").innerHTML = org.tamina.utils.DateUtils.hourToFrenchString(this._data.currentTime);
			var _g1 = 0;
			var _g = this._data.stations.length;
			while (_g1 < _g) {
				var i = _g1++;
				var stationSprite = new com.tamina.bikewar.ui.BikeStationSprite(this._data.stations[i], this._data.currentTime);
				stationSprite.x = this._data.stations[i].position.x - com.tamina.bikewar.ui.BikeStationSprite.PADDING_LEFT;
				stationSprite.y = this._data.stations[i].position.y - com.tamina.bikewar.ui.BikeStationSprite.PADDING_TOP;
				this._stationsContainer.addElement(stationSprite);
			}
			if (!this._debugMode) {
				var _g11 = 0;
				var _g2 = this._data.trucks.length;
				while (_g11 < _g2) {
					var i1 = _g11++;
					var truckData = this._data.trucks[i1];
					var truckSprite = new com.tamina.bikewar.ui.TruckSprite(truckData);
					truckSprite.x = this._data.trucks[i1].position.x;
					truckSprite.y = this._data.trucks[i1].position.y;
					this._trucksContainer.addElement(truckSprite);
				}
			} else this._roadsSprite.displayRoads(this._data.roads);
		}, updateData: function () {
			window.document.getElementById("time").innerHTML = org.tamina.utils.DateUtils.hourToFrenchString(this._data.currentTime);
			var _g1 = 0;
			var _g = this._stationsContainer.getNumChildren();
			while (_g1 < _g) {
				var i = _g1++;
				this._stationsContainer.getElementAt(i).updateData(this._data.currentTime);
			}
			var _g11 = 0;
			var _g2 = this._trucksContainer.getNumChildren();
			while (_g11 < _g2) {
				var i1 = _g11++;
				this._trucksContainer.getElementAt(i1).updateData();
			}
		}, moveTruck: function (truck, destination) {
			var target = this.getSpriteByTruck(truck);
			var p = target.moveTo(destination, this._data);
		}, getSpriteByTruck: function (data) {
			var result = null;
			var _g1 = 0;
			var _g = this._trucksContainer.getNumChildren();
			while (_g1 < _g) {
				var i = _g1++;
				var p = this._trucksContainer.getElementAt(i);
				if (p.data.id == data.id) {
					result = p;
					break;
				}
			}
			return result;
		}, tickerHandler: function () {
			this.update();
		}, __class__: com.tamina.bikewar.ui.MapUI
	});
	com.tamina.bikewar.ui.ResultScreen = function (winner, message, width, height) {
		this._height = 250.0;
		this._width = 400.0;
		createjs.Container.call(this);
		this._width = width;
		this._height = height;
		this._backgroundShape = new createjs.Shape();
		this.addChild(this._backgroundShape);
		this._backgroundShape.graphics.clear();
		this._backgroundShape.graphics.beginFill("#000000");
		this._backgroundShape.graphics.drawRoundRect(0.0, 0.0, this._width, this._height, 0.0);
		this._backgroundShape.graphics.endFill();
		this._backgroundShape.alpha = 0.5;
		this._trophyBitmap = new createjs.Bitmap(com.tamina.bikewar.core.Global.IMG_BASE_PATH + "images/trophy.png");
		this.addChild(this._trophyBitmap);
		this._trophyBitmap.x = Math.floor(this._width / 2 - 66);
		this._trophyBitmap.y = Math.floor(this._height / 2 - 80);
		this._winnerText = new createjs.Text(winner, "14px Silom");
		this._winnerText.color = "#ed1b38";
		this._winnerText.maxWidth = this._width;
		this._winnerText.textAlign = "center";
		this._winnerText.x = this._width / 2;
		this._winnerText.y = this._trophyBitmap.y + 105.0;
		this.addChild(this._winnerText);
		this._messageText = new createjs.Text(message, "10px Silom");
		this._messageText.color = "#ed1b38";
		this._messageText.lineWidth = this._width - 180;
		this._messageText.lineHeight = 20.0;
		this._messageText.x = this._width / 2;
		this._messageText.y = this._winnerText.y + 14;
		org.tamina.log.QuickLogger.warn(message);
	};
	$hxClasses["com.tamina.bikewar.ui.ResultScreen"] = com.tamina.bikewar.ui.ResultScreen;
	com.tamina.bikewar.ui.ResultScreen.__name__ = ["com", "tamina", "bikewar", "ui", "ResultScreen"];
	com.tamina.bikewar.ui.ResultScreen.__super__ = createjs.Container;
	com.tamina.bikewar.ui.ResultScreen.prototype = $extend(createjs.Container.prototype, {
		getWidth: function () {
			return this._width;
		}, getHeight: function () {
			return this._height;
		}, __class__: com.tamina.bikewar.ui.ResultScreen
	});
	com.tamina.bikewar.ui.RoadSprite = function (width, height) {
		createjs.Container.call(this);
		this._backgroundShape = new createjs.Shape();
		this._backgroundShape.graphics.beginFill("#cccccc");
		this._backgroundShape.graphics.drawRect(0, 0, width, height);
		this._backgroundShape.graphics.endFill();
		this._backgroundShape.alpha = 0.10;
		this.addChild(this._backgroundShape);
		this._backgroundShape.addEventListener("mousedown", $bind(this, this.mouseDownHandler));
		this._linksShape = new createjs.Shape();
		this.addChild(this._linksShape);
		this._exportButton = new createjs.Shape();
		this._exportButton.graphics.beginFill("#FFCC00");
		this._exportButton.graphics.drawRect(0, 0, 20, 20);
		this._exportButton.graphics.endFill();
		this._exportButton.x = 1040;
		this.addChild(this._exportButton);
		this._exportButton.addEventListener("mousedown", $bind(this, this.export_mouseDownHandler));
		this.junctionGroup = new org.tamina.view.Group();
		this.addChild(this.junctionGroup);
	};
	$hxClasses["com.tamina.bikewar.ui.RoadSprite"] = com.tamina.bikewar.ui.RoadSprite;
	com.tamina.bikewar.ui.RoadSprite.__name__ = ["com", "tamina", "bikewar", "ui", "RoadSprite"];
	com.tamina.bikewar.ui.RoadSprite.__super__ = createjs.Container;
	com.tamina.bikewar.ui.RoadSprite.prototype = $extend(createjs.Container.prototype, {
		displayRoads: function (roads) {
			this._roads = roads;
			var _g1 = 0;
			var _g = this._roads.length;
			while (_g1 < _g) {
				var i = _g1++;
				var r = roads[i];
				var s = new com.tamina.bikewar.ui.JunctionShape(r);
				var _g3 = 0;
				var _g2 = r.links.length;
				while (_g3 < _g2) {
					var j = _g3++;
					this._linksShape.graphics.beginStroke("#FF0000");
					this._linksShape.graphics.moveTo(r.x, r.y);
					this._linksShape.graphics.lineTo(r.links[j].x, r.links[j].y);
					this._linksShape.graphics.endStroke();
				}
				s.addEventListener("mousedown", $bind(this, this.junction_mouseDownHandler));
				this.junctionGroup.addChild(s);
			}
		}, junction_mouseDownHandler: function (event) {
			var targetJunctionShape = event.target;
			if (this._selectedJunctionShape == null) this._selectedJunctionShape = targetJunctionShape; else {
				this._linksShape.graphics.beginStroke("#FF0000");
				this._linksShape.graphics.moveTo(this._selectedJunctionShape.x, this._selectedJunctionShape.y);
				this._linksShape.graphics.lineTo(targetJunctionShape.x, targetJunctionShape.y);
				this._linksShape.graphics.endStroke();
				this._selectedJunctionShape.data.links.push(targetJunctionShape.data);
				targetJunctionShape.data.links.push(this._selectedJunctionShape.data);
				this._selectedJunctionShape = null;
			}
		}, export_mouseDownHandler: function (event) {
			haxe.Serializer.USE_CACHE = true;
			var exportData = haxe.Serializer.run(this._roads);
			haxe.Log.trace(exportData, { fileName: "RoadSprite.hx", lineNumber: 80, className: "com.tamina.bikewar.ui.RoadSprite", methodName: "export_mouseDownHandler"});
		}, mouseDownHandler: function (event) {
			this._selectedJunctionShape = null;
			var j = new org.tamina.geom.Junction(event.rawX, event.rawY);
			this._roads.push(j);
			var s = new com.tamina.bikewar.ui.JunctionShape(j);
			s.addEventListener("mousedown", $bind(this, this.junction_mouseDownHandler));
			this.junctionGroup.addChild(s);
		}, __class__: com.tamina.bikewar.ui.RoadSprite
	});
	com.tamina.bikewar.ui.TruckSprite = function (data) {
		createjs.Container.call(this);
		this.data = data;
		this._gaugeShape = new createjs.Shape();
		this._gaugeShape.y = 5;
		if (data.owner.color == com.tamina.bikewar.data.PlayerColor.RED) {
			this._backgroundBitmap = new createjs.Bitmap(com.tamina.bikewar.core.Global.IMG_BASE_PATH + "images/truck_bg_0.png");
			this._gaugeShape.x = -21;
		} else {
			this._backgroundBitmap = new createjs.Bitmap(com.tamina.bikewar.core.Global.IMG_BASE_PATH + "images/truck_bg_1.png");
			this._gaugeShape.x = 13;
		}
		this._backgroundContainer = new createjs.Container();
		this._backgroundContainer.x = -28;
		this._backgroundContainer.y = -23;
		this._backgroundContainer.addChild(this._backgroundBitmap);
		this.addChild(this._backgroundContainer);
		this.addChild(this._gaugeShape);
		this._label = new createjs.Text();
		this._label.x = 0;
		this._label.y = 0;
		this._label.textAlign = "center";
		this._label.color = "#ffffff";
		this._label.font = "08px Pixel01";
		this._label.text = Std.string(this.data.bikeNum);
		this.addChild(this._label);
		this._motion = new com.tamina.bikewar.tween.AnimatePath(this);
		this._motion.moveSignal.add($bind(this, this.moveChangeHandler));
		this._motion.completeSignal.add($bind(this, this.moveEndedHandler));
	};
	$hxClasses["com.tamina.bikewar.ui.TruckSprite"] = com.tamina.bikewar.ui.TruckSprite;
	com.tamina.bikewar.ui.TruckSprite.__name__ = ["com", "tamina", "bikewar", "ui", "TruckSprite"];
	com.tamina.bikewar.ui.TruckSprite.__super__ = createjs.Container;
	com.tamina.bikewar.ui.TruckSprite.prototype = $extend(createjs.Container.prototype, {
		updateData: function () {
			this._label.text = Std.string(this.data.bikeNum);
			this._gaugeShape.graphics.clear();
			this._gaugeShape.graphics.beginFill("#fef54d");
			var numGaugeBar = Math.round(this.data.bikeNum * 4 / 10);
			var _g = 0;
			while (_g < numGaugeBar) {
				var i = _g++;
				this._gaugeShape.graphics.drawRect(0, 0 - i * 3, 7, 2);
			}
			this._gaugeShape.graphics.endFill();
		}, moveTo: function (target, map) {
			var path = com.tamina.bikewar.game.GameUtils.getPath(this.data.currentStation, this.data.destination, map);
			this._motion.animate(path);
			return path;
		}, moveChangeHandler: function () {
			this.data.position.x = this.x;
			this.data.position.y = this.y;
		}, moveEndedHandler: function () {
			org.tamina.log.QuickLogger.info("move ended");
		}, __class__: com.tamina.bikewar.ui.TruckSprite
	});
	com.tamina.bikewar.ui.UIElementId = function () {
	};
	$hxClasses["com.tamina.bikewar.ui.UIElementId"] = com.tamina.bikewar.ui.UIElementId;
	com.tamina.bikewar.ui.UIElementId.__name__ = ["com", "tamina", "bikewar", "ui", "UIElementId"];
	var haxe = {};
	haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__: ["haxe", "StackItem"], __constructs__: ["CFunction", "Module", "FilePos", "Method", "LocalFunction"] };
	haxe.StackItem.CFunction = ["CFunction", 0];
	haxe.StackItem.CFunction.toString = $estr;
	haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
	haxe.StackItem.Module = function (m) {
		var $x = ["Module", 1, m];
		$x.__enum__ = haxe.StackItem;
		$x.toString = $estr;
		return $x;
	};
	haxe.StackItem.FilePos = function (s, file, line) {
		var $x = ["FilePos", 2, s, file, line];
		$x.__enum__ = haxe.StackItem;
		$x.toString = $estr;
		return $x;
	};
	haxe.StackItem.Method = function (classname, method) {
		var $x = ["Method", 3, classname, method];
		$x.__enum__ = haxe.StackItem;
		$x.toString = $estr;
		return $x;
	};
	haxe.StackItem.LocalFunction = function (v) {
		var $x = ["LocalFunction", 4, v];
		$x.__enum__ = haxe.StackItem;
		$x.toString = $estr;
		return $x;
	};
	haxe.CallStack = function () {
	};
	$hxClasses["haxe.CallStack"] = haxe.CallStack;
	haxe.CallStack.__name__ = ["haxe", "CallStack"];
	haxe.CallStack.callStack = function () {
		var oldValue = Error.prepareStackTrace;
		Error.prepareStackTrace = function (error, callsites) {
			var stack = [];
			var _g = 0;
			while (_g < callsites.length) {
				var site = callsites[_g];
				++_g;
				var method = null;
				var fullName = site.getFunctionName();
				if (fullName != null) {
					var idx = fullName.lastIndexOf(".");
					if (idx >= 0) {
						var className = HxOverrides.substr(fullName, 0, idx);
						var methodName = HxOverrides.substr(fullName, idx + 1, null);
						method = haxe.StackItem.Method(className, methodName);
					}
				}
				stack.push(haxe.StackItem.FilePos(method, site.getFileName(), site.getLineNumber()));
			}
			return stack;
		};
		var a = haxe.CallStack.makeStack(new Error().stack);
		a.shift();
		Error.prepareStackTrace = oldValue;
		return a;
	};
	haxe.CallStack.makeStack = function (s) {
		if (typeof(s) == "string") {
			var stack = s.split("\n");
			var m = [];
			var _g = 0;
			while (_g < stack.length) {
				var line = stack[_g];
				++_g;
				m.push(haxe.StackItem.Module(line));
			}
			return m;
		} else return s;
	};
	haxe.Http = function (url) {
		this.url = url;
		this.headers = new List();
		this.params = new List();
		this.async = true;
	};
	$hxClasses["haxe.Http"] = haxe.Http;
	haxe.Http.__name__ = ["haxe", "Http"];
	haxe.Http.prototype = {
		setParameter: function (param, value) {
			this.params = Lambda.filter(this.params, function (p) {
				return p.param != param;
			});
			this.params.push({ param: param, value: value});
			return this;
		}, request: function (post) {
			var me = this;
			me.responseData = null;
			var r = this.req = js.Browser.createXMLHttpRequest();
			var onreadystatechange = function (_) {
				if (r.readyState != 4) return;
				var s;
				try {
					s = r.status;
				} catch (e) {
					s = null;
				}
				if (s == undefined) s = null;
				if (s != null) me.onStatus(s);
				if (s != null && s >= 200 && s < 400) {
					me.req = null;
					me.onData(me.responseData = r.responseText);
				} else if (s == null) {
					me.req = null;
					me.onError("Failed to connect or resolve host");
				} else switch (s) {
					case 12029:
						me.req = null;
						me.onError("Failed to connect to host");
						break;
					case 12007:
						me.req = null;
						me.onError("Unknown host");
						break;
					default:
						me.req = null;
						me.responseData = r.responseText;
						me.onError("Http Error #" + r.status);
				}
			};
			if (this.async) r.onreadystatechange = onreadystatechange;
			var uri = this.postData;
			if (uri != null) post = true; else {
				var $it0 = this.params.iterator();
				while ($it0.hasNext()) {
					var p = $it0.next();
					if (uri == null) uri = ""; else uri += "&";
					uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
				}
			}
			try {
				if (post) r.open("POST", this.url, this.async); else if (uri != null) {
					var question = this.url.split("?").length <= 1;
					r.open("GET", this.url + (question ? "?" : "&") + uri, this.async);
					uri = null;
				} else r.open("GET", this.url, this.async);
			} catch (e1) {
				me.req = null;
				this.onError(e1.toString());
				return;
			}
			if (!Lambda.exists(this.headers, function (h) {
				return h.header == "Content-Type";
			}) && post && this.postData == null) r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			var $it1 = this.headers.iterator();
			while ($it1.hasNext()) {
				var h1 = $it1.next();
				r.setRequestHeader(h1.header, h1.value);
			}
			r.send(uri);
			if (!this.async) onreadystatechange(null);
		}, onData: function (data) {
		}, onError: function (msg) {
		}, onStatus: function (status) {
		}, __class__: haxe.Http
	};
	haxe.Log = function () {
	};
	$hxClasses["haxe.Log"] = haxe.Log;
	haxe.Log.__name__ = ["haxe", "Log"];
	haxe.Log.trace = function (v, infos) {
		js.Boot.__trace(v, infos);
	};
	haxe.Serializer = function () {
		this.buf = new StringBuf();
		this.cache = new Array();
		this.useCache = haxe.Serializer.USE_CACHE;
		this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
		this.shash = new haxe.ds.StringMap();
		this.scount = 0;
	};
	$hxClasses["haxe.Serializer"] = haxe.Serializer;
	haxe.Serializer.__name__ = ["haxe", "Serializer"];
	haxe.Serializer.run = function (v) {
		var s = new haxe.Serializer();
		s.serialize(v);
		return s.toString();
	};
	haxe.Serializer.prototype = {
		toString: function () {
			return this.buf.b;
		}, serializeString: function (s) {
			var x = this.shash.get(s);
			if (x != null) {
				this.buf.b += "R";
				if (x == null) this.buf.b += "null"; else this.buf.b += "" + x;
				return;
			}
			this.shash.set(s, this.scount++);
			this.buf.b += "y";
			s = encodeURIComponent(s);
			if (s.length == null) this.buf.b += "null"; else this.buf.b += "" + s.length;
			this.buf.b += ":";
			if (s == null) this.buf.b += "null"; else this.buf.b += "" + s;
		}, serializeRef: function (v) {
			var vt = typeof(v);
			var _g1 = 0;
			var _g = this.cache.length;
			while (_g1 < _g) {
				var i = _g1++;
				var ci = this.cache[i];
				if (typeof(ci) == vt && ci == v) {
					this.buf.b += "r";
					if (i == null) this.buf.b += "null"; else this.buf.b += "" + i;
					return true;
				}
			}
			this.cache.push(v);
			return false;
		}, serializeFields: function (v) {
			var _g = 0;
			var _g1 = Reflect.fields(v);
			while (_g < _g1.length) {
				var f = _g1[_g];
				++_g;
				this.serializeString(f);
				this.serialize(Reflect.field(v, f));
			}
			this.buf.b += "g";
		}, serialize: function (v) {
			{
				var _g = Type["typeof"](v);
				switch (_g[1]) {
					case 0:
						this.buf.b += "n";
						break;
					case 1:
						var v1 = v;
						if (v1 == 0) {
							this.buf.b += "z";
							return;
						}
						this.buf.b += "i";
						if (v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
						break;
					case 2:
						var v2 = v;
						if (Math.isNaN(v2)) this.buf.b += "k"; else if (!Math.isFinite(v2)) if (v2 < 0) this.buf.b += "m"; else this.buf.b += "p"; else {
							this.buf.b += "d";
							if (v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
						}
						break;
					case 3:
						if (v) this.buf.b += "t"; else this.buf.b += "f";
						break;
					case 6:
						var c = _g[2];
						if (c == String) {
							this.serializeString(v);
							return;
						}
						if (this.useCache && this.serializeRef(v)) return;
						switch (c) {
							case Array:
								var ucount = 0;
								this.buf.b += "a";
								var l = v.length;
								var _g1 = 0;
								while (_g1 < l) {
									var i = _g1++;
									if (v[i] == null) ucount++; else {
										if (ucount > 0) {
											if (ucount == 1) this.buf.b += "n"; else {
												this.buf.b += "u";
												if (ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
											}
											ucount = 0;
										}
										this.serialize(v[i]);
									}
								}
								if (ucount > 0) {
									if (ucount == 1) this.buf.b += "n"; else {
										this.buf.b += "u";
										if (ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
									}
								}
								this.buf.b += "h";
								break;
							case List:
								this.buf.b += "l";
								var v3 = v;
								var $it0 = v3.iterator();
								while ($it0.hasNext()) {
									var i1 = $it0.next();
									this.serialize(i1);
								}
								this.buf.b += "h";
								break;
							case Date:
								var d = v;
								this.buf.b += "v";
								this.buf.add(HxOverrides.dateStr(d));
								break;
							case haxe.ds.StringMap:
								this.buf.b += "b";
								var v4 = v;
								var $it1 = v4.keys();
								while ($it1.hasNext()) {
									var k = $it1.next();
									this.serializeString(k);
									this.serialize(v4.get(k));
								}
								this.buf.b += "h";
								break;
							case haxe.ds.IntMap:
								this.buf.b += "q";
								var v5 = v;
								var $it2 = v5.keys();
								while ($it2.hasNext()) {
									var k1 = $it2.next();
									this.buf.b += ":";
									if (k1 == null) this.buf.b += "null"; else this.buf.b += "" + k1;
									this.serialize(v5.get(k1));
								}
								this.buf.b += "h";
								break;
							case haxe.ds.ObjectMap:
								this.buf.b += "M";
								var v6 = v;
								var $it3 = v6.keys();
								while ($it3.hasNext()) {
									var k2 = $it3.next();
									var id = Reflect.field(k2, "__id__");
									Reflect.deleteField(k2, "__id__");
									this.serialize(k2);
									k2.__id__ = id;
									this.serialize(v6.h[k2.__id__]);
								}
								this.buf.b += "h";
								break;
							case haxe.io.Bytes:
								var v7 = v;
								var i2 = 0;
								var max = v7.length - 2;
								var charsBuf = new StringBuf();
								var b64 = haxe.Serializer.BASE64;
								while (i2 < max) {
									var b1 = v7.get(i2++);
									var b2 = v7.get(i2++);
									var b3 = v7.get(i2++);
									charsBuf.add(b64.charAt(b1 >> 2));
									charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
									charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
									charsBuf.add(b64.charAt(b3 & 63));
								}
								if (i2 == max) {
									var b11 = v7.get(i2++);
									var b21 = v7.get(i2++);
									charsBuf.add(b64.charAt(b11 >> 2));
									charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
									charsBuf.add(b64.charAt(b21 << 2 & 63));
								} else if (i2 == max + 1) {
									var b12 = v7.get(i2++);
									charsBuf.add(b64.charAt(b12 >> 2));
									charsBuf.add(b64.charAt(b12 << 4 & 63));
								}
								var chars = charsBuf.b;
								this.buf.b += "s";
								if (chars.length == null) this.buf.b += "null"; else this.buf.b += "" + chars.length;
								this.buf.b += ":";
								if (chars == null) this.buf.b += "null"; else this.buf.b += "" + chars;
								break;
							default:
								if (this.useCache) this.cache.pop();
								if (v.hxSerialize != null) {
									this.buf.b += "C";
									this.serializeString(Type.getClassName(c));
									if (this.useCache) this.cache.push(v);
									v.hxSerialize(this);
									this.buf.b += "g";
								} else {
									this.buf.b += "c";
									this.serializeString(Type.getClassName(c));
									if (this.useCache) this.cache.push(v);
									this.serializeFields(v);
								}
						}
						break;
					case 4:
						if (this.useCache && this.serializeRef(v)) return;
						this.buf.b += "o";
						this.serializeFields(v);
						break;
					case 7:
						var e = _g[2];
						if (this.useCache) {
							if (this.serializeRef(v)) return;
							this.cache.pop();
						}
						if (this.useEnumIndex) this.buf.b += "j"; else this.buf.b += "w";
						this.serializeString(Type.getEnumName(e));
						if (this.useEnumIndex) {
							this.buf.b += ":";
							this.buf.b += Std.string(v[1]);
						} else this.serializeString(v[0]);
						this.buf.b += ":";
						var l1 = v.length;
						this.buf.b += Std.string(l1 - 2);
						var _g11 = 2;
						while (_g11 < l1) {
							var i3 = _g11++;
							this.serialize(v[i3]);
						}
						if (this.useCache) this.cache.push(v);
						break;
					case 5:
						throw "Cannot serialize function";
						break;
					default:
						throw "Cannot serialize " + Std.string(v);
				}
			}
		}, __class__: haxe.Serializer
	};
	haxe.Timer = function (time_ms) {
		var me = this;
		this.id = setInterval(function () {
			me.run();
		}, time_ms);
	};
	$hxClasses["haxe.Timer"] = haxe.Timer;
	haxe.Timer.__name__ = ["haxe", "Timer"];
	haxe.Timer.stamp = function () {
		return new Date().getTime() / 1000;
	};
	haxe.Timer.prototype = {
		stop: function () {
			if (this.id == null) return;
			clearInterval(this.id);
			this.id = null;
		}, run: function () {
		}, __class__: haxe.Timer
	};
	haxe.Unserializer = function (buf) {
		this.buf = buf;
		this.length = buf.length;
		this.pos = 0;
		this.scache = new Array();
		this.cache = new Array();
		var r = haxe.Unserializer.DEFAULT_RESOLVER;
		if (r == null) {
			r = Type;
			haxe.Unserializer.DEFAULT_RESOLVER = r;
		}
		this.setResolver(r);
	};
	$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
	haxe.Unserializer.__name__ = ["haxe", "Unserializer"];
	haxe.Unserializer.initCodes = function () {
		var codes = new Array();
		var _g1 = 0;
		var _g = haxe.Unserializer.BASE64.length;
		while (_g1 < _g) {
			var i = _g1++;
			codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
		}
		return codes;
	};
	haxe.Unserializer.run = function (v) {
		return new haxe.Unserializer(v).unserialize();
	};
	haxe.Unserializer.prototype = {
		setResolver: function (r) {
			if (r == null) this.resolver = { resolveClass: function (_) {
				return null;
			}, resolveEnum: function (_1) {
				return null;
			}}; else this.resolver = r;
		}, get: function (p) {
			return this.buf.charCodeAt(p);
		}, readDigits: function () {
			var k = 0;
			var s = false;
			var fpos = this.pos;
			while (true) {
				var c = this.buf.charCodeAt(this.pos);
				if (c != c) break;
				if (c == 45) {
					if (this.pos != fpos) break;
					s = true;
					this.pos++;
					continue;
				}
				if (c < 48 || c > 57) break;
				k = k * 10 + (c - 48);
				this.pos++;
			}
			if (s) k *= -1;
			return k;
		}, unserializeObject: function (o) {
			while (true) {
				if (this.pos >= this.length) throw "Invalid object";
				if (this.buf.charCodeAt(this.pos) == 103) break;
				var k = this.unserialize();
				if (!(typeof(k) == "string")) throw "Invalid object key";
				var v = this.unserialize();
				o[k] = v;
			}
			this.pos++;
		}, unserializeEnum: function (edecl, tag) {
			if (this.get(this.pos++) != 58) throw "Invalid enum format";
			var nargs = this.readDigits();
			if (nargs == 0) return Type.createEnum(edecl, tag);
			var args = new Array();
			while (nargs-- > 0) args.push(this.unserialize());
			return Type.createEnum(edecl, tag, args);
		}, unserialize: function () {
			var _g = this.get(this.pos++);
			switch (_g) {
				case 110:
					return null;
				case 116:
					return true;
				case 102:
					return false;
				case 122:
					return 0;
				case 105:
					return this.readDigits();
				case 100:
					var p1 = this.pos;
					while (true) {
						var c = this.buf.charCodeAt(this.pos);
						if (c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
					}
					return Std.parseFloat(HxOverrides.substr(this.buf, p1, this.pos - p1));
				case 121:
					var len = this.readDigits();
					if (this.get(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
					var s = HxOverrides.substr(this.buf, this.pos, len);
					this.pos += len;
					s = decodeURIComponent(s.split("+").join(" "));
					this.scache.push(s);
					return s;
				case 107:
					return Math.NaN;
				case 109:
					return Math.NEGATIVE_INFINITY;
				case 112:
					return Math.POSITIVE_INFINITY;
				case 97:
					var buf = this.buf;
					var a = new Array();
					this.cache.push(a);
					while (true) {
						var c1 = this.buf.charCodeAt(this.pos);
						if (c1 == 104) {
							this.pos++;
							break;
						}
						if (c1 == 117) {
							this.pos++;
							var n = this.readDigits();
							a[a.length + n - 1] = null;
						} else a.push(this.unserialize());
					}
					return a;
				case 111:
					var o = { };
					this.cache.push(o);
					this.unserializeObject(o);
					return o;
				case 114:
					var n1 = this.readDigits();
					if (n1 < 0 || n1 >= this.cache.length) throw "Invalid reference";
					return this.cache[n1];
				case 82:
					var n2 = this.readDigits();
					if (n2 < 0 || n2 >= this.scache.length) throw "Invalid string reference";
					return this.scache[n2];
				case 120:
					throw this.unserialize();
					break;
				case 99:
					var name = this.unserialize();
					var cl = this.resolver.resolveClass(name);
					if (cl == null) throw "Class not found " + name;
					var o1 = Type.createEmptyInstance(cl);
					this.cache.push(o1);
					this.unserializeObject(o1);
					return o1;
				case 119:
					var name1 = this.unserialize();
					var edecl = this.resolver.resolveEnum(name1);
					if (edecl == null) throw "Enum not found " + name1;
					var e = this.unserializeEnum(edecl, this.unserialize());
					this.cache.push(e);
					return e;
				case 106:
					var name2 = this.unserialize();
					var edecl1 = this.resolver.resolveEnum(name2);
					if (edecl1 == null) throw "Enum not found " + name2;
					this.pos++;
					var index = this.readDigits();
					var tag = Type.getEnumConstructs(edecl1)[index];
					if (tag == null) throw "Unknown enum index " + name2 + "@" + index;
					var e1 = this.unserializeEnum(edecl1, tag);
					this.cache.push(e1);
					return e1;
				case 108:
					var l = new List();
					this.cache.push(l);
					var buf1 = this.buf;
					while (this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
					this.pos++;
					return l;
				case 98:
					var h = new haxe.ds.StringMap();
					this.cache.push(h);
					var buf2 = this.buf;
					while (this.buf.charCodeAt(this.pos) != 104) {
						var s1 = this.unserialize();
						h.set(s1, this.unserialize());
					}
					this.pos++;
					return h;
				case 113:
					var h1 = new haxe.ds.IntMap();
					this.cache.push(h1);
					var buf3 = this.buf;
					var c2 = this.get(this.pos++);
					while (c2 == 58) {
						var i = this.readDigits();
						h1.set(i, this.unserialize());
						c2 = this.get(this.pos++);
					}
					if (c2 != 104) throw "Invalid IntMap format";
					return h1;
				case 77:
					var h2 = new haxe.ds.ObjectMap();
					this.cache.push(h2);
					var buf4 = this.buf;
					while (this.buf.charCodeAt(this.pos) != 104) {
						var s2 = this.unserialize();
						h2.set(s2, this.unserialize());
					}
					this.pos++;
					return h2;
				case 118:
					var d;
					var s3 = HxOverrides.substr(this.buf, this.pos, 19);
					d = HxOverrides.strDate(s3);
					this.cache.push(d);
					this.pos += 19;
					return d;
				case 115:
					var len1 = this.readDigits();
					var buf5 = this.buf;
					if (this.get(this.pos++) != 58 || this.length - this.pos < len1) throw "Invalid bytes length";
					var codes = haxe.Unserializer.CODES;
					if (codes == null) {
						codes = haxe.Unserializer.initCodes();
						haxe.Unserializer.CODES = codes;
					}
					var i1 = this.pos;
					var rest = len1 & 3;
					var size;
					size = (len1 >> 2) * 3 + (rest >= 2 ? rest - 1 : 0);
					var max = i1 + (len1 - rest);
					var bytes = haxe.io.Bytes.alloc(size);
					var bpos = 0;
					while (i1 < max) {
						var c11 = codes[StringTools.fastCodeAt(buf5, i1++)];
						var c21 = codes[StringTools.fastCodeAt(buf5, i1++)];
						bytes.set(bpos++, c11 << 2 | c21 >> 4);
						var c3 = codes[StringTools.fastCodeAt(buf5, i1++)];
						bytes.set(bpos++, c21 << 4 | c3 >> 2);
						var c4 = codes[StringTools.fastCodeAt(buf5, i1++)];
						bytes.set(bpos++, c3 << 6 | c4);
					}
					if (rest >= 2) {
						var c12 = codes[StringTools.fastCodeAt(buf5, i1++)];
						var c22 = codes[StringTools.fastCodeAt(buf5, i1++)];
						bytes.set(bpos++, c12 << 2 | c22 >> 4);
						if (rest == 3) {
							var c31 = codes[StringTools.fastCodeAt(buf5, i1++)];
							bytes.set(bpos++, c22 << 4 | c31 >> 2);
						}
					}
					this.pos += len1;
					this.cache.push(bytes);
					return bytes;
				case 67:
					var name3 = this.unserialize();
					var cl1 = this.resolver.resolveClass(name3);
					if (cl1 == null) throw "Class not found " + name3;
					var o2 = Type.createEmptyInstance(cl1);
					this.cache.push(o2);
					o2.hxUnserialize(this);
					if (this.get(this.pos++) != 103) throw "Invalid custom data";
					return o2;
				default:
			}
			this.pos--;
			throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
		}, __class__: haxe.Unserializer
	};
	haxe.ds = {};
	haxe.ds.IntMap = function () {
		this.h = { };
	};
	$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
	haxe.ds.IntMap.__name__ = ["haxe", "ds", "IntMap"];
	haxe.ds.IntMap.__interfaces__ = [IMap];
	haxe.ds.IntMap.prototype = {
		set: function (key, value) {
			this.h[key] = value;
		}, get: function (key) {
			return this.h[key];
		}, keys: function () {
			var a = [];
			for (var key in this.h) {
				if (this.h.hasOwnProperty(key)) a.push(key | 0);
			}
			return HxOverrides.iter(a);
		}, __class__: haxe.ds.IntMap
	};
	haxe.ds.ObjectMap = function () {
		this.h = { };
		this.h.__keys__ = { };
	};
	$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
	haxe.ds.ObjectMap.__name__ = ["haxe", "ds", "ObjectMap"];
	haxe.ds.ObjectMap.__interfaces__ = [IMap];
	haxe.ds.ObjectMap.prototype = {
		set: function (key, value) {
			var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
			this.h[id] = value;
			this.h.__keys__[id] = key;
		}, get: function (key) {
			return this.h[key.__id__];
		}, keys: function () {
			var a = [];
			for (var key in this.h.__keys__) {
				if (this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
			}
			return HxOverrides.iter(a);
		}, __class__: haxe.ds.ObjectMap
	};
	haxe.ds.StringMap = function () {
		this.h = { };
	};
	$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
	haxe.ds.StringMap.__name__ = ["haxe", "ds", "StringMap"];
	haxe.ds.StringMap.__interfaces__ = [IMap];
	haxe.ds.StringMap.prototype = {
		set: function (key, value) {
			this.h["$" + key] = value;
		}, get: function (key) {
			return this.h["$" + key];
		}, exists: function (key) {
			return this.h.hasOwnProperty("$" + key);
		}, remove: function (key) {
			key = "$" + key;
			if (!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}, keys: function () {
			var a = [];
			for (var key in this.h) {
				if (this.h.hasOwnProperty(key)) a.push(key.substr(1));
			}
			return HxOverrides.iter(a);
		}, __class__: haxe.ds.StringMap
	};
	haxe.io = {};
	haxe.io.Bytes = function (length, b) {
		this.length = length;
		this.b = b;
	};
	$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
	haxe.io.Bytes.__name__ = ["haxe", "io", "Bytes"];
	haxe.io.Bytes.alloc = function (length) {
		var a = new Array();
		var _g = 0;
		while (_g < length) {
			var i = _g++;
			a.push(0);
		}
		return new haxe.io.Bytes(length, a);
	};
	haxe.io.Bytes.prototype = {
		get: function (pos) {
			return this.b[pos];
		}, set: function (pos, v) {
			this.b[pos] = v & 255;
		}, __class__: haxe.io.Bytes
	};
	var js = {};
	js.Boot = function () {
	};
	$hxClasses["js.Boot"] = js.Boot;
	js.Boot.__name__ = ["js", "Boot"];
	js.Boot.__unhtml = function (s) {
		return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	};
	js.Boot.__trace = function (v, i) {
		var msg;
		if (i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
		msg += js.Boot.__string_rec(v, "");
		if (i != null && i.customParams != null) {
			var _g = 0;
			var _g1 = i.customParams;
			while (_g < _g1.length) {
				var v1 = _g1[_g];
				++_g;
				msg += "," + js.Boot.__string_rec(v1, "");
			}
		}
		var d;
		if (typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if (typeof console != "undefined" && console.log != null) console.log(msg);
	};
	js.Boot.getClass = function (o) {
		if ((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
	};
	js.Boot.__string_rec = function (o, s) {
		if (o == null) return "null";
		if (s.length >= 5) return "<...>";
		var t = typeof(o);
		if (t == "function" && (o.__name__ || o.__ename__)) t = "object";
		switch (t) {
			case "object":
				if (o instanceof Array) {
					if (o.__enum__) {
						if (o.length == 2) return o[0];
						var str = o[0] + "(";
						s += "\t";
						var _g1 = 2;
						var _g = o.length;
						while (_g1 < _g) {
							var i = _g1++;
							if (i != 2) str += "," + js.Boot.__string_rec(o[i], s); else str += js.Boot.__string_rec(o[i], s);
						}
						return str + ")";
					}
					var l = o.length;
					var i1;
					var str1 = "[";
					s += "\t";
					var _g2 = 0;
					while (_g2 < l) {
						var i2 = _g2++;
						str1 += (i2 > 0 ? "," : "") + js.Boot.__string_rec(o[i2], s);
					}
					str1 += "]";
					return str1;
				}
				var tostr;
				try {
					tostr = o.toString;
				} catch (e) {
					return "???";
				}
				if (tostr != null && tostr != Object.toString) {
					var s2 = o.toString();
					if (s2 != "[object Object]") return s2;
				}
				var k = null;
				var str2 = "{\n";
				s += "\t";
				var hasp = o.hasOwnProperty != null;
				for (var k in o) {
					if (hasp && !o.hasOwnProperty(k)) {
						continue;
					}
					if (k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
						continue;
					}
					if (str2.length != 2) str2 += ", \n";
					str2 += s + k + " : " + js.Boot.__string_rec(o[k], s);
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
	js.Boot.__interfLoop = function (cc, cl) {
		if (cc == null) return false;
		if (cc == cl) return true;
		var intf = cc.__interfaces__;
		if (intf != null) {
			var _g1 = 0;
			var _g = intf.length;
			while (_g1 < _g) {
				var i = _g1++;
				var i1 = intf[i];
				if (i1 == cl || js.Boot.__interfLoop(i1, cl)) return true;
			}
		}
		return js.Boot.__interfLoop(cc.__super__, cl);
	};
	js.Boot.__instanceof = function (o, cl) {
		if (cl == null) return false;
		switch (cl) {
			case Int:
				return (o | 0) === o;
			case Float:
				return typeof(o) == "number";
			case Bool:
				return typeof(o) == "boolean";
			case String:
				return typeof(o) == "string";
			case Array:
				return (o instanceof Array) && o.__enum__ == null;
			case Dynamic:
				return true;
			default:
				if (o != null) {
					if (typeof(cl) == "function") {
						if (o instanceof cl) return true;
						if (js.Boot.__interfLoop(js.Boot.getClass(o), cl)) return true;
					}
				} else return false;
				if (cl == Class && o.__name__ != null) return true;
				if (cl == Enum && o.__ename__ != null) return true;
				return o.__enum__ == cl;
		}
	};
	js.Browser = function () {
	};
	$hxClasses["js.Browser"] = js.Browser;
	js.Browser.__name__ = ["js", "Browser"];
	js.Browser.createXMLHttpRequest = function () {
		if (typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
		if (typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
		throw "Unable to create XMLHttpRequest object.";
	};
	var mconsole = {};
	mconsole.PrinterBase = function () {
		this.printPosition = true;
		this.printLineNumbers = true;
	};
	$hxClasses["mconsole.PrinterBase"] = mconsole.PrinterBase;
	mconsole.PrinterBase.__name__ = ["mconsole", "PrinterBase"];
	mconsole.PrinterBase.prototype = {
		print: function (level, params, indent, pos) {
			params = params.slice();
			var _g1 = 0;
			var _g = params.length;
			while (_g1 < _g) {
				var i = _g1++;
				params[i] = Std.string(params[i]);
			}
			var message = params.join(", ");
			var nextPosition = "@ " + pos.className + "." + pos.methodName;
			var nextLineNumber;
			if (pos.lineNumber == null) nextLineNumber = "null"; else nextLineNumber = "" + pos.lineNumber;
			var lineColumn = "";
			var emptyLineColumn = "";
			if (this.printPosition) {
				if (nextPosition != this.position) this.printLine(mconsole.ConsoleColor.none, nextPosition, pos);
			}
			if (this.printLineNumbers) {
				emptyLineColumn = StringTools.lpad("", " ", 5);
				if (nextPosition != this.position || nextLineNumber != this.lineNumber) lineColumn = StringTools.lpad(nextLineNumber, " ", 4) + " "; else lineColumn = emptyLineColumn;
			}
			this.position = nextPosition;
			this.lineNumber = nextLineNumber;
			var color;
			switch (level[1]) {
				case 0:
					color = mconsole.ConsoleColor.white;
					break;
				case 1:
					color = mconsole.ConsoleColor.blue;
					break;
				case 2:
					color = mconsole.ConsoleColor.green;
					break;
				case 3:
					color = mconsole.ConsoleColor.yellow;
					break;
				case 4:
					color = mconsole.ConsoleColor.red;
					break;
			}
			var indent1 = StringTools.lpad("", " ", indent * 2);
			message = lineColumn + indent1 + message;
			message = message.split("\n").join("\n" + emptyLineColumn + indent1);
			this.printLine(color, message, pos);
		}, printLine: function (color, line, pos) {
			throw "method not implemented in ConsolePrinterBase";
		}, __class__: mconsole.PrinterBase
	};
	mconsole.Printer = function () {
	};
	$hxClasses["mconsole.Printer"] = mconsole.Printer;
	mconsole.Printer.__name__ = ["mconsole", "Printer"];
	mconsole.Printer.prototype = {
		__class__: mconsole.Printer
	};
	mconsole.ConsoleView = function () {
		mconsole.PrinterBase.call(this);
		this.atBottom = true;
		this.projectHome = "/media/shared/home/david/Public/BikeWar/BikeWar/Player/";
		var document = window.document;
		this.element = document.createElement("pre");
		this.element.id = "console";
		var style = document.createElement("style");
		this.element.appendChild(style);
		var rules = document.createTextNode("#console {\r\n\tfont-family:monospace;\r\n\tbackground-color:#002B36;\r\n\tbackground-color:rgba(0%,16.9%,21.2%,0.95);\r\n\tpadding:8px;\r\n\theight:600px;\r\n\tmax-height:600px;\r\n\toverflow-y:scroll;\r\n\tposition:absolute;\r\n\tleft:0px;\r\n\ttop:0px;\r\n\tright:0px;\r\n\tmargin:0px;\r\n\tz-index:10000;\r\n}\r\n#console a { text-decoration:none; }\r\n#console a:hover div { background-color:#063642 }\r\n#console a div span { display:none; float:right; color:white; }\r\n#console a:hover div span { display:block; }");
		style.type = "text/css";
		if (style.styleSheet) style.styleSheet.cssText = rules.nodeValue; else style.appendChild(rules);
		var me = this;
		this.element.onscroll = function (e) {
			me.updateScroll();
		};
	};
	$hxClasses["mconsole.ConsoleView"] = mconsole.ConsoleView;
	mconsole.ConsoleView.__name__ = ["mconsole", "ConsoleView"];
	mconsole.ConsoleView.__interfaces__ = [mconsole.Printer];
	mconsole.ConsoleView.__super__ = mconsole.PrinterBase;
	mconsole.ConsoleView.prototype = $extend(mconsole.PrinterBase.prototype, {
		updateScroll: function () {
			this.atBottom = this.element.scrollTop - (this.element.scrollHeight - this.element.clientHeight) == 0;
		}, printLine: function (color, line, pos) {
			var style;
			switch (color[1]) {
				case 0:
					style = "#839496";
					break;
				case 1:
					style = "#ffffff";
					break;
				case 2:
					style = "#248bd2";
					break;
				case 3:
					style = "#859900";
					break;
				case 4:
					style = "#b58900";
					break;
				case 5:
					style = "#dc322f";
					break;
			}
			var file = pos.fileName + ":" + pos.lineNumber;
			var fileName = pos.className.split(".").join("/") + ".hx";
			var link = "";
			this.element.innerHTML = this.element.innerHTML + "<a" + link + "><div style='color:" + style + "'>" + line + "<span>" + file + "</span></div></a>";
			if (this.atBottom) this.element.scrollTop = this.element.scrollHeight;
		}, attach: function () {
			window.document.body.appendChild(this.element);
		}, remove: function () {
			window.document.body.removeChild(this.element);
		}, __class__: mconsole.ConsoleView
	});
	mconsole.Console = function () {
	};
	$hxClasses["mconsole.Console"] = mconsole.Console;
	mconsole.Console.__name__ = ["mconsole", "Console"];
	mconsole.Console.start = function () {
		if (mconsole.Console.running) return;
		mconsole.Console.running = true;
		mconsole.Console.previousTrace = haxe.Log.trace;
		haxe.Log.trace = mconsole.Console.haxeTrace;
		if (mconsole.Console.hasConsole) {
		} else {
		}
	};
	mconsole.Console.stop = function () {
		if (!mconsole.Console.running) return;
		mconsole.Console.running = false;
		haxe.Log.trace = mconsole.Console.previousTrace;
		mconsole.Console.previousTrace = null;
	};
	mconsole.Console.addPrinter = function (printer) {
		mconsole.Console.removePrinter(printer);
		mconsole.Console.printers.push(printer);
	};
	mconsole.Console.removePrinter = function (printer) {
		HxOverrides.remove(mconsole.Console.printers, printer);
	};
	mconsole.Console.haxeTrace = function (value, pos) {
		var params = pos.customParams;
		if (params == null) params = []; else pos.customParams = null;
		var level;
		switch (value) {
			case "log":
				level = mconsole.LogLevel.log;
				break;
			case "warn":
				level = mconsole.LogLevel.warn;
				break;
			case "info":
				level = mconsole.LogLevel.info;
				break;
			case "debug":
				level = mconsole.LogLevel.debug;
				break;
			case "error":
				level = mconsole.LogLevel.error;
				break;
			default:
				params.unshift(value);
				level = mconsole.LogLevel.log;
		}
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole(Std.string(level), params);
		mconsole.Console.print(level, params, pos);
	};
	mconsole.Console.print = function (level, params, pos) {
		var _g = 0;
		var _g1 = mconsole.Console.printers;
		while (_g < _g1.length) {
			var printer = _g1[_g];
			++_g;
			printer.print(level, params, mconsole.Console.groupDepth, pos);
		}
	};
	mconsole.Console.log = function (message, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("log", [message]);
		mconsole.Console.print(mconsole.LogLevel.log, [message], pos);
	};
	mconsole.Console.info = function (message, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("info", [message]);
		mconsole.Console.print(mconsole.LogLevel.info, [message], pos);
	};
	mconsole.Console.debug = function (message, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("debug", [message]);
		mconsole.Console.print(mconsole.LogLevel.debug, [message], pos);
	};
	mconsole.Console.warn = function (message, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("warn", [message]);
		mconsole.Console.print(mconsole.LogLevel.warn, [message], pos);
	};
	mconsole.Console.error = function (message, stack, pos) {
		if (stack == null) stack = haxe.CallStack.callStack();
		var stackTrace;
		if (stack.length > 0) stackTrace = "\n" + mconsole.StackHelper.toString(stack); else stackTrace = "";
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("error", [message]);
		mconsole.Console.print(mconsole.LogLevel.error, ["Error: " + Std.string(message) + stackTrace], pos);
	};
	mconsole.Console.trace = function (pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("trace", []);
		var stack = mconsole.StackHelper.toString(haxe.CallStack.callStack());
		mconsole.Console.print(mconsole.LogLevel.error, ["Stack trace:\n" + stack], pos);
	};
	mconsole.Console.assert = function (expression, message, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("assert", [expression, message]);
		if (!expression) {
			var stack = mconsole.StackHelper.toString(haxe.CallStack.callStack());
			mconsole.Console.print(mconsole.LogLevel.error, ["Assertion failed: " + Std.string(message) + "\n" + stack], pos);
			throw message;
		}
	};
	mconsole.Console.count = function (title, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("count", [title]);
		var position = pos.fileName + ":" + pos.lineNumber;
		var count;
		if (mconsole.Console.counts.exists(position)) count = mconsole.Console.counts.get(position) + 1; else count = 1;
		mconsole.Console.counts.set(position, count);
		mconsole.Console.print(mconsole.LogLevel.log, [title + ": " + count], pos);
	};
	mconsole.Console.group = function (message, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("group", [message]);
		mconsole.Console.print(mconsole.LogLevel.log, [message], pos);
		mconsole.Console.groupDepth += 1;
	};
	mconsole.Console.groupEnd = function (pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("groupEnd", []);
		if (mconsole.Console.groupDepth > 0) mconsole.Console.groupDepth -= 1;
	};
	mconsole.Console.time = function (name, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("time", [name]);
		mconsole.Console.times.set(name, haxe.Timer.stamp());
	};
	mconsole.Console.timeEnd = function (name, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("timeEnd", [name]);
		if (mconsole.Console.times.exists(name)) {
			mconsole.Console.print(mconsole.LogLevel.log, [name + ": " + Std["int"]((haxe.Timer.stamp() - mconsole.Console.times.get(name)) * 1000) + "ms"], pos);
			mconsole.Console.times.remove(name);
		}
	};
	mconsole.Console.markTimeline = function (label, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("markTimeline", [label]);
	};
	mconsole.Console.profile = function (title, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("profile", [title]);
	};
	mconsole.Console.profileEnd = function (title, pos) {
		if (mconsole.Console.hasConsole) mconsole.Console.callConsole("profileEnd", [title]);
	};
	mconsole.Console.enterDebugger = function () {
		debugger;
	};
	mconsole.Console.detectConsole = function () {
		if (console != null && console[mconsole.Console.dirxml] == null) mconsole.Console.dirxml = "log";
		return console != undefined && console.log != undefined && console.warn != undefined;
	};
	mconsole.Console.callConsole = function (method, params) {
		if (console[method] != null) {
			if (method == "log" && js.Boot.__instanceof(params[0], Xml)) method = mconsole.Console.dirxml;
			if (console[method].apply != null) console[method].apply(console, mconsole.Console.toConsoleValues(params)); else if (Function.prototype.bind != null) Function.prototype.bind.call(console[method], console).apply(console, mconsole.Console.toConsoleValues(params));
		}
	};
	mconsole.Console.toConsoleValues = function (params) {
		var _g1 = 0;
		var _g = params.length;
		while (_g1 < _g) {
			var i = _g1++;
			params[i] = mconsole.Console.toConsoleValue(params[i]);
		}
		return params;
	};
	mconsole.Console.toConsoleValue = function (value) {
		var typeClass = Type.getClass(value);
		var typeName;
		if (typeClass == null) typeName = ""; else typeName = Type.getClassName(typeClass);
		if (typeName == "Xml") {
			var parser = new DOMParser();
			return parser.parseFromString(value.toString(), "text/xml").firstChild;
		} else if (typeName == "Map" || typeName == "StringMap" || typeName == "IntMap") {
			var $native = { };
			var map = value;
			var $it0 = map.keys();
			while ($it0.hasNext()) {
				var key = $it0.next();
				Reflect.setField($native, Std.string(key), mconsole.Console.toConsoleValue(map.get(key)));
			}
			return $native;
		} else {
			{
				var _g = Type["typeof"](value);
				switch (_g[1]) {
					case 7:
						var e = _g[2];
						var native1 = [];
						var name = Type.getEnumName(e) + "." + Type.enumConstructor(value);
						var params = Type.enumParameters(value);
						if (params.length > 0) {
							native1.push(name + "(");
							var _g2 = 0;
							var _g1 = params.length;
							while (_g2 < _g1) {
								var i = _g2++;
								native1.push(mconsole.Console.toConsoleValue(params[i]));
							}
							native1.push(")");
						} else return [name];
						return native1;
					default:
				}
			}
			if (typeName == "Array" || typeName == "List" || typeName == "haxe.FastList") {
				var native2 = [];
				var iterable = value;
				var $it1 = $iterator(iterable)();
				while ($it1.hasNext()) {
					var i1 = $it1.next();
					native2.push(mconsole.Console.toConsoleValue(i1));
				}
				return native2;
			}
		}
		return value;
	};
	mconsole.ConsoleMacro = function () {
	};
	$hxClasses["mconsole.ConsoleMacro"] = mconsole.ConsoleMacro;
	mconsole.ConsoleMacro.__name__ = ["mconsole", "ConsoleMacro"];
	mconsole.LogLevel = $hxClasses["mconsole.LogLevel"] = { __ename__: ["mconsole", "LogLevel"], __constructs__: ["log", "info", "debug", "warn", "error"] };
	mconsole.LogLevel.log = ["log", 0];
	mconsole.LogLevel.log.toString = $estr;
	mconsole.LogLevel.log.__enum__ = mconsole.LogLevel;
	mconsole.LogLevel.info = ["info", 1];
	mconsole.LogLevel.info.toString = $estr;
	mconsole.LogLevel.info.__enum__ = mconsole.LogLevel;
	mconsole.LogLevel.debug = ["debug", 2];
	mconsole.LogLevel.debug.toString = $estr;
	mconsole.LogLevel.debug.__enum__ = mconsole.LogLevel;
	mconsole.LogLevel.warn = ["warn", 3];
	mconsole.LogLevel.warn.toString = $estr;
	mconsole.LogLevel.warn.__enum__ = mconsole.LogLevel;
	mconsole.LogLevel.error = ["error", 4];
	mconsole.LogLevel.error.toString = $estr;
	mconsole.LogLevel.error.__enum__ = mconsole.LogLevel;
	mconsole.ConsoleColor = $hxClasses["mconsole.ConsoleColor"] = { __ename__: ["mconsole", "ConsoleColor"], __constructs__: ["none", "white", "blue", "green", "yellow", "red"] };
	mconsole.ConsoleColor.none = ["none", 0];
	mconsole.ConsoleColor.none.toString = $estr;
	mconsole.ConsoleColor.none.__enum__ = mconsole.ConsoleColor;
	mconsole.ConsoleColor.white = ["white", 1];
	mconsole.ConsoleColor.white.toString = $estr;
	mconsole.ConsoleColor.white.__enum__ = mconsole.ConsoleColor;
	mconsole.ConsoleColor.blue = ["blue", 2];
	mconsole.ConsoleColor.blue.toString = $estr;
	mconsole.ConsoleColor.blue.__enum__ = mconsole.ConsoleColor;
	mconsole.ConsoleColor.green = ["green", 3];
	mconsole.ConsoleColor.green.toString = $estr;
	mconsole.ConsoleColor.green.__enum__ = mconsole.ConsoleColor;
	mconsole.ConsoleColor.yellow = ["yellow", 4];
	mconsole.ConsoleColor.yellow.toString = $estr;
	mconsole.ConsoleColor.yellow.__enum__ = mconsole.ConsoleColor;
	mconsole.ConsoleColor.red = ["red", 5];
	mconsole.ConsoleColor.red.toString = $estr;
	mconsole.ConsoleColor.red.__enum__ = mconsole.ConsoleColor;
	mconsole.StackHelper = function () {
	};
	$hxClasses["mconsole.StackHelper"] = mconsole.StackHelper;
	mconsole.StackHelper.__name__ = ["mconsole", "StackHelper"];
	mconsole.StackHelper.createFilters = function () {
		var filters = new haxe.ds.StringMap();
		filters.set("@ mconsole.ConsoleRedirect.haxeTrace:59", true);
		return filters;
	};
	mconsole.StackHelper.toString = function (stack) {
		return "null";
	};
	mconsole.StackItemHelper = function () {
	};
	$hxClasses["mconsole.StackItemHelper"] = mconsole.StackItemHelper;
	mconsole.StackItemHelper.__name__ = ["mconsole", "StackItemHelper"];
	mconsole.StackItemHelper.toString = function (item, isFirst) {
		if (isFirst == null) isFirst = false;
		switch (item[1]) {
			case 1:
				var module = item[2];
				return module;
			case 3:
				var method = item[3];
				var className = item[2];
				return className + "." + method;
			case 4:
				var v = item[2];
				return "LocalFunction(" + v + ")";
			case 2:
				var line = item[4];
				var file = item[3];
				var s = item[2];
				return (s == null ? file.split("::").join(".") + ":" + line : mconsole.StackItemHelper.toString(s)) + ":" + line;
			case 0:
				return "(anonymous function)";
		}
	};
	var msignal = {};
	msignal.Signal = function (valueClasses) {
		if (valueClasses == null) valueClasses = [];
		this.valueClasses = valueClasses;
		this.slots = msignal.SlotList.NIL;
		this.priorityBased = false;
	};
	$hxClasses["msignal.Signal"] = msignal.Signal;
	msignal.Signal.__name__ = ["msignal", "Signal"];
	msignal.Signal.prototype = {
		add: function (listener) {
			return this.registerListener(listener);
		}, addOnce: function (listener) {
			return this.registerListener(listener, true);
		}, addWithPriority: function (listener, priority) {
			if (priority == null) priority = 0;
			return this.registerListener(listener, false, priority);
		}, addOnceWithPriority: function (listener, priority) {
			if (priority == null) priority = 0;
			return this.registerListener(listener, true, priority);
		}, remove: function (listener) {
			var slot = this.slots.find(listener);
			if (slot == null) return null;
			this.slots = this.slots.filterNot(listener);
			return slot;
		}, removeAll: function () {
			this.slots = msignal.SlotList.NIL;
		}, registerListener: function (listener, once, priority) {
			if (priority == null) priority = 0;
			if (once == null) once = false;
			if (this.registrationPossible(listener, once)) {
				var newSlot = this.createSlot(listener, once, priority);
				if (!this.priorityBased && priority != 0) this.priorityBased = true;
				if (!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
				return newSlot;
			}
			return this.slots.find(listener);
		}, registrationPossible: function (listener, once) {
			if (!this.slots.nonEmpty) return true;
			var existingSlot = this.slots.find(listener);
			if (existingSlot == null) return true;
			return false;
		}, createSlot: function (listener, once, priority) {
			if (priority == null) priority = 0;
			if (once == null) once = false;
			return null;
		}, get_numListeners: function () {
			return this.slots.get_length();
		}, __class__: msignal.Signal
	};
	msignal.Signal0 = function () {
		msignal.Signal.call(this);
	};
	$hxClasses["msignal.Signal0"] = msignal.Signal0;
	msignal.Signal0.__name__ = ["msignal", "Signal0"];
	msignal.Signal0.__super__ = msignal.Signal;
	msignal.Signal0.prototype = $extend(msignal.Signal.prototype, {
		dispatch: function () {
			var slotsToProcess = this.slots;
			while (slotsToProcess.nonEmpty) {
				slotsToProcess.head.execute();
				slotsToProcess = slotsToProcess.tail;
			}
		}, createSlot: function (listener, once, priority) {
			if (priority == null) priority = 0;
			if (once == null) once = false;
			return new msignal.Slot0(this, listener, once, priority);
		}, __class__: msignal.Signal0
	});
	msignal.Signal1 = function (type) {
		msignal.Signal.call(this, [type]);
	};
	$hxClasses["msignal.Signal1"] = msignal.Signal1;
	msignal.Signal1.__name__ = ["msignal", "Signal1"];
	msignal.Signal1.__super__ = msignal.Signal;
	msignal.Signal1.prototype = $extend(msignal.Signal.prototype, {
		dispatch: function (value) {
			var slotsToProcess = this.slots;
			while (slotsToProcess.nonEmpty) {
				slotsToProcess.head.execute(value);
				slotsToProcess = slotsToProcess.tail;
			}
		}, createSlot: function (listener, once, priority) {
			if (priority == null) priority = 0;
			if (once == null) once = false;
			return new msignal.Slot1(this, listener, once, priority);
		}, __class__: msignal.Signal1
	});
	msignal.Signal2 = function (type1, type2) {
		msignal.Signal.call(this, [type1, type2]);
	};
	$hxClasses["msignal.Signal2"] = msignal.Signal2;
	msignal.Signal2.__name__ = ["msignal", "Signal2"];
	msignal.Signal2.__super__ = msignal.Signal;
	msignal.Signal2.prototype = $extend(msignal.Signal.prototype, {
		dispatch: function (value1, value2) {
			var slotsToProcess = this.slots;
			while (slotsToProcess.nonEmpty) {
				slotsToProcess.head.execute(value1, value2);
				slotsToProcess = slotsToProcess.tail;
			}
		}, createSlot: function (listener, once, priority) {
			if (priority == null) priority = 0;
			if (once == null) once = false;
			return new msignal.Slot2(this, listener, once, priority);
		}, __class__: msignal.Signal2
	});
	msignal.Slot = function (signal, listener, once, priority) {
		if (priority == null) priority = 0;
		if (once == null) once = false;
		this.signal = signal;
		this.set_listener(listener);
		this.once = once;
		this.priority = priority;
		this.enabled = true;
	};
	$hxClasses["msignal.Slot"] = msignal.Slot;
	msignal.Slot.__name__ = ["msignal", "Slot"];
	msignal.Slot.prototype = {
		remove: function () {
			this.signal.remove(this.listener);
		}, set_listener: function (value) {
			return this.listener = value;
		}, __class__: msignal.Slot
	};
	msignal.Slot0 = function (signal, listener, once, priority) {
		if (priority == null) priority = 0;
		if (once == null) once = false;
		msignal.Slot.call(this, signal, listener, once, priority);
	};
	$hxClasses["msignal.Slot0"] = msignal.Slot0;
	msignal.Slot0.__name__ = ["msignal", "Slot0"];
	msignal.Slot0.__super__ = msignal.Slot;
	msignal.Slot0.prototype = $extend(msignal.Slot.prototype, {
		execute: function () {
			if (!this.enabled) return;
			if (this.once) this.remove();
			this.listener();
		}, __class__: msignal.Slot0
	});
	msignal.Slot1 = function (signal, listener, once, priority) {
		if (priority == null) priority = 0;
		if (once == null) once = false;
		msignal.Slot.call(this, signal, listener, once, priority);
	};
	$hxClasses["msignal.Slot1"] = msignal.Slot1;
	msignal.Slot1.__name__ = ["msignal", "Slot1"];
	msignal.Slot1.__super__ = msignal.Slot;
	msignal.Slot1.prototype = $extend(msignal.Slot.prototype, {
		execute: function (value1) {
			if (!this.enabled) return;
			if (this.once) this.remove();
			if (this.param != null) value1 = this.param;
			this.listener(value1);
		}, __class__: msignal.Slot1
	});
	msignal.Slot2 = function (signal, listener, once, priority) {
		if (priority == null) priority = 0;
		if (once == null) once = false;
		msignal.Slot.call(this, signal, listener, once, priority);
	};
	$hxClasses["msignal.Slot2"] = msignal.Slot2;
	msignal.Slot2.__name__ = ["msignal", "Slot2"];
	msignal.Slot2.__super__ = msignal.Slot;
	msignal.Slot2.prototype = $extend(msignal.Slot.prototype, {
		execute: function (value1, value2) {
			if (!this.enabled) return;
			if (this.once) this.remove();
			if (this.param1 != null) value1 = this.param1;
			if (this.param2 != null) value2 = this.param2;
			this.listener(value1, value2);
		}, __class__: msignal.Slot2
	});
	msignal.SlotList = function (head, tail) {
		this.nonEmpty = false;
		if (head == null && tail == null) this.nonEmpty = false; else if (head == null) {
		} else {
			this.head = head;
			if (tail == null) this.tail = msignal.SlotList.NIL; else this.tail = tail;
			this.nonEmpty = true;
		}
	};
	$hxClasses["msignal.SlotList"] = msignal.SlotList;
	msignal.SlotList.__name__ = ["msignal", "SlotList"];
	msignal.SlotList.prototype = {
		get_length: function () {
			if (!this.nonEmpty) return 0;
			if (this.tail == msignal.SlotList.NIL) return 1;
			var result = 0;
			var p = this;
			while (p.nonEmpty) {
				++result;
				p = p.tail;
			}
			return result;
		}, prepend: function (slot) {
			return new msignal.SlotList(slot, this);
		}, append: function (slot) {
			if (slot == null) return this;
			if (!this.nonEmpty) return new msignal.SlotList(slot);
			if (this.tail == msignal.SlotList.NIL) return new msignal.SlotList(slot).prepend(this.head);
			var wholeClone = new msignal.SlotList(this.head);
			var subClone = wholeClone;
			var current = this.tail;
			while (current.nonEmpty) {
				subClone = subClone.tail = new msignal.SlotList(current.head);
				current = current.tail;
			}
			subClone.tail = new msignal.SlotList(slot);
			return wholeClone;
		}, insertWithPriority: function (slot) {
			if (!this.nonEmpty) return new msignal.SlotList(slot);
			var priority = slot.priority;
			if (priority >= this.head.priority) return this.prepend(slot);
			var wholeClone = new msignal.SlotList(this.head);
			var subClone = wholeClone;
			var current = this.tail;
			while (current.nonEmpty) {
				if (priority > current.head.priority) {
					subClone.tail = current.prepend(slot);
					return wholeClone;
				}
				subClone = subClone.tail = new msignal.SlotList(current.head);
				current = current.tail;
			}
			subClone.tail = new msignal.SlotList(slot);
			return wholeClone;
		}, filterNot: function (listener) {
			if (!this.nonEmpty || listener == null) return this;
			if (Reflect.compareMethods(this.head.listener, listener)) return this.tail;
			var wholeClone = new msignal.SlotList(this.head);
			var subClone = wholeClone;
			var current = this.tail;
			while (current.nonEmpty) {
				if (Reflect.compareMethods(current.head.listener, listener)) {
					subClone.tail = current.tail;
					return wholeClone;
				}
				subClone = subClone.tail = new msignal.SlotList(current.head);
				current = current.tail;
			}
			return this;
		}, contains: function (listener) {
			if (!this.nonEmpty) return false;
			var p = this;
			while (p.nonEmpty) {
				if (Reflect.compareMethods(p.head.listener, listener)) return true;
				p = p.tail;
			}
			return false;
		}, find: function (listener) {
			if (!this.nonEmpty) return null;
			var p = this;
			while (p.nonEmpty) {
				if (Reflect.compareMethods(p.head.listener, listener)) return p.head;
				p = p.tail;
			}
			return null;
		}, __class__: msignal.SlotList
	};
	var org = {};
	org.tamina = {};
	org.tamina.events = {};
	org.tamina.events.CreateJSEvent = function () {
	};
	$hxClasses["org.tamina.events.CreateJSEvent"] = org.tamina.events.CreateJSEvent;
	org.tamina.events.CreateJSEvent.__name__ = ["org", "tamina", "events", "CreateJSEvent"];
	org.tamina.geom = {};
	org.tamina.geom.Point = function (x, y) {
		if (y == null) y = 0;
		if (x == null) x = 0;
		this.x = x;
		this.y = y;
	};
	$hxClasses["org.tamina.geom.Point"] = org.tamina.geom.Point;
	org.tamina.geom.Point.__name__ = ["org", "tamina", "geom", "Point"];
	org.tamina.geom.Point.prototype = {
		__class__: org.tamina.geom.Point
	};
	org.tamina.geom.Junction = function (x, y, id) {
		if (id == null) id = "";
		if (y == null) y = 0;
		if (x == null) x = 0;
		org.tamina.geom.Point.call(this, x, y);
		this.links = new Array();
		this.id = id;
	};
	$hxClasses["org.tamina.geom.Junction"] = org.tamina.geom.Junction;
	org.tamina.geom.Junction.__name__ = ["org", "tamina", "geom", "Junction"];
	org.tamina.geom.Junction.__super__ = org.tamina.geom.Point;
	org.tamina.geom.Junction.prototype = $extend(org.tamina.geom.Point.prototype, {
		__class__: org.tamina.geom.Junction
	});
	org.tamina.log = {};
	org.tamina.log._LogLevel = {};
	org.tamina.log._LogLevel.LogLevel_Impl_ = function () {
	};
	$hxClasses["org.tamina.log._LogLevel.LogLevel_Impl_"] = org.tamina.log._LogLevel.LogLevel_Impl_;
	org.tamina.log._LogLevel.LogLevel_Impl_.__name__ = ["org", "tamina", "log", "_LogLevel", "LogLevel_Impl_"];
	org.tamina.log._LogLevel.LogLevel_Impl_.compareMinusOrEqual = function (this1, target) {
		return this1 <= target;
	};
	org.tamina.log.QuickLogger = function () {
	};
	$hxClasses["org.tamina.log.QuickLogger"] = org.tamina.log.QuickLogger;
	org.tamina.log.QuickLogger.__name__ = ["org", "tamina", "log", "QuickLogger"];
	org.tamina.log.QuickLogger.info = function (message, source) {
		if (org.tamina.log._LogLevel.LogLevel_Impl_.compareMinusOrEqual(org.tamina.log.QuickLogger.level, 0)) mconsole.Console.info((function ($this) {
			var $r;
			var _this = new Date();
			$r = HxOverrides.dateStr(_this);
			return $r;
		}(this)) + " [ INFO ] " + message, { fileName: "QuickLogger.hx", lineNumber: 18, className: "org.tamina.log.QuickLogger", methodName: "info"});
	};
	org.tamina.log.QuickLogger.debug = function (message, source) {
		if (org.tamina.log._LogLevel.LogLevel_Impl_.compareMinusOrEqual(org.tamina.log.QuickLogger.level, 1)) mconsole.Console.debug((function ($this) {
			var $r;
			var _this = new Date();
			$r = HxOverrides.dateStr(_this);
			return $r;
		}(this)) + " [ DEBUG ] " + message, { fileName: "QuickLogger.hx", lineNumber: 24, className: "org.tamina.log.QuickLogger", methodName: "debug"});
	};
	org.tamina.log.QuickLogger.warn = function (message, source) {
		if (org.tamina.log._LogLevel.LogLevel_Impl_.compareMinusOrEqual(org.tamina.log.QuickLogger.level, 2)) mconsole.Console.warn((function ($this) {
			var $r;
			var _this = new Date();
			$r = HxOverrides.dateStr(_this);
			return $r;
		}(this)) + " [ WARN ] " + message, { fileName: "QuickLogger.hx", lineNumber: 30, className: "org.tamina.log.QuickLogger", methodName: "warn"});
	};
	org.tamina.log.QuickLogger.error = function (message, source) {
		if (org.tamina.log._LogLevel.LogLevel_Impl_.compareMinusOrEqual(org.tamina.log.QuickLogger.level, 3)) mconsole.Console.error((function ($this) {
			var $r;
			var _this = new Date();
			$r = HxOverrides.dateStr(_this);
			return $r;
		}(this)) + " [ ERROR ] " + message, null, { fileName: "QuickLogger.hx", lineNumber: 36, className: "org.tamina.log.QuickLogger", methodName: "error"});
	};
	org.tamina.log.QuickLogger.profile = function () {
		if (org.tamina.log.QuickLogger._startProfilingDate != null) org.tamina.log.QuickLogger.debug("profling result : " + (new Date().getTime() - org.tamina.log.QuickLogger._startProfilingDate.getTime()) + " ms");
		org.tamina.log.QuickLogger._startProfilingDate = new Date();
	};
	org.tamina.utils = {};
	org.tamina.utils.DateUtils = function () {
	};
	$hxClasses["org.tamina.utils.DateUtils"] = org.tamina.utils.DateUtils;
	org.tamina.utils.DateUtils.__name__ = ["org", "tamina", "utils", "DateUtils"];
	org.tamina.utils.DateUtils.hourToFrenchString = function (pDate) {
		var result = "";
		var hours = Std.string(pDate.getHours());
		if (pDate.getHours() < 10) hours = "0" + hours;
		var minutes = Std.string(pDate.getMinutes());
		if (pDate.getMinutes() < 10) minutes = "0" + minutes;
		result = hours + "h" + minutes;
		return result;
	};
	org.tamina.utils.DateUtils.toFrenchString = function (pDate) {
		var month = Std.string(pDate.getMonth() + 1);
		if (pDate.getMonth() < 9) month = "0" + month;
		var day = Std.string(pDate.getDate());
		if (pDate.getDate() < 10) day = "0" + day;
		return day + "/" + month + "/" + pDate.getFullYear();
	};
	org.tamina.utils.UID = function () {
	};
	$hxClasses["org.tamina.utils.UID"] = org.tamina.utils.UID;
	org.tamina.utils.UID.__name__ = ["org", "tamina", "utils", "UID"];
	org.tamina.utils.UID.getUID = function () {
		var result = new Date().getTime();
		if (result <= org.tamina.utils.UID._lastUID) result = org.tamina.utils.UID._lastUID + 1;
		org.tamina.utils.UID._lastUID = result;
		return result;
	};
	org.tamina.view = {};
	org.tamina.view.Group = function () {
		createjs.Container.call(this);
	};
	$hxClasses["org.tamina.view.Group"] = org.tamina.view.Group;
	org.tamina.view.Group.__name__ = ["org", "tamina", "view", "Group"];
	org.tamina.view.Group.__super__ = createjs.Container;
	org.tamina.view.Group.prototype = $extend(createjs.Container.prototype, {
		addElement: function (element) {
			this.addChild(element);
		}, addElementAt: function (element, index) {
			this.addChildAt(element, index);
		}, getElementAt: function (index) {
			return this.getChildAt(index);
		}, __class__: org.tamina.view.Group
	});
	function $iterator(o) {
		if (o instanceof Array) return function () {
			return HxOverrides.iter(o);
		};
		return typeof(o.iterator) == 'function' ? $bind(o, o.iterator) : o.iterator;
	}

	var $_, $fid = 0;

	function $bind(o, m) {
		if (m == null) return null;
		if (m.__id__ == null) m.__id__ = $fid++;
		var f;
		if (o.hx__closures__ == null) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__];
		if (f == null) {
			f = function () {
				return f.method.apply(f.scope, arguments);
			};
			f.scope = o;
			f.method = m;
			o.hx__closures__[m.__id__] = f;
		}
		return f;
	}

	if (Array.prototype.indexOf) HxOverrides.indexOf = function (a, o, i) {
		return Array.prototype.indexOf.call(a, o, i);
	};
	Math.NaN = Number.NaN;
	Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
	Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
	$hxClasses.Math = Math;
	Math.isFinite = function (i) {
		return isFinite(i);
	};
	Math.isNaN = function (i1) {
		return isNaN(i1);
	};
	String.prototype.__class__ = $hxClasses.String = String;
	String.__name__ = ["String"];
	$hxClasses.Array = Array;
	Array.__name__ = ["Array"];
	Date.prototype.__class__ = $hxClasses.Date = Date;
	Date.__name__ = ["Date"];
	var Int = $hxClasses.Int = { __name__: ["Int"]};
	var Dynamic = $hxClasses.Dynamic = { __name__: ["Dynamic"]};
	var Float = $hxClasses.Float = Number;
	Float.__name__ = ["Float"];
	var Bool = $hxClasses.Bool = Boolean;
	Bool.__ename__ = ["Bool"];
	var Class = $hxClasses.Class = { __name__: ["Class"]};
	var Enum = { };
	Xml.Element = "element";
	Xml.PCData = "pcdata";
	Xml.CData = "cdata";
	Xml.Comment = "comment";
	Xml.DocType = "doctype";
	Xml.ProcessingInstruction = "processingInstruction";
	Xml.Document = "document";
	msignal.SlotList.NIL = new msignal.SlotList(null, null);
	com.tamina.bikewar.PlayerUI.DEFAULT_WIDTH = 1353;
	com.tamina.bikewar.PlayerUI.DEFAULT_HEIGHT = 549;
	com.tamina.bikewar.core.Global.SAVE_URL = "";
	com.tamina.bikewar.core.Global.REDIRECT_URL = "";
	com.tamina.bikewar.core.Global.IMG_BASE_PATH = "";
	com.tamina.bikewar.data.BattleResult.NONE = 0;
	com.tamina.bikewar.data.BattleResult.LOOSE = 1;
	com.tamina.bikewar.data.BattleResult.WIN = 2;
	com.tamina.bikewar.data.OrderType.MOVE = "move";
	com.tamina.bikewar.data.OrderType.LOAD = "load";
	com.tamina.bikewar.data.OrderType.UNLOAD = "unload";
	com.tamina.bikewar.data.OrderType.NONE = "none";
	com.tamina.bikewar.data.PlayerColor.BLUE = "#1494ea";
	com.tamina.bikewar.data.PlayerColor.RED = "#e41b4e";
	com.tamina.bikewar.game.Game.GAME_MAX_NUM_TURN = 250;
	com.tamina.bikewar.game.Game.GAME_SPEED = 1000;
	com.tamina.bikewar.game.Game.TRUCK_SPEED = 60;
	com.tamina.bikewar.game.Game.TRUCK_NUM_SLOT = 10;
	com.tamina.bikewar.game.Game.MAX_TURN_DURATION = 1000;
	com.tamina.bikewar.game.Game.TURN_TIME = 450000;
	com.tamina.bikewar.game.Game.MAX_SCORE = 2500;
	com.tamina.bikewar.ui.BikeStationSprite.PADDING_LEFT = 17;
	com.tamina.bikewar.ui.BikeStationSprite.PADDING_TOP = 25;
	com.tamina.bikewar.ui.UIElementId.APPLICATION_CANVAS = "applicationCanvas";
	com.tamina.bikewar.ui.UIElementId.PLAYER_ONE_NAME = "playerOneName";
	com.tamina.bikewar.ui.UIElementId.PLAYER_TWO_NAME = "playerTwoName";
	com.tamina.bikewar.ui.UIElementId.FIGHT_BUTTON = "fightButton";
	com.tamina.bikewar.ui.UIElementId.FIGHT_RUNNING_IMAGE = "fightRunningImage";
	com.tamina.bikewar.ui.UIElementId.TIME = "time";
	com.tamina.bikewar.ui.UIElementId.PLAYER_ONE_SCORE = "playerOneScore";
	com.tamina.bikewar.ui.UIElementId.PLAYER_TWO_SCORE = "playerTwoScore";
	com.tamina.bikewar.ui.UIElementId.PLAYER_ONE_SCOREBAR = "playerOneScoreBar";
	com.tamina.bikewar.ui.UIElementId.PLAYER_TWO_SCOREBAR = "playerTwoScoreBar";
	haxe.Serializer.USE_CACHE = false;
	haxe.Serializer.USE_ENUM_INDEX = false;
	haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
	haxe.Unserializer.DEFAULT_RESOLVER = Type;
	haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
	haxe.ds.ObjectMap.count = 0;
	mconsole.ConsoleView.CONSOLE_STYLES = "#console {\r\n\tfont-family:monospace;\r\n\tbackground-color:#002B36;\r\n\tbackground-color:rgba(0%,16.9%,21.2%,0.95);\r\n\tpadding:8px;\r\n\theight:600px;\r\n\tmax-height:600px;\r\n\toverflow-y:scroll;\r\n\tposition:absolute;\r\n\tleft:0px;\r\n\ttop:0px;\r\n\tright:0px;\r\n\tmargin:0px;\r\n\tz-index:10000;\r\n}\r\n#console a { text-decoration:none; }\r\n#console a:hover div { background-color:#063642 }\r\n#console a div span { display:none; float:right; color:white; }\r\n#console a:hover div span { display:block; }";
	mconsole.Console.defaultPrinter = new mconsole.ConsoleView();
	mconsole.Console.printers = [mconsole.Console.defaultPrinter];
	mconsole.Console.groupDepth = 0;
	mconsole.Console.times = new haxe.ds.StringMap();
	mconsole.Console.counts = new haxe.ds.StringMap();
	mconsole.Console.running = false;
	mconsole.Console.dirxml = "dirxml";
	mconsole.Console.hasConsole = mconsole.Console.detectConsole();
	mconsole.ConsoleMacro.__meta__ = { obj: { IgnoreCover: null}};
	mconsole.StackHelper.filters = mconsole.StackHelper.createFilters();
	org.tamina.events.CreateJSEvent.BITMAP_LOAD = "load";
	org.tamina.events.CreateJSEvent.MOUSE_UP = "pressup";
	org.tamina.events.CreateJSEvent.MOUSE_MOVE = "pressmove";
	org.tamina.events.CreateJSEvent.MOUSE_DOWN = "mousedown";
	org.tamina.events.CreateJSEvent.TICKER_TICK = "tick";
	org.tamina.events.CreateJSEvent.STAGE_MOUSE_UP = "stagemouseup";
	org.tamina.events.CreateJSEvent.STAGE_MOUSE_MOVE = "stagemousemove";
	org.tamina.log._LogLevel.LogLevel_Impl_.INFO = 0;
	org.tamina.log._LogLevel.LogLevel_Impl_.DEBUG = 1;
	org.tamina.log._LogLevel.LogLevel_Impl_.WARN = 2;
	org.tamina.log._LogLevel.LogLevel_Impl_.ERROR = 3;
	org.tamina.log.QuickLogger.level = 0;
	org.tamina.utils.UID._lastUID = 0;
	com.tamina.bikewar.PlayerUI.main();
})(typeof window != "undefined" ? window : exports);
