import '../sass/style.scss'

$(".circleMenu").each((_, ele) => {
    const $ele = $(ele)
    const cursor = $ele.children(".cursor") as unknown as JQuery<SVGPathElement>
    const circle = $ele.children(".circle") as unknown as JQuery<SVGCircleElement>

    function setCircleWidth(width: number) {
        circle.attr("stroke-width", `${width}`);
        const hW = width / 2;
        const hWMin50 = 50 - hW;
        circle.attr("d", `M50,${hW}
    a${hWMin50},${hWMin50} 0 0,0 -${hWMin50},${hWMin50}
    a${hWMin50},${hWMin50} 0 1,0 ${hWMin50},-${hWMin50}`)
    }

    function setCursorWidthAndDiv(width: number, div: number) {
        const wMin50 = 50 - width;
        const size = 360 / div;
        const xO = Math.cos(size * Math.PI / 180);
        const yO = Math.sin(size * Math.PI / 180);
        cursor.attr("d", `M0,50
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

    circle.on("mousemove", e => {
        const x = e.offsetX / $("#mainSvg").width() - 0.5
        const y = e.offsetY / $("#mainSvg").height() - 0.5
        var angle = (Math.atan2(y, x) + Math.PI) * 180 / Math.PI
        at = Math.floor(angle * div / 360)
        angle = at * 360 / div

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

        var angle = currentAngle
        at = Math.floor(angle * div / 360)
        angle = at * 360 / div


        if (currentAngle != angle) {
            cursor.css("transform", `rotate(${angleDiff(angle, currentAngle) + currentAngle}deg)`)
        }
    })
})