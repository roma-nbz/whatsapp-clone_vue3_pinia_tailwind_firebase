<script setup>
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const userStore = useUserStore()

const router = useRouter()

onMounted(() => {
  if (!userStore.sub) {
    router.push('/login')
  }
})
</script>

<template>
  <RouterView />
</template>

