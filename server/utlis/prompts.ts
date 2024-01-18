import type { H3Event } from 'h3'
import { CustomError } from './custom.error'
import { serverSupabaseClient } from '#supabase/server'

export async function getPrompt(event: H3Event, diagramType: string, isDetail: boolean, details: string) {
  const client = await serverSupabaseClient(event)
  const { data, error, status } = await client.from('diagram_type').select('name').eq('id', diagramType)
  if (error)
    throw new CustomError(`Error: ${error.message}`, status)

  if (Array.isArray(data) && data.length === 0)
    throw new CustomError('Error: no diagram-type found!', 404)

  const diagram = data[0].name

  let prompt: string = ''
  if (isDetail)
    prompt = `Prepare a mind map JSON structure on the topic '${details}'. The output JSON should be in the following format: [{"nodeData": {"topic": "${details}", "id": "some_uuid", "root": true, "parent": "undefined", "children": [{"topic": "child_topic", "id": "some_uuid", "direction": 0}, {"topic": "child_topic", "id": "some_uuid", "direction": 1}]}}].`

  else
    prompt = `Prepare a mind map JSON structure on the topic '${details}'. The output JSON should be in the following format: [{"nodeData": {"topic": "${details}", "id": "some_uuid", "root": true, "parent": "undefined", "children": [{"topic": "child_topic", "id": "some_uuid", "direction": 0}, {"topic": "child_topic", "id": "some_uuid", "direction": 1}]}}].`

  return prompt
}
