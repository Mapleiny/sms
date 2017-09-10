import * as express from "express";
import {ValidateExpress} from '../util/token'


export let apiRouter = function(router:express.Router){

	router.get('/api/',function(req,res){
		res.json({message:'Welcome to Push Api!'});
	});

	// authorize
	router.post('/api/authorize',async (req,res)=>{
		try{
			let loginInfo = JSON.parse(requestDataDecode(req.body.toString()));
			let result = await UserServer.validateUser(loginInfo.username,loginInfo.password);
			console.log(result);
			res.send(result);
		}catch(e){
			console.log(e);
			res.json(e);
		}
	});

	// register
	router.post('/api/register',async (req,res)=>{
		try{
			let registInfo = JSON.parse(requestDataDecode(req.body.toString()));
			let userame = registInfo.username;
			let password = registInfo.password;

			let result = await UserServer.userRegist(userame,password);
			res.send(result);
		}catch(e){
			console.log(e);
			res.json(e);
		}
	});

    // need authorized
	router.all('/api/*',ValidateExpress,(req,res,next)=>{
		try {
			req.body = JSON.parse(requestDataDecode(req.body.toString()));
			next();
		} catch(e) {
			next(e);
		}
	});

	router.get('/api/init',function (req,res) {
		try {
			let initInfo = req.body;
			let pushToken = initInfo.token
			
			res.send();
		} catch(e) {
			res.send();
		}
	});

	router.post('/api/message',async function(req,res){
		try{
			let msgInfo = req.body;
			let result = await MessageServer.save(msgInfo.content,msgInfo.timeInterval,msgInfo.fromAddress);
			res.send(result);
		}catch(e){
			console.log(e);
			res.json(e);
		}
	});

	router.get('/api/message',async (req,res)=>{
		let query = req.query;
		let params = [];
		if (query.fromDate) {
			let date = convertAnyToDate(query.fromDate)
			if (date) {
				params.push(date);
			}
		}
		if (query.endDate) {
			let date = convertAnyToDate(query.endDate)
			if (date) {
				params.push(date);
			}
		}
		if (query.count && !isNaN(+query.count)) {
			params.push(+query.count);	
			if (query.page && !isNaN(+query.count)) {
				params.push(+query.page);	
			}
		}
		try{
			let result = await MessageServer.get.apply(MessageServer,params);
			res.send(result);
		}catch(e){
			console.log(e);
			res.json(e);
		}
	});
	router.post('/api/message',async (req,res)=>{
		try {
			let msgInfo = JSON.parse(requestDataDecode(req.body.toString()));
			let result = MessageServer.save(msgInfo.content,msgInfo.date,msgInfo.fromAddress);
			res.json(result);
		} catch(e) {
			console.log(e);
			res.json(e);
		}

		// PushManager.sendPush()
	});

	router.all('*',(req,res)=>{
		res.sendStatus(404);
	});
};