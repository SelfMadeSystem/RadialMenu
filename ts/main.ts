import '../sass/style.scss'
import { RadialMenu } from './menu/radialMenu'

$(".circleMenu").each((_, el) => {
    new RadialMenu(el as unknown as SVGElement)
})

/*import { annularSector } from './utils/svgUtils';

$(".circleMenu").each((_, ele) => {
    const $ele = $(ele)
    const cursor = $ele.children(".cursor") as unknown as JQuery<SVGPathElement>
    const circle = $ele.children(".circle") as unknown as JQuery<SVGCircleElement>

    function setCircleWidth(w: number) {
        const wMin50 = 50 - w;
        circle.attr("d", `
        M50,0 A50,50 0 0,1 100,50 A50,50 0 1,1 50,0
        M50,${w} A${wMin50},${wMin50} 0 0,0 ${w},50 A${wMin50},${wMin50} 0 1,0 50,${w}`)
    }

    function setCursorWidthAndDiv(width: number, div: number) {
        const s = (360 / div)/2;
        annularSector(cursor[0], {
            centerX: 50,
            centerY: 50,
            startDegrees: -s,
            endDegrees: s,
            outerRadius: 50,
            thickness: width
        })
    //     const wMin50 = 50 - width;
    //     const size = 360 / div;
    //     const xO = Math.cos(size * Math.PI / 180);
    //     const yO = Math.sin(size * Math.PI / 180);
    //     cursor.attr("d", `M0,50
    // A${50},${50} 0 0,1 ${50 - xO * 50},${50 - yO * 50}
    // L${50 - xO * wMin50},${50 - yO * wMin50}
    // A${wMin50},${wMin50} 0 0,0 ${width},50`)
    }

    let size = 20;
    let div = 8;
    let at = 0;

    setCircleWidth(size);
    setCursorWidthAndDiv(size, div);

    function mod(a: number, b: number) {
        return ((a % b) + b) % b;
    }

    function angleDiff(a: number, b: number) {
        const diff = mod(a, 360) - mod(b, 360);
        return diff > 180 ? diff - 360 : diff < -180 ? diff + 360 : diff;
    }

    circle.on("mousemove", e => {
        const x = e.offsetX / $("#mainSvg").width() - 0.5
        const y = e.offsetY / $("#mainSvg").height() - 0.5
        var angle = (Math.atan2(y, x) + Math.PI) * 180 / Math.PI
        at = Math.floor(angle * div / 360)
        angle = (at + 0.5) * 360 / div + 180

        var currentAngle = cursor.css("transform") == "none" ? 0 : parseFloat(cursor[0].style.transform.split("rotate(")[1].split("deg)")[0])

        if (currentAngle != angle) {
            cursor.css("transform", `rotate(${angleDiff(angle, currentAngle) + currentAngle}deg)`)
        }
    })

    cursor.on("mousedown", e => {
        e.preventDefault();
        if (e.button == 0) {
            setCursorWidthAndDiv(size, ++div);
        } else {
            setCursorWidthAndDiv(size, --div);
        }
        var currentAngle = cursor.css("transform") == "none" ? 0 : parseFloat(cursor[0].style.transform.split("rotate(")[1].split("deg)")[0])

        var angle = currentAngle - 180
        at = Math.floor(angle * div / 360)
        angle = (at + 0.5) * 360 / div + 180


        if (currentAngle != angle) {
            cursor.css("transform", `rotate(${angleDiff(angle, currentAngle) + currentAngle}deg)`)
        }
    })
}) */