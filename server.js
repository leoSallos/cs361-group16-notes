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
    res.sendStatus(204);
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
    var notesList = {notes: []};
    for (var i = 0; i < userData.notes.length; i++){
        const note = {
            id: i, 
            title: userData.notes[i].title,
            updated: userData.notes[i].updated
        };
        notesList.notes.push(note);
    }

    // send to user
    console.log("Sending success");
    res.status(200).json(notesList);
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
        res.status(404).send("User has no notes.");
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
app.post("/new/:userID/", async function(req, res){
    console.log("Getting new note request.");

    // get post data
    const data = request.body;
    if (!data.title || !data.created || !data.updated || !data.textContent){
        console.error("Improper request body format");
        res.status(400).send("Improper request body format.");
        return;
    }

    // check if user exists
    const userID = req.params.userID;
    var path = __dirname + "/data/" + userID + ".json";
    try {
        var userDataString = await fs.readFile(path, "utf8");
    } catch (err) {
        console.log("User does not exist, creating new user.");
        var userDataString = "{notes:[]}";
    }
    
    // get user data
    if (userDataString != ""){
        var userData = JSON.parse(userDataString);
    } else {
        console.log("No user notes found.");
        res.status(404).send("User has no notes.");
        return;
    }

    // create note
    const note = {
        title: data.title,
        created: data.created,
        updated: data.updated,
        textContent: data.textContent
    };
    userData.notes.push(note);

    // save data to file
    userDataString = await JSON.stringify(userData);
    try {
        await fs.writeFile(path, userDataString, "utf8");
    } catch (err) {
        console.error("File write failed: " + err);
        res.status(500).send("Server error");
        return;
    }
    console.log("Sending success");
    res.status(200).send("Note successfully submitted.");
});

// post note update
app.post("/update/:userID/:noteID", async function(req, res){
    console.log("Getting note update request.");

    // get post data
    const data = req.body;
    if (!data.title || !data.updated || !data.textContent){
        console.error("Improper request body format");
        res.status(400).send("Improper request body format.");
        return;
    }

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
        res.status(404).send("User has no notes.");
        return;
    }

    // check if note exists
    const noteID = req.params.noteID;
    if (noteID >= userData.notes.length){
        console.error("Specified note does not exist.");
        res.status(404).send("Note not found.");
        return;
    }

    // update note
    userData.notes[noteID].title = data.title;
    userData.notes[noteID].updated = data.updated;
    userData.notes[noteID].textContent = data.textContent;

    // save data to file
    userDataString = await JSON.stringify(userData);
    try {
        await fs.writeFile(path, userDataString, "utf8");
    } catch (err) {
        console.error("File write failed: " + err);
        res.status(500).send("Server error");
        return;
    }
    console.log("Sending success");
    res.status(200).send("Note successfully submitted.");
});

// start server listening
app.listen(port, function(err){
    if (err){
        throw err;
    } else {
        console.log("Server listening on port " + port);
    }
});
