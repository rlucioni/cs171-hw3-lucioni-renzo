**NOTE: I've chosen to use Beautiful Soup, the Python screen-scraping library.**

1. The data contained in the Wikipedia table consists of a collection of integers corresponding to human population estimates, distributed over a collection of dates, specifically years; JavaScript makes dates available as a real-world utility type. This data is explicitly temporal, and thereby differs from the information we've used in the past. In Homework 1, we worked with unemployment data consisting of a collection of floats correspoding to unemployment rates, mapped to a collection of strings corresponding to state names. We didn't concern ourselves with any temporal features. In Homework 2, we worked with a collection of composite types, specifically objects containing data relating to Git commits. These objects did contain dates, but the stress was on the history of relationships between commits.

2. As noted above, I've chosen to use Beautiful Soup for the scraping portion of this assignment. I would use Beautiful Soup as follows to get the second row of the Wikipedia table:

```python
import requests
from bs4 import BeautifulSoup

html = requests.get("http://en.wikipedia.org/wiki/World_population_estimates").text
soup = BeautifulSoup(html)

# Yields the second row of the table on the page
second_row = soup.find_all('tr')[1]
```

I would use Beautiful Soup as follows to get all table rows which are not the header row:

```python
# Yields all table rows that are not the header row
all_data_rows = soup.find_all('tr')[1:]
```
