// Escenas explicativas del capítulo 1. Cada una "actúa" lo que dice la voz.
// data-w="palabra": el elemento aparece cuando la voz llega a esa palabra.
// data-h="palabra": el elemento desaparece en esa palabra. class="go": su animación parte al aparecer.
const cara=(s=1)=>`<g transform="scale(${s})"><rect x="-48" y="-48" width="96" height="96" rx="18" fill="#F1F7FB" stroke="#C9D4D8" stroke-width="3"/>${[[-24,-24],[24,-24],[0,0],[-24,24],[24,24]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="8.5" fill="${i==2?'#FF4B4B':'#1A2329'}"/>`).join('')}</g>`;
const ciudadBaja=(seed,base,col)=>{const r=rnd(seed);let x=-6,o='';while(x<366){const w=28+r()*38,h=38+r()*70;o+=`<rect x="${x.toFixed(0)}" y="${(base-h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" rx="2" fill="${col}"/>`;for(let yy=base-h+10;yy<base-12;yy+=16)for(let xx=x+6;xx<x+w-8;xx+=11)if(r()<.35)o+=`<rect x="${xx.toFixed(0)}" y="${yy.toFixed(0)}" width="5" height="7" fill="#DCEBF2" opacity=".55"/>`;x+=w+3}return o};
const calleMini=(cielo='#8EC5E0',seed=3)=>`<rect width="360" height="152" fill="${cielo}"/>${ciudadBaja(seed+40,146,'#7D93AE')}${ciudadBaja(seed,146,'#5E7390')}<rect y="146" width="360" height="6" fill="#8C9AA3"/><rect y="152" width="360" height="78" fill="#33414A"/><line x1="-40" y1="191" x2="400" y2="191" stroke="#D9D9D9" stroke-width="3" stroke-dasharray="22 18" class="dash"/>`;
const lluviaMini=(n=46,h=230,seed=5)=>{const r=rnd(seed);let g='';for(let i=0;i<n;i++){const x=(r()*390).toFixed(0),d=(.55+r()*.25).toFixed(2);g+=`<line x1="${x}" y1="-16" x2="${x-3}" y2="-4" stroke="#D6E9F5" stroke-width="1.6" stroke-linecap="round" opacity=".75" class="gotaM" style="--h:${h+30}px;animation-duration:${d}s;animation-delay:-${(r()*d).toFixed(2)}s"/>`}return g};
// gotas cortas e iguales que cruzan solo el alto de la escena
const boom=(x,y,w,d=0,s=30)=>`<text class="boom" x="${x}" y="${y}" font-size="${s}" text-anchor="middle" data-w="${w}" style="transition-delay:${d}ms;animation-delay:${d}ms">💥</text>`;
const nodo=(x,y,ic,t,w,d=0)=>`<g data-w="${w}" style="transition-delay:${d}ms"><circle cx="${x}" cy="${y}" r="27" fill="#1E2B32" stroke="#FFC800" stroke-width="2.5"/><text x="${x}" y="${y+10}" font-size="26" text-anchor="middle">${ic}</text><text x="${x}" y="${y+46}" font-size="12.5" font-weight="900" fill="#F1F7FB" text-anchor="middle">${t}</text></g>`;
Object.assign(ESCENAS,{
 // 1. Accidente: suceso eventual, casual e impredecible (un dado que rueda)
 'c1-dado':()=>`<svg viewBox="0 0 360 220"><ellipse cx="180" cy="196" rx="64" ry="9" fill="#000" opacity=".35"/><g transform="translate(180,134)"><g class="dado">${cara()}</g></g></svg>
  <div class="cap big">Accidente</div>
  <div class="cap" data-w="suceso">“Suceso eventual del que involuntariamente resulta un daño”</div>
  <div class="chips"><span data-w="casual">🎲 casual</span><span data-w="impredecible">❓ impredecible</span></div>`,
 // 2a. Si fueran casualidad, ocurrirían igual en cualquier situación; pero aumentan cuando llueve
 'c1-lluvia':()=>`<svg viewBox="0 0 360 230">${calleMini()}
  <rect width="360" height="152" fill="#3B4756" data-w="llueve" style="--o:.75"/><g data-w="llueve">${lluviaMini()}</g>
  <g transform="translate(0,182)"><g class="car izq" style="animation-duration:6.5s;animation-delay:-2s"><g transform="translate(72,0) scale(-1,1)">${auto('#FFC800',1)}</g></g></g>
  <g transform="translate(0,222)"><g class="car" style="animation-duration:6s">${auto('#1CB0F6',1)}</g></g>
  ${boom(90,176,'llueve',300)}${boom(250,214,'llueve',800)}${boom(320,178,'llueve',1300)}</svg>
  <div class="cap" data-w="ocurrirían">Si fuera casualidad: igual con o sin lluvia</div>
  <div class="cap big" data-w="llueve">🌧️ Con lluvia, aumentan</div>`,
 // 2b. Con menos autos debería haber menos siniestros; pero de noche, con menos vehículos, hay muchos fallecidos
 'c1-noche':()=>{const autos=(n,y0)=>Array.from({length:n},(_,k)=>{const dur=k%2?6.6:6,del=Math.floor(k/2)*dur/Math.ceil(n/2)+(k%2?1:0);return `<g transform="translate(0,${y0+(k%2?72:106)})"><g class="car${k%2?' izq':''}" style="animation-duration:${dur}s;animation-delay:-${del.toFixed(2)}s"><g${k%2?' transform="translate(72,0) scale(-1,1)"':''}>${auto(['#1CB0F6','#FFC800','#58CC02','#CE82FF','#FF9600','#9AB0BC'][k],y0>0)}</g></g></g>`}).join('');
  const panel=(y,noche)=>`<g transform="translate(0,${y})"><rect width="360" height="44" fill="${noche?'#0B1430':'#8EC5E0'}"/>${noche?estrellas(19,8,40)+'<circle cx="320" cy="20" r="11" fill="#F4F1DE"/>':'<circle cx="320" cy="20" r="12" fill="#FFD36B"/>'}<rect y="44" width="360" height="66" fill="${noche?'#222D34':'#33414A'}"/><line x1="-40" y1="77" x2="400" y2="77" stroke="#D9D9D9" stroke-width="2.5" stroke-dasharray="18 14" opacity=".7"/>
   <rect x="8" y="8" width="${noche?150:120}" height="26" rx="8" fill="#1E2B32"/><text x="${noche?83:68}" y="26" font-size="13" font-weight="900" fill="#F1F7FB" text-anchor="middle">${noche?'🌙 Noche: menos autos':'☀️ Día: más autos'}</text></g>`;
  return `<svg viewBox="0 0 360 232"><g data-w="casuales">${panel(0,0)}<g>${autos(6,0)}</g></g>
  <g data-w="menos autos">${panel(122,1)}<g transform="translate(0,122)">${autos(2,122).replace(/translate\(0,(\d+)\)/g,(m,v)=>'translate(0,'+(v-122)+')')}</g></g>
  ${boom(70,196,'pero de noche',0)}${boom(180,222,'pero de noche',400)}${boom(290,196,'pero de noche',800)}${boom(120,190,'fallecidas',0)}${boom(250,222,'fallecidas',400)}</svg>
  <div class="chips"><span data-w="debería">🎲 Si fuera azar: menos autos → menos siniestros</span></div>
  <div class="cap big" data-w="fallecidas">Pero de noche hay muchas personas fallecidas</div>`},
 // 2c. Quienes han bebido alcohol tienen más siniestros
 'c1-alcohol':()=>`<svg viewBox="0 0 360 230">${calleMini('#8EC5E0',7)}
  <g transform="translate(0,222)"><g class="car" style="animation-duration:6s">${auto('#1CB0F6')}</g></g>
  <g data-w="alcohol"><g transform="translate(150,182)"><g class="zig"><g transform="translate(72,0) scale(-1,1)">${auto('#FF4B4B')}</g><text x="36" y="-42" font-size="24" text-anchor="middle">🍺</text></g></g></g>
  ${boom(110,178,'más siniestros',0)}${boom(270,214,'más siniestros',400)}${boom(60,214,'más siniestros',800)}</svg>
  <div class="cap big" data-w="más siniestros">🍺 Con alcohol, más siniestros</div>`,
 // 3. Tienen poco de azarosos o de impredecibles
 'c1-poco-azar':()=>`<div class="cap" data-w="casualidad">Si fueran pura casualidad, eso no pasaría</div><svg viewBox="0 0 360 200"><g transform="translate(86,100)">${cara(.85)}</g>
  <g data-w="azarosos" stroke="#FF4B4B" stroke-width="11" stroke-linecap="round"><line x1="36" y1="50" x2="136" y2="150"/><line x1="136" y1="50" x2="36" y2="150"/></g>
  <g data-w="impredecibles"><text x="236" y="58" font-size="32" text-anchor="middle">🌧️</text><text x="236" y="112" font-size="32" text-anchor="middle">🌙</text><text x="236" y="166" font-size="32" text-anchor="middle">🍺</text>
   <path d="M260 47 L304 92 M260 101 H304 M260 155 L304 110" stroke="#FFC800" stroke-width="4" stroke-linecap="round"/><text x="326" y="112" font-size="34" text-anchor="middle">💥</text></g></svg>
  <div class="cap big" data-w="azarosos">Poco de azar</div>
  <div class="cap" data-w="impredecibles">“Tienen poco de azarosos o de impredecibles”</div>`,
 // 4. Si fuera eventual, dependería solo del tiempo al volante. Pero no es así.
 'c1-tiempo':()=>{const fila=(y,mala)=>`<g transform="translate(0,${y})"><rect width="360" height="70" fill="#8EC5E0"/>
   ${mala?`<rect width="360" height="70" fill="#0B1430" data-w="no es así" style="--o:.8"/>`:''}<rect y="70" width="360" height="34" fill="#33414A"/>
   <g transform="translate(0,96)"><g class="car" style="animation-duration:${mala?5:5}s">${auto(mala?'#FF4B4B':'#1CB0F6',mala)}</g></g>
   ${mala?`<defs><clipPath id="fila${++gid}"><rect width="360" height="104"/></clipPath></defs><g data-w="no es así" clip-path="url(#fila${gid})">${lluviaMini(22,104,7)}<text x="300" y="34" font-size="22">🍺</text></g>`+boom(110,96,'no es así',500,26)+boom(250,96,'no es así',1100,26):`<text x="300" y="40" font-size="26" data-w="no es así">✅</text>`}
   <rect x="8" y="8" width="96" height="26" rx="8" fill="#1E2B32" data-w="tiempo"/><text x="56" y="26" font-size="13" font-weight="900" fill="#F1F7FB" text-anchor="middle" data-w="tiempo">⏱ 1 hora</text></g>`;
  return `<svg viewBox="0 0 360 220">${fila(0,0)}${fila(112,1)}</svg>
  <div class="cap" data-w="tiempo" data-h="no es así">Si fuera casual, solo importaría el tiempo al volante</div>
  <div class="cap big" data-w="no es así">Pero no es así</div>`},
 // 6. Se cambió por "siniestro": efectos negativos y responsabilidad de cada persona
 'c1-siniestro':()=>`<div class="swap"><span class="tach">🎲 Accidente<i data-w="cambió"></i></span><span class="nuevo" data-w="siniestros">Siniestro</span></div>
  <svg viewBox="0 0 360 170"><path d="M180 0 V30 M180 30 H90 V60 M180 30 H270 V60" stroke="#FFC800" stroke-width="4" fill="none" data-w="efectos"/>
  <g data-w="efectos"><rect x="20" y="62" width="140" height="100" rx="16" fill="#1E2B32"/><text x="90" y="110" font-size="34" text-anchor="middle">🚑🏥</text><text x="90" y="146" font-size="13.5" font-weight="900" fill="#F1F7FB" text-anchor="middle">Efectos negativos</text></g>
  <g data-w="responsabilidad"><rect x="200" y="62" width="140" height="100" rx="16" fill="#1E2B32"/><text x="270" y="110" font-size="30" text-anchor="middle">🚗🚶🚲</text><text x="270" y="140" font-size="12.5" font-weight="900" fill="#F1F7FB" text-anchor="middle">Responsabilidad de</text><text x="270" y="155" font-size="12.5" font-weight="900" fill="#F1F7FB" text-anchor="middle">cada persona usuaria</text></g></svg>`,
 // 7. La mayoría de las muertes podría haberse evitado (el choque se rebobina y se evita)
 'c1-evitable':()=>`<svg viewBox="0 0 360 230">${calleMini('#8EC5E0',11)}
  <g transform="translate(250,222)">${auto('#9AB0BC')}<rect x="0" y="-18" width="5" height="6" rx="2" fill="#FF4B4B"/></g>
  <g data-h="podría"><g transform="translate(0,222)"><g class="embiste">${auto('#FF4B4B')}<g fill="#fff" opacity=".6"><rect x="-34" y="-30" width="26" height="3"/><rect x="-42" y="-20" width="32" height="3"/><rect x="-30" y="-10" width="20" height="3"/></g></g></g><text class="boom2" x="250" y="210" font-size="40" text-anchor="middle">💥</text></g>
  <text class="rew" x="180" y="100" font-size="56" text-anchor="middle" data-w="podría">⏪</text>
  <g data-w="podría"><g transform="translate(0,222)"><g class="go frena">${auto('#58CC02')}</g></g></g>
  <text x="250" y="150" font-size="34" text-anchor="middle" data-w="evitado">✅</text></svg>
  <div class="cap big" data-w="evitado">Se podía evitar</div>
  <div class="cap" data-w="mayoría">La mayoría de las muertes en el tránsito</div>`,
 // 8. Para reducir la posibilidad de un siniestro, evita los factores de riesgo (el libro los detalla)
 'c1-riesgos':()=>{const s=(x,y,ic,t,d)=>`<g data-w="evitar" style="transition-delay:${d}ms"><path d="M${x} ${y-30} L${x+30} ${y+22} H${x-30}Z" fill="#FFC800" stroke="#1A2329" stroke-width="3" stroke-linejoin="round"/><text x="${x}" y="${y+14}" font-size="22" text-anchor="middle">${ic}</text><text x="${x}" y="${y+42}" font-size="12" font-weight="900" fill="#F1F7FB" text-anchor="middle">${t}</text></g>`;
  return `<svg viewBox="0 0 360 230"><rect width="360" height="90" fill="#E39A6E"/><path d="M0 90 Q90 70 180 82 T360 80 V230 H0Z" fill="#2F5D50"/><path d="M168 86 L192 86 L330 230 L30 230Z" fill="#39454C"/><line x1="180" y1="86" x2="180" y2="240" stroke="#F2D04A" stroke-width="4" stroke-dasharray="18 18" class="dashv"/><rect y="228" width="360" height="2" fill="#39454C"/>
  <g transform="translate(180,196)"><rect x="-26" y="-4" width="52" height="24" rx="6" fill="#1CB0F6"/><path d="M-20 -4 L-15 -20 H15 L20 -4Z" fill="#1899D6"/><rect x="-24" y="4" width="10" height="5" rx="2" fill="#FFB3B3"/><rect x="14" y="4" width="10" height="5" rx="2" fill="#FFB3B3"/></g>
  ${s(48,70,'🍺','Alcohol',0)}${s(312,70,'📱','Distracciones',300)}${s(52,160,'😴','Sueño',600)}${s(308,160,'⏩','Velocidad',900)}</svg>
  <div class="cap big" data-w="factores">Factores de riesgo</div>
  <div class="chips"><span data-w="capítulo">📖 El libro los detalla capítulo a capítulo</span></div>`},
 // 9. Responsabilidad colectiva: si alguien conduce ebrio o sin cinturón, nos afecta a todos
 'c1-colectiva':()=>`<svg viewBox="0 0 360 250">
  <g data-w="afecta"><circle cx="180" cy="125" r="60" fill="none" stroke="#FFC800" stroke-width="2" class="onda"/><circle cx="180" cy="125" r="60" fill="none" stroke="#FFC800" stroke-width="2" class="onda" style="animation-delay:.8s"/>
   <path d="M180 125 L60 50 M180 125 L300 50 M180 125 L60 200 M180 125 L300 200" stroke="#FFC800" stroke-width="2" stroke-dasharray="5 6" opacity=".7"/></g>
  <g data-w="ebrio"><circle cx="180" cy="125" r="44" fill="#3D1A1C"/><g transform="translate(144,140)">${auto('#FF4B4B')}</g><text x="210" y="98" font-size="22">🍺</text></g>
  <text x="140" y="98" font-size="20" data-w="cinturón">🔓</text>
  <text x="180" y="112" font-size="34" text-anchor="middle" class="boom" data-w="siniestro">💥</text>
  ${nodo(60,50,'🚑','Atención','afecta',0)}${nodo(300,50,'🏥','Salud','afecta',300)}${nodo(60,200,'👨‍👩‍👧','Familias','afecta',600)}${nodo(300,200,'👥','Todos','afecta',900)}</svg>
  <div class="cap" data-w="decisión personal">No es solo una decisión personal</div>
  <div class="cap big" data-w="pagamos">Todos pagamos su decisión</div>`,
 // 10. Resumen
 'c1-resumen':()=>`<div class="swap"><span class="tach">🎲 Mala suerte<i data-w="mala suerte"></i></span></div>
  <div class="cap big" style="font-size:36px">Siniestro</div>
  <div class="chips col"><span data-w="causas">🔍 Tiene causas</span><span data-w="evitar">✅ La mayoría se puede evitar</span></div>`,
});

// ================= Sesiones 2 a 7 =================
// Cada escena ocurre en un lugar que cuenta algo (hospital, Chile, parabrisas, carretera…).
// Cifras grandes: contador que sube cuando la voz dice el número (data-to + data-w). Nada de "ícono = 100".
const em=(x,y,ic,s=22,a='')=>`<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle"${a}>${ic}</text>`;
const wd=(w,d=0)=>` data-w="${w}" style="transition-delay:${d}ms;animation-delay:${d}ms"`;
const lbl=(x,y,t,s=13,c='#F1F7FB',a='')=>`<text x="${x}" y="${y}" font-size="${s}" font-weight="900" fill="${c}" text-anchor="middle" paint-order="stroke" stroke="rgba(14,23,28,.55)" stroke-width="3"${a}>${t}</text>`;
const tag=(x,y,w,t,a='',c='#1E2B32')=>`<g${a}><rect x="${x-w/2}" y="${y-16}" width="${w}" height="26" rx="9" fill="${c}" stroke="#37464F" stroke-width="1.5"/>${lbl(x,y+2,t,12.5)}</g>`;
const grid=(n,cols,x0,y0,dx,dy,f)=>Array.from({length:n},(_,i)=>f(x0+(i%cols)*dx,y0+Math.floor(i/cols)*dy,i)).join('');
const cuenta=(x,y,n,w,pre='',s=40,c='#FFC800',an=184)=>`<g data-w="${w}"><rect x="${x-an/2}" y="${y-s+2}" width="${an}" height="${s+14}" rx="14" fill="#0E171C" fill-opacity=".82"/><text x="${x}" y="${y}" font-size="${s}" font-weight="900" fill="${c}" text-anchor="middle" data-to="${n}" data-pre="${pre}" data-w="${w}" style="--o:1;font-variant-numeric:tabular-nums">${pre}0</text></g>`;
const cieloG=(a,b,h=230)=>{const id='s'+(++gid);return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="360" height="${h}" fill="url(#${id})"/>`};
// ---- lugares ----
const L={
 hospital:(h=230)=>`${cieloG('#5E9BC0','#BFE0EE',h)}${ciudadBaja(71,170,'#8FA6BC')}<rect x="120" y="62" width="220" height="112" fill="#EEF3F5"/><rect x="120" y="54" width="220" height="10" fill="#C9D4D8"/>${grid(15,5,136,76,40,26,(x,y)=>`<rect x="${x}" y="${y}" width="24" height="16" rx="2" fill="#9FC7D6"/>`)}<rect x="208" y="140" width="44" height="34" fill="#5B8FA3"/><rect x="214" y="22" width="32" height="32" rx="6" fill="#fff"/><rect x="226" y="27" width="8" height="22" fill="#FF4B4B"/><rect x="219" y="34" width="22" height="8" fill="#FF4B4B"/><rect y="174" width="360" height="${h-174}" fill="#3A4852"/><line x1="-20" y1="204" x2="380" y2="204" stroke="#D9D9D9" stroke-width="3" stroke-dasharray="20 16"/>`,
 chile:(h=230)=>`${cieloG('#2C4E7A','#E7A07A',h)}<path d="M0 ${h} V140 Q40 130 70 150 T120 ${h}Z" fill="#2F6E9E"/><path d="M90 ${h} L110 120 L150 70 L190 104 L230 40 L270 92 L310 56 L360 100 V${h}Z" fill="#5C5470"/><path d="M219 56 L230 40 L241 56 L234 52 L227 58Z M299 70 L310 56 L321 70 L314 66Z M141 82 L150 70 L159 82Z" fill="#F4F1EA"/><path d="M60 ${h} Q120 150 200 168 T360 160 V${h}Z" fill="#3E6B55"/><rect y="${h-2}" width="360" height="2" fill="#3E6B55"/>`,
 espacio:(h=230)=>`${cieloG('#05091A','#16224A',h)}${estrellas(52,40,h)}`,
 plaza:(h=230)=>`${cieloG('#3B3060','#E39A6E',h)}<rect y="${h-70}" width="360" height="70" fill="#3B4A3F"/>${em(30,h-62,'🌳',40)}${em(334,h-66,'🌳',44)}`,
 sala:(h=230)=>`<rect width="360" height="${h}" fill="#C9D8DE"/><rect y="${h-50}" width="360" height="50" fill="#8FA3AE"/><rect x="250" y="30" width="80" height="60" rx="6" fill="#9FC7D6" stroke="#EEF3F5" stroke-width="5"/>`,
 carretera:(h=230)=>`${cieloG('#3E5C8A','#E39A6E',h)}<path d="M0 90 Q90 70 180 82 T360 80 V${h} H0Z" fill="#2F5D50"/><path d="M168 86 L192 86 L330 ${h} L30 ${h}Z" fill="#39454C"/><line x1="180" y1="86" x2="180" y2="${h+10}" stroke="#F2D04A" stroke-width="4" stroke-dasharray="18 18" class="dashv"/><rect y="${h-2}" width="360" height="2" fill="#39454C"/>`,
};
// velocímetro 0–80 km/h con aguja animada
const velo=(v,cx=180,cy=244,r=66)=>{const pt=(k,rr=r)=>{const t=Math.PI-k/80*Math.PI;return[(cx+rr*Math.cos(t)).toFixed(1),(cy-rr*Math.sin(t)).toFixed(1)]};
 const arco=(a,b,c)=>{const[p,q]=pt(a),[s,u]=pt(b);return `<path d="M${p} ${q} A${r} ${r} 0 0 1 ${s} ${u}" stroke="${c}" stroke-width="13" fill="none"/>`};
 return `${arco(0,30,'#58CC02')}${arco(30,45,'#FFC800')}${arco(45,65,'#FF9600')}${arco(65,80,'#FF4B4B')}
 ${[0,30,45,65,80].map(k=>{const[x,y]=pt(k,r-22);return lbl(x,(+y+4).toFixed(0),k,10,'#9AB0BC')}).join('')}
 <g class="aguja" style="--a:${(v/80*180).toFixed(1)}deg;transform-origin:${cx}px ${cy}px"><line x1="${cx}" y1="${cy}" x2="${cx-r+10}" y2="${cy}" stroke="#F1F7FB" stroke-width="5" stroke-linecap="round"/></g><circle cx="${cx}" cy="${cy}" r="8" fill="#F1F7FB"/>`};
// vista desde el parabrisas: calle con paso de cebra y un peatón; abajo, el tablero
const parabrisas=(v)=>`${cieloG('#7FB3D5','#CFE2E8',170)}${ciudadBaja(5+v,100,'#7D93AE')}<path d="M0 100 H360 V170 H0Z" fill="#5A6B75"/><path d="M150 100 L210 100 L360 170 L0 170Z" fill="#3A4852"/>${[0,1,2,3,4,5,6].map(i=>`<path d="M${86+i*28} 140 L${100+i*28} 140 L${104+i*29} 156 L${88+i*29} 156Z" fill="#F1F7FB" opacity=".9"/>`).join('')}${em(190,150,'🚶',30)}
 <path d="M0 0 H360 V20 Q180 8 0 20Z M0 0 V170 L18 170 Q10 80 26 20 L0 20Z M360 0 V170 L342 170 Q350 80 334 20 L360 20Z" fill="#1A2329"/><rect y="168" width="360" height="112" fill="#1A2329"/>${velo(v)}${lbl(180,272,v+' km/h',18,'#FFC800')}`;
const chile=`<path d="M176 6 C186 40 170 70 182 100 S170 160 180 190 S174 232 180 254 L166 254 C160 232 170 200 162 170 S172 110 160 80 S172 30 164 6Z" fill="#4E8A68" stroke="#7FD49A" stroke-width="1.5"/>`;
const mapaChile=`<rect width="360" height="260" fill="#1E5A85"/><path d="M190 0 C200 40 186 80 198 120 S190 200 198 260 H360 V0Z" fill="#6E6A84"/><path d="M200 0 C212 40 196 80 210 120 S200 200 210 260" stroke="#F4F1EA" stroke-width="3" fill="none" opacity=".7"/>${chile}${lbl(300,40,'Cordillera',11,'#E8E4F0')}${lbl(70,40,'Océano Pacífico',11,'#BFE0F2')}`;
const vela=(x,y,s=22,a='')=>em(x,y,'🕯️',s,a);
const fila10=(n,ic,ic2,w)=>`<div class="fila10">${Array.from({length:10},(_,i)=>`<span class="${i<n?'si':'no'}" data-w="${w}" style="transition-delay:${i*90}ms">${i<n?ic:ic2}</span>`).join('')}</div>`;
Object.assign(ESCENAS,{
 // ---------- Sesión 2 ----------
 // Sin choques sobre el planeta: el emoji 🌎 cambia según el teléfono y caerían en el mar.
 'c1-3000':()=>`<svg viewBox="0 0 360 260">${L.espacio(260)}<circle cx="180" cy="160" r="104" fill="#7CC8FF" opacity=".18"/>
  <g data-w="mueren"><circle cx="180" cy="160" r="102" fill="none" stroke="#FF4B4B" stroke-width="5" class="onda"/><circle cx="180" cy="160" r="102" fill="none" stroke="#FF4B4B" stroke-width="5" class="onda" style="animation-delay:.8s"/></g>
  ${em(180,228,'🌎',190)}
  <g data-w="cada día"><circle cx="44" cy="36" r="22" fill="#1E2B32" stroke="#FFC800" stroke-width="2"/><g class="gira24" style="transform-origin:44px 36px"><line x1="44" y1="36" x2="44" y2="20" stroke="#FFC800" stroke-width="3" stroke-linecap="round"/></g>${lbl(44,74,'cada día',11,'#C9D4D8')}</g>
  ${cuenta(262,44,3000,'tres mil','+',30,'#FFC800',140)}</svg>
  <div class="cap big" data-w="tres mil">Más de 3.000 personas mueren cada día en el mundo</div>`,
 'c1-jovenes':()=>`<svg viewBox="0 0 360 230">${calleMini('#E7A07A',21)}${['🧑','👩','🧑‍🦱','👱'].map((ic,i)=>em(40+i*36,150,ic,26)).join('')}<g transform="translate(220,222)">${auto('#FF4B4B')}</g>${boom(300,206,'primera',0,30)}
  <g data-w="primera" class="sube">${em(250,90,'🥇',54)}</g></svg>
  <div class="cap big" data-w="primera">1ª causa de muerte en los jóvenes</div><div class="cap" data-w="en el mundo">en el mundo</div>`,
 'c1-oms':()=>`<svg viewBox="0 0 360 230">${L.hospital()}${tag(62,32,100,'🏥 OMS','','#1E2B32')}
  <g data-w="todo el mundo">${em(50,120,'🌎',34)}${em(50,165,'🌍',30)}${em(90,145,'🌏',30)}</g>
  <g data-w="prioritario" class="sello"><rect x="96" y="92" width="232" height="52" rx="8" fill="#16242C" fill-opacity=".9" stroke="#FF4B4B" stroke-width="4" transform="rotate(-7 212 118)"/>${lbl(212,114,'PRIORIDAD DE',16,'#FF4B4B',' transform="rotate(-7 212 118)"')}${lbl(212,134,'SALUD PÚBLICA',16,'#FF4B4B',' transform="rotate(-7 212 118)"')}</g></svg>
  <div class="cap big" data-w="prioritario">Problema prioritario de salud pública</div>`,
 'c1-edad1':()=>`<svg viewBox="0 0 360 240">${calleMini('#9CC9E2',33)}<rect x="210" y="70" width="130" height="76" fill="#E8D7B0"/><rect x="230" y="58" width="90" height="16" rx="4" fill="#FF9600"/>${lbl(275,71,'ESCUELA',11,'#3a2a00')}${[0,1,2,3,4,5].map(i=>`<rect x="${120+i*20}" y="156" width="12" height="70" fill="#F1F7FB" opacity=".85"/>`).join('')}
  <g data-w="niñas">${em(150,196,'🧒',30)}${em(186,206,'👧',30)}</g><g transform="translate(20,230)">${auto('#1CB0F6')}</g>
  ${regla(1)}</svg>
  <div class="cap big" data-w="primera">De 1 a 14 años: 1ª causa de muerte</div>`,
 'c1-edad2':()=>`<svg viewBox="0 0 360 240">${calleMini('#E7A07A',37)}<g transform="translate(60,226)">${auto('#CE82FF')}</g>${em(92,196,'🧑',20)}<g data-w="jóvenes">${em(250,210,'🏍️',34)}${em(250,186,'🧑',20)}</g>
  ${regla(2)}</svg>
  <div class="cap big" data-w="segunda">De 15 a 29 años: 2ª causa de muerte</div><div class="cap" data-w="suicidios">después de los suicidios</div>`,
 'c1-lesionados':()=>`<svg viewBox="0 0 360 230">${L.sala()}<rect x="20" y="22" width="190" height="96" rx="10" fill="#EEF3F5" stroke="#5B6B74" stroke-width="3"/>${lbl(115,42,'Cifras de siniestros',12,'#1A2329')}
  <rect x="34" y="52" width="76" height="56" rx="6" fill="#F7E3E3"/>${lbl(72,68,'Fallecidos',11,'#1A2329')}<rect x="120" y="52" width="76" height="56" rx="6" fill="#E3EEF7" data-w="lesionados" style="--o:1"/><rect x="120" y="52" width="76" height="56" rx="6" fill="none" stroke="#FFC800" stroke-width="4" data-w="lesionados"/>${lbl(158,68,'Lesionados',11,'#1A2329')}${lbl(158,98,'+1',18,'#1CB0F6',wd('lesionados'))}
  ${em(80,212,'🛏️',60)}<g data-w="discapacidad">${em(250,206,'♿',56)}${tag(250,130,100,'de por vida','','#3A2400')}</g>${lbl(300,40,'¿cuántas?',14,'#FF4B4B',wd('saber'))}</svg>
  <div class="cap" data-w="discapacidad">Quien queda con discapacidad de por vida…</div><div class="cap big" data-w="lesionados">…aparece solo como «lesionado»</div>`,
 'c1-iceberg':()=>`<svg viewBox="0 0 360 240">${cieloG('#5E8FB5','#BFDCEB',70)}<rect y="70" width="360" height="170" fill="#164a6e"/><line x1="0" y1="70" x2="360" y2="70" stroke="#7CC8FF" stroke-width="2" opacity=".7"/>${em(60,64,'⛵',26)}
  <path d="M150 70 L170 34 L188 46 L204 70Z" fill="#E8F4FA" data-w="consciencia"/>${lbl(258,44,'lo que se ve',12.5,'#16242C',wd('consciencia'))}
  <path d="M150 70 L204 70 L262 120 L290 190 L210 232 L110 226 L66 170 L98 108Z" fill="#BFE0F2" opacity=".55" data-w="magnitud" style="--o:.55"/>
  <g data-w="magnitud">${lbl(180,128,'+3.000 muertes al día',13.5,'#0E2A3D',' stroke="none"')}${lbl(180,160,'discapacidades de por vida',13,'#0E2A3D',' stroke="none"')}${lbl(180,192,'el dolor de cada familia',13,'#0E2A3D',' stroke="none"')}</g></svg>
  <div class="cap big" data-w="magnitud">No hay consciencia de su magnitud</div>`,
 // ---------- Sesión 3 ----------
 'c1-100':()=>{let o='',k=0;[[12,40],[20,64],[28,88],[40,112]].forEach(([n,r])=>{for(let i=0;i<n;i++,k++){const a=i/n*Math.PI*2+r;o+=em((180+Math.cos(a)*r*1.3).toFixed(0),(178+Math.sin(a)*r*.42).toFixed(0),'🧍',15+((Math.sin(a)+1)*3).toFixed(0)*1,wd('cien',k*18))}});
  return `<svg viewBox="0 0 360 240">${L.plaza(240)}${o}${vela(180,190,34)}</svg>
  <div class="chips"><span data-w="familiares">👨‍👩‍👧 familiares</span><span data-w="amigos">🧑‍🤝‍🧑 amigos</span></div>
  <div class="cap big" data-w="cien">Unas 100 personas cercanas sufren</div><div class="cap" data-w="fallecida">por cada persona fallecida</div>`},
 'c1-pib':()=>`<svg viewBox="0 0 360 230">${L.chile()}<g data-w="producto"><rect x="20" y="26" width="320" height="140" rx="14" fill="#0E171C" fill-opacity=".8"/>${lbl(180,46,'Producto interno bruto de Chile',12,'#C9D4D8')}${grid(100,20,30,62,15.8,20,(x,y)=>`<circle cx="${x.toFixed(1)}" cy="${y}" r="6.2" fill="#FFC800"/>`)}</g>
  <g data-w="dos de cada cien">${[0,1].map(i=>`<circle cx="${(30+i*15.8).toFixed(1)}" cy="62" r="8.5" fill="#FF4B4B" class="late"/>`).join('')}<path d="M40 74 Q50 150 96 196" stroke="#FF4B4B" stroke-width="3" fill="none" stroke-dasharray="6 6"/>${em(118,214,'💥🚗',24)}</g></svg>
  <div class="cap big" data-w="dos por ciento">2% del PIB</div><div class="cap" data-w="dos de cada cien">2 de cada 100 pesos</div>`,
 'c1-6millones':()=>`<svg viewBox="0 0 360 230">${calleMini('#9CC9E2',41)}<g data-w="cada persona">${em(60,150,'🧍',56)}${em(84,132,'👛',20)}</g><g transform="translate(250,222)">${auto('#FF4B4B')}</g>${em(250,190,'💥',26)}
  ${grid(6,6,100,110,24,0,(x,y,i)=>`<g data-w="seis millones" style="transition-delay:${i*200}ms"><g class="go vuela" style="animation-delay:${i*200}ms">${em(x,y,'💵',24)}</g></g>`)}${cuenta(180,46,6,'seis millones','+',34)}${lbl(180,74,'millones de pesos al año',12,'#F1F7FB',wd('al año'))}</svg>
  <div class="cap big" data-w="seis millones">Poco más de 6 millones al año, cada persona</div><div class="cap" data-w="valorizar">solo contando los costos que se pueden valorizar</div>`,
 'c1-costos':()=>{const box=(x,y,ic,t,s,w)=>`<g data-w="${w}"><rect x="${x-80}" y="${y-30}" width="160" height="62" rx="12" fill="#1E2B32" fill-opacity=".95" stroke="#FFC800" stroke-width="1.5"/>${em(x-58,y+8,ic,24)}${lbl(x+14,y-6,t,13.5,'#FFC800')}${lbl(x+14,y+12,s,10.5,'#C9D4D8')}</g>`;
  return `<svg viewBox="0 0 360 250">${calleMini('#9CC9E2',45)}<rect y="230" width="360" height="20" fill="#33414A"/><g transform="translate(104,214)">${auto('#FF4B4B')}</g><g transform="translate(256,214) scale(-1,1)">${auto('#1CB0F6')}</g>${em(180,196,'💥',30)}
  ${box(88,40,'🚗','Materiales','vehículos, propiedad','materiales')}${box(272,40,'🚑','De salud','ambulancia, tratamiento','salud')}${box(88,118,'👮','Administrativos','policía, seguros, jueces','administrativos')}${box(272,118,'💔','Humanos','sufrimiento, productividad','humanos')}</svg>
  <div class="cap big" data-w="cuatro">4 tipos de costos</div>`},
 'c1-admin':()=>`<svg viewBox="0 0 360 230">${calleMini('#9CC9E2',47)}<g transform="translate(150,222)">${auto('#9AB0BC')}</g>${em(190,196,'💥',22)}
  <g data-w="policía"><g class="go llega">${em(60,214,'🚓',40)}</g></g><g data-w="bomberos"><g class="go llega2">${em(300,214,'🚒',40)}</g></g>
  <g data-w="seguros">${tag(90,40,130,'📄 Gestión de seguros')}</g><g data-w="jueces">${tag(260,40,150,'⚖️ Jueces y abogados')}</g></svg>
  <div class="cap big" data-w="administrativos">Costos administrativos</div>`,
 'c1-humanos':()=>`<svg viewBox="0 0 360 230">${cieloG('#9CC9E2','#DCEBF2')}<rect y="170" width="360" height="60" fill="#8FA3AE"/>
  <g data-w="productividad"><rect x="20" y="70" width="140" height="100" fill="#B7A68F"/><rect x="120" y="40" width="18" height="40" fill="#8C7B66"/><rect x="36" y="96" width="40" height="30" fill="#9FC7D6"/><rect x="96" y="96" width="40" height="30" fill="#9FC7D6"/>${em(56,150,'🪑',26)}${lbl(90,196,'Productividad perdida',12)}</g>
  <g data-w="sufrimiento"><path d="M200 110 L270 60 L340 110 V170 H200Z" fill="#E8D7B0"/><rect x="250" y="130" width="30" height="40" fill="#8C6A4E"/>${em(232,152,'😢',22)}${em(310,152,'😢',22)}${em(270,104,'💔',28)}${lbl(270,196,'Sufrimiento físico y psicológico',11)}</g></svg>
  <div class="cap big" data-w="humanos">Costos humanos</div>`,
 'c1-sinprecio':()=>{const t=(x,ic,p,w,x2)=>`<g data-w="${w}">${em(x,190,ic,40)}<g transform="rotate(-10 ${x+34} 130)"><rect x="${x+6}" y="116" width="58" height="28" rx="6" fill="#F1F7FB"/>${lbl(x+35,136,p,16,'#1A2329',' stroke="none"')}</g>${x2||''}</g>`;
  return `<svg viewBox="0 0 360 230">${calleMini('#9CC9E2',49)}${t(40,'🚗','$$$','costos')}${t(150,'🚑','$$','costos')}${t(258,'😢','¿$?','sufrimiento',`<line x1="262" y1="112" x2="330" y2="148" stroke="#FF4B4B" stroke-width="5" stroke-linecap="round"/>`)}${lbl(292,226,'no tiene precio',12.5,'#FF4B4B',wd('sufrimiento'))}</svg>
  <div class="cap big" data-w="dinero">No todo se puede medir en dinero</div>`},
 // ---------- Sesión 4 ----------
 'c1-cinco':()=>`<svg viewBox="0 0 360 230">${L.chile()}${lbl(180,30,'🇨🇱 Siniestros en Chile',18,'#FFFFFF')}${[2018,2019,2020,2021,2022].map((y,i)=>`<g data-w="cinco" style="transition-delay:${i*200}ms"><rect x="${22+i*66}" y="52" width="54" height="58" rx="8" fill="#1E2B32" stroke="${y==2022?'#FFC800':'#37464F'}" stroke-width="2"/>${em(49+i*66,80,'📅',20)}${lbl(49+i*66,102,y,13,y==2022?'#FFC800':'#F1F7FB')}</g>`).join('')}
  <path d="M22 122 V132 H340 V122" stroke="#FFC800" stroke-width="3" fill="none" data-w="promedio"/>${tag(180,152,110,'promedio','',"#3A3000")}</svg>`.replace("tag(180,152","tag(180,152"),
 'c1-82mil':()=>{const r=rnd(82);let b='';for(let i=0;i<36;i++){const y=14+r()*232,x=165+r()*20+Math.sin(y/30)*6;b+=`<text x="${x.toFixed(0)}" y="${y.toFixed(0)}" font-size="11" text-anchor="middle" class="boom" data-w="registran" style="transition-delay:${(i*55)}ms;animation-delay:${i*55}ms">💥</text>`}
  return `<svg viewBox="0 0 360 260">${mapaChile}${b}${cuenta(80,150,82000,'ochenta','+',26,'#FFC800',140)}${lbl(80,176,'siniestros al año',12)}</svg>
  <div class="cap big" data-w="ochenta">Más de 82.000 siniestros al año</div>`},
 'c1-1600':()=>{const r=rnd(16);let v='';for(let i=0;i<16;i++){const y=20+i*14,x=170+Math.sin(y/30)*6;v+=vela(x.toFixed(0),y,14,wd('fallecen',i*110))}
  return `<svg viewBox="0 0 360 260">${mapaChile}${v}${cuenta(80,150,1600,'mil seiscientas','≈',26,'#FFC800',140)}${lbl(80,176,'personas fallecidas',11.5)}${lbl(80,192,'al año',11.5)}</svg>
  <div class="cap big" data-w="mil seiscientas">Unas 1.600 personas fallecidas al año</div>`},
 'c1-dia':()=>`<svg viewBox="0 0 360 230">${calleMini('#1A2850',51)}<rect width="360" height="152" fill="#0B1430" opacity=".6"/><g data-w="cada día"><rect x="120" y="14" width="120" height="38" rx="8" fill="#FF4B4B"/>${lbl(180,40,'1 DÍA',18)}<rect x="120" y="48" width="120" height="120" rx="8" fill="#F1F7FB"/></g>
  ${[0,1,2,3,4].map(i=>vela(140+(i%3)*40,i<3?96:146,28,wd('cuatro y cinco',i*200)+(i==4?' opacity=".35"':''))).join('')}</svg>
  <div class="cap big" data-w="cuatro y cinco">Entre 4 y 5 personas mueren cada día</div>`,
 'c1-atropellos':()=>`<svg viewBox="0 0 360 230">${calleMini('#9CC9E2',53)}${[0,1,2,3,4,5].map(i=>`<rect x="${130+i*20}" y="156" width="12" height="74" fill="#F1F7FB" opacity=".85"/>`).join('')}${em(178,200,'🚶',34)}<g transform="translate(40,226)">${auto('#FF4B4B')}</g>
  ${cuenta(180,58,450,'cuatrocientas','',40)}${lbl(180,92,'personas atropelladas al año',12,'#F1F7FB',wd('atropelladas'))}</svg>
  <div class="cap big" data-w="atropelladas">Unas 450 de ellas, atropelladas</div><div class="cap">de las aproximadamente 1.600 personas fallecidas al año</div>`,
 'c1-graves':()=>`<svg viewBox="0 0 360 230">${L.hospital()}<g data-w="siete mil"><g transform="translate(0,222)"><g class="car" style="animation-duration:4s">${ambul()}</g></g><g transform="translate(0,198)"><g class="car izq" style="animation-duration:5s;animation-delay:-2s"><g transform="translate(90,0) scale(-1,1)">${ambul()}</g></g></g></g>${cuenta(70,58,7700,'siete mil','≈',30)}${lbl(70,84,'lesionados graves al año',11)}</svg>
  <div class="cap big" data-w="siete mil">Unas 7.700 personas con lesiones graves al año</div>`,
 'c1-urbano':()=>`<svg viewBox="0 0 360 220">${ciudadCruce()}${campo(.35)}
  ${[[108,104],[128,124],[100,132],[136,98],[118,114],[60,118],[190,124],[116,40]].map(([x,y],i)=>boom(x,y,'ochenta',i*180,22)).join('')}
  <circle cx="118" cy="115" r="40" fill="none" stroke="#FFC800" stroke-width="3" stroke-dasharray="6 5" data-w="cruces"/></svg>
  <div class="chips"><span data-w="ochenta">🏙️ 8 de cada 10 siniestros: en la ciudad</span></div><div class="cap" data-w="cruces">La mayoría, en cruces o intersecciones</div>`,
 'c1-rural':()=>`<svg viewBox="0 0 360 220">${ciudadCruce(.45)}${campo(1)}
  ${[[108,104],[128,124],[100,132],[136,98],[118,114],[60,118],[190,124],[116,40]].map(([x,y])=>em(x,y,'💥',22,' opacity=".4"')).join('')}
  ${boom(292,150,'veinte',0,24)}${boom(318,96,'veinte',400,24)}</svg>
  <div class="chips"><span data-w="veinte">🌾 2 de cada 10: zona rural</span></div>`,
 'c1-fallecidos-ruta':()=>`<svg viewBox="0 0 360 220">${ciudadCruce(.6)}${campo(1)}
  ${[0,1,2,3].map(i=>vela(70+i*34,190,22,wd('ciudad',i*120))).join('')}${[0,1,2,3,4,5].map(i=>vela(268+(i%3)*30,i<3?120:160,22,wd('fuera de la ciudad',i*150))).join('')}</svg>
  <div class="cap" data-w="fallecidas">Fuera de la ciudad hay menos siniestros…</div><div class="cap big" data-w="fuera de la ciudad">…pero más personas fallecidas</div>`,
 'c1-lesionados-urb':()=>`<svg viewBox="0 0 360 220">${ciudadCruce()}${campo(1)}
  ${grid(10,5,62,170,34,26,(x,y,i)=>em(x,y,'🩹',18,wd('lesionados',i*90)))}${[0,1].map(i=>em(288+i*34,170,'🚑',22,wd('menos graves',i*200))).join('')}${lbl(304,146,'más graves',11,'#FF4B4B',wd('menos graves'))}${lbl(118,212,'menos graves',11,'#C9D4D8',wd('menos graves'))}</svg>
  <div class="cap big" data-w="treinta y cinco">En la ciudad, más de 35.000 lesionados al año</div><div class="cap" data-w="menos graves">en su mayoría, con lesiones menos graves que en carretera</div>`,
 // ---------- Sesión 5 ----------
 'c1-v30':()=>`<svg viewBox="0 0 360 280">${parabrisas(30)}</svg>${fila10(9,'🧍','🧍','noventa')}<div class="cap big" data-w="noventa">9 de cada 10 peatones sobreviven</div>`,
 'c1-v45':()=>`<svg viewBox="0 0 360 280">${parabrisas(45)}</svg><div class="chips"><span data-w="menos del cincuenta">🧍 sobreviven menos de 5 de cada 10</span></div><div class="cap big" data-w="menos del cincuenta">Menos de la mitad sobrevive</div>`,
 'c1-v65':()=>`<svg viewBox="0 0 360 280">${parabrisas(65)}<g data-w="lo más probable">${em(222,128,'⚠️',30)}</g></svg><div class="cap big" data-w="lo más probable">Lo más probable es que el peatón muera</div>`,
 'c1-x8':()=>`<svg viewBox="0 0 360 230">${calleMini('#9CC9E2',55)}<g transform="translate(40,184)">${auto('#58CC02')}</g>${tag(160,172,90,'30 km/h','','#203A12')}<g transform="translate(40,224)">${auto('#FF4B4B')}<g fill="#fff" opacity=".6"><rect x="-34" y="-28" width="26" height="3"/><rect x="-40" y="-18" width="30" height="3"/></g></g>${tag(160,212,90,'50 km/h','','#3D1A1C')}
  <rect x="140" y="20" width="210" height="100" rx="12" fill="#0E171C" fill-opacity=".85"/>${lbl(245,40,'Probabilidad de que el peatón muera',10.5,'#C9D4D8')}${lbl(166,68,'30',12,'#58CC02')}<circle cx="196" cy="64" r="9" fill="#FF4B4B" data-w="treinta"/>${lbl(166,102,'50',12,'#FF4B4B')}${grid(8,8,196,98,20,0,(x,y,i)=>`<circle cx="${x}" cy="${y}" r="9" fill="#FF4B4B" data-w="ocho" style="transition-delay:${i*150}ms"/>`)}</svg>
  <div class="cap big" data-w="ocho">De 30 a 50 km/h: ×8</div>`,
 // ---------- Sesión 6 ----------
 'c1-cuando':()=>`<svg viewBox="0 0 360 250">${cieloG('#1B2C35','#14222A',250)}
  <g data-w="fines de semana">${'LMMJVSD'.split('').map((d,i)=>`<rect x="${20+i*47}" y="14" width="40" height="44" rx="8" fill="${i>=5?'#FFC800':'#1E2B32'}" stroke="#37464F" stroke-width="1.5"/>${lbl(40+i*47,42,d,16,i>=5?'#3a2a00':'#9AB0BC',' stroke="none"')}`).join('')}</g>
  <g data-w="largos">${[4,0].map(i=>`<rect x="${20+i*47}" y="14" width="40" height="44" rx="8" fill="none" stroke="#FFC800" stroke-width="2.5" stroke-dasharray="5 4"/>`).join('')}${lbl(180,76,'y fines de semana largos',11.5,'#FFC800')}</g>
  <g data-w="noche"><rect x="20" y="92" width="320" height="64" rx="12" fill="#0B1430"/>${estrellas(31,10,60).replace(/cy="/g,'cy="9')}<circle cx="300" cy="124" r="14" fill="#F4F1DE"/>${lbl(130,130,'🌙 Noche y madrugada',15)}</g>
  <g data-w="escaso flujo"><rect x="20" y="172" width="320" height="64" rx="12" fill="#33414A"/><line x1="30" y1="214" x2="330" y2="214" stroke="#D9D9D9" stroke-width="2.5" stroke-dasharray="16 12"/><g transform="translate(0,232)"><g class="car" style="animation-duration:5s">${auto('#FFC800',1)}</g></g>${lbl(110,192,'Escaso flujo de vehículos',12)}</g></svg>
  <div class="cap big" data-w="siniestralidad">Cuándo hay más siniestros</div>`,
 'c1-falla':()=>`<svg viewBox="0 0 360 230">${L.carretera()}${grid(10,5,60,120,60,60,(x,y,i)=>`${em(x,y,'💥',28)}<g data-w="falla humana" style="transition-delay:${i*150}ms"${i==9?' opacity=".45"':''}>${em(x+16,y+14,'🧍',16)}</g>`)}</svg>
  <div class="cap big" data-w="noventa">Falla humana: en más de 9 de cada 10 siniestros</div>`,
 'c1-jovenes18':()=>`<svg viewBox="0 0 360 230">${calleMini('#E7A07A',57)}${lbl(180,30,'Personas conductoras fallecidas',12.5)}${grid(10,5,36,186,72,40,(x,y,i)=>`<g transform="translate(${x-36},${y})">${auto(i<3?'#FFC800':'#5B6B74')}</g>${i<3?em(x+4,y-14,'🧑',16,wd('veintinueve por ciento',i*200)):''}`)}</svg>
  <div class="cap big" data-w="veintinueve por ciento">Jóvenes de 18 a 29 años: cerca de 3 de cada 10</div>`,
 'c1-hombres':()=>`<svg viewBox="0 0 360 230">${calleMini('#9CC9E2',59)}${lbl(180,30,'Personas conductoras fallecidas',12.5,'#1A2329',' stroke="none"')}${grid(10,5,36,186,72,40,(x,y,i)=>`<g transform="translate(${x-36},${y})">${auto(i<8?'#1CB0F6':'#5B6B74')}</g>${i<8?em(x+4,y-14,'👨',16,wd('setenta',i*120)):''}`)}</svg>
  <div class="cap big" data-w="setenta">Hombres: cerca de 8 de cada 10</div>`,
 'c1-factores':()=>{const fila=(y,w,inner,t)=>`<g data-w="${w}"><g transform="translate(0,${y})"><rect x="10" width="340" height="66" rx="12" fill="#33414A"/><line x1="20" y1="40" x2="340" y2="40" stroke="#D9D9D9" stroke-width="2" stroke-dasharray="14 10"/>${inner}${tag(80,20,140,t)}</g></g>`;
  return `<svg viewBox="0 0 360 236">${cieloG('#1B2C35','#14222A',236)}
  ${fila(6,'imprudencia',`<g transform="translate(0,58)"><g class="car" style="animation-duration:2.4s">${auto('#FF9600')}<g fill="#fff" opacity=".6"><rect x="-34" y="-30" width="26" height="3"/><rect x="-40" y="-18" width="30" height="3"/></g></g></g>`,'😤 Imprudencia')}
  ${fila(84,'alcohol',`<g transform="translate(180,58)"><g class="zig">${auto('#FF4B4B')}${em(36,-42,'🍺',20)}</g></g>`,'🍺 Alcohol')}
  ${fila(162,'señales',`<rect x="250" y="-26" width="14" height="40" rx="4" fill="#1A2329"/><circle cx="257" cy="-18" r="5" fill="#FF4B4B"/><circle cx="257" cy="-6" r="5" fill="#3A3A3A"/><circle cx="257" cy="6" r="5" fill="#3A3A3A"/><g transform="translate(0,58)"><g class="car" style="animation-duration:3s">${auto('#1CB0F6')}</g></g>`,'🚦 Desobedecer señales')}</svg>`},
 'c1-48h':()=>`<svg viewBox="0 0 360 230">${L.hospital()}<rect x="16" y="96" width="328" height="110" rx="14" fill="#0E171C" fill-opacity=".85"/><rect x="30" y="140" width="150" height="16" rx="8" fill="#58CC02" data-w="cuarenta y ocho"/><rect x="180" y="140" width="150" height="16" rx="8" fill="#5B6B74" data-w="días después"/>
  ${lbl(40,176,'siniestro',11,'#9AB0BC')}${lbl(180,176,'48 horas',12.5,'#FFC800')}<line x1="180" y1="130" x2="180" y2="166" stroke="#FFC800" stroke-width="3"/>
  <g data-w="cuarenta y ocho">${em(110,128,'🕯️',24)}${lbl(110,198,'✔ se cuenta',12.5,'#58CC02')}</g><g data-w="días después">${em(270,128,'🕯️',24,' opacity=".5"')}${lbl(270,198,'✖ no aparece',12.5,'#FF4B4B')}</g></svg>
  <div class="cap big" data-w="cuarenta y ocho">Carabineros: solo dentro de 48 horas</div>`,
 // ---------- Sesión 7 ----------
 'c1-t1993':()=>`<svg viewBox="0 0 360 230">${calleMini('#C9B48A',61)}${banda([[60,'1993','📜','mil novecientos']],`<path d="M90 50 H300" stroke="#FFC800" stroke-width="4" stroke-dasharray="8 6" class="go avanza" data-w="desde entonces"/>`)}</svg><div class="cap big" data-w="mil novecientos">1993: primera Política Nacional</div><div class="cap" data-w="desde entonces">desde entonces, trabajo para disminuir los siniestros</div>`,
 'c1-desafios':()=>`<svg viewBox="0 0 360 230">${calleMini('#9CC9E2',63)}${grid(4,4,40,186,90,0,(x,y,i)=>em(x,y,'🚲',26,wd('ciclistas',i*150)))}${grid(4,4,70,226,90,0,(x,y,i)=>em(x,y,'🚗',28,wd('vehículos',i*150)))}${grid(3,3,110,208,100,0,(x,y,i)=>em(x,y,'🏍️',24,wd('motocicletas',i*150)))}</svg>
  <div class="chips"><span data-w="ciclistas">🚲 más ciclistas</span><span data-w="vehículos">🚗 más vehículos</span><span data-w="motocicletas">🏍️ más motos</span></div><div class="cap big" data-w="nuevos enfoques">Nuevos desafíos, nuevos enfoques</div>`,
 'c1-t2017':()=>`<svg viewBox="0 0 360 230">${calleMini('#9CC9E2',65)}${banda([[60,'1993','📜',''],[290,'2017','🛡️','dos mil diecisiete']],`<path d="M90 50 H262" stroke="#FFC800" stroke-width="4" stroke-dasharray="8 6"/>`)}</svg><div class="cap big" data-w="sistema seguro">2017: enfoque Sistema Seguro</div>`,
 'c1-inaceptable':()=>`<svg viewBox="0 0 360 230">${L.carretera()}${[[40,150],[90,190],[300,150],[330,196]].map(([x,y])=>`${em(x,y,'✝️',22)}${vela(x+14,y+6,14)}`).join('')}
  <g data-w="inaceptables" class="sello"><rect x="50" y="62" width="260" height="46" rx="8" fill="#16242C" fill-opacity=".92" stroke="#FF4B4B" stroke-width="4" transform="rotate(-6 180 85)"/>${lbl(180,94,'INACEPTABLE',24,'#FF4B4B',' transform="rotate(-6 180 85)"')}</g>
  <g data-w="nadie"><rect x="60" y="128" width="240" height="46" rx="10" fill="#0E171C" fill-opacity=".85"/>${lbl(180,148,'Meta: que nadie muera',14,'#58CC02')}${lbl(180,166,'ni resulte gravemente herido',12,'#58CC02')}</g></svg>
  <div class="cap" data-w="principio ético">Principio ético: muertes y lesiones graves</div>`,
 'c1-vision0':()=>`<svg viewBox="0 0 360 230">${L.carretera()}<rect x="230" y="40" width="10" height="70" fill="#5B6B74"/><g data-w="visión"><rect x="170" y="10" width="130" height="64" rx="8" fill="#1E2B32" stroke="#FFC800" stroke-width="3"/>${em(208,52,'👁️',30)}${lbl(262,58,'0',40,'#FFC800')}</g></svg>
  <div class="cap big" data-w="visión">Visión Cero</div>`,
 'c1-error':()=>`<svg viewBox="0 0 360 220">${cruceSimple()}<g transform="translate(0,170)"><g class="go errar">${auto('#1CB0F6')}</g></g>${em(212,128,'🚲',30)}
  <g data-w="errores"><rect x="20" y="22" width="132" height="44" rx="14" fill="#F1F7FB"/><path d="M60 66 L52 82 L76 66Z" fill="#F1F7FB"/>${lbl(86,50,'¡No lo vi!',16,'#1A2329',' stroke="none"')}</g>${boom(206,150,'equivocación',0,36)}</svg>
  <div class="cap big" data-w="errores">Errar es humano</div><div class="cap" data-w="equivocación">La mayoría de los siniestros: una equivocación</div>`,
 'c1-riesgo':()=>`<svg viewBox="0 0 360 220">${cruceSimple()}
  <g data-w="riesgo"><rect x="160" y="150" width="104" height="10" fill="#58CC02" opacity=".85"/><rect x="236" y="96" width="10" height="44" fill="#F1F7FB"/>${em(280,92,'⚠️',22)}<rect x="300" y="70" width="34" height="34" rx="17" fill="#F1F7FB" stroke="#FF4B4B" stroke-width="5"/>${lbl(317,92,'30',14,'#1A2329',' stroke="none"')}</g>
  <g transform="translate(0,170)"><g class="go frena2" data-w="riesgo">${auto('#1CB0F6')}</g></g>${em(212,128,'🚲',30)}${em(150,128,'✅',26,wd('guíe'))}
  <g data-w="en vez de corregir">${tag(86,30,150,'🙅 solo corregir errores','','#3D1A1C')}</g></svg>
  <div class="cap big" data-w="riesgo">Abordar el riesgo de circular</div><div class="cap" data-w="apoye y guíe">Un sistema que apoye y guíe a las personas</div>`,
 'c1-limite':()=>`<svg viewBox="0 0 360 230"><rect width="360" height="230" fill="#C9D8DE"/><rect y="170" width="360" height="60" fill="#8FA3AE"/>${grid(8,8,10,40,46,0,(x)=>`<rect x="${x}" y="30" width="30" height="20" fill="#EEF3F5"/>`)}<rect x="300" y="110" width="40" height="62" fill="#FF9600"/>${grid(4,1,300,116,0,14,(x,y)=>`<rect x="300" y="${y}" width="40" height="6" fill="#1A2329"/>`)}<g transform="translate(150,172)"><g class="go choca">${auto('#1CB0F6')}</g></g>
  <rect x="20" y="60" width="150" height="104" rx="12" fill="#0E171C" fill-opacity=".85"/><line x1="30" y1="96" x2="160" y2="96" stroke="#FF4B4B" stroke-width="3" stroke-dasharray="6 5"/>${lbl(95,86,'límite del cuerpo',11,'#FF4B4B')}
  <rect x="60" y="74" width="40" height="84" rx="6" fill="#FF4B4B" data-w="fuerzas" data-h="no superen"/><rect x="60" y="112" width="40" height="46" rx="6" fill="#58CC02" data-w="no superen"/>${em(132,150,'🧍',34,wd('cuerpo'))}</svg>
  <div class="cap big" data-w="no superen">El impacto no debe superar lo que el cuerpo resiste</div>`,
 'c1-p1':()=>escudo(1),'c1-p2':()=>escudo(2),'c1-p3':()=>escudo(3),'c1-p4':()=>escudo(4),
});
// ---- piezas compartidas ----
function ambul(){return `<rect x="0" y="-30" width="76" height="28" rx="5" fill="#F4F6F7"/><rect x="0" y="-18" width="76" height="5" fill="#FF4B4B"/><path d="M56 -30 H74 L82 -14 V-2 H56Z" fill="#E1E7EA"/><rect x="60" y="-26" width="12" height="10" fill="#9FD3F0"/><rect x="24" y="-38" width="14" height="8" rx="3" fill="#1CB0F6" class="blink"/><circle cx="16" cy="-2" r="7" fill="#111"/><circle cx="64" cy="-2" r="7" fill="#111"/>`}
function regla(n){const a=n==2;return `<rect x="16" y="14" width="328" height="76" rx="12" fill="#0E171C" fill-opacity=".86"/>${lbl(180,34,'🇨🇱 Chile · edad',12,'#C9D4D8')}<rect x="30" y="48" width="300" height="12" rx="6" fill="#37464F"/>${[1,14,15,29].map(k=>`<line x1="${30+k*10}" y1="42" x2="${30+k*10}" y2="66" stroke="#9AB0BC" stroke-width="2"/>${lbl(30+k*10+(k==14?-6:k==15?6:0),82,k,11,'#9AB0BC')}`).join('')}
 <rect x="40" y="48" width="130" height="12" rx="6" fill="#FFC800"${a?' opacity=".45"':' data-w="uno y catorce"'}/>${a?`<rect x="180" y="48" width="140" height="12" rx="6" fill="#FF9600" data-w="quince"/>`:''}
 <g data-w="${a?'segunda':'primera'}">${a?tag(250,116,150,'🥈 2ª causa de muerte','','#3A2400'):tag(105,116,150,'🥇 1ª causa de muerte','','#3A3000')}</g>`}
function banda(hitos,extra=''){return `<rect x="10" y="10" width="340" height="94" rx="12" fill="#0E171C" fill-opacity=".86"/><line x1="24" y1="50" x2="336" y2="50" stroke="#37464F" stroke-width="6" stroke-linecap="round"/>${extra}${hitos.map(([x,y,ic,w])=>`<g${w?` data-w="${w}"`:''}><circle cx="${x}" cy="50" r="12" fill="#FFC800"/>${em(x-28,40,ic,24)}${lbl(x,88,y,16,'#FFC800')}</g>`).join('')}`}
function ciudadCruce(op=1){return `<g opacity="${op}"><rect width="240" height="220" fill="#2A3A46"/>${[[10,10],[150,10],[10,150],[150,150]].map(([x,y])=>`<rect x="${x}" y="${y}" width="80" height="60" rx="6" fill="#5E7390"/>`).join('')}<rect x="0" y="90" width="240" height="50" fill="#3A4852"/><rect x="100" y="0" width="40" height="220" fill="#3A4852"/>${[0,1,2,3,4].map(i=>`<rect x="${102+i*8}" y="80" width="5" height="10" fill="#F1F7FB" opacity=".8"/>`).join('')}${lbl(120,212,'Ciudad',13,'#F1F7FB')}</g>`}
function campo(op=1){return `<g opacity="${op}"><rect x="244" width="116" height="220" fill="#2F5D50"/><path d="M300 0 C280 60 330 110 300 160 S290 210 300 220" stroke="#39454C" stroke-width="22" fill="none"/>${em(262,40,'🌲',18)}${em(342,180,'🌲',18)}${em(340,60,'🌲',16)}${lbl(302,212,'Rural',13,'#F1F7FB')}</g>`}
function cruceSimple(){return `${cieloG('#9CC9E2','#DCEBF2',220)}${ciudadBaja(77,140,'#7D93AE')}<rect y="140" width="360" height="40" fill="#3A4852"/><rect y="180" width="360" height="40" fill="#8C9AA3"/><rect x="190" y="140" width="44" height="80" fill="#3A4852"/>${[0,1,2,3,4].map(i=>`<rect x="${192+i*8}" y="128" width="5" height="10" fill="#F1F7FB" opacity=".8"/>`).join('')}`}
function escudo(n){
 const fondo=`<g opacity=".55">${L.carretera(n==3?285:240)}</g>`;
 if(n==4)return `<svg viewBox="0 0 360 240">${fondo}<g transform="translate(180,112)">${[78,62,46].map(r=>`<circle r="${r}" fill="none" stroke="#58CC02" stroke-width="7" opacity=".9"/>`).join('')}<circle r="78" fill="none" stroke="#FF4B4B" stroke-width="8" stroke-dasharray="22 14" data-w="si uno falla"/><g transform="translate(-36,16)">${auto('#1CB0F6')}</g></g><rect x="20" y="206" width="320" height="28" rx="10" fill="#0E171C" fill-opacity=".85"/>${lbl(180,225,'una capa falla… las demás siguen protegiendo',12.5,'#58CC02',' data-w="protegiendo"')}</svg>
 <div class="cap big">4º Todos los componentes fortalecidos</div>`;
 const P=[['🤷','Errar es humano','primero'],['🫀','El cuerpo tiene límites','segundo'],['🤝','Responsabilidad compartida','tercero']],pos=[[95,70],[265,70],[180,170]];
 const roles=n==3?`<rect x="6" y="226" width="348" height="56" rx="10" fill="#0E171C" fill-opacity=".85"/>${[['📐','diseñan'],['🏗️','construyen'],['🏛️','administran'],['🚗','usan'],['🚑','atienden']].map(([ic,w],i)=>`<g data-w="${w}">${em(40+i*70,252,ic,22)}${lbl(40+i*70,274,w,11,'#C9D4D8')}</g>`).join('')}`:'';
 return `<svg viewBox="0 0 360 ${n==3?285:240}">${fondo}${P.map(([ic,t,w],i)=>{const [x,y]=pos[i],act=i==n-1;return i<n?`<g${act?` data-w="${w}"`:''}><rect x="${x-82}" y="${y-38}" width="164" height="76" rx="14" fill="${act?'#3A3000':'#1E2B32'}" fill-opacity=".95" stroke="${act?'#FFC800':'#37464F'}" stroke-width="2"/>${em(x,y,ic,act?30:24)}${lbl(x,y+26,t,t.length>20?11:(act?12.5:11),act?'#FFC800':'#C9D4D8')}</g>`:`<rect x="${x-82}" y="${y-38}" width="164" height="76" rx="14" fill="#0E171C" fill-opacity=".6" stroke="#5B6B74" stroke-width="2" stroke-dasharray="6 6"/>${lbl(x,y+6,(i+1)+'º',20,'#9AB0BC')}`}).join('')}${roles}</svg>
 <div class="cap big">${['','1º Errar es humano','2º El cuerpo tiene límites','3º Responsabilidad compartida'][n]}</div>`}
