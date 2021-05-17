

const request = require('request')
const crypto = require('crypto')

var baseurl = "https://api.coindcx.com"

var timeStamp = Math.floor(Date.now());

// Place your API key and secret below. You can generate it from the website.
key = "02126160cdaa3723ce01be347011410ac8b9e86b9a09c93a";
secret = "88039d460a92873064e91ac5f5f136cb6494a0f44fbae5f2a6c688cfde7cde28";


    body = {
        "side": "buy",  //Toggle between 'buy' or 'sell'.
        "order_type": "limit_order", //Toggle between a 'market_order' or 'limit_order'.
        "market": "TRXINR", //Replace 'SNTBTC' with your desired market pair.
        "price_per_unit": "9.69", //This parameter is only required for a 'limit_order'
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