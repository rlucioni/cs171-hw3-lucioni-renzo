### Recovery ###


#### Background and Motivation ####

The US housing market has been an area of intense interest in recent years. Real estate plays an integral role in the US economy, representing a significant source of income for some and a significant investment for others. Residential real estate provides housing for individuals and their families, and often represents a family’s most significant investment. Commercial real estate provides space for offices, factories, and apartment buildings. 

In the last several years, the conversation on the US housing market has focused on its recovery from the 2008 crisis. Nationwide housing trends are widely discussed in the news, and reports detailing local trends in locations such as Manhattan, San Francisco, Las Vegas, and more recently [Williston, North Dakota](http://time.com/8731/highest-rent-in-us-williston-north-dakota/), are common. However, these discussions often rely on a couple of raw statistics and rudimentary visualizations, and as such struggle to communicate effectively with readers. We want to help fill this gap by producing a collection of clean, useful, and insightful visualizations which can be used as interactive tools for exploring the past, present, and future of the US housing market.


#### Project Objectives ####

Our primary objective is to build a visualization exploring the recovery of the US housing market from the 2008 crisis. In the process, we hope to understand how recovery has manifested itself on national, state, and local levels. Our visualization will allow users to explore trends in metrics such as foreclosure rates, median value per square foot, and median list and sale price per square foot, both nationally and for specific regions such as counties and ZIP code regions, at specific time frames.

As mentioned above, news outlets often attempt to summarize changes in the US housing market by using a small number of statistics which fail to fully capture the recovery process and its regional variations. Our project will provide value here by providing context to the recovery story and allowing users to focus on several metrics pertaining to the health of the housing market at various granularities.


#### Data ####

We are collecting our data by downloading pre-processed CSV files from [Zillow Real Estate Research](http://www.zillow.com/research/data/).


#### Data Processing ####

We do not expect to perform substantial data cleanup or data processing. Zillow’s CSV files are nicely cleaned and ready for use. We plan to use Zillow’s data on metrics such as median home value per square foot, homes foreclosed, and median list and sale price per square foot. Zillow provides this information at state, county, and ZIP code granularities.


#### Visualization ####

The heart of our visualization will consist of a choropleth map of the United States colored by a selected focus metric either by county, of which there are over 3,000, or by the more granular ZIP code region, of which there are over 40,000. We would like to color by ZIP code region, but are concerned that performance and lag will become an issue. The user will have the option to color the map by any of our designated focus metrics using a series of buttons appearing above the map.

The choropleth map will be accompanied by a timescale slider allowing the user to recolor the map by time, as well as an area graph appearing below the map which provides the viewer with context of the selected focus metric at the national level for the entire available time period. A large, vertically-oriented parallel coordinates plot will appear to the right of the choropleth map and the area graph, allowing users to filter counties or ZIP code regions by each of the focus metrics.

The three pieces of our visualization will be tied together. Clicking a state will cause the map to zoom in on it. On zoom, a new area/line will be added to the context area graph, showing changes in the focus metric for the zoomed state, allowing for comparison to the national trend. Selecting lines on the parallel coordinates plot will cause the corresponding counties or ZIP code regions to be emphasized on the choropleth map. Hovering over a line representing a county or ZIP code region on the parallel coordinates plot will cause the line to thicken and be emphasized (e.g., by fading other lines on the plot), cause a tooltip with information about that entity to be displayed, and cause the corresponding county or ZIP code region to be emphasized on the choropleth map.

Sketches of our proposed designs have been embedded below, but can also be found in [this album](http://imgur.com/a/rJTNb).

<div align="center">
    <img src="http://i.imgur.com/rtUaG9x.jpg"></a>
    <img src="http://i.imgur.com/cqxNm6I.jpg"></a>
    <img src="http://i.imgur.com/bEv9aYY.jpg"></a>
</div>


#### Must-Have Features ####

- choropleth map of the US
    - colored using ColorBrewer sequential colors by county or ZIP code, by one of our three focus metrics
- smaller context area graph 
    - displays a summary representation of the focus metric at the national level
- timescale slider allowing users to update the map
    - tracking line will be overlayed on the smaller context area graph
- clicking a state causes map to zoom in on it
- on zoom, a new area/line is added to the context line graph
    - shows changes in the focus metric for the zoomed state 
    - national line is preserved
- vertical parallel coordinates plot displaying each county or ZIP code region colored in the choropleth map
    - located beside the choropleth map and area graph
    - lines selected have their corresponding counties or ZIP code regions emphasized on the map
    - hovering over a line causes the line to be thickened and emphasized, tooltip to be displayed, and corresponding entity to be emphasized on the map


#### Optional Features ####

- increasing complexity on zoom 
    - color choropleth map by county, but increase complexity to ZIP code region on zoom
- leverage relevant contextual information
    - incorporate data about where families with children live, median household incomes, locations of schools, and major highways
- use more information from Zillow (rent, home size, etc)


#### Project Schedule ####

**3/13**: **PROPOSAL DUE**

**3/20**: download and organize all data; set up HTML, lay out code stubs, README and process book; begin working on choropleth map

**3/27**: complete basic choropleth map implementation, including click-to-zoom; begin implementing area graph

**4/3**: complete area graph; begin parallel coordinates plot

**4/10**: complete parallel coordinates plot; **FUNCTIONAL PROJECT PROTOTYPE DUE**

**4/17**: clean up prototype implementation; consider implementing optional features

**4/24**: plan and record screencast; create website

**5/1**: **PROJECT DUE**
