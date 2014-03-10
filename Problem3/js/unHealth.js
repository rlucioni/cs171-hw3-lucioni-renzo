// Generated by CoffeeScript 1.7.1
var bbDetail, bbOverview, canvasHeight, canvasWidth, convertToInt, dataset, margin, svg;

margin = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

canvasWidth = 960 - margin.left - margin.right;

canvasHeight = 800 - margin.top - margin.bottom;

bbOverview = {
  x: 0,
  y: 10,
  width: canvasWidth,
  height: 50
};

bbDetail = {
  x: 0,
  y: 100,
  width: canvasWidth,
  height: 300
};

convertToInt = function(s) {
  return parseInt(s.replace(/,/g, ""), 10);
};

dataset = [];

svg = d3.select("#visUN").append("svg").attr("width", canvasWidth + margin.left + margin.right).attr("height", canvasHeight + margin.top + margin.top).append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.csv("unHealth.csv", function(data) {});
