<template>
  <q-page class="q-pb-none" padding >
    <div >
      <ChatBubbles ref="chat_bubbles"  >


      </ChatBubbles>
      <ChatInput @enter="onSendPrompt">

      </ChatInput>

    </div>



  </q-page>



</template>

<script setup lang="ts">



import ChatInput from 'src/components/ChatInput.vue';

import ChatBubbles from 'src/components/ChatBubbles.vue';

import { ref } from 'vue';



let chat_bubbles=ref<InstanceType<typeof ChatBubbles>>()




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
