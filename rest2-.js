const http = require('http')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://arm:1234@cluster0-shard-00-00.qoei9.mongodb.net:27017,cluster0-shard-00-01.qoei9.mongodb.net:27017,cluster0-shard-00-02.qoei9.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-6j3ef8-shard-0&authSource=admin&retryWrites=true&w=majority'
const option= { useNewUrlParser: true,useUnifiedTopology: true }
const dbName = 'mydatabase'
const mycol = dbName['customers']

let siteID = 'KMb827eb6d34cd';  
let deviceID = 3;
let label = 'ultra'
let connection = 'REST';
let ip = 'localhost'; 
let port = 3303; // (3303)
let path = '/api/interfaces/update'

let device = {
  siteID: siteID,
  deviceID: deviceID,
  date: new Date(),
  offset: new Date().getTimezoneOffset(),
  connection: connection,
  tagObj: [{
    status: true,
    label: label,
    value: 0,
    record: true,
    update: '',
    image: '',
  }],
}    

function postserver ()  {
  return new Promise(resolve => {
    const data = JSON.stringify(device);
    const options = {
      hostname: ip,
      port: port,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      rejectUnauthorized: false,    
    }
    // console.log(options);                    
    // const req = https.request(options, res => {
    const req = http.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)                    
      res.on('data', d => {
        // console.log('data =>', d+'');
        resolve(d+'');
      })
    })                    
    req.on('error', error => {
      console.error(error)
      resolve(null);
    })  
    req.write(data)
    req.end()
  });    
}                

setInterval(() => {
  (async () => {  
    console.log('---------------------')    
    MongoClient.connect(url, function(err, db) {
   	 if (err) throw err;
   	 var dbo = db.db("mydatabase");
   	 var mysort = { _id: -1 };
   	 dbo.collection("customers").find({}, { projection: { _id: 0, name: 1 } }).sort(mysort).limit(1).toArray(function(err, result) {
    		if (err) throw err;    		
    		db.close();
   	 
    
    let value = result ;    
    device.tagObj[0].value = value;
    device.tagObj[0].status = true;
    device.date = '';
    device.offset = new Date().getTimezoneOffset();
    console.log('Send to server =>', value);
    postserver();
	});
    });
  })();           
}, 1000);













  
  
