---
title: 如何优雅地定制 Quartz4
description: 通过自定义组件和样式来定制 Quartz4，无需修改核心代码
date: 2024-04-02
tags:
  - quartz
---

# 如何优雅地定制 Quartz4

Quartz4 是一个强大的静态网站生成器，特别适合用于构建个人知识库。虽然它提供了丰富的默认配置，但有时我们可能需要一些个性化的定制。本文将介绍如何通过编写自定义组件和样式来定制 Quartz4，而无需修改其核心代码。

> [!note]
> 本文是 Quartz4 官方文档的补充。建议先阅读 [Quartz4 官方文档](https://quartz.jzhao.xyz/docs/) 了解基础知识。

## 1. 理解 Quartz4 的样式系统

Quartz4 使用 SCSS 作为样式预处理器，主要包含以下几个样式文件：

- `base.scss`: 基础样式定义
- `variables.scss`: 全局变量定义
- `custom.scss`: 自定义样式覆盖
- `syntax.scss`: 代码高亮样式
- `callouts.scss`: 提示框样式

## 2. 自定义主题颜色

在 `quartz.config.ts` 中，我们可以通过 `theme.colors` 配置来定义主题颜色：

```typescript
theme: {
  colors: {
    lightMode: {
      light: "#ffffff",      // 背景色
      lightgray: "#f5f5f5",  // 浅灰色
      gray: "#ffffff",       // 中灰色
      darkgray: "#666666",   // 深灰色
      dark: "#333333",       // 文字颜色
      secondary: "#8b7355",  // 次要颜色
      tertiary: "#6b5b43",   // 第三级颜色
      highlight: "#e67e22",  // 高亮颜色
      textHighlight: "rgb(148,143,142,0.2)", // 文本高亮
    },
    darkMode: {
      // 暗色模式配置
    }
  }
}
```

## 3. 自定义字体

Quartz4 支持自定义字体，可以在 `quartz.config.ts` 中配置：

```typescript
theme: {
  typography: {
    header: "Songti SC",     // 标题字体
    body: "PingFang SC",     // 正文字体
    code: "JetBrains Mono",  // 代码字体
  }
}
```

## 4. 编写自定义样式

在 `custom.scss` 中，我们可以覆盖或扩展默认样式。以下是一些常用的自定义示例：

### 4.1 优化正文排版

```scss
body {
  font-family: "PingFang SC", "Hiragino Sans GB", "STHeiti", "Microsoft YaHei", sans-serif;
  line-height: 1.8;
  letter-spacing: 0.01em;
  font-size: 16px;
  color: var(--dark);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 350;
}
```

### 4.2 美化标题样式

```scss
h1, h2, h3, h4, h5, h6 {
  font-family: "Songti SC", "SimSun", "STSong", serif;
  color: var(--dark);
  line-height: 1.4;
  margin-top: 2.5em;
  margin-bottom: 1em;
  font-weight: 350;
  letter-spacing: -0.02em;
}

h1 {
  font-size: 2.5rem;
  letter-spacing: -0.03em;
  margin-bottom: 2em;
  border-bottom: 1px solid var(--lightgray);
  padding-bottom: 0.5em;
}
```

### 4.3 优化链接样式

```scss
a {
  color: var(--secondary);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 350;
  
  &:hover {
    color: var(--tertiary);
  }

  &.internal {
    background: linear-gradient(to right, var(--highlight) 0%, var(--highlight) 100%);
    background-size: 100% 2px;
    background-repeat: no-repeat;
    background-position: 0 100%;
    padding-bottom: 2px;
  }
}
```

## 5. 创建自定义组件

Quartz4 允许我们创建自定义组件来扩展其功能。让我们以创建卡片模式（Card Mode）和闪卡（Flashcard）组件为例。

### 5.1 创建卡片模式切换组件

首先创建 `CardMode.tsx` 组件：

```typescript
import styles from "./styles/cardmode.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

const CardMode: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "mode-switch")}>
      <label class="switch">
        <input type="checkbox" id="card-mode-toggle" />
        <span class="slider">
          <svg class="article-icon" viewBox="0 0 24 24" width="16" height="16">
            <path
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
            />
          </svg>
          <svg class="card-icon" viewBox="0 0 24 24" width="16" height="16">
            <path
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              d="M11 9h6m-6 3h6m-6 3h6M6.996 9h.01m-.01 3h.01m-.01 3h.01M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
            />
          </svg>
        </span>
      </label>
    </div>
  )
}

// 添加 DOM 加载后的交互逻辑
CardMode.beforeDOMLoaded = `
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('card-mode-toggle');
  const contentContainer = document.querySelector('.content-container');
  const flashcardContainer = document.querySelector('.flashcard-container');

  toggle.addEventListener('change', (e) => {
    const isCardMode = e.target.checked;
    contentContainer.style.display = isCardMode ? 'none' : 'block';
    flashcardContainer.style.display = isCardMode ? 'block' : 'none';
  });
});
`

CardMode.css = styles
export default (() => CardMode) satisfies QuartzComponentConstructor
```

1. 这里返回的是一个工厂函数，可以在layout中使用，但是如果在其他组件中使用则需要实例化
2. 组件的逻辑可以写在组件文件中，也可以写在单独的文件中，一般放在 `scripts/xxx.inline.ts`，然后导入使用，但需要在导入前添加`// @ts-**ignore**`
	
	```typescript
	// @ts-ignore
	
	import menubuttonScript from "./scripts/menubutton.inline"
	```
	

### 5.2 创建闪卡组件

然后创建 `Flashcard.tsx` 组件：

```typescript
import { QuartzComponent, QuartzComponentProps } from "./types"

const Flashcard: QuartzComponent = (props: QuartzComponentProps) => {
  return (
    <div class="flashcard-container">
      <div class="flashcard-wrapper">
        <button class="card-nav prev" aria-label="Previous card">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button class="card-nav next" aria-label="Next card">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        <div class="flashcard active">
          <div class="card-content">
            <h3>卡片 1</h3>
            <p>这是第一张卡片的内容</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard
```

### 5.3 添加组件样式

创建 `cardmode.scss` 样式文件：

```scss
.mode-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  margin: 0 10px;

  .switch {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;

    input {
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .slider {
        background-color: var(--secondary);
      }

      &:checked + .slider:before {
        transform: translateX(20px);
      }
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--lightgray);
      transition: .4s;
      border-radius: 20px;

      &:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }

      .article-icon,
      .card-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: var(--dark);
        transition: .4s;
      }

      .article-icon {
        left: 4px;
      }

      .card-icon {
        right: 4px;
        opacity: 0;
      }

      input:checked ~ & {
        .article-icon {
          opacity: 0;
        }
        .card-icon {
          opacity: 1;
        }
      }
    }
  }
}
```

### 5.4 导出组件

在 `quartz/quartz/components/index.ts` 中导出组件：

```typescript
import CardMode from "./CardMode"
import Flashcard from "./Flashcard"

export { CardMode, Flashcard }
```

### 5.5 注册组件

在 `quartz.config.ts` 中注册这些组件：

```typescript
plugins: {
  components: [
    Plugin.CardMode(),
    Plugin.Flashcard(),
    // ... 其他组件
  ]
}
```

### 5.6 使用组件

组件可以在两个地方使用：

1. **布局配置**：在 `quartz.config.ts` 的 `layout` 配置中使用组件：

```typescript
layout: {
  pageTitle: "{{ title }}",
  header: [
    Plugin.Search(),
    Plugin.CardMode(),  // 在页面头部使用卡片模式切换
    Plugin.Darkmode(),
  ],
  footer: [
    Plugin.Footer(),
  ],
  leftSidebar: [
    Plugin.PageTitle(),
    Plugin.Search(),
    Plugin.TOC(),
  ],
  rightSidebar: [
    Plugin.Graph(),
    Plugin.Backlinks(),
    Plugin.Flashcard(),  // 在右侧边栏使用闪卡
  ],
}
```

2. **其他组件中**：组件可以在其他组件中引用和使用：

```typescript
import { CardMode } from "../components"

const CustomComponent: QuartzComponent = (props) => {
  return (
    <div>
      <CardMode {...props} />
      {/* 其他内容 */}
    </div>
  )
}
```

## 6. 响应式设计

Quartz4 提供了响应式设计的支持，我们可以在 `custom.scss` 中添加媒体查询：

```scss
@media (max-width: 800px) {
  body {
    font-size: 15px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
  
  h3 {
    font-size: 1.25rem;
  }
}
```

## 7. 使用内置布局选项

Quartz4 提供了多种内置的布局选项，可以在 `quartz.config.ts` 中配置：

```typescript
configuration: {
  enableSPA: true,        // 启用单页应用模式
  enablePopovers: true,   // 启用弹出提示
  defaultDateType: "modified", // 默认日期类型
}
```

## 8. 最佳实践

1. **保持核心代码不变**：所有的自定义都应该通过配置文件或自定义样式实现，避免修改 Quartz4 的核心代码。

2. **使用 CSS 变量**：尽可能使用 Quartz4 提供的 CSS 变量（如 `var(--dark)`、`var(--secondary)` 等），这样可以保持主题的一致性。

3. **渐进式增强**：先使用 Quartz4 提供的配置选项，当配置选项无法满足需求时，再通过自定义样式来实现。

4. **保持响应式**：确保自定义样式在不同设备上都能正常显示。

5. **组件化开发**：将功能拆分为独立的组件，提高代码的可维护性和复用性。

6. **组件导出**：确保在 `index.ts` 中正确导出组件，这样其他组件才能引用。

7. **布局规划**：合理规划组件在布局中的位置，考虑用户体验和页面结构。

## 9. 调试技巧

1. 使用浏览器的开发者工具检查元素，了解样式继承关系。
2. 在 `custom.scss` 中使用 `!important` 时要谨慎，优先考虑提高选择器优先级。
3. 使用 SCSS 的嵌套特性来组织样式代码，提高可维护性。
4. 使用 TypeScript 的类型系统来确保组件的正确性。
5. 检查组件是否正确导出和注册。

## 10. 参考资源

- [Quartz4 官方文档](https://quartz.jzhao.xyz/docs/)
- [Quartz4 GitHub 仓库](https://github.com/jackyzha0/quartz)
- [Quartz4 组件示例](https://github.com/jackyzha0/quartz/tree/main/quartz/components)

## 结语

通过以上方法，我们可以优雅地定制 Quartz4，使其更符合我们的需求。记住，好的定制应该是在不破坏原有功能的基础上，通过配置和样式来实现的。如果你有特定的定制需求，欢迎在评论区讨论。 