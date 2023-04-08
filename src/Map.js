import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import countries from './geodata/countries_with_migration.geojson';
import migrationData from './geodata/net_migration.json'
import NavBar from './NavBar';
import Legend from './Legend';
import CountryModal from './CountryModal';
import './Map.css';


mapboxgl.accessToken = 'pk.eyJ1IjoibnNhbnRpYWdvMTgiLCJhIjoiY2xjcjN5cDRnMGJwbjNwbjJodjZzM2htZiJ9.j9PqvIjlbwoNyZsEqmFrqg';

const Map = () => {
  const options = [
    {
      name: 'Net Migration',
      description: 'Citizens who left the country this year',
      property: '2021',
      stops: [
        [-250000, '#CC0000'],
        [-100000, '#FF3333'],
        [0, '#80FF66'],
        [100000, '#22CC00'],
        [250000, '#0D4D00'],
      ]
    }

  ]

    const mapContainer = useRef(null);
    const [active, setActive] = useState(options[0]);
    const [map, setMap] = useState(null);
    const [year, setYear] = useState(2021);
    const [country, setCountry] = useState({});
    const [open, setOpen] = React.useState(false);
    const [lng, setLng] = useState(16);
    const [lat, setLat] = useState(48);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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

          map.setPaintProperty('countries-fill', 'fill-color', {
            property: active.property,
            stops: active.stops
          })

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
            handleOpen();
            setCountry(
              country => ({
                ...country,
                ...e.features[0].properties
              })
            );
          });

          

          setMap(map);
        });


        return () => map.remove();
    }, [active, year,country,open]);

    const flyTo = (...props) => {
      map.flyTo({
        center: [props[0], props[1]],
        essential: true
        });
    }

    return (
        <div>
          <div ref={mapContainer} className="map-container" />
          <NavBar flyTo={flyTo} year={year} setYear={setYear} />
          <Legend active={active} year={year} />
          {open && 
            <CountryModal open={open} close={handleClose} country={country}/>
          }
        </div>
    );
}

export default Map;