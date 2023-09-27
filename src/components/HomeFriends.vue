<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const userStore = useUserStore()
const { sub, userDataForChat, allUsers, removeUsersFromFindFriends } = storeToRefs(userStore)

const users = ref([])

const hideMe = (user) => {
	if (user.sub === sub.value) {
		return false
	}
	return true
}

const createNewChat = () => {
	userDataForChat.value = []
	userDataForChat.value.push({
		id: '',
		sub1: sub.value,
		sub2: user.sub,
		firstName: user.firstName,
		picture: user.picture
	})
}

const usersComputed = computed(() => {
	allUsers.value.forEach(user => users.value.push(user))
	removeUsersFromFindFriends.value.forEach(remove => {
		const idx = users.value.findIndex(user => user.sub === remove)
		users.value.splice(idx, 1)
	})
	return users.value
})
</script>

<template>
	<div id="HomeFriends" class="pt-[100px] overflow-auto fixed h-screen w-full">
		<div v-for="user in usersComputed" :key="user">
			<div v-if="hideMe(user)" @click="createNewChat(user)" class="flex w-full p-4 items-center cursor-pointer">
				<img class="rounded-full mr-4 w-12" :src="user.picture || ''" alt="">
				<div class="w-full">
					<div class="flex justify-between items-center">
						<p class="text-[15px] text-gray-600">{{ user.firstName }} {{ user.lastName }}</p>
					</div>
					<div class="flex items-center">
						<p class="text-[15px] text-gray-500">Hi, I'm using WhatsApp!</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>