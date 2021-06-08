import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import ReactMapboxGl from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const Map = ReactMapboxGl({
    accessToken:
        "pk.eyJ1IjoiZmFrZXVzZXJnaXRodWIiLCJhIjoiY2pwOGlneGI4MDNnaDN1c2J0eW5zb2ZiNyJ9.mALv0tCpbYUPtzT7YysA2g"
});


export default function Home() {

    const onDrawCreate = ({ features }) => {
        console.log(features);
    };

    const onDrawUpdate = ({ features }) => {
        console.log(features);
    };

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

          <Map
              style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
              containerStyle={{
                  height: "600px",
                  width: "100vw"
              }}
          >
              <DrawControl onDrawCreate={onDrawCreate} onDrawUpdate={onDrawUpdate}  />
          </Map>

      </main>
    </div>
  )
}
