import { test, expect } from '@playwright/test';

test.describe('4. Paginate the results', () => {
  test('should show pagination with next and previous page buttons', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Wait a bit to ensure pagination is rendered
    await page.waitForTimeout(500);

    // Check for pagination controls
    const previousButton = page.locator('button[aria-label="Previous page"]');
    const nextButton = page.locator('button[aria-label="Next page"]');
    const pageInfo = page.locator('[class*="_pageInfo_"]');

    await expect(previousButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    await expect(pageInfo).toBeVisible();

    // Verify page info shows correct format
    const pageInfoText = await pageInfo.textContent();
    expect(pageInfoText).toMatch(/Page \d+ of \d+/);
  });

  test('should display page info showing current page and total pages', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Wait for pagination
    await page.waitForTimeout(500);

    const pageInfo = page.locator('[class*="_pageInfo_"]');
    await expect(pageInfo).toBeVisible();

    // Should show "Page 1 of X"
    const pageInfoText = await pageInfo.textContent();
    expect(pageInfoText).toContain('Page 1 of');

    // Extract total pages
    const match = pageInfoText?.match(/Page 1 of (\d+)/);
    expect(match).not.toBeNull();

    const totalPages = match ? parseInt(match[1]) : 0;
    expect(totalPages).toBeGreaterThan(1); // With 69 items, should have multiple pages
  });

  test('should limit the amount of results per page to 10', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });

    // Wait for rows to load
    await page.waitForTimeout(500);
    const rows = page.locator('div[class*="_root_19wlv_"]');
    await expect(rows.first()).toBeVisible();

    // Count the number of rows on the first page
    const rowCount = await rows.count();

    // Should show exactly 10 rows (or less if on the last page with fewer items)
    expect(rowCount).toBeLessThanOrEqual(10);

    // For the first page with 69 total items, should be exactly 10
    expect(rowCount).toBe(10);
  });

  test('should navigate to next page when Next button is clicked', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    // Get first row data on page 1
    const firstRowPage1 = page.locator('div[class*="_root_19wlv_"]').first().locator('>div:nth-child(2)');
    const firstPayeePage1 = await firstRowPage1.textContent();

    // Click next button
    const nextButton = page.locator('button[aria-label="Next page"]');
    await nextButton.click();

    // Wait for page transition
    await page.waitForTimeout(300);

    // Verify page info updated
    const pageInfo = page.locator('[class*="_pageInfo_"]');
    const pageInfoText = await pageInfo.textContent();
    expect(pageInfoText).toContain('Page 2 of');

    // Verify data changed
    const firstRowPage2 = page.locator('div[class*="_root_19wlv_"]').first().locator('>div:nth-child(2)');
    const firstPayeePage2 = await firstRowPage2.textContent();

    // Data should be different on page 2
    expect(firstPayeePage2).not.toBe(firstPayeePage1);

    // Should still have rows (up to 10)
    const rows = page.locator('div[class*="_root_19wlv_"]');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(10);
  });

  test('should navigate to previous page when Previous button is clicked', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    // Get first row on page 1
    const firstRowPage1 = page.locator('div[class*="_root_19wlv_"]').first().locator('>div:nth-child(2)');
    const firstPayeePage1 = await firstRowPage1.textContent();

    // Navigate to page 2
    const nextButton = page.locator('button[aria-label="Next page"]');
    await nextButton.click();
    await page.waitForTimeout(300);

    // Verify we're on page 2
    let pageInfo = page.locator('[class*="_pageInfo_"]');
    let pageInfoText = await pageInfo.textContent();
    expect(pageInfoText).toContain('Page 2 of');

    // Click previous button
    const previousButton = page.locator('button[aria-label="Previous page"]');
    await previousButton.click();
    await page.waitForTimeout(300);

    // Verify we're back on page 1
    pageInfo = page.locator('[class*="_pageInfo_"]');
    pageInfoText = await pageInfo.textContent();
    expect(pageInfoText).toContain('Page 1 of');

    // Verify same data as original page 1
    const firstRowBackToPage1 = page.locator(
      'div[class*="_root_19wlv_"]').first().locator('>div:nth-child(2)'
    );
    const firstPayeeBackToPage1 = await firstRowBackToPage1.textContent();
    expect(firstPayeeBackToPage1).toBe(firstPayeePage1);
  });

  test('should disable Previous button on first page', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    // Previous button should be disabled on page 1
    const previousButton = page.locator('button[aria-label="Previous page"]');
    await expect(previousButton).toBeDisabled();

    // Next button should be enabled
    const nextButton = page.locator('button[aria-label="Next page"]');
    await expect(nextButton).toBeEnabled();
  });

  test('should disable Next button on last page', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    // Get total pages
    const pageInfo = page.locator('[class*="_pageInfo_"]');
    const pageInfoText = await pageInfo.textContent();
    const match = pageInfoText?.match(/Page \d+ of (\d+)/);
    const totalPages = match ? parseInt(match[1]) : 0;

    // Navigate to last page
    const nextButton = page.locator('button[aria-label="Next page"]');

    for (let i = 1; i < totalPages; i++) {
      await nextButton.click();
      await page.waitForTimeout(300);
    }

    // Verify we're on the last page
    const finalPageInfo = await page.locator('[class*="_pageInfo_"]').textContent();
    expect(finalPageInfo).toContain(`Page ${totalPages} of ${totalPages}`);

    // Next button should be disabled on last page
    await expect(nextButton).toBeDisabled();

    // Previous button should be enabled
    const previousButton = page.locator('button[aria-label="Previous page"]');
    await expect(previousButton).toBeEnabled();
  });

  test('should show correct number of items on last page', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    // Get total pages
    const pageInfo = page.locator('[class*="_pageInfo_"]');
    const pageInfoText = await pageInfo.textContent();
    const match = pageInfoText?.match(/Page \d+ of (\d+)/);
    const totalPages = match ? parseInt(match[1]) : 0;

    // Navigate to last page
    const nextButton = page.locator('button[aria-label="Next page"]');

    for (let i = 1; i < totalPages; i++) {
      await nextButton.click();
      await page.waitForTimeout(300);
    }

    // Count rows on last page
    const rows = page.locator('div[class*="_root_19wlv_"]');
    const rowCount = await rows.count();

    // With 69 items and 10 per page, last page should have 9 items
    // (Pages: 1-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61-69)
    // 69 % 10 = 9
    expect(rowCount).toBeLessThanOrEqual(10);
    expect(rowCount).toBeGreaterThan(0);

    // For 69 items specifically, should be 9 items on page 7
    if (totalPages === 7) {
      expect(rowCount).toBe(9);
    }
  });

  test('should switch to the page containing newly added transaction', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);
    await expect(page.locator('div[class*="_root_19wlv_"]').first()).toBeVisible();

    // Navigate to a different page (page 2)
    const nextButton = page.locator('button[aria-label="Next page"]');
    await nextButton.click();
    await page.waitForTimeout(300);

    // Verify we're on page 2
    let pageInfo = page.locator('[class*="_pageInfo_"]');
    let pageInfoText = await pageInfo.textContent();
    expect(pageInfoText).toContain('Page 2 of');

    // Add a new transaction with current timestamp (should go to page 1)
    const now = new Date();
    const dateTimeValue = now.toISOString().slice(0, 16);

    await page.fill('#date-input', dateTimeValue);
    await page.fill('#payee-input', 'Pagination Test');
    await page.fill('#memo-input', 'Testing pagination switch');
    await page.fill('#amount-input', '555.55');

    await page.click('button[type="submit"]');

    // Wait for submission and page switch
    await page.waitForTimeout(2000);

    // Verify we're now on page 1 (where the new transaction should be)
    pageInfo = page.locator('[class*="_pageInfo_"]');
    pageInfoText = await pageInfo.textContent();
    expect(pageInfoText).toContain('Page 1 of');

    // Verify the new transaction is visible on this page
    const firstRow = page.locator('div[class*="_root_19wlv_"]').first();
    await expect(firstRow).toBeVisible();
    await expect(firstRow).toContainText('Pagination Test');
    await expect(firstRow).toContainText('Testing pagination switch');
  });

  test('should maintain correct pagination after adding transaction from last page', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    // Get total pages
    const pageInfo = page.locator('[class*="_pageInfo_"]');
    const pageInfoText = await pageInfo.textContent();
    const match = pageInfoText?.match(/Page \d+ of (\d+)/);
    const initialTotalPages = match ? parseInt(match[1]) : 0;

    // Navigate to last page
    const nextButton = page.locator('button[aria-label="Next page"]');
    for (let i = 1; i < initialTotalPages; i++) {
      await nextButton.click();
      await page.waitForTimeout(300);
    }

    // Add a transaction with old timestamp (should stay on last page or near it)
    // Use a very old date to ensure it goes to the end
    const oldDate = new Date('2020-01-01T10:00');
    const dateTimeValue = oldDate.toISOString().slice(0, 16);

    await page.fill('#date-input', dateTimeValue);
    await page.fill('#payee-input', 'Old Transaction');
    await page.fill('#memo-input', 'Should be on last page');
    await page.fill('#amount-input', '10.00');

    await page.click('button[type="submit"]');

    // Wait for submission and page switch
    await page.waitForTimeout(800);

    // Verify we're now on the page containing the old transaction
    // (should be the new last page)
    const newPageInfo = page.locator('[class*="_pageInfo_"]');
    const newPageInfoText = await newPageInfo.textContent();
    const newMatch = newPageInfoText?.match(/Page (\d+) of (\d+)/);

    if (newMatch) {
      const currentPage = parseInt(newMatch[1]);
      const newTotalPages = parseInt(newMatch[2]);

      // We should be on the last page or close to it
      expect(currentPage).toBeGreaterThanOrEqual(newTotalPages - 1);

      // Total pages might increase by 1 if we hit 70 items (70/10 = 7 pages vs 69/10 = 7 pages)
      expect(newTotalPages).toBeGreaterThanOrEqual(initialTotalPages);
    }

    // Verify the old transaction is visible
    const rows = page.locator('div[class*="_root_19wlv_"]');
    const rowTexts = await rows.allTextContents();
    const found = rowTexts.some((text) => text.includes('Old Transaction'));
    expect(found).toBeTruthy();
  });

  test('should maintain pagination state during periodic refresh', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('[class*="_tableHeader_"]')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    // Navigate to page 2
    const nextButton = page.locator('button[aria-label="Next page"]');
    await nextButton.click();
    await page.waitForTimeout(300);

    // Verify we're on page 2
    let pageInfo = page.locator('[class*="_pageInfo_"]');
    let pageInfoText = await pageInfo.textContent();
    expect(pageInfoText).toContain('Page 2 of');

    // Get first row data
    const firstRowBefore = page.locator('div[class*="_root_19wlv_"]').first().locator('>div:nth-child(2)');
    const firstPayeeBefore = await firstRowBefore.textContent();

    // Wait for refresh cycle (5+ seconds)
    await page.waitForTimeout(5500);

    // Verify we're still on page 2 after refresh
    pageInfo = page.locator('[class*="_pageInfo_"]');
    pageInfoText = await pageInfo.textContent();
    expect(pageInfoText).toContain('Page 2 of');

    // Verify data is still the same (or if data changed, we're still on page 2)
    const firstRowAfter = page.locator('div[class*="_root_19wlv_"]').first().locator('>div:nth-child(2)');
    const firstPayeeAfter = await firstRowAfter.textContent();

    // Should still be page 2 data
    expect(firstPayeeAfter).toBe(firstPayeeBefore);
  });
});
