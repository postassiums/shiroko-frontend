<template>
  <q-page padding >
    <SpeechContainer @speech_end="transcribeText" >

    </SpeechContainer>
    <q-input clearable  :loading="is_transcribing"
    label="Transcribed Text" class="q-mt-xl" disable filled bg-color="white" v-model="transcription" autogrow type="textarea">

    </q-input>

  </q-page>



</template>

<script setup lang="ts">
import SpeechContainer from 'src/components/SpeechContainer.vue';
import { chatgpt } from 'src/service';
import { ref } from 'vue';

let transcription=ref()
let is_transcribing=ref(false)

async function transcribeText(audio : Float32Array<ArrayBufferLike>,base64 : string )
{
  try{
    is_transcribing.value=true
    const file=base64ToFile(base64,'audio.wav')
    const response=await chatgpt().audio.transcriptions.create({model: 'whisper-1',file})
    transcription.value=response.text

  }catch(e)
  {
    console.error(e)
  }finally{
    is_transcribing.value=false
  }

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
