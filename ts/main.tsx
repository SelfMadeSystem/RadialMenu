import '../sass/style.scss'
import { RootMenu } from './menu/rootMenu'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom'
import React from 'react'

const root = document.getElementById('root')

ReactDOM.render(
    <StrictMode>
        <RootMenu />
    </StrictMode>,
    root
)

