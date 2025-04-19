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
          light: "oklch(0.98 0.01 95.10)", // 米白色背景
          lightgray: "oklch(0.92 0.01 92.99)", // 浅灰色
          gray: "oklch(0.61 0.01 97.42)", // 中性灰
          darkgray: "oklch(0.43 0.02 98.60)", // 深灰色
          dark: "oklch(0.34 0.03 95.72)", // 近黑色
          secondary: "oklch(0.62 0.14 39.04)", // 橙色
          tertiary: "oklch(0.67 0.13 38.76)", // 深橙色
          highlight: "rgba(143, 159, 169, 0.15)", // 高亮色
          textHighlight: "rgba(98, 84, 73, 0.2)", // 文本高亮色
        },
        darkMode: {
          light: "oklch(0.27 0.00 106.64)", // 深色背景
          lightgray: "oklch(0.31 0.00 106.60)", // 深色浅灰
          gray: "oklch(0.77 0.02 99.07)", // 深色中灰
          darkgray: "oklch(0.92 0.00 106.48)", // 深色深灰
          dark: "oklch(0.98 0.01 95.10)", // 深色文本
          secondary: "oklch(0.67 0.13 38.76)", // 深色橙色
          tertiary: "oklch(0.67 0.13 38.7)", // 深色强调色
          highlight: "rgba(143, 159, 169, 0.15)", // 深色高亮
          textHighlight: "rgba(255, 255, 255, 0.2)", // 深色文本高亮
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
      Plugin.CrawlLinks({
        markdownLinkResolution: "shortest",
        externalLinkIcon: false,
        prettyLinks: false,
      }),
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
