const { mapWorkoutAttributes } = require('./mapper')

module.exports = class Handler {
  set parser(parser) {
    this._parser = parser
  }

  onStart() {
    this._parser.emit('start')
  }

  onOpenTag(name, attributes) {
    if (name === 'Workout') {
      this._writeWorkout(attributes)
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
  _nbOfDuplicateWorkouts = 0

  _writeWorkout(attributes) {
    const workout = mapWorkoutAttributes(attributes)

    if (this._workoutsIds.has(workout.id)) {
      console.info(`Workout ${workout.id} seems to have already been added`)

      this._nbOfDuplicateWorkouts++
    } else {
      // Manually emit Workout JSON Object data
      this._parser.emit('data', JSON.stringify(workout))

      this._workoutsIds.add(workout.id)
    }
  }

}
