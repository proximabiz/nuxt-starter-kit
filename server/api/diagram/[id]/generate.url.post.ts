
import { serverSupabaseClient } from '#supabase/server';
import { generateUniqueIdentifier } from '~/server/utlis/helper';
import { protectRoute } from '../../../utlis/route.protector';

export default defineEventHandler(async event=>{
    await protectRoute(event);
    const diagramId = getRouterParam(event,'id')!;
    const userId = event.context.user.id;
    const client = await serverSupabaseClient(event);
    console.log("diagramId",diagramId);
    console.log("userId",userId);

    
    const {error} = await client.from('diagrams').select('*').eq('id',diagramId).eq('user_id',userId).single();
    console.log("error",error);
    if(error)
        throw createError('no diagram found');
    const uniqueDiagramIdentifier= generateUniqueIdentifier()
    const {data,error:updateError} = await client.from('diagrams').update({
        access:'public',
        diagram_identifier:uniqueDiagramIdentifier
    }as never).eq('id',diagramId).select();

    if(updateError)
        throw createError(updateError);
    return {
        data,
        uniqueDiagramIdentifier
    }
})