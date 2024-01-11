import { serverSupabaseClient } from '#supabase/server';
import { OpenAI } from 'openai';
import { ChartResponseType, DiagramType } from '../../types/chart';
import { protectRoute } from '../../utlis/route.protector';
import { ChartValidation } from '../../utlis/validations';


export default defineEventHandler(async (event) => {
  await protectRoute(event);
  const client = await serverSupabaseClient(event);

    const params = await readBody(event);
    try {
        const chartValidation = await ChartValidation.validateAsync(params);
        
        if (!chartValidation) {
          return {
            message:"Invalid input provided",
            status:401
          }
        } else {
              let prompt: string = '';
              switch (chartValidation.diagramType) { 
                case DiagramType.MINDMAP:
                  switch (chartValidation.isDetailed) {
                    case true:
                      prompt = `Prepare a mind map JSON structure on topic '${chartValidation.userKeyword}' that may includes ${chartValidation.userRequirement}. The output JSON should be in this format- "[{nodeDataArray": [{ key: 0, text: '<dynamic_keyword>', loc: '0 0', brush: 'lightskyblue' }, { key: 1, parent: 0, text: '', dir: 'right', loc: '100 -40', brush: 'lightgreen' }]}]`;
                      break;
                    default:
                      prompt = `Prepare a mind map JSON structure on topic '${chartValidation.userKeyword}'. The output JSON should be in this format- [{"nodeDataArray": [{ key: 0, text: '<dynamic_keyword>', loc: '0 0', brush: 'lightskyblue' }, { key: 1, parent: 0, text: '', dir: 'right', loc: '100 -40', brush: 'lightgreen' }]}]`;
                      break;
                  }
                  break;
                case DiagramType.FLOWCHART:
                  switch (chartValidation.isDetailed) {
                    case true:
                      prompt = `Prepare a flowchart JSON structure on topic '${chartValidation.userKeyword}' that may have '${chartValidation.userRequirement}'. The output JSON should be in this format- [{"nodeDataArray":[{"key":-1,"category":"Start","loc":"175 0","text":"Start"},{"key":0,"loc":"175 100","text":""},...,{"key":-2,"category":"End","loc":"175 600","text":"End"},{"category":"Conditional","text":"","key":,"loc":""}],"linkDataArray":[{"from":-1,"to":0,"fromPort":"B","toPort":"T"},...,{"from":4,"to":-2,"fromPort":"B","toPort":"T"}]}]`;
                      break;
                    default:
                      prompt = `Prepare a flowchart JSON structure on topic '${chartValidation.userKeyword}'. The output JSON should be in this format-[{"nodeDataArray":[{"key":-1,"category":"Start","loc":"175 0","text":"Start"},{"key":0,"loc":"175 100","text":"<relavant_branch>"},...,{"key":-2,"category":"End","loc":"175 600","text":"End"},{"category":"Conditional","text":"","key":,"loc":""}],"linkDataArray":[{"from":-1,"to":0,"fromPort":"B","toPort":"T"},...,{"from":4,"to":-2,"fromPort":"B","toPort":"T"},{"from":-3,"to":"4","fromPort":"B","toPort":"L","visible":true,"points":[]},{"from":-3,"to":"1","fromPort":"L","toPort":"L","visible":true,"points":[],"text":"No"}]}]`;
                      break;
                  }
                  break;
                case DiagramType.MINDELIXIR:
                  switch (chartValidation.isDetailed) {
                    case true:
                      prompt = `Prepare a mind map JSON structure on the topic '${chartValidation.userKeyword}'. The output JSON should be in the following format: [{"nodeData": {"topic": "${chartValidation.userKeyword}", "id": "some_uuid", "root": true, "parent": "undefined", "children": [{"topic": "child_topic", "id": "some_uuid", "direction": 0}, {"topic": "child_topic", "id": "some_uuid", "direction": 1}]}}].`;
                      break;
                    default:
                      prompt = `Prepare a mind map JSON structure on the topic '${chartValidation.userKeyword}'. The output JSON should be in the following format: [{"nodeData": {"topic": "${chartValidation.userKeyword}", "id": "some_uuid", "root": true, "parent": "undefined", "children": [{"topic": "child_topic", "id": "some_uuid", "direction": 0}, {"topic": "child_topic", "id": "some_uuid", "direction": 1}]}}].`;
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


                  const { data, error } = await client.from('diagrams').insert([
                    {
                        user_id:event.context.user.id,
                        diagram_type_id:"b5aa1efa-1c9e-4371-9b7a-67c5e437c0a8",
                        title:chartValidation.userKeyword,
                        keywords:[],
                        details:chartValidation.userRequirement,
                        response:response
                    }
                    ] as any).select();
                    
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