const express = require("express");
const uniqid = require('uniqid');
const path = require("path");
const fs = require("fs")
const db = require("./db.json")

const app = express();
const PORT = 3000;

//server settings (middleware)
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static("public"))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get('/api/notes', (req, res) => {
    fs.readFile("./db.json", (err, data) => {
        if(err) throw err;
        res.json(JSON.parse(data))
    })

})

app.post('/api/notes', (req, res) => {
    let data = req.body;
    data["id"] = uniqid();
    db.push(req.body)

    fs.writeFile("./db.json", JSON.stringify(db), err => {
        if (err) throw err;
        res.json(data)
    })
})

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile("./db.json", (err, data) => {
        if (err) throw err;
        const noteArr = JSON.parse(data).filter((note) => note.id !== req.params.id);
        fs.writeFile("./db.json", JSON.stringify(noteArr), err => {
            if (err) throw err;
            res.json(data)
        });
    })
})

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));