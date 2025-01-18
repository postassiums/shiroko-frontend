<template>
  <q-page padding >
    <SpeechContainer @speech_end="setupTranscription" >

    </SpeechContainer>
    <TranscriptionInput v-if="base64_data!=undefined" :data="base64_data" >

    </TranscriptionInput>

  </q-page>



</template>

<script setup lang="ts">
import TranscriptionInput from 'src/components/TranscriptionInput.vue';
import SpeechContainer from 'src/components/SpeechContainer.vue';
import { chatgpt } from 'src/service';
import { ref } from 'vue';

let base64_data=ref()

async function setupTranscription(audio : Float32Array<ArrayBufferLike>,base64 : string )
{
  base64_data.value=base64

}




</script>
