import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, {useState, useRef, useCallback, useEffect} from "react";
import MapGL, {FlyToInterpolator} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

import { Editor, EditingMode, DrawLineStringMode, DrawPolygonMode } from 'react-map-gl-draw';
import useCurrentLocation from "../hooks/useCurrentLocation";
import {geolocationOptions} from "../constants/geolocationOptions";
import useWatchLocation from "../hooks/useWatchLocation";

// Ways to set Mapbox token: https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZnJvemllcyIsImEiOiJja3BrYWtqMHAwcWxwMndvZzJ3dTA0Mmx5In0.9hVe317rhGrT2ynl-1-bGQ'

const Map = () => {
    const mapRef = useRef();

    const [viewport, setViewport] = useState({
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 5
    });

    const MODES = [
        { id: 'drawPolyline', text: 'Draw Polyline', handler: DrawLineStringMode },
        { id: 'drawPolygon', text: 'Draw Polygon', handler: DrawPolygonMode },
        { id: 'editing', text: 'Edit Feature', handler: EditingMode },
    ];

    const [mode, setMode] = useState(new DrawPolygonMode())

    //Location access
    const { location: currentLocation, error: currentError } = useCurrentLocation(geolocationOptions);
    const { location, cancelLocationWatch, error } = useWatchLocation(geolocationOptions);
    const [isWatchinForLocation, setIsWatchForLocation] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            goToUser();
            console.log("went")
        }, 3000);
    },[location])

    // Retrieve the devices location
    useEffect(() => {
        if (!location) return;

        setTimeout(() => {
            // Cancel location watch after 3sec
            cancelLocationWatch();
            setIsWatchForLocation(false);
        }, 3000);
    }, [location, cancelLocationWatch]);

    const handleViewportChange = useCallback(
        (newViewport) => setViewport(newViewport),
        []
    );

    // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
    const handleGeocoderViewportChange = useCallback(
        (newViewport) => {
            const geocoderDefaultOverrides = { transitionDuration: 1000 };

            return handleViewportChange({
                ...newViewport,
                ...geocoderDefaultOverrides
            });
        },
        [handleViewportChange]
    );

    const goToUser = () => {
        if (location) {
            setViewport({
                ...viewport,
                longitude: location.longitude,
                latitude: location.latitude,
                zoom: 13,
                transitionDuration: 3000,
                transitionInterpolator: new FlyToInterpolator(),
                // transitionEasing: d3.easeCubic
            })
        }

    }

    return (
        <div style={{ height: "100vh", width: '100vw' }}>
            <MapGL
                ref={mapRef}
                {...viewport}
                width="100%"
                height="80%"
                onViewportChange={handleViewportChange}
                mapboxApiAccessToken={MAPBOX_TOKEN}
            >
                <Geocoder
                    mapRef={mapRef}
                    onViewportChange={handleGeocoderViewportChange}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    position="top-left"
                />

                <Editor
                    // // to make the lines/vertices easier to interact with
                    clickRadius={12}
                    mode={mode}
                    position="top-right"
                />


            </MapGL>
        </div>
    );
};
export default Map