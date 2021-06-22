import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import turf from "turf";
import useCurrentLocation from "../hooks/useCurrentLocation";
import useWatchLocation from "../hooks/useWatchLocation";
import Location from "./Location";
import {geolocationOptions} from "../constants/geolocationOptions";

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const Map = () => { //TODO: Documentation Documentation Documentation
    // initializing the map container as a reference.
    const mapContainerRef = useRef(null);

    // Latitude and longitude and zoom states for the map itself
    const [lng, setLng] = useState(-81.8); /*TODO: Set to current users location*/
    const [lat, setLat] = useState(26.5);/*TODO: Set to current users location*/
    const [zoom, setZoom] = useState(10);/*TODO: Set to current users location*/

    // Add area to a state that defaults to zero
    const [area, setArea] = useState(0);

    // Create a mapbox drawing component
    const Draw = new MapboxDraw();

    //Location access
    const { location: currentLocation, error: currentError } = useCurrentLocation(geolocationOptions);
    const { location, cancelLocationWatch, error } = useWatchLocation(geolocationOptions);
    const [isWatchinForLocation, setIsWatchForLocation] = useState(true);

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

    useEffect(() => {
        if (!location) return;

        else if (location) {
            setLng(location.longitude);
            setLat(location.latitude);
        }

        // Cancel location watch after 3sec
        setTimeout(() => {
            cancelLocationWatch();
            setIsWatchForLocation(false);
        }, 3000);
    }, [location, cancelLocationWatch]);

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

                <p>Current position:</p>
                <Location location={currentLocation} error={currentError} />

                <p>Watch position: (Status: {isWatchinForLocation.toString()})</p>
                <Location location={location} error={error} />
            </div>
            <div className='map-container' ref={mapContainerRef} />
        </div>
    );
};

export default Map;