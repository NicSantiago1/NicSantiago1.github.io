import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import countries from './geodata/countries.geojson';
import NavBar from './NavBar';
import Legend from './Legend';
import CountryModal from './CountryModal';
import './Map.css';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

mapboxgl.accessToken = 'pk.eyJ1IjoibnNhbnRpYWdvMTgiLCJhIjoiY2xjcjN5cDRnMGJwbjNwbjJodjZzM2htZiJ9.j9PqvIjlbwoNyZsEqmFrqg';

const Map = () => {
  const options = [
    {
      name: 'Net Migration',
      description: 'Citizens who left the country this year',
      property: 'migrants_est',
      stops: [
        [0, '#008000'],
        [1, '#66FF66'],
        [2, '#E6FFE6'],
        [3, '#FF3333'],
        [4, '#CC0000'],
      ]
    }

  ]

    const mapContainer = useRef(null);
    const [active, setActive] = useState(options[0]);
    const [map, setMap] = useState(null);
    const [country, setCountry] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [lng, setLng] = useState(16);
    const [lat, setLat] = useState(48);

    // Initialize the map
    useEffect(() => {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/nsantiago18/clex8n530000g01mszz6zanjx',
          center: [lng, lat],
          zoom: 3,
        });

        let hoveredStateId = null;

        map.on('load', () => {  

          // Add the geojson as a source
          map.addSource('countries', {
              'type': 'geojson',
              'data': countries,
              'generateId': true
          });

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

          // Add in a color fill layer from the geojson source
          map.addLayer(
            {
              id: 'countries-fill',
              type: 'fill',
              source: 'countries',
              layout: {},
              paint: {
                'fill-color': '#0055FF',
                'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  1,
                  0.5
                ]
              }
            },
            'country-label'
          );

          // Hover effect to change opacity of country fill
          map.on('mousemove', 'countries-fill', (e) => {
            if (e.features.length > 0) {
              if (hoveredStateId !== null) {
                map.setFeatureState(
                  { 
                    source: 'countries',
                    id: hoveredStateId 
                  },
                  { 
                    hover: false 
                  }
                );
              }
              hoveredStateId = e.features[0].id;
              map.setFeatureState(
                { 
                  source: 'countries', 
                  id: hoveredStateId 
                },
                { 
                  hover: true 
                }
              );
            }
          });

          map.on('mouseleave', 'countries-fill', () => {
            if (hoveredStateId !== null) {
              map.setFeatureState(
                { 
                  source: 'countries', 
                  id: hoveredStateId 
                },
                { 
                  hover: false 
                }
              );
            }
            hoveredStateId = null;
          });


          // Country popup on click
          map.on('click', 'countries-fill', (e) => {
            setOpen(true);
            console.log(e.features[0].properties.ADMIN);
          });

          

          setMap(map);
        });


        return () => map.remove();
    }, []);

    const flyTo = (...props) => {
      map.flyTo({
        center: [props[0], props[1]],
        essential: true
        });
    }

    return (
        <div>
          <div ref={mapContainer} className="map-container" />
          <NavBar flyTo={flyTo} />
          <Legend active={active} />
          <div>
            <CountryModal open={false} />
          </div>
        </div>
    );
}

export default Map;