import '../sass/style.scss'
import { RootMenu } from './menu/rootMenu'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'

const root = document.getElementById('root')

ReactDOM.render(
    <StrictMode>
        <RootMenu />
    </StrictMode>,
    root
)

