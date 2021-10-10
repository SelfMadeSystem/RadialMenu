import '../sass/style.scss'
import { RadialMenu } from './menu/radialMenu'

$(".circleMenu").each((_, el) => {
    new RadialMenu(el as unknown as SVGElement)
})
