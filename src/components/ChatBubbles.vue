<template>
  <div class="q-pa-md row justify-center q-mt-lg">
    <div style="width: 100%; max-width: 400px" >
      <q-chat-message v-for="item of conversations"
        :sent="isSent(item)"
        text-color="white"
        :avatar="getAvatar(item)"
        bg-color="primary"
      >
      <template #name>
        <span class="text-white"> {{getName(item)}}</span>

      </template>
      <span v-if="!item.is_loading">{{item.message}}</span>
      <q-spinner-dots v-if="item.is_loading" size="2em" />




      </q-chat-message>


    </div>
  </div>
</template>

<script setup lang="ts">
import {Conversation} from 'src/components/models'
const props=defineProps<{conversations: Conversation[]}>()

function isSent(item : typeof props.conversations[0])
{
  return item.agent=='shiroko'
}
function getName(item : typeof props.conversations[0])
{
  return item.agent=='me' ? 'Me' : 'Sunnaokami Shiroko'
}

function getAvatar(item: typeof props.conversations[0])
{
  return item.agent=='shiroko' ? 'icons/Shiroko_Icon.webp' : undefined
}


</script>
