<template>
    <q-input :class="$attrs['class']" clearable  :loading="is_transcribing"
    label="Transcribed Text" class="q-mt-xl" disable filled bg-color="white" v-model="transcription" autogrow type="textarea">

    </q-input>
</template>

<script setup lang="ts">
import {ref,watch,onMounted} from 'vue'
import {chatgpt} from 'src/service/index'
const props=defineProps<{data: string}>()

let transcription=ref()
let is_transcribing=ref(false)
onMounted(async()=>{
  await transcribeText()

  watch(props,async(old,new_value)=>{

    await transcribeText()
  })

})

async function transcribeText()
{
  try{
    is_transcribing.value=true
    const file=base64ToFile(props.data,'audio.wav')
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
