import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import countries from './geodata/countries.geojson';
import NavBar from './NavBar';
import YearSlider from './YearSlider';
import Modal from '@mui/material/Modal';
import ReactDOM from 'react-dom';

import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibnNhbnRpYWdvMTgiLCJhIjoiY2xjcjN5cDRnMGJwbjNwbjJodjZzM2htZiJ9.j9PqvIjlbwoNyZsEqmFrqg';

const Map = () => {
    const mapContainer = useRef(null);
    const [active, setActive] = useState(null);
    const [map, setMap] = useState(null);
    const [open, setOpen] = React.useState(false);

    const options = [
      {
        name: 'Colors',
        description: '',
        property: 'color_est',
        stops: [
          [0, '#008000'],
          [1, '#66FF66'],
          [2, '#E6FFE6'],
          [3, '#FF3333'],
          [4, '#CC0000'],
        ]
      }

    ]

    // Initialize the map
    useEffect(() => {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/nsantiago18/clex8n530000g01mszz6zanjx',
          center: [16, 48],
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
          const handleOpen = () => setOpen(true);
          const handleClose = () => setOpen(false);
          map.on('click', 'countries-fill', (e) => {
            new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(e.features[0].properties.ADMIN).addTo(map);
          })

          setMap(map);
        });


        return () => map.remove();
    }, []);


    // const paint = () => {
    //   if (map) {
    //     map.setPaintProperty('countries-fill', 'fill-color', {
    //       property: Math.floor(Math.random() * 5),
    //       stops: options[0].stops
    //     });
    //   }
    // }

    return (
        <div>
          <div ref={mapContainer} className="map-container" />
          <NavBar />
          <YearSlider />
        </div>
    );
}

export default Map;