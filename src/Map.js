import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import countries from './geodata/countries.geojson';
import NavBar from './NavBar';

import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibnNhbnRpYWdvMTgiLCJhIjoiY2xjcjQybXE1MGJ5ZDN2bWZtbXlzemRwYyJ9.MVzA2sRffOdZfca9fTiNtQ';

const Map = () => {
    const mapContainer = useRef(null);
    const [active, setActive] = useState(null);
    const [map, setMap] = useState(null);

    // Initialize the map
    useEffect(() => {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v11',
          center: [16, 48],
          zoom: 3
        });

        map.on('load', () => {

          // Get the index of the first symbol layer in the map style
          const layers = map.getStyle().layers;
          let firstSymbolId;
          for (const layer of layers) {
            if (layer.type === 'symbol') {
              firstSymbolId = layer.id;
              break;
            }
          }          

          // Add the geojson as a source
          map.addSource('countries', {
              'type': 'geojson',
              'data': countries
          });

          // Add labels from the geojson source
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

          // Add in a color fill layer from the geojson source
          map.addLayer(
            {
              id: 'countries-fill',
              type: 'fill',
              source: 'countries',
            },
            'country-label'
          );

          // Add in an outline layer from the geojson source
          map.addLayer(
            {
              id: 'countries-outline',
              type: 'line',
              source: 'countries',
              layout: {},
              paint: {
                'line-color': '#000',
                'line-width': 1
                }
            },
            'country-label'
          );
  
          map.setPaintProperty('countries-fill', 'fill-color', '#A4218E');
  
          setMap(map);
        });

        return () => map.remove();
    }, []);

    useEffect(() => {
      paint();
    }, [active]);

    const paint = () => {
      if (map) {
        map.setPaintProperty('countries-fill', 'fill-color', '#000080');
      }
    };

    return (
        <div>
          <div ref={mapContainer} className="map-container" />
          <NavBar />
          <button className='map-overlay' onClick={() => setActive('yes')}> Map </button>
        </div>
    );
}

export default Map;