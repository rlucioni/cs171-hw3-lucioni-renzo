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
orgs = ["us_census", "pop_reference", "un_desa", "hyde", "maddison"]
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
    .domain(orgs)
    .range(colorbrewer.Set1[5])

generateLineGraph = (dataset) ->
    xScale.domain(d3.extent(dataset.allYears))
    yScale.domain(d3.extent(dataset.allEstimates))

    zoomed = () ->
        svg.select(".x.axis").call(xAxis)
        svg.select(".y.axis").call(yAxis)
        
        # Allow for sematic zooming
        svg.selectAll(".line")
            .attr("d", line)
        svg.selectAll(".point")
            .attr("transform", (d) -> "translate(#{xScale(d.year)}, #{yScale(d.estimate)})")

    zoom = d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .on("zoom", zoomed)

    frame = svg.append("g")
        .attr("transform", "translate(#{boundingBox.x}, 0)")
        .call(zoom)

    frame.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", boundingBox.width)
        .attr("height", boundingBox.height);

    chartArea = frame.append("g").attr("clip-path", "url(#clip)")

    chartArea.append("rect")
        .attr("class", "overlay")
        .attr("width", boundingBox.width)
        .attr("height", boundingBox.height)

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

    for org in orgs
        chartArea.append("path")
            .datum(dataset[org])
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", color(org))
        chartArea.selectAll(".point.#{org}")
            .data((dataset[org]))
            .enter()
            .append("circle")
            .attr("class", (d) ->
                if d.interpolated
                    "point #{org} interpolated"
                else
                    return "point #{org}"
            )
            .attr("transform", (d) -> "translate(#{xScale(d.year)}, #{yScale(d.estimate)})")
            .attr("r", 3)
            # Interpolated data points are outlined in black
            .style("stroke", (d) ->
                if d.interpolated
                    return "black"
                else
                    return color(org)
            )

d3.csv("dataExportWiki.csv", (data) ->
    dataset = {}
    for org in orgs
        dataset[org] = []

    # Fill dataset with data from CSV, ignoring blank estimates
    for row in data
        year = row.year
        for org in orgs
            estimate = row[org]
            if estimate != ""
                dataset[org].push({year: +year, estimate: +estimate})

    # Compile lists of all years and all estimates
    allYears = []
    allEstimates = []
    for org, data of dataset
        for point in data
            year = point.year
            if year not in allYears
                allYears.push(year)

            estimate = point.estimate
            if estimate not in allEstimates
                allEstimates.push(estimate)

    # Sort list of all years so that we can pull ordered slices from it
    dataset.allYears = allYears.sort()
    dataset.allEstimates = allEstimates
    
    # Use interpolation to fill in missing values for each organization's estimates 
    for org in orgs
        # Compile lists of years and estimates from this organization
        years = []
        estimates = []
        for point in dataset[org]
            years.push(point.year)
            estimates.push(point.estimate)

        interpolator = d3.scale.linear()
            .domain(years)
            .range(estimates)

        interpolatedData = []
        # Only consider years between the years for which this organization has made estimates
        relevantYears = allYears[allYears.indexOf(years[0])..allYears.indexOf(years[years.length - 1])]
        for year in relevantYears
            estimate = interpolator(year)
            
            # Boolean to determine if estimate is interpolated - used for coloring
            interpolated = true
            if year in years
                # Means that estimate was part of original dataset
                interpolated = false
            
            interpolatedData.push({year: year, estimate: estimate, interpolated: interpolated})

        dataset[org] = interpolatedData

    generateLineGraph(dataset)
)