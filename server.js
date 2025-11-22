var fs = require("fs").promises
var express = require("express")
var app = express()
app.use(express.static(__dirname));
app.use(express.json())
const port = 8006

//
// setup environment
//
fs.mkdir(__dirname + "/data/", {recursive: true})
    .then(() => console.log("Database setup"))
    .catch(err => console.log("Error creating directory: " + err));
console.log("Listening on port: " + port);

//
// Middleware
//

app.use(function (req, res, next) {
    // allow cross-origin access control
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type");

    next();
});

// 
// Route Service
//

// server ping
app.get("/", function(req, res, next) {
    console.log("Ping recieved")
    res.status(204);
});



// start server listening
app.listen(port, function(err){
    if (err){
        throw err;
    } else {
        console.log("Server listening on port " + port);
    }
});
