// @ts-ignore
import menubuttonScript from "./scripts/menubutton.inline"
import styles from "./styles/menuButton.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

type IconType =
  | string
  | { light: string; dark: string }
  | { top: string; bottom: string }
  | { open: string; close: string }

interface MenuAction {
  icon: IconType
  label: string
  action: string
}

const MenuButton: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  const currentTheme =
    typeof window !== "undefined" ? document.documentElement.getAttribute("saved-theme") : "light"

  const menuItems: MenuAction[] = [
    {
      icon: {
        light: `<i class="fa-solid fa-sun"></i>`,
        dark: `<i class="fa-solid fa-moon"></i>`,
      },
      label: currentTheme === "dark" ? "日间模式" : "夜间模式",
      action: "toggleDarkMode",
    },
    {
      icon: {
        top: `<i class="fa-solid fa-arrow-down"></i>`,
        bottom: `<i class="fa-solid fa-arrow-up"></i>`,
      },
      label: "转到文末",
      action: "toggleScroll",
    },
    {
      icon: {
        open: `<i class="fa-solid fa-expand"></i>`,
        close: `<i class="fa-solid fa-compress"></i>`,
      },
      label: "展开链接图",
      action: "expandLinkMap",
    },
  ]

  return (
    <div class={classNames(displayClass, "menu-button")}>
      <div class="menu-items">
        {menuItems.map((item, index) => {
          const buttonClasses = ["menu-item"]
          if (item.action === "toggleDarkMode") {
            buttonClasses.push("darkmode", "theme-toggle")
          }
          if (item.action === "toggleScroll") {
            buttonClasses.push("scroll-toggle")
          }
          if (item.action === "expandLinkMap") {
            buttonClasses.push("linkmap-toggle")
          }
          return (
            <button
              key={index}
              class={buttonClasses.join(" ")}
              aria-label={item.label}
              data-action={item.action}
            >
              {item.action === "toggleDarkMode" &&
              typeof item.icon === "object" &&
              "light" in item.icon ? (
                <>
                  <span class="light-icon" dangerouslySetInnerHTML={{ __html: item.icon.light }} />
                  <span class="dark-icon" dangerouslySetInnerHTML={{ __html: item.icon.dark }} />
                </>
              ) : item.action === "toggleScroll" &&
                typeof item.icon === "object" &&
                "top" in item.icon ? (
                <>
                  <span class="top-icon" dangerouslySetInnerHTML={{ __html: item.icon.top }} />
                  <span
                    class="bottom-icon"
                    dangerouslySetInnerHTML={{ __html: item.icon.bottom }}
                  />
                </>
              ) : item.action === "expandLinkMap" &&
                typeof item.icon === "object" &&
                "open" in item.icon ? (
                <>
                  <span class="open-icon" dangerouslySetInnerHTML={{ __html: item.icon.open }} />
                  <span class="close-icon" dangerouslySetInnerHTML={{ __html: item.icon.close }} />
                </>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: item.icon as string }} />
              )}
            </button>
          )
        })}
      </div>
      <div class="switch">
        <button class="slider" aria-label="Toggle menu">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>
  )
}

MenuButton.beforeDOMLoaded = menubuttonScript

MenuButton.css = styles
export default (() => MenuButton) satisfies QuartzComponentConstructor
