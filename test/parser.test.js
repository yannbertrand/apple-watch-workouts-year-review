const createParser = require('../lib/parser')

const workout = require('./samples/apple-workout.json')

describe('parser(handler)', () => {
  let handler, parser

  beforeEach(() => {
    handler = {
      onStart: jest.fn(),
      onOpenTag: jest.fn(),
      onEnd: jest.fn(),
      onError: jest.fn()
    }

    parser = createParser(handler)
  })

  describe('on doctype()', () => {
    it('should call handler.onStart()', () => {
      parser.emit('doctype')
      expect(handler.onStart).toHaveBeenCalled()
    })
  })

  describe('on opentag(node)', () => {
    it('should call handler.onOpenTag', () => {
      const node = { name: 'Workout', attributes: workout }
      parser.emit('opentag', node)
      expect(handler.onOpenTag).toHaveBeenCalledWith(node.name, node.attributes)
    })
  })

  describe('on end()', () => {
    it('should call handler.onEnd()', () => {
      parser.emit('end')
      expect(handler.onEnd).toHaveBeenCalled()
    })
  })

  describe('on error()', () => {
    it('should call handler.onError(error)', () => {
      const error = 'An error occured'
      parser.emit('error', error)
      expect(handler.onError).toHaveBeenCalledWith(error)
    })
  })
})
