import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import db from "./connection.js"

const app = express();
const PORT = 3000;
const DATA_FILE = "./birdsightings.json";

app.use(cors());
app.use(bodyParser.json());

// Find bird names for suggestions.
app.get("/find/:name", async (req, res) => {
  const term = req.params.name;
  const species = db.collection("species");
  const result = await species
    .find({ commonName: { $regex: term, $options: "i" }})
    .toArray();

  const birdsArray = result.map(doc => ({
    id: doc._id.toString(),
    commonName: doc.commonName,
    latinName: doc.latinName
  }));

  res.status(200).json(birdsArray);
});

// Add a new bird species.
app.post("/species", async (req, res) => {
  try {
    const { commonName, latinName } = req.body;
    if (!commonName || !latinName)
      return res.status(400).json({error: "commonName and latinName required"});

    const species = db.collection("species");
    const result = await species.insertOne({commonName, latinName});

    if (!result)
      return res.status(500).send("Server error");

    const response = {
      id: result.insertedId.toString(),
      commonName: commonName,
      latinName: latinName
    };

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Read bird sightings.
app.get("/sightings", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).send({message: "Error reading file"});
    res.status(200).json(JSON.parse(data));
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
      res.status(200).send({message: "Sighting deleted succesfully"});
    })
  })
})

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Internal Server Error'
    }
  });
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
