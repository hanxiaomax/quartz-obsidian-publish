import { FullSlug, getFullSlug } from "../../util/path"

const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const currentTheme = localStorage.getItem("theme") ?? userPref
document.documentElement.setAttribute("saved-theme", currentTheme)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

// 更新暗色模式按钮的标签
const updateDarkModeLabel = () => {
  const darkModeButton = document.querySelector(".darkmode")
  if (!darkModeButton) return

  const isDark = document.documentElement.getAttribute("saved-theme") === "dark"
  darkModeButton.setAttribute("aria-label", isDark ? "日间模式" : "夜间模式")
}

// 检查是否接近底部
const isNearBottom = () => {
  const scrollPosition = window.scrollY + window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  return Math.abs(scrollPosition - documentHeight) < 50
}

// 更新滚动按钮状态和标签
const updateScrollButtonState = () => {
  const scrollButton = document.querySelector(".scroll-toggle")
  if (!scrollButton) return
  const isBottom = isNearBottom()
  scrollButton.classList.toggle("at-bottom", !isBottom)
  scrollButton.setAttribute("aria-label", isBottom ? "回到顶部" : "转到文末")
}

// 处理滚动
const handleScroll = () => {
  if (isNearBottom()) {
    window.scrollTo({ top: 0, behavior: "smooth" })
  } else {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }
}

// 处理链接图展开按钮点击
function setupLinkMapButton() {
  const linkMapButton = document.querySelector(".linkmap-toggle") as HTMLElement
  if (!linkMapButton) return

  const handleLinkMapToggle = () => {
    // 找到链接图组件
    const linkmap = document.querySelector(".linkmap")
    if (!linkmap) return

    // 获取展开容器
    const expandedContainer = linkmap.querySelector(".linkmap-expanded") as HTMLElement
    if (!expandedContainer) return

    const isExpanded = expandedContainer.classList.contains("active")

    if (!isExpanded) {
      // 展开操作
      expandedContainer.classList.add("active")
      document.body.style.overflow = "hidden"

      // 设置 sidebar 的 z-index
      const sidebar = linkmap.closest(".sidebar") as HTMLElement
      if (sidebar) {
        sidebar.style.zIndex = "1"
      }

      // 渲染展开的链接图
      const expandedLinkmap = expandedContainer.querySelector(
        ".linkmap-expanded-container",
      ) as HTMLElement
      if (expandedLinkmap) {
        const fullSlug = getFullSlug(window)
        const container = document.querySelector(".linkmap-container") as HTMLElement
        if (container) {
          const options = JSON.parse(container.dataset.cfg || "{}")
          expandedLinkmap.dataset.cfg = JSON.stringify(options)
          window.renderLinkMap?.(expandedLinkmap, fullSlug, true)

          // 等待渲染完成后，让 canvas 获得焦点
          setTimeout(() => {
            const canvas = expandedLinkmap.querySelector("canvas")
            if (canvas) {
              canvas.setAttribute("tabindex", "0")
              canvas.focus()
            }
          }, 100)
        }
      }

      // 添加点击外部区域关闭的事件
      const handleOutsideClick = (e: MouseEvent) => {
        const canvas = expandedContainer.querySelector("canvas")
        // 如果点击的是 canvas 或者 toggle 按钮，不关闭
        if (
          e.target === canvas ||
          e.target === linkMapButton ||
          linkMapButton.contains(e.target as Node)
        ) {
          return
        }
        // 如果点击的是展开容器的空白区域，关闭
        if (
          e.target === expandedContainer ||
          e.target === expandedContainer.querySelector(".linkmap-expanded-container")
        ) {
          handleLinkMapToggle()
          document.removeEventListener("click", handleOutsideClick)
        }
      }
      document.addEventListener("click", handleOutsideClick)

      // 添加 Escape 键关闭事件
      const escHandler = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleLinkMapToggle()
          document.removeEventListener("keydown", escHandler)
          document.removeEventListener("click", handleOutsideClick)
        }
      }
      document.addEventListener("keydown", escHandler)
    } else {
      // 关闭操作
      expandedContainer.classList.remove("active")
      document.body.style.overflow = ""

      // 重置 sidebar 的 z-index
      const sidebar = linkmap.closest(".sidebar") as HTMLElement
      if (sidebar) {
        sidebar.style.zIndex = ""
      }
    }

    // 更新按钮图标状态
    linkMapButton.classList.toggle("active")
  }

  linkMapButton.addEventListener("click", handleLinkMapToggle)
  window.addCleanup(() => linkMapButton.removeEventListener("click", handleLinkMapToggle))
}

document.addEventListener("nav", () => {
  const switchTheme = () => {
    const newTheme =
      document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
    updateDarkModeLabel()
  }

  const themeChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? "dark" : "light"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
    updateDarkModeLabel()
  }

  // 设置暗色模式按钮事件
  for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
    darkmodeButton.addEventListener("click", switchTheme)
    window.addCleanup(() => darkmodeButton.removeEventListener("click", switchTheme))
  }

  // 设置滚动按钮事件
  for (const scrollButton of document.getElementsByClassName("scroll-toggle")) {
    scrollButton.addEventListener("click", handleScroll)
    window.addCleanup(() => scrollButton.removeEventListener("click", handleScroll))
  }

  // 监听滚动事件
  window.addEventListener("scroll", updateScrollButtonState)
  window.addCleanup(() => window.removeEventListener("scroll", updateScrollButtonState))

  // 初始化按钮状态
  updateScrollButtonState()
  updateDarkModeLabel()

  // 监听颜色主题变化
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))

  // 添加链接图展开按钮事件
  setupLinkMapButton()
})
