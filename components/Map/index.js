import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import turf from "turf";

require('dotenv').config();

mapboxgl.accessToken = process.env.MAPBOXGL_ACCESSTOKEN;

const Map = () => { //TODO: Documentation Documentation Documentation
    const mapContainerRef = useRef(null);

    const [lng, setLng] = useState(-81.8); /*TODO: Set to current users location*/
    const [lat, setLat] = useState(26.5);/*TODO: Set to current users location*/
    const [zoom, setZoom] = useState(10);/*TODO: Set to current users location*/

    const [area, setArea] = useState(0);

    const Draw = new MapboxDraw();

    // Initialize map when component mounts
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.addControl(Draw, 'top-left');

        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        map.on('draw.create', updateArea);
        map.on('draw.delete', updateArea);
        map.on('draw.update', updateArea);

        function updateArea() { //TODO: Change to arrow function
            const data = Draw.getAll();
            if (data.features.length > 0) {
                let area = turf.area(data);
                // restrict to area to 2 decimal points
                setArea(Math.round(area * 100) / 100);
            } else {
                setArea(0)
            }
        }

        // Clean up on unmount
        return () => map.remove();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>

            {/*TODO: This is bad. move both of these imports somewhere else.*/}
            <script src='https://api.mapbox.com/mapbox-gl-js/v2.3.0/mapbox-gl.js'></script>
            <link href='https://api.mapbox.com/mapbox-gl-js/v2.3.0/mapbox-gl.css' rel='stylesheet' />

            <link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.3.0/mapbox-gl-draw.css' type='text/css' />
            <script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.3.0/mapbox-gl-draw.js'></script>

            <div className='sidebarStyle'>
                <div>
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | Area: {area}m²
                </div>
            </div>
            <div className='map-container' ref={mapContainerRef} />
        </div>
    );
};

export default Map;