<template>
  <q-page padding >
    <div class="tw-flex tw-items-center">
      <SpeechContainer @speech_end="onSpeechStop" >

      </SpeechContainer>

      <ShareScreenButton>

      </ShareScreenButton>

    </div>


    <ChatBubbles v-if="conversations.length>0" :conversations="conversations">

    </ChatBubbles>

  </q-page>



</template>

<script setup lang="ts">
import TranscriptionInput from 'src/components/TranscriptionInput.vue';
import SpeechContainer from 'src/components/SpeechContainer.vue';
import { chatgpt } from 'src/service';
import { ref } from 'vue';
import { Conversation } from 'src/components/models';
import ChatBubbles from 'src/components/ChatBubbles.vue';
import ShareScreenButton from 'src/components/ShareScreenButton.vue';


let conversations=ref<Conversation[]>([])


async function onSpeechStop(audio : Float32Array<ArrayBufferLike>,base64 : string )
{
  try{
    conversations.value.push({agent: 'me',is_loading: true})
    const user_text=await transcribeText(base64)
    conversations.value.pop()
    conversations.value.push({agent: 'me',message: user_text,is_loading: false})
  }catch(e)
  {
    conversations.value.pop()
    console.error(e)

  }


}

async function transcribeText(base64: string)
{

  const file=base64ToFile(base64,'audio.wav')
  const response=await chatgpt().audio.transcriptions.create({model: 'whisper-1',file})
  return response.text




}

function base64ToFile(base64_file : string, fileName : string) {


  const mime_type='audio/wav'


  const byteString = atob(base64_file);


  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }


  return new File([byteArray], fileName, { type: mime_type });
}


</script>
