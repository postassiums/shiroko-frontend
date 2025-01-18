<template>
  <div class="tw-relative">
    <q-btn-dropdown
          split
          push
          :color="mic_bg_color"
          :text-color="mic_fg_color"
          size="2em"
          no-caps
          icon="bi-mic"
          :class="$attrs['class']"
          :disable-main-btn="selected_microphone==undefined"
          @update:model-value="onToggleMenu"
          @click="toggleMicrophone"
        >

          <q-list>
            <q-item  @click="selectMicrophone(item)" clickable v-close-popup v-for="item of microphones_options">
              <q-item-section v-if="item.deviceId==selected_microphone?.deviceId" avatar>
                <q-icon name="bi-check2" color="black">

                </q-icon>
              </q-item-section>
              <q-item-section>

                <q-item-label>
                  {{ item.label }}
                </q-item-label>
              </q-item-section>
            </q-item>



          </q-list>
        </q-btn-dropdown>

  </div>

<!--
<q-btn @click="toggleMicrophone"  size="2em"  round :color="mic_bg_color"  :text-color="mic_fg_color" icon="bi-mic">
  <q-badge class="tw-opacity-70 tw-bg-red-500 tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-inset-2 tw-rounded-full tw-z-10" rounded  ></q-badge>
</q-btn> -->
</template>

<script setup lang="ts">
import {  notification } from 'src/service';
import { computed, onMounted, ref, watch } from 'vue';
import { MicVAD } from '@ricky0123/vad-web';
let is_speaking=ref(false)
let is_using_microphone=ref(false)
let selected_microphone=ref<MediaDeviceInfo>()
let microphones_options=ref<MediaDeviceInfo[]>([])
const emit=defineEmits<{speech_end: [audio: Float32Array<ArrayBufferLike> ],microphone_update : [new_value: MediaDeviceInfo]}>()
let vad : MicVAD


onMounted(async()=>{
  await getMicrophoneStream()
  await setupMicrophonesOptions()
  await initializeVad()
  await selectFirstAvailableMicrophone()




})
const mic_bg_color=computed(()=>  is_using_microphone.value ? is_speaking.value ? 'blue' : 'red' : 'white')
const mic_fg_color=computed(()=>is_using_microphone.value ? 'white' : 'black')

async function initializeVad()
{
  vad=await MicVAD.new({

    // additionalAudioConstraints:{
    //   sampleRate: 2400
    // },

  onSpeechStart: ()=> {
    is_speaking.value=true
  },

  onSpeechEnd: async (audio) =>{

    emit('speech_end',audio)

    is_speaking.value=false
  },})
}
async function selectFirstAvailableMicrophone()
{
  const first_option=microphones_options.value[0]
  if(first_option!=undefined)
  {
    await selectMicrophone(first_option)
  }
}

async function setupMicrophonesOptions()
{
  try{
    const microphones=await navigator.mediaDevices.enumerateDevices()
    microphones_options.value=microphones.filter(device=>device.kind=='audioinput')

  }catch(e)
  {
    console.error(e)
    notification('Failed to get available devices','negative')
  }
}

async function selectMicrophone(new_microphone : MediaDeviceInfo)
{
  selected_microphone.value=new_microphone
  emit('microphone_update',selected_microphone.value)
  vad.options.stream=await getMicrophoneStream()
}

async function onToggleMenu(model : boolean)
{
  if(!model)
  {
    return
  }
  await setupMicrophonesOptions()
}

async function toggleMicrophone()
{
  is_using_microphone.value=!is_using_microphone.value
  if(!is_using_microphone.value)
  {
    const mic_stream=await getMicrophoneStream()
    mic_stream.getAudioTracks().forEach(track=>track.enabled=false)
    vad.pause()
    return
  }
  const mic_stream=await getMicrophoneStream()
  vad.start()
  mic_stream.getAudioTracks().forEach(track=>track.enabled=true)
}

async function getMicrophoneStream(deviceId=selected_microphone.value?.deviceId )
{
  let options : MediaStreamConstraints ={audio: true}
  if(deviceId!=undefined)
  {
    options.audio={deviceId}
  }
  return await navigator.mediaDevices.getUserMedia(options)
}


</script>
