// Generated by CoffeeScript 1.7.1
var boundingBox, canvasHeight, canvasWidth, generateLineGraph, margin, svg,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

margin = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

canvasWidth = 1000 - margin.left - margin.right;

canvasHeight = 500 - margin.top - margin.bottom;

svg = d3.select("#vis").append("svg").attr("width", canvasWidth + margin.left + margin.right).attr("height", canvasHeight + margin.top + margin.top).append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

boundingBox = {
  x: 100,
  y: 50,
  width: canvasWidth - 100,
  height: canvasHeight - 50
};

generateLineGraph = function(dataset) {
  var all_estimates, all_years, data, estimate, frame, line, org, point, xAxis, xScale, yAxis, yScale, year, _i, _len;
  all_years = [];
  all_estimates = [];
  for (org in dataset) {
    data = dataset[org];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      point = data[_i];
      year = point.year;
      if (__indexOf.call(all_years, year) < 0) {
        all_years.push(year);
      }
      estimate = point.estimate;
      if (__indexOf.call(all_estimates, estimate) < 0) {
        all_estimates.push(estimate);
      }
    }
  }
  xScale = d3.scale.linear().domain(d3.extent(all_years)).range([0, boundingBox.width]);
  yScale = d3.scale.linear().domain(d3.extent(all_estimates)).range([boundingBox.height, 0]);
  xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  yAxis = d3.svg.axis().scale(yScale).orient("left");
  line = d3.svg.line().x(function(d) {
    return xScale(d.year);
  }).y(function(d) {
    return yScale(d.estimate);
  });
  frame = svg.append("g").attr("transform", "translate(" + boundingBox.x + ", 0)");
  frame.append("g").attr("class", "x-axis").attr("transform", "translate(0, " + boundingBox.height + ")").call(xAxis);
  frame.append("g").attr("class", "y-axis").call(yAxis);
  return frame.append("path").datum(dataset.pop_reference).attr("class", "line").attr("d", line);
};

d3.csv("dataExportWiki.csv", function(data) {
  var dataset, estimate, header, headers, row, year, _i, _j, _len, _len1;
  dataset = {
    us_census: [],
    pop_reference: [],
    un_desa: [],
    hyde: [],
    maddison: []
  };
  headers = ["us_census", "pop_reference", "un_desa", "hyde", "maddison"];
  for (_i = 0, _len = data.length; _i < _len; _i++) {
    row = data[_i];
    year = row.year;
    for (_j = 0, _len1 = headers.length; _j < _len1; _j++) {
      header = headers[_j];
      estimate = row[header];
      if (estimate !== "") {
        dataset[header].push({
          year: +year,
          estimate: +estimate
        });
      }
    }
  }
  return generateLineGraph(dataset);
});