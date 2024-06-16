const reviewLikeButtonList = document.querySelectorAll(
  '.review-card-footer button'
)

const HELPFUL = '도움됨'
const NOT_HELPFUL = '도움이 돼요'
// const checkIcon = '<i class="ic-check" aria-hidden></i>'

function toggleReviewLikeButton() {
  // 1. btn의 클래스 변경 (btn-primary <-> btn-outlined)
  // 2. 텍스트 변경 (도움됨 <-> 도움이 돼요)
  //   - 버튼이 like가 되었는지 되지 않았는지 먼저 판단
  // 3. count (N명에게 도움이 되었습니다)

  const isLiked = this.classList.contains('btn-primary')
  const textElement = this.nextElementSibling
  const reviewCardFooter = this.parentNode

  if (isLiked) {
    // 앞으로 비활성화 하겠다
    this.innerHTML = NOT_HELPFUL
  } else {
    // 앞으로 활성화 하겠다
    this.innerHTML = HELPFUL

    const checkIcon = document.createElement('i')
    checkIcon.classList.add('ic-check')
    checkIcon.setAttribute('aria-hidden', true)
    this.prepend(checkIcon)
  }

  if (textElement) {
    // 다름 사람이 도움됨을 누른 상태
    const countSpan = textElement.querySelector('span')
    const count = Number(countSpan.innerHTML.replaceAll(',', ''))

    let newCount = count
    if (isLiked) {
      // 앞으로 비활성화 -> count -1
      newCount = newCount - 1
      if (newCount === 0) {
        reviewCardFooter.removeChild(textElement)
      } else {
        countSpan.innerHTML = newCount.toLocaleString()
      }
    } else {
      // 앞으로 활성화 -> count +1
      newCount = newCount + 1
      countSpan.innerHTML = newCount.toLocaleString()
    }
  } else {
    // 아무도 도움됨을 누르지 않은 상태
    if (!isLiked) {
      // 한 명도 버튼을 누르지 않은 상태
      // 앞으로는 활성화가 될 거다 -> 1명
      const newTextElement = document.createElement('p')
      newTextElement.innerHTML =
        '<strong><span>1</span>명</strong>에게 도움이 되었습니다'
      reviewCardFooter.appendChild(newTextElement)
    }
  }

  this.classList.toggle('btn-primary')
  this.classList.toggle('btn-outlined')
}

reviewLikeButtonList.forEach((button) => {
  button.addEventListener('click', toggleReviewLikeButton)
})
