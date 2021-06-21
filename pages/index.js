import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Map from '../components/map/index'

export default function Home() {
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

          {/*Draw map here*/}
          <Map/>

      </main>
    </div>
  )
}
