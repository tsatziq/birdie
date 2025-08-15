import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ObjectId } from "mongodb";
import db from "./connection.js"

const app = express();
const PORT = 3000;
const serverErr = "Server error";

app.use(cors());
app.use(bodyParser.json());

// Find bird names for suggestions.
app.get("/find/:name", async (req, res) => {
  const term = req.params.name;
  const species = db.collection("species");
  const result = await species
    .find({
      $or: [
        { commonName: { $regex: term, $options: "i" }},
        { latinName: { $regex: term, $options: "i" }}
      ]
    })
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
      return res.status(500).send(serverErr);

    const response = {
      id: result.insertedId.toString(),
      commonName: commonName,
      latinName: latinName
    };

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(serverErr);
  }
});

// Read bird sightings.
app.get("/sightings", async (req, res) => {
  const sightings = db.collection("sightings");
  const result = await sightings.find({}).toArray();

  const sightingArray = result.map(doc => ({
    id: doc._id.toString(),
    name: doc.name,
    date: doc.date,
    place: doc.place
  }));

  res.status(200).json(sightingArray);
})

// Add a new sighting.
app.post("/sightings", async (req, res) => {
  try {
    const { name, date, place } = req.body;
    if (!name || !date || !place)
      return res.status(400).json({error: "Name, place, and date required"});

    const sightings = db.collection("sightings");
    const result = await sightings.insertOne({name, date, place});

    if (!result)
      return res.status(500).send(serverErr);

    const response = {
      id: result.insertedId.toString(),
      name: name,
      date: date,
      place: place
    };

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(serverErr);
  }
});

// Delete a sighting.
app.delete("/sightings/:id", async (req, res) => {
  try {
    const sightings = db.collection("sightings");
    const result = await sightings.deleteOne({
      _id: ObjectId.createFromHexString(req.params.id)
    });

    if (!result.deletedCount)
      return res.status(500).send(serverErr);

    res.status(200).json({message: "Sighting deleted succesfully"});
  } catch (error) {
    console.log(error);
    res.status(500).send(serverErr);
  }
});

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
