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
colorbrewerGreen = "#4daf4a"
tooltipOffset = 5

# Utility function for adding commas as thousands separators
addCommas = (number) ->
    number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

xScale = d3.scale.linear().range([0, boundingBox.width])
yScale = d3.scale.log().range([boundingBox.height, 0])

xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")

yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")

line = d3.svg.line()
    .interpolate("linear")
    .x((d) -> xScale(d.year))
    .y((d) -> yScale(d.consensusValue))

upperErrorBand = d3.svg.area()
    .x((d) -> xScale(d.year))
    .y0((d) -> yScale(d.consensusValue))
    .y1((d) -> yScale(d.maxEstimate))

lowerErrorBand = d3.svg.area()
    .x((d) -> xScale(d.year))
    .y0((d) -> yScale(d.minEstimate))
    .y1((d) -> yScale(d.consensusValue))

generateLineGraph = (dataset) ->
    xScale.domain(d3.extent(dataset.allYears))
    yScale.domain(d3.extent(dataset.allEstimates))

    zoomed = () ->
        svg.select(".x.axis").call(xAxis)
        svg.select(".y.axis").call(yAxis)
        
        # Allow for sematic zooming
        svg.select(".error-band.upper").attr("d", upperErrorBand)
        svg.select(".error-band.lower").attr("d", lowerErrorBand)
        svg.select(".line").attr("d", line)
        svg.selectAll(".point")
            .attr("transform", (d) -> "translate(#{xScale(d.year)}, #{yScale(d.consensusValue)})")

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
        # dat Unicode subscript
        .text("log₁₀(Population)")

    # Calculate consensus values, absolute and relative divergences for each year
    combinedData = []
    for year in dataset.allYears
        relevantEstimates = []
        # Grab estimates for this year from each org, if available
        for org in orgs
            for point in dataset[org]
                if point.year == year
                    relevantEstimates.push(point.estimate)
                    break

        consensusValue = d3.mean(relevantEstimates)
        # CoffeeScript parallel assignment
        [minEstimate, maxEstimate] = d3.extent(relevantEstimates)

        absoluteUpperDivergence = maxEstimate - consensusValue
        absoluteLowerDivergence = consensusValue - minEstimate
        relativeUpperDivergence = (maxEstimate/consensusValue)*100 - 100
        relativeLowerDivergence = 100 - (minEstimate/consensusValue)*100

        combinedData.push(
            year: year, 
            consensusValue: consensusValue, 
            maxEstimate: maxEstimate, 
            minEstimate: minEstimate,
            absoluteUpperDivergence: absoluteUpperDivergence,
            absoluteLowerDivergence: absoluteLowerDivergence,
            relativeUpperDivergence: relativeUpperDivergence,
            relativeLowerDivergence: relativeLowerDivergence
        )

    chartArea = frame.append("g").attr("clip-path", "url(#clip)")

    chartArea.append("rect")
        .attr("class", "overlay")
        .attr("width", boundingBox.width)
        .attr("height", boundingBox.height)

    chartArea.append("path")
        .datum(combinedData)
        .attr("class", "error-band upper")
        .attr("d", upperErrorBand)

    chartArea.append("path")
        .datum(combinedData)
        .attr("class", "error-band lower")
        .attr("d", lowerErrorBand)

    chartArea.append("path")
        .datum(combinedData)
        .attr("class", "line")
        .attr("d", line)

    points = chartArea.selectAll(".point")
        .data((combinedData))
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("transform", (d) -> "translate(#{xScale(d.year)}, #{yScale(d.consensusValue)})")
        .attr("r", 4)

    points.on("mouseover", (d) ->
        d3.select(this).style("fill", colorbrewerGreen)

        d3.select("#tooltip")
            .style("left", "#{d3.event.pageX + tooltipOffset}px")
            .style("top", "#{d3.event.pageY + tooltipOffset}px")
        # Rounding to nearest integer (decimals don't make sense in terms of people)
        d3.select("#consensus-value").text("#{addCommas(Math.round(d.consensusValue))} individuals")
        d3.select("#upper-divergence")
            .text("#{addCommas(Math.round(d.absoluteUpperDivergence))} individuals (#{d.relativeUpperDivergence.toFixed(2)}%)")
        d3.select("#lower-divergence")
            .text("#{addCommas(Math.round(d.absoluteLowerDivergence))} individuals (#{d.relativeLowerDivergence.toFixed(2)}%)")
        d3.select("#tooltip").classed("hidden", false)
    )

    points.on("mouseout", () ->
        d3.select(this).transition().duration(500).style("fill", "white")
        d3.select("#tooltip").classed("hidden", true)
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
            interpolatedData.push({year: year, estimate: estimate})

        dataset[org] = interpolatedData

    generateLineGraph(dataset)
)
