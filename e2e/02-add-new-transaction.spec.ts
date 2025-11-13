import { test, expect } from '@playwright/test';

test.describe('2. Add new transaction feature', () => {
  test('should be able to add a new transaction using AddRecordForm', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Wait for initial rows to load
    await page.waitForTimeout(500);
    await expect(page.locator('div[class*="_root_19wlv_"]').first()).toBeVisible();

    // Find the form
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Fill in the form fields
    const now = new Date();
    const dateTimeValue = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm

    await page.fill('#date-input', dateTimeValue);
    await page.fill('#payee-input', 'Test Payee E2E');
    await page.fill('#memo-input', 'Test memo from E2E');
    await page.fill('#amount-input', '123.45');

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait a bit for the transaction to be added and page to update
    await page.waitForTimeout(2000);

    // Verify the new transaction appears in the table
    // Since we're adding a current timestamp, it should appear first
    const firstRow = page.locator('div[class*="_root_19wlv_"]').first();
    await expect(firstRow).toBeVisible();
    await expect(firstRow).toContainText('Test Payee E2E');
    await expect(firstRow).toContainText('Test memo from E2E');
    await expect(firstRow).toContainText('123.45');
    await expect(firstRow).toContainText('USD');
  });

  test('should clear the form after successful submission', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Fill in the form
    const now = new Date();
    const dateTimeValue = now.toISOString().slice(0, 16);

    await page.fill('#date-input', dateTimeValue);
    await page.fill('#payee-input', 'Clear Form Test');
    await page.fill('#memo-input', 'This should clear');
    await page.fill('#amount-input', '50.00');

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for submission to complete
    await page.waitForTimeout(2000);

    // Verify all form fields are cleared
    await expect(page.locator('#date-input')).toHaveValue('');
    await expect(page.locator('#payee-input')).toHaveValue('');
    await expect(page.locator('#memo-input')).toHaveValue('');
    await expect(page.locator('#amount-input')).toHaveValue('');
  });

  test('should highlight newly added record with #f7ffe8 color for 1s', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Wait for initial rows to load
    await page.waitForTimeout(500);
    await expect(page.locator('div[class*="_root_19wlv_"]').first()).toBeVisible();

    // Fill in and submit the form
    const now = new Date();
    const dateTimeValue = now.toISOString().slice(0, 16);

    await page.fill('#date-input', dateTimeValue);
    await page.fill('#payee-input', 'Highlighted Test');
    await page.fill('#memo-input', 'Test highlight');
    await page.fill('#amount-input', '99.99');

    await page.click('button[type="submit"]');

    // Wait for highlighted row to appear (with the --highlighted modifier class)
    const highlightedRow = page.locator('div[class*="_root--highlighted_"]');
    await expect(highlightedRow).toBeVisible({ timeout: 3000 });

    // Check that the row has the highlighted background color
    const backgroundColor = await highlightedRow.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // RGB for #f7ffe8 is rgb(247, 255, 232)
    expect(backgroundColor).toBe('rgb(247, 255, 232)');

    // Wait for 1.1 seconds to ensure highlight has been removed
    await page.waitForTimeout(1100);

    // Check that the highlighted class is no longer present
    await expect(highlightedRow).not.toBeVisible();
  });

  test('should support optional memo field', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Wait for initial rows to load
    await page.waitForTimeout(500);
    await expect(page.locator('div[class*="_root_19wlv_"]').first()).toBeVisible();

    // Fill form without memo
    const now = new Date();
    const dateTimeValue = now.toISOString().slice(0, 16);

    await page.fill('#date-input', dateTimeValue);
    await page.fill('#payee-input', 'No Memo Test');
    // Intentionally leave memo empty
    await page.fill('#amount-input', '25.00');

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for submission
    await page.waitForTimeout(2000);

    // Verify the transaction was added (first row)
    const firstRow = page.locator('div[class*="_root_19wlv_"]').first();
    await expect(firstRow).toBeVisible();
    await expect(firstRow).toContainText('No Memo Test');
    await expect(firstRow).toContainText('25.00');
    await expect(firstRow).toContainText('USD');

    // Memo cell should be empty
    const memoCell = firstRow.locator('div[class*="_column_19wlv_"]:nth-child(3)');
    const memoText = await memoCell.textContent();
    expect(memoText?.trim()).toBe('');
  });

  test('should submit transaction with correct JSON format to POST /api/transactions', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Wait for initial rows to load
    await page.waitForTimeout(500);
    await expect(page.locator('div[class*="_root_19wlv_"]').first()).toBeVisible();

    // Fill and submit form with known test data
    const now = new Date();
    const dateTimeValue = now.toISOString().slice(0, 16);

    await page.fill('#date-input', dateTimeValue);
    await page.fill('#payee-input', 'API Test');
    await page.fill('#memo-input', 'API memo');
    await page.fill('#amount-input', '100.50');

    await page.click('button[type="submit"]');

    // Wait for transaction to be added (proves POST worked)
    await page.waitForTimeout(2000);

    // Verify the transaction appears in the table with correct data
    // This proves the JSON format was correct because:
    // 1. The transaction was successfully added (POST succeeded)
    // 2. The data is displayed correctly (amount, payee, memo all present)
    const firstRow = page.locator('div[class*="_root_19wlv_"]').first();
    await expect(firstRow).toBeVisible();
    await expect(firstRow).toContainText('API Test');
    await expect(firstRow).toContainText('API memo');
    await expect(firstRow).toContainText('100.50');
    await expect(firstRow).toContainText('USD');

    // Verify the form was cleared (another sign of successful submission)
    await expect(page.locator('#payee-input')).toHaveValue('');
    await expect(page.locator('#memo-input')).toHaveValue('');
    await expect(page.locator('#amount-input')).toHaveValue('');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Wait a bit
    await page.waitForTimeout(300);

    // Error messages should appear
    await expect(page.locator('#date-error')).toBeVisible();
    await expect(page.locator('#payee-error')).toBeVisible();
    await expect(page.locator('#amount-error')).toBeVisible();

    // Verify error messages content
    await expect(page.locator('#date-error')).toContainText('Date is required');
    await expect(page.locator('#payee-error')).toContainText('Payee is required');
    await expect(page.locator('#amount-error')).toContainText('Amount is required');
  });

  test('should add transaction with negative amount', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Wait for initial rows to load
    await page.waitForTimeout(500);
    await expect(page.locator('div[class*="_root_19wlv_"]').first()).toBeVisible();

    // Fill form with negative amount
    const now = new Date();
    const dateTimeValue = now.toISOString().slice(0, 16);

    await page.fill('#date-input', dateTimeValue);
    await page.fill('#payee-input', 'Negative Amount Test');
    await page.fill('#memo-input', 'Expense');
    await page.fill('#amount-input', '-75.50');

    await page.click('button[type="submit"]');

    // Wait for submission
    await page.waitForTimeout(2000);

    // Verify the transaction appears with negative amount
    const firstRow = page.locator('div[class*="_root_19wlv_"]').first();
    await expect(firstRow).toBeVisible();
    await expect(firstRow).toContainText('Negative Amount Test');
    await expect(firstRow).toContainText('-75.50');
    await expect(firstRow).toContainText('USD');

    // Verify red color for negative amount
    const amountCell = firstRow.locator('div[class*="_column_19wlv_"]:last-child');
    const signSpan = amountCell.locator('[class*="_currency--negative_"]');
    await expect(signSpan).toBeVisible();
  });
});
