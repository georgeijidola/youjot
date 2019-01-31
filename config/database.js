if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://<dbuser>:<dbpassword>@ds117535.mlab.com:17535/youjot-prod"
  }
} else {
  module.exports = { 
      mongoURI: "mongodb://localhost/youjot-dev" 
    }
}
