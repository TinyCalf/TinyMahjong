var db = require('../utils/db');

var rooms = {};
var creatingRooms = {};

var userLocation = {};
var totalRooms = 0;

var KOUFEI = [0,1]; // 房主出资 和 玩家平分
var QUANSHU = [8,1]; // 8局 和 一圈 TODO:区分
var JIESUAN = [0,1,2]; //幺半 一二 二四



var JU_SHU = [8,8];	// 8局 和 一圈 TODO:区分
var JU_SHU_COST = [2,3];

function generateRoomId(){
	var roomId = "";
	for(var i = 0; i < 6; ++i){
		roomId += Math.floor(Math.random()*10);
	}
	return roomId;
}

function constructRoomFromDb(dbdata){
	var roomInfo = {
		uuid:dbdata.uuid,
		id:dbdata.id,
		numOfGames:dbdata.num_of_turns,
		createTime:dbdata.create_time,
		nextButton:dbdata.next_button,
		fengxiang:dbdata.fengxiang,
		beginButton:dbdata.begin_button,
		seats:new Array(4),
		conf:JSON.parse(dbdata.base_info)
	};


	roomInfo.gameMgr = require("./gamemgr_" + roomInfo.conf.type);
	var roomId = roomInfo.id;

	for(var i = 0; i < 4; ++i){
		var s = roomInfo.seats[i] = {};
		s.userId = dbdata["user_id" + i];
		s.score = dbdata["user_score" + i];
		s.name = dbdata["user_name" + i];
		s.ready = false;
		s.seatIndex = i;
		s.numZiMo = 0;
		s.numJiePao = 0;
		s.numDianPao = 0;
		s.numAnGang = 0;
		s.numMingGang = 0;
		s.numChaJiao = 0;

		if(s.userId > 0){
			userLocation[s.userId] = {
				roomId:roomId,
				seatIndex:i
			};
		}
	}
	rooms[roomId] = roomInfo;
	totalRooms++;
	return roomInfo;
}

exports.createRoom = function(creator,roomConf,gems,ip,port,callback){
	//验证创建房间参数合法性 每个游戏需要的选项不一样
	switch(roomConf.type) {
		case "sjmmj":
			if(
				roomConf.type == null
				|| roomConf.hongzhongdanghua == null
				|| roomConf.koufei == null
				|| roomConf.quanshu == null
				|| roomConf.jiesuan == null){
				callback(1,null);
				return;
			}
			break;
		case "dhmj":
			if(
				roomConf.type == null
				|| roomConf.koufei == null
				|| roomConf.quanshu == null
				|| roomConf.jiesuan == null){
				callback(1,null);
				return;
			}
			break;
		case "tdh":
			if(
				roomConf.type == null
				|| roomConf.koufei == null //(房主出资 平摊)
				|| roomConf.quanshu == null// 8局 一圈
				|| roomConf.jiesuan == null // 平摊 包
			){
				callback(1,null);
				return;
			}
			break;
	}


	if(roomConf.koufei < 0 || roomConf.koufei > KOUFEI.length){
		callback(1,null);
		return;
	}

	if(roomConf.quanshu < 0 || roomConf.quanshu > QUANSHU.length){
		callback(1,null);
		return;
	}

	if(roomConf.jiesuan < 0 || roomConf.quanshu > JIESUAN.length){
		callback(1,null);
		return;
	}


	//房主出資
	if( roomConf.koufei == 0 ) {
		//8盤
		if(roomConf.quanshu == 0 && gems < 3) {callback( 2222 , null );return;}
		//一圈
		if(roomConf.quanshu == 1 && gems < 6) {callback( 2222 , null );return;}
	}
	//玩家平分
	else if ( roomConf.koufei == 1 ) {
		//8盤
		if(roomConf.quanshu == 0 && gems < 1) {callback( 2222 , null );return;}
		//一圈
		if(roomConf.quanshu == 1 && gems < 2) {callback( 2222 , null );return;}
	}

	//
	var maxgames = 0;
	(roomConf.quanshu == 0)?maxgames = 8 : maxgames = 100;

	var fnCreate = function() {
		var roomId = generateRoomId();
		if(rooms[roomId] != null || creatingRooms[roomId] != null){
			fnCreate();
		}
		else{
			creatingRooms[roomId] = true;
			db.is_room_exist(roomId, function(ret) {

				if(ret){
					delete creatingRooms[roomId];
					fnCreate();
				}
				else{
					var createTime = Math.ceil(Date.now()/1000);
					var beginButton = parseInt(Math.random()*4);
					var roomInfo = {
						uuid:"",
						id:roomId,
						numOfGames:0,
						fengxiang:0,//风向 0123 东南西北
						createTime:createTime,
						//舟山麻将需要记录第一个坐庄的人
						beginButton:beginButton,
						nextButton:beginButton,
						seats:[],
						//標記是否結算：
						ifPayed: false,
						conf:{
							type:roomConf.type,
							hongzhongdanghua:roomConf.hongzhongdanghua,
							koufei:roomConf.koufei,
							quanshu:roomConf.quanshu,
							jiesuan:roomConf.jiesuan,
							maxGames:maxgames,
							//TODO:把下面的属性也去掉
							baseScore:20,
							maxFan:10000,
							creator:creator,
						}
					};
					
					// if(roomConf.type == "sjmmj"){
					// 	roomInfo.gameMgr = require("./gamemgr_sjmmj");
					// }else if(roomConf.type == "dhmj"){
					// 	roomInfo.gameMgr = require("./gamemgr_dhmj");
					// }else {
					// 	roomInfo.gameMgr = require("./gamemgr_tdh");
					// }

					//所需文件 gamemagr_XXXX , XXXXX为游戏简称 如沈家门麻将，使用 gamemgr_sjmmj.js 作为游戏逻辑
					roomInfo.gameMgr = require("./gamemgr_"+roomConf.type);
					
					for(var i = 0; i < 4; ++i){
						roomInfo.seats.push({
							userId:0,
							score:0,
							name:"",
							ready:false,
							seatIndex:i,
							numZiMo:0,
							numJiePao:0,
							numDianPao:0,
							numAnGang:0,
							numMingGang:0,
							numChaJiao:0,
						});
					}
					

					//写入数据库
					var conf = roomInfo.conf;
					db.create_room(roomInfo.id,roomInfo.conf,ip,port,createTime,function(uuid){
						delete creatingRooms[roomId];
						if(uuid != null){
							roomInfo.uuid = uuid;
							console.log(uuid);
							rooms[roomId] = roomInfo;
							totalRooms++;
							callback(0,roomId);
						}
						else{
							callback(3,null);
						}
					});
				}
			});
		}
	}

	fnCreate();
};

exports.destroy = function(roomId){
	var roomInfo = rooms[roomId];
	if(roomInfo == null){
		return;
	}

	for(var i = 0; i < 4; ++i){
		var userId = roomInfo.seats[i].userId;
		if(userId > 0){
			delete userLocation[userId];
			db.set_room_id_of_user(userId,null);
		}
	}
	
	delete rooms[roomId];
	totalRooms--;
	db.delete_room(roomId);
}

exports.getTotalRooms = function(){
	return totalRooms;
}

exports.getRoom = function(roomId){
	return rooms[roomId];
};

exports.isCreator = function(roomId,userId){
	var roomInfo = rooms[roomId];
	if(roomInfo == null){
		return false;
	}
	return roomInfo.conf.creator == userId;
};

exports.enterRoom = function(roomId,userId,userName,callback){
	db.getRoomConfById(roomId,function(conf){
		if(conf){
			var koufei = conf.koufei;
			var quanshu = conf.quanshu;
			var gems = 0;
			db.getGemsById(userId,function(data){
				gems = data;

				if(koufei==1){
					if(quanshu==0 && gems < 1){
						callback(5);
						return;
					}
					if(quanshu==1 && gems < 2){
						callback(5);
						return;
					}
				}

				var fnTakeSeat = function(room){
					if(exports.getUserRoom(userId) == roomId){
						//已存在
						return 0;
					}

					for(var i = 0; i < 4; ++i){
						var seat = room.seats[i];
						if(seat.userId <= 0){
							seat.userId = userId;
							seat.name = userName;
							userLocation[userId] = {
								roomId:roomId,
								seatIndex:i
							};
							db.update_seat_info(roomId,i,seat.userId,"",seat.name);
							//正常
							return 0;
						}
					}
					//房间已满
					return 1;
				};
				var room = rooms[roomId];
				if(room){
					var ret = fnTakeSeat(room);
					callback(ret);
				}
				else{
					db.get_room_data(roomId,function(dbdata){
						if(dbdata == null){
							//找不到房间
							callback(2);
						}
						else{
							//construct room.
							room = constructRoomFromDb(dbdata);
							//
							var ret = fnTakeSeat(room);
							callback(ret);
						}
					});
				}
			});
		}else{
			callback(2);
		}
	});



};

exports.setReady = function(userId,value){
	var roomId = exports.getUserRoom(userId);
	if(roomId == null){
		return;
	}

	var room = exports.getRoom(roomId);
	if(room == null){
		return;
	}

	var seatIndex = exports.getUserSeat(userId);
	if(seatIndex == null){
		return;
	}

	var s = room.seats[seatIndex];
	s.ready = value;
}

exports.isReady = function(userId){
	var roomId = exports.getUserRoom(userId);
	if(roomId == null){
		return;
	}

	var room = exports.getRoom(roomId);
	if(room == null){
		return;
	}

	var seatIndex = exports.getUserSeat(userId);
	if(seatIndex == null){
		return;
	}

	var s = room.seats[seatIndex];
	return s.ready;	
}

exports.getUserRoom = function(userId){
	var location = userLocation[userId];
	if(location != null){
		return location.roomId;
	}
	return null;
};

exports.getUserSeat = function(userId){
	var location = userLocation[userId];
	if(location != null){
		return location.seatIndex;
	}
	return null;
};

exports.getUserLocations = function(){
	return userLocation;
};

exports.exitRoom = function(userId){
	var location = userLocation[userId];
	if(location == null)
		return;

	var roomId = location.roomId;
	var seatIndex = location.seatIndex;
	var room = rooms[roomId];
	delete userLocation[userId];
	if(room == null || seatIndex == null) {
		return;
	}

	var seat = room.seats[seatIndex];
	seat.userId = 0;
	seat.name = "";

	var numOfPlayers = 0;
	for(var i = 0; i < room.seats.length; ++i){
		if(room.seats[i].userId > 0){
			numOfPlayers++;
		}
	}
	
	db.set_room_id_of_user(userId,null);

	if(numOfPlayers == 0){
		exports.destroy(roomId);
	}
};