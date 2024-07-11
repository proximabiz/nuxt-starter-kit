import type { H3Event } from 'h3'
import { DiagramType } from '../types/chart.types'
import { CustomError } from './custom.error'
import { serverSupabaseClient } from '#supabase/server'

export async function getPrompt(event: H3Event, title: string, diagramType: string, isDetail: boolean, details: string) {
  const client = await serverSupabaseClient(event)
  const { data, error, status } = await client.from('diagram_type').select('name').eq('id', diagramType)
  if (error)
    throw new CustomError(`Error: ${error.message}`, status)

  if (Array.isArray(data) && data.length === 0)
    throw new CustomError('Error: no diagram-type found!', 404)

  const diagram = data[0].name

  let prompt: string = ''
  switch (diagram) {
    case DiagramType.MINDELIXIR:
      if (isDetail)
        prompt = `Prepare a mind map JSON structure on the topic '${title}'. The output JSON should be in the following format: [{"nodeData": {"topic": "${details}", "id": "some_uuid", "root": true, "parent": "undefined", "children": [{"topic": "child_topic", "id": "some_uuid", "direction": 0}, {"topic": "child_topic", "id": "some_uuid", "direction": 1}]}}].`

      else
        prompt = `Prepare a mind map JSON structure on the topic '${title}'. The output JSON should be in the following format: [{"nodeData": {"topic": "${title}", "id": "some_uuid", "root": true, "parent": "undefined", "children": [{"topic": "child_topic", "id": "some_uuid", "direction": 0}, {"topic": "child_topic", "id": "some_uuid", "direction": 1}]}}].`

      break
    case DiagramType.FLOWCHART:
      if (isDetail)
        prompt = `Prepare a flowchart JSON structure on topic '${title}' that may have '${details}'. The output JSON should be in this format- [{"nodeDataArray":[{"key":-1,"category":"Start","loc":"175 0","text":"Start"},{"key":0,"loc":"175 100","text":""},...,{"key":-2,"category":"End","loc":"175 600","text":"End"},{"category":"Conditional","text":"","key":,"loc":""}],"linkDataArray":[{"from":-1,"to":0,"fromPort":"B","toPort":"T"},...,{"from":4,"to":-2,"fromPort":"B","toPort":"T"}]}]`

      else
        prompt = `Prepare a flowchart JSON structure on topic '${title}'. The output JSON should be in this format-[{"nodeDataArray":[{"key":-1,"category":"Start","loc":"175 0","text":"Start"},{"key":0,"loc":"175 100","text":"<relavant_branch>"},...,{"key":-2,"category":"End","loc":"175 600","text":"End"},{"category":"Conditional","text":"","key":,"loc":""}],"linkDataArray":[{"from":-1,"to":0,"fromPort":"B","toPort":"T"},...,{"from":4,"to":-2,"fromPort":"B","toPort":"T"},{"from":-3,"to":"4","fromPort":"B","toPort":"L","visible":true,"points":[]},{"from":-3,"to":"1","fromPort":"L","toPort":"L","visible":true,"points":[],"text":"No"}]}]`

      break

    default:
      break
  }
  return prompt
}
