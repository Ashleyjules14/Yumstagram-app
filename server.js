"use strict";

const express = require("express");
const axios = require('axios');
const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "credentialsDontPost/.env"),
});
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("views", "templates");
app.set("view engine", "ejs");

if (process.argv.length !== 3) {
    console.log("Usage server.js portNumber");
    process.exit(1);
}

const port = process.argv[2];

let collection;

/*
async function connectDB() {
    const databaseName = "CMSC335DB";
    const collectionName = "campApplicants";
    const uri = process.env.MONGO_CONNECTION_STRING;
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
    await client.connect();
    const db = client.db(databaseName);
    collection = db.collection(collectionName);
}
*/

app.get("/", (request, response) => {
    response.render("home");
});

app.get("/post", (request, response) => {
    response.render("post");
});

app.post("/post", async (request, response) => {
    const { username, description, type } = request.body;

    let photoUrl = null;
    try {
        const axiosResponse = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
            query: description,
            per_page: 1,
            orientation: 'landscape'
        },
        headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
        });
        const results = axiosResponse.data.results;
        if (results.length > 0) {
        photoUrl = results[0].urls.regular;
        }
    } catch (err) {
        console.error('Unsplash error:', err.message);
    }

    await collection.insertOne({
        username,
        description,
        type,
        photoUrl: photoUrl || null
    });

    response.render("postConfirm", { username, description, type, photoUrl });
});

app.get("/view", (request, response) => {
    response.render("view");
});

app.post("/view", async (request, response) => {
    const { type } = request.body;

    const posts = await collection.find({ type: type }).toArray();

    response.render("viewConfirm", { posts });
});

app.get("/archive", async (request, response) => {
    const posts = await collection.find().toArray();

    response.render("viewConfirm", { posts });
});

connectDB().then(() => {
    app.listen(port);
    console.log("Web server started at http://localhost:" + port);
    process.stdin.setEncoding("utf8");

    console.log("Stop to shutdown the server:");

    process.stdin.on("data", (input) => {
        const command = input.trim();

        if (command === "stop") {
            console.log("Shutting down the server");
            process.exit(0);
        }
    });
});