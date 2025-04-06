# Obsidian 链接图实现文档

## 设计目标

1. 清晰展示文档之间的关系
   - 当前文档居中
   - 入链文档在左侧
   - 出链文档在右侧
   - 使用不同颜色区分节点类型

2. 良好的可视化效果
   - 节点使用圆角矩形
   - 文本自动换行和居中
   - 连接线带有箭头指示方向
   - 支持深色/浅色主题

3. 流畅的交互体验
   - 支持画布拖拽
   - 支持缩放
   - 节点悬停高亮相关连接
   - 点击节点跳转

## 技术实现

### 1. 渲染技术选择

从 PIXI.js 迁移到 SVG + D3.js 的原因：

- SVG 优势：
  - 矢量图形，缩放不失真
  - 原生文本渲染，字体清晰
  - 自动处理抗锯齿
  - 完美支持高 DPI 显示器
  - DOM 操作更直观

- D3.js 优势：
  - 强大的数据绑定机制
  - 内置的缩放和拖拽功能
  - 丰富的图形操作 API
  - 优秀的性能表现

### 2. 数据结构

```typescript
interface NodeData {
  id: SimpleSlug
  text: string
  type: NodeType  // "inlink" | "current" | "outlink"
  linksCount: number
  textLines?: string[]
  x?: number
  y?: number
  width?: number
  height?: number
}

interface LinkData {
  source: NodeData
  target: NodeData
  direction: "in" | "out"
}
```

### 3. 核心功能实现

#### 3.1 节点布局

- 当前节点位于画布中心
- 入链节点在左侧 1/4 处垂直排列
- 出链节点在右侧 3/4 处垂直排列
- 自动计算节点间距，避免重叠

```typescript
function layoutNodes(nodes, links, width, height, options) {
  // 当前节点居中
  currentNode.x = width / 2
  currentNode.y = height / 2

  // 入链节点左侧排列
  inlinks.forEach(node => {
    node.x = width * 0.25
    node.y = inlinkY + node.height / 2
    inlinkY += node.height + 20
  })

  // 出链节点右侧排列
  outlinks.forEach(node => {
    node.x = width * 0.75
    node.y = outlinkY + node.height / 2
    outlinkY += node.height + 20
  })
}
```

#### 3.2 文本渲染

- 自动计算文本宽度和换行
- 使用 SVG text 和 tspan 元素
- 支持多行文本居中对齐
- 根据节点类型设置颜色

#### 3.3 连接线绘制

- 从节点边缘开始和结束
- 添加箭头标记
- 支持悬停高亮
- 适当的透明度

### 4. 交互功能

1. 缩放
   - 使用 D3.zoom
   - 设置合理的缩放范围
   - 保持文本清晰度

2. 悬停效果
   - 高亮相关节点和连接
   - 降低其他元素透明度
   - 平滑的过渡动画

3. 点击跳转
   - 使用 SPA 导航
   - 保持应用状态

### 5. 主题适配

- 支持深色/浅色模式
- 动态更新颜色
- 保持足够的对比度
- 合适的透明度

## 注意事项

1. 性能优化
   - 避免频繁的 DOM 操作
   - 使用 D3 的数据绑定机制
   - 合理设置更新频率

2. 可访问性
   - 合适的字体大小
   - 足够的颜色对比度
   - 清晰的视觉反馈

3. 代码维护
   - 清晰的代码结构
   - 完善的类型定义
   - 详细的注释说明

4. 浏览器兼容
   - 检查 SVG 特性支持
   - 处理高 DPI 显示器
   - 适配不同平台

## 未来改进

1. 功能增强
   - 支持节点折叠/展开
   - 添加缩略图导航
   - 支持搜索和过滤

2. 视觉优化
   - 添加平滑动画
   - 优化连接线路由
   - 支持自定义样式

3. 交互增强
   - 键盘快捷键
   - 手势操作
   - 更多自定义选项

4. 性能优化
   - 虚拟化大量节点
   - 优化重绘策略
   - 减少内存占用 