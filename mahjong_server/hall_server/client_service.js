var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require('../utils/http');
var room_service = require("./room_service");

var app = express();
var config = null;

function check_account(req,res){
	var account = req.query.account;
	var sign = req.query.sign;
	if(account == null || sign == null){
		http.send(res,1,"unknown error");
		return false;
	}
	/*
	var serverSign = crypto.md5(account + req.ip + config.ACCOUNT_PRI_KEY);
	if(serverSign != sign){
		http.send(res,2,"login failed.");
		return false;
	}
	*/
	return true;
}

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.get('/login',function(req,res){
	if(!check_account(req,res)){
		return;
	}
	
	var ip = req.ip;
	if(ip.indexOf("::ffff:") != -1){
		ip = ip.substr(7);
	}
	
	var account = req.query.account;
	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,0,"ok");
			return;
		}

		var ret = {
			account:data.account,
			userid:data.userid,
			name:data.name,
			lv:data.lv,
			exp:data.exp,
			coins:data.coins,
			gems:data.gems,
			ip:ip,
			sex:data.sex,
		};

		db.get_room_id_of_user(data.userid,function(roomId){
			//如果用户处于房间中，则需要对其房间进行检查。 如果房间还在，则通知用户进入
			if(roomId != null){
				//检查房间是否存在于数据库中
				db.is_room_exist(roomId,function (retval){
					if(retval){
						ret.roomid = roomId;
					}
					else{
						//如果房间不在了，表示信息不同步，清除掉用户记录
						db.set_room_id_of_user(data.userid,null);
					}
					http.send(res,0,"ok",ret);
				});
			}
			else {
				http.send(res,0,"ok",ret);
			}
		});
	});
});

app.get('/create_user',function(req,res){
	if(!check_account(req,res)){
		return;
	}
	var account = req.query.account;
	var name = req.query.name;
	var coins = 1000;
	var gems = 21;
	console.log(name);

	db.is_user_exist(account,function(ret){
		if(!ret){
			db.create_user(account,name,coins,gems,0,null,function(ret){
				if (ret == null) {
					http.send(res,2,"system error.");
				}
				else{
					http.send(res,0,"ok");					
				}
			});
		}
		else{
			http.send(res,1,"account have already exist.");
		}
	});
});

app.get('/create_private_room',function(req,res){
	//验证参数合法性
	var data = req.query;
	//验证玩家身份
	if(!check_account(req,res)){
		return;
	}

	var account = data.account;

	data.account = null;
	data.sign = null;
	var conf = data.conf;
	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,1,"system error");
			return;
		}
		var userId = data.userid;
		var name = data.name;
		//验证玩家状态
		db.get_room_id_of_user(userId,function(roomId){
			if(roomId != null){
				http.send(res,-1,"user is playing in room now.");
				return;
			}
			//创建房间
			room_service.createRoom(account,userId,conf,function(err,roomId){
				if(err == 0 && roomId != null){
					room_service.enterRoom(userId,name,roomId,function(errcode,enterInfo){
						if(enterInfo){
							var ret = {
								roomid:roomId,
								ip:enterInfo.ip,
								port:enterInfo.port,
								token:enterInfo.token,
								time:Date.now()
							};
							ret.sign = crypto.md5(ret.roomid + ret.token + ret.time + config.ROOM_PRI_KEY);
							http.send(res,0,"ok",ret);
						}
						else{
							http.send(res,errcode,"room doesn't exist.");
						}
					});
				}
				else{
					http.send(res,err,"create failed.");					
				}
			});
		});
	});
});

app.get('/enter_private_room',function(req,res){
	var data = req.query;
	var roomId = data.roomid;
	if(roomId == null){
		http.send(res,-1,"parameters don't match api requirements.");
		return;
	}
	if(!check_account(req,res)){
		return;
	}

	var account = data.account;

	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,-1,"system error");
			return;
		}
		var userId = data.userid;
		var name = data.name;

		//验证玩家状态
		//todo
		//进入房间
		room_service.enterRoom(userId,name,roomId,function(errcode,enterInfo){
			if(enterInfo){
				var ret = {
					roomid:roomId,
					ip:enterInfo.ip,
					port:enterInfo.port,
					token:enterInfo.token,
					time:Date.now()
				};
				ret.sign = crypto.md5(roomId + ret.token + ret.time + config.ROOM_PRI_KEY);
				http.send(res,0,"ok",ret);
			}
			else{
				http.send(res,errcode,"enter room failed.");
			}
		});
	});
});

app.get('/get_history_list',function(req,res){
	var data = req.query;
	if(!check_account(req,res)){
		return;
	}
	var account = data.account;
	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,-1,"system error");
			return;
		}
		var userId = data.userid;
		db.get_user_history(userId,function(history){
			http.send(res,0,"ok",{history:history});
		});
	});
});

app.get('/get_games_of_room',function(req,res){
	var data = req.query;
	var uuid = data.uuid;
	if(uuid == null){
		http.send(res,-1,"parameters don't match api requirements.");
		return;
	}
	if(!check_account(req,res)){
		return;
	}
	db.get_games_of_room(uuid,function(data){
		console.log(data);
		http.send(res,0,"ok",{data:data});
	});
});

app.get('/get_detail_of_game',function(req,res){
	var data = req.query;
	var uuid = data.uuid;
	var index = data.index;
	if(uuid == null || index == null){
		http.send(res,-1,"parameters don't match api requirements.");
		return;
	}
	if(!check_account(req,res)){
		return;
	}
	db.get_detail_of_game(uuid,index,function(data){
		http.send(res,0,"ok",{data:data});
	});
});

app.get('/get_user_status',function(req,res){
	if(!check_account(req,res)){
		return;
	}
	var account = req.query.account;
	db.get_gems(account,function(data){
		if(data != null){
			http.send(res,0,"ok",{gems:data.gems});	
		}
		else{
			http.send(res,1,"get gems failed.");
		}
	});
});

app.get('/get_message',function(req,res){
	if(!check_account(req,res)){
		return;
	}
	var type = req.query.type;
	
	if(type == null){
		http.send(res,-1,"parameters don't match api requirements.");
		return;
	}
	
	var version = req.query.version;
	db.get_message(type,version,function(data){
		if(data != null){
			http.send(res,0,"ok",{msg:data.msg,version:data.version});	
		}
		else{
			http.send(res,1,"get message failed.");
		}
	});
});

app.get('/is_server_online',function(req,res){
	if(!check_account(req,res)){
		return;
	}
	var ip = req.query.ip;
	var port = req.query.port;
	room_service.isServerOnline(ip,port,function(isonline){
		var ret = {
			isonline:isonline
		};
		http.send(res,0,"ok",ret);
	}); 
});

//获取签到状态
app.get('/get_checkin_status',function(req,res){
	db.getCheckinStatus(req.query.userid,function(data){
		console.log("get_checkin_status");

		if(data == null){
			var ret = {
				errcode:1,
				errmsg:"null",
				data:data,
			};
			http.send(res,ret);
		}else{
			var ret = {
				errcode:0,
				errmsg:"ok",
				data:data,
			};

			http.send(res,ret);
		}
	})
});

//签到
app.get('/checkin',function(req,res){
	db.getCheckinStatus(req.query.userid,function(data){
		if (data) {
			var gems = data.gems;
			var checkin_data = data.checkin_data;
			var checkin_days = data.checkin_days;
			checkin_days = checkin_days % 7;
			//当前日期
			var d = new Date();
			var y = d.getFullYear();
			var m = d.getMonth() + 1;
			m = m < 10 ? ("0" + m) : m;
			var day = d.getDate();
			day = day < 10 ? ("0" + day) : day;
			var nowdate = y + "-" + m + "-" + day;
			if(checkin_data!=nowdate){
				var addgems = 0;
				switch(checkin_days){
					case 0: addgems = 1;break;
					case 1: addgems = 1;break;
					case 2: addgems = 2;break;
					case 3: addgems = 2;break;
					case 4: addgems = 2;break;
					case 5: addgems = 2;break;
					case 6: addgems = parseInt(Math.random()*10+1);break;
				}
				var dt = {
					userid:req.query.userid,
					gems:gems+addgems,
					checkin_data:nowdate,
					checkin_days:data.checkin_days+1,
				};
				db.Checkin(dt,function(data){
					if(data==0){
						var ret = {
							errcode:0,
							errmsg:"ok",
							data:{
								gems:addgems,
							},
						};
						http.send(res,ret);
					}
				});
			}
		}
	})
});

//分享获取钻石
app.get('/share_get_gems',function(req,res){
	db.getShareStatus(req.query.userid,function(data){
		if (data) {
			var last_share_date = data.last_share_date;
			var last_timeline_date = data.last_timeline_date;
			//当前日期
			var d = new Date();
			var y = d.getFullYear();
			var m = d.getMonth() + 1;
			m = m < 10 ? ("0" + m) : m;
			var day = d.getDate();
			day = day < 10 ? ("0" + day) : day;
			var nowdate = y + "-" + m + "-" + day;
			if(req.query.type == "share"){
				if(last_share_date!=nowdate){
					var dt = {
						userid:req.query.userid,
						gems:1,
						last_share_date:nowdate,
						last_timeline_date:last_timeline_date
					};
					db.add_share_gems(dt,function(data){
						if(data==0){
							var ret = {
								errcode:0,
								errmsg:"ok",
								data:{
									gems:1,
								},
							};
							http.send(res,ret);
						}
					});
				}else{
					var ret = {
						errcode:0,
						errmsg:"ok",
						data:{
							gems:0,
						},
					};
					http.send(res,ret);
				}
			}else if(req.query.type == "timeline"){
				if(last_timeline_date!=nowdate){
					var dt = {
						userid:req.query.userid,
						gems:2,
						last_share_date:last_share_date,
						last_timeline_date:nowdate
					};
					db.add_share_gems(dt,function(data){
						if(data==0){
							var ret = {
								errcode:0,
								errmsg:"ok",
								data:{
									gems:2,
								},
							};
							http.send(res,ret);
						}
					});
				}else{
					var ret = {
						errcode:0,
						errmsg:"ok",
						data:{
							gems:0,
						},
					};
					http.send(res,ret);
				}
			}
		}
	})
});


exports.start = function($config){
	config = $config;
	app.listen(config.CLEINT_PORT);
	console.log("client service is listening on port " + config.CLEINT_PORT);
};