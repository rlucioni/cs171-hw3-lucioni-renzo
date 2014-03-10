### Design Decisions ###

I chose to implement a version of my first design studio sketch, a line graph with error bands. I decided to use the mean of the divergent estimates at each year as my consensus value; I decided to include interpolated values in my calculation of the mean. I plotted my consensus values for each year, and then filled area above and below the consensus line to illustrate the divergence between the estimates at that point in time, in absolute terms.

Instead of including an option to toggle the y-axis between a log scale and a linear scale, I opted to lock the y-axis to a log scale and make the graph area zoomable (semantic zoom) and pan-able. This allows a user to gain an on-demand fine-grained view of the divergence at any point along the consensus line.

I also opted to use a tooltip instead of the slider shown in my sketch. I felt that the slider overlay was messy and imprecise, and decided to use tooltips because I think they are cleaner and more targeted. The tooltip is displayed when hovering over a data point, and lists the consensus value corresponding to the hovered data point, counts indicating the amount of divergence above and below the data point in absolute terms, and percentages indicating the amount of divergence above and below the data point in relative terms.
