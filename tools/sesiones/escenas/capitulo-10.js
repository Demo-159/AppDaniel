// Escenas del capítulo 10: anexos (tipos de señales, glosario y proceso de licencia).
(function(){
const {F,cifraBox,T,W,big1,cap,ruta,arriba,caja}=K;
const muni=()=>`${cieloG('#5E9BC0','#CFE6F2')}<rect x="80" y="70" width="200" height="110" fill="#E8EEF0"/><path d="M70 72 L180 30 L290 72Z" fill="#9C6B3E"/>${grid(8,4,104,90,44,40,(x,y)=>`<rect x="${x}" y="${y}" width="22" height="24" fill="#9FC7D6"/>`)}<rect y="180" width="360" height="50" fill="#8C9AA3"/>`;
Object.assign(ESCENAS,{
 'c10-regl':()=>F(ruta(),[['prohibiciones','⛔','Prohibiciones'],['obligaciones','⬆️','Obligaciones'],['infracción','⚖️','No respetarlas: infracción']],['reglamentarias','Reglamentarias']),
 'c10-adv':()=>F(ruta(),[['riesgos','⚠️','Riesgos en la vía'],['temporal','⏳','Permanentes o temporales']],['advertencia','Advertencia de peligro']),
 'c10-info':()=>F(ruta(),[['orientar','🧭','Orientan'],['guiar','🗺️','Guían']],['informativas','Informativas']),
 'c10-trans':()=>F(ruta(),[['trabajos','🚧','Trabajos en la vía'],['naranja','🟧','Color naranja']],['transitorias','Transitorias']),
 'c10-acera':()=>`<svg viewBox="0 0 360 230">${calleMini()}<rect y="140" width="360" height="12" fill="#C9D4D8"${W('acera')}/>${T(60,134,'acera',12,'#1A2329')}<rect y="152" width="360" height="78" fill="#33414A" opacity="0"${W('calzada')}/>${tag(180,40,150,'calzada: vehículos y animales',W('calzada'),'#0E171C')}${tag(180,76,150,'berma: faja lateral',W('berma'),'#0E171C')}</svg>${big1('acera','Acera, berma y calzada')}`,
 'c10-bici':()=>F(calleMini(),[['doscientos cincuenta','🔋','Hasta 250 watts'],['veinticinco','🚲','Se corta a 25 km/h']],['ciclo','Bicicleta eléctrica = ciclo']),
 'c10-regulado':()=>F(calleMini(),[['semáforo','🚦','Semáforo funcionando'],['carabineros','👮','O Carabineros']],['cruce regulado','Cruce regulado']),
 'c10-preferente':()=>F(calleMini(),[['proseguir','➡️','Seguir su marcha']],['derecho preferente','Derecho preferente de paso']),
 'c10-estacionar':()=>F(calleMini(),[['pasajeros','🧍','Más que dejar pasajeros'],['con o sin','🅿️','Con o sin conductor']],['estacionar','Estacionar']),
 'c10-luces':()=>`<svg viewBox="0 0 360 230">${K.nocheR()}${cifraBox(20,30,150,90)}${T(95,58,'Luz baja',13)}<text x="95" y="100" font-size="26" font-weight="900" fill="#FFC800" text-anchor="middle"${W('cincuenta')}>≥ 50 m</text>${cifraBox(190,30,150,90)}${T(265,58,'Luz alta',13)}<text x="265" y="100" font-size="26" font-weight="900" fill="#58CC02" text-anchor="middle"${W('ciento cincuenta')}>≥ 150 m</text></svg>${big1('luz','Luces según el glosario')}`,
 'c10-sobrepasar':()=>`<svg viewBox="0 0 360 230"><rect width="360" height="230" fill="#4A565D"/><line x1="120" y1="-10" x2="120" y2="240" stroke="#F2D04A" stroke-width="4" stroke-dasharray="16 14"/><line x1="240" y1="-10" x2="240" y2="240" stroke="#F1F7FB" stroke-width="3" stroke-dasharray="16 14"/><g transform="translate(300,110)">${arriba('#9AB0BC',1)}</g><g transform="translate(180,190)"><g class="go k2recta" style="animation-duration:3s"${W('sin traspasar')}>${arriba('#1CB0F6',1)}</g></g></svg>${big1('sobrepasar','Sobrepasar')}${cap('sin traspasar','Sin cruzar el eje de la calzada')}`,
 'c10-triciclo':()=>F(calleMini(),[['trescientos','🛺','Triciclo: máx. 300 kg'],['siete','🚐','Escolar: más de 7 sentados']],['carga','Definiciones']),
 'c10-zonas':()=>F(calleMini(),[['cuarenta','🐢','40, 30 o 20 km/h'],['municipalidades','🏛️','Zona urbana: la fija la Municipalidad']],['tránsito calmado','Zonas']),
 'c10-comuna':()=>F(muni(),[['comuna','🏠','En tu comuna']],['licencia','Dónde se obtiene']),
 'c10-examenes':()=>F(muni(),[['visual','👁️','Visual'],['auditiva','👂','Auditivo'],['reacción','⏱️','Reacción'],['médica','🩺','Médico'],['teórico','📝','Teórico'],['práctico','🚗','Práctico']],['exámenes','Los exámenes']),
 'c10-oportunidades':()=>F(muni(),[['dos oportunidades','2️⃣','2 oportunidades por examen'],['veinticinco','📅','Repetir en ≤ 25 días hábiles']],['repruebas','Si repruebas']),
 'c10-denegacion':()=>F(muni(),[['treinta','⏳','1.ª denegación: 30 días hábiles'],['seis meses','📆','Desde la 2.ª: 6 meses']],['denegación','Si te deniegan']),
 'c10-registro':()=>F(muni(),[['cinco días','📨','5 días hábiles'],['registro civil','🏛️','Registro Civil']],['informar','Aprobada la licencia']),
});
})();
