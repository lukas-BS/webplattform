export function usePreventEnter() {
  const preventEnter = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      return false
    }
  }

  return { preventEnter }
}
