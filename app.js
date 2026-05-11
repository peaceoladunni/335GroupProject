
"use strict";
/* Uses Node.js and Express */

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const assignmentRoutes = require("./assignmentsRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

/* Attach the assignment router */
app.use("/", assignmentRoutes);

if (process.argv.length !== 3) {
    process.stdout.write("Usage: node app.js PORT_NUMBER\n");
    process.exit(1);
}

const portNumber = process.argv[2];

/* Connect to MongoDB then start server */
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
        app.listen(portNumber, () => {
            console.log(`Web server started and running at http://localhost:${portNumber}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });