export interface Conversation{
  created_at?: string
  agent: 'me' | 'shiroko'
  is_loading: boolean
  message?: string

}
