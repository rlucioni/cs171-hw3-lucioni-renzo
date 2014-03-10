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

# Used for adding space between labels and axes
labelPadding = 7

# Configure detail graph bounding box, scales, axes, and path generators
bbDetail =
    x: 50,
    y: 10,
    width: canvasWidth - 50,
    height: 350

detailXScale = d3.time.scale().range([0, bbDetail.width])
detailYScale = d3.scale.linear().range([bbDetail.height, 0])

detailXAxis = d3.svg.axis().scale(detailXScale).orient("bottom")
detailYAxis = d3.svg.axis().scale(detailYScale).orient("left")

detailLine = d3.svg.line()
    .interpolate("linear")
    .x((d) -> detailXScale(d.date))
    .y((d) -> detailYScale(d.tweets))

detailArea = d3.svg.area()
    .x((d) -> detailXScale(d.date))
    .y0(bbDetail.height)
    .y1((d) -> detailYScale(d.tweets))

# Configure overview graph bounding box, scales, axes, and path generators
bbOverview =
    x: 50,
    y: 400,
    width: canvasWidth - 50,
    height: 75

overviewXScale = d3.time.scale().range([0, bbOverview.width])
overviewYScale = d3.scale.linear().range([bbOverview.height, 0])

overviewXAxis = d3.svg.axis().scale(overviewXScale)
    .innerTickSize([0])
    .tickPadding([10])
    .orient("bottom")
overviewYAxis = d3.svg.axis().scale(overviewYScale)
    .ticks([3])
    .innerTickSize([0])
    .tickPadding([10])
    .orient("left")

overviewLine = d3.svg.line()
    .interpolate("linear")
    .x((d) -> overviewXScale(d.date))
    .y((d) -> overviewYScale(d.tweets))

generateGraph = (dataset) ->
    allDates = []
    allTweets = []
    for point in dataset
        allDates.push(point.date)
        allTweets.push(point.tweets)

    # Configure scale domains
    detailXScale.domain(d3.extent(allDates))
    detailYScale.domain([0, d3.max(allTweets)])

    overviewXScale.domain(d3.extent(allDates))
    overviewYScale.domain([0, d3.max(allTweets)])

    # Draw axes and labels
    detailFrame = svg.append("g")
        .attr("transform", "translate(#{bbDetail.x}, #{bbDetail.y})") 
    detailFrame.append("g").attr("class", "x axis detail")
        .attr("transform", "translate(0, #{bbDetail.height})")
        .call(detailXAxis)
    detailFrame.append("g").attr("class", "y axis detail")
        .call(detailYAxis)
    detailFrame.append("text")
        .attr("class", "x label detail")
        .attr("text-anchor", "end")
        .attr("x", bbDetail.width)
        .attr("y", bbDetail.height - labelPadding)
        .text("Date")
    detailFrame.append("text")
        .attr("class", "y label detail")
        .attr("text-anchor", "end")
        .attr("y", labelPadding)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Tweets")

    overviewFrame = svg.append("g")
        .attr("transform", "translate(#{bbOverview.x}, #{bbOverview.y})")
    overviewFrame.append("g").attr("class", "x axis overview")
        .attr("transform", "translate(0, #{bbOverview.height})")
        .call(overviewXAxis)
    overviewFrame.append("g").attr("class", "y axis overview")
        .call(overviewYAxis)
    overviewFrame.append("text")
        .attr("class", "x label overview")
        .attr("text-anchor", "end")
        .attr("x", bbOverview.width)
        .attr("y", bbOverview.height - labelPadding)
        .text("Date")
    overviewFrame.append("text")
        .attr("class", "y label overview")
        .attr("text-anchor", "end")
        .attr("y", labelPadding)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Tweets")

    # Draw data
    detailFrame.append("path")
        .datum(dataset)
        .attr("class", "area detail")
        .attr("d", detailArea)

    detailFrame.append("path")
        .datum(dataset)
        .attr("class", "line detail")
        .attr("d", detailLine)

    overviewFrame.append("path")
        .datum(dataset)
        .attr("class", "line overview")
        .attr("d", overviewLine)

    detailFrame.selectAll(".point.detail")
        .data((dataset))
        .enter()
        .append("circle")
        .attr("class", "point detail")
        .attr("transform", (d) -> "translate(#{detailXScale(d.date)}, #{detailYScale(d.tweets)})")
        .attr("r", 3)

    overviewFrame.selectAll(".point.overview")
        .data((dataset))
        .enter()
        .append("circle")
        .attr("class", "point overview")
        .attr("transform", (d) -> "translate(#{overviewXScale(d.date)}, #{overviewYScale(d.tweets)})")
        .attr("r", 3)

d3.csv("unHealth.csv", (data) ->
    dataset = []
    timeFormat = d3.time.format("%B%Y")
    
    for row in data
        dataset.push({date: timeFormat.parse(row.date), tweets: +row.tweets})

    generateGraph(dataset)
)
