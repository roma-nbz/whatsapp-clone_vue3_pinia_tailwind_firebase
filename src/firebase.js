import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyCXRaGj9bWvDIf1kacoT_vw0NDoQBFpeww',
	authDomain: 'whatsapp-9c761.firebaseapp.com',
	projectId: 'whatsapp-9c761',
	storageBucket: 'whatsapp-9c761.appspot.com',
	messagingSenderId: '953359535697',
	appId: '1:953359535697:web:73b5d86c0933554c4fb270',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
