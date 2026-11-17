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
 // 2. Aumentan con lluvia; de noche hay más fallecidos aunque circulan menos vehículos; y con alcohol
 'c1-aumentan':()=>`<svg viewBox="0 0 360 230">${calleMini()}
  <rect width="360" height="152" fill="#0B1430" data-w="noche" style="--o:.8"/><g data-w="noche">${estrellas(9,14,110)}<circle cx="300" cy="40" r="16" fill="#F4F1DE"/></g>
  <g data-w="llueve">${lluviaMini()}</g>
  <g data-h="menos vehículos"><g transform="translate(0,182)"><g class="car izq" style="animation-duration:5.5s;animation-delay:-2s"><g transform="translate(72,0) scale(-1,1)">${auto('#FFC800',1)}</g></g></g>
   <g transform="translate(0,222)"><g class="car" style="animation-duration:7s;animation-delay:-4s">${auto('#58CC02',1)}</g></g></g>
  <g transform="translate(0,222)"><g class="car" style="animation-duration:6s">${auto('#1CB0F6',1)}</g></g>
  <g data-w="alcohol"><g transform="translate(210,182)"><g class="zig"><g transform="translate(72,0) scale(-1,1)">${auto('#FF4B4B')}</g><text x="36" y="-42" font-size="22" text-anchor="middle">🍺</text></g></g></g>
  ${boom(300,178,'aumentan')}${boom(70,172,'llueve',250)}${boom(230,214,'llueve',800)}${boom(150,176,'fallecidas',0)}${boom(320,214,'fallecidas',600)}${boom(40,212,'alcohol',500)}${boom(130,214,'alcohol',1000)}${boom(330,180,'alcohol',1500)}</svg>
  <div class="chips"><span data-w="llueve">🌧️ Lluvia</span><span data-w="noche">🌙 Noche</span><span data-w="alcohol">🍺 Alcohol</span></div>
  <div class="cap" data-w="menos vehículos">🌙 De noche hay menos autos… y más fallecidos</div>
  <div class="cap big" data-w="aumentan">💥 Los siniestros aumentan</div>`,
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
  <div class="cap" data-w="decisión personal">¿Una “decisión personal”?</div>
  <div class="cap big" data-w="pagamos">Todos pagamos su decisión</div>`,
 // 10. Resumen
 'c1-resumen':()=>`<div class="swap"><span class="tach">🎲 Mala suerte<i data-w="mala suerte"></i></span></div>
  <div class="cap big" style="font-size:36px">Siniestro</div>
  <div class="chips col"><span data-w="causas">🔍 Tiene causas</span><span data-w="evitar">✅ La mayoría se puede evitar</span></div>`,
});
