import '../sass/style.scss'
import { RadialMenu } from './menu/radialMenu'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'

const root = document.getElementById('root')

ReactDOM.render(
    <StrictMode>
        <RadialMenu />
    </StrictMode>,
    root
)

