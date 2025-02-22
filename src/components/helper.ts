import { Conversation, ConversationResponse, ConversationWithVoice } from "./models";

export function isConversationResponse(conversation : Conversation) : conversation is ConversationResponse
{
  return conversation.role=='assistent'&& '_id' in conversation
}

export function isConversationWithVoiceDefined(conversation : ConversationResponse) : conversation is ConversationWithVoice
{
  return 'voice' in conversation && conversation.voice!=null
}


