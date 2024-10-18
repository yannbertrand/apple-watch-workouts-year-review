const { mapWorkoutAttributes } = require('../lib/mapper')

const sampleWorkout = require('./samples/apple-workout.json')

describe('mapWorkoutAttributes(attributes)', () => {
  describe('with non existing workoutActivityType', () => {
    it('should throw an Error', () => {
      const sampleAttributes = {
        ...sampleWorkout,
        workoutActivityType: 'HKWorkoutActivityTypeSleeping',
      }

      expect(() => mapWorkoutAttributes(sampleAttributes)).toThrow()
    })
  })

  describe('with existing workoutActivityType', () => {
    let result

    beforeEach(() => {
      result = mapWorkoutAttributes(sampleWorkout)
    })

    it('should set an "id" key', () => {
      expect(result.id).toMatchSnapshot()
    })

    it('should set a "type" key', () => {
      expect(result.type).toMatchSnapshot()
    })

    it('should set a "duration" float key', () => {
      expect(result.duration).toMatchSnapshot()
    })

    it('should set a "totalDistance" float key', () => {
      expect(result.totalDistance).toMatchSnapshot()
    })

    it('should set a "totalEnergyBurned" float key', () => {
      expect(result.totalEnergyBurned).toMatchSnapshot()
    })

    it('should set a "sourceName" key', () => {
      expect(result.sourceName).toMatchSnapshot()
    })

    it('should set a "sourceVersion" key', () => {
      expect(result.sourceVersion).toMatchSnapshot()
    })

    it('should set a "creationDate" ISO date key', () => {
      expect(result.creationDate).toMatchSnapshot()
    })

    it('should set a "startDate" ISO date key', () => {
      expect(result.startDate).toMatchSnapshot()
    })

    it('should set a "endDate" ISO date key', () => {
      expect(result.endDate).toMatchSnapshot()
    })
  })
})
