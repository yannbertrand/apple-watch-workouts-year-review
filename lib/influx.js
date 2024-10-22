const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client')
const { SetupAPI } = require('@influxdata/influxdb-client-apis')
const { hostname } = require('node:os')
const { Writable } = require('node:stream')

let influxWriteApi
;(async () => {
  influxWriteApi = await loadInfluxInstance()
})()

const stream = new Writable({
  async write(chunk, encoding, callback) {
    try {
      const currentWorkout = JSON.parse(chunk.toString())

      const influxPoints = [currentWorkout].map((workout) =>
        new Point(process.env.APPLE_WATCH_INFLUX_MEASUREMENT)
          .tag('type', workout.type)
          .tag('date', workout.startDate.substring(0, 10))
          .tag('sourceName', workout.sourceName)
          .tag('sourceVersion', workout.sourceVersion)
          .floatField('duration', workout.duration)
          .floatField('totalDistance', workout.totalDistance)
          .floatField('totalEnergyBurned', workout.totalEnergyBurned)
          .timestamp(new Date(workout.startDate))
      )

      console.log('*** WRITE POINTS ***')
      influxWriteApi.writePoints(influxPoints)
    } catch (error) {
      console.error(error)
    }

    callback()
  },
})

stream.on('close', () => {
  closeInfluxInstance(influxWriteApi)
})

module.exports = () => {
  return stream
}

async function loadInfluxInstance() {
  const url = 'http://localhost:8086'
  const org = process.env.APPLE_WATCH_INFLUX_ORG
  const bucket = process.env.APPLE_WATCH_INFLUX_BUCKET
  const token = process.env.APPLE_WATCH_INFLUX_TOKEN
  const username = process.env.APPLE_WATCH_INFLUX_USERNAME
  const password = process.env.APPLE_WATCH_INFLUX_PASSWORD

  console.log('*** ONBOARDING ***')
  const setupApi = new SetupAPI(new InfluxDB({ url }))
  try {
    const { allowed } = await setupApi.getSetup()
    if (allowed) {
      await setupApi.postSetup({
        body: {
          org,
          bucket,
          username,
          password,
          token,
        },
      })
      console.log(`InfluxDB '${url}' is now onboarded.`)
    } else {
      console.log(`InfluxDB '${url}' has been already onboarded.`)
    }
    console.log('\nFinished SUCCESS')
  } catch (e) {
    console.error(e)
    console.log('\nFinished ERROR')
  }
  // create a write API, expecting point timestamps in nanoseconds (can be also 's', 'ms', 'us')
  const influxWriteApi = new InfluxDB({ url, token }).getWriteApi(org, bucket, 'ns')

  // setup default tags for all writes through this API
  influxWriteApi.useDefaultTags({ location: hostname() })

  return influxWriteApi
}

async function closeInfluxInstance(influxWriteApi) {
  // WriteApi always buffer data into batches to optimize data transfer to InfluxDB server.
  // writeApi.flush() can be called to flush the buffered data. The data is always written
  // asynchronously, Moreover, a failed write (caused by a temporary networking or server failure)
  // is retried automatically. Read `writeAdvanced.js` for better explanation and details.
  //
  // close() flushes the remaining buffered data and then cancels pending retries.
  try {
    await influxWriteApi.close()
    console.log('FINISHED ...')
  } catch (e) {
    console.error(e)
    if (e instanceof HttpError && e.statusCode === 401) {
      console.log('Run ./onboarding.js to setup a new InfluxDB database.')
    }
    console.log('\nFinished ERROR')
  }
}
