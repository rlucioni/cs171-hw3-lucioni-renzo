import requests
import csv
from bs4 import BeautifulSoup

CSVFILE = open('dataExportWiki.csv', 'wb')
HEADERS = ['year', 'us_census', 'pop_reference', 'un_desa', 'hyde', 'maddison']
HYPHEN = u'\u2212'

# Create CSV writer object
csv_writer = csv.writer(CSVFILE)
csv_writer.writerow(HEADERS)

html = requests.get('http://en.wikipedia.org/wiki/World_population_estimates').text
soup = BeautifulSoup(html)

rows = soup.find_all('tr')

# Yields all table rows that are not header row
rows = rows[1:]

for row in rows:
    # Convert data to strings, throw out newlines
    raw_strings = [child.string for child in row.children if child.string != '\n']

    # Throw out commas
    commaless_strings = [d.replace(',', '') if d != None else d for d in raw_strings]

    data = []
    for string in commaless_strings:
        if string == None:
            data.append(string)
        else:
            if string[0] == HYPHEN:
                # Convert unicode hyphen character to a negative sign
                data.append('-' + string[1:])
            else:
                data.append(string)

    # Convert to int, only first 6 elements (corresponding to Year through Maddison)
    data = [int(d) if d != None else d for d in data[:6]]
    # Convert None to the empty string
    data = ['' if d == None else d for d in data]

    # Only consider rows with year >= 0
    if data[0] >= 0:
        # Only write non-empty rows
        if map(lambda i: i == '', data[1:]) != [True]*5:
            csv_writer.writerow(data)
    