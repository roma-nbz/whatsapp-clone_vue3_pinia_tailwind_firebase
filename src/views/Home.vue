<script setup>
import HomeChats from '@/components/HomeChats.vue'
import HomeFriends from '@/components/HomeFriends.vue'
import HomeMessages from '@/components/HomeMessages.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import AccountGroup from 'vue-material-design-icons/AccountGroup.vue'
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'
import Magnify from 'vue-material-design-icons/Magnify.vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const { showFindFriends, userDataForChat } = storeToRefs(userStore)

const router = useRouter()

const logout = () => {
	const res = confirm('Are you sute you want to logout?')
	if (res) {
		userStore.logout()
		router.push('/login')
	}
}

onMounted(async () => {
	try {
		userStore.getAllUsers()
		await userStore.getAllChatsByUser()
	} catch (err) {
		console.log(err)
	}
})
</script>

<template>
	<div class="flex">
		<div id="Header" class="fixed w-[420px] z-10">
			<div class="bg-[#f0f0f0] w-full flex justify-between items-center px-3 py-2">
				<img class="rounded-full ml-1 w-10" :src="userStore.picture || ''" alt="">
				<div class="flex items-center justify-center">
					<AccountGroup fillColor="#515151" class="mr-6" />
					<DotsVertical @click="logout" fillColor="#515151" class="cursor-pointer" />
				</div>
			</div>
			<div id="Search" class="bg-white w-full px-2 border-b shadow-sm">
				<div class="flex items-center justify-center rounded-md px-1 m-2 bg-[#f0f0f0]">
					<Magnify fillColor="#515151" class="ml-2" :size="18" />
					<input @click="showFindFriends = !showFindFriends" type="text" autocomplete="off" placeholder="Start a new chat"
						class="ml-5 appearance-none w-full bg-[#f0f0f0] py-1.5 px-2.5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder:text-sm placeholder:text-gray-500">
				</div>
			</div>
		</div>
		<div v-if="showFindFriends">
			<HomeFriends class="pt-28" />
		</div>
		<div v-else>
			<HomeChats class="mt-[100px]" />
		</div>
		<div v-if="userDataForChat.length">
			<HomeMessages />
		</div>
		<div v-else>
			<div class="ml-[420px] fixed w-[calc(100vw-420px)] h-screen bg-gray-100 text-center">
				<div class="grid h-screen place-items-center">
					<div>
						<div class="w-full flex items-center justify-center">
							<img width="375" src="/images/w-web-not-loaded-chat.png" alt="">
						</div>
						<p class="text-[32px] text-gray-500 font-light mt-10">WhatsApp Web</p>
						<div class="text-[14px] text-gray-600 mt-2">
							<p>Send and receive messages without keeping your phone online.</p>
							<p>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>



