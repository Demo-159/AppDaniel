// Escenas de los capítulos 8 (conducción eficiente) y 9 (informaciones importantes).
(function(){
const {F,cifraBox,T,W,big,arriba,caja,tacho,ok,no,flecha,chips,big1,cap,ruta,nocheR,cabina,taller,reloj,bencinera,surtidor,persona}=K;
const num=(fondo,txt,w,col,grande,sub,extra='')=>`<svg viewBox="0 0 360 230">${fondo}${extra}${cifraBox(60,30,240,100)}<text x="180" y="96" font-size="${txt.length>10?28:40}" font-weight="900" fill="${col}" text-anchor="middle"${W(w)}>${txt}</text></svg>${big1(grande[0],grande[1])}${sub?cap(sub[0],sub[1]):''}`;
const siniestro=()=>`${L.carretera()}<g transform="translate(150,200) rotate(-20)">${arriba('#9AB0BC',.9)}</g><g transform="translate(210,180) rotate(30)">${arriba('#FF9600',.9)}</g>${em(180,160,'💥',28)}`;
const papel=(x,y,ic,t,w)=>`<g${W(w)}><rect x="${x-40}" y="${y-50}" width="80" height="100" rx="6" fill="#F1F7FB"/>${em(x,y-6,ic,28)}${T(x,y+30,t,10,'#1A2329')}</g>`;
Object.assign(ESCENAS,{
// ===== c8s1 =====
 'c8-que':()=>F(ruta(),[['actitud','🧠','Una actitud'],['rendimiento','⛽','Más rendimiento energético']],['conducción eficiente','Conducción Eficiente']),
 'c8-1015':()=>num(bencinera(),'−10 a 15%','diez','#58CC02',['consumo','Menos consumo de combustible']),
 'c8-beneficios':()=>F(ruta(),[['costo del viaje','💸','Viaje más barato'],['mantenimiento','🔧','Mantenimiento más barato']],['beneficios','Beneficios']),
 'c8-co2':()=>num(L.espacio(),'CO₂','dióxido','#9AB0BC',['efecto invernadero','Causa del efecto invernadero']),
// ===== c8s2 =====
 'c8-planificar':()=>F(ruta(),[['planificar','🗺️','Planifica la ruta'],['con tiempo','⏰','Sal con tiempo'],['gastando menos','⚖️','Lo mismo, gastando menos']],['lo primero','Antes de partir']),
 'c8-gps':()=>F(cabina(),[['teléfono','📵','Sin tocar el teléfono'],['audio','🔊','GPS por audio']],['gps','El GPS']),
 'c8-peso':()=>`<svg viewBox="0 0 360 230">${ruta()}<g transform="translate(110,206) scale(2)">${auto('#1CB0F6')}</g><g${W('más peso')}><rect x="140" y="110" width="60" height="30" fill="#9C6B3E"/><rect x="146" y="90" width="48" height="22" fill="#B07A4A"/></g>${tag(290,40,120,'⛽ más consumo',W('mayor será'),'#0E171C')}</svg>${big1('más peso','Más peso, más consumo')}`,
 'c8-techo':()=>`<svg viewBox="0 0 360 230">${ruta()}<g transform="translate(110,206) scale(2)">${auto('#1CB0F6')}</g><rect x="140" y="118" width="80" height="18" rx="6" fill="#1A2329"${W('portaequipajes')}/>${cifraBox(240,30,110,70)}<text x="295" y="74" font-size="22" font-weight="900" fill="#FF4B4B" text-anchor="middle"${W('veinte por ciento')}>+20%</text></svg>${big1('techo','Bultos en el techo')}`,
// ===== c8s3 =====
 'c8-presion':()=>num(taller(),'cada 2 semanas','dos semanas','#FFC800',['presión','Revisa la presión']),
 'c8-5psi':()=>num(taller(),'−5 PSI → +3%','cinco PSI','#FF4B4B',['consumo','Más consumo con poca presión']),
 'c8-filtros':()=>F(taller(),[['combustible','🛢️','Filtro de combustible: +0,5%'],['aire sucio','🌬️','Filtro de aire sucio: −1,5%']],['filtro','Filtros en mal estado']),
 'c8-mantenimiento':()=>F(taller(),[['segura','🛡️','Seguridad'],['vida útil','⏳','Más vida útil'],['rendimiento','⛽','Buen rendimiento'],['disponibilidad','✅','Más disponibilidad']],['mantenimiento','Buen mantenimiento']),
// ===== c8s4 =====
 'c8-encender':()=>F(cabina(),[['encender','🔑','Al encender: sin acelerar'],['a fondo','🚫','Nunca a fondo']],['acelerador','El acelerador']),
 'c8-altas':()=>`<svg viewBox="0 0 360 230">${cabina()}${reloj(180,140,70,140,20,'km/h',0,120)}${tag(180,40,180,'⛽ −10% y más',W('diez por ciento'),'#0E171C')}</svg>${big1('altas velocidades','Muy rápido, menos rendimiento')}`,
 'c8-marcha':()=>`<svg viewBox="0 0 360 230">${taller()}${caja(110,30,140,140)}${['1','3','5'].map((n,i)=>T(144+i*36,64,n,14,n==='5'?'#58CC02':'#C9D4D8')).join('')}${['2','4','R'].map((n,i)=>T(144+i*36,156,n,14)).join('')}<path d="M144 70 V140 M180 70 V140 M216 70 V140 M144 105 H216" stroke="#9AB0BC" stroke-width="5"/><circle cx="216" cy="78" r="11" fill="#1A2329" stroke="#58CC02" stroke-width="3"${W('más alta')}/></svg>${big1('más alta','La marcha más alta posible')}${cap('bajas consumen','Las bajas consumen más')}`,
 'c8-automatico':()=>F(cabina(),[['a fondo','🦶','Acelerar a fondo'],['marchas más bajas','⬇️','Elige marchas bajas'],['aumenta el consumo','⛽','Más consumo']],['automático','En un auto automático']),
// ===== c8s5 =====
 'c8-distancia':()=>`<svg viewBox="0 0 360 230">${calleMini()}<g transform="translate(160,222)">${auto('#9AB0BC')}</g><g transform="translate(70,222)">${auto('#1CB0F6')}</g>${tag(180,40,200,'frena, acelera, frena…',W('frenar y acelerar'),'#0E171C')}</svg>${big1('muy cerca','Muy cerca: más consumo')}`,
 'c8-ultimo':()=>F(calleMini(),[['siniestros','💥','Más riesgo'],['ahorrar','⛽','No ahorras'],['tiempo','⏱️','No ganas tiempo']],['último minuto','Frenar a último minuto']),
 'c8-cambio':()=>`<svg viewBox="0 0 360 230">${calleMini()}<rect x="310" y="120" width="6" height="80" fill="#26323A"/><rect x="300" y="96" width="26" height="40" rx="6" fill="#1A2329"/><circle cx="313" cy="108" r="6" fill="#FF4B4B"/><g transform="translate(20,222)"><g class="go k2avzF" style="--d:200px">${auto('#58CC02')}</g></g>${tag(130,40,200,'⚙️ con el cambio puesto',W('cambio puesto'),'#0E171C')}${tag(130,76,200,'⛽ se corta la inyección',W('inyección'),'#0E171C')}</svg>${big1('rojo','Llegando a un semáforo en rojo')}`,
 'c8-minuto':()=>F(calleMini(),[['más de un minuto','🔑','Más de 1 minuto: apaga'],['semáforo','🚦','Semáforo: no apagues']],['detención','Detenciones']),
// ===== c8s6 =====
 'c8-prima':()=>F(ruta(),[['adelantamientos','⏩','Adelantamientos'],['emergencia','🆘','Emergencias']],['seguridad','La seguridad primero']),
 'c8-base':()=>num(ruta(),'🛡️ → 🌱','segura','#58CC02',['base','Seguridad: la base de la eficiencia']),
 'c8-estres':()=>F(calleMini(),[['frustración','😤','Frustración'],['agresiva','💢','Agresividad'],['consumo','⛽','Más consumo']],['estrés','El estrés']),
// ===== c9s1 =====
 'c9-obligacion':()=>F(siniestro(),[['detenerse','🛑','Detenerte'],['ayuda','🤝','Prestar ayuda'],['autoridad','👮','Avisar a la policía']],['culpa o sin ella','Con culpa o sin ella']),
 'c9-fuga':()=>F(siniestro(),[['inhabilidad','🪪','Inhabilidad de por vida'],['cárcel','🔒','Cárcel de al menos 1 año']],['fuga','Darse a la fuga es delito']),
 'c9-avisar':()=>F(siniestro(),[['luces','⚠️','Luces de advertencia'],['reflectantes','🔺','Reflectantes'],['apaga','🔑','Apaga tu motor']],['avisa','Si te detienes a ayudar']),
 'c9-electrico':()=>`<svg viewBox="0 0 360 230">${siniestro()}<g${W('calcomanía')}>${tag(90,40,140,'⚡ calcomanía en la luneta','','#0E171C')}</g><g${W('naranjo')}><path d="M240 60 Q280 90 320 70" stroke="#FF8C00" stroke-width="10" fill="none" stroke-linecap="round"/>${no(330,50,'',24)}</g></svg>${big1('alto voltaje','Nunca toques la línea naranja')}`,
 'c9-combustion':()=>F(siniestro(),[['apaga','🔑','Apaga los motores'],['fumes','🚭','Nadie fuma']],['combustión','Vehículos a combustión']),
 'c9-llamar':()=>`<svg viewBox="0 0 360 230">${siniestro()}${[['ciento treinta y uno','🚑','131',70],['ciento treinta y dos','🚒','132',180],['ciento treinta y tres','🚓','133',290]].map(([w,ic,n,x])=>`<g${W(w)}>${cifraBox(x-48,24,96,90)}${em(x,64,ic,28)}<text x="${x}" y="100" font-size="24" font-weight="900" fill="#FFC800" text-anchor="middle">${n}</text></g>`).join('')}</svg>${big1('lugar exacto','Indica el lugar exacto')}`,
// ===== c9s2 =====
 'c9-mover':()=>F(siniestro(),[['no muevas','🚫','No la muevas'],['casco','⛑️','Nunca le quites el casco']],['lesionadas','Personas lesionadas']),
 'c9-comer':()=>F(siniestro(),[['abandones','🫂','No la abandones'],['comer o beber','🚫','Nada de comer ni beber']],['víctima','Con la víctima']),
 'c9-sigla':()=>`<svg viewBox="0 0 360 230">${L.hospital()}${cifraBox(30,30,300,90)}<text x="180" y="92" font-size="46" font-weight="900" fill="#FFC800" text-anchor="middle" letter-spacing="8"${W('sigla')}>XABCDE</text></svg>${big1('orden','Primeros auxilios en orden')}`,
 'c9-x':()=>F(L.hospital(),[['hemorragias graves','🩸','X: hemorragias graves'],['paño','🧻','Presión con paño limpio'],['torniquete','🎗️','Torniquete arriba']],['x','X']),
 'c9-a':()=>F(L.hospital(),[['frente mentón','🙆','Frente y mentón']],['abrir la vía aérea','A: abrir la vía aérea']),
 'c9-b':()=>F(L.hospital(),[['pecho','🫁','¿Se eleva el pecho?'],['seis segundos','⏱️','1 ventilación cada 6 s']],['buena ventilación','B: buena ventilación']),
 'c9-d':()=>F(L.hospital(),[['alerta','👀','A: alerta'],['voz','🗣️','V: responde a la voz'],['dolorosos','✋','D: al dolor'],['inconsciente','😶','I: inconsciente']],['déficit de conciencia','C y D']),
 'c9-e':()=>F(L.hospital(),[['ropa','👕','No quites la ropa'],['mantas','🧣','Abrígala']],['exposición','E: exposición']),
// ===== c9s3 =====
 'c9-viento':()=>`<svg viewBox="0 0 360 230">${L.carretera()}<g transform="translate(240,190) rotate(30)"><rect x="-20" y="-50" width="40" height="100" rx="6" fill="#FF9600"/><path d="M0 -20 L14 0 L0 20 L-14 0Z" fill="#fff"/></g>${em(70,190,'🧍',30,W('distancia'))}<g${W('viento')}>${[0,1,2].map(i=>`<path d="M40 ${80+i*18} q40 -10 80 0" stroke="#BDE7FF" stroke-width="4" fill="none" class="k2glow"/>`).join('')}${flecha(130,98,200,120,'#BDE7FF')}</g></svg>${big1('cautela','Lejos, y con el viento a tu espalda')}`,
 'c9-anotar':()=>F(L.carretera(),[['material peligroso','📝','Anota el material'],['emergencia','☎️','Luego llama']],['toma nota','Antes de llamar']),
// ===== c9s4 =====
 'c9-docs':()=>`<svg viewBox="0 0 360 230">${taller()}${papel(60,110,'🔢','Placa patente','placa')}${papel(150,110,'🏛️','Permiso','permiso')}${papel(240,110,'🛡️','SOAP','SOAP')}${papel(320,110,'🔧','Revisión','revisión técnica')}</svg>${big1('circular','Para circular')}`,
 'c9-placas':()=>F(taller(),[['registro civil','🏛️','Registro Civil las otorga'],['cero días','🆕','Nuevos: con placas puestas']],['placas','Placas Patentes Únicas']),
 'c9-permiso':()=>num(L.plaza(),'Marzo','marzo','#FFC800',['impuesto','Permiso de circulación: impuesto anual'],['municipalidad','Se paga a la Municipalidad']),
 'c9-soap':()=>F(siniestro(),[['conduce','🧑','Quien conduce'],['pasajeros','👥','Pasajeros'],['tercero','🚶','Cualquier tercero']],['culpable','Sin importar quién sea culpable']),
 'c9-revision':()=>F(taller(),[['dirección','🛞','Dirección'],['frenos','🛑','Frenos'],['luces','💡','Luces'],['neumáticos','⭕','Neumáticos'],['combustión','💨','Combustión']],['revisión técnica','Revisión técnica'],['último dígito','Según el último dígito de la patente']),
 'c9-homologacion':()=>F(taller(),[['homologación','📜','Certificado de Homologación']],['nuevos','Vehículos nuevos']),
// ===== c9s5 =====
 'c9-licencia':()=>F(calleMini(),[['licencia','🪪','Porta tu licencia'],['permiso provisional','📄','Retenida: permiso provisional'],['citación','📬','O boleta de citación']],['portar','Tu licencia']),
 'c9-nochat':()=>`<svg viewBox="0 0 360 230">${cabina()}<g${W('celular')}><rect x="230" y="120" width="54" height="90" rx="10" fill="#1A2329" stroke="#9AB0BC" stroke-width="3"/>${tacho(222,112,292,214)}</g>${em(80,190,'🚲',30,W('ciclo'))}</svg>${big1('ley no chat','Ley No Chat')}`,
 'c9-taco':()=>F(calleMini(),[['luz roja','🚦','En luz roja'],['taco','🚗','En un taco'],['PARE','🛑','En un PARE']],['incluso','Prohibido incluso detenido']),
 'c9-gps2':()=>F(cabina(),[['antes de partir','🗺️','Programa antes de partir'],['hombro','🚫','Al hombro no es manos libres']],['gps','GPS y manos libres']),
 'c9-llamada':()=>`<svg viewBox="0 0 360 230">${calleMini()}<g transform="translate(240,212)">${auto('#1CB0F6')}</g>${em(120,150,'📞',40,W('llamada'))}${tag(240,60,160,'🅿️ detente en un lugar seguro',W('lugar seguro'),'#0E171C')}</svg>${big1('detenerte','Detente para contestar')}`,
// ===== c9s6 =====
 'c9-17':()=>F(L.plaza(),[['autorización','👪','Autorización de los padres'],['escuela de conductores','🏫','Curso en Escuela de Conductores']],['diecisiete','Licencia a los 17']),
 'c9-acompanado':()=>`<svg viewBox="0 0 360 230">${calleMini()}<g transform="translate(110,222) scale(2)">${auto('#1CB0F6')}</g>${em(160,160,'🧑',22)}${em(196,160,'🧔',22,W('acompañado'))}${cifraBox(250,30,100,70)}<text x="300" y="72" font-size="22" font-weight="900" fill="#FFC800" text-anchor="middle"${W('cinco años')}>≥ 5 años</text></svg>${big1('acompañado','Siempre acompañado')}`,
 'c9-restricciones':()=>F(calleMini(),[['horario','🕐','Horario'],['zona','📍','Zona'],['adaptado','♿','Vehículo adaptado'],['lentes','👓','Lentes o audífono']],['restringir','Restricciones de licencia']),
// ===== c9s7 =====
 'c9-60':()=>`<svg viewBox="0 0 360 230">${ruta()}${cifraBox(20,24,150,110)}${T(95,52,'+60 km/h',16)}<text x="95" y="104" font-size="28" font-weight="900" fill="#FF4B4B" text-anchor="middle"${W('seis meses')}>6 meses</text>${cifraBox(190,24,150,110)}${T(265,52,'+20 km/h',16)}<text x="265" y="104" font-size="24" font-weight="900" fill="#FF9600" text-anchor="middle"${W('cuarenta y cinco')}>5 a 45 días</text></svg>${big1('suspensión','Suspensión de licencia')}`,
 'c9-drogas':()=>F(calleMini(),[['estupefacientes','💊','Estupefacientes'],['suspensión','🪪','Suspensión']],['influencia','Bajo la influencia de drogas']),
 'c9-12meses':()=>num(L.plaza(),'2 en 12 meses','doce meses','#FF4B4B',['suspende','Dos gravísimas o graves en un año']),
 'c9-gravisimas':()=>F(ruta(),[['veinte y sesenta','⏩','Exceder 20 a 60 km/h'],['oculta','🔢','Patente oculta'],['PARE','🛑','No parar en rojo o PARE']],['gravísimas','Gravísimas']),
 'c9-graves':()=>F(ruta(),[['once a veinte','⏩','Exceder 11 a 20 km/h'],['sin cinturón','🔗','Sin cinturón'],['otras señales','🪧','Otras señales'],['bajar la luz','💡','No bajar la luz']],['graves','Graves']),
 'c9-menos':()=>F(ruta(),[['señalizar','↪️','No señalizar al virar'],['hasta en diez','⏩','Exceder hasta 10 km/h']],['menos graves','Menos graves']),
 'c9-falsa':()=>F(L.plaza(),[['licencia falsa','🪪','Licencia falsa'],['prisión','🔒','Prisión']],['delito','Es un delito']),
// ===== c9s8 =====
 'c9-abs':()=>`<svg viewBox="0 0 360 230">${taller()}<g transform="translate(180,40)"><g class="go k2cae" style="--y:60px"${W('máxima presión')}><rect x="-6" y="0" width="12" height="40" fill="#5D6D78"/><g class="k2tos" style="animation-iteration-count:infinite"><rect x="-28" y="36" width="56" height="18" rx="5" fill="#C9D4D8"/></g></g></g>${tag(180,190,200,'leve temblor: es normal',W('temblor'),'#0E171C')}</svg>${big1('ABS','Con ABS: fuerte y sostenido')}`,
 'c9-sinabs':()=>`<svg viewBox="0 0 360 230">${taller()}<g transform="translate(180,40)"><g class="go k2cae" style="--y:60px;animation-direction:alternate;animation-iteration-count:2"${W('progresiva')}><rect x="-6" y="0" width="12" height="40" fill="#5D6D78"/><rect x="-28" y="36" width="56" height="18" rx="5" fill="#C9D4D8"/></g></g></svg>${big1('sin ABS','Sin ABS: fuerte, y aflojando de a poco')}`,
 'c9-embrague':()=>F(cabina(),[['embrague','🦶','Pisa el embrague'],['apague','🔑','Para que no se apague']],['ambos casos','Antes de detenerte']),
 'c9-falla':()=>F(cabina(),[['varias veces','🔁','Bombea el pedal'],['freno de mano','🅿️','Freno de mano suave']],['fallan','Si fallan los frenos']),
 'c9-motor':()=>F(ruta(),[['no apagues','🔑','No apagues el motor'],['pista de emergencia','🛣️','Pista de emergencia']],['dirección asistida','Mantén el control']),
// ===== c9s9 =====
 'c9-co2':()=>F(L.espacio(),[['dióxido','🌍','CO₂: efecto invernadero'],['plomo','🧠','Plomo: daña el sistema nervioso']],['plomo','Contaminantes']),
 'c9-ralenti':()=>num(calleMini(),'💨','ralentí','#9AB0BC',['ralentí','Motor en ralentí: emisiones innecesarias']),
 'c9-humos':()=>{const h=(x,c,w,t)=>`<g${W(w)}>${cifraBox(x-50,30,100,120)}<circle cx="${x}" cy="76" r="22" fill="${c}" stroke="#9AB0BC" stroke-width="2"/>${T(x,130,t,11)}</g>`;return `<svg viewBox="0 0 360 230">${calleMini()}${h(70,'#1A2329','negro','Combustión')}${h(180,'#5B8FD8','azul','Aceite')}${h(290,'#F1F7FB','blanco','Refrigerante')}</svg>${big1('humo','El color del humo')}`},
// ===== c9s10 =====
 'c9-cable':()=>F(bencinera(),[['cable','🔌','Cable de carga de viaje']],['siempre','Lleva siempre']),
 'c9-autonomia':()=>F(bencinera(),[['autonomía','🔋','Revisa la autonomía'],['cargar','🗺️','Planifica dónde cargar']],['antes de cada viaje','Antes de viajar']),
});
})();
