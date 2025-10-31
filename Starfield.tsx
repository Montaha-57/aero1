"use client";
import { useEffect, useRef } from "react";

export default function Starfield(){
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = (c.width = window.innerWidth);
    let h = (c.height = window.innerHeight);
    const stars = Array.from({length: 220}, ()=>({
      x: Math.random()*w, y: Math.random()*h, z: Math.random()*1.5+0.5
    }));
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      for(const s of stars){
        s.x += s.z;
        if(s.x > w) s.x = 0;
        ctx.globalAlpha = s.z/2;
        ctx.fillStyle = "white";
        ctx.fillRect(s.x, s.y, 2, 2);
      }
      requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  },[]);
  return <canvas ref={ref} className="absolute inset-0 opacity-70" />;
}
