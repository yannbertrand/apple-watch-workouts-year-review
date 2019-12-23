const fs = require('fs')
const unzipper = require('unzipper')

const Handler = require('./handler')
const appleWatchWorkoutParser = require('./parser')
const writeInfluxPoints = require('./influx')

module.exports.pushArchiveDataToInfluxDB = (archivePath) => {
  fs
    .createReadStream(archivePath)
    .pipe(unzipper.ParseOne('export.xml'))
    .on('entry', () => console.log('Exploring your data. It will take some time, please wait...'))
    .pipe(appleWatchWorkoutParser(new Handler()))
    .pipe(writeInfluxPoints())
}
