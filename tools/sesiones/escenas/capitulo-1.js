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
  return `<svg viewBox="0 0 360 230"><rect width="360" height="90" fill="#E39A6E"/><path d="M0 90 Q90 70 180 82 T360 80 V230 H0Z" fill="#2F5D50"/><path d="M168 86 L192 86 L330 230 L30 230Z" fill="#39454C"/><line x1="180" y1="86" x2="180" y2="240" stroke="#F2D04A" stroke-width="4" stroke-dasharray="18 18" class="dashv"/>
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
const em=(x,y,ic,s=22,a='')=>`<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle"${a}>${ic}</text>`;
const wd=(w,d=0)=>` data-w="${w}" style="transition-delay:${d}ms;animation-delay:${d}ms"`;
const lbl=(x,y,t,s=13,c='#F1F7FB',a='')=>`<text x="${x}" y="${y}" font-size="${s}" font-weight="900" fill="${c}" text-anchor="middle"${a}>${t}</text>`;
const tag=(x,y,w,t,a='',c='#1E2B32')=>`<g${a}><rect x="${x-w/2}" y="${y-16}" width="${w}" height="26" rx="9" fill="${c}" stroke="#37464F" stroke-width="1.5"/>${lbl(x,y+2,t,12.5)}</g>`;
const grid=(n,cols,x0,y0,dx,dy,f)=>Array.from({length:n},(_,i)=>f(x0+(i%cols)*dx,y0+Math.floor(i/cols)*dy,i)).join('');
const caja=(h=230)=>`<rect width="360" height="${h}" rx="0" fill="#16242C"/>`;
// velocímetro 0–80 km/h con aguja animada
const velo=(v,cx=180,cy=118,r=78)=>{const pt=(k,rr=r)=>{const t=Math.PI-k/80*Math.PI;return[(cx+rr*Math.cos(t)).toFixed(1),(cy-rr*Math.sin(t)).toFixed(1)]};
 const arco=(a,b,c)=>{const[p,q]=pt(a),[s,u]=pt(b);return `<path d="M${p} ${q} A${r} ${r} 0 0 1 ${s} ${u}" stroke="${c}" stroke-width="15" fill="none"/>`};
 return `${arco(0,30,'#58CC02')}${arco(30,45,'#FFC800')}${arco(45,65,'#FF9600')}${arco(65,80,'#FF4B4B')}
 ${[0,30,45,65,80].map(k=>{const[x,y]=pt(k,r-24);return lbl(x,(+y+4).toFixed(0),k,11,'#9AB0BC')}).join('')}
 <g class="aguja" style="--a:${(v/80*180).toFixed(1)}deg;transform-origin:${cx}px ${cy}px"><line x1="${cx}" y1="${cy}" x2="${cx-r+10}" y2="${cy}" stroke="#F1F7FB" stroke-width="5" stroke-linecap="round"/></g><circle cx="${cx}" cy="${cy}" r="9" fill="#F1F7FB"/>
 ${lbl(cx,cy+34,v+' km/h',22,'#FFC800')}`};
const chile=`<path d="M176 6 C186 40 170 70 182 100 S170 160 180 190 S174 232 180 254 L166 254 C160 232 170 200 162 170 S172 110 160 80 S172 30 164 6Z" fill="#3E6B55" stroke="#58CC02" stroke-width="1.5" opacity=".9"/>`;
const vela=(x,y,s=22,a='')=>em(x,y,'🕯️',s,a);
Object.assign(ESCENAS,{
 // ---------- Sesión 2 ----------
 'c1-3000':()=>`<svg viewBox="0 0 360 230">${caja()}
  <g data-w="cada día"><circle cx="40" cy="40" r="24" fill="#1E2B32" stroke="#FFC800" stroke-width="2"/><g class="gira24" style="transform-origin:40px 40px"><line x1="40" y1="40" x2="40" y2="22" stroke="#FFC800" stroke-width="3" stroke-linecap="round"/></g>${lbl(40,80,'cada día',11,'#9AB0BC')}</g>
  ${grid(30,6,110,40,40,40,(x,y,i)=>em(x,y,'🧍',24,wd('mueren',i*60)))}</svg>
  <div class="chips"><span data-w="mueren">🧍 = 100 personas</span></div>
  <div class="cap big" data-w="tres mil">Más de 3.000 personas, cada día</div>`,
 'c1-jovenes':()=>`<svg viewBox="0 0 360 220">${caja(220)}
  ${lbl(180,26,'Causas de muerte en los jóvenes · mundo',13,'#9AB0BC')}
  <rect x="135" y="110" width="90" height="100" fill="#FFC800"/><rect x="45" y="140" width="90" height="70" fill="#5B6B74"/><rect x="225" y="160" width="90" height="50" fill="#5B6B74"/>
  ${lbl(180,160,'1',38,'#3a2a00')}${lbl(90,185,'2',30,'#1A2329')}${lbl(270,195,'3',26,'#1A2329')}
  ${em(90,128,'❔',28)}${em(270,148,'❔',28)}<g data-w="primera" class="sube">${em(180,96,'🚗',40)}${em(205,70,'💥',26)}</g></svg>
  <div class="cap big" data-w="primera">1ª causa de muerte en los jóvenes</div>`,
 'c1-oms':()=>{const c='g'+(++gid);return `<svg viewBox="0 0 360 220">${caja(220)}<defs><clipPath id="${c}"><circle cx="180" cy="115" r="88"/></clipPath></defs>
  <circle cx="180" cy="115" r="88" fill="#1E64A8"/><g clip-path="url(#${c})"><g class="gira"><g transform="translate(0,50)"><path d="M30 20 q40 -30 80 -6 q24 34 -10 56 q-46 12 -70 -50Z M160 4 q46 -14 70 24 q10 46 -34 66 q-36 -12 -36 -90Z M290 40 q36 -24 58 12 q-12 34 -58 -12Z" fill="#46A86E"/></g><g transform="translate(400,50)"><path d="M30 20 q40 -30 80 -6 q24 34 -10 56 q-46 12 -70 -50Z M160 4 q46 -14 70 24 q10 46 -34 66 q-36 -12 -36 -90Z M290 40 q36 -24 58 12 q-12 34 -58 -12Z" fill="#46A86E"/></g></g></g>
  ${[[130,80],[210,70],[160,140],[240,130],[115,125],[195,165]].map(([x,y],i)=>em(x,y,'📍',22,wd('todo el mundo',i*200))).join('')}
  <g data-w="organización">${tag(70,30,110,'🏥 OMS')}</g>
  <g data-w="prioritario" class="sello"><rect x="64" y="88" width="232" height="52" rx="8" fill="#16242C" fill-opacity=".88" stroke="#FF4B4B" stroke-width="4" transform="rotate(-8 180 114)"/>${lbl(180,112,'PRIORIDAD DE',15,'#FF4B4B',' transform="rotate(-8 180 114)"')}${lbl(180,130,'SALUD PÚBLICA',15,'#FF4B4B',' transform="rotate(-8 180 114)"')}</g></svg>
  <div class="cap big" data-w="prioritario">Problema prioritario de salud pública</div>`},
 'c1-edad1':()=>`<svg viewBox="0 0 360 200">${caja(200)}${lbl(180,26,'🇨🇱 Chile · edad',13,'#9AB0BC')}
  <rect x="30" y="96" width="300" height="14" rx="7" fill="#37464F"/>${[1,14,15,29].map(a=>`<line x1="${30+a*10}" y1="88" x2="${30+a*10}" y2="118" stroke="#9AB0BC" stroke-width="2"/>${lbl(30+a*10+(a==14?-6:a==15?6:0),136,a,12,'#9AB0BC')}`).join('')}
  <rect x="40" y="96" width="130" height="14" rx="7" fill="#FFC800" data-w="uno y catorce"/>${em(105,80,'🧒',34,wd('niñas'))}
  <g data-w="primera">${tag(105,172,150,'🥇 1ª causa de muerte','','#3A3000')}</g></svg>
  <div class="cap big" data-w="primera">De 1 a 14 años: 1ª causa de muerte</div>`,
 'c1-edad2':()=>`<svg viewBox="0 0 360 200">${caja(200)}${lbl(180,26,'🇨🇱 Chile · edad',13,'#9AB0BC')}
  <rect x="30" y="96" width="300" height="14" rx="7" fill="#37464F"/>${[1,14,15,29].map(a=>`<line x1="${30+a*10}" y1="88" x2="${30+a*10}" y2="118" stroke="#9AB0BC" stroke-width="2"/>${lbl(30+a*10+(a==14?-6:a==15?6:0),136,a,12,'#9AB0BC')}`).join('')}
  <rect x="40" y="96" width="130" height="14" rx="7" fill="#FFC800" opacity=".45"/>${em(105,80,'🧒',30,' opacity=".5"')}${tag(105,172,120,'1ª causa','','#2A2A1A')}
  <rect x="180" y="96" width="140" height="14" rx="7" fill="#FF9600" data-w="quince"/>${em(250,80,'🧑',34,wd('jóvenes'))}
  <g data-w="segunda">${tag(255,172,150,'🥈 2ª causa de muerte','','#3A2400')}</g></svg>
  <div class="cap big" data-w="segunda">De 15 a 29 años: 2ª causa</div>
  <div class="cap" data-w="suicidios">después de los suicidios</div>`,
 'c1-lesionados':()=>`<svg viewBox="0 0 360 220">${caja(220)}
  <rect x="30" y="60" width="130" height="130" rx="14" fill="#1E2B32" stroke="#37464F" stroke-width="2"/>${lbl(95,86,'Fallecidos',15)}${em(95,150,'🕯️',40)}
  <rect x="200" y="60" width="130" height="130" rx="14" fill="#1E2B32" stroke="#FFC800" stroke-width="2" data-w="lesionados" style="--o:1"/><rect x="200" y="60" width="130" height="130" rx="14" fill="#1E2B32" stroke="#37464F" stroke-width="2"/>${lbl(265,86,'Lesionados',15)}${em(250,150,'🩹',34)}
  <g data-w="discapacidad"><g data-h="lesionados">${em(180,40,'♿',34)}${tag(180,8,96,'de por vida','','#3A2400')}</g></g><g data-w="lesionados">${em(296,150,'♿',30)}</g>
  <g data-w="saber">${lbl(300,150,'¿?',30,'#FFC800')}</g></svg>
  <div class="cap" data-w="discapacidad">Quien queda con discapacidad de por vida…</div>
  <div class="cap big" data-w="lesionados">…aparece solo como «lesionado»</div>`,
 'c1-iceberg':()=>`<svg viewBox="0 0 360 240"><rect width="360" height="240" fill="#16242C"/><rect y="70" width="360" height="170" fill="#164a6e"/><line x1="0" y1="70" x2="360" y2="70" stroke="#7CC8FF" stroke-width="2" opacity=".7"/>
  <path d="M150 70 L170 34 L188 46 L204 70Z" fill="#E8F4FA" data-w="consciencia"/>${lbl(250,40,'Lo que se ve',12.5,'#9AB0BC',wd('consciencia'))}
  <path d="M150 70 L204 70 L262 120 L290 190 L210 232 L110 226 L66 170 L98 108Z" fill="#BFE0F2" opacity=".55" data-w="magnitud" style="--o:.55"/>
  <g data-w="magnitud">${lbl(180,128,'+3.000 muertes al día',13.5,'#0E2A3D')}${lbl(180,160,'discapacidades de por vida',13,'#0E2A3D')}${lbl(180,192,'el dolor de cada familia',13,'#0E2A3D')}</g></svg>
  <div class="cap big" data-w="magnitud">No hay consciencia de su magnitud</div>`,
 // ---------- Sesión 3 ----------
 'c1-100':()=>{let o='',k=0;[[10,48],[18,72],[28,96],[44,118]].forEach(([n,r])=>{for(let i=0;i<n;i++,k++){const a=i/n*Math.PI*2+r;o+=em((180+Math.cos(a)*r*1.25).toFixed(0),(122+Math.sin(a)*r*.82).toFixed(0),'🧍',14,wd('cien',k*18))}});
  return `<svg viewBox="0 0 360 240">${caja(240)}${o}${vela(180,132,34)}</svg>
  <div class="chips"><span data-w="familiares">👨‍👩‍👧 familiares</span><span data-w="amigos">🧑‍🤝‍🧑 amigos</span></div>
  <div class="cap big" data-w="cien">Unas 100 personas sufren</div><div class="cap" data-w="fallecida">por cada persona fallecida</div>`},
 'c1-pib':()=>`<svg viewBox="0 0 360 230">${caja()}${lbl(180,22,'Producto interno bruto de Chile',12.5,'#9AB0BC',wd('producto'))}
  <g data-w="producto">${grid(100,20,26,48,16.4,18,(x,y,i)=>`<circle cx="${x.toFixed(1)}" cy="${y}" r="6.5" fill="#FFC800" opacity=".8"/>`)}</g>
  <g data-w="dos de cada cien">${[0,1].map(i=>`<circle cx="${(26+i*16.4).toFixed(1)}" cy="48" r="9" fill="#FF4B4B" class="late"/>`).join('')}</g>
  <g data-w="dos de cada cien">${em(110,210,'💥🚗',26)}<path d="M40 60 Q60 160 96 198" stroke="#FF4B4B" stroke-width="3" fill="none" stroke-dasharray="6 6"/></g></svg>
  <div class="cap big" data-w="dos por ciento">2% del PIB</div><div class="cap" data-w="dos de cada cien">2 de cada 100 pesos</div>`,
 'c1-6millones':()=>`<svg viewBox="0 0 360 210">${caja(210)}<g data-w="cada persona">${em(70,140,'🧍',64)}${lbl(70,186,'cada persona',13,'#9AB0BC')}</g>
  ${grid(6,3,190,70,52,52,(x,y,i)=>`<g data-w="seis millones" style="transition-delay:${i*220}ms"><rect x="${x-22}" y="${y-16}" width="44" height="28" rx="5" fill="#58CC02" stroke="#2E7D02" stroke-width="2"/>${lbl(x,y+3,'$1 M',11,'#0E2A0E')}</g>`)}
  ${em(330,160,'🪙',18,wd('poco más',0))}${lbl(242,190,'al año',13,'#9AB0BC',wd('al año'))}</svg>
  <div class="cap big" data-w="seis millones">Poco más de 6 millones al año</div><div class="cap" data-w="valorizar">solo contando los costos que tienen precio</div>`,
 'c1-costos':()=>{const box=(x,y,ic,t,s,w)=>`<g data-w="${w}"><rect x="${x-78}" y="${y-30}" width="156" height="62" rx="12" fill="#1E2B32" stroke="#FFC800" stroke-width="1.5"/>${em(x-56,y+8,ic,24)}${lbl(x+14,y-6,t,13.5,'#FFC800')}${lbl(x+14,y+12,s,10.5,'#9AB0BC')}</g>`;
  return `<svg viewBox="0 0 360 250">${caja(250)}<g transform="translate(106,140)">${auto('#FF4B4B')}</g><g transform="translate(254,140) scale(-1,1)">${auto('#1CB0F6')}</g>${em(180,118,'💥',30)}
  ${box(88,40,'🚗','Materiales','vehículos, propiedad','materiales')}${box(272,40,'🚑','De salud','ambulancia, tratamiento','salud')}${box(88,210,'👮','Administrativos','policía, seguros, jueces','administrativos')}${box(272,210,'💔','Humanos','sufrimiento, productividad','humanos')}</svg>
  <div class="cap big" data-w="cuatro">4 tipos de costos</div>`},
 'c1-admin':()=>`<svg viewBox="0 0 360 180">${caja(180)}${[['🚓','Policía','policía'],['🚒','Bomberos','bomberos'],['📄','Seguros','seguros'],['⚖️','Jueces y|abogados','jueces']].map(([ic,t,w],i)=>`<g data-w="${w}">${em(50+i*87,96,ic,40)}${t.split('|').map((l,k)=>lbl(50+i*87,134+k*15,l,12)).join('')}</g>`).join('')}</svg>
  <div class="cap big" data-w="administrativos">Costos administrativos</div>`,
 'c1-humanos':()=>`<svg viewBox="0 0 360 180">${caja(180)}<g data-w="productividad">${em(100,96,'🏭',42)}${lbl(100,134,'Productividad perdida',12)}</g><g data-w="sufrimiento">${em(260,96,'💔',42)}${lbl(260,134,'Sufrimiento físico',12)}${lbl(260,150,'y psicológico',12)}</g></svg>
  <div class="cap big" data-w="humanos">Costos humanos</div>`,
 'c1-sinprecio':()=>{const t=(x,ic,p,w,x2)=>`<g data-w="${w}">${em(x,110,ic,44)}<g transform="rotate(-10 ${x+34} 70)"><rect x="${x+8}" y="56" width="58" height="28" rx="6" fill="#F1F7FB"/>${lbl(x+37,76,p,16,'#1A2329')}</g>${x2||''}</g>`;
  return `<svg viewBox="0 0 360 180">${caja(180)}${t(40,'🚗','$$$','costos')}${t(150,'🚑','$$','costos')}${t(258,'💔','¿$?','sufrimiento',`<line x1="${262}" y1="54" x2="${330}" y2="88" stroke="#FF4B4B" stroke-width="5" stroke-linecap="round"/>`)}${lbl(286,150,'no tiene precio',12.5,'#FF4B4B',wd('sufrimiento'))}</svg>
  <div class="cap big" data-w="dinero">No todo se puede medir en dinero</div>`},
 // ---------- Sesión 4 ----------
 'c1-cinco':()=>`<div class="cap big">🇨🇱 Siniestros en Chile</div><svg viewBox="0 0 360 150">${caja(150)}${[2018,2019,2020,2021,2022].map((y,i)=>`<g data-w="cinco" style="transition-delay:${i*200}ms"><rect x="${22+i*66}" y="40" width="54" height="62" rx="8" fill="#1E2B32" stroke="${y==2022?'#FFC800':'#37464F'}" stroke-width="2"/>${em(49+i*66,70,'📅',20)}${lbl(49+i*66,94,y,13,y==2022?'#FFC800':'#F1F7FB')}</g>`).join('')}
  <path d="M22 116 V126 H340 V116" stroke="#FFC800" stroke-width="3" fill="none" data-w="promedio"/>${lbl(180,144,'promedio',14,'#FFC800',wd('promedio'))}</svg>`,
 'c1-82mil':()=>{const r=rnd(82);let b='';for(let i=0;i<36;i++){const y=14+r()*232,x=165+r()*20+Math.sin(y/30)*6;b+=`<text x="${x.toFixed(0)}" y="${y.toFixed(0)}" font-size="11" text-anchor="middle" class="boom" data-w="registran" style="transition-delay:${(i*55)}ms;animation-delay:${i*55}ms">💥</text>`}
  return `<svg viewBox="0 0 360 260">${caja(260)}${chile}${b}${lbl(285,120,'cada año',14,'#9AB0BC',wd('cada año'))}</svg>
  <div class="cap big" data-w="ochenta">Más de 82.000 siniestros al año</div>`},
 'c1-1600':()=>`<svg viewBox="0 0 360 170">${caja(170)}${grid(16,8,40,70,40,58,(x,y,i)=>vela(x,y,30,wd('fallecen',i*90)))}</svg>
  <div class="chips"><span data-w="fallecen">🕯️ = 100 personas</span></div><div class="cap big" data-w="mil seiscientas">Unas 1.600 personas al año</div>`,
 'c1-dia':()=>`<svg viewBox="0 0 360 190">${caja(190)}<g data-w="cada día"><rect x="120" y="14" width="120" height="40" rx="8" fill="#FF4B4B"/>${lbl(180,41,'1 DÍA',18)}<rect x="120" y="50" width="120" height="126" rx="8" fill="#F1F7FB"/></g>
  ${[0,1,2,3,4].map(i=>vela(140+(i%3)*40,i<3?100:150,28,wd('cuatro y cinco',i*200)+(i==4?' opacity=".35"':''))).join('')}</svg>
  <div class="cap big" data-w="cuatro y cinco">Entre 4 y 5 personas cada día</div>`,
 'c1-atropellos':()=>`<svg viewBox="0 0 360 170">${caja(170)}${grid(16,8,40,70,40,58,(x,y,i)=>vela(x,y,30,i<5?'':' opacity=".55"'))}
  ${grid(5,5,52,52,40,0,(x,y,i)=>`<g data-w="atropelladas" style="transition-delay:${i*200}ms">${i==4?`<clipPath id="half${gid}"><rect x="${x-12}" y="${y-14}" width="12" height="28"/></clipPath>`:''}<circle cx="${x}" cy="${y-4}" r="12" fill="#FF9600"${i==4?` clip-path="url(#half${gid})"`:''}/>${em(x,y+1,'🚶',14,i==4?` clip-path="url(#half${gid})"`:'')}</g>`)}</svg>
  <div class="chips"><span>🕯️ = 100 personas</span></div><div class="cap big" data-w="cuatrocientas">Unas 450 son atropelladas</div>`,
 'c1-graves':()=>`<svg viewBox="0 0 360 150">${caja(150)}${grid(8,8,30,90,43,0,(x,y,i)=>`<g data-w="siete mil" style="transition-delay:${i*150}ms">${i==7?`<clipPath id="amb${++gid}"><rect x="${x-18}" y="${y-30}" width="25" height="40"/></clipPath>`:''}${em(x,y,'🚑',30,i==7?` clip-path="url(#amb${gid})"`:'')}</g>`)}</svg>
  <div class="chips"><span data-w="siete mil">🚑 = 1.000 personas</span></div><div class="cap big" data-w="siete mil">Unas 7.700 con lesiones graves</div>`,
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
  ${grid(10,5,62,170,34,26,(x,y,i)=>em(x,y,'🩹',18,wd('lesionados',i*90)))}${[0,1].map(i=>em(288+i*34,170,'🚑',22,wd('menos graves',i*200))).join('')}${lbl(304,146,'más graves',11,'#FF4B4B',wd('menos graves'))}${lbl(118,212,'menos graves',11,'#9AB0BC',wd('menos graves'))}</svg>
  <div class="cap big" data-w="treinta y cinco">En la ciudad, más de 35.000 lesionados al año</div><div class="cap" data-w="menos graves">en su mayoría, con lesiones menos graves que en carretera</div>`,
 // ---------- Sesión 5 ----------
 'c1-v30':()=>`<svg viewBox="0 0 360 240">${caja(240)}${velo(30)}${grid(10,10,36,214,32,0,(x,y,i)=>em(x,y,i<9?'🧍':'🧍',22,wd('noventa',i*80)+(i<9?'':' opacity=".25"')))}</svg>
  <div class="cap big" data-w="noventa">9 de cada 10 sobreviven</div>`,
 'c1-v45':()=>`<svg viewBox="0 0 360 240">${caja(240)}${velo(45)}${grid(10,10,36,214,32,0,(x,y,i)=>em(x,y,'🧍',22,' opacity=".35"'))}
  <line x1="196" y1="186" x2="196" y2="226" stroke="#FFC800" stroke-width="3" stroke-dasharray="4 4" data-w="menos del cincuenta"/>${lbl(116,186,'◀ sobreviven menos de la mitad',11.5,'#FF9600',wd('menos del cincuenta'))}</svg>
  <div class="cap big" data-w="menos del cincuenta">Menos de la mitad sobrevive</div>`,
 'c1-v65':()=>`<svg viewBox="0 0 360 240">${caja(240)}${velo(65)}<g data-w="lo más probable">${em(180,222,'🚶',34,' opacity=".5"')}${em(214,206,'⚠️',26)}</g></svg>
  <div class="cap big" data-w="lo más probable">Lo más probable es que muera</div>`,
 'c1-x8':()=>`<svg viewBox="0 0 360 180">${caja(180)}${tag(60,58,90,'30 km/h','','#203A12')}${tag(60,128,90,'50 km/h','','#3D1A1C')}
  <circle cx="130" cy="56" r="11" fill="#FF4B4B" data-w="treinta"/>${grid(8,8,130,126,28,0,(x,y,i)=>`<circle cx="${x}" cy="${y}" r="11" fill="#FF4B4B" data-w="ocho" style="transition-delay:${i*150}ms"/>`)}</svg>
  <div class="cap big" data-w="ocho">La probabilidad de morir: ×8</div><div class="cap" data-w="treinta">si un peatón es atropellado</div>`,
 // ---------- Sesión 6 ----------
 'c1-cuando':()=>`<svg viewBox="0 0 360 250">${caja(250)}
  <g data-w="fines de semana">${'LMMJVSD'.split('').map((d,i)=>`<rect x="${20+i*47}" y="14" width="40" height="44" rx="8" fill="${i>=5?'#FFC800':'#1E2B32'}" stroke="#37464F" stroke-width="1.5"/>${lbl(40+i*47,42,d,16,i>=5?'#3a2a00':'#9AB0BC')}`).join('')}</g>
  <g data-w="largos">${[4,0].map(i=>`<rect x="${20+i*47}" y="14" width="40" height="44" rx="8" fill="none" stroke="#FFC800" stroke-width="2.5" stroke-dasharray="5 4"/>`).join('')}${lbl(180,76,'y fines de semana largos',11.5,'#FFC800')}</g>
  <g data-w="noche"><rect x="20" y="92" width="320" height="64" rx="12" fill="#0B1430"/>${estrellas(31,10,60).replace(/cy="/g,'cy="9')}<circle cx="300" cy="124" r="14" fill="#F4F1DE"/>${lbl(130,130,'🌙 Noche y madrugada',15)}</g>
  <g data-w="escaso flujo"><rect x="20" y="172" width="320" height="64" rx="12" fill="#33414A"/><line x1="30" y1="204" x2="330" y2="204" stroke="#D9D9D9" stroke-width="2.5" stroke-dasharray="16 12"/><g transform="translate(0,226)"><g class="car" style="animation-duration:5s">${auto('#FFC800',1)}</g></g>${lbl(110,190,'Escaso flujo de vehículos',12)}</g></svg>
  <div class="cap big" data-w="siniestralidad">Cuándo hay más siniestros</div>`,
 'c1-falla':()=>`<svg viewBox="0 0 360 170">${caja(170)}${grid(10,5,46,62,67,66,(x,y,i)=>`${em(x,y,'💥',30)}<g data-w="falla humana" style="transition-delay:${i*150}ms">${i<9?`${em(x+18,y+16,'🧍',18)}`:`<g opacity=".5">${em(x+18,y+16,'🧍',18)}</g>`}</g>`)}</svg>
  <div class="cap big" data-w="noventa">Falla humana: más de 9 de cada 10</div>`,
 'c1-jovenes18':()=>`<svg viewBox="0 0 360 150">${caja(150)}${lbl(180,26,'Personas conductoras fallecidas',12.5,'#9AB0BC')}${grid(10,10,32,92,33,0,(x,y,i)=>`${em(x,y,'🧍',28,' opacity=".35"')}${i<3?em(x,y,'🧑',28,wd('veintinueve por ciento',i*200)):''}`)}</svg>
  <div class="chips"><span data-w="veintinueve por ciento">🧑 18 a 29 años: cerca de 3 de cada 10</span></div>`,
 'c1-hombres':()=>`<svg viewBox="0 0 360 150">${caja(150)}${lbl(180,26,'Personas conductoras fallecidas',12.5,'#9AB0BC')}${grid(10,10,32,92,33,0,(x,y,i)=>`${em(x,y,'🧍',28,' opacity=".35"')}${i<8?em(x,y,'👨',28,wd('setenta',i*120)):''}`)}</svg>
  <div class="chips"><span data-w="setenta">👨 hombres: cerca de 8 de cada 10</span></div>`,
 'c1-factores':()=>{const fila=(y,w,inner,t)=>`<g data-w="${w}"><g transform="translate(0,${y})"><rect x="10" width="340" height="66" rx="12" fill="#33414A"/><line x1="20" y1="40" x2="340" y2="40" stroke="#D9D9D9" stroke-width="2" stroke-dasharray="14 10"/>${inner}${tag(80,20,140,t)}</g></g>`;
  return `<svg viewBox="0 0 360 236">${caja(236)}
  ${fila(6,'imprudencia',`<g transform="translate(0,58)"><g class="car" style="animation-duration:2.4s">${auto('#FF9600')}<g fill="#fff" opacity=".6"><rect x="-34" y="-30" width="26" height="3"/><rect x="-40" y="-18" width="30" height="3"/></g></g></g>`,'😤 Imprudencia')}
  ${fila(84,'alcohol',`<g transform="translate(180,58)"><g class="zig">${auto('#FF4B4B')}${em(36,-42,'🍺',20)}</g></g>`,'🍺 Alcohol')}
  ${fila(162,'señales',`<rect x="250" y="-26" width="14" height="40" rx="4" fill="#1A2329"/><circle cx="257" cy="-18" r="5" fill="#FF4B4B"/><circle cx="257" cy="-6" r="5" fill="#3A3A3A"/><circle cx="257" cy="6" r="5" fill="#3A3A3A"/><g transform="translate(0,58)"><g class="car" style="animation-duration:3s">${auto('#1CB0F6')}</g></g>`,'🚦 Desobedecer señales')}</svg>`},
 'c1-48h':()=>`<svg viewBox="0 0 360 190">${caja(190)}<rect x="30" y="90" width="150" height="16" rx="8" fill="#58CC02" data-w="cuarenta y ocho"/><rect x="180" y="90" width="150" height="16" rx="8" fill="#5B6B74" data-w="días después"/>
  ${lbl(30,130,'siniestro',11,'#9AB0BC')}${lbl(180,130,'48 horas',12.5,'#FFC800')}<line x1="180" y1="80" x2="180" y2="116" stroke="#FFC800" stroke-width="3"/>
  <g data-w="cuarenta y ocho">${em(110,74,'🕯️',26)}${lbl(110,160,'✔ se cuenta',12.5,'#58CC02')}</g>
  <g data-w="días después">${em(270,74,'🕯️',26,' opacity=".5"')}${lbl(270,160,'✖ no aparece',12.5,'#FF4B4B')}</g></svg>
  <div class="cap big" data-w="cuarenta y ocho">Carabineros: solo dentro de 48 horas</div>`,
 // ---------- Sesión 7 ----------
 'c1-t1993':()=>linea([[60,'1993','📜','mil novecientos']],`<path d="M90 118 H300" stroke="#FFC800" stroke-width="4" stroke-dasharray="8 6" class="go avanza" data-w="desde entonces"/>`)+`<div class="cap big" data-w="mil novecientos">1993: primera Política Nacional</div><div class="cap" data-w="desde entonces">para disminuir los siniestros</div>`,
 'c1-desafios':()=>`<svg viewBox="0 0 360 200">${caja(200)}<rect x="10" y="60" width="340" height="110" rx="12" fill="#33414A"/><line x1="20" y1="115" x2="340" y2="115" stroke="#D9D9D9" stroke-width="2.5" stroke-dasharray="16 12"/>
  ${grid(4,4,50,100,80,0,(x,y,i)=>em(x,y,'🚲',26,wd('ciclistas',i*150)))}${grid(4,4,80,150,80,0,(x,y,i)=>em(x,y,'🚗',26,wd('vehículos',i*150)))}${grid(3,3,110,134,90,0,(x,y,i)=>em(x,y,'🏍️',24,wd('motocicletas',i*150)))}</svg>
  <div class="chips"><span data-w="ciclistas">🚲 más ciclistas</span><span data-w="vehículos">🚗 más vehículos</span><span data-w="motocicletas">🏍️ más motos</span></div><div class="cap big" data-w="nuevos enfoques">Nuevos desafíos, nuevos enfoques</div>`,
 'c1-t2017':()=>linea([[60,'1993','📜',''],[290,'2017','🛡️','dos mil diecisiete']],`<path d="M90 118 H262" stroke="#FFC800" stroke-width="4" stroke-dasharray="8 6"/>`)+`<div class="cap big" data-w="sistema seguro">2017: enfoque Sistema Seguro</div>`,
 'c1-inaceptable':()=>`<svg viewBox="0 0 360 190">${caja(190)}<g>${grid(6,6,60,80,48,0,(x,y,i)=>vela(x,y,26))}</g>
  <g data-w="inaceptables" class="sello"><rect x="50" y="52" width="260" height="46" rx="8" fill="#16242C" fill-opacity=".9" stroke="#FF4B4B" stroke-width="4" transform="rotate(-6 180 75)"/>${lbl(180,84,'INACEPTABLE',24,'#FF4B4B',' transform="rotate(-6 180 75)"')}</g>
  <g data-w="nadie">${lbl(180,150,'Meta: que nadie muera',15,'#58CC02')}${lbl(180,170,'ni resulte gravemente herido',13,'#58CC02')}</g></svg>
  <div class="cap" data-w="principio ético">Principio ético: muertes y lesiones graves</div>`,
 'c1-vision0':()=>`<svg viewBox="0 0 360 180">${caja(180)}<g data-w="visión">${em(130,112,'👁️',64)}</g><g data-w="cero">${lbl(236,128,'0',96,'#FFC800')}</g></svg>
  <div class="cap big" data-w="visión">Visión Cero</div>`,
 'c1-error':()=>`<svg viewBox="0 0 360 220">${cruceSimple()}<g transform="translate(0,170)"><g class="go errar">${auto('#1CB0F6')}</g></g>${em(212,128,'🚲',30)}
  <g data-w="errores"><rect x="20" y="22" width="132" height="44" rx="14" fill="#F1F7FB"/><path d="M60 66 L52 82 L76 66Z" fill="#F1F7FB"/>${lbl(86,50,'¡No lo vi!',16,'#1A2329')}</g>${boom(206,150,'equivocación',0,36)}</svg>
  <div class="cap big" data-w="errores">Errar es humano</div><div class="cap" data-w="equivocación">La mayoría de los siniestros: una equivocación</div>`,
 'c1-riesgo':()=>`<svg viewBox="0 0 360 220">${cruceSimple()}
  <g data-w="riesgo"><rect x="160" y="150" width="104" height="10" fill="#58CC02" opacity=".85"/><rect x="236" y="96" width="10" height="44" fill="#F1F7FB"/>${em(280,92,'⚠️',22)}<rect x="300" y="70" width="34" height="34" rx="17" fill="#F1F7FB" stroke="#FF4B4B" stroke-width="5"/>${lbl(317,92,'30',14,'#1A2329')}</g>
  <g transform="translate(0,170)"><g class="go frena2" data-w="riesgo">${auto('#1CB0F6')}</g></g>${em(212,128,'🚲',30)}${em(150,128,'✅',26,wd('guíe'))}
  <g data-w="en vez de corregir">${tag(86,30,150,'🙅 solo corregir errores','','#3D1A1C')}</g></svg>
  <div class="cap big" data-w="riesgo">Abordar el riesgo de circular</div><div class="cap" data-w="apoye y guíe">Un sistema que apoye y guíe a las personas</div>`,
 'c1-limite':()=>`<svg viewBox="0 0 360 200">${caja(200)}<line x1="40" y1="70" x2="320" y2="70" stroke="#FF4B4B" stroke-width="3" stroke-dasharray="8 6"/>${lbl(250,60,'límite del cuerpo humano',12,'#FF4B4B')}
  <rect x="80" y="40" width="70" height="140" rx="8" fill="#FF4B4B" data-w="fuerzas" data-h="no superen"/>${lbl(115,196,'impacto',12,'#9AB0BC')}
  <rect x="80" y="100" width="70" height="80" rx="8" fill="#58CC02" data-w="no superen"/>${em(240,150,'🧍',56,wd('cuerpo'))}${em(272,118,'🛡️',28,wd('no superen'))}</svg>
  <div class="cap big" data-w="no superen">El impacto no debe superar lo que el cuerpo resiste</div>`,
 'c1-p1':()=>escudo(1),'c1-p2':()=>escudo(2),'c1-p3':()=>escudo(3),'c1-p4':()=>escudo(4),
});
// piezas compartidas
function ciudadCruce(op=1){return `<g opacity="${op}"><rect width="240" height="220" fill="#2A3A46"/>${[[10,10],[150,10],[10,150],[150,150]].map(([x,y])=>`<rect x="${x}" y="${y}" width="80" height="60" rx="6" fill="#5E7390"/>`).join('')}<rect x="0" y="90" width="240" height="50" fill="#3A4852"/><rect x="100" y="0" width="40" height="220" fill="#3A4852"/>${[0,1,2,3,4].map(i=>`<rect x="${102+i*8}" y="80" width="5" height="10" fill="#F1F7FB" opacity=".8"/>`).join('')}${lbl(120,212,'Ciudad',13,'#F1F7FB')}</g>`}
function campo(op=1){return `<g opacity="${op}"><rect x="244" width="116" height="220" fill="#2F5D50"/><path d="M300 0 C280 60 330 110 300 160 S290 210 300 220" stroke="#39454C" stroke-width="22" fill="none"/>${em(262,40,'🌲',18)}${em(342,180,'🌲',18)}${em(340,60,'🌲',16)}${lbl(302,212,'Rural',13,'#F1F7FB')}</g>`}
function cruceSimple(){return `<rect width="360" height="220" fill="#2A3A46"/><rect y="140" width="360" height="40" fill="#3A4852"/><rect x="190" width="44" height="220" fill="#3A4852"/>${[0,1,2,3,4].map(i=>`<rect x="${192+i*8}" y="128" width="5" height="10" fill="#F1F7FB" opacity=".8"/>`).join('')}`}
function linea(hitos,extra=''){return `<svg viewBox="0 0 360 170">${caja(170)}<line x1="20" y1="118" x2="340" y2="118" stroke="#37464F" stroke-width="6" stroke-linecap="round"/>${extra}${hitos.map(([x,y,ic,w])=>`<g${w?` data-w="${w}"`:''}><circle cx="${x}" cy="118" r="14" fill="#FFC800"/>${em(x,82,ic,36)}${lbl(x,152,y,18,'#FFC800')}</g>`).join('')}</svg>`}
function escudo(n){
 if(n==4)return `<svg viewBox="0 0 360 230">${caja(230)}<g transform="translate(180,108)">${[78,62,46].map(r=>`<circle r="${r}" fill="none" stroke="#58CC02" stroke-width="7" opacity=".85"/>`).join('')}<circle r="78" fill="none" stroke="#FF4B4B" stroke-width="8" stroke-dasharray="22 14" data-w="si uno falla"/><g transform="translate(-36,16)">${auto('#1CB0F6')}</g></g>${lbl(180,216,'una capa falla… las demás siguen protegiendo',12.5,'#58CC02',' data-w="protegiendo"')}</svg>
 <div class="cap big">4º Todos los componentes fortalecidos</div>`;const P=[['🤷','Errar es humano','primero'],['🫀','El cuerpo tiene límites','segundo'],['🤝','Responsabilidad compartida','tercero'],['🧱','Si una parte falla, otra protege','cuarto']];
 const pos=[[95,70],[265,70],[95,170],[265,170]];
 const roles=n==3?`<g>${[['📐','diseñan'],['🏗️','construyen'],['🏛️','administran'],['🚗','usan'],['🚑','atienden']].map(([ic,w],i)=>`<g data-w="${w}">${em(40+i*70,250,ic,24)}${lbl(40+i*70,272,w,11,'#9AB0BC')}</g>`).join('')}</g>`:'';
 const capas=n==4?`<g transform="translate(180,120)">${[64,52,40].map((r,i)=>`<circle r="${r}" fill="none" stroke="#58CC02" stroke-width="6" opacity=".85"${i==0?' data-w="si uno falla" style="--o:1"':''}/>`).join('')}<circle r="64" fill="none" stroke="#FF4B4B" stroke-width="7" stroke-dasharray="20 14" data-w="si uno falla"/><g transform="translate(-36,14)">${auto('#1CB0F6')}</g></g>`:'';
 return `<svg viewBox="0 0 360 ${n==3?285:240}">${caja(n==3?285:240)}${P.map(([ic,t,w],i)=>{const [x,y]=pos[i],act=i==n-1,done=i<n-1;if(n==4&&i<3)return '';return i<n?`<g${act?` data-w="${w}"`:''}><rect x="${x-80}" y="${y-38}" width="160" height="76" rx="14" fill="${act?'#3A3000':'#1E2B32'}" stroke="${act?'#FFC800':'#37464F'}" stroke-width="2"/>${em(x,y,ic,act?30:24)}${lbl(x,y+26,t,t.length>20?10.5:(act?12.5:11),act?'#FFC800':'#9AB0BC')}</g>`:`<rect x="${x-80}" y="${y-38}" width="160" height="76" rx="14" fill="none" stroke="#37464F" stroke-width="2" stroke-dasharray="6 6"/>${lbl(x,y+6,(i+1)+'º',20,'#37464F')}`}).join('')}${roles}${capas}${n==4?lbl(180,224,'si una parte falla, las demás siguen protegiendo',12.5,'#58CC02',' data-w="protegiendo"'):''}</svg>
 <div class="cap big">${['','1º Errar es humano','2º El cuerpo tiene límites','3º Responsabilidad compartida','4º Todo fortalecido'][n]}</div>`}
