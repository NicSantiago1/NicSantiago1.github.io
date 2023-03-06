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
          style: 'mapbox://styles/nsantiago18/clew3cebz009501qrtetpd6cg',
          center: [16, 48],
          zoom: 3,
        });

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

          map.addSource('centroids', {
            'type': 'geojson',
            'data': centroids
          })

          map.addLayer({
            id: 'places',
            type: 'symbol',
            source: 'centroids',
            layout: {
              'icon-image': ['get', 'icon'],
              'icon-allow-overlap': true
            }
          });

          map.on('click', 'places', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.ADMIN; 

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup().setLngLat(coordinates).setHTML(name).addTo(map);
          })

          // map.on('mouseenter', 'places', () => {
          //   map.getCanvas().style.cursor = 'pointer';
          // });

          // map.on('mouseleave', 'places', () => {
          //   map.getCanvas().style.cursor = '';
          // });

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
          <button className='map-overlay' onClick={() => setActive('yes')}> Change Color </button>
        </div>
    );
}

export default Map;