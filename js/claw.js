/* Claw mechanism model, measured from the photo of the real gripper (pixel coordinates).
   Each side is a four-bar linkage: ground (gear centre G to link pivot O), crank (gear arm G→A),
   coupler (the jaw itself, A→B) and rocker (short link O→B). The two gears mesh, so the right
   side is the mirror image of the left. drawClaw(svg, t) poses it: t = 0 open, t = 1 closed. */
(function (root) {
  var CX = 437.5;                         // mirror line between the two gears
  var G = [365, 862], O = [375, 632];     // left gear centre, left link ground pivot
  var A0 = [130, 820], B0 = [210, 585];   // left jaw pivots (crank end, link end) as photographed
  var r1 = d(G, A0), r2 = d(A0, B0), r3 = d(O, B0);
  var th0 = Math.atan2(A0[1] - G[1], A0[0] - G[0]);
  var SWING = 0.95;                       // crank travel in radians between open and closed
  var GEAR_R = 72;
  var JAW = [[55,845],[155,845],[160,625],[248,528],[140,512],[252,462],[248,420],[160,272],[52,272]];
  var PAD = [[50,276],[162,276],[176,96],[62,70]];
  function d(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
  function solve(th) {
    var A = [G[0] + r1 * Math.cos(th), G[1] + r1 * Math.sin(th)];
    // B: intersection of circle(A, r2) and circle(O, r3), branch nearest the photographed pose
    var D = d(A, O), a = (r2 * r2 - r3 * r3 + D * D) / (2 * D), h = Math.sqrt(Math.max(0, r2 * r2 - a * a));
    var ux = (O[0] - A[0]) / D, uy = (O[1] - A[1]) / D, mx = A[0] + a * ux, my = A[1] + a * uy;
    var c1 = [mx - h * uy, my + h * ux], c2 = [mx + h * uy, my - h * ux];
    var B = d(c1, B0) < d(c2, B0) ? c1 : c2;
    return { A: A, B: B };
  }
  function pose(t) {
    var th = th0 + SWING * (t - 0.421);    // t=0.421 is the photographed pose
    var s = solve(th);
    var phi = Math.atan2(s.B[1] - s.A[1], s.B[0] - s.A[0]) - Math.atan2(B0[1] - A0[1], B0[0] - A0[0]);
    return { th: th, A: s.A, B: s.B, phi: phi };
  }
  function tf(p, P) {                     // jaw local point → world
    var x = p[0] - A0[0], y = p[1] - A0[1], c = Math.cos(P.phi), s = Math.sin(P.phi);
    return [P.A[0] + x * c - y * s, P.A[1] + x * s + y * c];
  }
  function mir(p) { return [2 * CX - p[0], p[1]]; }
  function pts(arr) { return arr.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
  function tipGap(t) { var P = pose(t); return mir(tf([170, 180], P))[0] - tf([170, 180], P)[0]; }

  function drawClaw(svg, t, opts) {
    opts = opts || {};
    var P = pose(t), dth = (P.th - th0);
    var jawL = JAW.map(function (p) { return tf(p, P); }), padL = PAD.map(function (p) { return tf(p, P); });
    var jawR = jawL.map(mir), padR = padL.map(mir);
    var GR = mir(G), OR = mir(O), AR = mir(P.A), BR = mir(P.B);
    var holes = '';
    for (var i = 0; i < 9; i++) for (var j = 0; j < 7; j++) {
      var x = 285 + i * 38, y = 690 + j * 46;
      holes += '<circle cx="' + x + '" cy="' + y + '" r="9" class="cl-hole"/>';
    }
    var circ = 2 * Math.PI * GEAR_R, tooth = circ / 56;
    function gear(c, rot) {
      return '<g transform="rotate(' + (rot * 180 / Math.PI).toFixed(2) + ' ' + c[0] + ' ' + c[1] + ')">' +
        '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + GEAR_R + '" class="cl-teeth" stroke-dasharray="' + tooth.toFixed(2) + ' ' + tooth.toFixed(2) + '"/>' +
        '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + (GEAR_R - 8) + '" class="cl-gear"/>' +
        '<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + c[0] + '" y2="' + (c[1] - GEAR_R + 18) + '" class="cl-mark"/></g>';
    }
    function bar(p, q, cls) { return '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" class="' + cls + '"/>'; }
    function pin(p, cls) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="11" class="' + (cls || 'cl-pin') + '"/>'; }
    var g = '';
    g += '<rect x="250" y="655" width="375" height="345" rx="10" class="cl-plate"/>' + holes;
    g += '<polygon points="' + pts(jawL) + '" class="cl-jaw"/><polygon points="' + pts(jawR) + '" class="cl-jaw"/>';
    g += '<polygon points="' + pts(padL) + '" class="cl-pad"/><polygon points="' + pts(padR) + '" class="cl-pad"/>';
    g += bar(O, P.B, 'cl-link') + bar(OR, BR, 'cl-link');
    g += gear(G, dth) + gear(GR, -dth);
    g += bar(G, P.A, 'cl-crank') + bar(GR, AR, 'cl-crank');
    g += pin(G) + pin(GR, 'cl-pin drive') + pin(O, 'cl-pin ground') + pin(OR, 'cl-pin ground') + pin(P.A) + pin(AR) + pin(P.B) + pin(BR);
    svg.innerHTML = g;
    return { gap: tipGap(t) };
  }
  root.Claw = { draw: drawClaw, tipGap: tipGap };
  if (typeof module !== 'undefined') module.exports = root.Claw;
})(typeof window !== 'undefined' ? window : globalThis);
