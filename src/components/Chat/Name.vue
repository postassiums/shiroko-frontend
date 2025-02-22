<template>
  <span class="text-white tw-text-[1.25em]"> {{get_name}}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChatBotRoles, ChatNames, ConversationProps } from '../models';

const get_name=computed(()=>props.conversation.role==ChatBotRoles.ASSISTENT ? ChatNames.ASSISTENT:  ChatNames.USER)

const props=defineProps<ConversationProps>()
</script>
