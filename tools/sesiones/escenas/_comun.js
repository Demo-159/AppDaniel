// Auxiliares de dibujo compartidos por las escenas de todos los capítulos (se carga antes que capitulo-N.js).
// Cada capítulo los toma con: const {T,W,big,...}=K;
const K=(function(){
document.head.insertAdjacentHTML('beforeend',`<style>
.k2n{animation:k2n 1.5s cubic-bezier(.3,1.3,.5,1) both}@keyframes k2n{from{transform:rotate(var(--a0,-120deg))}to{transform:rotate(var(--a))}}
.k2glow{animation:k2glow .9s ease-in-out infinite alternate}@keyframes k2glow{from{opacity:.35}to{opacity:1}}
.k2fast{animation:k2glow .22s steps(2) infinite}.k2slow{animation:k2glow .7s steps(2) infinite}
.k2spin{transform-box:fill-box;transform-origin:center;animation:k2spin 1.1s linear infinite}@keyframes k2spin{to{transform:rotate(360deg)}}
.k2spinS{transform-box:fill-box;transform-origin:center;animation:k2spin 3s linear infinite}
.k2pis{animation:k2pis .45s ease-in-out infinite alternate}@keyframes k2pis{to{transform:translateY(16px)}}
.k2pis2{animation:k2pis .45s ease-in-out -.45s infinite alternate}
.k2gota{animation:k2gota 1.6s linear infinite}@keyframes k2gota{from{transform:translate(0,0);opacity:0}15%{opacity:1}to{transform:translate(var(--dx,0),var(--dy,60px));opacity:0}}
.k2sube{transform-box:fill-box;transform-origin:bottom;animation:k2sube 2s ease-out both}@keyframes k2sube{from{transform:scaleY(.02)}to{transform:scaleY(1)}}
.k2baja{transform-box:fill-box;transform-origin:bottom;animation:k2baja 2.4s ease-in both}@keyframes k2baja{from{transform:scaleY(1)}to{transform:scaleY(.08)}}
.k2bajaX{transform-box:fill-box;transform-origin:left;animation:k2bajaX 2.4s ease-in both}@keyframes k2bajaX{from{transform:scaleX(1)}to{transform:scaleX(.03)}}
.k2subeX{transform-box:fill-box;transform-origin:left;animation:k2subeX 1.8s ease-out both}@keyframes k2subeX{from{transform:scaleX(.03)}to{transform:scaleX(1)}}
.k2tos{animation:k2tos .25s ease-in-out 5 alternate both}@keyframes k2tos{to{transform:translate(1.5px,-1.5px)}}
.k2humo{animation:k2humo 2.2s ease-out infinite}@keyframes k2humo{from{transform:translate(0,0) scale(.4);opacity:.8}to{transform:translate(-70px,-26px) scale(1.6);opacity:0}}
.k2nariz{transform-box:fill-box;transform-origin:50% 100%;animation:k2nariz 1.6s cubic-bezier(.3,0,.3,1) both}@keyframes k2nariz{0%{transform:none}40%,100%{transform:rotate(var(--r,5deg))}}
.k2bote{animation:k2bote .5s ease-in-out infinite alternate}@keyframes k2bote{to{transform:translateY(-5px)}}
.k2osc{animation:k2osc .6s ease-in-out infinite alternate}@keyframes k2osc{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
.k2izq{animation:k2izq 2.6s ease-in both}@keyframes k2izq{from{transform:none}to{transform:translate(-46px,0) rotate(-14deg)}}
.k2der{animation:k2der 2.6s ease-in both}@keyframes k2der{from{transform:none}to{transform:translate(46px,0) rotate(14deg)}}
.k2recta{animation:k2recta 2.4s ease-in both}@keyframes k2recta{from{transform:translateY(60px)}to{transform:translateY(-120px)}}
.k2curva{offset-rotate:auto;animation:k2curva 2.8s ease-in-out both}@keyframes k2curva{from{offset-distance:0%}to{offset-distance:100%}}
.k2avz{animation:k2avz 2.2s linear both}@keyframes k2avz{from{transform:translateX(0)}to{transform:translateX(var(--d,100px))}}
.k2avzF{animation:k2avzF 2.6s cubic-bezier(.15,.7,.35,1) both}@keyframes k2avzF{from{transform:translateX(0)}to{transform:translateX(var(--d,100px))}}
.k2infla{transform-box:fill-box;transform-origin:var(--o,0% 50%);animation:k2infla .35s cubic-bezier(.2,1.6,.4,1) both}@keyframes k2infla{from{transform:scale(.05)}to{transform:scale(1)}}
.k2lat{transform-box:fill-box;transform-origin:50% 100%;animation:k2lat 1.4s ease-in-out infinite}@keyframes k2lat{0%,100%{transform:none}25%{transform:rotate(-26deg)}55%{transform:rotate(30deg)}}
.k2cae{animation:k2cae 1.4s cubic-bezier(.5,0,1,1) both}@keyframes k2cae{from{transform:translateY(0)}to{transform:translateY(var(--y,120px))}}
.k2adel{animation:k2adel 1.6s cubic-bezier(.5,0,.6,1) infinite}@keyframes k2adel{0%,30%{transform:none}55%{transform:translateX(var(--x,30px))}100%{transform:none}}
.k2mece{transform-box:fill-box;transform-origin:50% 100%;animation:k2mece 1.2s ease-in-out infinite alternate}@keyframes k2mece{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
.k2pul{transform-box:fill-box;transform-origin:center;animation:late 1s ease-in-out infinite alternate}
.k2rueda{transform-box:fill-box;transform-origin:center;animation:k2spin .6s linear infinite}
.k2desl{animation:k2desl 2.4s cubic-bezier(.2,.6,.4,1) both}@keyframes k2desl{from{transform:translateX(0)}to{transform:translateX(var(--d,120px))}}
.k2cola{transform-box:fill-box;transform-origin:50% 20%;animation:k2cola 2.4s ease-in-out both}@keyframes k2cola{0%{transform:none}50%{transform:rotate(var(--r,18deg))}100%{transform:rotate(0)}}
.k2trompo{transform-box:fill-box;transform-origin:center;animation:k2trompo 2.4s cubic-bezier(.4,0,.4,1) both}@keyframes k2trompo{from{transform:rotate(0)}to{transform:rotate(180deg)}}
</style>`);
// ---------- auxiliares ----------
const T=(x,y,t,s=13,c='#F1F7FB',a='')=>lbl(x,y,t,s,c,a);
const W=(w,d=0)=>wd(w,d);
const big=(x,y,c,s=2,luz)=>`<g transform="translate(${x},${y}) scale(${s})">${auto(c,luz)}</g>`;
const bigI=(x,y,c,s=2,luz)=>`<g transform="translate(${x},${y}) scale(${-s},${s})">${auto(c,luz)}</g>`;
// auto visto desde arriba, centrado en 0,0 y mirando hacia arriba
const arriba=(c='#1CB0F6',s=1)=>`<g transform="scale(${s})"><rect x="-19" y="-24" width="6" height="13" rx="2" fill="#111"/><rect x="13" y="-24" width="6" height="13" rx="2" fill="#111"/><rect x="-19" y="12" width="6" height="13" rx="2" fill="#111"/><rect x="13" y="12" width="6" height="13" rx="2" fill="#111"/><rect x="-16" y="-34" width="32" height="68" rx="10" fill="${c}"/><path d="M-12 -16 Q0 -22 12 -16 L10 -6 H-10Z" fill="#BDE7FF" opacity=".9"/><rect x="-10" y="-4" width="20" height="18" rx="4" fill="#000" opacity=".15"/><path d="M-10 20 H10 L12 27 Q0 31 -12 27Z" fill="#BDE7FF" opacity=".75"/><rect x="-14" y="-35" width="7" height="4" rx="2" fill="#FFE27A"/><rect x="7" y="-35" width="7" height="4" rx="2" fill="#FFE27A"/><rect x="-14" y="31" width="7" height="4" rx="2" fill="#FF4B4B"/><rect x="7" y="31" width="7" height="4" rx="2" fill="#FF4B4B"/></g>`;
const caja=(x,y,w,h,c='#1E2B32',r=14,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"${a}/>`;
const tacho=(x1,y1,x2,y2,a='')=>`<g${a} stroke="#FF4B4B" stroke-width="7" stroke-linecap="round"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><line x1="${x2}" y1="${y1}" x2="${x1}" y2="${y2}"/></g>`;
const ok=(x,y,a='',s=30)=>`<g${a}><circle cx="${x}" cy="${y}" r="${s/2}" fill="#58CC02"/><path d="M${x-s*.22} ${y} L${x-s*.05} ${y+s*.18} L${x+s*.25} ${y-s*.18}" stroke="#fff" stroke-width="${s*.13}" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
const no=(x,y,a='',s=30)=>`<g${a}><circle cx="${x}" cy="${y}" r="${s/2}" fill="#FF4B4B"/><path d="M${x-s*.2} ${y-s*.2} L${x+s*.2} ${y+s*.2} M${x+s*.2} ${y-s*.2} L${x-s*.2} ${y+s*.2}" stroke="#fff" stroke-width="${s*.13}" stroke-linecap="round"/></g>`;
const flecha=(x1,y1,x2,y2,c='#FFC800',a='',sw=5)=>{const an=Math.atan2(y2-y1,x2-x1),h=12;return `<g${a}><line x1="${x1}" y1="${y1}" x2="${x2-Math.cos(an)*h*.6}" y2="${y2-Math.sin(an)*h*.6}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/><path d="M${x2} ${y2} L${(x2-h*Math.cos(an-.5)).toFixed(1)} ${(y2-h*Math.sin(an-.5)).toFixed(1)} L${(x2-h*Math.cos(an+.5)).toFixed(1)} ${(y2-h*Math.sin(an+.5)).toFixed(1)}Z" fill="${c}"/></g>`};
const chips=(...a)=>`<div class="chips">${a.map(([w,t])=>`<span data-w="${w}">${t}</span>`).join('')}</div>`;
const big1=(w,t)=>`<div class="cap big" data-w="${w}">${t}</div>`;
const cap=(w,t)=>`<div class="cap" data-w="${w}">${t}</div>`;
// ---- lugares ----
const taller=(h=230)=>`${cieloG('#56677A','#3E4C59',h)}<rect x="20" y="24" width="150" height="74" rx="4" fill="#6B5B45"/>${grid(40,10,30,32,14,16,(x,y)=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#4A3E2F"/>`)}<path d="M40 40 h14 v40 h-14z M70 36 l8 0 l3 50 l-14 0z" fill="#9AB0BC" opacity=".7"/><rect x="100" y="44" width="50" height="8" rx="3" fill="#C9D4D8" opacity=".7"/><rect x="250" y="20" width="90" height="60" rx="4" fill="#7F99A8" opacity=".6"/><rect y="${h-56}" width="360" height="56" fill="#2C363D"/><rect y="${h-56}" width="360" height="4" fill="#4E5C66"/>`;
const ruta=(h=230)=>L.carretera(h);
const nocheR=(h=230)=>`${cieloG('#070D22','#1A2850',h)}${estrellas(14,30,120).replace(/400/g,'360')}<path d="M0 130 Q90 112 180 124 T360 120 V${h} H0Z" fill="#0F2420"/><path d="M168 126 L192 126 L330 ${h} L30 ${h}Z" fill="#20282D"/><line x1="180" y1="126" x2="180" y2="${h+10}" stroke="#B8A23A" stroke-width="4" stroke-dasharray="18 18"/><rect y="${h-2}" width="360" height="2" fill="#20282D"/>`;
const bencinera=(h=230)=>`${cieloG('#4F86B8','#CFE6F2',h)}${ciudadBaja(17,150,'#9DB3C6')}<rect x="40" y="30" width="280" height="24" rx="4" fill="#E8EEF0"/><rect x="40" y="50" width="280" height="6" fill="#FF4B4B"/><rect x="70" y="56" width="10" height="110" fill="#C9D4D8"/><rect x="280" y="56" width="10" height="110" fill="#C9D4D8"/><rect y="150" width="360" height="${h-150}" fill="#8C9AA3"/><rect y="150" width="360" height="4" fill="#A9B6BD"/>`;
const surtidor=(x,y)=>`<g transform="translate(${x},${y})"><rect x="-22" y="-86" width="44" height="86" rx="6" fill="#F1F7FB"/><rect x="-22" y="-86" width="44" height="14" rx="6" fill="#FF4B4B"/><rect x="-14" y="-64" width="28" height="18" rx="3" fill="#1A2329"/><text x="0" y="-51" font-size="10" font-weight="900" fill="#58CC02" text-anchor="middle">0,00</text><path d="M22 -40 q16 0 16 20 v24" stroke="#1A2329" stroke-width="4" fill="none"/></g>`;
// tablero visto desde el asiento: parabrisas arriba y panel abajo
const cabina=(cielo='#8EC5E0')=>`<rect width="360" height="120" fill="${cielo}"/><path d="M0 86 Q120 70 180 78 T360 82 V120 H0Z" fill="#3E6B55"/><path d="M170 78 L190 78 L300 124 L60 124Z" fill="#4A565D"/><line x1="180" y1="80" x2="180" y2="124" stroke="#F2D04A" stroke-width="3" stroke-dasharray="8 8"/><path d="M0 0 H360 V20 Q180 2 0 20Z" fill="#141C21"/><path d="M0 110 Q180 92 360 110 V230 H0Z" fill="#1A2329"/><path d="M40 120 Q180 104 320 120 V196 Q180 186 40 196Z" fill="#0E1418" stroke="#37464F" stroke-width="2"/><rect y="228" width="360" height="2" fill="#1A2329"/>`;
// reloj indicador: ángulos de -120° a 120°
const reloj=(cx,cy,r,max,paso,et,v0,v1,a='',col='#FFC800',rojo)=>{let t='';for(let k=0;k<=max;k+=paso){const an=(-120+240*k/max-90)*Math.PI/180;t+=`<line x1="${(cx+Math.cos(an)*r*.78).toFixed(1)}" y1="${(cy+Math.sin(an)*r*.78).toFixed(1)}" x2="${(cx+Math.cos(an)*r*.92).toFixed(1)}" y2="${(cy+Math.sin(an)*r*.92).toFixed(1)}" stroke="${rojo&&k>=rojo?'#FF4B4B':'#C9D4D8'}" stroke-width="2.5"/><text x="${(cx+Math.cos(an)*r*.6).toFixed(1)}" y="${(cy+Math.sin(an)*r*.6+4).toFixed(1)}" font-size="${(r*.17).toFixed(0)}" font-weight="900" fill="${rojo&&k>=rojo?'#FF4B4B':'#C9D4D8'}" text-anchor="middle">${k}</text>`}
 const ag=x=>-120+240*x/max;
 return `<g${a}><circle cx="${cx}" cy="${cy}" r="${r}" fill="#0B1013" stroke="#37464F" stroke-width="3"/>${t}<text x="${cx}" y="${cy+r*.42}" font-size="${(r*.15).toFixed(0)}" font-weight="900" fill="#9AB0BC" text-anchor="middle">${et}</text><g transform="translate(${cx},${cy})"><g class="go k2n" style="--a0:${ag(v0)}deg;--a:${ag(v1)}deg"><path d="M-3 0 L0 ${-r*.8} L3 0Z" fill="${col}"/></g></g><circle cx="${cx}" cy="${cy}" r="${r*.09}" fill="${col}"/></g>`};
// testigo: luz del panel
const testigo=(x,y,col,ic,a='',cl='k2glow')=>`<g${a}><circle cx="${x}" cy="${y}" r="22" fill="${col}" opacity=".22" class="${cl}"/><circle cx="${x}" cy="${y}" r="15" fill="#0B1013" stroke="${col}" stroke-width="2.5"/><text x="${x}" y="${y+6}" font-size="16" text-anchor="middle" fill="${col}">${ic}</text></g>`;
// íconos dibujados de los testigos (para no depender de emojis)
const aceiteIc=(x,y,c,s=1)=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M-14 4 H8 L16 -4 L18 -2 L10 8 H-14Z M-10 -2 H2 V4 H-10Z" fill="${c}"/><path d="M18 2 q2 4 0 6 q-2 -2 0 -6Z" fill="${c}"/></g>`;
const bateriaIc=(x,y,c,s=1)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-14" y="-8" width="28" height="18" rx="2" fill="none" stroke="${c}" stroke-width="3"/><rect x="-10" y="-12" width="5" height="4" fill="${c}"/><rect x="5" y="-12" width="5" height="4" fill="${c}"/><path d="M-9 1 h6 M-6 -2 v6 M4 1 h6" stroke="${c}" stroke-width="2.5"/></g>`;
// bloque de motor con pistones
const motor=(x,y,s=1,anim=true)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-60" y="-40" width="120" height="78" rx="8" fill="#5D6D78"/><rect x="-66" y="-52" width="132" height="16" rx="5" fill="#7C8D98"/>${[-36,-12,12,36].map((px,i)=>`<rect x="${px-9}" y="-34" width="18" height="40" rx="2" fill="#2E3A41"/><g class="${anim?(i%2?'k2pis2':'k2pis'):''}"><rect x="${px-8}" y="-34" width="16" height="16" rx="2" fill="#C9D4D8"/><rect x="${px-2}" y="-18" width="4" height="22" fill="#9AB0BC"/></g>`).join('')}<rect x="-60" y="22" width="120" height="16" rx="4" fill="#46555E"/></g>`;
// persona sentada de perfil (mira a la derecha); x,y = cadera
const persona=(x,y,c='#1CB0F6',s=1)=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M-30 -96 Q-38 -40 -30 6 L-6 6 L-10 -96Z" fill="#4A5A66"/><rect x="-36" y="-122" width="16" height="30" rx="6" fill="#4A5A66"/><path d="M-14 -88 Q-4 -92 6 -86 L10 -20 Q0 -4 -16 -6Z" fill="${c}"/><path d="M-12 -6 H40 Q48 -6 48 4 V10 H-12Z" fill="#2E4A7A"/><path d="M40 4 L46 52 H58 L52 2Z" fill="#2E4A7A"/><rect x="44" y="50" width="20" height="8" rx="3" fill="#1A2329"/><path d="M4 -78 Q26 -66 40 -56" stroke="${c}" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="-2" cy="-104" r="15" fill="#F1C7A5"/><path d="M-17 -108 Q-14 -124 2 -122 Q14 -120 12 -108 Q2 -114 -17 -108Z" fill="#3B2A1E"/><circle cx="6" cy="-106" r="2" fill="#1A2329"/></g>`;
const volante=(x,y,s=1,a='')=>`<g transform="translate(${x},${y}) scale(${s})"${a}><circle r="30" fill="none" stroke="#1A2329" stroke-width="7"/><circle r="8" fill="#1A2329"/><path d="M-28 4 L-8 2 M28 4 L8 2 M0 8 L0 28" stroke="#1A2329" stroke-width="6"/></g>`;
// neumático de frente (perfil de la banda)
const banda=(x,y,tipo,a='')=>{const fondo=`<rect x="${x-58}" y="${y-30}" width="116" height="60" rx="12" fill="#E8EEF0"/>`;const w=90,h=40;let s='';for(let i=0;i<7;i++){const px=x-w/2+8+i*12.4,cen=Math.abs(i-3)<=1,ext=i==0||i==6;const g=tipo==='centro'&&cen?4:tipo==='extremos'&&ext?4:tipo==='irregular'&&(i%3==0)?5:tipo==='gastado'?3:12;s+=`<rect x="${px.toFixed(1)}" y="${y-h/2}" width="7" height="${g}" fill="#0B1013"/>`}
 return `<g${a}>${fondo}<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="10" fill="#3A464D"/>${s}</g>`};
// edificio de n pisos
const edificio=(x,yb,n,dy,a='',marca)=>{let o=`<rect x="${x-34}" y="${yb-n*dy-6}" width="68" height="${n*dy+6}" fill="#7C8FA6"/>`;for(let i=0;i<n;i++){const y=yb-(i+1)*dy;o+=`<rect x="${x-26}" y="${y+4}" width="22" height="${dy-9}" rx="2" fill="${marca==i+1?'#FFC800':'#BFD8E6'}" opacity="${marca==i+1?1:.7}"/><rect x="${x+4}" y="${y+4}" width="22" height="${dy-9}" rx="2" fill="${marca==i+1?'#FFC800':'#BFD8E6'}" opacity="${marca==i+1?1:.7}"/>`}return `<g${a}>${o}</g>`};
const piso=(n,v,pal)=>{const dy=n>7?16:22,yb=214,x=250;return `<svg viewBox="0 0 360 230">${cieloG('#3E6E9E','#BFE0EE')}${ciudadBaja(n,214,'#9DB3C6')}<rect y="214" width="360" height="16" fill="#5B6B74"/>${edificio(x,yb,n,dy,'',n)}
  ${big(18,206,'#FF4B4B',1.3)}<g${W(pal)}><text x="${x}" y="${yb-n*dy+dy/2+6}" font-size="22" text-anchor="middle">🧍</text><g class="go k2cae" style="--y:${n*dy-dy/2}px"><g transform="translate(${x+50},${yb-n*dy+dy/2})">${em(0,6,'⬇️',20)}</g></g></g>
  ${tag(70,40,104,v+' km/h','',"#0E171C")}</svg>`};
// fichas que aparecen cuando la voz dice su palabra: [palabra, ícono, texto] (máx. 3 por fila; el texto se parte en 2 líneas)
function partir(t,an){if(t.length*5.6<=an-8)return [t];const ws=t.split(' ');let best=[t],m=1e9;for(let i=1;i<ws.length;i++){const a=ws.slice(0,i).join(' '),b=ws.slice(i).join(' '),d=Math.max(a.length,b.length);if(d<m){m=d;best=[a,b]}}return best}
const fichas=(fs,y0=40)=>{const n=fs.length,por=n<=3?n:Math.ceil(n/2),an=Math.min(110,340/por-8);return fs.map(([w,ic,t],i)=>{const fila=Math.floor(i/por),col=i%por,enf=Math.min(por,n-fila*por),x=180+(col-(enf-1)/2)*(an+8),y=y0+fila*84;
 const ls=partir(t,an);return `<g${W(w)}>${caja(x-an/2,y,an,78,'#0E171C',12,' opacity=".9"')}${em(x,y+32,ic,24)}${ls.map((l,k)=>T(x,y+(ls.length>1?52:58)+k*13,l,10.5)).join('')}</g>`}).join('')};
// escena de fichas sobre un fondo: F(fondo, fichas, [palabra,título], [palabra,subtítulo], svg extra)
const F=(fondo,fs,grande,sub,extra='')=>`<svg viewBox="0 0 360 230">${fondo}${extra}${fichas(fs)}</svg>${grande?big1(grande[0],grande[1]):''}${sub?cap(sub[0],sub[1]):''}`;
const cifraBox=(x,y,w,h)=>caja(x,y,w,h,'#0E171C',14,' opacity=".9"');
return {fichas,F,cifraBox,partir,T,W,big,bigI,arriba,caja,tacho,ok,no,flecha,chips,big1,cap,taller,ruta,nocheR,bencinera,surtidor,cabina,reloj,testigo,aceiteIc,bateriaIc,motor,persona,volante,banda,edificio,piso};
})();
