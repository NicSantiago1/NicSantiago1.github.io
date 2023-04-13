import pandas as pd
import json

with open('countries.geojson') as f:
    geojson_data = json.load(f)

flag_data = pd.read_csv('flags.csv', delimiter=';', index_col='name')

flag_dict = flag_data['image'].to_dict()

for feature in geojson_data['features']:
    country_name = feature['properties']['ADMIN']
    feature['properties']['flag_url'] = flag_dict.get(country_name, '')


data = pd.read_excel('NetMigrationData.xls', skiprows=3)

years_data = {
    str(year): {code: net for code, net in zip(data['Country Code'], data[str(year)]) if not pd.isna(net)}
    for year in range(2000, 2022) if str(year) in data
}

for feature in geojson_data['features']:
    country_code = feature['properties']['ISO_A3']

    for year, net in years_data.items():
        feature['properties'][year] = net.get(country_code)

with open('countries_with_migration_and_flags.geojson', 'w') as f:
    json.dump(geojson_data, f)