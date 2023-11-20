/**
 * 需求：
 * 1. 有一个表单，表单中有一个输入框
 * 2. 表单未提交时在表单中渲染一个按钮，点击该按钮会触发表单的 submit 事件
 * 3. 触发了 submit 事件后，提交按钮消失，并 alert 一个成功消息
 */

/** 将组件的通用行为抽象成一个基类 */
abstract class TraditionalObjectOrientedView<
  Props extends Record<string, any> = Record<string, any>,
  State extends Record<string, any> = Record<string, any>,
  Element extends HTMLElement = HTMLElement,
> {
  public props: Props
  protected state: State
  public el: Element

  constructor(props: Props) {
    this.props = props
    this.state = this.getInitialState()
    this.el = this.createElement()
    this.render()
    this.initEventListeners()
    this.bindEventListeners()
  }

  abstract getInitialState(): State

  abstract createElement(): Element

  abstract render(): void

  protected initEventListeners(): void {}

  protected bindEventListeners(): void {}

  protected removeEventListeners(): void {}

  public destroy(): void {
    this.removeEventListeners()
  }
}

interface FormSubmitButtonProps {
  text: string
}

interface FormSubmitButtonState {}

class FormSubmitButton extends TraditionalObjectOrientedView<
  FormSubmitButtonProps,
  FormSubmitButtonState,
  HTMLButtonElement
> {
  getInitialState(): FormSubmitButtonState {
    return {}
  }

  createElement(): HTMLButtonElement {
    const el = document.createElement('button')

    el.type = 'submit'

    return el
  }

  render(): void {
    const { text } = this.props

    this.el.innerText = text
  }
}

interface FormInputProps {
  placeholder: string
}

interface FormInputState {}

class FormInput extends TraditionalObjectOrientedView<FormInputProps, FormInputState, HTMLInputElement> {
  getInitialState(): FormInputState {
    return {}
  }

  createElement(): HTMLInputElement {
    const el = document.createElement('input')

    el.type = 'text'

    return el
  }

  render(): void {
    const { placeholder } = this.props

    this.el.placeholder = placeholder
  }
}

interface FormProps {
  placeholder: string
  buttonText: string
}

interface FormState {
  isSubmitted: boolean
  formInputInstance: FormInput | null
  formSubmitButtonInstance: FormSubmitButton | null
}

class Form extends TraditionalObjectOrientedView<FormProps, FormState, HTMLFormElement> {
  private handleSubmit(e: SubmitEvent) {
    e.preventDefault()

    this.state.isSubmitted = true
    this.render()

    alert('submit success!')
  }

  getInitialState(): FormState {
    return {
      isSubmitted: false,
      formInputInstance: null,
      formSubmitButtonInstance: null,
    }
  }

  createElement(): HTMLFormElement {
    const el = document.createElement('form')

    return el
  }

  render(): void {
    const { placeholder, buttonText } = this.props
    const { isSubmitted, formInputInstance, formSubmitButtonInstance } = this.state

    // 初始化表单输入框实例
    if (formInputInstance === null) {
      this.state.formInputInstance = new FormInput({ placeholder })
      this.el.appendChild(this.state.formInputInstance.el)
    }

    // 未提交的时候初始化表单提交按钮实例
    if (!isSubmitted && formSubmitButtonInstance === null) {
      this.state.formSubmitButtonInstance = new FormSubmitButton({ text: buttonText })
      this.el.appendChild(this.state.formSubmitButtonInstance.el)
    }

    // 更新表单提交按钮
    if (formSubmitButtonInstance !== null) {
      formSubmitButtonInstance.props.text = buttonText
      formSubmitButtonInstance.render()
    }

    // 已提交了的情况下卸载表单提交按钮
    if (isSubmitted && formSubmitButtonInstance !== null) {
      this.el.removeChild(formSubmitButtonInstance.el)
      formSubmitButtonInstance.destroy()
    }
  }

  protected initEventListeners(): void {
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  protected bindEventListeners(): void {
    this.el.addEventListener('submit', this.handleSubmit)
  }

  protected removeEventListeners(): void {
    this.el.removeEventListener('submit', this.handleSubmit)
  }
}

export const setupObjectOrientedUIProgrammingDemo = () => {
  const $app = document.querySelector<HTMLDivElement>('#app')!
  const formInstance = new Form({ buttonText: 'submit', placeholder: 'please input something...' })

  $app.appendChild(formInstance.el)
}
