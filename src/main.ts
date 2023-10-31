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

const bluetooth = new Path2D("M14.88,16.29L13,18.17V14.41M13,5.83L14.88,7.71L13,9.58M17.71,7.71L12,2H11V9.58L6.41,5L5,6.41L10.59,12L5,17.58L6.41,19L11,14.41V22H12L17.71,16.29L13.41,12L17.71,7.71Z");
const location = new Path2D("M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z");
const volume = new Path2D("M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z");
const brightness = new Path2D("M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z");
const call = new Path2D("M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z");
const messages = new Path2D("M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z");
const wifi = new Path2D("M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z");
const airplane = new Path2D("M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z");

const Icon = (path: Path2D) => ({
    path,
    size: 24,
    resizeTo: TextSizeRel(125 / 500),
});

const app = document.getElementById("app") as HTMLDivElement;
const radialMenu = new RadialMenu(app, {
    rootRing: new RingMenu(new FancyText("root"), [
        new RingMenu(new FancyText("ring1", Icon(bluetooth), "top"), [
            new RingMenu(new FancyText("ring1-1"), [
                new RingMenu(new FancyText("ring1-1-1"), []),
                new RingMenu(new FancyText("ring1-1-2"), []),
                new RingMenu(new FancyText("ring1-1-3"), []),
            ]),
            new RingMenu(new FancyText("ring1-2"), []),
            new RingMenu(new FancyText("ring1-3"), []),
        ]),
        new RingMenu(new FancyText("ring2", Icon(location), "bottom"), []),
        new RingBool(new FancyText("bool1", Icon(volume), "left"), boolRef),
        new RingRange(new FancyText("range1", Icon(brightness), "right"), createRef(135), 0, 360, 22.5),
        new RingRange(new FancyText(undefined, Icon(call), "right"), createRef(50), 0, 100),
        new RingSelect(new FancyText("select1", Icon(messages), "top"), createRef(0), [
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
        new RingSelect(new FancyText("select2", /* Icon(wifi), "top" */), createRef(0), [
            "item1",
            "item2",
            "item3",
            "item4",
        ]),
        new RingBool(new FancyText("bool2", /* Icon(airplane), "top" */), boolRef),
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
