<template>
  <q-page class="q-pb-none" padding >
    <div >
      <ChatBubbles @answered="onFinishedAnswering" ref="chat_bubbles"  >


      </ChatBubbles>
      <ChatInput ref="chat_input" @enter="onSendPrompt">

      </ChatInput>

    </div>



  </q-page>



</template>

<script setup lang="ts">



import ChatInput from 'src/components/ChatInput.vue';

import ChatBubbles from '../components/Chat/ChatBubbles.vue';

import { ref, useTemplateRef } from 'vue';


let chat_bubbles=useTemplateRef('chat_bubbles')

let chat_input=useTemplateRef('chat_input')

function onFinishedAnswering()
{
  chat_input.value?.reactivateInput()
}

async function onSendPrompt(prompt : string)
{
  if(chat_bubbles.value==undefined)
  {
    console.warn('Component chatbubbles was not initialized')
    return
  }
  await chat_bubbles.value.addUserBubble(prompt)
  await chat_bubbles.value.addShirokoBubble(prompt)


}




</script>
