<template>
   <img  :class="{'q-message-avatar--sent': is_user_turn}"
   class="q-message-avatar " width="48px" height="48px" :src="get_src" >

</img>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChatBotRoles, Conversation, ConversationProps } from '../models';

const get_src=computed(()=>props.conversation.role==ChatBotRoles.ASSISTENT ? 'icons/Shiroko_Icon.webp' : 'https://www.gravatar.com/avatar')

const is_user_turn=computed(()=>props.conversation.role!=ChatBotRoles.ASSISTENT)

const props=defineProps<ConversationProps>()



</script>
