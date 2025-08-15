# Birdie

Bird sighting app. This is a toy project to learn Angular, Node.js, and MongoDB.

# Important #
Uses MongoDB for storing bird species and sightings. Store the connection string
in *ATLAS_URI* env variable. For example place it in .env file in *bird-backend*
folder.

You can test it by starting the backend in *bird-backend*:

```
node index.js
```

Then run the Angular app locally from project root:

```
ng serve
```

Of course to really try it you need to set up a similar MongoDB. Name of the
database is in *connection.js*. Examples of the bird species data is in
*birds-example.json* and examples of the sightings data in
*sightings-example.json* in *public/assets*.
