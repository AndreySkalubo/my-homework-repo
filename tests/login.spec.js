import { test, expect } from '@playwright/test'

test.skip('Sauce Demo authorisation', () => {

  test('check login credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user')
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
  })

  test('check bad login credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('locked_out_user')
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByRole('heading', { name: 'Epic sadface: Sorry, this user has been locked out.' })).toBeVisible()
  })
  
})