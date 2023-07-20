const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');
const port = 8000;
app.get("/", function (req, res) {
  res.render("home");
});
async function main() {
  console.log("Connecting to MongoDB");
  await mongoose.connect(
    "mongodb+srv://siddharthamukherjee0709:sidd12345@cluster0.pn4vvtl.mongodb.net/?retryWrites=true&w=majority"
  );
  console.log("Connected to MongoDB");
}
main();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
const urlSchema = new mongoose.Schema({
  webLink: String,
  shortLink: String
});
const WebLink = mongoose.model("WebLink", urlSchema, "weblink-posts");
app.post("/submit", async function (req, res) {
  const webLink = req.body.webLink;
  const existingLink = await WebLink.findOne({ webLink: webLink });
  if (!existingLink) {
    const uniqueId = shortid.generate().substring(0, 5);
    const shortLink = "short." + uniqueId;
    const newLink = new WebLink({
      webLink: webLink,
      shortLink: shortLink
    });
    try {
      await newLink.save();
      console.log(newLink); // Log the saved link after it's saved to the database
      res.render("new", { data: newLink });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.render("error")
  }
});
app.get('/:code', async (req, res) => {
    console.log(req.params.code);
    const url = await WebLink.find({ shortLink: req.params.code });
    console.log(url);
    res.redirect(url[0].webLink);
});
app.listen(port, function () {
  console.log(`App is running on port - ${port}`);
});