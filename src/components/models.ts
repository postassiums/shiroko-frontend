import { Chat } from "openai/resources/index.mjs"

export enum ChatNames{
  USER='Me',
  ASSISTENT='Sunnaokami Shiroko'
}

export enum ChatBotRoles{
  ASSISTENT='assistent',
  USER='user',
  DEVELOPER='developer'

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

}







export interface PaginatedResponse<T>{
  total_documents: number
  remaining_pages: number
  count_remaining_items : number
  data: T[]
}
