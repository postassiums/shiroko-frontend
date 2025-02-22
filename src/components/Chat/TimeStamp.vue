<template>
  <span
  :class="text_color" class="tw-text-[0.9em] tw-opacity-[0.8]">{{ get_timestamp }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChatBotRoles, ConversationResponse } from '../models';

const props=defineProps<{conversation: ConversationResponse}>()

const get_timestamp=computed(()=>(new Date(props.conversation.created_at).toLocaleDateString('pt-BR')))

const is_user_turn=computed(()=>props.conversation.role!=ChatBotRoles.ASSISTENT)

const text_color=computed(()=>is_user_turn.value ? 'text-black' : 'text-white')

</script>
