var express = require('express')
var forceSSL = require('express-force-ssl')
var fs = require('fs')
var app = express()
var validate = express()
var http = require('http')
var https = require('https')
var request = require('request')

const ACCESS_TOKEN = '663c6234444d392c6f17fb43f78a17b4b8078514dcd35c9bf17a3a20be2a4766abd55d4e26373e3fc766b'

var users = {
	19035667: {
		id: 19035667,
		first_name: 'Лера',
		last_name: 'Васильева',
		photo_50: 'https://pp.vk.me/...72f/HGUV98oefz4.jpg'
	},
	279011394: {
		id: 279011394,
		first_name: 'Павел',
		last_name: 'Аверин',
		photo_50: 'https://pp.vk.me/...572/jTINfwVtshc.jpg'
	},
	51392062: {
		id: 51392062,
		first_name: 'Ксения',
		last_name: 'Сизова',
		photo_50: 'https://pp.vk.me/...752/iur81-sfplY.jpg'
	},
	220677195: {
		id: 220677195,
		first_name: 'Crazy',
		last_name: 'Mofos',
		photo_50: 'https://pp.vk.me/...3f8/MDkCM1PUJq4.jpg'
	}
}

var messages = []

/*
*	Config
*/

var ssl_options = {
	key: fs.readFileSync('/etc/letsencrypt/live/team3.vkhackathon.ru/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/team3.vkhackathon.ru/cert.pem'),
}

/*
*	Incoming request
*/

validate.post('/DfSgTr568rfghsdgdfh', function(request, response){ 
	response.end('e6dda052')
})

//New user connects
app.get('/', function(req, resp){

	var userParams = {
		is_app_user: req.param('is_app_user'),
		viewer_id: req.param('viewer_id'),
		//api_url: req.param('api_url'),
		api_settings: req.param('api_settings'),
		group_id: req.param('group_id')
	}

	request('https://api.vk.com/method/users.get?user_ids=' + userParams.viewer_id +'&format=json&fields=photo_50&v=5.60', function(err, resp) {
		//console.log(JSON.parse(resp.body).response[0])
		// console.log(String(userParams.viewer_id))
		users[String(userParams.viewer_id)] = JSON.parse(resp.body).response[0];
	})

	resp.write('<!DOCTYPE html>\
		<html>\
		<head>\
			<meta charset="UTF-8">\
			<title>Sample App</title>\
			<script>window.viewer_id=' + userParams.viewer_id + ';\
			console.log("User id:" + viewer_id);</script>\
			<link href="/static/css/main.css" rel="stylesheet">\
		</head>\
			<body>\
				<div id="root">\
				</div>\
			<script type="text/javascript" src="bundle.js"></script>\
			</body>\
		</html>'
	)
})

//New user request info
app.get('/bundle.js', function (req, res) {
	res.sendFile(__dirname + '/static/js/bundle.js')
})

app.get('/user.json', function (req, res){
	const viewer_id = req.param('viewer_id')
	res.json(users[String(viewer_id)])
})

app.get('/users.json', function(req, res)
{
	res.send(JSON.stringify(users));    
});

app.post('/sendMessage', function(req, res)
	{
		const id = req.param('id');
		var obj = {
			message: req.body,
			sender: users[id]
		};
		messages.push(obj);
		console.log(message);
	})

app.get('/getNewMessages', function(req, res)
{
	const len = req.param('length');
	if(messages.length < len){
		 var str = messages.slice(messages.length - len);
		 console.log(str);
		 res.send(JSON.stringify(str));
	}
})
/*
*	Listen
*/

var server = https.createServer(ssl_options, app).listen(443)
console.log("HTTPS listen at port 443")

var validateServer = validate.listen(80)
console.log("HTTP validate server listen at port 80")