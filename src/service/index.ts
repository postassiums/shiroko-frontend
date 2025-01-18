import OpenAI from "openai";
import { Notify } from "quasar";


export function notification(message: string,type: 'negative' | 'positive' | 'warning'='positive')
{
	Notify.create({message,type,progress: true,
    actions:[{icon: 'close',round: true,color: 'white'}],timeout: 5000,position: 'top'})
}


export function chatgpt()
{
  const openai=new OpenAI({apiKey: process.env.OPENAI_KEY,dangerouslyAllowBrowser: true})

  return openai
}
