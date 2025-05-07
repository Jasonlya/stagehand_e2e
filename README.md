# UI Automation Tests

使用 Playwright 实现的 MasterGo 网站 UI 自动化测试项目。

## 功能特点

- 自动化登录流程测试
- 元素高亮显示
- 智能等待机制
- 详细的 HTML 测试报告
- 失败重试机制
- 截图和视频记录

## 环境要求

- Node.js 16+
- npm 7+

## 安装

```bash
# 克隆项目
git clone [your-repository-url]

# 安装依赖
npm install

# 安装 Playwright 浏览器
npx playwright install
```

## 配置

1. 在 `tests/mastergo.test.ts` 中配置你的登录信息：
```typescript
await phoneInput.fill('你的手机号'); // 替换为你的手机号
await passwordInput.fill('你的密码'); // 替换为你的密码
```

2. 可以在 `playwright.config.ts` 中调整测试配置：
- 超时时间
- 重试次数
- 浏览器设置
- 报告配置

## 运行测试

```bash
# 运行测试
npm run test:mastergo

# 查看测试报告
npm run test:report
```

## 测试报告

测试完成后，可以通过以下命令查看 HTML 报告：
```bash
npm run test:report
```

报告包含：
- 测试步骤详情
- 截图
- 视频记录（失败时）
- 错误信息
- 执行时间

## 项目结构

```
.
├── tests/                    # 测试文件目录
│   └── mastergo.test.ts     # MasterGo 测试用例
├── playwright.config.ts      # Playwright 配置文件
├── package.json             # 项目依赖配置
└── README.md               # 项目文档
```

## 注意事项

1. 测试过程中可能需要处理验证码，目前设置为等待 30 秒手动处理
2. 确保网络连接稳定
3. 建议使用非无头模式运行测试（已配置）

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT 
