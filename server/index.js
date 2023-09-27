const express = require('express')
const cors = require('cors')
const { OAuth2Client } = require('google-auth-library')
const bodyParser = require('body-parser')

const app = express()
const client = new OAuth2Client(
	'74742117989-iumln6qqtgntmro3bo9k4421627239ru.apps.googleusercontent.com'
)

app.use(bodyParser.json())
app.use(cors())

app.post('/api/google-login', async (req, res) => {
	const ticket = await client.verifyIdToken({
		idToken: req.body.token,
	})
	res.status(200).json(ticket.getPayload())
})

app.listen(4001, () => {
	console.log(`Server id ready at http://localhost:4001`)
})
