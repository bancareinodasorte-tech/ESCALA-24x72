const meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const formUrl='https://forms.gle/TAM9Mi6jKYnN3dY87';
let dados={mes:6,ano:2026,diaInicial:2,policiais:[
 {graduacao:'SGT',nome:'RODRIGUES',numeral:'',matricula:'',diaInicial:2},
 {graduacao:'SD',nome:'DE LIMA',numeral:'',matricula:'',diaInicial:3},
 {graduacao:'CB',nome:'GILCLEYTON',numeral:'',matricula:'',diaInicial:4},
 {graduacao:'CB',nome:'FRANSOALDO',numeral:'',matricula:'',diaInicial:5}
]};
const $=id=>document.getElementById(id);
function salvar(){localStorage.setItem('agendaEscala24x72',JSON.stringify(dados));msg('Dados salvos no celular.');}
function carregar(){const s=localStorage.getItem('agendaEscala24x72'); if(s){try{dados=JSON.parse(s)}catch(e){}}}
function msg(t){$('msg').textContent=t;setTimeout(()=>$('msg').textContent='',3500)}
function initMeses(){const sel=$('mes'); sel.innerHTML=meses.map((m,i)=>`<option value="${i}">${m}</option>`).join('')}
function syncForm(){ $('mes').value=dados.mes; $('ano').value=dados.ano; $('diaInicial').value=dados.diaInicial; }
function lerConfig(){dados.mes=+$('mes').value; dados.ano=+$('ano').value||2026; dados.diaInicial=+$('diaInicial').value||1;}
function renderPoliciais(){const el=$('listaPoliciais'); el.innerHTML=''; dados.policiais.forEach((p,i)=>{const div=document.createElement('div');div.className='policial';div.innerHTML=`
 <div class="policialHeader"><b>Policial ${i+1}</b><button class="remove" onclick="removerPolicial(${i})">Remover</button></div>
 <div class="grid2">
  <label>Graduação<input value="${p.graduacao||''}" oninput="upd(${i},'graduacao',this.value)"></label>
  <label>Nome de Guerra<input value="${p.nome||''}" oninput="upd(${i},'nome',this.value)"></label>
  <label>Numeral na PM<input value="${p.numeral||''}" oninput="upd(${i},'numeral',this.value)"></label>
  <label>Matrícula<input value="${p.matricula||''}" oninput="upd(${i},'matricula',this.value)"></label>
  <label>Dia inicial no Turno A<input type="number" min="1" max="31" value="${p.diaInicial||''}" oninput="upd(${i},'diaInicial',this.value)"></label>
 </div>`; el.appendChild(div);});}
window.upd=(i,c,v)=>{dados.policiais[i][c]=c==='diaInicial'?+v:v; gerar(false)};
window.removerPolicial=i=>{if(confirm('Remover este policial?')){dados.policiais.splice(i,1);renderPoliciais();gerar(false)}};
function nome(p){return p?`${p.graduacao||''} ${p.nome||''}`.trim():'—'}
function diasNoMes(){return new Date(dados.ano,dados.mes+1,0).getDate()}
function titularA(dia){return dados.policiais.find(p=>p.diaInicial && dia>=p.diaInicial && (dia-p.diaInicial)%4===0) || null}
function titularB(dia){return dados.policiais.find(p=>p.diaInicial && dia>=p.diaInicial+1 && (dia-(p.diaInicial+1))%4===0) || null}
function gerar(showMsg=true){lerConfig();const max=diasNoMes();let html='<table class="escalaTable"><thead><tr><th>Dia</th><th>Turno A - 12h</th><th>Turno B - 12h</th></tr></thead><tbody>';for(let d=dados.diaInicial;d<=max;d++){const a=titularA(d), b=titularB(d); html+=`<tr><td class="dia">${String(d).padStart(2,'0')}</td><td>${a?`<span class="badge">Titular A</span><div class="nome">${nome(a)}</div>`:'—'}</td><td>${b?`<span class="badge">Titular B</span><div class="nome">${nome(b)}</div><div class="sub">Substituído por: <b>${nome(a)}</b></div>`:'—'}</td></tr>`}html+='</tbody></table>';$('tabelaEscala').innerHTML=html;$('resumoEscala').textContent=`${meses[dados.mes]} de ${dados.ano} • a partir do dia ${String(dados.diaInicial).padStart(2,'0')}`;renderPermutas();if(showMsg)msg('Escala atualizada.');}
function renderPermutas(){let html='';dados.policiais.forEach(p=>{html+=`<div class="permutaCard"><b>${nome(p)}</b><div class="copyBox">Graduação: ${p.graduacao||''}<br>Nome de Guerra: ${p.nome||''}<br>Numeral: ${p.numeral||''}<br>Matrícula: ${p.matricula||''}</div><a class="linkButton" href="${formUrl}" target="_blank">Preencher permuta oficial</a></div>`});$('listaPermutas').innerHTML=html}
function addPolicial(){dados.policiais.push({graduacao:'',nome:'',numeral:'',matricula:'',diaInicial:dados.diaInicial});renderPoliciais();gerar(false)}
function limpar(){if(confirm('Limpar tudo para cadastrar uma nova equipe?')){localStorage.removeItem('agendaEscala24x72');dados={mes:6,ano:2026,diaInicial:1,policiais:[]};syncForm();renderPoliciais();gerar(false);msg('Aplicativo limpo. Cadastre a nova equipe.')}}
async function imagem(){const el=$('areaEscala');const canvas=await html2canvas(el,{scale:2,backgroundColor:'#ffffff'});const a=document.createElement('a');a.download=`agenda-escala-${meses[dados.mes]}-${dados.ano}.png`;a.href=canvas.toDataURL('image/png');a.click()}
function printPdf(){window.print()}
function tabs(){document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.tab).classList.add('active')})}
function bind(){['mes','ano','diaInicial'].forEach(id=>$(id).onchange=()=>gerar(false));$('btnGerar').onclick=()=>gerar(true);$('btnGerar2').onclick=()=>gerar(true);$('btnSalvar').onclick=salvar;$('btnAdd').onclick=addPolicial;$('btnLimpar').onclick=limpar;$('btnPdf').onclick=printPdf;$('btnImagem').onclick=imagem;}
carregar();initMeses();syncForm();renderPoliciais();tabs();bind();gerar(false);
if('serviceWorker' in navigator){navigator.serviceWorker.register('service-worker.js').catch(()=>{})}
