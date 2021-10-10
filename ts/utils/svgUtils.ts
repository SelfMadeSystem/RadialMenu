
// TYVM https://stackoverflow.com/questions/11479185/svg-donut-slice-as-path-element-annular-sector

// Options:
// - centerX, centerY: coordinates for the center of the circle    
// - startDegrees, endDegrees: fill between these angles, clockwise
// - innerRadius, outerRadius: distance from the center
// - thickness: distance between innerRadius and outerRadius
//   You should only specify two out of three of the radii and thickness
export function annularSector(options: {centerX: number, centerY: number, startDegrees: number, endDegrees: number, innerRadius?: number, outerRadius?: number, thickness?: number}): string {
    var opts = optionsWithDefaults(options);
    var p = [ // points
        [opts.cx + opts.r2 * Math.cos(opts.startRadians),
        opts.cy + opts.r2 * Math.sin(opts.startRadians)],
        [opts.cx + opts.r2 * Math.cos(opts.closeRadians),
        opts.cy + opts.r2 * Math.sin(opts.closeRadians)],
        [opts.cx + opts.r1 * Math.cos(opts.closeRadians),
        opts.cy + opts.r1 * Math.sin(opts.closeRadians)],
        [opts.cx + opts.r1 * Math.cos(opts.startRadians),
        opts.cy + opts.r1 * Math.sin(opts.startRadians)],
    ];

    var angleDiff = opts.closeRadians - opts.startRadians;
    var largeArc = (angleDiff % (Math.PI * 2)) > Math.PI ? 1 : 0;
    var cmds = [];
    cmds.push("M" + p[0].join());                                // Move to P0
    cmds.push("A" + [opts.r2, opts.r2, 0, largeArc, 1, p[1]].join()); // Arc to  P1
    cmds.push("L" + p[2].join());                                // Line to P2
    cmds.push("A" + [opts.r1, opts.r1, 0, largeArc, 0, p[3]].join()); // Arc to  P3
    cmds.push("z");                                // Close path (Line to P0)
    return cmds.join(' ');

    function optionsWithDefaults(o: {centerX: number, centerY: number, startDegrees: number, endDegrees: number, innerRadius?: number, outerRadius?: number, thickness?: number}) {
        // Create a new object so that we don't mutate the original
        var o2 = {
            cx: o.centerX || 0,
            cy: o.centerY || 0,
            startRadians: (o.startDegrees || 0) * Math.PI / 180,
            closeRadians: (o.endDegrees || 0) * Math.PI / 180,
            r1: 0,
            r2: 0
        };

        var t = o.thickness !== undefined ? o.thickness : 100;
        if (o.innerRadius !== undefined) o2.r1 = o.innerRadius;
        else if (o.outerRadius !== undefined) o2.r1 = o.outerRadius - t;
        else o2.r1 = 200 - t;
        if (o.outerRadius !== undefined) o2.r2 = o.outerRadius;
        else o2.r2 = o2.r1 + t;

        if (o2.r1 < 0) o2.r1 = 0;
        if (o2.r2 < 0) o2.r2 = 0;

        return o2;
    }
}