import { api } from "src/boot/axios";
import { ConversationResponse, PaginatedResponse } from "src/components/models";


export async function getConversations(page =1,limit=50)
{
  const response= await api.get<PaginatedResponse<ConversationResponse>>('/conversations',{params: {page,limit}})
  return response.data
}

export async function getAudioFromConversation(id : string)
{
  const response=await api.get(`/conversations/audio/${id}`,{responseType: 'stream'})
  return response.data
}

