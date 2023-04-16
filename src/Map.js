import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import countries from './geodata/countries_with_migration.geojson';
import NavBar from './NavBar';
import Legend from './Legend';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import CountryModal from './CountryModal';
import MigrationTopChart from './MigrationTopChart';
import './Map.css';

import { YearOptions } from './YearOptions';

mapboxgl.accessToken = 'pk.eyJ1IjoibnNhbnRpYWdvMTgiLCJhIjoiY2xjcjN5cDRnMGJwbjNwbjJodjZzM2htZiJ9.j9PqvIjlbwoNyZsEqmFrqg';

const Map = () => {
    const mapContainer = useRef(null);
    const [active, setActive] = useState(YearOptions[21]);
    const [map, setMap] = useState(null);
    const [year, setYear] = useState(2021);
    const [country, setCountry] = useState({});
    const [open, setOpen] = React.useState(false);
    const [lng, setLng] = useState(16);
    const [lat, setLat] = useState(48);
    const [zoom, setZoom] = useState(3);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Initialize the map
    useEffect(() => {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/nsantiago18/clex8n530000g01mszz6zanjx',
          center: [lng, lat],
          zoom: zoom,
        });

        let hoveredStateId = null;

        map.on('load', () => {  

          // Add the geojson as a source
          map.addSource('countries', {
              'type': 'geojson',
              'data': countries,
              'generateId': true
          });

          // Add in a color fill layer from the geojson source
          map.addLayer(
            {
              id: 'countries-fill',
              type: 'fill',
              source: 'countries',
              layout: {},
              paint: {
                'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  1,
                  0.8
                ]
              }
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
                'line-width': 0.7
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
    }, [active,year,country,open]);

    const updateActive = (i) => {
      setActive(YearOptions[i]);
      console.log(active.property);
      map.setPaintProperty('countries-fill', 'fill-color', {
        property: active.property,
        stops: active.stops
      });
    };

    const flyTo = (props) => {
      if (props){
        map.flyTo({
          center: [props.longitude, props.latitude],
          duration: 2000,
          essential: true,
          zoom: 5
        });
  
      }
    }

    return (
        <div>
          <div ref={mapContainer} className="map-container" />
          <NavBar flyTo={flyTo} year={year} setYear={setYear} updateActive={updateActive} />
          <Legend active={active} year={year} open={open} />
          {!open && 
            <Box sx={{ flexGrow: 1 }}>
              <Card sx={{ maxWidth: 250, position: 'absolute', right: 225, bottom: 0, mb: 5, mr: 5 }}>
                  <CardContent>
                  <MigrationTopChart year={year} mode="source" title="Top Migration Sources"/>
                  </CardContent>
              </Card>
            </Box>
          }
         {!open && 
            <Box sx={{ flexGrow: 1 }}>
              <Card sx={{ maxWidth: 250, position: 'absolute', right: 475, bottom: 0, mb: 5, mr: 5 }}>
                  <CardContent>
                  <MigrationTopChart year={year} mode="destination" title="Top Migration Destination"/>
                  </CardContent>
              </Card>
            </Box>
         }
          {open && 
            <CountryModal open={open} handleClose={handleClose} country={country}/>
          }
        </div>
    );
}

export default Map;