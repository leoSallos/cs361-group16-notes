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
app.get("/", function(req, res) {
    console.log("Ping recieved")
    res.status(204);
});

// get note list
app.get("/list/:userID", async function(req, res){
    console.log("Getting user list about user.");

    // check if user exists
    const userID = req.params.userID;
    var path = __dirname + "/data/" + userID + ".json";
    try {
        var userDataString = await fs.readFile(path, "utf8");
    } catch (err) {
        console.error("User data could not be retrieved.");
        res.status(404).send("User data not found.");
        return;
    }

    // get user data
    if (userDataString != ""){
        var userData = JSON.parse(userDataString);
    } else {
        console.log("No user notes found.");
        res.status(204).send("User has no notes.");
        return;
    }

    // create list
    var notesList = {noteList: []};
    for (var i = 0; i < userData.notes.length; i++){
        const note = {
            id: i, 
            title: userData.notes[i].title
        };
        notesList.noteList.push(note);
    }

    // send to user
    console.log("Sending success");
    res.status(200).json(notesLists);
});

// get note
app.get("/get/:userID/:noteID", async function(req, res){
    console.log("Getting user note.");

    // check if user exists
    const userID = req.params.userID;
    var path = __dirname + "/data/" + userID + ".json";
    try {
        var userDataString = await fs.readFile(path, "utf8");
    } catch (err) {
        console.error("User data could not be retrieved.");
        res.status(404).send("User data not found.");
        return;
    }
    
    // get user data
    if (userDataString != ""){
        var userData = JSON.parse(userDataString);
    } else {
        console.log("No user notes found.");
        res.status(204).send("User has no notes.");
        return;
    }

    // check if note exists
    const noteID = req.params.noteID;
    if (noteID >= userData.notes.length){
        console.error("Specified note does not exist.");
        res.status(404).send("Note not found.");
        return;
    }

    // send to user
    console.log("Sending success");
    res.status(200).json(userData.notes[noteID]);
});

// post new note
app.post("/new/:userID/", function(req, res){
});

// post note update
app.post("/update/:userID/:noteID", function(req, res){
});

// start server listening
app.listen(port, function(err){
    if (err){
        throw err;
    } else {
        console.log("Server listening on port " + port);
    }
});
