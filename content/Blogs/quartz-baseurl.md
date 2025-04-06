---
title: Quartz中的baseUrl配置问题
date: 2024-04-06
tags:
  - quartz
  - solution
---

## 问题描述

在使用 Quartz 部署静态网站时，如果网站不是部署在域名根目录下（例如部署在 `username.github.io/project-name/`），那么所有的资源引用路径都需要考虑这个子目录。

具体表现为：
1. 本地开发时，资源路径是 `/static/fonts/xxx.ttf`
2. 部署到 GitHub Pages 后，实际访问路径变成了 `/project-name/static/fonts/xxx.ttf`

## 解决方案

### 1. 配置 baseUrl

在 `quartz.config.ts` 中设置正确的 `baseUrl`：

```typescript
const config: QuartzConfig = {
  configuration: {
    baseUrl: "username.github.io/project-name",
    // ... 其他配置
  }
}
```

### 2. 资源引用使用完整路径

在 `custom.scss` 中，使用包含完整子目录的绝对路径引用资源：

```scss
@font-face {
  font-family: "SourceSerif";
  src: url("/project-name/static/fonts/SourceSerif4-Light.ttf") format("truetype");
  font-display: swap;
}
```

### 3. 本地开发配置

本地开发时，使用 `--baseDir` 参数启动开发服务器：

```json
{
  "scripts": {
    "dev": "npx quartz build --serve --port 8080 --baseDir project-name"
  }
}
```

## 原理说明

1. 使用绝对路径（以 `/` 开头）可以确保资源请求始终从网站根目录开始
2. 在路径中包含项目名称（如 `/project-name/`）确保在 GitHub Pages 等环境中能正确访问资源
3. 开发服务器的 `--baseDir` 参数模拟了生产环境的子目录结构

## 注意事项

1. 所有资源路径都需要添加项目名称前缀
2. 确保 `quartz.config.ts` 中的 `baseUrl` 配置正确
3. 本地开发时使用 `--baseDir` 参数启动服务器
4. 这个方案适用于所有需要通过 URL 访问的静态资源，包括：
   - 字体文件
   - 图片
   - CSS/JS 文件
   - 其他静态资源 