import { Chat } from "openai/resources/index.mjs"
import { Ref } from "vue"

export enum ChatNames{
  USER='Me',
  ASSISTENT='Sunnaokami Shiroko'
}

export enum ChatBotRoles{
  ASSISTENT='assistent',
  USER='user',
  DEVELOPER='developer'

}

export enum AudioIcons{
  IDLE='bi-volume-up-fill',
  STOP='bi-stop-circle'
}


export interface VoiceState{
  is_loading: boolean
  is_playing: boolean
}
export interface VoiceResponse{
  normal_tts: MinioItemResponse
  rvc_tts: MinioItemResponse
}
export interface MinioItemResponse{
  url: string
  expires_at : string


}




type ChatContent= string | {error: string}


export interface ID{
  _id: string
}
export interface TimeStamp{
  created_at: string
  updated_at: string
}
export interface PendingConversation{
  role: ChatBotRoles
  content?: ChatContent
  is_loading?: boolean

}
export type Conversation=(PendingConversation | ConversationResponse )

export interface ConversationResponse extends ID,TimeStamp,NonNullable<Pick<PendingConversation,'content' | 'role'>>{
  voice: VoiceResponse | null

}
export interface ConversationProps{
  conversation: Conversation
}

export interface ConversationWithVoice extends ConversationResponse{
  voice: VoiceResponse

}







export interface PaginatedResponse<T>{
  total_documents: number
  remaining_pages: number
  count_remaining_items : number
  data: T[]
}
