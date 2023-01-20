//@ts-ignore
import React from '@plasticine-react/react'

//@ts-ignore
import ReactDOM from '@plasticine-react/react-dom'

const el = React.createElement('div', { children: 'hi' })

ReactDOM.createRoot(document.querySelector<HTMLDivElement>('#root')).render(el)
