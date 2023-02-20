import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import countries from './geodata/countries.geojson';
import NavBar from './NavBar';

import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibnNhbnRpYWdvMTgiLCJhIjoiY2xjcjQybXE1MGJ5ZDN2bWZtbXlzemRwYyJ9.MVzA2sRffOdZfca9fTiNtQ';

const Map = () => {
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);

    // Initialize the map
    useEffect(() => {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/navigation-night-v1?optimize=true',
          center: [16, 48],
          zoom: 3
        });

        map.on('load', () => {
            map.addSource('countries', {
                'type': 'geojson',
                countries
            });

            map.setLayoutProperty('country-label', 'text-field', [
                'format',
                ['get', 'name_en'],
                { 'font-scale': 1.2 },
                '\n',
                {},
                ['get', 'name'],
                {
                  'font-scale': 0.8,
                  'text-font': [
                    'literal',
                    ['DIN Offc Pro Italic', 'Arial Unicode MS Regular']
                  ]
                }
              ]);
    
              map.addLayer({
                  id: 'countries',
                  type: 'fill',
                  source: 'countries',
                  'source-layer': 'countries'
                },
                'country-label'
              );
            
              map.setPaintProperty('countries', 'fill-color', '#0000FF');
    
              setMap(map);
        });

        return () => map.remove();
    }, []);

    return (
        <div>
          <div ref={mapContainer} className="map-container" />
          <NavBar />
        </div>
    );
}

export default Map;