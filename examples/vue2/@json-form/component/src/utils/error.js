class ComponentError {
  constructor (comp, message) {
    this.comp = comp
    this.message = message
  }

  showError () {
    console.error(`[Component Error - ${this.comp}] ${this.message}`)
  }
}

export {
  ComponentError
}