import { serverSupabaseClient } from '#supabase/server';
import { protectRoute } from '../../../utlis/route.protector';

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const client = await serverSupabaseClient(event);
  const diagramIdentifier = await getRouterParam(event,'id')
  const {data:diagram,error} = await client.from('diagrams').select('*').eq('diagram_identifier',diagramIdentifier!).limit(1)

  if(error)
   throw createError(error)

   if(!diagram.length){
    throw createError('No diagram found');
   }
   if(diagram[0].access!=='public'){
    throw createError("you don't have access to this resource")
   }

   return {
    diagram,
    error
   }

  
})
