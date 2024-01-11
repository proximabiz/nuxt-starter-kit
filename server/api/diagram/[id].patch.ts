import {serverSupabaseClient} from '#supabase/server'
import { OpenAI } from 'openai';
import {ChartUpdateValidation} from '../../utils/validations'
import { ChartResponseType, DiagramType } from '~/server/types/chart';
import { protectRoute } from '~/server/utils/route.protector';


export default defineEventHandler(async (event) => {
  await protectRoute(event);
  const client = await serverSupabaseClient(event);

    const params = await readBody(event);
    const diagramId:string = getRouterParam(event,'id')!;
    
    try {
        const chartValidation = await ChartUpdateValidation.validateAsync(params);
        console.log(chartValidation);
        
        
        if (!chartValidation) {
          return {
            message:"Invalid input provided",
            status:401
          }
        } else {

            const {data, error}= await client.from('diagrams').select(
              `
            id,
            created_at,
            diagram_type_id(name,id),
            user_id,
            title,
            keywords,
            details,
            response
            `).eq('id',diagramId).limit(1)
            
            if(!data||Array.isArray(data)&&data.length===0){
                const k =createError(`no diagram found for the diagramId:${diagramId}`)
                return {
                    k,
                    error
                }
            }

            const userKeyword = chartValidation.userKeyword ||  data[0].keywords;
            const userRequirement= chartValidation.userRequirement || data[0].details;
            let prompt ='';
              console.log("hello",data[0].keywords,data[0].details,data[0].diagram_type_id?.name);
              
            switch (data[0].diagram_type_id?.name) {
              case DiagramType.MINDMAP:
                switch (chartValidation.isDetailed) {
                  case true:
                    prompt = `Prepare a mind map JSON structure on topic '${userKeyword}' that may includes ${userRequirement}. The output JSON should be in this format- "[{nodeDataArray": [{ key: 0, text: '<dynamic_keyword>', loc: '0 0', brush: 'lightskyblue' }, { key: 1, parent: 0, text: '', dir: 'right', loc: '100 -40', brush: 'lightgreen' }]}]`;
                    break;
                  default:
                    prompt = `Prepare a mind map JSON structure on topic '${userKeyword}'. The output JSON should be in this format- [{"nodeDataArray": [{ key: 0, text: '<dynamic_keyword>', loc: '0 0', brush: 'lightskyblue' }, { key: 1, parent: 0, text: '', dir: 'right', loc: '100 -40', brush: 'lightgreen' }]}]`;
                    break;
                }
                break;
              case DiagramType.FLOWCHART:
                switch (chartValidation.isDetailed) {
                  case true:
                    prompt = `Prepare a flowchart JSON structure on topic '${userKeyword}' that may have '${userRequirement}'. The output JSON should be in this format- [{"nodeDataArray":[{"key":-1,"category":"Start","loc":"175 0","text":"Start"},{"key":0,"loc":"175 100","text":""},...,{"key":-2,"category":"End","loc":"175 600","text":"End"},{"category":"Conditional","text":"","key":,"loc":""}],"linkDataArray":[{"from":-1,"to":0,"fromPort":"B","toPort":"T"},...,{"from":4,"to":-2,"fromPort":"B","toPort":"T"}]}]`;
                    break;
                  default:
                    prompt = `Prepare a flowchart JSON structure on topic '${userKeyword}'. The output JSON should be in this format-[{"nodeDataArray":[{"key":-1,"category":"Start","loc":"175 0","text":"Start"},{"key":0,"loc":"175 100","text":"<relavant_branch>"},...,{"key":-2,"category":"End","loc":"175 600","text":"End"},{"category":"Conditional","text":"","key":,"loc":""}],"linkDataArray":[{"from":-1,"to":0,"fromPort":"B","toPort":"T"},...,{"from":4,"to":-2,"fromPort":"B","toPort":"T"},{"from":-3,"to":"4","fromPort":"B","toPort":"L","visible":true,"points":[]},{"from":-3,"to":"1","fromPort":"L","toPort":"L","visible":true,"points":[],"text":"No"}]}]`;
                    break;
                }
                break;
              case DiagramType.MINDELIXIR:
                switch (chartValidation.isDetailed) {
                  case true:
                    prompt = `Prepare a mind map JSON structure on the topic '${userKeyword}'. The output JSON should be in the following format: [{"nodeData": {"topic": "${userKeyword}", "id": "some_uuid", "root": true, "parent": "undefined", "children": [{"topic": "child_topic", "id": "some_uuid", "direction": 0}, {"topic": "child_topic", "id": "some_uuid", "direction": 1}]}}].`;
                    break;
                  default:
                    prompt = `Prepare a mind map JSON structure on the topic '${userKeyword}'. The output JSON should be in the following format: [{"nodeData": {"topic": "${userKeyword}", "id": "some_uuid", "root": true, "parent": "undefined", "children": [{"topic": "child_topic", "id": "some_uuid", "direction": 0}, {"topic": "child_topic", "id": "some_uuid", "direction": 1}]}}].`;
                    break;
                }
                break;
              default:
                break;
            }
              
              const openai: any = new OpenAI({
                apiKey: useRuntimeConfig().public.OPENAI_API_KEY
              });
    
              try {
                const completion: any = await openai.completions.create({
                  model: 'gpt-3.5-turbo-instruct',
                  prompt: prompt,
                  max_tokens: 2000,
                  temperature: 0.7
                });
                const chart: object = JSON.parse(completion.choices[0].text);
                if (chart) {
                  const response: ChartResponseType = {
                    userKeyword: chartValidation.userKeyword,
                    userRequirement: chartValidation.userRequirement,
                    diagramType: chartValidation.diagramType,
                    isDetailed: chartValidation.isDetailed,
                    chartDetails: chart,
                  };

                  const { data, error } = await client.from('diagrams').update(
                    
                    {
                        keywords:userKeyword,
                        details:userRequirement,
                        response:response
                    } as never
                    ).eq('id',diagramId).select();
                    
                  return { message: 'Success!', data: {data,response,error},status:200 };
                } else {
                  return { message: 'server is busy please, try again!', status:400 }
                }
            } catch (error: any) {
                return {
                    message:error.message,
                    status:501
                }
            }
        }
      } catch (error: any) {
        if (error.isJoi === true) {
          //implement
          return {
            message:"Invalid chart details provided",
            status:401
          }
        }
      }
});