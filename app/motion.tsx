"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MotionSystem(){
 const [enabled,setEnabled]=useState(true);
 useEffect(()=>{const q=matchMedia("(prefers-reduced-motion: reduce)");setEnabled(!q.matches);const change=()=>setEnabled(!q.matches);q.addEventListener("change",change);return()=>q.removeEventListener("change",change);},[]);
 useEffect(()=>{
  document.documentElement.dataset.motion=enabled?"on":"off";
  if(!enabled)return;
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)",()=>{
   const ctx=gsap.context(()=>{
    gsap.timeline({defaults:{ease:"power3.out"}})
     .from(".hero .letter",{yPercent:115,rotation:8,duration:0.9,stagger:0.028},0.1)
     .from(".hero-intro",{y:25,opacity:0,duration:0.7},0.7)
     .from(".hero-character",{y:130,rotation:-12,scale:0.8,opacity:0,duration:1.1,ease:"back.out(1.5)"},0.5)
     .from(".hero-sticker",{scale:0,rotation:-45,duration:0.8,ease:"back.out(2)"},1)
     .from(".hero-tag",{x:70,rotation:15,opacity:0,duration:0.6},1.35)
     .from(".hero-bottom",{y:15,opacity:0,duration:0.7},1.6);
    const float=gsap.to(".hero-character-inner",{y:-12,rotation:1.5,duration:2.5,repeat:-1,yoyo:true,ease:"sine.inOut"});
    const spin=gsap.to(".hero-sticker-inner",{rotation:360,duration:36,repeat:-1,ease:"none"});
    ScrollTrigger.create({trigger:".hero",start:"top bottom",end:"bottom top",onToggle:s=>{float.paused(!s.isActive);spin.paused(!s.isActive);}});
    gsap.to(".hero-visual",{y:-24,rotation:2,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:0.7}});
    gsap.utils.toArray<HTMLElement>(".section-heading").forEach(el=>gsap.from(el,{y:36,rotation:-2,opacity:0,duration:0.9,scrollTrigger:{trigger:el,start:"top 92%"}}));
    gsap.from(".thinking-board",{rotation:8,y:46,scale:0.9,scrollTrigger:{trigger:".skills-section",start:"top 85%",end:"center center",scrub:0.8}});
    gsap.from(".experience-row",{x:-40,opacity:0,stagger:0.15,duration:0.75,scrollTrigger:{trigger:".experience-list",start:"top 88%"}});
    gsap.from(".stat-number",{yPercent:70,opacity:0,stagger:0.2,ease:"back.out(1.5)",duration:0.9,scrollTrigger:{trigger:".stats-strip",start:"top 88%"}});
    gsap.from(".campaign-title",{xPercent:-8,opacity:0.3,scrollTrigger:{trigger:".campaign-section",start:"top 88%",end:"top 15%",scrub:0.7}});
    gsap.from(".campaign-notebook",{rotation:8,y:48,scrollTrigger:{trigger:".campaign-section",start:"top 88%",end:"center 65%",scrub:0.7}});
    gsap.from(".about-photo",{rotation:-12,y:30,scrollTrigger:{trigger:".about-section",start:"top 90%",end:"center center",scrub:0.8}});
    gsap.from(".contact-title .letter",{yPercent:110,rotation:-10,stagger:0.05,duration:0.9,ease:"back.out(1.5)",scrollTrigger:{trigger:".contact-title",start:"top 90%"}});
   },document.querySelector("#site")!);
   let active=true;document.fonts.ready.then(()=>{if(active)ScrollTrigger.refresh();});
   return()=>{active=false;ctx.revert();};
  });
  return()=>{mm.revert();};
 },[enabled]);
 return null;
}
