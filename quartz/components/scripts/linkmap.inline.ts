import type { ContentDetails } from "../../plugins/emitters/contentIndex"
import { select, zoom } from "d3"
import { registerEscapeHandler, removeAllChildren } from "./util"
import { FullSlug, SimpleSlug, getFullSlug, resolveRelative, simplifySlug } from "../../util/path"
import { LinkMapConfig } from "../LinkMap"

interface NodeData {
  id: SimpleSlug
  text: string
  type: NodeType
  linksCount: number
  textLines?: string[]
  x?: number
  y?: number
  width?: number
  height?: number
  depth?: number
  children?: NodeData[]
}

interface LinkData {
  source: NodeData
  target: NodeData
  direction: "in" | "out"
}

type NodeType = "inlink" | "current" | "outlink"

function calculateNodeDimensions(
  node: NodeData,
  options: LinkMapConfig,
): { width: number; height: number } {
  // 计算每行最大字符数（考虑中文字符）
  const maxCharsPerLine = Math.floor(options.nodeMinWidth / (options.fontSize * 12))

  // 分词并计算字符宽度
  function getCharWidth(char: string): number {
    return char.match(/[\u4e00-\u9fa5]/) ? 2 : 1 // 中文字符计为2个单位宽度
  }

  // 文本分行
  let lines: string[] = []
  let currentLine = ""
  let currentLineWidth = 0

  // 逐字符处理文本
  for (let i = 0; i < node.text.length; i++) {
    const char = node.text[i]
    const charWidth = getCharWidth(char)

    // 检查添加当前字符是否会导致换行
    if (currentLineWidth + charWidth > maxCharsPerLine && currentLine.length > 0) {
      lines.push(currentLine)
      currentLine = char
      currentLineWidth = charWidth
    } else {
      currentLine += char
      currentLineWidth += charWidth
    }
  }

  // 处理最后一行
  if (currentLine) {
    lines.push(currentLine)
  }

  node.textLines = lines

  // 计算节点尺寸
  const maxLineLength = Math.max(
    ...lines.map((line) => Array.from(line).reduce((sum, char) => sum + getCharWidth(char), 0)),
  )

  const width = Math.max(
    options.nodeMinWidth,
    Math.min(
      maxLineLength * options.fontSize * 12,
      options.nodeMinWidth * 2, // 允许更宽的最大宽度
    ),
  )

  // 增加行间距
  const lineHeight = options.fontSize * 24 // 增加行高
  const height = Math.max(options.nodeHeight, lines.length * lineHeight + options.nodePadding * 2)

  return { width, height }
}

function layoutNodes(
  nodes: NodeData[],
  links: LinkData[],
  width: number,
  height: number,
  options: LinkMapConfig,
) {
  // 找到当前节点
  const currentNode = nodes.find((n) => n.type === "current")!
  const inlinks = nodes.filter((n) => n.type === "inlink")
  const outlinks = nodes.filter((n) => n.type === "outlink")

  // 计算所有节点的尺寸
  nodes.forEach((node) => {
    const dims = calculateNodeDimensions(node, options)
    node.width = dims.width
    node.height = dims.height
  })

  // 布局当前节点
  currentNode.x = width / 2
  currentNode.y = height / 2

  // 布局入链节点（左侧）
  const inlinkTotalHeight = inlinks.reduce((sum, n) => sum + (n.height ?? 0) + 20, 0)
  let inlinkY = height / 2 - inlinkTotalHeight / 2
  inlinks.forEach((node) => {
    node.x = width * 0.25
    node.y = inlinkY + (node.height ?? 0) / 2
    inlinkY += (node.height ?? 0) + 20
  })

  // 布局出链节点（右侧）
  const outlinkTotalHeight = outlinks.reduce((sum, n) => sum + (n.height ?? 0) + 20, 0)
  let outlinkY = height / 2 - outlinkTotalHeight / 2
  outlinks.forEach((node) => {
    node.x = width * 0.75
    node.y = outlinkY + (node.height ?? 0) / 2
    outlinkY += (node.height ?? 0) + 20
  })
}

function getThemeColors(isDark: boolean, options: LinkMapConfig): Partial<LinkMapConfig> {
  const colors = isDark ? options.darkMode : options.lightMode
  return {
    inlinkColor: colors.inlinkColor,
    outlinkColor: colors.outlinkColor,
    currentColor: colors.currentColor,
    lineColor: colors.lineColor,
  }
}

async function renderLinkMap(
  container: HTMLElement,
  fullSlug: FullSlug,
  isExpanded: boolean = false,
) {
  const slug = simplifySlug(fullSlug)
  removeAllChildren(container)

  const options: LinkMapConfig = JSON.parse(container.dataset.cfg!)
  const isDark = document.documentElement.getAttribute("saved-theme") === "dark"
  const themeColors = getThemeColors(isDark, options)
  Object.assign(options, themeColors)

  // 设置容器可以获得焦点
  container.setAttribute("tabindex", "0")
  container.style.outline = "none" // 移除默认的焦点轮廓

  // 设置容器背景色
  if (isExpanded) {
    const expandedContainer = container.closest(".linkmap-expanded") as HTMLElement
    if (expandedContainer) {
      expandedContainer.style.background = isDark
        ? options.darkMode.background
        : options.lightMode.background
      container.style.background = isDark
        ? options.darkMode.background
        : options.lightMode.background
    }
  }

  const data: Map<SimpleSlug, ContentDetails> = new Map(
    Object.entries<ContentDetails>(await fetchData).map(([k, v]) => [
      simplifySlug(k as FullSlug),
      v,
    ]),
  )

  // 构建节点和连接数据
  const nodes: NodeData[] = []
  const links: LinkData[] = []

  // 添加当前节点
  const currentNode: NodeData = {
    id: slug,
    text: data.get(slug)?.title ?? slug,
    type: "current",
    linksCount: 0,
    depth: 0,
  }
  nodes.push(currentNode)

  // 处理入链
  const inlinks = Array.from(data.entries())
    .filter(([_, details]) => details.links?.includes(slug))
    .map(([sourceSlug, details]) => ({
      id: sourceSlug,
      text: details.title ?? sourceSlug,
      type: "inlink" as NodeType,
      linksCount: details.links?.length ?? 0,
      depth: 0,
    }))
  nodes.push(...inlinks)

  // 处理出链
  const currentDetails = data.get(slug)
  if (currentDetails?.links) {
    const outlinks = currentDetails.links
      .filter((targetSlug) => data.has(targetSlug))
      .map((targetSlug) => {
        const details = data.get(targetSlug)!
        return {
          id: targetSlug,
          text: details.title ?? targetSlug,
          type: "outlink" as NodeType,
          linksCount: details.links?.length ?? 0,
          depth: 1,
        }
      })
    nodes.push(...outlinks)
  }

  // 创建连接
  inlinks.forEach((node) => {
    links.push({
      source: node,
      target: currentNode,
      direction: "in",
    })
  })

  currentDetails?.links?.forEach((targetId) => {
    const target = nodes.find((n) => n.id === targetId)
    if (target) {
      links.push({
        source: currentNode,
        target,
        direction: "out",
      })
    }
  })

  const width = container.offsetWidth
  const height = container.offsetHeight

  // 创建 SVG
  const svg = select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("class", "linkmap-svg")

  // 创建缩放容器
  const g = svg.append("g")

  // 布局节点
  layoutNodes(nodes, links, width, height, options)

  // 绘制连接
  const link = g
    .append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", options.lineColor)
    .attr("stroke-width", options.lineWidth)
    .attr("stroke-opacity", 0.6)
    .attr("marker-end", "url(#arrow)")
    .attr("x1", (d) => {
      const sourceWidth = d.source.width ?? 0
      const sourceHeight = d.source.height ?? 0
      const dx = (d.target.x ?? 0) - (d.source.x ?? 0)
      const dy = (d.target.y ?? 0) - (d.source.y ?? 0)
      const angle = Math.atan2(dy, dx)

      // 计算矩形框边缘的交点
      const xIntersect = (Math.abs(Math.cos(angle)) * sourceWidth) / 2
      const yIntersect = (Math.abs(Math.sin(angle)) * sourceHeight) / 2
      const scale = Math.min(
        xIntersect / Math.abs(Math.cos(angle) || 1),
        yIntersect / Math.abs(Math.sin(angle) || 1),
      )

      return (d.source.x ?? 0) + Math.cos(angle) * scale
    })
    .attr("y1", (d) => {
      const sourceWidth = d.source.width ?? 0
      const sourceHeight = d.source.height ?? 0
      const dx = (d.target.x ?? 0) - (d.source.x ?? 0)
      const dy = (d.target.y ?? 0) - (d.source.y ?? 0)
      const angle = Math.atan2(dy, dx)

      // 计算矩形框边缘的交点
      const xIntersect = (Math.abs(Math.cos(angle)) * sourceWidth) / 2
      const yIntersect = (Math.abs(Math.sin(angle)) * sourceHeight) / 2
      const scale = Math.min(
        xIntersect / Math.abs(Math.cos(angle) || 1),
        yIntersect / Math.abs(Math.sin(angle) || 1),
      )

      return (d.source.y ?? 0) + Math.sin(angle) * scale
    })
    .attr("x2", (d) => {
      const targetWidth = d.target.width ?? 0
      const targetHeight = d.target.height ?? 0
      const dx = (d.target.x ?? 0) - (d.source.x ?? 0)
      const dy = (d.target.y ?? 0) - (d.source.y ?? 0)
      const angle = Math.atan2(dy, dx)

      // 计算矩形框边缘的交点
      const xIntersect = (Math.abs(Math.cos(angle)) * targetWidth) / 2
      const yIntersect = (Math.abs(Math.sin(angle)) * targetHeight) / 2
      const scale = Math.min(
        xIntersect / Math.abs(Math.cos(angle) || 1),
        yIntersect / Math.abs(Math.sin(angle) || 1),
      )

      return (d.target.x ?? 0) - Math.cos(angle) * scale
    })
    .attr("y2", (d) => {
      const targetWidth = d.target.width ?? 0
      const targetHeight = d.target.height ?? 0
      const dx = (d.target.x ?? 0) - (d.source.x ?? 0)
      const dy = (d.target.y ?? 0) - (d.source.y ?? 0)
      const angle = Math.atan2(dy, dx)

      // 计算矩形框边缘的交点
      const xIntersect = (Math.abs(Math.cos(angle)) * targetWidth) / 2
      const yIntersect = (Math.abs(Math.sin(angle)) * targetHeight) / 2
      const scale = Math.min(
        xIntersect / Math.abs(Math.cos(angle) || 1),
        yIntersect / Math.abs(Math.sin(angle) || 1),
      )

      return (d.target.y ?? 0) - Math.sin(angle) * scale
    })

  // 添加箭头标记
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20) // 调整箭头参考点，使其正好在线段末端
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", options.lineColor)
    .attr("d", "M0,-4L8,0L0,4")

  // 创建节点组
  const node = g
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    .style("cursor", "pointer")

  // 绘制节点背景
  node
    .append("rect")
    .attr("x", (d) => -(d.width ?? 0) / 2)
    .attr("y", (d) => -(d.height ?? 0) / 2)
    .attr("width", (d) => d.width ?? 0)
    .attr("height", (d) => d.height ?? 0)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("fill", (d) => {
      const color =
        d.type === "current"
          ? options.currentColor
          : d.type === "inlink"
            ? options.inlinkColor
            : options.outlinkColor
      return color + "1A" // 10% opacity
    })
    .attr("stroke", (d) =>
      d.type === "current"
        ? options.currentColor
        : d.type === "inlink"
          ? options.inlinkColor
          : options.outlinkColor,
    )
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.3)

  // 添加文本
  node
    .append("text")
    .selectAll("tspan")
    .data((d) => d.textLines ?? [d.text])
    .join("tspan")
    .attr("x", 0)
    .attr("y", (_, i, nodes) => {
      const lineHeight = options.fontSize * 24
      const totalHeight = nodes.length * lineHeight
      return `${i * lineHeight - totalHeight / 2 + lineHeight / 2}px`
    })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", `${options.fontSize}em`)
    .style("font-weight", "500") // 稍微加粗
    .style("fill", (_, i, nodes) => {
      const element = nodes[i] as SVGTSpanElement
      const parentNode = element.parentElement
      if (!parentNode) return options.currentColor
      const nodeData = select(parentNode).datum() as NodeData
      return nodeData.type === "current"
        ? options.currentColor
        : nodeData.type === "inlink"
          ? options.inlinkColor
          : options.outlinkColor
    })
    .text((d) => d)

  // 添加悬停效果
  node.on("mouseover", function (event, d) {
    const relatedLinks = links.filter((l) => l.source === d || l.target === d)
    const relatedNodes = new Set(relatedLinks.flatMap((l) => [l.source, l.target]))

    link.attr("stroke-opacity", (l) => (relatedLinks.includes(l) ? 0.8 : 0.2))

    node.style("opacity", (n) => (relatedNodes.has(n) || n === d ? 1 : 0.2))
  })

  node.on("mouseout", function () {
    link.attr("stroke-opacity", 0.6)
    node.style("opacity", 1)
  })

  // 添加点击事件
  node.on("click", (_, d) => {
    if (d.id !== slug) {
      const targ = resolveRelative(fullSlug, d.id)
      window.spaNavigate(new URL(targ, window.location.toString()))
    }
  })

  // 添加缩放功能
  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .extent([
      [0, 0],
      [width, height],
    ])
    .scaleExtent([0.25, 4])
    .on("zoom", ({ transform }) => {
      g.attr("transform", transform.toString())
    })

  svg.call(zoomBehavior)

  // 在渲染完成后获取焦点
  requestAnimationFrame(() => {
    container.focus()
  })

  return () => {
    svg.remove()
  }
}

// 暴露 renderLinkMap 到全局作用域
declare global {
  interface Window {
    renderLinkMap: typeof renderLinkMap
  }
}
window.renderLinkMap = renderLinkMap

document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
  const slug = e.detail.url
  const containers = document.getElementsByClassName("linkmap-container")

  for (const container of containers) {
    await renderLinkMap(container as HTMLElement, slug)
  }
})
