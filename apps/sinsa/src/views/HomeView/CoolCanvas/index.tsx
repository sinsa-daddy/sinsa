/* eslint-disable no-bitwise */
import React, { useEffect, useRef } from 'react';
import styles from './styles.module.less';

export const CoolCanvas = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const convas = canvasRef.current;
    const ctx = canvasRef.current!.getContext('2d')!;

    if (!(ctx && convas)) {
      return;
    }

    const pr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const bandwidth = 180;
    let q: any[];
    let r = 0;
    const twoPi = 2 * Math.PI;
    const { cos } = Math;
    const { random } = Math;
    convas.width = w * pr;
    convas.height = h * pr;
    ctx.scale(pr, pr);
    ctx.globalAlpha = 0.2;
    const verticals: { x: number; y: number; v_x: number; v_y: number }[] = [];
    const verticals_side: any[] = [];
    const fillStyles: string[] = [];
    let firstTime = !0;

    function i() {
      ctx.clearRect(0, 0, w, h);
      if (firstTime) {
        for (
          q = [
            { x: 0, y: 0.5 * h + bandwidth, v_x: 0, v_y: 0 },
            { x: 0, y: 0.5 * h - bandwidth, v_x: 0, v_y: 0 },
          ],
            verticals.push(q[0]),
            verticals.push(q[1]);
          q[1].x < w + bandwidth;

        ) {
          firstDraw(q[0], q[1]);
        }
      } else {
        for (let t = 0, e = 1; e < verticals.length - 1; ) {
          tweak(t, e);
          t++;
          e++;
        }
      }
      firstTime = !1;
      requestAnimationFrame(i);
    }
    function go(t: { x: any; y: any; v_x: any; v_y: any }) {
      random() < 0.5 || (t.v_x += 0.1 * (random() - 0.5));
      random() < 0.5 || (t.v_y += 0.1 * (random() - 0.499));
      const e = 0.3;
      t.v_x = Math.max(Math.min(t.v_x, e), -e);
      t.v_y = Math.max(Math.min(t.v_y, e), -e);
      t.x += t.v_x;
      t.y += t.v_y;
      (t.x < 0 || t.x > w) && (t.v_x *= -1.01);
      (t.y < 0 || t.y > h) && (t.v_y *= -1.01);
    }
    function tweak(t: number, e: number) {
      ctx.beginPath();
      const i = verticals[t];
      const a = verticals[e];
      const o = verticals_side[t];
      const r = fillStyles[t];
      go(a);
      ctx.moveTo(i.x, i.y);
      ctx.lineTo(a.x, a.y);
      go(o);
      ctx.lineTo(o.x, o.y);
      ctx.closePath();
      ctx.strokeStyle = r;
      ctx.stroke();
    }
    function firstDraw(
      t: { x: number; y: number },
      e: { x: number; y: number },
    ) {
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(e.x, e.y);
      const i = e.x + (2 * random() - 0.25) * bandwidth;
      const a = y(e.y);
      ctx.lineTo(i, a);
      ctx.closePath();
      r -= twoPi / -50;
      ctx.strokeStyle = `#${(
        ((127 * cos(r) + 128) << 16) |
        ((127 * cos(r + twoPi / 3) + 128) << 8) |
        (127 * cos(r + (twoPi / 3) * 2) + 128)
      ).toString(16)}`;
      ctx.stroke();
      q[0] = q[1];
      q[1] = { x: i, y: a, v_x: 0, v_y: 0 };
      verticals.push(q[1]);
      fillStyles.push(ctx.strokeStyle);
      verticals_side.push(q[1]);
    }
    function y(t: number): any {
      const e = t + (2 * random() - 1.1) * bandwidth;
      return e > h || 0 > e ? y(t) : e;
    }

    function toEvent(t: { preventDefault: () => void }) {
      t.preventDefault();
    }

    document.addEventListener('touchmove', toEvent);

    window.requestAnimationFrame(i);

    // eslint-disable-next-line consistent-return
    return (): void => {
      document.removeEventListener('touchmove', toEvent);
    };
  }, []);
  return <canvas className={styles.Cool} ref={canvasRef} />;
});
