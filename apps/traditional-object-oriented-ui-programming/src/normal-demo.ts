/**
 * 需求：
 * 1. 有一个表单，表单中有一个输入框，表单下方有一个结果展示区
 * 2. 点击提交触发表单的 submit 事件时
 *    - 在结果展示区中渲染一个按钮，按钮的文字就是表单中填写的内容
 *    - 在结果展示区中渲染一段文本，文本内容为 "submit success!"，并在 3s 后移除该文本
 * 3. 在按钮已经渲染了的情况下，再次点击表单提交触发 submit 事件时，移除渲染的按钮
 */

/** 渲染需求中涉及到的基本元素 */
const renderBasicElements = ($app: HTMLDivElement) => {
  $app.innerHTML = `
<form id="demo-form">
  <input type="text" id="demo-form-input" placeholder="please input something...">
  <br>
  <input type="submit" value="submit">
</form>

<div id="result-area"></div>
`.trim()
}

const renderResultAreaButton = ($app: HTMLDivElement, buttonText: string) => {
  const $resultArea = $app.querySelector<HTMLDivElement>('#result-area')!
  const $button = document.createElement('button')

  $button.innerText = buttonText
  $resultArea.appendChild($button)
}

/** 为表单元素绑定相关事件监听函数 */
const bindFormEventHandlers = ($app: HTMLDivElement) => {
  const $form = $app.querySelector<HTMLFormElement>('#demo-form')!
  const $formInput = $app.querySelector<HTMLInputElement>('#demo-form-input')!

  $form.addEventListener('submit', (e) => {
    e.preventDefault()

    // 1. 在结果展示区中渲染一个按钮，按钮的文字就是表单中填写的内容
    const formInputValue = $formInput.value
    renderResultAreaButton($app, formInputValue)

    // 2. 在结果展示区中渲染一段文本，文本内容为 "submit success!"，并在 3s 后移除该文本
  })
}

export const setupNormalDemo = () => {
  const $app = document.querySelector<HTMLDivElement>('#app')!

  renderBasicElements($app)
  bindFormEventHandlers($app)
}
