<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'
import EmoticonExcitedOutline from 'vue-material-design-icons/EmoticonExcitedOutline.vue'
import Paperclip from 'vue-material-design-icons/Paperclip.vue'
import Send from 'vue-material-design-icons/Send.vue'

const userStore = useUserStore()
const { userDataForChat, currentChat, sub } = storeToRefs(userStore)

const message = ref('')
const disableBtn = ref(false)

const sendMessage = async () => {
	if (message.value === '') {
		return
	}

	disableBtn.value = true

	await userStore.sendMessage({
		message: message.value,
		sub2: userDataForChat.value[0].sub2,
		chatId: userDataForChat.value[0].id
	})

	message.value = ''
	const userData = userDataForChat.value[0]

	const data = {
		id: userData.id,
		key1: 'sub1HasViewed', val1: false,
		key2: 'sub2HasViewed', val2: false,
	}
	if (userData.sub1 === sub.value) {
		data.val1 = true
		data.val2 = false
	} else if (userData.sub2 === sub.value) {
		data.val1 = false
		data.val2 = true
	}

	await userStore.hasReadMessage(data)

	const objDiv = document.getElementById('Messages')
	objDiv.scrollTop = objDiv.scrollHeight

	disableBtn.value = false
}

watch(() => currentChat.value, (chat) => {
	if (chat.length) {
		setTimeout(() => {
			const objDiv = document.getElementById('Messages')
			objDiv.scrollTop = objDiv.scrollHeight
		}, 50)
	}
}, { deep: true })
</script>

<template>
	<div class="ml-[420px] w-full">
		<div class="w-full">
			<div id="BG"></div>
			<div class="border-l border-green-500 w-full">
				<div class="bg-[#f0f0f0] fixed z-10 min-w-[calc(100vw-420px)] flex justify-between items-center px-2 py-2">
					<div class="flex items-center">
						<img v-if="userDataForChat[0] && userDataForChat[0].picture" class="rounded-full mx-1 w-10"
							:src="userDataForChat[0].picture" alt="">
						<p v-if="userDataForChat[0] && userDataForChat[0].firstName" class="text-gray-900 ml-1 font-semibold">
							{{ userDataForChat[0].firstName }}
						</p>
					</div>
					<DotsVertical fillColor="#515151" class="cursor-pointer" />
				</div>
			</div>
			<div id="Messages"
				class="pt-20 pb-8 z-[-1] h-[calc(100vh-65px)] w-[calc(100vw-420px)] overflow-auto fixed touch-auto">
				<div v-if="currentChat && currentChat.length" class="px-20 text-sm">
					<div v-for="msg in currentChat[0].messages" :key="msg">
						<div v-if="msg.sub === sub" class="flex w-[calc(100%-50px)]">
							<div class="inline-block bg-white p-2 rounded-md my-1">
								{{ msg.message }}
							</div>
						</div>
						<div v-else class="flex justify-end space-x-1 w-[calc(100%-50px)] float-right">
							<div class="inline-block bg-green-200 p-2 rounded-md my-1">
								{{ msg.message }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="w-[calc(100vw-420px)] py-2.5 z-10 bg-[#f0f0f0] fixed bottom-0">
				<div class="flex items-center justify-center">
					<EmoticonExcitedOutline :size="27" fillColor="#515151" class="mx-1.5" />
					<Paperclip :size="27" fillColor="#515151" class="mx-1.5 mr-3" />
					<input v-model="message" type="text" autocomplete="off" placeholder="Message"
						class="mr-1 rounded-lg shadow appearance-none w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
					<button :disabled="disableBtn" @click="sendMessage" class="ml-3 p-2 w-12 flex items-center justify-center">
						<Send fillColor="#515151" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
#BG {
	background-image: url('/images/message-bg.png');
	background-size: cover;
	background-repeat: no-repeat;
	width: 100%;
	height: 100%;
	position: fixed;
	z-index: -1;
}
</style>



