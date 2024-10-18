#!/usr/bin/env node
const controller = require('./controller')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

module.exports = yargs(hideBin(process.argv)).command(
  '$0 [input]',
  'Insert your Apple Watch Workouts data in an InfluxDB database',
  (yargs) => {
    return yargs.positional('input', {
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
