<template>
  <div class="tw-flex tw-items-center">

    <Microphone @speech_end="setupOutputAudio" class="q-mr-xl" @microphone_update="onSelectNewMicrophone" ></Microphone>
    <Osciloscope ref="osciloscope" v-if="device_id!=undefined" :device-id="device_id">

    </Osciloscope>

    <audio class="q-ml-xl" controls :src="audio_output">

    </audio>

  </div>





</template>

<script setup lang="ts">
import { utils } from '@ricky0123/vad-web';
import Microphone from 'src/components/Microphone.vue';
import Osciloscope from 'src/components/Osciloscope.vue';
import { ref, useTemplateRef } from 'vue';
let device_id=ref<string>()
let osciloscope=useTemplateRef('osciloscope')
let audio_output=ref()
const emit=defineEmits<{speech_end: [data : Float32Array<ArrayBufferLike>,base64: string  ]}>()

function setupOutputAudio(data: Float32Array<ArrayBufferLike>)
{
    const wav_buffer=utils.encodeWAV(data)
    const base64=utils.arrayBufferToBase64(wav_buffer)
    audio_output.value=`data:audio/wav;base64,${base64}`
    emit('speech_end',data,base64)
}

async function onSelectNewMicrophone(new_value : MediaDeviceInfo)
{
  device_id.value=new_value.deviceId
  await osciloscope.value?.updateAudioAnalyzer()
  osciloscope.value?.resetAnimation()
}

</script>
