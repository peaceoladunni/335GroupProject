"use strict";
/* Uses express.Router() */

const express = require("express");
const router = express.Router();
const Assignment = require("./Assignments");

/* Home page */
router.get("/", (request, response) => {
    response.render("index");
});

/* Show add assignment form */
router.get("/addAssignment", (request, response) => {
    response.render("addAssignment");
});

/* Handle add assignment form submission */
router.post("/submitAssignment", async (request, response) => {
    const { title, course, dueDate, priority } = request.body;

    const newAssignment = new Assignment({ title, course, dueDate, priority });
    await newAssignment.save();

    response.render("confirmation", { title, course, dueDate, priority });
});

/* Show search form */
router.get("/search", (request, response) => {
    response.render("search");
});

/* Handle search by course */
router.post("/searchResults", async (request, response) => {
    const { course } = request.body;

    const results = await Assignment.find({ course: { $regex: course, $options: "i" } });

    response.render("searchResults", { results, course });
});

/* Mark assignment as complete */
router.post("/markComplete", async (request, response) => {
    const { id } = request.body;

    await Assignment.findByIdAndUpdate(id, { completed: true });

    response.redirect("/search");
});

/* Delete an assignment */
router.post("/deleteAssignment", async (request, response) => {
    const { id } = request.body;

    await Assignment.findByIdAndDelete(id);

    response.redirect("/search");
});

module.exports = router;
