const express = require("express");
let axios = require("axios");
const MongoClient = require("mongodb").MongoClient;
let app = express();
app.use(express.json());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, DELETE, GET, OPTIONS, PATCH, HEAD");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Server running on port ${port}`));


const url = "mongodb+srv://prafullbind:prafull123@bind.jltdd5u.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'codinova';
const client = new MongoClient(url);

app.get("/coinApiDetail", async function(req, res) {
    try{
     let response = await axios.get("https://rest.coinapi.io/v1/exchanges?apikey= FDAB8705-CEAA-4A23-8A5B-6CC30B8D44D9");
     let exchangeData  = response.data;
     console.log(exchangeData.length);
     let iconRequest = await axios.get("https://rest.coinapi.io/v1/exchanges/icons/32?apikey= FDAB8705-CEAA-4A23-8A5B-6CC30B8D44D9")
     let iconData = iconRequest.data;
     let arrangedArray = exchangeData.map(function(ele){
         let index = iconData.findIndex((dt) => dt.exchange_id === ele.exchange_id);
         if(index >=0){
            ele.iconUrl = iconData[index].url;
         }
         return ele;
     })
         let connect = await client.connect();
    let db = connect.db(dbName);
    let collection = db.collection("codinovaData");
    arrangedArray.forEach(element => {
        collection.insertOne(element, (err, result) => {
            if (err) {
              console.error('Error inserting element', err);
              return;
            }
            console.log('element inserted successfully');
            client.close();
          });     
    });
      
     res.status(200).send("Data saved successfully");
    }
    catch(ex){
        console.log(ex);
    }
});

app.get("/codinovaData", async function(req, res) {
    try{
    let connect = await client.connect();
    let db = connect.db(dbName);
    let collection = db.collection("codinovaData");
    let response = await collection.find({}).toArray();
    res.status(200).send(response);
}
catch(ex){
    console.log(ex);
}

});

