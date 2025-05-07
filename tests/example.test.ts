import { chromium } from 'playwright';

async function runTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 访问网页
    await page.goto('https://example.com');

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 获取页面标题
    const title = await page.title();
    console.log('Page title:', title);

    // 查找并点击链接
    const link = await page.getByRole('link', { name: 'More information...' });
    await link.click();

    // 等待新页面加载
    await page.waitForLoadState('networkidle');

    // 获取当前 URL
    const url = page.url();
    console.log('Current URL:', url);
  } finally {
    await browser.close();
  }
}

runTest().catch(console.error); 