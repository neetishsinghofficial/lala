var express = require('express');
var app = express();
//var fs = require("fs");
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
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})