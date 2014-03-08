# Mike Bostock's margin convention
margin = 
    top:    20, 
    bottom: 20, 
    left:   20, 
    right:  20

canvasWidth = 1100 - margin.left - margin.right
canvasHeight = 600 - margin.top - margin.bottom

svg = d3.select("#vis").append("svg")
    .attr("width", canvasWidth + margin.left + margin.right)
    .attr("height", canvasHeight + margin.top + margin.top)
    .append("g")
    .attr("transform", "translate(#{margin.left}, #{margin.top})")

boundingBox =
    x: 100,
    y: 50,
    width: canvasWidth - 100,
    height: canvasHeight - 50

# Relevant CSV column headers
headers = ["us_census", "pop_reference", "un_desa", "hyde", "maddison"]
# For adding space between labels and axes
labelPadding = 7

xScale = d3.scale.linear().range([0, boundingBox.width])
yScale = d3.scale.linear().range([boundingBox.height, 0])

xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")

yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")

line = d3.svg.line()
    .interpolate("linear")
    .x((d) -> xScale(d.year))
    .y((d) -> yScale(d.estimate))

color = d3.scale.ordinal()
    .domain(headers)
    .range(colorbrewer.Set1[5])

generateLineGraph = (dataset) ->
    all_years = []
    all_estimates = []

    for org, data of dataset
        for point in data
            year = point.year
            if year not in all_years
                all_years.push(year)

            estimate = point.estimate
            if estimate not in all_estimates
                all_estimates.push(estimate)

    xScale.domain(d3.extent(all_years))
    yScale.domain(d3.extent(all_estimates))

    frame = svg.append("g")
        .attr("transform", "translate(#{boundingBox.x}, 0)")

    frame.append("g").attr("class", "x axis")
        .attr("transform", "translate(0, #{boundingBox.height})")
        .call(xAxis)

    frame.append("g").attr("class", "y axis")
        .call(yAxis)

    frame.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", boundingBox.width)
        .attr("y", boundingBox.height - labelPadding)
        .text("Year")

    frame.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", labelPadding)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Population")

    for header in headers
        frame.append("path")
            .datum(dataset[header])
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", color(header))
        frame.selectAll(".point.#{header}")
            .data((dataset[header]))
            .enter()
            .append("circle")
            .attr("class", "point #{header}")
            .attr("cx", (d) -> xScale(d.year))
            .attr("cy", (d) -> yScale(d.estimate))
            .attr("r", 3)
            .style("fill", color(header))

d3.csv("dataExportWiki.csv", (data) ->
    dataset =
        us_census: [],
        pop_reference: [],
        un_desa: [],
        hyde: [],
        maddison: []

    for row in data
        year = row.year
        for header in headers
            estimate = row[header]
            if estimate != ""
                dataset[header].push({year: +year, estimate: +estimate})

    generateLineGraph(dataset)
)
