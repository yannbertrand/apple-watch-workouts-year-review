const Handler = require('../lib/handler')

const sampleWorkout = require('./samples/apple-workout.json')
const mappedWorkout = require('./samples/mapped-workout.json')

describe('handler', () => {
  let parser
  let handler

  beforeEach(() => {
    parser = { emit: jest.fn() }
    handler = new Handler()
    handler.parser = parser
  })

  describe('#onStart()', () => {
    it('should emit a "start" event', () => {
      handler.onStart()
      expect(parser.emit).toHaveBeenCalledWith('start')
    })
  })

  describe('#onOpenTag({ name, attributes })', () => {
    describe('with name != "Workout"', () => {
      it('should not emit data to the parser', () => {
        handler.onOpenTag('Record')
        expect(parser.emit).not.toHaveBeenCalled()
      })
    })

    describe('with name == "Workout"', () => {
      beforeEach(() => {
        handler.onOpenTag('Workout', sampleWorkout)
      })

      describe('when workout has never been added', () => {
        it('should emit JSON data to the parser', () => {
          expect(parser.emit).toHaveBeenCalledWith('data', JSON.stringify(mappedWorkout))
        })
      })

      describe('when workout has already been added', () => {
        it('should emit JSON data only one time to the parser', () => {
          handler.onOpenTag('Workout', sampleWorkout)
          expect(parser.emit).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe('#onError(error)', () => {
    it('should throw an Error', () => {
      expect(() => handler.onError('An error occured')).toThrow()
    })
  })

})
