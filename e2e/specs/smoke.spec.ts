import { expect, test } from '@playwright/test';
import { JsonViewerPage } from '../pages/JsonViewerPage';

test.describe('React JSON View Demo App', () => {
    test('should load the demo page and display JSON viewer components', async ({ page }) => {
        const jsonViewerPage = new JsonViewerPage(page);
        await jsonViewerPage.goto();

        await expect(page).toHaveTitle(/React JSON View/i);
        await expect(jsonViewerPage.container.first()).toBeVisible();
        await expect(jsonViewerPage.objectKeyVal.first()).toBeVisible();
    });
});
