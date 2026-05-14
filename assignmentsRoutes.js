"use strict";
/* Uses express.Router() */
const express = require("express");
const router = express.Router();
const Assignment = require("./Assignments");
const { getRandomQuote } = require("./services/zenQuotes");
const { sendQuoteEmail } = require("./services/emailService");

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
  const { title, course, dueDate, priority, email } = request.body;
  const newAssignment = new Assignment({ title, course, dueDate, priority, email });
  await newAssignment.save();

  /* Fetch a zen quote from the ZenQuotes API */
  const { quote, author } = await getRandomQuote();

  /* Email the user the quote via EmailJS (don't crash the route if it fails) */
  let emailed = false;
  if (email) {
    const result = await sendQuoteEmail(email, quote, author);
    emailed = result.success;
    if (result.success == false) {
      console.error("email send failed:", result.error);
    }
  }

  response.render("confirmation", { title, course, dueDate, priority, quote, author, emailed });
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