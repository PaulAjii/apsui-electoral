export const randomPosition = () => {
  const x = Math.random() * window.innerWidth
  const y = Math.random() * window.innerHeight

  return { x, y }
}
