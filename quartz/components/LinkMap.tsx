import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/linkmap.inline"
import style from "./styles/linkmap.scss"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

export interface LinkMapConfig {
  scale: number
  fontSize: number
  opacityScale: number
  inlinkColor: string
  outlinkColor: string
  currentColor: string
  lineColor: string
  lineWidth: number
  nodePadding: number
  nodeHeight: number
  nodeMinWidth: number
  showOnDefault: boolean
  darkMode: {
    inlinkColor: string
    outlinkColor: string
    currentColor: string
    lineColor: string
    background: string
  }
  lightMode: {
    inlinkColor: string
    outlinkColor: string
    currentColor: string
    lineColor: string
    background: string
  }
}

const defaultOptions: LinkMapConfig = {
  scale: 2,
  fontSize: 0.95,
  opacityScale: 1,
  inlinkColor: "#8E9AAF", // 柔和的蓝灰色
  outlinkColor: "#9FA8A3", // 柔和的灰绿色
  currentColor: "#C8553D", // 温暖的红褐色
  lineColor: "#000000", // 淡灰色线条
  lineWidth: 2, // 更细的线条
  nodePadding: 40, // 适中的内边距
  nodeHeight: 40, // 优雅的高度
  nodeMinWidth: 220, // 合适的最小宽度
  showOnDefault: false,
  darkMode: {
    inlinkColor: "#8E9AAF",
    outlinkColor: "#9FA8A3",
    currentColor: "#C8553D",
    lineColor: "#ffffff",
    background: "var(--light)",
  },
  lightMode: {
    inlinkColor: "#8E9AAF",
    outlinkColor: "#9FA8A3",
    currentColor: "#C8553D",
    lineColor: "#E5E5E5",
    background: "var(--light)",
  },
}

export default ((opts?: Partial<LinkMapConfig>) => {
  const LinkMap: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const options = { ...defaultOptions, ...opts }
    return (
      <div class={classNames(displayClass, "linkmap", options.showOnDefault ? "" : "hide-default")}>
        <div class="linkmap-outer">
          <div class="linkmap-container" data-cfg={JSON.stringify(options)}></div>
        </div>
        <div class="linkmap-expanded" role="dialog" aria-modal="true" aria-label="链接图全屏视图">
          <div class="linkmap-expanded-container" data-cfg={JSON.stringify(options)}></div>
        </div>
      </div>
    )
  }

  LinkMap.css = style
  LinkMap.afterDOMLoaded = script

  return LinkMap
}) satisfies QuartzComponentConstructor
