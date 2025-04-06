---
title: Quartz4 核心特性与定制概览
description: 总结 Quartz4 的主要功能、定制选项和构建流程
date: 2024-04-03
tags:
  - quartz
---

# Quartz4 核心特性与定制概览

Quartz4 是一个强大的静态网站生成器，特别适合用于构建个人知识库和数字花园。它提供了丰富的功能和灵活的定制选项。

## 核心特性

Quartz4 提供了许多开箱即用的功能，帮助你快速构建美观且功能强大的网站：

- **[链接预览 (Popover Previews)](https://quartz.jzhao.xyz/features/popover-previews)**：像维基百科一样，鼠标悬停在内部链接上时会显示页面预览弹窗，方便快速浏览内容。默认情况下，这只对本地 vault 内的页面有效。你可以通过在自定义组件中添加 `popover-hint` 类来包含自定义内容。通过 `quartz.config.ts` 中的 `enablePopovers` 选项可以禁用此功能。

- **[全文搜索 (Full-text Search)](https://quartz.jzhao.xyz/features/full-text-search)**：基于 Flexsearch 实现，提供快速的全文搜索功能，支持中日韩字符。可以通过 `⌘/ctrl + K` 打开搜索框，或使用 `#` 前缀搜索标签。搜索功能依赖 `ContentIndex` 插件，并可以通过修改 `search.inline.ts` 中的参数进行调整。

- **[反向链接 (Backlinks)](https://quartz.jzhao.xyz/features/backlinks)**：自动显示链接到当前页面的其他页面列表，方便在知识网络中导航。如果启用了链接预览，反向链接列表中的链接也会有预览效果。可以通过 `quartz.layout.ts` 移除 `Component.Backlinks()` 来禁用，或通过 `{ hideWhenEmpty: false }` 来配置空状态下的显示。

- **[目录 (Table of Contents)](https://quartz.jzhao.xyz/features/table-of-contents)**：根据页面中的标题自动生成目录，并高亮显示当前滚动位置。可以通过页面的 frontmatter `enableToc: false` 来禁用单页的 TOC。此功能由 `TableOfContents` 插件提供，并在布局中通过 `TableOfContents` 组件显示。

## 定制选项

Quartz4 的设计允许高度定制，而无需修改核心代码：

- **布局配置 (`quartz.layout.ts`)**：定义页面的整体结构，例如页眉、页脚、侧边栏包含哪些组件。你可以通过修改这个文件来添加、移除或重新排列组件。
- **配置文件 (`quartz.config.ts`)**：配置网站的基本信息（标题、URL 等）、主题（颜色、字体）、插件和全局选项（如 `enablePopovers`）。
- **自定义样式 (`custom.scss`)**：覆盖或扩展默认样式，实现个性化的视觉效果。
- **自定义组件**：创建自己的 React/Preact 组件 (`.tsx`) 和对应的样式 (`.scss`)，并在 `index.ts` 中导出，然后在布局或配置文件中注册和使用，以实现独特的功能。

## 构建流程

根据 [Quartz4 架构文档](https://quartz.jzhao.xyz/advanced/architecture)，其构建流程大致如下：

1.  **读取文件**：将 Markdown 文件读入 vfile。
2.  **文本转换**：应用插件定义的文本转换。
3.  **路径处理**：生成文件路径 slug。
4.  **Markdown 解析**：使用 `remark-parse` 将 Markdown 文本解析为 mdast (Markdown 抽象语法树)。
5.  **Markdown 转换**：应用插件定义的 mdast 到 mdast 的转换。
6.  **HTML 转换**：使用 `remark-rehype` 将 mdast 转换为 hast (HTML 抽象语法树)。
7.  **HTML 转换**：应用插件定义的 hast 到 hast 的转换。
8.  **内容过滤**：使用插件过滤不需要的内容。
9.  **文件生成 (Emit)**：
    *   收集所有插件声明的静态资源 (CSS, JS)。
    *   对于 HTML 文件，使用 `hast-util-to-jsx-runtime` 将 hast 转换为 JSX，然后使用 `preact-render-to-string` 渲染为静态 HTML。此过程会组装页面布局、内联脚本和样式。
    *   CSS 使用 Lightning CSS 进行压缩和转换。
    *   JS 脚本分为 `beforeDOMLoaded` (在 `<head>` 中) 和 `afterDOMLoaded` (在 `<body>` 中)。
    *   每个 Emitter 插件负责将生成的文件写入磁盘。
10. **服务模式 (`--serve`)**：如果使用了 `--serve` 标志，会启动一个文件监视器来检测 `.md` 文件的更改，并重新构建受影响的内容，然后通过 WebSocket 通知客户端刷新。

这个流程展示了 Quartz4 如何通过插件化的方式处理内容转换和页面生成，提供了强大的扩展性。 

## 定制开发关键信息

如果你想对 Quartz4 进行定制开发，以下是需要重点关注的配置和文档：

- **核心配置文件 (`quartz.config.ts`)**：这是定制的起点，用于配置网站基础信息、主题（颜色、字体）、插件列表和全局开关（如 [链接预览](https://quartz.jzhao.xyz/features/popover-previews) 的 `enablePopovers`）。

- **布局配置 (`quartz.layout.ts`)**：控制页面整体结构，决定哪些组件（如 [搜索栏](https://quartz.jzhao.xyz/features/full-text-search)、[反向链接](https://quartz.jzhao.xyz/features/backlinks)、[目录](https://quartz.jzhao.xyz/features/table-of-contents)）显示在页面的哪个部分（页眉、页脚、侧边栏）。移除或添加组件实例通常在这里进行。

- **自定义样式 (`quartz/styles/custom.scss`)**：覆盖或扩展 Quartz4 默认样式的入口点。结合浏览器的开发者工具，可以在这里调整视觉细节。

- **自定义组件 (`quartz/components/`)**：
    - 创建 `.tsx` 文件来定义新的 Preact 组件。
    - 创建对应的 `.scss` 文件来定义组件样式。
    - 在 `quartz/components/index.ts` 中导出新组件。
    - 在 `quartz.config.ts` 的 `plugins.components` 数组中注册组件。
    - 最后在 `quartz.layout.ts` 或其他组件中使用新组件。
    - 可以参考官方的 [组件示例](https://github.com/jackyzha0/quartz/tree/main/quartz/components)。

- **插件系统**：Quartz4 的许多核心功能（如 [目录](https://quartz.jzhao.xyz/features/table-of-contents)、[搜索索引](https://quartz.jzhao.xyz/features/full-text-search)）是通过插件实现的。理解插件类型（Transformers, Filters, Emitters）有助于进行更深层次的定制。可以参考 [Quartz4 架构文档](https://quartz.jzhao.xyz/advanced/architecture) 来了解插件如何在构建流程中工作。

- **脚本定制**：某些组件带有可配置的内联脚本（如 [搜索](https://quartz.jzhao.xyz/features/full-text-search) 的 `search.inline.ts`），可以调整其行为参数。

通过组合使用这些定制点，可以在不修改 Quartz4 核心代码库的前提下，实现高度个性化的网站。 