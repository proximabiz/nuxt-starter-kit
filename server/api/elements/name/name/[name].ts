import eb from '../../elements.json'

export default defineEventHandler((event) => {
  const name = event.context.params.name
  const element = eb.elements.find(e => e.name.toLowerCase() === name.toLowerCase())
  return element || { error: 'Element not found' }
})
