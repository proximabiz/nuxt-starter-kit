

import {serverSupabaseClient} from '#supabase/server';

export default defineEventHandler(async (event) => {
    await protectRoute(event);

    const client = await serverSupabaseClient(event);
    // const {data,error} = await client.from('diagrams').select('*');
    
    const {data,error}= await client.from('diagrams').select(//'*').eq('id',diagramId).limit(1)
              `
            id,
            created_at,
            diagram_type_id(name,id),
            user_id,
            title,
            keywords,
            details,
            response
            `)
    return {
        data,
        error
    }
  })
  