import JsonWebTokenValidate = require("express-jwt");
import JsonWebToken = require("jsonwebtoken");
import * as express from "express";
import NodeCache = require('./cache');

import CryptoJS = require('crypto-js');
import UserServer = require("../server/userServer");

interface IUserInfo{
	secret : string,
	ip : string
}

let EXPIRES = '100d';


// header 
// authorization Bearer token

let options = {
	secret : (req, payload, done) => {
		var secret:string;
		var ip:string;
		if(payload && payload.username) {
			let userInfo = NodeCache.get<IUserInfo>(payload.username);
			if (userInfo && userInfo.secret) {
				secret = userInfo.secret;
			}
		}
		if(secret) {
			done(null,secret);
		}else{
			let result = UserServer.findByUserName(payload.username);
			result.then((result)=>{
				if(result && result.length > 0) {
					let userInfo = result[0];
					secret = userInfo.secret
					done(null,secret);
				}else{
					done("No Secret Found!",null);
				}
			}).catch((reason)=>{
				done("No Secret Found!",null);
			});
		}	
	},
	isRevoked : (req, payload, done) => {
		done(null,false);
	}
};

export let ValidateExpress = JsonWebTokenValidate(options);

export function CreateToken(username:string,secret:string){
	NodeCache.set(username,{
		secret : secret,
	});

	return JsonWebToken.sign({username:username},secret,{
		expiresIn : EXPIRES
	});
};