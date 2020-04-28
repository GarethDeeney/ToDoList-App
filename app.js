// jshint esversion : 6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
var items = [];

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect('mongodb+srv://gareth-admin:Atlas-admin@cluster0-kzdg1.mongodb.net/todolistDB', {
  useNewUrlParser: true
});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your to do list"
});

const item2 = new Item({
  name: "Hit the + button to add a new task"
});

const item3 = new Item({
  name: "<-- Hit the checkbox to delete the task"
});

const defaultItems = [item1, item2, item3];


app.get("/", function(req, res) {

  var today = new Date();
  var currentDay = today.getDay();
  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  var day = today.toLocaleDateString("en-GB", options);

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(error) {
        if (error) {
          console.log(error);
        } else {
          console.log("defaultItems have been successfully added to the database");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        kindOfDay: day,
        newListItem: foundItems
      });
    }
  });
});

app.post("/delete", function(req, res) {

  var itemId = req.body.checkbox;
  Item.findByIdAndRemove(itemId, function(err) {
    if (!err) {
      console.log("Successfully Deleted");
      res.redirect("/");
    }
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started successfully");
});
