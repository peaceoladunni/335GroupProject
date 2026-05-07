"use strict";
/* Uses Mongoose */

const mongoose = require("mongoose");

/* Schema defines the shape of an assignment document in MongoDB */
const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: String, required: true },
    dueDate: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    email: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

/* Create and export the model so routes can use it */
const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
