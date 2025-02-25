<template>
  <div v-if="isConversationResponse(conversation)">
    <q-btn :disable="is_loading" :loading="is_loading" :icon="get_audio_icon"
       @click="onPlayClick(conversation)" size="1ch" text-color="white" round unelevated color="transparent">

     </q-btn>
     <audio @pause="onPauseAudio" v-if="isConversationWithVoiceDefined(conversation)"
     ref="audio_element" :src="conversation.voice.rvc_tts.url" class="tw-hidden">
     </audio>

  </div>


</template>

<script setup lang="ts">
import { computed, ref, ShallowRef, useTemplateRef } from 'vue';
import { AudioIcons, ChatBotRoles, Conversation, ConversationProps, ConversationResponse, ConversationWithVoice, MinioItemResponse, VoiceState } from '../models';
import { postConversationVoice } from 'src/service/post';
import { isConversationResponse, isConversationWithVoiceDefined } from '../helper';


const props=defineProps<ConversationProps>()
const emit=defineEmits<{
  updated_voice: [id: string,voice: ConversationWithVoice]
}>()
let audio_element=useTemplateRef('audio_element')
let is_loading=ref(false)
let is_playing=ref(false)


const get_audio_icon=computed(()=>is_playing.value ? AudioIcons.STOP : AudioIcons.IDLE)



function onPauseAudio()
{

  is_playing.value=false
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
  audio_element.value.pause()
  audio_element.value.currentTime=0

}

async function playAudio()
{
  if(audio_element.value==null)
  {
    return;
  }
  is_playing.value=true
  await audio_element.value.play()
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
  const need_setup_new_audio=(isConversationWithVoiceDefined(conversation) && isVoiceExpired(conversation.voice.rvc_tts))
  || conversation.voice==null
  if(need_setup_new_audio)
  {
    await setupNewAudio(conversation._id)

  }








  await playAudio()



}
async function setupNewAudio(id : string)
{
  try{
    is_loading.value=true
    const response=await postConversationVoice(id)

    emit('updated_voice',id,response)





  }catch(e)
  {
    console.error(e)

  }finally{
    is_loading.value=false
  }

}
</script>
