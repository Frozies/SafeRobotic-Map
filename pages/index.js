import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl';
import {useEffect, useRef, useState} from "react"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoiZnJvemllcyIsImEiOiJja3BrYWtqMHAwcWxwMndvZzJ3dTA0Mmx5In0.9hVe317rhGrT2ynl-1-bGQ';



export default function Home() {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
    });

  return (
    <div className={styles.container}>
      <Head>
        <title>SafeRobotic - Map Demo</title>
        <meta name="description" content="The map demo!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="http://saferobotic.com/">SafeRobotic</a>
        </h1>
          <h2> Map Demo!</h2>
          <div ref={mapContainer} className="map-container" />
      </main>
    </div>
  )
}
