const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const DATA_FILE = "./birdsightings.json";

app.use(cors());
app.use(bodyParser.json());

// Read bird sightings.
app.get("/sightings", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    res.json(JSON.parse(data));
  });
});

// Add a new sighting.
app.post("/sightings", (req, res) => {
    const newSighting = req.body;

    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.status(500).send("Error reading file");
        let sightings = JSON.parse(data);
        sightings.push(newSighting);
        fs.writeFile(DATA_FILE, JSON.stringify(sightings, null, 2), err => {
            if (err) return res.status(500).send("Error writing file");
            res.status(201).json(newSighting);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
