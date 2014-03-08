# Mike Bostock's margin convention
margin = 
    top:    20, 
    bottom: 20, 
    left:   20, 
    right:  20

canvasWidth = 1000 - margin.left - margin.right
canvasHeight = 500 - margin.top - margin.bottom

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

    xScale = d3.scale.linear()
        .domain(d3.extent(all_years))
        .range([0, boundingBox.width])

    yScale = d3.scale.linear()
        .domain(d3.extent(all_estimates))
        .range([boundingBox.height, 0])

    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")

    line = d3.svg.line()
        .x((d) -> xScale(d.year))
        .y((d) -> yScale(d.estimate))

    frame = svg.append("g")
        .attr("transform", "translate(#{boundingBox.x}, 0)")

    frame.append("g").attr("class", "x-axis")
        .attr("transform", "translate(0, #{boundingBox.height})")
        .call(xAxis)

    frame.append("g").attr("class", "y-axis")
        .call(yAxis)

    frame.append("path")
        .datum(dataset.pop_reference)
        .attr("class", "line")
        .attr("d", line)

d3.csv("dataExportWiki.csv", (data) ->
    dataset =
        us_census: [],
        pop_reference: [],
        un_desa: [],
        hyde: [],
        maddison: []

    headers = ["us_census", "pop_reference", "un_desa", "hyde", "maddison"]

    for row in data
        year = row.year
        for header in headers
            estimate = row[header]
            if estimate != ""
                dataset[header].push({year: +year, estimate: +estimate})

    generateLineGraph(dataset)
)
