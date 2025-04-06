import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "软体动物",
    pageTitleSuffix: "Software animal",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "hanxiaomax.github.io/quartz-obsidian-publish",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "local",
      cdnCaching: true,
      typography: {
        header: "Silkscreen",
        body: "Silkscreen",
        code: "Silkscreen",
      },
      colors: {
        lightMode: {
          light: "#ffffff", // 白练 - Shiroaji，温暖的米白色
          lightgray: "#eae5e3", // 白鼠 - Shironezumi，淡灰白
          gray: "#8f8681", // 茶鼠 - Chanezumi，温暖的中性灰
          darkgray: "#595455", // 墨 - Sumi，深沉的暖灰
          dark: "#2d2b2b", // 烏羽 - Karasuhane，近黑色
          secondary: "#927b6c", // 江戸茶 - Edocha，温暖的褐色
          tertiary: "rgba(212, 103, 25, 0.9)",
          highlight: "rgba(212, 103, 25, 0.5)",
          textHighlight: "rgba(146, 123, 108, 0.2)", // 江戸茶 - Edocha 的淡色版本
        },
        darkMode: {
          light: "#2d2b2b", // 烏羽 - Karasuhane
          lightgray: "#3a3837", // 深い烏羽
          gray: "#8f8681", // 茶鼠 - Chanezumi
          darkgray: "#eae5e3", // 胡桃 - Kurumi
          dark: "#eae5e3", // 白鼠 - Shironezumi
          secondary: "#c7b7ae", // 亜麻色 - Amairo，淡褐色
          tertiary: "#d3c7c1", // 灰桜 - Haizakura，淡粉褐色
          highlight: "rgba(143, 159, 169, 0.15)", //
          textHighlight: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "rose-pine-dawn",
          dark: "tokyo-night",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest", externalLinkIcon: false }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
