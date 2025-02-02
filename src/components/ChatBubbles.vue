<template>
  <div class="tw-relative q-mb-lg">

    <audio ref="audio_element" :src="audio_src" class="tw-hidden">

    </audio>

    <q-scroll-area id="conversationArea" ref="scroll_area" class="q-pa-md q-pt-none"  style="height: 85vh; width: 100%;">
      <q-infinite-scroll  :offset="20" @load="loadConversations" :initial-index="0" reverse >
      <div  class="row justify-center q-mt-lg tw-w-full tw-flex-wrap">
        <div    >

          <q-chat-message v-for="item of conversations"
            :sent="isUserTurn(item)"

            :text-color="isUserTurn(item) ? 'black' : 'white'"
            :bg-color="getChatBgColor(item)"

          >

          <template #avatar>
            <img  class="q-message-avatar q-message-avatar--sent" width="64px" height="64px" :src="getAvatar(item)" >

            </img>
          </template>
          <template #name>
            <span class="text-white tw-text-[1.25em]"> {{getName(item)}}</span>

          </template>
          <div>

            <div class="tw-w-full tw-h-full"   v-if="('content' in item) && !isSendingMessage(item)">
              <q-icon class="q-mr-md" size="2em" color="white" name="bi-exclamation-circle-fill"  v-if="isError(item.content)"></q-icon>
              <span class="tw-text-[1.25em]" >{{getContent(item.content)}}</span>

            </div>

            <q-spinner-dots v-if="isSendingMessage(item)" size="2em" />
            <div class="tw-w-full tw-items-center tw-flex tw-justify-between q-mt-sm">
              <span v-if="'created_at' in item"
              :class="isUserTurn(item) ? 'text-black' : 'text-white' " class="tw-text-[0.9em] tw-opacity-[0.8]">{{ getTimeStamp(item) }}</span>

              <q-btn v-if="item.role=='assistent'&& '_id' in item" @click="playSpeech(item._id)" size="1ch" text-color="white" round icon="bi-volume-up-fill" unelevated color="transparent">

              </q-btn>

            </div>
          </div>









          </q-chat-message>


      </div>











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
import {PendingConversation, Conversation, ChatBotRoles, ChatNames, ConversationResponse} from 'src/components/models'
import { notification } from 'src/service';
import { getConversations } from 'src/service/get';
import { postConversation, promptLLM } from 'src/service/post';
import { onMounted, ref } from 'vue';
import { scroll } from 'quasar';
import { off } from 'process';
import { Page } from 'openai/pagination.mjs';
let audio_src=ref()
let audio_element=ref<HTMLAudioElement>()
let scroll_area=ref<QScrollArea>()

let is_fetching_conversation=ref(false)
let conversations=ref<Conversation[] >([])





function getTimeStamp(item : ConversationResponse)
{

  const new_date=new Date(item.created_at)
  return new_date.toLocaleString('pt-BR')
}

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
    AppendLastConversationContent(decoded_response)



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

function getContent(content: Conversation['content'])
{
  if(content!=undefined)
  {
    return typeof content==='string' ? content : content.error
  }
}

function AppendLastConversationContent(new_contet: string)
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


function isSendingMessage(item : Conversation)
{
  return 'is_loading' in item && item.is_loading
}


function isUserTurn(item : Conversation)
{
  return item.role!=ChatBotRoles.ASSISTENT
}
function getName(item : Conversation)
{
  return item.role==ChatBotRoles.ASSISTENT ? ChatNames.ASSISTENT:  ChatNames.USER
}

function getAvatar(item: Conversation)
{
  return item.role==ChatBotRoles.ASSISTENT ? 'icons/Shiroko_Icon.webp' : 'https://www.gravatar.com/avatar'
}

async function playSpeech(id : string)
{

}


</script>
