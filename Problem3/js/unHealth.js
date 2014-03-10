// Generated by CoffeeScript 1.7.1
var bbDetail, bbOverview, canvasHeight, canvasWidth, detailArea, detailLine, detailXAxis, detailXScale, detailYAxis, detailYScale, generateGraph, labelPadding, margin, overviewLine, overviewXAxis, overviewXScale, overviewYAxis, overviewYScale, svg;

margin = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

canvasWidth = 1100 - margin.left - margin.right;

canvasHeight = 800 - margin.top - margin.bottom;

svg = d3.select("#visUN").append("svg").attr("width", canvasWidth + margin.left + margin.right).attr("height", canvasHeight + margin.top + margin.top).append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

labelPadding = 7;

bbDetail = {
  x: 50,
  y: 10,
  width: canvasWidth - 50,
  height: 350
};

detailXScale = d3.time.scale().range([0, bbDetail.width]);

detailYScale = d3.scale.linear().range([bbDetail.height, 0]);

detailXAxis = d3.svg.axis().scale(detailXScale).orient("bottom");

detailYAxis = d3.svg.axis().scale(detailYScale).orient("left");

detailLine = d3.svg.line().interpolate("linear").x(function(d) {
  return detailXScale(d.date);
}).y(function(d) {
  return detailYScale(d.tweets);
});

detailArea = d3.svg.area().x(function(d) {
  return detailXScale(d.date);
}).y0(bbDetail.height).y1(function(d) {
  return detailYScale(d.tweets);
});

bbOverview = {
  x: 50,
  y: 400,
  width: canvasWidth - 50,
  height: 75
};

overviewXScale = d3.time.scale().range([0, bbOverview.width]);

overviewYScale = d3.scale.linear().range([bbOverview.height, 0]);

overviewXAxis = d3.svg.axis().scale(overviewXScale).innerTickSize([0]).tickPadding([10]).orient("bottom");

overviewYAxis = d3.svg.axis().scale(overviewYScale).ticks([3]).innerTickSize([0]).tickPadding([10]).orient("left");

overviewLine = d3.svg.line().interpolate("linear").x(function(d) {
  return overviewXScale(d.date);
}).y(function(d) {
  return overviewYScale(d.tweets);
});

generateGraph = function(dataset) {
  var allDates, allTweets, detailFrame, overviewFrame, point, _i, _len;
  allDates = [];
  allTweets = [];
  for (_i = 0, _len = dataset.length; _i < _len; _i++) {
    point = dataset[_i];
    allDates.push(point.date);
    allTweets.push(point.tweets);
  }
  detailXScale.domain(d3.extent(allDates));
  detailYScale.domain([0, d3.max(allTweets)]);
  overviewXScale.domain(d3.extent(allDates));
  overviewYScale.domain([0, d3.max(allTweets)]);
  detailFrame = svg.append("g").attr("transform", "translate(" + bbDetail.x + ", " + bbDetail.y + ")");
  detailFrame.append("g").attr("class", "x axis detail").attr("transform", "translate(0, " + bbDetail.height + ")").call(detailXAxis);
  detailFrame.append("g").attr("class", "y axis detail").call(detailYAxis);
  detailFrame.append("text").attr("class", "x label detail").attr("text-anchor", "end").attr("x", bbDetail.width).attr("y", bbDetail.height - labelPadding).text("Date");
  detailFrame.append("text").attr("class", "y label detail").attr("text-anchor", "end").attr("y", labelPadding).attr("dy", ".75em").attr("transform", "rotate(-90)").text("Tweets");
  overviewFrame = svg.append("g").attr("transform", "translate(" + bbOverview.x + ", " + bbOverview.y + ")");
  overviewFrame.append("g").attr("class", "x axis overview").attr("transform", "translate(0, " + bbOverview.height + ")").call(overviewXAxis);
  overviewFrame.append("g").attr("class", "y axis overview").call(overviewYAxis);
  overviewFrame.append("text").attr("class", "x label overview").attr("text-anchor", "end").attr("x", bbOverview.width).attr("y", bbOverview.height - labelPadding).text("Date");
  overviewFrame.append("text").attr("class", "y label overview").attr("text-anchor", "end").attr("y", labelPadding).attr("dy", ".75em").attr("transform", "rotate(-90)").text("Tweets");
  detailFrame.append("path").datum(dataset).attr("class", "area detail").attr("d", detailArea);
  detailFrame.append("path").datum(dataset).attr("class", "line detail").attr("d", detailLine);
  overviewFrame.append("path").datum(dataset).attr("class", "line overview").attr("d", overviewLine);
  detailFrame.selectAll(".point.detail").data(dataset).enter().append("circle").attr("class", "point detail").attr("transform", function(d) {
    return "translate(" + (detailXScale(d.date)) + ", " + (detailYScale(d.tweets)) + ")";
  }).attr("r", 3);
  return overviewFrame.selectAll(".point.overview").data(dataset).enter().append("circle").attr("class", "point overview").attr("transform", function(d) {
    return "translate(" + (overviewXScale(d.date)) + ", " + (overviewYScale(d.tweets)) + ")";
  }).attr("r", 3);
};

d3.csv("unHealth.csv", function(data) {
  var dataset, row, timeFormat, _i, _len;
  dataset = [];
  timeFormat = d3.time.format("%B%Y");
  for (_i = 0, _len = data.length; _i < _len; _i++) {
    row = data[_i];
    dataset.push({
      date: timeFormat.parse(row.date),
      tweets: +row.tweets
    });
  }
  return generateGraph(dataset);
});
