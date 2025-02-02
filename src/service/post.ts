import { api } from "src/boot/axios";
import { ConversationResponse, PendingConversation } from "src/components/models";


export async function promptLLM(text: string)
{
  const response=await api.post<ReadableStream<Uint8Array<ArrayBufferLike>>>('/conversations/shiroko',{ text},{responseType: 'stream'})
  return response.data
}

export async function postConversation(new_conversation : PendingConversation)
{
  delete new_conversation.is_loading
  const response=await api.post<ConversationResponse>('/conversations',{...new_conversation})
  return response.data
}
