import { chromium } from 'playwright';
import { test, expect } from '@playwright/test';

// 添加高亮元素的辅助函数
async function highlightElement(page: any, element: any, duration = 1000) {
  // 使用元素的定位器来高亮
  await page.evaluate((selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      const originalStyle = el.getAttribute('style') || '';
      el.setAttribute('style', `
        ${originalStyle}
        border: 3px solid red !important;
        background-color: rgba(255, 0, 0, 0.1) !important;
        transition: all 0.3s ease !important;
      `);
    }
  }, await element.evaluate((el: Element) => el.tagName.toLowerCase() + 
    (el.id ? `#${el.id}` : '') + 
    (el.className ? `.${el.className.split(' ').join('.')}` : '')));

  await page.waitForTimeout(duration);

  await page.evaluate((selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      const originalStyle = el.getAttribute('style') || '';
      el.setAttribute('style', originalStyle.replace(/border: 3px solid red !important;.*?transition: all 0.3s ease !important;/s, ''));
    }
  }, await element.evaluate((el: Element) => el.tagName.toLowerCase() + 
    (el.id ? `#${el.id}` : '') + 
    (el.className ? `.${el.className.split(' ').join('.')}` : '')));
}

// 创建测试用例
test('MasterGo 登录测试', async ({ page }) => {
  try {
    // 访问 MasterGo 官网
    await page.goto('https://mastergo.com', { waitUntil: 'networkidle' });
    console.log('已打开 MasterGo 官网');

    // 等待页面完全加载
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 尝试多种方式定位登录按钮
    let loginButton = null;
    try {
      // 使用 role 定位
      loginButton = page.getByRole('button', { name: '登录' });
      if (await loginButton.count() === 0) {
        // 使用文本定位
        loginButton = page.getByText('登录');
        if (await loginButton.count() === 0) {
          // 使用选择器定位
          loginButton = page.locator('button:has-text("登录")');
        }
      }
      
      // 等待按钮可见和可点击
      await loginButton.waitFor({ state: 'visible', timeout: 10000 });
      await loginButton.waitFor({ state: 'attached', timeout: 10000 });
      
      // 高亮显示要操作的元素
      await highlightElement(page, loginButton);
      
      // 等待一下确保元素完全加载
      await page.waitForTimeout(2000);
    } catch (error) {
      console.error('定位登录按钮时出错:', error);
      throw error;
    }

    if (!loginButton) {
      throw new Error('无法找到登录按钮');
    }

    // 尝试点击登录按钮
    try {
      await loginButton.click();
      console.log('已点击登录按钮');
    } catch (error) {
      console.error('点击登录按钮时出错:', error);
      throw error;
    }

    // 等待登录框出现，增加超时时间
    try {
      await page.waitForSelector('.login-container', { 
        state: 'visible',
        timeout: 10000 
      });
      console.log('登录框已出现');
    } catch (error) {
      console.error('等待登录框出现时出错:', error);
      // 尝试其他可能的选择器
      await page.waitForSelector('[class*="login"]', { 
        state: 'visible',
        timeout: 10000 
      });
      console.log('找到登录相关元素');
    }

    // 等待一段时间确保登录框完全加载
    await page.waitForTimeout(2000);

    // 输入手机号
    const phoneInput = await page.getByPlaceholder('请输入手机号');
    await highlightElement(page, phoneInput);
    await phoneInput.fill('你的手机号'); // 请替换为实际的手机号
    console.log('已输入手机号');

    // 输入密码
    const passwordInput = await page.getByPlaceholder('请输入密码');
    await highlightElement(page, passwordInput);
    await passwordInput.fill('你的密码'); // 请替换为实际的密码
    console.log('已输入密码');

    // 处理可能的验证码
    const captchaElement = await page.$('.captcha-container');
    if (captchaElement) {
      console.log('检测到验证码，请手动处理...');
      // 等待手动处理验证码
      await page.waitForTimeout(30000); // 等待30秒
    }

    // 点击登录按钮
    const submitButton = await page.getByRole('button', { name: '登录' });
    await highlightElement(page, submitButton);
    await submitButton.click();
    console.log('已点击登录提交按钮');

    // 等待登录成功
    await page.waitForLoadState('networkidle');
    
    // 验证是否登录成功
    const currentUrl = page.url();
    console.log('当前页面URL:', currentUrl);

    // 等待一段时间以便观察结果
    await page.waitForTimeout(5000);

  } catch (error: any) {
    console.error('测试过程中出现错误:', error);
    // 保存截图以便调试
    await page.screenshot({ path: 'error-screenshot.png' });
    console.log('已保存错误截图到 error-screenshot.png');
    throw error;
  }
}); 