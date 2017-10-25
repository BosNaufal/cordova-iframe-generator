
import fs from 'fs'
import Handlebars from 'handlebars'

var utils = {

  renderTemplate(location) {
    var templateString = fs.readFileSync(location).toString()
    const template = Handlebars.compile(templateString, { noEscape: true })
    return template
  },

  renderStringTemplate(templateLocation, variables) {
    return utils.renderTemplate(templateLocation)(variables)
  },

}

module.exports = utils
