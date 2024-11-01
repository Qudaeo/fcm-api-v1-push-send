import { google }  from 'googleapis'
import { readFile } from 'fs/promises'

const fcmToken = "e4ytHHbVRKmThx25IVkg9h:APA91bEWM2CM8PQ7I9922OtZFyE-XyVmqNDVy8yOT-8x8yH1u-VwjCFAnVlAHq5iErzNx48tE-07zE4LVLNeifX3ayPUTi3RZysXb9qwjFKnTjWv362PtCI"

const serviceAccount = JSON.parse(
    await readFile(
        new URL("./service-account.json", import.meta.url)
    )
)

const credentials =  new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/firebase.messaging'],
    null
)

const getAccessToken = async () => {
    try {
        const accessTokenResponse = await credentials.getAccessToken()
        return accessTokenResponse.token
    } catch (e) {
        console.error('getAccessToken', e)
    }
}

const sendPush = async (accessToken) => {
    try {
        const response = await fetch('https://fcm.googleapis.com/v1/projects/beercity-pizza-rn/messages:send', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: {
                    token: fcmToken,
                    data: {
                        body: "Body of Your Notification in data",
                        title: "Title of Your Notification in data",

                        key_1: "Value for key_1",
                        key_2: "Value for key_2"
                    },
                    android: {
                        priority: "HIGH",
                    },
                },
            }),
        })

        console.log(await response.json())
    } catch (e) {
        console.error('sendPush', e)
    }
}

(async () => {
    const accessToken = await getAccessToken()
    await sendPush(accessToken)
})()
