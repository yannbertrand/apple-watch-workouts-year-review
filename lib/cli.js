const controller = require('./controller')

module.exports = require('yargs').command(
  '$0 [input]',
  'Insert your Apple Watch Workouts data in an InfluxDB database',
  (yargs) => {
    yargs.positional('input', {
      alias: 'i',
      describe: 'path to your Apple Watch Health export.zip file',
      normalize: true,
      check: (test) => {
        console.log('check', test)
      },
    })
  },
  (argv) => {
    controller.pushArchiveDataToInfluxDB(argv.input)
  }
).argv
