const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const passport = require("passport")

const router = express.Router()

// Load User Model
require("../models/User")
const User = mongoose.model("users")

// User Login
router.get("/login", (req, res) => {
  res.render("users/login")
})

// User Login Auth
router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/ideas/login',
        failureFlash: true
    })(req, res, next)
  })

  
// User Signup Login
router.get("/signup", (req, res) => {
  res.render("users/signup")
})

// New User
router.post("/signup", (req, res) => {
    console.log('Check 1')
  let errors = []

  if (req.body.password != req.body.confirmPassword) {
    errors.push({ text: "Passwords do not match" })
  }

  if (req.body.password.length < 8) {
    errors.push({ text: "Password must be at least 8 characters" })
  }

  if (errors.length > 0) {
    console.log('Check 2')
    res.render("users/signup", {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNo: req.body.phoneNo,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    })
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("errorMsg", "Email already used")
        console.log('Check 3')
        res.redirect("/users/signup")
      } else {
        console.log('Check 4')
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNo: req.body.phoneNo,
          password: req.body.password
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.passowrd, salt, (err, hash) => {
            // if(err) throw err
            console.log('Check 5')
            newUser.password = hash
            newUser
              .save()
              console.log('Check 6')
              .then(user => {
                req.flash("successMsg", "You are now registered and logged in")
              })
              .catch(err => {
                return
              })
          })
        })
      }
    })
  }
})

router.get('/logout', (res, req) => {
  req.logout()
  req.flash('successMsg', 'You are logged out')
  res.redirect('/user/login')
})

module.exports = router
