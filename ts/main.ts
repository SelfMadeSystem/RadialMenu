import '../sass/style.scss'

const cursor = document.querySelector("#cursor") as SVGPathElement

function setCircleWidth(width: number) {
    const circle = document.querySelector("#circle") as SVGPathElement;
    circle.setAttribute("stroke-width", `${width}`);
    const hW = width / 2;
    const hWMin50 = 50 - hW;
    circle.setAttribute("d", `M50,${hW}
    a${hWMin50},${hWMin50} 0 0,0 -${hWMin50},${hWMin50}
    a${hWMin50},${hWMin50} 0 1,0 ${hWMin50},-${hWMin50}`)
}

function setCursorWidthAndDiv(width: number, div: number) {
    const wMin50 = 50 - width;
    const size = 360 / div;
    const xO = Math.cos(size * Math.PI / 180);
    const yO = Math.sin(size * Math.PI / 180);
    cursor.setAttribute("d", `M0,50
    A${50},${50} 0 0,1 ${50 - xO * 50},${50 - yO * 50}
    L${50 - xO * wMin50},${50 - yO * wMin50}
    A${wMin50},${wMin50} 0 0,0 ${width},50`)
}

let size = 20;
let div = 8;
let at = 0;

setCircleWidth(size);

setCursorWidthAndDiv(size, div);

function angleDiff(a: number, b: number) {
    const diff = a % 360 - b % 360;
    return diff > 180 ? diff - 360 : diff < -180 ? diff + 360 : diff;
}

$("#circle").on("mousemove", e => {
    const x = (e.pageX - $("#mainSvg").offset().left) / $("#mainSvg").width() - 0.5
    const y = (e.pageY - $("#mainSvg").offset().top) / $("#mainSvg").height() - 0.5
    var angle = (Math.atan2(y, x) + Math.PI) * 180 / Math.PI
    at = Math.floor(angle * div / 360)
    angle = at * 360 / div

    console.log(at)

    if (cursor.style.transform) {
        var currentAngle = parseFloat(cursor.style.transform.split("rotate(")[1].split("deg)")[0])
        
        if (currentAngle != angle) {
            cursor.style.transform = `rotate(${angleDiff(angle, currentAngle) + currentAngle}deg)`
        }
    } else cursor.style.transform = `rotate(${angle}deg)`
})