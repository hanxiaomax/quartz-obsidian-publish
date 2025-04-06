---
title: Quartz 字体文件路径问题修复
date: 2024-04-06
tags:
  - quartz
---

## 问题描述

在使用 Quartz 部署静态网站时，如果设置了 `baseUrl`（例如 `hanxiaomax.github.io/quartz-obsidian-publish`），字体文件的请求路径会出现问题：

- 生产环境：字体文件请求会去 `https://hanxiaomax.github.io/static/fonts/xxx.ttf`
- 期望路径：应该是 `https://hanxiaomax.github.io/quartz-obsidian-publish/static/fonts/xxx.ttf`

## 解决方案

### 1. 配置文件设置

在 `quartz.config.ts` 中确保 `baseUrl` 设置正确：

```typescript
const config: QuartzConfig = {
  configuration: {
    baseUrl: "hanxiaomax.github.io/quartz-obsidian-publish",
    // ... 其他配置
  }
}
```

### 2. 字体文件路径

在 `quartz/styles/custom.scss` 中，使用绝对路径引用字体文件：

```scss
@font-face {
  font-family: "SourceSerif";
  src: url("/static/fonts/SourceSerif4-Light.ttf") format("truetype");
  font-display: swap;
}

@font-face {
  font-family: "NotoSerifJP";
  src: url("/static/fonts/NotoSerifJP-Light.ttf") format("truetype");
  font-display: swap;
}

// ... 其他字体文件同理
```

### 3. 本地开发配置

在 `package.json` 中添加开发命令，使用 `--baseDir` 参数：

```json
{
  "scripts": {
    "dev": "npx quartz build --serve --port 8080 --baseDir quartz-obsidian-publish"
  }
}
```

## 原理说明

1. 使用绝对路径（以 `/` 开头）可以确保字体文件的请求始终从网站根目录开始
2. 在本地开发时，通过 `--baseDir` 参数设置基础路径，使其与生产环境保持一致
3. 在生产环境中，GitHub Pages 会自动将仓库名作为基础路径，与配置文件中的 `baseUrl` 对应

## 注意事项

1. 确保 `baseUrl` 配置与 GitHub Pages 的部署地址完全匹配
2. 本地开发时使用 `npm run dev` 命令启动服务器
3. 如果更改了仓库名，需要同时更新 `baseUrl` 和 `--baseDir` 参数 