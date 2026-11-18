// Escenas del capítulo 3: Convivencia Vial.
(function(){
const {T,W,big,bigI,arriba,caja,tacho,ok,no,flecha,chips,big1,cap,taller,ruta,nocheR,persona,volante,edificio}=K;
// calle con cruce peatonal visto de lado
const cruce=(h=230)=>`${calleMini()}${grid(6,6,150,152,16,0,(x)=>`<rect x="${x}" y="152" width="9" height="78" fill="#F1F7FB" opacity=".85"/>`)}`;
const semaforo=(x,y,luz='r',a='')=>`<g${a}><rect x="${x-3}" y="${y}" width="6" height="${226-y}" fill="#26323A"/><rect x="${x-13}" y="${y-56}" width="26" height="60" rx="6" fill="#1A2329"/><circle cx="${x}" cy="${y-43}" r="7" fill="#FF4B4B" opacity="${luz=='r'?1:.2}"/><circle cx="${x}" cy="${y-27}" r="7" fill="#FFC800" opacity="${luz=='y'?1:.2}"/><circle cx="${x}" cy="${y-11}" r="7" fill="#58CC02" opacity="${luz=='g'?1:.2}"/></g>`;
const ficha=(x,y,ic,t,w,d=0,an=96)=>`<g${W(w,d)}>${caja(x-an/2,y-34,an,70,'#0E171C',12,' opacity=".9"')}${em(x,y+4,ic,26)}${T(x,y+26,t,11)}</g>`;
Object.assign(ESCENAS,{
// ===== Sesión 1 =====
 'c3-conv':()=>`<svg viewBox="0 0 360 230">${cruce()}<g transform="translate(20,222)">${auto('#1CB0F6')}</g><g${W('peatones')}>${em(175,200,'🚶',34)}${em(205,204,'🧒',26)}</g><g${W('pasajeros')}>${em(300,198,'🚌',40)}</g><g${W('conductoras')}><circle cx="58" cy="176" r="16" fill="none" stroke="#58CC02" stroke-width="3"/></g><g${W('armoniosa')}>${em(120,120,'🤝',40)}${em(250,120,'🤝',40)}</g></svg>
  ${big1('convivencia','Convivencia Vial')}${cap('armoniosa','Todos se respetan: interacción armoniosa y segura')}`,
 'c3-valores':()=>`<svg viewBox="0 0 360 230">${L.plaza()}${ficha(60,70,'🙌','Respeto','respeto',0,90)}${ficha(180,70,'🤝','Solidaridad','solidaridad',0,100)}${ficha(300,70,'💭','Comprensión','comprensión',0,100)}${ficha(110,160,'🕊️','Perdón','perdón',0,90)}${ficha(250,160,'🫶','Tolerancia','tolerancia',0,100)}</svg>
  ${big1('educación vial','Educación Vial: valores')}`,
 'c3-normas':()=>`<svg viewBox="0 0 360 230">${L.plaza()}${ficha(70,90,'⚖️','Normas (Ley de Tránsito)','normas',0,120)}${ficha(200,90,'🚸','Señales','señales',0,90)}<g${W('seguridad vial')}>${flecha(250,90,290,90,'#58CC02')}${em(320,100,'🛡️',34)}${T(320,134,'Seguridad Vial',11)}</g></svg>
  ${big1('además','Además: normas y señales')}`,
// ===== Sesión 2 =====
 'c3-meta':()=>`<svg viewBox="0 0 360 230">${L.carretera()}<g${W('reducción')}>${caja(30,30,300,60,'#0E171C',12,' opacity=".9"')}<rect x="50" y="52" width="260" height="16" rx="6" fill="#37464F"/><rect x="50" y="52" width="260" height="16" rx="6" fill="#FF4B4B" class="go k2bajaX"/></g>${T(180,116,'0 siniestros',22,'#58CC02',W('eliminación total'))}<g${W('consecuencias')}>${tag(180,150,220,'y menos consecuencias','','#0E171C')}</g></svg>
  ${big1('meta','La meta: cero siniestros')}`,
 'c3-percepcion':()=>`<svg viewBox="0 0 360 230">${calleMini()}${caja(40,24,280,130,'#0E171C',14,' opacity=".9"')}${T(110,52,'Riesgo real',13)}${T(250,52,'Riesgo percibido',13)}<g${W('riesgo real')}><rect x="80" y="64" width="60" height="78" rx="6" fill="#FF4B4B" class="go k2sube"/></g><g${W('por debajo')}><rect x="220" y="118" width="60" height="24" rx="6" fill="#FFC800" class="go k2sube"/></g><g${W('nulo')}><rect x="220" y="138" width="60" height="4" fill="#FFC800"/>${T(250,108,'≈ 0',16,'#FFC800')}</g></svg>
  ${big1('por debajo','Sentimos menos riesgo del real')}`,
 'c3-90':()=>`<svg viewBox="0 0 360 230">${calleMini()}${caja(60,24,240,120,'#0E171C',14,' opacity=".9"')}<text x="180" y="94" font-size="48" font-weight="900" fill="#FFC800" text-anchor="middle" data-to="90" data-pre="~"${W('noventa')}>~0</text><text x="226" y="94" font-size="26" font-weight="900" fill="#FFC800"${W('noventa')}>%</text>${T(180,124,'de los siniestros con víctimas',12,'#F1F7FB',W('noventa'))}</svg>
  ${big1('fallas humanas','Producto de fallas humanas')}`,
 'c3-imprudencia':()=>`<svg viewBox="0 0 360 230">${calleMini()}<g transform="translate(60,222)"><g class="zig"${W('imprudencia')}>${auto('#FF4B4B')}</g></g>${tag(110,40,140,'⚡ imprudencia',W('imprudencia'),'#0E171C')}${tag(260,40,150,'🔰 falta de práctica',W('falta de práctica'),'#0E171C')}</svg>
  ${big1('mayor riesgo','El mayor riesgo al conducir')}`,
 'c3-demas':()=>`<svg viewBox="0 0 360 230">${calleMini()}<g${W('demás')}>${caja(40,30,280,70,'#0E171C',14,' opacity=".9"')}${T(180,62,'“Solo le pasa a los demás”',16)}${tacho(60,40,300,90)}</g><g transform="translate(40,222)">${auto('#1CB0F6')}</g></svg>
  ${big1('primer paso','El primer paso')}`,
 'c3-luzroja':()=>`<svg viewBox="0 0 360 230">${cruce()}${semaforo(300,150,'r',W('luz roja'))}<g transform="translate(150,222)"><g class="go k2avz" style="--d:60px"${W('luz roja')}>${auto('#FF4B4B')}</g></g>${em(190,196,'🚶',30)}${tag(90,40,130,'⚖️ infracción',W('infracción'),'#0E171C')}${tag(260,40,160,'💔 contra la convivencia',W('convivencia'),'#0E171C')}</svg>
  ${big1('luz roja','Pasarse una luz roja')}`,
// ===== Sesión 3 =====
 'c3-distrac':()=>`<svg viewBox="0 0 360 230">${calleMini()}<g transform="translate(60,222)">${auto('#1CB0F6')}</g><g${W('distracciones')}>${em(95,150,'📱',30)}<g class="k2glow">${em(95,120,'💬',22)}</g></g>${tag(260,40,170,'una de las principales causas',W('principales'),'#0E171C')}</svg>
  ${big1('distracciones','Distracciones')}`,
 'c3-alcohol':()=>`<svg viewBox="0 0 360 230">${calleMini('#8EC5E0',7)}<g transform="translate(140,182)"><g class="zig">${auto('#FF4B4B')}</g></g><g${W('alcohol')}>${em(60,120,'🍺',34)}</g><g${W('drogas')}>${em(300,120,'💊',34)}</g>${tag(180,40,200,'disminuyen tus facultades',W('disminuyen'),'#0E171C')}</svg>
  ${big1('alcohol','Alcohol y drogas')}`,
 'c3-fatiga':()=>`<svg viewBox="0 0 360 230">${nocheR()}${ficha(60,80,'🥱','Fatiga','fatiga',0,84)}${ficha(150,80,'😴','Sueño','sueño',0,84)}${ficha(240,80,'💊','Fármacos','fármacos',0,84)}${ficha(320,80,'😣','Estrés','estrés',0,72)}<g transform="translate(180,200)">${arriba('#1CB0F6',.9)}</g></svg>
  ${big1('fatiga','Cansancio, fármacos y estrés')}`,
 'c3-velocidad':()=>`<svg viewBox="0 0 360 230">${ruta()}${caja(110,24,140,140,'#0E171C',14,' opacity=".9"')}<circle cx="180" cy="94" r="48" fill="#37464F"/><path d="M180 94 L180 46 A48 48 0 0 1 228 94Z" fill="#FF4B4B"${W('cuarta parte')}/>${T(180,154,'1 de cada 4',13,'#FF4B4B',W('cuarta parte'))}</svg>
  ${big1('velocidad inadecuada','Velocidad inadecuada')}${cap('cuarta parte','En la cuarta parte de los siniestros con víctimas')}`,
 'c3-control':()=>`<svg viewBox="0 0 360 230"><rect width="360" height="230" fill="#33414A"/><path d="M0 200 Q180 60 360 -10" stroke="#4A565D" stroke-width="70" fill="none"/><g transform="translate(150,120)"><g class="go k2trompo"${W('pérdida de control')}>${arriba('#FF4B4B',1.3)}</g></g>${em(60,60,'📱',22)}${em(100,40,'🍺',22)}${em(300,170,'😴',22)}${em(320,130,'⏩',22)}</svg>
  ${big1('pérdida de control','Pérdida de control')}`,
// ===== Sesión 4 =====
 'c3-confianza':()=>`<svg viewBox="0 0 360 230">${cruce()}${semaforo(300,150,'r')}<g transform="translate(30,222)">${auto('#1CB0F6')}</g>${em(175,200,'🚶',32)}<g${W('papel')}>${ok(64,150,'',22)}${ok(175,150,'',22)}</g><g${W('principio de confianza')}>${tag(180,40,200,'🤝 cada quien cumple su papel','','#0E171C')}</g></svg>
  ${big1('principio de confianza','Principio de confianza')}`,
 'c3-sinconfianza':()=>`<svg viewBox="0 0 360 230">${L.plaza()}<g${W('nadie')}><text x="180" y="130" font-size="60" text-anchor="middle">🏠</text>${em(230,130,'🙅',34)}${tag(180,40,220,'Nadie se atrevería a conducir','','#0E171C')}</g></svg>
  ${big1('sin este principio','Sin confianza, nadie saldría')}`,
 'c3-rojo':()=>`<svg viewBox="0 0 360 230">${cruce()}${semaforo(300,150,'r',W('luz roja'))}<g transform="translate(150,222)"><g class="go k2avz" style="--d:70px"${W('luz roja')}>${auto('#FF4B4B')}</g></g>${tag(100,40,160,'Sabe lo que significa',W('desconoce'),'#0E171C')}${tag(100,76,160,'💔 debilita la confianza',W('confianza'),'#0E171C')}${tag(270,76,150,'⚖️ no queda impune',W('impunes'),'#0E171C')}</svg>
  ${big1('impunes','Las infracciones no quedan impunes')}`,
 'c3-todos':()=>`<svg viewBox="0 0 360 230">${calleMini()}${ficha(60,90,'🚶','Peatón','peatones',0,84)}${ficha(150,90,'🚴','Ciclista','ciclistas',0,84)}${ficha(240,90,'🚌','Pasajero','vehículos',0,84)}${ficha(320,90,'🚗','Conductor','conductores',0,72)}</svg>
  ${big1('todas y todos','Todas y todos somos parte')}${cap('distintos','En distintos momentos de la vida')}`,
 'c3-entorno':()=>`<svg viewBox="0 0 360 230">${cruce()}<g transform="translate(20,222)">${auto('#1CB0F6')}</g><g${W('convivencia social')}>${em(175,200,'🚶',30)}${em(230,198,'🚴',30)}${em(300,190,'🧑‍🦽',30)}${em(110,120,'💬',24)}${em(250,120,'💬',24)}</g></svg>
  ${big1('entorno vial','Entorno Vial')}${cap('convivencia social','Un espacio de convivencia social')}`,
 'c3-integrantes':()=>`<svg viewBox="0 0 360 230">${calleMini()}<g transform="translate(20,222)">${auto('#1CB0F6')}</g><g${W('vulnerables')}>${em(190,206,'🚶',36)}${em(280,208,'🚴',36)}<circle cx="190" cy="190" r="26" fill="none" stroke="#FFC800" stroke-width="3" class="k2glow"/><circle cx="280" cy="192" r="26" fill="none" stroke="#FFC800" stroke-width="3" class="k2glow"/></g>${tag(180,40,220,'Integrantes de la circulación',W('integrantes'),'#0E171C')}</svg>
  ${big1('vulnerables','Peatones y ciclistas: vulnerables')}`,
 'c3-precaucion':()=>`<svg viewBox="0 0 360 230">${cruce()}<g transform="translate(40,222)"><g class="go frena2">${auto('#58CC02')}</g></g>${em(195,200,'🚶',32)}<g${W('precaución')}>${caja(130,24,100,90,'#0E171C',14,' opacity=".9"')}<path d="M180 40 L210 92 H150Z" fill="#FFC800" stroke="#1A2329" stroke-width="3"/>${T(180,86,'!',22,'#1A2329')}</g></svg>
  ${big1('precaución','La precaución: principio fundamental')}`,
 'c3-defensiva':()=>`<svg viewBox="0 0 360 230">${cruce()}<g transform="translate(20,222)"><g class="go frena2">${auto('#58CC02')}</g></g><g${W('equivocarse')}><g transform="translate(300,182) scale(-1,1)"><g class="go k2avz" style="--d:40px">${auto('#FF9600')}</g></g>${em(300,130,'❓',26)}</g>${tag(120,40,170,'🛡️ defensiva y preventiva',W('defensiva'),'#0E171C')}</svg>
  ${big1('equivocarse','Todos podemos equivocarnos')}`,
 'c3-solidaridad':()=>`<svg viewBox="0 0 360 230">${ruta()}<g transform="translate(150,190)">${arriba('#1CB0F6',1)}</g><g${W('adelanten')}><g transform="translate(205,150)"><g class="go k2recta" style="animation-duration:3s">${arriba('#FF9600',1)}</g></g></g>${tag(90,40,130,'🤝 ceder el paso',W('ceder el paso'),'#0E171C')}${tag(270,40,150,'↔️ dejar espacio',W('adelanten'),'#0E171C')}${tag(180,76,230,'🚶 consideración con los vulnerables',W('consideración'),'#0E171C')}</svg>
  ${big1('solidaridad','Solidaridad: la mejor virtud')}`,
// ===== Sesión 5 =====
 'c3-velad':()=>`<svg viewBox="0 0 360 230">${calleMini()}<g transform="translate(40,222)"><g class="go frena2">${auto('#58CC02')}</g></g>${em(270,200,'⚽',28)}${tag(110,40,150,'🎮 mantienes el control',W('control'),'#0E171C')}${tag(270,40,150,'⏱️ reaccionas a tiempo',W('reaccionar'),'#0E171C')}</svg>
  ${big1('velocidad adecuada','Velocidad adecuada y segura')}`,
 'c3-visible':()=>`<svg viewBox="0 0 360 230">${nocheR()}<g transform="translate(180,190)">${arriba('#1CB0F6',1.1)}<path d="M-14 -34 L-60 -110 L-4 -110Z M14 -34 L60 -110 L4 -110Z" fill="#FFF3B0" opacity=".3"${W('ver y ser visible')}/></g>${em(110,120,'🚴',28)}<g${W('prevención')}>${tag(270,40,150,'🛡️ la prevención te defiende','','#0E171C')}</g></svg>
  ${big1('ver y ser visible','Ver y ser visible')}`,
 'c3-asumir':()=>`<svg viewBox="0 0 360 230">${ruta()}<g transform="translate(180,190)">${arriba('#1CB0F6',1)}</g><g transform="translate(240,130)">${arriba('#FF9600',1)}</g><g${W('no des por hecho')}>${em(266,96,'❓',22)}${tag(110,40,170,'¿Me vio? No lo des por hecho','','#0E171C')}</g></svg>
  ${big1('defensiva','Conduce a la defensiva')}`,
 'c3-condiciones':()=>`<svg viewBox="0 0 360 230">${L.sala()}${ficha(110,90,'💪','Física','físicas',0,100)}${ficha(250,90,'🧠','Mental','mentales',0,100)}</svg>
  ${big1('mejores condiciones','En las mejores condiciones')}`,
 'c3-clima':()=>`<svg viewBox="0 0 360 230">${ruta()}${ficha(70,80,'🌧️','Clima','climáticas',0,90)}${ficha(180,80,'🌫️','Ambiente','ambientales',0,90)}${ficha(290,80,'🛣️','Pavimento','pavimento',0,90)}</svg>
  ${big1('adapta','Adapta tu conducción')}`,
});
})();
