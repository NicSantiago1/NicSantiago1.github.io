import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import countries from './geodata/countries.geojson';
import centroids from './geodata/centroids.geojson';
import NavBar from './NavBar';

import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibnNhbnRpYWdvMTgiLCJhIjoiY2xjcjN5cDRnMGJwbjNwbjJodjZzM2htZiJ9.j9PqvIjlbwoNyZsEqmFrqg';

const Map = () => {
    const options = [
      {
        name: 'Name',
        description: 'Country name',
        property: 'ADMIN'
      }
    ]

    const mapContainer = useRef(null);
    const [active, setActive] = useState(null);
    const [map, setMap] = useState(null);

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
              'data': countries
          });

          // Add in a color fill layer from the geojson source
          map.addLayer(
            {
              id: 'countries-fill',
              type: 'fill',
              source: 'countries',
              paint: {
                'fill-color': 'rgba(50, 54, 168, 0.5)'
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
                'line-width': 1
                }
            },
            'country-label'
          );

          // Trying to add a hover effect
          map.on('mousemove', 'countries', (e) => {
            if (e.features.length > 0) {
              if (hoveredStateId !== null) {
                map.setFeatureState(
                  { source: 'countries', id: hoveredStateId },
                  { hover: false }
                );
              }
              hoveredStateId = e.features[0].id;
              map.setFeatureState(
                { source: 'countries', id: hoveredStateId },
                { hover: true }
                );
              }
          });

          // map.addSource('centroids', {
          //   'type': 'geojson',
          //   'data': centroids
          // })

          // map.addLayer({
          //   id: 'places',
          //   type: 'symbol',
          //   source: 'centroids',
          //   layout: {
          //     'icon-image': ['get', 'icon'],
          //     'icon-allow-overlap': true
          //   }
          // });

          // map.on('click', 'places', (e) => {
          //   const coordinates = e.features[0].geometry.coordinates.slice();
          //   const name = e.features[0].properties.COUNTRYAFF; 

          //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          //   }

          //   new mapboxgl.Popup().setLngLat(coordinates).setHTML(name).addTo(map);
          // })
  
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