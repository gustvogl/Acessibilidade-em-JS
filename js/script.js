const root=document.documentElement;
const body=document.body;
const controls={font:document.querySelector('#fontSelect'),size:document.querySelector('#fontSize'),spacing:document.querySelector('#spacing'),focus:document.querySelector('#focusMode'),ruler:document.querySelector('#readingRuler'),contrast:document.querySelector('#highContrast')};
const status=document.querySelector('#status');
const defaults={font:'system',size:'18',spacing:'1.7',focus:false,ruler:false,contrast:false};
const fonts={system:'Inter, ui-sans-serif, system-ui, sans-serif',readable:'Verdana, Arial, sans-serif',serif:'Georgia, Times New Roman, serif'};
function announce(message){status.textContent='';setTimeout(()=>status.textContent=message,40)}
function apply(s,save=true){
 controls.font.value=s.font;controls.size.value=s.size;controls.spacing.value=s.spacing;controls.focus.checked=s.focus;controls.ruler.checked=s.ruler;controls.contrast.checked=s.contrast;
 root.style.setProperty('--font',fonts[s.font]);root.style.setProperty('--fs',s.size+'px');root.style.setProperty('--lh',s.spacing);
 document.querySelector('#fontSizeValue').value=s.size+' px';document.querySelector('#spacingValue').value=Number(s.spacing).toLocaleString('pt-BR');
 body.classList.toggle('focus-on',s.focus);body.classList.toggle('ruler-on',s.ruler);body.classList.toggle('contrast',s.contrast);
 if(save)localStorage.setItem('focoLeitura',JSON.stringify(s));
}
function state(){return{font:controls.font.value,size:controls.size.value,spacing:controls.spacing.value,focus:controls.focus.checked,ruler:controls.ruler.checked,contrast:controls.contrast.checked}}
Object.entries(controls).forEach(([key,el])=>el.addEventListener('input',()=>{apply(state());const names={font:'Fonte alterada',size:'Tamanho do texto alterado',spacing:'Espaçamento alterado',focus:el.checked?'Modo foco ativado':'Modo foco desativado',ruler:el.checked?'Régua ativada':'Régua desativada',contrast:el.checked?'Alto contraste ativado':'Alto contraste desativado'};announce(names[key])}));
document.querySelector('#resetButton').addEventListener('click',()=>{apply(defaults);announce('Ajustes restaurados')});
document.addEventListener('keydown',e=>{if(e.altKey&&e.key.toLowerCase()==='r'){e.preventDefault();controls.ruler.checked=!controls.ruler.checked;apply(state());announce(controls.ruler.checked?'Régua ativada':'Régua desativada')}});
document.addEventListener('pointermove',e=>{if(body.classList.contains('ruler-on'))document.querySelector('#ruler').style.top=Math.max(0,e.clientY-27)+'px'});
function progress(){const article=document.querySelector('#artigo');const start=article.offsetTop;const total=Math.max(1,article.offsetHeight-innerHeight);const value=Math.max(0,Math.min(100,Math.round((scrollY-start+100)/total*100)));document.querySelector('#progressBar').style.width=value+'%';document.querySelector('#progressText').textContent=value+'%'}
addEventListener('scroll',progress,{passive:true});addEventListener('resize',progress);
let saved=defaults;try{saved={...defaults,...JSON.parse(localStorage.getItem('focoLeitura')||'{}')}}catch{}apply(saved,false);progress();
