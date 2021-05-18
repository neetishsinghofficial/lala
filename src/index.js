var express = require('express');
var app = express();
//var fs = require("fs");

const request = require('request')
const crypto = require('crypto')
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const TOKEN_PATH = 'token.json';
var valuea="";
var exchange="";
var volume="";
var type="";
var namew="";
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), writeData);
  });
  
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }  
  function writeData(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    let values = [
        [
            valuea,
            exchange,
            volume,
            namew,
            type,
            'Baseball'
        ],
        // Potential next row
    ];
    const resource = {
        values,
    };
    sheets.spreadsheets.values.append({
        spreadsheetId: '1HoQiP9gc1OhHRz9SXcQoa1e28WDKqnFbKExFKssdcrQ',
        range: 'Sheet3!A1',
        valueInputOption: 'RAW',
        resource: resource,
    }, (err, result) => {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            console.log('%d cells updated on range: %s', result.data.updates.updatedCells, result.data.updates.updatedRange);
        }
    });
}
   function buystock(){
    var baseurl = "https://api.coindcx.com"

    var timeStamp = Math.floor(Date.now());
    
    // Place your API key and secret below. You can generate it from the website.
    key = "02126160cdaa3723ce01be347011410ac8b9e86b9a09c93a";
    secret = "88039d460a92873064e91ac5f5f136cb6494a0f44fbae5f2a6c688cfde7cde28";
    
    
        body = {
            "side": "buy",  //Toggle between 'buy' or 'sell'.
            "order_type": "market_order", //Toggle between a 'market_order' or 'limit_order'.
            "market": "TRXINR", //Replace 'SNTBTC' with your desired market pair. //This parameter is only required for a 'limit_order'
            "total_quantity": 11, //Replace this with the quantity you want
            "timestamp": timeStamp
        }
    
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    
        const options = {
            url: baseurl + "/exchange/v1/orders/create",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }
    
        request.post(options, function(error, response, body) {
            console.log(body);
        })
   }

   function sellstock(){
    var baseurl = "https://api.coindcx.com"

    var timeStamp = Math.floor(Date.now());
    
    // Place your API key and secret below. You can generate it from the website.
    key = "02126160cdaa3723ce01be347011410ac8b9e86b9a09c93a";
    secret = "88039d460a92873064e91ac5f5f136cb6494a0f44fbae5f2a6c688cfde7cde28";
    
    
        body = {
            "side": "sell",  //Toggle between 'buy' or 'sell'.
            "order_type": "market_order", //Toggle between a 'market_order' or 'limit_order'.
            "market": "TRXINR", //Replace 'SNTBTC' with your desired market pair. //This parameter is only required for a 'limit_order'
            "total_quantity": 11, //Replace this with the quantity you want
            "timestamp": timeStamp
        }
    
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    
        const options = {
            url: baseurl + "/exchange/v1/orders/create",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }
    
        request.post(options, function(error, response, body) {
            console.log(body);
        })
   }
  function listMajors(auth,tt) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: '1HoQiP9gc1OhHRz9SXcQoa1e28WDKqnFbKExFKssdcrQ',
        range: 'Sheet1!A2:I',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            console.log('Name, Major:');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                console.log(`${row[0]}, ${row[4]}`);
            });
        } else {
            console.log('No data found.');
        }
    });
} 

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.post('/buyorder', function (req, res) {
    valuea=JSON.stringify(req.body.price);
    type=JSON.stringify(req.body.type);

    if(type=="buy"){
      buystock();
    }else if(type=="sell"){
      sellstock();
    }
    exchange=JSON.stringify(req.body.exchange);
    namew=JSON.stringify(req.body.name);
    volume=JSON.stringify(req.body.volume);
    
    console.log(valuea);

    // First read existing users.
    //fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      // var users = JSON.parse( data );
      // var user = users["user" + req.params.id] 
       //console.log( req.params.id );
       fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        authorize(JSON.parse(content), writeData);
      });
       //console.log( req.params.tt );
      // res.end( JSON.stringify(user));
   // });
   res.end(JSON.stringify("avs"));
 })
 const PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})