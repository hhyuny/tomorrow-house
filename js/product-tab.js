const productTab = document.querySelector('.product-tab')
const productTabButtonList = productTab.querySelectorAll('button')

const TOP_HEADER_DESKTOP = 80 + 50 + 54
const TOP_HEADER_MOBILE = 50 + 40 + 40

let currentActiveTab = productTab.querySelector('.is-active')
let disableUpdating = false

function toggleActiveTab() {
  const tabItem = this.parentNode

  if (currentActiveTab !== tabItem) {
    disableUpdating = true
    tabItem.classList.add('is-active')
    currentActiveTab.classList.remove('is-active')
    currentActiveTab = tabItem

    setTimeout(() => {
      disableUpdating = false
    }, 1000)
  }
}

function scrollToTabPanel() {
  const tabPanelId = this.parentNode.getAttribute('aria-labelledby')
  const tabPanel = document.querySelector(`#${tabPanelId}`)

  const scrollAmount =
    tabPanel.getBoundingClientRect().top -
    (window.innerWidth >= 768 ? TOP_HEADER_DESKTOP : TOP_HEADER_MOBILE)

  window.scrollBy({
    top: scrollAmount,
    behavior: 'smooth',
  })
}

productTabButtonList.forEach((button) => {
  button.addEventListener('click', toggleActiveTab)
  button.addEventListener('click', scrollToTabPanel)
})

// 스크롤 이벤트 핸들러를 만들기 전에 사전정보가 필요함
// 사전정보: 각 tabPanel의 y축 위치(문서의 시작점에서부터 얼마나 아래에 있는지)
// 어떤 요소의 y축 위치 = window.scrollY + element.getBoundingClientRect().top

const productTabPanelIdList = [
  'product-spec',
  'product-review',
  'product-inquiry',
  'product-shipment',
  'product-recommendation',
]

const productTabPanelList = productTabPanelIdList.map((panelId) => {
  const tabPanel = document.querySelector(`#${panelId}`)
  return tabPanel
})

const productTabpanelPositionMap = {}

function detectTabPanelPosition() {
  productTabPanelList.forEach((panel) => {
    const id = panel.getAttribute('id')
    const position = window.scrollY + panel.getBoundingClientRect().top
    productTabpanelPositionMap[id] = position
  })
}

function updateActiveTabOnScroll() {
  if (disableUpdating) {
    return
  }

  // 유저의 스크롤 위치에 따라서 activeTab 업데이트
  // 1. 현재 유저가 얼마만큼 스크롤을 했는지 -> window.scrollY
  // 2. 각 tabPanel y축 위치 -> productTabpanelPositionMap

  const scrolledAmount =
    window.scrollY +
    (window.innerWidth >= 768 ? TOP_HEADER_DESKTOP + 80 : TOP_HEADER_MOBILE + 8)

  let newActiveTab
  if (scrolledAmount >= productTabpanelPositionMap['product-recommendation']) {
    newActiveTab = productTabButtonList[4]
  } else if (scrolledAmount >= productTabpanelPositionMap['product-shipment']) {
    newActiveTab = productTabButtonList[3]
  } else if (scrolledAmount >= productTabpanelPositionMap['product-inquiry']) {
    newActiveTab = productTabButtonList[2]
  } else if (scrolledAmount >= productTabpanelPositionMap['product-review']) {
    newActiveTab = productTabButtonList[1]
  } else {
    newActiveTab = productTabButtonList[0]
  }

  // 추가 로직: 끝까지 스크롤을 한 경우 -> newActiveTab = productTabButtonList[4]
  // window.scrollY + window.innerHeight === body의 전체 height
  // window.innerWidth < 1200 -> orderCta 존재 -> 마진 바텀에 56px 존재
  const bodyHeight =
    document.body.offsetHeight + (window.innerWidth < 1200 ? 56 : 0)
  if (window.scrollY + window.innerHeight === bodyHeight) {
    newActiveTab = productTabButtonList[4]
  }

  if (newActiveTab) {
    newActiveTab = newActiveTab.parentNode

    if (newActiveTab !== currentActiveTab) {
      newActiveTab.classList.add('is-active')
      if (currentActiveTab !== null) {
        currentActiveTab.classList.remove('is-active')
      }

      currentActiveTab = newActiveTab
    }
  }
}

window.addEventListener('load', detectTabPanelPosition)
window.addEventListener('resize', _.throttle(detectTabPanelPosition), 1000)
window.addEventListener('scroll', _.throttle(updateActiveTabOnScroll, 300))
