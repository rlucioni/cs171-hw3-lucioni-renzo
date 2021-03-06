// Generated by CoffeeScript 1.7.1
var August2012, February2012, annotations, bbContext, bbFocus, brewerBlue, canvasHeight, canvasWidth, contextLine, contextXAxis, contextXScale, contextYAxis, contextYScale, focusArea, focusLine, focusXAxis, focusXScale, focusYAxis, focusYScale, generateGraph, margin, padding, parseDate, svg;

margin = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

canvasWidth = 1100 - margin.left - margin.right;

canvasHeight = 800 - margin.top - margin.bottom;

svg = d3.select("#visUN").append("svg").attr("width", canvasWidth + margin.left + margin.right).attr("height", canvasHeight + margin.top + margin.top).append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

brewerBlue = "#1f78b4";

padding = {
  labelX: 5,
  labelY: 7,
  contextGraphArea: 30,
  annotationOffset: 10
};

parseDate = d3.time.format("%B%Y").parse;

annotations = [
  February2012 = {
    date: parseDate("February2012").getTime(),
    brushExtent: [parseDate("December2011"), parseDate("April2012")],
    firstLine: "Rules announced requiring",
    secondLine: "health plans to cover preventive",
    thirdLine: "services for women without co-pay"
  }, August2012 = {
    date: parseDate("August2012").getTime(),
    brushExtent: [parseDate("June2012"), parseDate("October2012")],
    firstLine: "New rules go into effect",
    secondLine: "",
    thirdLine: ""
  }
];

bbFocus = {
  x: 50,
  y: 10,
  width: canvasWidth - 50,
  height: 350
};

focusXScale = d3.time.scale().range([0, bbFocus.width]);

focusYScale = d3.scale.linear().range([bbFocus.height, 0]);

focusXAxis = d3.svg.axis().scale(focusXScale).orient("bottom");

focusYAxis = d3.svg.axis().scale(focusYScale).orient("left");

focusLine = d3.svg.line().interpolate("linear").x(function(d) {
  return focusXScale(d.date);
}).y(function(d) {
  return focusYScale(d.tweets);
});

focusArea = d3.svg.area().x(function(d) {
  return focusXScale(d.date);
}).y0(bbFocus.height).y1(function(d) {
  return focusYScale(d.tweets);
});

bbContext = {
  x: 50,
  y: 400,
  width: canvasWidth - 50,
  height: 75
};

contextXScale = d3.time.scale().range([0, bbContext.width]);

contextYScale = d3.scale.linear().range([bbContext.height, 0]);

contextXAxis = d3.svg.axis().scale(contextXScale).innerTickSize([0]).tickPadding([10]).orient("bottom");

contextYAxis = d3.svg.axis().scale(contextYScale).ticks([3]).innerTickSize([0]).tickPadding([10]).orient("left");

contextLine = d3.svg.line().interpolate("linear").x(function(d) {
  return contextXScale(d.date);
}).y(function(d) {
  return contextYScale(d.tweets);
});

generateGraph = function(dataset) {
  var allDates, allTweets, annotation, brush, brushed, candidateDate, contextFrame, focusFrame, focusFrameMask, point, remarkableEvents, _i, _j, _k, _len, _len1, _len2;
  allDates = [];
  allTweets = [];
  for (_i = 0, _len = dataset.length; _i < _len; _i++) {
    point = dataset[_i];
    allDates.push(point.date);
    allTweets.push(point.tweets);
  }
  focusXScale.domain(d3.extent(allDates));
  focusYScale.domain([0, d3.max(allTweets)]);
  contextXScale.domain(d3.extent(allDates));
  contextYScale.domain([0, d3.max(allTweets)]);
  focusFrame = svg.append("g").attr("transform", "translate(" + bbFocus.x + ", " + bbFocus.y + ")");
  focusFrame.append("g").attr("class", "x axis focus").attr("transform", "translate(0, " + bbFocus.height + ")").call(focusXAxis);
  focusFrame.append("g").attr("class", "y axis focus").call(focusYAxis);
  focusFrame.append("text").attr("class", "x label focus").attr("text-anchor", "end").attr("x", bbFocus.width - padding.labelX).attr("y", bbFocus.height - padding.labelY).text("Date");
  focusFrame.append("text").attr("class", "y label focus").attr("text-anchor", "end").attr("y", padding.labelY).attr("dy", ".75em").attr("transform", "rotate(-90)").text("Tweets");
  contextFrame = svg.append("g").attr("transform", "translate(" + bbContext.x + ", " + bbContext.y + ")");
  contextFrame.append("g").attr("class", "x axis context").attr("transform", "translate(0, " + bbContext.height + ")").call(contextXAxis);
  contextFrame.append("g").attr("class", "y axis context").call(contextYAxis);
  contextFrame.append("text").attr("class", "x label context").attr("text-anchor", "end").attr("x", bbContext.width - padding.labelX).attr("y", bbContext.height - padding.labelY).text("Date");
  contextFrame.append("text").attr("class", "y label context").attr("text-anchor", "end").attr("y", padding.labelY).attr("dy", ".75em").attr("transform", "rotate(-90)").text("Tweets");
  brushed = function() {
    focusXScale.domain(brush.empty() ? contextXScale.domain() : brush.extent());
    focusFrame.select(".x.axis.focus").call(focusXAxis);
    focusFrame.select(".line.focus").attr("d", focusLine);
    focusFrame.select(".area.focus").attr("d", focusArea);
    focusFrame.selectAll(".point.focus").attr("transform", function(d) {
      return "translate(" + (focusXScale(d.date)) + ", " + (focusYScale(d.tweets)) + ")";
    });
    focusFrame.selectAll(".annotation.shadow").attr("transform", function(d) {
      return "translate(" + (focusXScale(d.date) + padding.annotationOffset) + ", " + (focusYScale(d.tweets) + padding.annotationOffset) + ")";
    });
    return focusFrame.selectAll(".annotation.text").attr("transform", function(d) {
      return "translate(" + (focusXScale(d.date) + padding.annotationOffset) + ", " + (focusYScale(d.tweets) + padding.annotationOffset) + ")";
    });
  };
  brush = d3.svg.brush().x(contextXScale).on("brush", brushed);
  contextFrame.append("g").attr("class", "x brush").call(brush).selectAll("rect").attr("y", -padding.labelY).attr("height", bbContext.height + padding.labelY);
  contextFrame.select(".background").attr("height", bbContext.height + padding.labelY + padding.contextGraphArea);
  focusFrame.append("clipPath").attr("id", "clip").append("rect").attr("y", -padding.labelY).attr("width", bbFocus.width).attr("height", bbFocus.height + padding.labelY);
  focusFrameMask = focusFrame.append("g").attr("clip-path", "url(#clip)");
  focusFrameMask.append("path").datum(dataset).attr("class", "area focus").attr("d", focusArea);
  focusFrameMask.append("path").datum(dataset).attr("class", "line focus").attr("d", focusLine);
  contextFrame.append("path").datum(dataset).attr("class", "line context").attr("d", contextLine);
  focusFrameMask.selectAll(".point.focus").data(dataset).enter().append("circle").attr("class", "point focus").attr("transform", function(d) {
    return "translate(" + (focusXScale(d.date)) + ", " + (focusYScale(d.tweets)) + ")";
  }).attr("r", 3).style("fill", function(d) {
    var annotation, _j, _len1;
    for (_j = 0, _len1 = annotations.length; _j < _len1; _j++) {
      annotation = annotations[_j];
      if (d.date.getTime() === annotation.date) {
        return brewerBlue;
        break;
      }
    }
    return "white";
  });
  contextFrame.selectAll(".point.context").data(dataset).enter().append("circle").attr("class", "point context").attr("transform", function(d) {
    return "translate(" + (contextXScale(d.date)) + ", " + (contextYScale(d.tweets)) + ")";
  }).attr("r", 3).style("fill", function(d) {
    var annotation, _j, _len1;
    for (_j = 0, _len1 = annotations.length; _j < _len1; _j++) {
      annotation = annotations[_j];
      if (d.date.getTime() === annotation.date) {
        return brewerBlue;
        break;
      }
    }
    return "white";
  });
  remarkableEvents = [];
  for (_j = 0, _len1 = dataset.length; _j < _len1; _j++) {
    point = dataset[_j];
    candidateDate = point.date.getTime();
    for (_k = 0, _len2 = annotations.length; _k < _len2; _k++) {
      annotation = annotations[_k];
      if (candidateDate === annotation.date) {
        remarkableEvents.push(point);
        break;
      }
    }
  }
  focusFrameMask.selectAll(".annotation.shadow").data(remarkableEvents).enter().append("text").attr("class", "annotation shadow").attr("transform", function(d) {
    return "translate(" + (focusXScale(d.date) + padding.annotationOffset) + ", " + (focusYScale(d.tweets) + padding.annotationOffset) + ")";
  }).text(function(d) {
    var _l, _len3;
    for (_l = 0, _len3 = annotations.length; _l < _len3; _l++) {
      annotation = annotations[_l];
      if (d.date.getTime() === annotation.date) {
        return annotation.firstLine;
      }
    }
  }).append("tspan").attr('x', 0).attr('dy', "1.2em").text(function(d) {
    var _l, _len3;
    for (_l = 0, _len3 = annotations.length; _l < _len3; _l++) {
      annotation = annotations[_l];
      if (d.date.getTime() === annotation.date) {
        return annotation.secondLine;
      }
    }
  }).append("tspan").attr('x', 0).attr('dy', "1.2em").text(function(d) {
    var _l, _len3;
    for (_l = 0, _len3 = annotations.length; _l < _len3; _l++) {
      annotation = annotations[_l];
      if (d.date.getTime() === annotation.date) {
        return annotation.thirdLine;
      }
    }
  });
  focusFrameMask.selectAll(".annotation.text").data(remarkableEvents).enter().append("text").attr("class", "annotation text").attr("transform", function(d) {
    return "translate(" + (focusXScale(d.date) + padding.annotationOffset) + ", " + (focusYScale(d.tweets) + padding.annotationOffset) + ")";
  }).text(function(d) {
    var _l, _len3;
    for (_l = 0, _len3 = annotations.length; _l < _len3; _l++) {
      annotation = annotations[_l];
      if (d.date.getTime() === annotation.date) {
        return annotation.firstLine;
      }
    }
  }).append("tspan").attr('x', 0).attr('dy', "1.2em").text(function(d) {
    var _l, _len3;
    for (_l = 0, _len3 = annotations.length; _l < _len3; _l++) {
      annotation = annotations[_l];
      if (d.date.getTime() === annotation.date) {
        return annotation.secondLine;
      }
    }
  }).append("tspan").attr('x', 0).attr('dy', "1.2em").text(function(d) {
    var _l, _len3;
    for (_l = 0, _len3 = annotations.length; _l < _len3; _l++) {
      annotation = annotations[_l];
      if (d.date.getTime() === annotation.date) {
        return annotation.thirdLine;
      }
    }
  });
  return d3.selectAll("text").on("click", function(d) {
    var _l, _len3;
    for (_l = 0, _len3 = annotations.length; _l < _len3; _l++) {
      annotation = annotations[_l];
      if (d.date.getTime() === annotation.date) {
        brush.extent(annotation.brushExtent);
        break;
      }
    }
    contextFrame.select(".x.brush").transition().duration(750).call(brush);
    focusXScale.domain(brush.extent());
    focusFrame.select(".x.axis.focus").transition().duration(750).call(focusXAxis);
    focusFrame.select(".line.focus").transition().duration(750).attr("d", focusLine);
    focusFrame.select(".area.focus").transition().duration(750).attr("d", focusArea);
    focusFrame.selectAll(".point.focus").transition().duration(750).attr("transform", function(d) {
      return "translate(" + (focusXScale(d.date)) + ", " + (focusYScale(d.tweets)) + ")";
    });
    focusFrame.selectAll(".annotation.shadow").transition().duration(750).attr("transform", function(d) {
      return "translate(" + (focusXScale(d.date) + padding.annotationOffset) + ", " + (focusYScale(d.tweets) + padding.annotationOffset) + ")";
    });
    return focusFrame.selectAll(".annotation.text").transition().duration(750).attr("transform", function(d) {
      return "translate(" + (focusXScale(d.date) + padding.annotationOffset) + ", " + (focusYScale(d.tweets) + padding.annotationOffset) + ")";
    });
  });
};

d3.csv("tweetCounts.csv", function(data) {
  var dataset, row, _i, _len;
  dataset = [];
  for (_i = 0, _len = data.length; _i < _len; _i++) {
    row = data[_i];
    dataset.push({
      date: parseDate(row.date),
      tweets: +row.tweets
    });
  }
  return generateGraph(dataset);
});
