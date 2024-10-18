const Influx = require('influx')
const { Writable } = require('node:stream')

let influx
const stream = new Writable({
  async write(chunk, encoding, callback) {
    try {
      await loadInfluxInstance()

      const currentWorkout = JSON.parse(chunk.toString())

      const influxPoints = [currentWorkout].map((workout) => ({
        measurement: process.env.APPLE_WATCH_INFLUX_MEASUREMENT,
        tags: { type: workout.type, date: workout.startDate.substring(0, 10) },
        fields: {
          duration: workout.duration,
          totalDistance: workout.totalDistance,
          totalEnergyBurned: workout.totalEnergyBurned,
          sourceName: workout.sourceName,
          sourceVersion: workout.sourceVersion,
        },
        timestamp: new Date(workout.startDate),
      }))

      await influx.writePoints(influxPoints)
    } catch (error) {
      console.error(error)
    }

    callback()
  },
})

module.exports = () => {
  return stream
}

const loadInfluxInstance = async () => {
  if (influx !== undefined) {
    return
  }

  const influxInstance = new Influx.InfluxDB({
    host: 'localhost',
    database: process.env.APPLE_WATCH_INFLUX_DATABASE,
    schema: [
      {
        measurement: process.env.APPLE_WATCH_INFLUX_MEASUREMENT,
        tags: ['type', 'date'],
        fields: {
          duration: Influx.FieldType.FLOAT,
          totalDistance: Influx.FieldType.FLOAT,
          totalEnergyBurned: Influx.FieldType.FLOAT,
          sourceName: Influx.FieldType.STRING,
          sourceVersion: Influx.FieldType.STRING,
        },
      },
    ],
  })

  const databasesNames = await influxInstance.getDatabaseNames()
  if (!databasesNames.includes(process.env.APPLE_WATCH_INFLUX_DATABASE)) {
    await influxInstance.createDatabase(process.env.APPLE_WATCH_INFLUX_DATABASE)
  }

  influx = influxInstance
}
