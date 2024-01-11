import { serverSupabaseClient } from '#supabase/server';


export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event) 
    
    
    const { error } = await client.auth.signOut();
    if (error) {
        console.error(error);
        return;
    }else{
        console.log('OUT');
        return {'message': 'user successfully logged out!'}
    }
});