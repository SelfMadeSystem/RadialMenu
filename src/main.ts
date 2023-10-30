import { RingBool } from './radial-menu/items/ring-bool';
import { RingMenu } from './radial-menu/items/ring-menu';
import { RingRange } from './radial-menu/items/ring-range';
import { RingSelect } from './radial-menu/items/ring-select';
import { RadialMenu } from './radial-menu/radial-menu';
import { createRef } from './radial-menu/ref';
import './style.css';

const app = document.getElementById("app") as HTMLDivElement;
const radialMenu = new RadialMenu(app, {
    rootRing: new RingMenu("root", [
        new RingMenu("ring1", [
            new RingMenu("ring1-1", [
                new RingMenu("ring1-1-1", []),
                new RingMenu("ring1-1-2", []),
                new RingMenu("ring1-1-3", []),
            ]),
            new RingMenu("ring1-2", []),
            new RingMenu("ring1-3", []),
        ]),
        new RingMenu("ring2", []),
        new RingMenu("ring3", []),
        new RingMenu("ring4", []),
        new RingRange("range1", createRef(50), 0, 100),
        new RingRange("range2", createRef(135), 0, 360, 22.5),
        new RingSelect("select1", createRef(0), [
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
        new RingBool("bool1", createRef(false)),
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
