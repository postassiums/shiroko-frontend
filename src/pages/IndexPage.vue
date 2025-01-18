<template>
  <q-page padding >
    <Osciloscope ref="osciloscope" v-if="device_id!=undefined" :device-id="device_id">

    </Osciloscope>
    <Microphone @microphone_update="onSelectNewMicrophone" ></Microphone>

  </q-page>



</template>

<script setup lang="ts">
import Microphone from 'src/components/Microphone.vue';
import Osciloscope from 'src/components/Osciloscope.vue';
import { ref, useTemplateRef } from 'vue';
let device_id=ref<string>()
let osciloscope=useTemplateRef('osciloscope')

async function onSelectNewMicrophone(new_value : MediaDeviceInfo)
{
  device_id.value=new_value.deviceId
  await osciloscope.value?.updateAudioAnalyzer()
  //osciloscope.value?.resetAnimation()
}

</script>
