<template>


  <div class="tw-px-[3em] tw-flex tw-items-center tw-flex-wrap tw-justify-between">
    <q-input autofocus borderless :class="$attrs['class']" @keydown.enter.prevent="onSendPrompt" type="textarea"  input-class="tw-text-white"
     class="tw-bg-slate-500 tw-basis-[95%]" outlined v-model.trim="prompt" autogrow >
      <template  #append>
        <q-btn unelevated @click="onSendPrompt" :disable="is_input_empty || is_disabled" round text-color="black" color="white" icon="bi-send">

        </q-btn>

      </template>
      <template #prepend>
        <q-btn unelevated round text-color="black" color="white" icon="bi-plus">
          <q-menu v-model="show_more_options">
            <q-list style="min-width: 100px">

              <q-item clickable v-close-popup>
                <q-item-section avatar >
                  <q-icon name="bi-file-earmark-plus-fill" ></q-icon>
                </q-item-section>
                <q-item-section>Adicionar Arquivo</q-item-section>
              </q-item>
            </q-list>
          </q-menu>

        </q-btn>
      </template>
     </q-input>

     <q-btn text-color="black" color="white" round unelevated icon="bi-telephone-fill">

    </q-btn>

  </div>


</template>

<script setup lang="ts">

import { computed, ReactiveEffect, ref } from 'vue';


const prompt=ref<string>('')
const show_more_options=ref(false)
const emit=defineEmits<{enter : [text: string]}>()
const is_input_empty=computed(()=>prompt.value.length<=0)
const is_disabled=ref(false)



function reactivateInput()
{
  is_disabled.value=false
}

defineExpose({reactivateInput})

async function onSendPrompt()
{
  if(is_input_empty.value || is_disabled.value)
  {
    console.warn('Input is disabled')
    return
  }
  emit('enter',prompt.value)
  prompt.value=''
  is_disabled.value=true
}

</script>
