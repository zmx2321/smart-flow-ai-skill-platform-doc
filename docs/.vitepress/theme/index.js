import DefaultTheme from "vitepress/theme"
import { inBrowser, useRoute } from "vitepress"
import { h, nextTick, onBeforeUnmount, onMounted, watch } from "vue"

import "./styles/custom.scss"

const normalizePath = (pathname = "/") => pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/+$/, "") || "/"

const NAVBAR_TRIGGER_BUFFER = 12
const NAVBAR_MIN_TRIGGER = 12

const syncCurrentMenuState = () => {
  if (!inBrowser) {
    return
  }

  const currentPath = normalizePath(window.location.pathname)

  document.querySelectorAll("[data-smartflow-current='true']").forEach((node) => {
    node.removeAttribute("data-smartflow-current")
  })

  document.querySelectorAll(".VPSidebar .link, .VPMenuLink .link").forEach((node) => {
    const href = node.getAttribute("href")

    if (!href || href.startsWith("#")) {
      return
    }

    let url

    try {
      url = new URL(href, window.location.origin)
    } catch {
      return
    }

    if (normalizePath(url.pathname) === currentPath) {
      node.setAttribute("data-smartflow-current", "true")
    }
  })
}

const getNavbarTriggerTarget = () => {
  if (!inBrowser) {
    return null
  }

  const selectors = [
    ".VPHome .VPHero .container",
    ".VPDoc .brand-page-shell",
    ".VPDoc .vp-doc > h1",
    ".VPDoc .vp-doc > :first-child",
  ]

  for (const selector of selectors) {
    const node = document.querySelector(selector)

    if (node) {
      return node
    }
  }

  return null
}

const getNavbarTriggerOffset = () => {
  if (!inBrowser) {
    return NAVBAR_MIN_TRIGGER
  }

  const navbar = document.querySelector(".VPNavBar")
  const target = getNavbarTriggerTarget()
  const navbarHeight = navbar?.getBoundingClientRect().height ?? 0

  if (!target) {
    return Math.max(NAVBAR_MIN_TRIGGER, Math.round(navbarHeight))
  }

  const targetTop = target.getBoundingClientRect().top + window.scrollY

  return Math.max(NAVBAR_MIN_TRIGGER, Math.round(targetTop - navbarHeight - NAVBAR_TRIGGER_BUFFER))
}

const syncNavbarTopState = () => {
  if (!inBrowser) {
    return
  }

  const isTop = window.scrollY < getNavbarTriggerOffset()
  const value = isTop ? "true" : "false"

  document.documentElement.setAttribute("data-smartflow-nav-top", value)

  document.querySelectorAll(".VPNavBar").forEach((node) => {
    node.setAttribute("data-smartflow-nav-top", value)
  })
}

const ThemeStateSync = {
  name: "ThemeStateSync",
  setup() {
    const route = useRoute()
    let frame = 0

    const apply = () => {
      if (!inBrowser) {
        return
      }

      frame = 0
      syncCurrentMenuState()
      syncNavbarTopState()
    }

    const queueApply = () => {
      if (!inBrowser || frame) {
        return
      }

      frame = window.requestAnimationFrame(apply)
    }

    onMounted(() => {
      apply()
      window.addEventListener("scroll", queueApply, { passive: true })
    })

    onBeforeUnmount(() => {
      if (!inBrowser) {
        return
      }

      window.removeEventListener("scroll", queueApply)

      if (frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
    })

    watch(
      () => route.path,
      async () => {
        await nextTick()
        apply()
      }
    )

    return () => null
  },
}

const HomeHeroCode = {
  name: "HomeHeroCode",
  setup() {
    return () =>
      h("div", { class: "home-hero-code" }, [
        h("div", { class: "home-hero-code__head" }, [
          h("div", { class: "home-hero-code__dots" }, [
            h("span", { class: "home-hero-code__dot home-hero-code__dot--red" }),
            h("span", { class: "home-hero-code__dot home-hero-code__dot--yellow" }),
            h("span", { class: "home-hero-code__dot home-hero-code__dot--green" }),
          ]),
          h("span", { class: "home-hero-code__file" }, "demo/preview.flow.ts"),
          h("span", { class: "home-hero-code__status" }, "welcome"),
        ]),
        h("div", { class: "home-hero-code__body" }, [
          h("div", { class: "home-hero-code__line" }, [
            h("span", { class: "home-hero-code__line-no" }, "01"),
            h("span", { class: "home-hero-code__line-text" }, [
              h("span", { class: "token-keyword" }, "const"),
              " ",
              h("span", { class: "token-variable" }, "visitor"),
              " ",
              h("span", { class: "token-operator" }, "="),
              " ",
              h("span", { class: "token-string" }, "'welcome_to_smartflow'"),
            ]),
          ]),
          h("div", { class: "home-hero-code__line" }, [
            h("span", { class: "home-hero-code__line-no" }, "02"),
            h("span", { class: "home-hero-code__line-text" }, [
              h("span", { class: "token-keyword" }, "const"),
              " ",
              h("span", { class: "token-variable" }, "message"),
              " ",
              h("span", { class: "token-operator" }, "="),
              " ",
              h("span", { class: "token-string" }, "'你好，欢迎来到智流'"),
            ]),
          ]),
          h("div", { class: "home-hero-code__line" }, [
            h("span", { class: "home-hero-code__line-no" }, "03"),
            h("span", { class: "home-hero-code__line-text" }, [
              h("span", { class: "token-keyword" }, "const"),
              " ",
              h("span", { class: "token-variable" }, "next"),
              " ",
              h("span", { class: "token-operator" }, "="),
              " ",
              h("span", { class: "token-operator" }, "["),
              h("span", { class: "token-string" }, "'free_trial'"),
              h("span", { class: "token-operator" }, ","),
              " ",
              h("span", { class: "token-string" }, "'team_demo'"),
              h("span", { class: "token-operator" }, ","),
              " ",
              h("span", { class: "token-string" }, "'private_deploy'"),
              h("span", { class: "token-operator" }, "]"),
            ]),
          ]),
          h("div", { class: "home-hero-code__line" }, [
            h("span", { class: "home-hero-code__line-no" }, "04"),
            h("span", { class: "home-hero-code__line-text" }, [
              h("span", { class: "token-comment" }, "// 先看体验入口，再继续看产品、CLI 和部署方式"),
            ]),
          ]),
          h("div", { class: "home-hero-code__line" }, [
            h("span", { class: "home-hero-code__line-no" }, "05"),
            h("span", { class: "home-hero-code__line-text" }, [
              h("span", { class: "token-keyword" }, "return"),
              " ",
              h("span", { class: "token-function" }, "showExecutionFeel"),
              h("span", { class: "token-operator" }, "("),
              h("span", { class: "token-accent" }, "'smartflow_docs'"),
              h("span", { class: "token-operator" }, ")"),
            ]),
          ]),
        ]),
        h("div", { class: "home-hero-code__footer" }, [
          h("span", { class: "home-hero-code__tag" }, "welcome"),
          h("span", { class: "home-hero-code__tag" }, "no login first"),
          h("span", { class: "home-hero-code__tag" }, "execution first"),
        ]),
      ])
  },
}

const HomeHeroAfter = {
  name: "HomeHeroAfter",
  setup() {
    return () =>
      h("div", { class: "home-hero-note" }, [
        h("div", { class: "home-hero-note__kicker" }, "Co-Build Program"),
        h("p", { class: "home-hero-note__text" }, [
          "我们正在寻找首批标杆共创客户。如果你正受困于 AI 落地过程中的管控、审计、集成或本地接入难题，欢迎继续沟通，",
          h("strong", null, "一起把下一代企业智能工作流定义清楚。"),
        ]),
      ])
  },
}

export default {
  ...DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "home-hero-image": () => h(HomeHeroCode),
      "home-hero-after": () => h(HomeHeroAfter),
      "layout-bottom": () => h(ThemeStateSync),
    }),
}
