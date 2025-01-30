<template>
  <q-btn class="q-ml-lg" rounded unelevated text-color="black" color="white" @click="shareScreen" icon="bi-window-fullscreen" >

  </q-btn>
</template>

<script setup lang="ts">
import { notification } from 'src/service';

async function shareScreen()
{
  try{
    const stream=await navigator.mediaDevices.getDisplayMedia({audio: {echoCancellation: true,noiseSuppression: true},

    video:{displaySurface: 'monitor'}
    })

  }catch(e)
  {
    console.error(e)
    notification('Permission denied','negative')
  }
}
</script>
