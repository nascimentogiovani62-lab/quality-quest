// ═══════════════════════════════════════════
// QUALITY QUEST v2 — UI
// HUD, diálogos, transição, quiz, telas
// ═══════════════════════════════════════════

// ══════════════════════════════════════════
// HUD
// ══════════════════════════════════════════
function updateHUDMundo(){
  document.getElementById('hudFase').textContent='🌍 Mundo Aberto';
  var belt=BELTS[player.beltIdx]||BELTS[0];
  var beltEl=document.getElementById('hudBelt');
  beltEl.textContent=belt.emoji+' '+belt.label;
  beltEl.style.color=belt.cor;
  document.getElementById('hudScore').textContent='EMPRESAS: '+Math.min(player.beltIdx,4)+'/4';
  document.getElementById('hudProgress').innerHTML='';
  EMPRESAS.forEach(function(emp,i){
    var dot=document.createElement('div');
    dot.className='prog-dot'+(player.beltIdx>i?' done':'');
    dot.style.borderColor=emp.placa.cor;
    if(player.beltIdx>i) dot.style.background=emp.placa.cor;
    document.getElementById('hudProgress').appendChild(dot);
  });
}

function updateHUDFase(empIdx){
  var emp=EMPRESAS[empIdx];
  document.getElementById('hudFase').textContent='🏭 '+emp.nome;
  var belt=BELTS[player.beltIdx]||BELTS[0];
  var beltEl=document.getElementById('hudBelt');
  beltEl.textContent=belt.emoji+' '+belt.label;
  beltEl.style.color=belt.cor;
}

function updateHUDProgress(){
  if(player.empresaAtual<0){ updateHUDMundo(); return; }
  var emp=EMPRESAS[player.empresaAtual];
  var total=emp.operadores.length*3;
  var coletados=fabItens.filter(function(it){return it.coletado;}).length;
  document.getElementById('hudScore').textContent='COLETADOS: '+coletados+'/'+total;

  var prog=document.getElementById('hudProgress');
  prog.innerHTML='';
  emp.operadores.forEach(function(op,i){
    var opObj=fabOperadores[i];
    var dot=document.createElement('div');
    dot.className='prog-dot'+(opObj&&opObj.missaoConcluida?' done':'');
    dot.style.borderColor=emp.corAcento;
    if(opObj&&opObj.missaoConcluida) dot.style.background=emp.corAcento;
    prog.appendChild(dot);
  });
}

function updateHUDVidas(){
  var v='';
  for(var i=0;i<3;i++) v+=(i<player.vidas)?'❤️':'🖤';
  document.getElementById('hudVidas').textContent=v;
}

// Timer
setInterval(function(){
  if((gameState==='mundo'||gameState==='fabrica')&&!paused){
    player.tempoTotal++;
    document.getElementById('hudTimer').textContent=formatTime(player.tempoTotal);
  }
},1000);

function formatTime(s){
  var m=Math.floor(s/60),sc=s%60;
  return (m>0?m+'m ':'')+sc+'s';
}

// ══════════════════════════════════════════
// MISSÃO HUD
// ══════════════════════════════════════════
function showMissaoHUD(missao, total){
  var el=document.getElementById('missaoHUD');
  document.getElementById('missaoTexto').textContent=missao;
  document.getElementById('missaoCount').textContent='0/'+total;
  el.classList.remove('hidden');
}

function hideMissaoHUD(){
  document.getElementById('missaoHUD').classList.add('hidden');
}

// Atualizar contador da missão
setInterval(function(){
  if(gameState!=='fabrica') return;
  var el=document.getElementById('missaoHUD');
  if(el.classList.contains('hidden')) return;
  var opAtiva=fabOperadores.find(function(op){ return op.itensMissao.length>0&&!op.missaoConcluida; });
  if(opAtiva){
    var total=fabItens.filter(function(it){return it.operadorIdx===fabOperadores.indexOf(opAtiva);}).length;
    document.getElementById('missaoCount').textContent=opAtiva.itensMissaoColetados+'/'+total;
  }
},200);

// ══════════════════════════════════════════
// TELA DE TRANSIÇÃO
// ══════════════════════════════════════════
function showTransicaoTexto(emp, cb){
  var el=document.getElementById('transicaoScreen');
  document.getElementById('transEmpresaEmoji').textContent=emp.emojiFabrica;
  document.getElementById('transEmpresaNome').textContent=emp.nome;
  document.getElementById('transEmpresaPais').textContent=emp.pais;
  document.getElementById('transEmpresaDesc').textContent=emp.descricao;

  var fatosEl=document.getElementById('transFatos');
  fatosEl.innerHTML='';
  emp.fatos.forEach(function(f){
    var d=document.createElement('div');
    d.className='trans-fato';
    d.textContent='► '+f;
    fatosEl.appendChild(d);
  });

  el.classList.remove('hidden');
  setTimeout(function(){
    el.classList.add('hidden');
    cb();
  },3200);
}

// ══════════════════════════════════════════
// PLACA MODAL (mundo externo)
// ══════════════════════════════════════════
function showPlacaModal(emp){
  paused=true;
  gameState='popup';
  document.getElementById('placaHeader').style.borderColor=emp.placa.cor;
  document.getElementById('placaEmoji').textContent=emp.emojiFabrica;
  document.getElementById('placaNome').textContent=emp.nome;
  document.getElementById('placaPais').textContent=emp.pais;
  document.getElementById('placaDesc').textContent=emp.descricao;
  var fatosEl=document.getElementById('placaFatos');
  fatosEl.innerHTML='';
  emp.fatos.forEach(function(f){
    var d=document.createElement('div');d.className='placa-fato';d.textContent='► '+f;
    fatosEl.appendChild(d);
  });
  document.getElementById('placaModal').classList.remove('hidden');
}

document.getElementById('placaFechar').addEventListener('click',function(){
  document.getElementById('placaModal').classList.add('hidden');
  paused=false;
  gameState='mundo';
});

// ══════════════════════════════════════════
// NPC INTRO (primeira vez na fábrica)
// ══════════════════════════════════════════
function showNPCIntro(empIdx){
  var emp=EMPRESAS[empIdx];
  var firstOp=emp.operadores[0];
  paused=true;
  gameState='dialogo';
  document.getElementById('npcIntroEmoji').textContent=firstOp.emoji;
  document.getElementById('npcIntroNome').textContent=firstOp.nome+' — '+firstOp.cargo;
  document.getElementById('npcIntroFala').textContent='Bem-vindo à '+emp.nome+'! '+firstOp.dialogo1;
  document.getElementById('npcIntroBox').classList.remove('hidden');
}

document.getElementById('npcIntroBtnOk').addEventListener('click',function(){
  document.getElementById('npcIntroBox').classList.add('hidden');
  paused=false;
  gameState='fabrica';
  showMissaoHUD(EMPRESAS[player.empresaAtual].operadores[0].missao, 3);
});

// ══════════════════════════════════════════
// DIÁLOGOS DOS OPERADORES
// ══════════════════════════════════════════
function showDialogo1(opObj, cb){
  document.getElementById('dialogo1Emoji').textContent=opObj.op.emoji;
  document.getElementById('dialogo1Nome').textContent=opObj.op.nome+' — '+opObj.op.cargo;
  document.getElementById('dialogo1Fala').textContent=opObj.op.dialogo1;
  document.getElementById('dialogo1Missao').textContent='📋 MISSÃO: '+opObj.op.missao;
  document.getElementById('dialogo1Box').classList.remove('hidden');

  document.getElementById('dialogo1BtnOk').onclick=function(){
    document.getElementById('dialogo1Box').classList.add('hidden');
    showMissaoHUD(opObj.op.missao, 3);
    cb();
  };
}

function showDialogo2(opObj, cb){
  var info=ITEM_INFO[opObj.op.itemEnsinado]||{emoji:'📦',cor:'#fff',label:'Item',formula:''};
  document.getElementById('dialogo2Emoji').textContent=opObj.op.emoji;
  document.getElementById('dialogo2Nome').textContent=opObj.op.nome;
  document.getElementById('dialogo2Fala').textContent=opObj.op.dialogo2;
  document.getElementById('dialogo2ItemEmoji').textContent=info.emoji;
  document.getElementById('dialogo2ItemLabel').textContent=info.label+' DESBLOQUEADO!';
  document.getElementById('dialogo2ItemLabel').style.color=info.cor;
  document.getElementById('dialogo2Formula').textContent=info.formula;
  document.getElementById('dialogo2Box').classList.remove('hidden');

  document.getElementById('dialogo2BtnOk').onclick=function(){
    document.getElementById('dialogo2Box').classList.add('hidden');
    cb();
  };
}

// ══════════════════════════════════════════
// BADGE DE ITEM COLETADO
// ══════════════════════════════════════════
function showItemBadge(itemId, cb){
  var info=ITEM_INFO[itemId]||{emoji:'📦',cor:'#fff',label:itemId,formula:''};
  var badge=document.getElementById('itemBadge');
  document.getElementById('badgeEmoji').textContent=info.emoji;
  document.getElementById('badgeLabel').textContent=info.label;
  document.getElementById('badgeLabel').style.color=info.cor;
  document.getElementById('badgeFormula').textContent=info.formula;
  badge.style.borderColor=info.cor;
  badge.classList.remove('hidden');
  setTimeout(function(){
    badge.classList.add('hidden');
    cb();
  },2200);
}

// ══════════════════════════════════════════
// QUIZ
// ══════════════════════════════════════════
var quizIdx=0, quizCorretas=0, quizRespondida=false, quizEmpIdx=0;

function iniciarQuiz(empIdx){
  quizEmpIdx=empIdx;
  quizIdx=0; quizCorretas=0; quizRespondida=false;
  gameState='quiz';
  paused=true;
  showQuizPergunta();
  document.getElementById('quizScreen').classList.remove('hidden');
}

function showQuizPergunta(){
  var emp=EMPRESAS[quizEmpIdx];
  var q=emp.quiz[quizIdx];
  quizRespondida=false;
  document.getElementById('quizNum').textContent=(quizIdx+1)+'/'+emp.quiz.length;
  document.getElementById('quizEmpresa').textContent='📝 QUIZ — '+emp.nome;
  document.getElementById('quizPergunta').textContent=q.pergunta;
  document.getElementById('quizExplicacao').textContent=q.explicacao;
  document.getElementById('quizExplicacao').classList.remove('show');
  document.getElementById('quizNext').classList.remove('show');
  var ops=document.getElementById('quizOpcoes');
  ops.innerHTML='';
  q.opcoes.forEach(function(op,i){
    var btn=document.createElement('button');
    btn.className='quiz-opcao';
    btn.textContent=String.fromCharCode(65+i)+') '+op;
    btn.addEventListener('click',function(){ responderQuiz(i,q.correta); });
    ops.appendChild(btn);
  });
}

function responderQuiz(escolha,correta){
  if(quizRespondida) return;
  quizRespondida=true;
  document.querySelectorAll('.quiz-opcao').forEach(function(b,i){
    b.classList.add(i===correta?'correta':'errada');
  });
  if(escolha===correta) quizCorretas++;
  document.getElementById('quizExplicacao').classList.add('show');
  document.getElementById('quizNext').classList.add('show');
}

document.getElementById('quizNext').addEventListener('click',function(){
  quizIdx++;
  var emp=EMPRESAS[quizEmpIdx];
  if(quizIdx<emp.quiz.length){
    showQuizPergunta();
  } else {
    document.getElementById('quizScreen').classList.add('hidden');
    showEmpresaCompleta(quizEmpIdx);
  }
});

// ══════════════════════════════════════════
// EMPRESA COMPLETA
// ══════════════════════════════════════════
function showEmpresaCompleta(empIdx){
  gameState='fasecompleta';
  var emp=EMPRESAS[empIdx];
  var belt=BELTS[empIdx+1]||BELTS[BELTS.length-1];
  player.beltIdx=Math.min(empIdx+1,BELTS.length-1);

  document.getElementById('empCompletaNome').textContent=emp.nome;
  document.getElementById('empCompletaBeltEmoji').textContent=belt.emoji;
  document.getElementById('empCompletaBeltLabel').textContent=belt.label+' DESBLOQUEADO!';
  document.getElementById('empCompletaBeltLabel').style.color=belt.cor;

  var stars=quizCorretas===3?'⭐⭐⭐ PERFEITO!':quizCorretas===2?'⭐⭐ BOM!':'⭐ PODE MELHORAR';
  document.getElementById('empCompletaStats').textContent=
    '► MISSÕES: '+emp.operadores.length+'/'+emp.operadores.length+'\n'+
    '► QUIZ:    '+quizCorretas+'/'+emp.quiz.length+'  '+stars+'\n'+
    '► VIDAS:   '+player.vidas+'/3';

  var hasNext=empIdx+1<EMPRESAS.length;
  document.getElementById('btnProxEmpresa').textContent=hasNext?'► PRÓXIMA EMPRESA ◄':'► CONCLUSÃO ◄';
  document.getElementById('empCompletaScreen').classList.remove('hidden');
}

document.getElementById('btnProxEmpresa').addEventListener('click',function(){
  document.getElementById('empCompletaScreen').classList.add('hidden');
  var nextIdx=player.empresaAtual+1;
  if(nextIdx<EMPRESAS.length){
    exitFabrica();
  } else {
    showWinFinal();
  }
});

document.getElementById('btnReplayEmpresa').addEventListener('click',function(){
  document.getElementById('empCompletaScreen').classList.add('hidden');
  player.vidas=3;
  buildFabrica(player.empresaAtual);
  updateHUDFase(player.empresaAtual);
  updateHUDProgress();
  updateHUDVidas();
  gameState='fabrica';
  paused=false;
});

// ══════════════════════════════════════════
// GAME OVER
// ══════════════════════════════════════════
function showGameOver(){
  gameState='gameover';
  paused=true;
  document.getElementById('gameOver').classList.remove('hidden');
}

document.getElementById('btnReiniciarFase').addEventListener('click',function(){
  document.getElementById('gameOver').classList.add('hidden');
  player.vidas=3;
  buildFabrica(player.empresaAtual);
  updateHUDFase(player.empresaAtual);
  updateHUDProgress();
  updateHUDVidas();
  gameState='fabrica';
  paused=false;
});

document.getElementById('btnMenuGO').addEventListener('click',function(){ location.reload(); });

// ══════════════════════════════════════════
// WIN FINAL
// ══════════════════════════════════════════
function showWinFinal(){
  gameState='win';
  document.getElementById('hud').classList.add('hidden');
  document.getElementById('mobileCtrl').classList.add('hidden');
  document.getElementById('winFinal').classList.remove('hidden');
  document.getElementById('winTempo').textContent=formatTime(player.tempoTotal);
  var toolsEl=document.getElementById('winTools');
  toolsEl.innerHTML='';
  player.toolsColetadas.forEach(function(tid){
    var info=ITEM_INFO[tid]||{emoji:'📦',label:tid,cor:'#fff'};
    var d=document.createElement('div');
    d.className='win-tool';
    d.style.borderColor=info.cor;
    d.textContent=info.emoji+' '+info.label;
    toolsEl.appendChild(d);
  });
}
