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
    if (err) return res.status(500).send({message: "Error reading file"});
    res.json(JSON.parse(data));
  });
});

// Add a new sighting.
app.post("/sightings", (req, res) => {
    const newSighting = req.body;

    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.status(500).send({message: "Error reading file"});
        let sightings = JSON.parse(data);
        sightings.push(newSighting);
        fs.writeFile(DATA_FILE, JSON.stringify(sightings, null, 2), err => {
            if (err)
              return res.status(500).send({message: "Error writing file"});
            res.status(201).json(newSighting);
        });
    });
});

// Delete a sighting.
app.delete("/sightings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send({message: "Invalid ID"});

  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).send({message: "Error reading file"});

    let sightings = JSON.parse(data);
    const index = sightings.findIndex(s => s.id === id);
    if (index === -1)
      return res.status(404).send({message: "Sighting not found"});

    sightings.splice(index, 1);

    fs.writeFile(DATA_FILE, JSON.stringify(sightings, null, 2), err => {
      if (err) return res.status(500).send({message: "Error writing file"});
      res.send({message: "Sighting deleted succesfully"});
    })
  })
})

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
