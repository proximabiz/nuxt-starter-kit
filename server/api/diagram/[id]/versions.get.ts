import { serverSupabaseClient } from '#supabase/server';
import { protectRoute } from '../../../utlis/route.protector';

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  const diagramId = await getRouterParam(event,'id')!;
  console.log("diagramId",diagramId);
  
  const client = await serverSupabaseClient(event);
  const {data,error,status} = await client. from('diagram_version').select('*').eq('diagram_id',diagramId).select();

  return {
    data,
    error,
    status
  }
})
