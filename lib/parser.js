const sax = require('sax')

module.exports = (handler) => {
  const parser = _initParser(sax.createStream(true))
  handler.parser = parser

  parser.on('doctype', () => handler.onStart())
  parser.on('opentag', ({ name, attributes }) => handler.onOpenTag(name, attributes))
  parser.on('end', () => handler.onEnd())
  parser.on('error', (error) => handler.onError(error))

  return parser
}

/* Override sax parser default write method
 * to avoid emitting raw data to the output stream
 * See https://github.com/isaacs/sax-js/blob/master/lib/sax.js#L240 */
function _initParser(parser) {
  parser.write = function (data) {
    if (typeof Buffer === 'function' &&
      typeof Buffer.isBuffer === 'function' &&
      Buffer.isBuffer(data)) {
      if (!this._decoder) {
        var SD = require('string_decoder').StringDecoder
        this._decoder = new SD('utf8')
      }
      data = this._decoder.write(data)
    }

    this._parser.write(data.toString())
    return true
  }

  return parser
}
