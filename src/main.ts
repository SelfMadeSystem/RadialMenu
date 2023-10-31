import { FancyText } from './radial-menu/fancy-text';
import { RingBool } from './radial-menu/items/ring-bool';
import { RingMenu } from './radial-menu/items/ring-menu';
import { RingRange } from './radial-menu/items/ring-range';
import { RingSelect } from './radial-menu/items/ring-select';
import { RadialMenu } from './radial-menu/radial-menu';
import { createRef } from './radial-menu/ref';
import { TextSizeRel } from './radial-menu/text-size';
import './style.css';

const boolRef = createRef(false);

const path = new Path2D("M4 2A2 2 0 0 0 2 4V12H4V8H6V12H8V4A2 2 0 0 0 6 2H4M4 4H6V6H4M22 15.5V14A2 2 0 0 0 20 12H16V22H20A2 2 0 0 0 22 20V18.5A1.54 1.54 0 0 0 20.5 17A1.54 1.54 0 0 0 22 15.5M20 20H18V18H20V20M20 16H18V14H20M5.79 21.61L4.21 20.39L18.21 2.39L19.79 3.61Z");
const icon = {
    path,
    size: 24,
    resizeTo: TextSizeRel(150 / 500),
};

const app = document.getElementById("app") as HTMLDivElement;
const radialMenu = new RadialMenu(app, {
    rootRing: new RingMenu(new FancyText("root"), [
        new RingMenu(new FancyText("ring1", icon, "top"), [
            new RingMenu(new FancyText("ring1-1"), [
                new RingMenu(new FancyText("ring1-1-1"), []),
                new RingMenu(new FancyText("ring1-1-2"), []),
                new RingMenu(new FancyText("ring1-1-3"), []),
            ]),
            new RingMenu(new FancyText("ring1-2"), []),
            new RingMenu(new FancyText("ring1-3"), []),
        ]),
        new RingMenu(new FancyText("ring2", icon, "bottom"), []),
        new RingBool(new FancyText("bool1", icon, "left"), boolRef),
        new RingRange(new FancyText("range1", icon, "right"), createRef(50), 0, 100),
        new RingRange(new FancyText("range2", icon, "top"), createRef(135), 0, 360, 22.5),
        new RingSelect(new FancyText("select1", icon, "top"), createRef(0), [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
        ]),
        new RingSelect(new FancyText("select2"), createRef(0), [
            "item1",
            "item2",
            "item3",
            "item4",
        ]),
        new RingBool(new FancyText("bool2"), boolRef),
    ]),
    ringProps: { // try these values if you want
        // startAngle: -Math.PI * 1.5,
        // endAngle: Math.PI * 0.5,
        // startAngle: -Math.PI,
        // endAngle: 0,
        // startAngle: -Math.PI * 1.25,
        // endAngle: Math.PI * 0.25,
    }
});

radialMenu.start();
