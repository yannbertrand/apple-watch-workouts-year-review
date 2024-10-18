const { mapWorkoutAttributes, mapWorkoutStatisticsAttributes } = require('../lib/mapper')

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
      expect(result.totalDistance).toBeUndefined()
    })

    it('should set a "totalEnergyBurned" float key', () => {
      expect(result.totalEnergyBurned).toBeUndefined()
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

describe('mapWorkoutStatisticsAttributes(workout, attributes)', () => {
  let workout
  beforeEach(() => {
    workout = mapWorkoutAttributes(sampleWorkout)
  })

  describe('with non handled type', () => {
    it('should do nothing', () => {
      const sampleAttributes = {
        type: 'HKQuantityTypeIdentifierUnknown',
        sum: 10,
        unit: 'm/s',
      }

      expect(mapWorkoutStatisticsAttributes(workout, sampleAttributes)).toEqual(workout)
    })
  })

  describe('with handled type', () => {
    it('should handle the "energy" identifier', () => {
      const sampleAttributes = {
        type: 'HKQuantityTypeIdentifierActiveEnergyBurned',
        sum: '32.742351690196',
        unit: 'kcal',
      }
      const result = mapWorkoutStatisticsAttributes(workout, sampleAttributes)

      expect(result.totalEnergyBurned).toEqual(32.742351690196)
    })

    it('should handle the "cycling distance" identifier', () => {
      const sampleAttributes = {
        type: 'HKQuantityTypeIdentifierDistanceCycling',
        sum: '1.759895436402728',
        unit: 'km',
      }
      const result = mapWorkoutStatisticsAttributes(workout, sampleAttributes)

      expect(result.totalDistance).toEqual(1.759895436402728)
    })

    it('should handle the "swimming distance" identifier', () => {
      const sampleAttributes = {
        type: 'HKQuantityTypeIdentifierDistanceSwimming',
        sum: '750',
        unit: 'm',
      }
      const result = mapWorkoutStatisticsAttributes(workout, sampleAttributes)

      expect(result.totalDistance).toEqual(0.75)
    })

    it('should handle the "walking/running distance" identifier', () => {
      const sampleAttributes = {
        type: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
        sum: '2101.3',
        unit: 'm',
      }
      const result = mapWorkoutStatisticsAttributes(workout, sampleAttributes)

      expect(result.totalDistance).toEqual(2.1013)
    })
  })
})
