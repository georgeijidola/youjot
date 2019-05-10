if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://superuser:1superuser@ds153906.mlab.com:53906/youjot-prod"
  }
} else {
  module.exports = { 
      mongoURI: "mongodb://localhost/youjot-dev" 
    }
}
