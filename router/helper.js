'use strict'

module.exports = {
  action(controller) {
    return (actionName) => {
      return controller[actionName].bind(controller)
    }
  }
}
