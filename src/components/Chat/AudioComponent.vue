<template>
  <div >
    <q-btn :disable="is_loading" :loading="is_loading" :icon="get_audio_icon"
       @click="onPlayClick(conversation)" size="1ch" text-color="white" round unelevated color="transparent">

     </q-btn>
     <audio @ended="onFinishedPlayingAudio($event)"   @pause="onPauseAudio" v-if="isConversationWithVoiceDefined(conversation)"
     ref="audio_element" :src="current_url" class="tw-hidden">
     </audio>

  </div>


</template>

<script setup lang="ts">
import { computed, ref, ShallowRef, useTemplateRef } from 'vue';
import { AudioIcons, ChatBotRoles, Conversation, ConversationProps, ConversationResponse, ConversationWithVoice, MinioItemResponse } from '../models';
import { postConversationVoice } from 'src/service/post';
import { isConversationResponse, isConversationWithVoiceDefined } from '../helper';


const props=defineProps<{conversation: ConversationResponse}>()
const emit=defineEmits<{
  updated_voice: [id: string,voice: ConversationWithVoice]
}>()
let audio_element=useTemplateRef('audio_element')
let current_audio_index=ref(0)
let is_loading=ref(false)
let is_playing=ref(false)
let current_url=ref(String(props.conversation.voice?.parts[0]?.url))

const get_audio_icon=computed(()=>is_playing.value ? AudioIcons.STOP : AudioIcons.IDLE)



function onPauseAudio()
{

  is_playing.value=false
}



function onFinishedPlayingAudio(event : Event)
{

  if(!is_playing.value)
  {
    return
  }
  if(!isConversationWithVoiceDefined(props.conversation))
  {
    return
  }
  if(  props.conversation.voice.total_parts>=current_audio_index.value)
  {
    resetAudioIndex()
    changeAudioUrl()
    stopAudio()
    return

  }
  incrementAudioIndex()
  changeAudioUrl()
}

function isVoiceExpired(voice : MinioItemResponse){
  let today=new Date()

  const expired_at=new Date(voice.expires_at)
  return today>=expired_at

}


function stopAudio()
{
  if(audio_element.value==null)
  {
    return
  }
  is_playing.value=false
  if(audio_element.value==undefined)
  {
    return
  }
  audio_element.value.pause()
  audio_element.value.autoplay=false
  audio_element.value.currentTime=0

}

async function playAudio()
{
  if(audio_element.value==null)
  {
    return;
  }
  is_playing.value=true

  if(audio_element.value==undefined)
  {
    return
  }
  audio_element.value.autoplay=true
  await audio_element.value.play()
  if(!(isConversationResponse(props.conversation) && isConversationWithVoiceDefined(props.conversation)))
  {
    return
  }

}
function resetAudioIndex()
{

  current_audio_index.value=0
}

function incrementAudioIndex()
{
  current_audio_index.value++

}

function changeAudioUrl()
{
  if(!isConversationWithVoiceDefined(props.conversation))
  {
    return
  }
  let current_part=props.conversation.voice.parts[current_audio_index.value]
  current_url.value=String(current_part?.url)
}


function getCurrentVoicePart()
{
  if(!isConversationWithVoiceDefined(props.conversation))
  {
    return
  }
  return props.conversation.voice.parts[current_audio_index.value]
}

async function onPlayClick(conversation : ConversationResponse)
{
  if(is_loading.value)
  {
    return;
  }

  if(is_playing.value)
  {
    stopAudio()
    return
  }
  let current_part=getCurrentVoicePart()
  if(current_part==undefined)
  {
    console.warn('Current audio part is undefined')
    return
  }
  const need_setup_new_audio=(!isConversationWithVoiceDefined(props.conversation)) ||  isVoiceExpired(current_part)

  if(need_setup_new_audio)
  {
    //await setupNewAudio(conversation._id)

  }








  await playAudio()



}
async function setupNewAudio(id : string)
{
  try{
    is_loading.value=true
    const audio_websocket=new WebSocket(`ws://${process.env.API_URL}/conversations/${id}/voice/ws`)
    audio_websocket.addEventListener('message',(event)=>{
      const data=event.data
      console.log(data)


    })

    // emit('updated_voice',id,response)





  }catch(e)
  {
    console.error(e)

  }finally{
    is_loading.value=false
  }

}
</script>
