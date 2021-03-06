// Generated by CoffeeScript 1.7.1
var boundingBox, canvasHeight, canvasWidth, color, generateLineGraph, labelPadding, line, margin, orgs, svg, xAxis, xScale, yAxis, yScale,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

margin = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

canvasWidth = 1100 - margin.left - margin.right;

canvasHeight = 600 - margin.top - margin.bottom;

svg = d3.select("#vis").append("svg").attr("width", canvasWidth + margin.left + margin.right).attr("height", canvasHeight + margin.top + margin.top).append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

boundingBox = {
  x: 100,
  y: 0,
  width: canvasWidth - 100,
  height: canvasHeight - 50
};

orgs = ["us_census", "pop_reference", "un_desa", "hyde", "maddison"];

labelPadding = 7;

xScale = d3.scale.linear().range([0, boundingBox.width]);

yScale = d3.scale.linear().range([boundingBox.height, 0]);

xAxis = d3.svg.axis().scale(xScale).orient("bottom");

yAxis = d3.svg.axis().scale(yScale).orient("left");

line = d3.svg.line().interpolate("linear").x(function(d) {
  return xScale(d.year);
}).y(function(d) {
  return yScale(d.estimate);
});

color = d3.scale.ordinal().domain(orgs).range(colorbrewer.Set1[5]);

generateLineGraph = function(dataset) {
  var frame, org, _i, _len, _results;
  xScale.domain(d3.extent(dataset.allYears));
  yScale.domain([0, d3.max(dataset.allEstimates)]);
  frame = svg.append("g").attr("transform", "translate(" + boundingBox.x + ", " + boundingBox.y + ")");
  frame.append("g").attr("class", "x axis").attr("transform", "translate(0, " + boundingBox.height + ")").call(xAxis);
  frame.append("g").attr("class", "y axis").call(yAxis);
  frame.append("text").attr("class", "x label").attr("text-anchor", "end").attr("x", boundingBox.width).attr("y", boundingBox.height - labelPadding).text("Year");
  frame.append("text").attr("class", "y label").attr("text-anchor", "end").attr("y", labelPadding).attr("dy", ".75em").attr("transform", "rotate(-90)").text("Population");
  _results = [];
  for (_i = 0, _len = orgs.length; _i < _len; _i++) {
    org = orgs[_i];
    frame.append("path").datum(dataset[org]).attr("class", "line").attr("d", line).style("stroke", color(org));
    _results.push(frame.selectAll(".point." + org).data(dataset[org]).enter().append("circle").attr("class", function(d) {
      if (d.interpolated) {
        return "point " + org + " interpolated";
      } else {
        return "point " + org;
      }
    }).attr("cx", function(d) {
      return xScale(d.year);
    }).attr("cy", function(d) {
      return yScale(d.estimate);
    }).attr("r", 3).style("stroke", function(d) {
      if (d.interpolated) {
        return "black";
      } else {
        return color(org);
      }
    }));
  }
  return _results;
};

d3.csv("populationEstimates.csv", function(data) {
  var allEstimates, allYears, dataset, estimate, estimates, interpolated, interpolatedData, interpolator, org, point, relevantYears, row, year, years, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o, _ref;
  dataset = {};
  for (_i = 0, _len = orgs.length; _i < _len; _i++) {
    org = orgs[_i];
    dataset[org] = [];
  }
  for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
    row = data[_j];
    year = row.year;
    for (_k = 0, _len2 = orgs.length; _k < _len2; _k++) {
      org = orgs[_k];
      estimate = row[org];
      if (estimate !== "") {
        dataset[org].push({
          year: +year,
          estimate: +estimate
        });
      }
    }
  }
  allYears = [];
  allEstimates = [];
  for (org in dataset) {
    data = dataset[org];
    for (_l = 0, _len3 = data.length; _l < _len3; _l++) {
      point = data[_l];
      year = point.year;
      if (__indexOf.call(allYears, year) < 0) {
        allYears.push(year);
      }
      estimate = point.estimate;
      if (__indexOf.call(allEstimates, estimate) < 0) {
        allEstimates.push(estimate);
      }
    }
  }
  dataset.allYears = allYears.sort();
  dataset.allEstimates = allEstimates;
  for (_m = 0, _len4 = orgs.length; _m < _len4; _m++) {
    org = orgs[_m];
    years = [];
    estimates = [];
    _ref = dataset[org];
    for (_n = 0, _len5 = _ref.length; _n < _len5; _n++) {
      point = _ref[_n];
      years.push(point.year);
      estimates.push(point.estimate);
    }
    interpolator = d3.scale.linear().domain(years).range(estimates);
    interpolatedData = [];
    relevantYears = allYears.slice(allYears.indexOf(years[0]), +allYears.indexOf(years[years.length - 1]) + 1 || 9e9);
    for (_o = 0, _len6 = relevantYears.length; _o < _len6; _o++) {
      year = relevantYears[_o];
      estimate = interpolator(year);
      interpolated = true;
      if (__indexOf.call(years, year) >= 0) {
        interpolated = false;
      }
      interpolatedData.push({
        year: year,
        estimate: estimate,
        interpolated: interpolated
      });
    }
    dataset[org] = interpolatedData;
  }
  return generateLineGraph(dataset);
});
