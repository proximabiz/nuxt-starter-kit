import { OpenAI } from 'openai'
import { CustomError } from '../../utlis/custom.error'
import { getPrompt } from '../../utlis/prompts'
import { protectRoute } from '../../utlis/route.protector'
import { PUTChartUpdateValidation } from '~/server/utlis/validations'
import type { ChartResponseType } from '~/server/types/chart'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const client = await serverSupabaseClient(event)
  const params = await readBody(event)
  const diagramId: string = getRouterParam(event, 'id')!
  const chartValidation = await PUTChartUpdateValidation.validateAsync(params)

  if (!chartValidation) {
    throw new CustomError('Invalid input provided', 401)
  }
  else {
    const { data: diagram, error: errorDiagram } = await getDiagram(client, diagramId)
    if (errorDiagram)
      throw new CustomError(`Error: ${errorDiagram.message}`, 400)

    if (Array.isArray(diagram) && diagram.length === 0)
      throw new CustomError(`no diagram found for the diagramId:${diagramId}`, 402)

    const userKeyword = chartValidation.title
    if (!userKeyword)
      throw new CustomError('User keyword is required', 401)

    const userRequirement = chartValidation.details || diagram[0].details
    const prompt = await getPrompt(event, userKeyword, diagram[0].diagram_type_id.id, chartValidation.isDetailed, userRequirement) // to get prompts
    const openai: any = new OpenAI({
      apiKey: useRuntimeConfig().private.OPENAI_API_KEY,
    })

    const completion: any = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      max_tokens: 2000,
      temperature: 0.7,
    })
    const chart: object = JSON.parse(completion.choices[0].text)
    if (chart) {
      const response: ChartResponseType = {
        userKeyword: chartValidation.userKeyword,
        userRequirement,
        diagramType: chartValidation.diagramType,
        isDetailed: chartValidation.isDetailed,
        chartDetails: chart,
      }
      const { data, error } = await updateDiagram(client, userKeyword, userRequirement, response, diagramId)
      await insertDiagramVersion(client, diagramId, event.context.user.id, chart, userRequirement)

      return { message: 'Success!', data: { data, response, error }, status: 200 }
    }
    else {
      return { message: 'server is busy please, try again!', status: 400 }
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

async function insertDiagramVersion(client: any, diagramId: string, userId: string, chart: object, details: string) {
  await client.from('diagram_version').insert([{
    diagram_id: diagramId,
    user_id: userId,
    response: chart,
    versions: new Date().toISOString(),
    details,
  }] as any)
}

async function updateDiagram(client: any, userKeyword: any, userRequirement: any, response: ChartResponseType, diagramId: string): Promise<{ data: any, error: any }> {
  return await client.from('diagrams').update(
    {
      title: userKeyword,
      keywords: userKeyword,
      details: userRequirement,
      response,
    } as never,
  ).eq('id', diagramId).select()
}

// async function updateDiagramForResponse(client: any, response: ChartResponseType, diagramId: string): Promise<{ data: any, error: any }> {
//   return await client.from('diagrams').update(
//     {
//       response,
//     } as never,
//   ).eq('id', diagramId).select()
// }
