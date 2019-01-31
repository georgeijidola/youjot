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
      failureRedirect: '/users/login',
      failureFlash: true
  })(req, res, next)
})

// User Signup Login
router.get("/signup", (req, res) => {
  res.render("users/signup")
})

// New User
router.post("/signup", (req, res, next) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const phoneNo = req.body.phoneNo
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const isAdmin = false

  if ((password != confirmPassword) || (password.length < 8)) {
    if (password != confirmPassword) {
      req.flash("errorMsg", " Passwords do not match" )
    }
  
    if (password.length < 8) {
      req.flash("errorMsg", " Password must be at least 8 characters")
    }

    res.render("users/signup", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNo: phoneNo
    })
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        req.flash("errorMsg", " Email already used")
        res.redirect("/users/signup")
      } else {
        const newUser = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNo: phoneNo,
          password: password,
          isAdmin: isAdmin
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            // if(err) throw err
            newUser.password = hash
            newUser
              .save()
              .then(user => {
                passport.authenticate('local', {
                  successRedirect: '/ideas',
                  failureRedirect: '/users/login',
                  failureFlash: true
                })(req, res, next)
                req.flash("successMsg", " You are now registered and logged in")
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

// User logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('successMsg', 'You are logged out')
  res.redirect('/users/login')
})

module.exports = router
