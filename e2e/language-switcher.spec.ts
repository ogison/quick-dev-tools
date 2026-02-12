import { test, expect } from '@playwright/test';

test.describe('Language Switcher', () => {
  test('should switch from Japanese to English', async ({ page }) => {
    // Start from the Japanese home page directly
    await page.goto('/ja/home');

    // Check that we're on the Japanese page
    await expect(page).toHaveURL(/\/ja\/home/);

    // Find and click the English language button
    await page.getByRole('button', { name: 'en' }).click();

    // Wait for navigation
    await page.waitForURL(/\/en/, { timeout: 5000 });

    // Verify URL changed to English
    await expect(page).toHaveURL(/\/en\/home/);

    // Verify content is in English by checking the hero text
    await expect(page.getByText('Tool Collection for Developers')).toBeVisible();

    // Verify the English button is now active (bold)
    const enButton = page.getByRole('button', { name: 'en' });
    await expect(enButton).toHaveClass(/font-bold/);
  });

  test('should switch from English to Japanese', async ({ page }) => {
    // Start from the English home page
    await page.goto('/en/home');

    // Check that we're on the English page
    await expect(page).toHaveURL(/\/en\/home/);

    // Find and click the Japanese language button
    await page.getByRole('button', { name: 'ja' }).click();

    // Wait for navigation
    await page.waitForURL(/\/ja/, { timeout: 5000 });

    // Verify URL changed to Japanese
    await expect(page).toHaveURL(/\/ja\/home/);

    // Verify content is in Japanese by checking the hero text
    await expect(page.getByText('開発者のためのツールコレクション')).toBeVisible();

    // Verify the Japanese button is now active (bold)
    const jaButton = page.getByRole('button', { name: 'ja' });
    await expect(jaButton).toHaveClass(/font-bold/);
  });

  test('should maintain language preference across navigation', async ({ page }) => {
    // Start from Japanese home page
    await page.goto('/ja/home');

    // Switch to English
    await page.getByRole('button', { name: 'en' }).click();
    await page.waitForURL(/\/en/, { timeout: 5000 });

    // Navigate to contact page via header link
    const contactLink = page.getByRole('link', { name: 'Contact' });
    await contactLink.click();

    // Verify we're still in English
    await expect(page).toHaveURL(/\/en\/contact/);

    // Switch back to Japanese
    await page.getByRole('button', { name: 'ja' }).click();
    await page.waitForURL(/\/ja/, { timeout: 5000 });

    // Verify we're in Japanese
    await expect(page).toHaveURL(/\/ja\/contact/);
  });

  test('should display language switcher on all pages', async ({ page }) => {
    const pages = ['/home', '/tools', '/privacy', '/terms', '/contact'];

    for (const path of pages) {
      await page.goto(`/ja${path}`);

      // Verify both language buttons are visible
      await expect(page.getByRole('button', { name: 'ja' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'en' })).toBeVisible();
    }
  });

  test('should show correct active language state', async ({ page }) => {
    // Test Japanese active state
    await page.goto('/ja/home');
    const jaButton = page.getByRole('button', { name: 'ja' });
    await expect(jaButton).toHaveClass(/font-bold/);

    // Test English active state
    await page.goto('/en/home');
    const enButton = page.getByRole('button', { name: 'en' });
    await expect(enButton).toHaveClass(/font-bold/);
  });

  test('should translate page title and metadata', async ({ page }) => {
    // Check Japanese page title
    await page.goto('/ja/home');
    await expect(page).toHaveTitle(/開発者ツール集/);

    // Check English page title
    await page.goto('/en/home');
    await expect(page).toHaveTitle(/Developer Tools/);
  });
});
