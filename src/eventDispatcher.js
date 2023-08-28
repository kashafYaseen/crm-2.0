const eventListeners = {
  triggerNavigationToLogin: [],
}

const dispatchEvent = (eventName, payload) => {
  if (eventListeners[eventName]) {
    eventListeners[eventName].forEach((listener) => {
      listener(payload)
    })
  }
}

export { dispatchEvent }
