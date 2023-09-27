import { db } from '@/firebase'
import axios from 'axios'
import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	setDoc,
	updateDoc,
} from 'firebase/firestore'
import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import { ref } from 'vue'

axios.defaults.baseURL = 'http://localhost:4001/'

export const useUserStore = defineStore(
	'user',
	() => {
		const sub = ref('')
		const email = ref('')
		const picture = ref('')
		const firstName = ref('')
		const lastName = ref('')
		const allUsers = ref([])
		const userDataForChat = ref([])
		const showFindFriends = ref(false)
		const currentChat = ref(null)
		const removeUsersFromFindFriends = ref([])
		const chats = ref([])

		const checkIfUserExists = async id => {
			const docRef = doc(db, 'users', id)
			const docSnap = await getDoc(docRef)
			return docSnap.exists()
		}

		const saveUser = async res => {
			try {
				await setDoc(doc(db, 'users', res.data.sub), {
					sub: res.data.sub,
					email: res.data.email,
					picture: res.data.picture,
					firstName: res.data.given_name,
					lastName: res.data.family_name,
				})
			} catch (err) {
				console.log(err)
			}
		}

		const getUserFromGoogle = async data => {
			try {
				const res = await axios.post('api/google-login', {
					token: data.credential,
				})

				const userExists = await checkIfUserExists(res.data.sub)
				if (!userExists) {
					await saveUser(res)
				}

				sub.value = res.data.sub
				email.value = res.data.email
				picture.value = res.data.picture
				firstName.value = res.data.given_name
				lastName.value = res.data.family_name
			} catch (err) {
				console.log(err)
			}
		}

		const getAllUsers = async () => {
			const querySnapshot = await getDocs(collection(db, 'users'))
			const results = []
			querySnapshot.forEach(doc => {
				results.push(doc.data())
			})

			if (results.length) {
				allUsers.value = []
				results.forEach(res => {
					allUsers.value.push(res)
				})
			}
		}

		const getChatById = async id => {
			onSnapshot(doc(db, 'chat', id), doc => {
				const res = []
				res.push(doc.data())
				currentChat.value = res
			})
		}

		const getAllChatsByUser = () => {
			const q = query(collection(db, 'chat'))
			onSnapshot(q, querySnapshot => {
				const chatArray = []
				querySnapshot.forEach(doc => {
					const data = {
						id: doc.id,
						sub1: doc.data().sub1,
						sub2: doc.data().sub2,
						sub1HasViewed: doc.data().sub1HasViewed,
						sub2HasViewed: doc.data().sub2HasViewed,
						messages: doc.data().messages,
					}

					if (doc.data().sub1 === sub.value) {
						chatArray.push(data)
					}
					if (doc.data().sub2 === sub.value) {
						chatArray.push(data)
					}

					removeUsersFromFindFriends.value = []

					chatArray.forEach(chat => {
						if (sub.value === chat.sub1) {
							allUsers.value.forEach(user => {
								if (user.sub == chat.sub2) {
									chat.user = user
									removeUsersFromFindFriends.value.push(user.sub)
								}
							})
						}
						if (sub.value === chat.sub2) {
							allUsers.value.forEach(user => {
								if (user.sub == chat.sub1) {
									chat.user = user
									removeUsersFromFindFriends.value.push(user.sub)
								}
							})
						}
					})
					chats.value = []
					chatArray.forEach(chat => {
						chats.value.push(chat)
					})
				})
			})
		}

		const sendMessage = async data => {
			try {
				if (data.chatId) {
					await updateDoc(doc(db, `chat/${data.chatId}`), {
						sub1HasViewed: false,
						sub2HasViewed: false,
						messages: arrayUnion({
							sub: sub.value,
							message: data.message,
							createdAt: Date.now(),
						}),
					})
				} else {
					const id = uuid()
					await setDoc(doc(db, `chat/${id}`), {
						sub1: sub.value,
						sub2: data.sub2,
						sub1HasViewed: false,
						sub2HasViewed: false,
						messages: [
							{
								sub: sub.value,
								message: data.message,
								createdAt: Date.now(),
							},
						],
					})
					userDataForChat.value[0].id = id
					showFindFriends.value = false
				}
			} catch (err) {
				console.log(err)
			}
		}

		const hasReadMessage = async data => {
			await updateDoc(
				doc(db, `chat/${data.id}`),
				{
					[data.key1]: data.val1,
					[data.key2]: data.val2,
				},
				{ merge: true }
			)
		}

		const logout = () => {
			sub.value = ''
			email.value = ''
			picture.value = ''
			firstName.value = ''
			lastName.value = ''
			allUsers.value = []
			userDataForChat.value = []
			showFindFriends.value = false
			currentChat.value = null
			removeUsersFromFindFriends.value = []
			chats.value = []
		}

		return {
			sub,
			email,
			picture,
			firstName,
			lastName,
			getUserFromGoogle,
			logout,
			checkIfUserExists,
			saveUser,
			allUsers,
			getAllUsers,
			userDataForChat,
			showFindFriends,
			sendMessage,
			getChatById,
			currentChat,
			getAllChatsByUser,
			removeUsersFromFindFriends,
			chats,
			hasReadMessage,
		}
	},
	{ persist: true }
)
