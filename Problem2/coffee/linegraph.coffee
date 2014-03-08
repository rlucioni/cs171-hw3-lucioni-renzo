# Mike Bostock's margin convention
margin = 
    top:    50, 
    bottom: 50, 
    left:   50, 
    right:  50

canvasWidth = 960 - margin.left - margin.right
canvasHeight = 300 - margin.top - margin.bottom

svg = d3.select("#vis").append("svg")
    .attr("width", canvasWidth + margin.left + margin.right)
    .attr("height", canvasHeight + margin.top + margin.top)
    .append("g")
    .attr("transform", "translate(#{margin.left}, #{margin.top})")

boundingBox =
    x: 100,
    y: 10,
    width: canvasWidth - 100,
    height: 100

dataset = []

createVis = () ->
    xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, boundingBox.width])

    # translate to bottom left of vis space
    visFrame = svg.append("g")
        .attr("transform", "translate(#{boundingBox.x}, #{boundingBox.y + boundingBox.height})")

    visFrame.append("rect")

    # yScale - define right y domain and range using boundingBox

    # xAxis...
    # yAxis...

    # add axes to svg

d3.csv("dataExportWiki.csv", (data) ->
    # process data and add to dataset
    createVis()
)
