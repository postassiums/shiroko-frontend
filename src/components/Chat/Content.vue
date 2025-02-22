<template>
  <div class="tw-w-full tw-h-full"   v-if="('content' in conversation) && !is_sending_message">
    <q-icon class="q-mr-md" size="2em" color="white" name="bi-exclamation-circle-fill"  v-if="is_error"></q-icon>
    <span class="tw-text-[1.25em]" >{{get_content}}</span>

  </div>

  <q-spinner-dots v-if="is_sending_message" size="2em" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ConversationProps } from '../models';

const props=defineProps<ConversationProps>()

const get_content=computed(()=>typeof props.conversation.content==='string' ? props.conversation.content : props.conversation.content.error)

const is_sending_message=computed(()=>'is_loading' in props.conversation && props.conversation.is_loading)

const is_error=computed(()=>props.conversation.content!=undefined &&
typeof props.conversation.content!=='string' && 'error' in props.conversation.content)



</script>
