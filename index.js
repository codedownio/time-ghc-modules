

const fs = require("fs");
const express = require("express");
const path = require("path");
const process = require("process");

const data_file = process.argv[2];
console.log("Node server got data file", data_file);

var app = express();

app.get("/", function(req, res) {
  var contents = fs.readFileSync(path.join(__dirname, "dist", "index.html"), "utf8");
  var data = fs.readFileSync(data_file, "utf8");
  res.send(contents.replace('"INSERT_DATA_HERE"', data));
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("/data", function (req, res) {
  res.sendFile(data_file);
});

var listener = app.listen(0, function() {
  console.log("Running visualizer at http://localhost:" + listener.address().port);
});
