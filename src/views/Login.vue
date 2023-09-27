<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { GoogleLogin } from 'vue3-google-login'

const userStore = useUserStore()

const router = useRouter()

const callback = async (response) => {
	await userStore.getUserFromGoogle(response)
	setTimeout(() => { router.push('/') }, 200)
}
</script>

<template>
	<div class="w-full">
		<div class="bg-teal-600 z-[-1] w-full h-[225px] fixed top-0"></div>
		<div class="bg-[#191919] z-[-1] w-full h-[calc(100vh-225px)] fixed bottom-0"></div>
		<div class="max-w-xl mx-auto">
			<div class="mt-10 flex items-center w-full">
				<img width="40" src="/images/whatsapp-logo.png" alt="">
				<p class="font-semibold text-gray-100 ml-6">WHATSAPP WEB</p>
			</div>
			<div class="bg-white z-10 p-24 m-6 mt-10">
				<p class="text-center text-4xl text-gray-700 font-light pb-10">WhatsApp</p>
				<div class="w-full flex justify-center bg-[#191919] p-3 rounded-md">
					<GoogleLogin :callback="callback" />
				</div>
			</div>
		</div>
	</div>
</template>



