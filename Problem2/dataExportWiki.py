import requests
from bs4 import BeautifulSoup

html = requests.get("http://en.wikipedia.org/wiki/World_population_estimates").text
soup = BeautifulSoup(html)

# Yields the second row of the table on the page
second_row = soup.find_all('tr')[1]

# Yields all table rows that are not the header row
all_data_rows = soup.find_all('tr')[1:]
