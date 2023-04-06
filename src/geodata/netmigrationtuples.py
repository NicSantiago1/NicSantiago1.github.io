import pandas as pd
import json

with open('countries.geojson') as f:
    geojson_data = json.load(f)

data = pd.read_excel('NetMigrationData.xls', skiprows=3)

years_data = {
    str(year): {code: net for code, net in zip(data['Country Code'], data[str(year)]) if not pd.isna(net)}
    for year in range(2000, 2022) if str(year) in data
}

for feature in geojson_data['features']:
    country_code = feature['properties']['ISO_A3']
    for year, net in years_data.items():
        feature['properties'][year] = net.get(country_code)

# Write updated GeoJSON to file
with open('countries_with_migration.geojson', 'w') as f:
    json.dump(geojson_data, f)