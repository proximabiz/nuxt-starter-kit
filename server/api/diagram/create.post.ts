import { OpenAI } from 'openai'
import { CustomError } from '../../utlis/custom.error'
import { getPrompt } from '../../utlis/prompts'
import { protectRoute } from '../../utlis/route.protector'
import { ChartValidation } from '../../utlis/validations'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const client = await serverSupabaseClient(event)
  const params = await readBody(event)

  const chartValidation = await ChartValidation.validateAsync(params)
  if (!chartValidation)
    throw new CustomError('Error: Invalid input provided', 401)
  const prompt = await getPrompt(event, params.title, params.diagramTypeId, params.isDetailed, params.details) // to get prompts

  // Open api Call
  const openai: any = new OpenAI({
    apiKey: useRuntimeConfig().public.OPENAI_API_KEY as string,
  })
  try {
    const completion: any = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      max_tokens: 2000,
      temperature: 0.7,
    })
    const chart: object = JSON.parse(completion.choices[0].text)
    if (!chart)
      throw new CustomError('Error: Server is busy please, try again!', 408)
    // Storing open-ai response in database.
    const { data: diagram, error, status } = await client.from('diagrams').insert([
      {
        user_id: event.context.user.id,
        diagram_type_id: params.diagramTypeId,
        title: params.title,
        keywords: [],
        details: params.details,
        response: chart,
      },
    ] as any).select()
    if (error)
      throw new CustomError(`Supabase Error: ${error.message}`, status)

    return { message: 'Success!', data: { diagram }, status }
  }
  catch (error) {
    throw new CustomError(`Error: ${error}`, 401)
  }
})
