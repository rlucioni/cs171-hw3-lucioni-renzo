# Mike Bostock's margin convention
margin = 
    top:    20, 
    bottom: 20, 
    left:   20, 
    right:  20

canvasWidth = 1100 - margin.left - margin.right
canvasHeight = 800 - margin.top - margin.bottom

svg = d3.select("#visUN").append("svg")
    .attr("width", canvasWidth + margin.left + margin.right)
    .attr("height", canvasHeight + margin.top + margin.top)
    .append("g")
    .attr("transform", "translate(#{margin.left}, #{margin.top})")

# Contains various padding values used throughout my implementation
padding =
    labelX: 5
    labelY: 7
    contextGraphArea: 30

# Configure focus graph bounding box, scales, axes, and path generators
bbFocus =
    x: 50,
    y: 10,
    width: canvasWidth - 50,
    height: 350

focusXScale = d3.time.scale().range([0, bbFocus.width])
focusYScale = d3.scale.linear().range([bbFocus.height, 0])

focusXAxis = d3.svg.axis().scale(focusXScale).orient("bottom")
focusYAxis = d3.svg.axis().scale(focusYScale).orient("left")

focusLine = d3.svg.line()
    .interpolate("linear")
    .x((d) -> focusXScale(d.date))
    .y((d) -> focusYScale(d.tweets))

focusArea = d3.svg.area()
    .x((d) -> focusXScale(d.date))
    .y0(bbFocus.height)
    .y1((d) -> focusYScale(d.tweets))

# Configure context graph bounding box, scales, axes, and path generators
bbContext =
    x: 50,
    y: 400,
    width: canvasWidth - 50,
    height: 75

contextXScale = d3.time.scale().range([0, bbContext.width])
contextYScale = d3.scale.linear().range([bbContext.height, 0])

contextXAxis = d3.svg.axis().scale(contextXScale)
    .innerTickSize([0])
    .tickPadding([10])
    .orient("bottom")
contextYAxis = d3.svg.axis().scale(contextYScale)
    .ticks([3])
    .innerTickSize([0])
    .tickPadding([10])
    .orient("left")

contextLine = d3.svg.line()
    .interpolate("linear")
    .x((d) -> contextXScale(d.date))
    .y((d) -> contextYScale(d.tweets))

generateGraph = (dataset) ->
    allDates = []
    allTweets = []
    for point in dataset
        allDates.push(point.date)
        allTweets.push(point.tweets)

    # Configure scale domains
    focusXScale.domain(d3.extent(allDates))
    focusYScale.domain([0, d3.max(allTweets)])

    contextXScale.domain(d3.extent(allDates))
    contextYScale.domain([0, d3.max(allTweets)])

    # Draw axes and labels
    focusFrame = svg.append("g")
        .attr("transform", "translate(#{bbFocus.x}, #{bbFocus.y})") 
    focusFrame.append("g").attr("class", "x axis focus")
        .attr("transform", "translate(0, #{bbFocus.height})")
        .call(focusXAxis)
    focusFrame.append("g").attr("class", "y axis focus")
        .call(focusYAxis)
    focusFrame.append("text")
        .attr("class", "x label focus")
        .attr("text-anchor", "end")
        .attr("x", bbFocus.width - padding.labelX)
        .attr("y", bbFocus.height - padding.labelY)
        .text("Date")
    focusFrame.append("text")
        .attr("class", "y label focus")
        .attr("text-anchor", "end")
        .attr("y", padding.labelY)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Tweets")

    contextFrame = svg.append("g")
        .attr("transform", "translate(#{bbContext.x}, #{bbContext.y})")
    contextFrame.append("g").attr("class", "x axis context")
        .attr("transform", "translate(0, #{bbContext.height})")
        .call(contextXAxis)
    contextFrame.append("g").attr("class", "y axis context")
        .call(contextYAxis)
    contextFrame.append("text")
        .attr("class", "x label context")
        .attr("text-anchor", "end")
        .attr("x", bbContext.width - padding.labelX)
        .attr("y", bbContext.height - padding.labelY)
        .text("Date")
    contextFrame.append("text")
        .attr("class", "y label context")
        .attr("text-anchor", "end")
        .attr("y", padding.labelY)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Tweets")

    brushed = () ->
        # Resets focus frame to show full dataset if brush deleted, otherwise matches domain to brush extent
        focusXScale.domain(if brush.empty() then contextXScale.domain() else brush.extent())
        focusFrame.select(".x.axis.focus").call(focusXAxis)

        # Move line, area, and points in the focus frame
        focusFrame.select(".line.focus").attr("d", focusLine)
        focusFrame.select(".area.focus").attr("d", focusArea)
        focusFrame.selectAll(".point.focus")
            .attr("transform", (d) -> "translate(#{focusXScale(d.date)}, #{focusYScale(d.tweets)})")
    
    brush = d3.svg.brush()
        .x(contextXScale)
        .on("brush", brushed)
    
    contextFrame.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -padding.labelY)
        .attr("height", bbContext.height + padding.labelY)

    # Extend interactive area so that it includes the area of the x-axis
    contextFrame.select(".background")
        .attr("height", bbContext.height + padding.labelY + padding.contextGraphArea)

    # Clipping mask
    focusFrame.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("y", -padding.labelY)
        .attr("width", bbFocus.width)
        .attr("height", bbFocus.height + padding.labelY)

    focusFrameMask = focusFrame.append("g").attr("clip-path", "url(#clip)")

    # Draw data
    focusFrameMask.append("path")
        .datum(dataset)
        .attr("class", "area focus")
        .attr("d", focusArea)

    focusFrameMask.append("path")
        .datum(dataset)
        .attr("class", "line focus")
        .attr("d", focusLine)

    contextFrame.append("path")
        .datum(dataset)
        .attr("class", "line context")
        .attr("d", contextLine)

    focusFrameMask.selectAll(".point.focus")
        .data((dataset))
        .enter()
        .append("circle")
        .attr("class", "point focus")
        .attr("transform", (d) -> "translate(#{focusXScale(d.date)}, #{focusYScale(d.tweets)})")
        .attr("r", 3)

    contextFrame.selectAll(".point.context")
        .data((dataset))
        .enter()
        .append("circle")
        .attr("class", "point context")
        .attr("transform", (d) -> "translate(#{contextXScale(d.date)}, #{contextYScale(d.tweets)})")
        .attr("r", 3)

d3.csv("tweetCounts.csv", (data) ->
    dataset = []
    parseDate = d3.time.format("%B%Y").parse
    
    for row in data
        dataset.push({date: parseDate(row.date), tweets: +row.tweets})

    generateGraph(dataset)
)
