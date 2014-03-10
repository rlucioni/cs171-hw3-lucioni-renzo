// Generated by CoffeeScript 1.7.1
var addCommas, boundingBox, canvasHeight, canvasWidth, colorbrewerGreen, generateLineGraph, labelPadding, line, lowerErrorBand, margin, orgs, svg, tooltipOffset, upperErrorBand, xAxis, xScale, yAxis, yScale,
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
  y: 50,
  width: canvasWidth - 100,
  height: canvasHeight - 50
};

orgs = ["us_census", "pop_reference", "un_desa", "hyde", "maddison"];

labelPadding = 7;

colorbrewerGreen = "#4daf4a";

tooltipOffset = 5;

addCommas = function(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

xScale = d3.scale.linear().range([0, boundingBox.width]);

yScale = d3.scale.log().range([boundingBox.height, 0]);

xAxis = d3.svg.axis().scale(xScale).orient("bottom");

yAxis = d3.svg.axis().scale(yScale).orient("left");

line = d3.svg.line().interpolate("linear").x(function(d) {
  return xScale(d.year);
}).y(function(d) {
  return yScale(d.consensusValue);
});

upperErrorBand = d3.svg.area().x(function(d) {
  return xScale(d.year);
}).y0(function(d) {
  return yScale(d.consensusValue);
}).y1(function(d) {
  return yScale(d.maxEstimate);
});

lowerErrorBand = d3.svg.area().x(function(d) {
  return xScale(d.year);
}).y0(function(d) {
  return yScale(d.minEstimate);
}).y1(function(d) {
  return yScale(d.consensusValue);
});

generateLineGraph = function(dataset) {
  var absoluteLowerDivergence, absoluteUpperDivergence, chartArea, combinedData, consensusValue, frame, maxEstimate, minEstimate, org, point, points, relativeLowerDivergence, relativeUpperDivergence, relevantEstimates, year, zoom, zoomed, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
  xScale.domain(d3.extent(dataset.allYears));
  yScale.domain(d3.extent(dataset.allEstimates));
  zoomed = function() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
    svg.select(".error-band.upper").attr("d", upperErrorBand);
    svg.select(".error-band.lower").attr("d", lowerErrorBand);
    svg.select(".line").attr("d", line);
    return svg.selectAll(".point").attr("transform", function(d) {
      return "translate(" + (xScale(d.year)) + ", " + (yScale(d.consensusValue)) + ")";
    });
  };
  zoom = d3.behavior.zoom().x(xScale).y(yScale).on("zoom", zoomed);
  frame = svg.append("g").attr("transform", "translate(" + boundingBox.x + ", 0)").call(zoom);
  frame.append("clipPath").attr("id", "clip").append("rect").attr("width", boundingBox.width).attr("height", boundingBox.height);
  frame.append("g").attr("class", "x axis").attr("transform", "translate(0, " + boundingBox.height + ")").call(xAxis);
  frame.append("g").attr("class", "y axis").call(yAxis);
  frame.append("text").attr("class", "x label").attr("text-anchor", "end").attr("x", boundingBox.width).attr("y", boundingBox.height - labelPadding).text("Year");
  frame.append("text").attr("class", "y label").attr("text-anchor", "end").attr("y", labelPadding).attr("dy", ".75em").attr("transform", "rotate(-90)").text("log₁₀(Population)");
  combinedData = [];
  _ref = dataset.allYears;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    year = _ref[_i];
    relevantEstimates = [];
    for (_j = 0, _len1 = orgs.length; _j < _len1; _j++) {
      org = orgs[_j];
      _ref1 = dataset[org];
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        point = _ref1[_k];
        if (point.year === year) {
          relevantEstimates.push(point.estimate);
          break;
        }
      }
    }
    consensusValue = d3.mean(relevantEstimates);
    _ref2 = d3.extent(relevantEstimates), minEstimate = _ref2[0], maxEstimate = _ref2[1];
    absoluteUpperDivergence = maxEstimate - consensusValue;
    absoluteLowerDivergence = consensusValue - minEstimate;
    relativeUpperDivergence = (maxEstimate / consensusValue) * 100 - 100;
    relativeLowerDivergence = 100 - (minEstimate / consensusValue) * 100;
    combinedData.push({
      year: year,
      consensusValue: consensusValue,
      maxEstimate: maxEstimate,
      minEstimate: minEstimate,
      absoluteUpperDivergence: absoluteUpperDivergence,
      absoluteLowerDivergence: absoluteLowerDivergence,
      relativeUpperDivergence: relativeUpperDivergence,
      relativeLowerDivergence: relativeLowerDivergence
    });
  }
  chartArea = frame.append("g").attr("clip-path", "url(#clip)");
  chartArea.append("rect").attr("class", "overlay").attr("width", boundingBox.width).attr("height", boundingBox.height);
  chartArea.append("path").datum(combinedData).attr("class", "error-band upper").attr("d", upperErrorBand);
  chartArea.append("path").datum(combinedData).attr("class", "error-band lower").attr("d", lowerErrorBand);
  chartArea.append("path").datum(combinedData).attr("class", "line").attr("d", line);
  points = chartArea.selectAll(".point").data(combinedData).enter().append("circle").attr("class", "point").attr("transform", function(d) {
    return "translate(" + (xScale(d.year)) + ", " + (yScale(d.consensusValue)) + ")";
  }).attr("r", 4);
  points.on("mouseover", function(d) {
    d3.select(this).style("fill", colorbrewerGreen);
    d3.select("#tooltip").style("left", "" + (d3.event.pageX + tooltipOffset) + "px").style("top", "" + (d3.event.pageY + tooltipOffset) + "px");
    d3.select("#consensus-value").text("" + (addCommas(Math.round(d.consensusValue))) + " individuals");
    d3.select("#upper-divergence").text("" + (addCommas(Math.round(d.absoluteUpperDivergence))) + " individuals (" + (d.relativeUpperDivergence.toFixed(2)) + "%)");
    d3.select("#lower-divergence").text("" + (addCommas(Math.round(d.absoluteLowerDivergence))) + " individuals (" + (d.relativeLowerDivergence.toFixed(2)) + "%)");
    return d3.select("#tooltip").classed("hidden", false);
  });
  return points.on("mouseout", function() {
    d3.select(this).transition().duration(500).style("fill", "white");
    return d3.select("#tooltip").classed("hidden", true);
  });
};

d3.csv("dataExportWiki.csv", function(data) {
  var allEstimates, allYears, dataset, estimate, estimates, interpolatedData, interpolator, org, point, relevantYears, row, year, years, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o, _ref;
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
      interpolatedData.push({
        year: year,
        estimate: estimate
      });
    }
    dataset[org] = interpolatedData;
  }
  return generateLineGraph(dataset);
});
