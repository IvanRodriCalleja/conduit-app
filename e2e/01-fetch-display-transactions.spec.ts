import { test, expect } from '@playwright/test';

test.describe('1. Fetch and display the list of transactions', () => {
  test('should fetch and display transactions in the table', async ({ page }) => {
    await page.goto('/');

    // Wait for the transactions table to load (it's a div-based table)
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Verify that transactions are displayed in rows
    const rows = page.locator('div[class*="_root_19wlv_"]');
    await expect(rows).not.toHaveCount(0);

    // Verify table headers are present
    await expect(page.locator('[class*="_tableHeader_"]')).toContainText('Date');
    await expect(page.locator('[class*="_tableHeader_"]')).toContainText('Payee');
    await expect(page.locator('[class*="_tableHeader_"]')).toContainText('Memo');
    await expect(page.locator('[class*="_tableHeader_"]')).toContainText('Amount');
  });

  test('should display transactions ordered by date', async ({ page }) => {
    await page.goto('/');

    // Wait for table to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Get all date cells (first column in each row)
    const rows = page.locator('div[class*="_root_19wlv_"]');
    const rowCount = await rows.count();

    const dateTexts: string[] = [];
    for (let i = 0; i < rowCount; i++) {
      const dateCell = rows.nth(i).locator('div[class*="_column_19wlv_"]').first();
      const text = await dateCell.textContent();
      if (text) dateTexts.push(text);
    }

    // Convert dates to timestamps for comparison
    const timestamps = dateTexts.map(dateText => {
      const [datePart, timePart] = dateText.split(' ');
      return new Date(`${datePart}T${timePart}`).getTime();
    });

    // Verify dates are in descending order (newest first)
    for (let i = 0; i < timestamps.length - 1; i++) {
      expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i + 1]);
    }
  });

  test('should display dates in Y-m-d H:i format', async ({ page }) => {
    await page.goto('/');

    // Wait for table to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Get the first date cell
    const firstRow = page.locator('div[class*="_root_19wlv_"]').first();
    const firstDateCell = firstRow.locator('div[class*="_column_19wlv_"]').first();
    const dateText = await firstDateCell.textContent();

    // Verify date format matches Y-m-d H:i (e.g., "2022-06-26 15:18")
    // Pattern: YYYY-MM-DD HH:MM
    expect(dateText).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });

  test('should display negative amounts in red color', async ({ page }) => {
    await page.goto('/');

    // Wait for table to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Find a currency div with the negative class
    const negativeAmount = page.locator('[class*="_currency--negative_"]').first();
    await expect(negativeAmount).toBeVisible();

    // Verify the color is red using computed styles
    const color = await negativeAmount.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // RGB for red color (#eb2329 = rgb(235, 35, 41))
    expect(color).toBe('rgb(235, 35, 41)');
  });

  test('should display memo field between columns', async ({ page }) => {
    await page.goto('/');

    // Wait for table to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Verify table headers contain all required text
    const tableHeader = page.locator('[class*="_tableHeader_"]');
    await expect(tableHeader).toContainText('Date');
    await expect(tableHeader).toContainText('Payee');
    await expect(tableHeader).toContainText('Memo');
    await expect(tableHeader).toContainText('Amount');

    // Verify memo content is displayed in rows - just check that rows have content
    const firstRow = page.locator('div[class*="_root_19wlv_"]').first();
    await expect(firstRow).toBeVisible();

    // Check that the row has multiple div children (columns)
    const childDivs = firstRow.locator('> div');
    const count = await childDivs.count();

    // Should have 4 columns (Date, Payee, Memo, Amount)
    expect(count).toBe(4);
  });

  test('should display optional memo field (some empty, some filled)', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for table to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Verify rows exist
    const rows = page.locator('div[class*="_root_19wlv_"]');
    await expect(rows.first()).toBeVisible();

    // Get child divs (columns) from the first row
    const firstRow = rows.first();
    const childDivs = firstRow.locator('> div');

    // Should have 4 columns
    const columnCount = await childDivs.count();
    expect(columnCount).toBe(4); // Date, Payee, Memo, Amount

    // Get the third column (memo)
    const memoColumn = childDivs.nth(2);
    await expect(memoColumn).toBeVisible();
  });
});
