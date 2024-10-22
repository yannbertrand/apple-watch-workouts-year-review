const { InfluxDB, Point } = require('@influxdata/influxdb-client')
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

      influxWriteApi.writePoints(influxPoints)
    } catch (error) {
      console.log(`InfluxDB writing error: ${error.message}`)
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

  const influx = new InfluxDB({ url, token })
  const setupApi = new SetupAPI(influx)

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
      console.debug(`InfluxDB '${url}' is ready.`)
    }
  } catch (error) {
    console.error(error)
    console.log('\nInfluxDB setup ERROR')
  }

  const influxWriteApi = influx.getWriteApi(org, bucket, 's')
  influxWriteApi.useDefaultTags({ location: hostname() })

  return influxWriteApi
}

async function closeInfluxInstance(influxWriteApi) {
  // WriteApi always buffer data into batches to optimize data transfer to InfluxDB server.
  // writeApi.flush() can be called to flush the buffered data. The data is always written
  // asynchronously, Moreover, a failed write (caused by a temporary networking or server failure)
  // is retried automatically.
  //
  // close() flushes the remaining buffered data and then cancels pending retries.

  try {
    await influxWriteApi.close()
    console.debug('InfluxDB connection closed successfully.')
  } catch (error) {
    console.error(error)
    console.log('\nInfluxDB connection closing ERROR')
  }
}
