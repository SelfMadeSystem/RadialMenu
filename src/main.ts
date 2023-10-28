import { RingBool } from './radial-menu/items/ring-bool';
import { RingMenu } from './radial-menu/items/ring-menu';
import { RadialMenu } from './radial-menu/radial-menu';
import { createRef } from './radial-menu/ref';
import './style.css';

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const radialMenu = new RadialMenu(canvas, {
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
        new RingMenu("ring5", []),
        new RingMenu("ring6", []),
        new RingMenu("ring7", []),
        new RingBool("bool1", createRef(false)),
    ]),
});

radialMenu.start();
