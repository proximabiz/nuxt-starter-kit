import { serverSupabaseClient } from '#supabase/server';
import { H3Event } from 'h3';

export const protectRoute =async  (event:H3Event)=>{

    // Use the Supabase client
    const client = await serverSupabaseClient(event);
    const authorizationHeader = await getHeader(event,'Authorization');
    
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new Error('InvalidToken');
    }
    const token = authorizationHeader.split(' ')[1];
    try {
        const { data, error } =  await client.auth.getUser(token);
        if (error) throw error;
        if (!data) {throw new Error("Invalid token");}
        event.context.user = data.user;
    
    }catch(error:any){
        throw new Error(`Invalid Token ${error.message}`)
    }      
}

export const signOut= async (event:H3Event)=>{
    // Use the Supabase client
    const client = await serverSupabaseClient(event);
    const authorizationHeader = await getHeader(event,'Authorization');
    
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new Error('InvalidToken');
    }
    const token = authorizationHeader.split(' ')[1];
    try {
        const { error } =  await client.auth.signOut();
        if (error) throw error;
        // if (!data) {throw new Error("Invalid token");}
        // event.context.user = data.user;
    
    }catch(error:any){
        throw new Error(`Invalid Token ${error.message}`)
    }    
}
    
    