const { mapWorkoutAttributes, mapWorkoutStatisticsAttributes } = require('./mapper')

module.exports = class Handler {
  set parser(parser) {
    this._parser = parser
  }

  onStart() {
    this._parser.emit('start')
  }

  onOpenTag(name, attributes) {
    if (name === 'Workout') {
      this._initWorkout(attributes)
    }
    if (name === 'WorkoutStatistics') {
      this._addWorkoutStatistics(attributes)
    }
  }

  onCloseTag(name) {
    if (name === 'Workout') {
      this._writeWorkout()
    }
  }

  onEnd() {
    console.log(`Found ${this._workoutsIds.size} workouts and ${this._nbOfDuplicateWorkouts} duplicates`)
  }

  onError(error) {
    throw new Error(error)
  }

  _parser
  _workoutsIds = new Set()
  _currentWorkout = null
  _nbOfDuplicateWorkouts = 0

  _initWorkout(attributes) {
    this._currentWorkout = mapWorkoutAttributes(attributes)
  }

  _writeWorkout() {
    if (this._workoutsIds.has(this._currentWorkout.id)) {
      console.info(`Workout ${this._currentWorkout.id} seems to have already been added`)
      this._nbOfDuplicateWorkouts++
      return
    }

    // Manually emit Workout JSON Object data
    this._parser.emit('data', JSON.stringify(this._currentWorkout))

    this._workoutsIds.add(this._currentWorkout.id)
    this._currentWorkout = null
  }

  _addWorkoutStatistics(attributes) {
    this._currentWorkout = mapWorkoutStatisticsAttributes(this._currentWorkout, attributes)
  }
}
