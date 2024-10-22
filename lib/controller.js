const fs = require('node:fs')
const unzipper = require('unzipper')

const Handler = require('./handler')
const appleWatchWorkoutParser = require('./parser')
const writeInfluxPoints = require('./influx')

module.exports.pushArchiveDataToInfluxDB = (archivePath) => {
  console.log('Exploring your data. It will take some time.')

  fs.createReadStream(archivePath)
    .pipe(unzipper.ParseOne('export.xml'))
    .on('entry', () => console.log('Please wait...\n'))
    .pipe(appleWatchWorkoutParser(new Handler()))
    .pipe(writeInfluxPoints())
    .on('finish', () =>
      console.log(
        "All done! You're ready to open http://localhost:3000/d/apple-watch-workouts/year-dashboard?orgId=1\n"
      )
    )
}
