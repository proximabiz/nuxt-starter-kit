import { OpenAI } from 'openai'
import { diff } from 'json-diff'
import { CustomError } from '../../utlis/custom.error'
import { protectRoute } from '../../utlis/route.protector'
import { PATCHChartUpdateValidation } from '../../utlis/validations'
import { getPrompt } from '../../utlis/prompts'
import type { ChartResponseType } from '~/server/types/chart'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const client = await serverSupabaseClient(event)
  const params = await readBody(event)
  const diagramId: string = getRouterParam(event, 'id')!
  try {
    const chartValidation = await PATCHChartUpdateValidation.validateAsync(params)
    if (!chartValidation) {
      throw new CustomError('Invalid input provided', 401)
    }
    else {
      const { data: diagram, error: errorDiagram } = await getDiagram(client, diagramId)
      if (errorDiagram)
        throw new CustomError(`Error: ${errorDiagram.message}`, 400)

      if (Array.isArray(diagram) && diagram.length === 0)
        throw new CustomError(`no diagram found for the diagramId:${diagramId}`, 402)

      const oldChartJson = JSON.parse(diagram[0].response)
      const newChartJson = JSON.parse(chartValidation.existingOpenAIResponse)
      if (diff(oldChartJson, newChartJson) == null)
        return { message: 'Diagram is up to date. No changes required.', data: chartValidation, status: 200 }

      // update tables
      const { data, error } = await updateDiagramForResponse(client, chartValidation.existingOpenAIResponse, diagramId)
      await insertDiagramVersion(client, diagramId, event.context.user.id, chartValidation.existingOpenAIResponse)

      return { message: 'Success!', data: { data, response: chartValidation.existingOpenAIResponse, error }, status: 200 }
    }
  }
  catch (error: any) {
    if (error.isJoi === true) {
      // implement
      return {
        message: 'Invalid chart details provided',
        status: 401,
      }
    }
  }
})

async function getDiagram(client: any, diagramId: string): Promise<{ data: any, error: any }> {
  return await client.from('diagrams').select(
    `
            id,
            created_at,
            diagram_type_id(name,id),
            user_id,
            title,
            keywords,
            details,
            response
            `,
  ).eq('id', diagramId).limit(1)
}

async function insertDiagramVersion(client: any, diagramId: string, userId: string, chart: object) {
  await client.from('diagram_version').insert([{
    diagram_id: diagramId,
    user_id: userId,
    response: chart,
    versions: new Date().toISOString(),
  }] as any)
}

async function updateDiagramForResponse(client: any, response: ChartResponseType, diagramId: string): Promise<{ data: any, error: any }> {
  return await client.from('diagrams').update(
    {
      response,
    } as never,
  ).eq('id', diagramId).select()
}
