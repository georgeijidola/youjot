const express = require("express")
const mongoose = require("mongoose")

const router = express.Router()
const {ensureAuthenticated} = require('../helpers/auth')

// Load Idea Model
require("../models/Idea")
const Idea = mongoose.model("ideas")

// Ideas index page
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      })
    })
})

// Add Idea Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add")
})

// Add Edit Idea Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if(idea.user != req.user.id) {
      res.render('errors/error401')
    } else {
      res.render("ideas/edit", {
        idea: idea
      })
    }
  })
})

// Process Form
router.post("/ideas", ensureAuthenticated, (req, res) => {
  const title = req.body.title
  const details = req.body.details
  const user = req.body.id

  if (!title || !details) {
    if (!title) {
      req.flash("errorMsg", "Please add a title")
    }
    if (!details) {
      req.flash("errorMsg", "Please add details")
    }
    res.render("ideas/add", {
      title: title,
      details: details
    })
  } else {
    const newUser = {
      title: title,
      details: details,
      user: user
    }
    new Idea(newUser).save().then(idea => {
      req.flash("successMsg", "Video Idea added")
      res.redirect("/ideas")
    })
  }
})

// Idea update
router.put("/:id", ensureAuthenticated, (req, res) => {
  const title = req.body.title
  const details = req.body.details

  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // New values
    Idea.title = title
    console.log(`received ${Idea.title}`)
    Idea.details = details

    idea.save().then(idea => {
      console.log(idea)
      req.flash("successMsg", "Video Idea updated")
      console.log(idea.save())
      res.redirect("/ideas")
    })
  })
})

// Delete Idea
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.deleteOne({
    _id: req.params.id
  }).then(idea => {
    res.redirect("/ideas")
  })
})

module.exports = router
