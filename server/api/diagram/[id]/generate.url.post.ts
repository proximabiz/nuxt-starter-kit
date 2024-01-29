import { protectRoute } from '../../../utlis/route.protector'
import { serverSupabaseClient } from '#supabase/server'
import { generateUniqueIdentifier } from '~/server/utlis/helper'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const diagramId = getRouterParam(event, 'id')!
  const userId = event.context.user.id
  const client = await serverSupabaseClient(event)

  const { error } = await client.from('diagrams').select('*').eq('id', diagramId).eq('user_id', userId).single()
  if (error)
    throw createError('no diagram found')
  const uniqueDiagramIdentifier = generateUniqueIdentifier()
  const { data, error: updateError } = await client.from('diagrams').update({
    access: 'public',
    diagram_identifier: uniqueDiagramIdentifier,
  } as never).eq('id', diagramId).select()

  if (updateError)
    throw createError(updateError)
  return {
    data,
    uniqueDiagramIdentifier,
  }
})
