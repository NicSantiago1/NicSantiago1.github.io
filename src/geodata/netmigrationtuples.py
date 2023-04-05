import pandas as pd
import json

data = pd.read_excel('NetMigrationData.xls', skiprows=3)

years_data = {
    str(year): [(country, net) for country, net in zip(data['Country Name'], data[str(year)]) if not pd.isna(net)]
    for year in range(2000, 2022) if str(year) in data
}

with open('net_migration.json', 'w') as f:
    json.dump(years_data, f)