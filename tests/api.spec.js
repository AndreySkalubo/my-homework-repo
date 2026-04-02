import { test, expect } from '@playwright/test'

const BASE_URL = 'https://restful-booker.herokuapp.com'
let bookingId
let token

let bookingData = {
    "firstname": "Jim",
    "lastname": "Brown",
    "totalprice": 111,
    "depositpaid": true,
    "bookingdates": {
        "checkin": "2018-01-01",
        "checkout": "2019-01-01"
    },
    "additionalneeds": "Breakfast"
}

test.describe.configure({ mode: 'serial' })

test.describe('booking full cycle', () => {
    test('booking post', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/booking`, {
            data: bookingData
        })
        expect(response.status()).toBe(200)
        const body = await response.json()
        expect(body).toHaveProperty('bookingid')
        for (let key in bookingData) {
            expect(body.booking).toHaveProperty(key)
        }
        bookingId = body.bookingid
    })
    test('booking get', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/booking/${bookingId}`)
        expect(response.status()).toBe(200)
        const body = await response.json()
        for (let key in bookingData) {
            expect(body).toHaveProperty(key, bookingData[key])
        }
    })
    test('booking put', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/auth`, {
            data: {
                username: "admin",
                password: "password123"
            }
        })
        const body = await response.json()
        expect(body).toHaveProperty('token')
        let updatedData = {
                "firstname": "Jon",
                "lastname": "Snow",
                "totalprice": 125,
                "depositpaid": true,
                "bookingdates": {
                    "checkin": "2077-10-23",
                    "checkout": "2077-10-30"
                },
                "additionalneeds": "Lunch"
            }
        const responsePut = await request.put(`${BASE_URL}/booking/${bookingId}`, {
            data: updatedData,
            headers: {
                Cookie: `token=${body.token}`
            }
        })
        const body1 = await responsePut.json()
        expect(response.status()).toBe(200)
        for (let key in updatedData) {
            expect(body1).toHaveProperty(key, updatedData[key])
        }
    })
    test('booking delete', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/auth`, {
            data: {
                username: "admin",
                password: "password123"
            }
        })
        const body = await response.json()
        expect(body).toHaveProperty('token')
        const response1 = await request.delete(`${BASE_URL}/booking/${bookingId}`, {
            headers: {
                Cookie: `token=${body.token}`
            }
        })
        expect(response1.status()).toBe(201)
        const response3 = await request.get(`${BASE_URL}/booking/${bookingId}`)
        expect(response3.status()).toBe(404)
    })
})