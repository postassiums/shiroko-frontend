<template>

  <div class="tw-relative q-mb-lg">


    <q-scroll-area id="conversationArea" ref="scroll_area" class="q-pa-md q-pt-none"
     style="height: 85vh; width: 100%;">
      <q-infinite-scroll  :offset="20" @load="loadConversations" :initial-index="0" reverse >
      <div  >


          <q-chat-message v-for="item of conversations"
            :sent="isUserTurn(item)"

            :text-color="isUserTurn(item) ? 'black' : 'white'"
            :bg-color="getChatBgColor(item)"

          >

          <template #avatar>
            <Avatar :conversation="item">

            </Avatar>
          </template>
          <template #name>
            <Name :conversation="item">

            </Name>


          </template>
          <div>
            <Content :conversation="item">

            </Content>

            <div class="tw-w-full tw-items-center tw-flex tw-justify-between q-mt-sm">
              <TimeStamp v-if="'created_at' in item" :conversation="item">

              </TimeStamp>
              <AudioComponent @updated_voice="onVoiceUpdated" :conversation="item">

              </AudioComponent>



            </div>
          </div>









          </q-chat-message>














      </div>
      <template #loading>
        <div  class=" tw-flex tw-justify-center q-mt-md ">
          <q-spinner  color="blue" size="5em">

          </q-spinner>

        </div>

      </template>
      </q-infinite-scroll>
    </q-scroll-area>
  </div>

</template>

<script setup lang="ts">
import { parse } from 'path';
import { QScrollArea } from 'quasar';
import {PendingConversation, Conversation, ChatBotRoles, ChatNames, ConversationResponse, VoiceState, VoiceResponse, ConversationWithVoice} from 'src/components/models'
import { notification } from 'src/service';
import Avatar from './Avatar.vue';
import Name from './Name.vue';
import Content from './Content.vue';
import { getConversations, getConversations as postConversationAudio } from 'src/service/get';
import { postConversation, promptLLM } from 'src/service/post';
import { onMounted, Ref, ref } from 'vue';
import TimeStamp from './TimeStamp.vue';
import AudioComponent from './AudioComponent.vue';
import { isConversationResponse } from '../helper';


let scroll_area=ref<QScrollArea>()

let is_fetching_conversation=ref(false)
let conversations=ref<Conversation[] >([])

const emit=defineEmits<{answered: []}>()





function scrollToBottom()
{

  const element=scroll_area.value?.getScrollTarget()
  const position=scroll_area.value?.getScrollPosition()
  if(element==undefined || position==undefined)
  {
    return
  }
  const scroll_height=element.scrollHeight
  scroll_area.value?.setScrollPosition('vertical',scroll_height,100)
}

defineExpose({addUserBubble,addShirokoBubble})

function getChatBgColor(item : Conversation)
{
  return isError(item.content) ? 'red-10' : isUserTurn(item) ? 'white' : 'primary'
}

function addConversation(new_conversation : Conversation)
{
  conversations.value.push(new_conversation)
}

async function putLLMConversationBitByBit(reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>): Promise<PendingConversation | undefined>
{
  let done=false
  let value=undefined
  while(true)
  {
    ({done,value}=await reader.read())
    if(value==undefined || done)
    {
      break
    }
    const decoder=new TextDecoder("utf-8");
    const response=new Uint8Array(value)
    const decoded_response=decoder.decode(response)
    appendLastConversationContent(decoded_response)



  }
  return conversations.value[conversations.value.length-1]
}

async function addShirokoBubble(prompt : string)
{
  const new_conversation : PendingConversation={role: ChatBotRoles.ASSISTENT,is_loading: true}
  addConversation(new_conversation)
  scrollToBottom()
  try{
    const response=await promptLLM(prompt)
    changeLastConversation({...new_conversation,is_loading: false,content: ''})
    const last_conversation=await putLLMConversationBitByBit(response.getReader())
    if(last_conversation==undefined)
    {
      console.warn('Last conversation was null')
      return
    }
    const conversation_with_id=await postConversation({...last_conversation})
    changeLastConversation(conversation_with_id)
    scrollToBottom()

  }catch(e)
  {
    setErrorMessageToLastConversation(new_conversation)
    console.error(e)
  }
  emit('answered')


}

function setErrorMessageToLastConversation(new_conversation : Conversation)
{
  changeLastConversation({...new_conversation,content: {error: 'An unexpected error occored, please try again later'},is_loading: false})
}

async function addUserBubble(prompt : string)
{
  const pending_conversation : PendingConversation={is_loading: true,role: ChatBotRoles.USER,content: prompt}
  addConversation(pending_conversation)
  scrollToBottom()
  try{
    const conversation_with_id=await postConversation(pending_conversation)
    changeLastConversation(conversation_with_id)

  }catch(e)
  {
    console.error(e)
    setErrorMessageToLastConversation(pending_conversation)
  }
}

function isError(content : Conversation['content'])
{
  return content!=undefined && typeof content!=='string' && 'error' in content
}


function appendLastConversationContent(new_contet: string)
{
  const last_index=conversations.value.length-1
  if(conversations.value[last_index]!=undefined)
  {
    conversations.value[last_index].content+=new_contet
  }
}

function changeLastConversation(new_conversation : Conversation)
{
  const target_index=conversations.value.length
  conversations.value[target_index==0 ? 0 : target_index-1]={...new_conversation}
}

function onVoiceUpdated(id : string,new_response : ConversationWithVoice)
{
  const found_index=conversations.value.findIndex(item=>isConversationResponse(item) ? item._id==id : false)
  if(found_index==-1)
  {
    console.warn('Conversation was not found, not updating')
    return
  }
  conversations.value.splice(found_index,1,new_response)
}

async function loadConversations(page=1,done : (stop : boolean)=>void)
{
  try{
    const LIMIT=25
    is_fetching_conversation.value=true
    const response=await getConversations(page,LIMIT)
    conversations.value.unshift(...response.data)
    done(response.remaining_pages==0)
    if(page==1)
    {
      scrollToBottom
    }


  }catch(e)
  {
    notification('An unexpected errors occored','negative')
    console.error(e)
  }finally{
    is_fetching_conversation.value=false

  }
}




function isUserTurn(item : Conversation)
{
  return item.role!=ChatBotRoles.ASSISTENT
}













</script>
