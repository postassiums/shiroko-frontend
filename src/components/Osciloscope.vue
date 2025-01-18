<template>
  <canvas  :width="WIDTH" :height="HEIGHT" ref="canvas">

  </canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props=defineProps<{deviceId: string }>()
const WIDTH=250
const HEIGHT=100
let canvas=ref()
const canvas_context=ref<CanvasRenderingContext2D>(canvas.value?.getContext('2d'))
const audio_context=new AudioContext()
const audio_analyzer=audio_context.createAnalyser()
let source : MediaStreamAudioSourceNode
let visual : number



onMounted(async()=>{

  await updateAudioAnalyzer()
  canvas_context.value=canvas.value.getContext('2d')
  draw()







})
defineExpose({updateAudioAnalyzer,resetAnimation})

function resetAnimation()
{
  cancelAnimationFrame(visual)
  draw()
}

async function updateAudioAnalyzer()
{
  const media=await navigator.mediaDevices.getUserMedia({audio: {deviceId: props.deviceId}})
  if(source!=undefined)
  {
    source.disconnect(audio_analyzer)
  }
  source=audio_context.createMediaStreamSource(media)
  source.connect(audio_analyzer)

}

function resetCanvas()
{

  canvas_context.value.clearRect(0, 0, WIDTH, HEIGHT);
  canvas_context.value.fillStyle = "rgb(200, 200, 200)";
  canvas_context.value.fillRect(0, 0, WIDTH, HEIGHT);
  canvas_context.value.fillStyle="rgb(0 0 0)"
  canvas_context.value.lineWidth=2
}

function draw() {

  const buffer_length=audio_analyzer.frequencyBinCount
  const data_array=new Uint8Array(audio_analyzer.frequencyBinCount)
  audio_analyzer.getByteTimeDomainData(data_array);
  if(canvas_context.value==undefined)
  {
    cancelAnimationFrame(visual)
    return
  }
  visual=requestAnimationFrame(draw)
  canvas_context.value.beginPath();

  resetCanvas()

  const sliceWidth = (WIDTH * 1.0) / buffer_length;
  let x = 0;

  for (let i = 0; i < buffer_length; i++) {
    const v = data_array[i] / 128.0;
    const y = (v * HEIGHT) / 2;

    if (i === 0) {
      canvas_context.value.moveTo(x, y);
    } else {
      canvas_context.value.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvas_context.value.lineTo(WIDTH, HEIGHT / 2);
  canvas_context.value.stroke();
};

</script>
