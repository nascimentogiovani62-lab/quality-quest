// ═══════════════════════════════════════════
// QUALITY QUEST — UI
// HUD, popups, quiz, telas de fase
// ═══════════════════════════════════════════

// ════════════════════════════════════════
// HUD
// ════════════════════════════════════════
function updateHUDProgress(){
  var fase = FASES[player.faseAtual];
  document.getElementById('hudScore').textContent = 'ITENS: '+player.coletados+'/'+fase.itens.length;

  var timer = document.getElementById('hudTimer');
  var secs = Math.floor((Date.now()-faseStartTime)/1000);
  timer.textContent = formatTime(secs);

  var prog = document.getElementById('hudProgress');
  prog.innerHTML='';
  fase.itens.forEach(function(item){
    var dot = document.createElement('div');
    dot.className='prog-dot'+(coletados[item.id]?' done':'');
    dot.style.borderColor = item.cor;
    if(coletados[item.id]) dot.style.background = item.cor;
    prog.appendChild(dot);
  });
}

function updateHUDVidas(){
  var v='';
  for(var i=0;i<3;i++) v += (i<player.vidas)?'❤️':'🖤';
  document.getElementById('hudVidas').textContent=v;
}

function updateHUDFase(){
  var fase=FASES[player.faseAtual];
  document.getElementById('hudFase').textContent=fase.nome;
  var belt=BELTS[player.beltAtual]||BELTS[0];
  var beltEl=document.getElementById('hudBelt');
  beltEl.textContent=belt.emoji+' '+belt.label;
  beltEl.style.color=belt.cor;
}

function formatTime(s){
  var m=Math.floor(s/60), sec=s%60;
  return (m>0?m+'m ':'')+sec+'s';
}

// Timer no HUD
setInterval(function(){
  if(gameState==='playing'&&!paused){
    var secs=Math.floor((Date.now()-faseStartTime)/1000);
    document.getElementById('hudTimer').textContent=formatTime(secs);
  }
},500);

// ════════════════════════════════════════
// NPC DIALOG
// ════════════════════════════════════════
function showNPCDialog(faseIdx){
  var fase=FASES[faseIdx];
  var box=document.getElementById('npcBox');
  document.getElementById('npcEmoji').textContent=fase.npc.emoji;
  document.getElementById('npcNome').textContent=fase.npc.nome;
  document.getElementById('npcFala').textContent=fase.npc.fala;
  box.classList.remove('hidden');
  paused=true;
}

document.getElementById('npcBtnOk').addEventListener('click',function(){
  document.getElementById('npcBox').classList.add('hidden');
  paused=false;
});

// ════════════════════════════════════════
// POPUP ITEM
// ════════════════════════════════════════
function showItemPopup(item){
  paused=true;
  gameState='popup';
  var fase=FASES[player.faseAtual];

  document.getElementById('popupHeader').style.background=item.cor;
  document.getElementById('popupEmoji').textContent=item.emoji;
  document.getElementById('popupTitleTxt').textContent='COLETADO!';
  document.getElementById('popupEmpresa').textContent=item.empresa;
  document.getElementById('popupItemName').textContent=item.nome;
  document.getElementById('popupDesc').textContent=item.texto;

  // Fases
  var fasesEl=document.getElementById('popupFases');
  fasesEl.innerHTML='';
  (item.fases||[]).forEach(function(f){
    var d=document.createElement('div');
    d.className='popup-fase-item';
    d.textContent=f;
    fasesEl.appendChild(d);
  });

  var fEl=document.getElementById('popupFormula');
  if(item.formula){fEl.style.display='block';fEl.textContent=item.formula;}
  else fEl.style.display='none';

  document.getElementById('popupDica').textContent='► '+item.dica;
  document.getElementById('popup').classList.remove('hidden');

  // Checar se completou a fase
  var allDone = FASES[player.faseAtual].itens.every(function(it){ return coletados[it.id]; });
  document.getElementById('popupBtn').textContent = allDone ? '► VER RESULTADO DA FASE ◄' : '► CONTINUAR ◄';
}

document.getElementById('popupBtn').addEventListener('click',function(){
  document.getElementById('popup').classList.add('hidden');
  var allDone=FASES[player.faseAtual].itens.every(function(it){ return coletados[it.id]; });
  if(allDone){
    startQuiz();
  } else {
    paused=false;
    gameState='playing';
  }
});

// ════════════════════════════════════════
// QUIZ
// ════════════════════════════════════════
var quizIdx=0;
var quizRespondida=false;
var quizCorretas=0;

function startQuiz(){
  quizIdx=0;
  quizCorretas=0;
  quizRespondida=false;
  gameState='quiz';
  showQuizPergunta();
  document.getElementById('quizScreen').classList.remove('hidden');
}

function showQuizPergunta(){
  var fase=FASES[player.faseAtual];
  var q=fase.quiz[quizIdx];
  quizRespondida=false;

  document.getElementById('quizNum').textContent=(quizIdx+1)+'/'+fase.quiz.length;
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
    btn.addEventListener('click',function(){ responderQuiz(i,q.correta,q.explicacao); });
    ops.appendChild(btn);
  });
}

function responderQuiz(escolha, correta, explicacao){
  if(quizRespondida) return;
  quizRespondida=true;
  var btns=document.querySelectorAll('.quiz-opcao');
  btns.forEach(function(b,i){
    b.classList.add(i===correta?'correta':'errada');
  });
  if(escolha===correta) quizCorretas++;
  document.getElementById('quizExplicacao').classList.add('show');
  document.getElementById('quizNext').classList.add('show');
}

document.getElementById('quizNext').addEventListener('click',function(){
  quizIdx++;
  var fase=FASES[player.faseAtual];
  if(quizIdx < fase.quiz.length){
    showQuizPergunta();
  } else {
    document.getElementById('quizScreen').classList.add('hidden');
    showFaseCompleta();
  }
});

// ════════════════════════════════════════
// FASE COMPLETA
// ════════════════════════════════════════
function showFaseCompleta(){
  gameState='fasecompleta';
  var faseIdx=player.faseAtual;
  var fase=FASES[faseIdx];
  var secs=Math.floor((Date.now()-faseStartTime)/1000);
  var belt=BELTS[faseIdx+1]||BELTS[BELTS.length-1];

  // Atualizar belt
  player.beltAtual=Math.min(faseIdx+1, BELTS.length-1);
  player.tempoTotal+=secs;

  document.getElementById('faseCompletaTitulo').textContent='FASE '+(faseIdx+1)+' CONCLUÍDA!';
  document.getElementById('faseCompletaNome').textContent=fase.nome;

  document.getElementById('faseBeltEmoji').textContent=belt.emoji;
  document.getElementById('faseBeltLabel').textContent=belt.label+' DESBLOQUEADO!';
  document.getElementById('faseBeltLabel').style.color=belt.cor;

  var stars='';
  if(quizCorretas===3) stars='⭐⭐⭐ PERFEITO!';
  else if(quizCorretas===2) stars='⭐⭐ BOM!';
  else stars='⭐ PODE MELHORAR';

  document.getElementById('faseStats').innerHTML=
    '► ITENS: '+fase.itens.length+'/'+fase.itens.length+'\n'+
    '► TEMPO: '+formatTime(secs)+'\n'+
    '► QUIZ:  '+quizCorretas+'/'+fase.quiz.length+' '+stars+'\n'+
    '► VIDAS: '+player.vidas+'/3';

  var hasNext=faseIdx+1 < FASES.length;
  var btnNext=document.getElementById('btnProximaFase');
  btnNext.textContent=hasNext?'► PRÓXIMA FASE ◄':'► TELA FINAL ◄';

  document.getElementById('faseCompleta').classList.remove('hidden');
}

document.getElementById('btnProximaFase').addEventListener('click',function(){
  document.getElementById('faseCompleta').classList.add('hidden');
  var nextIdx=player.faseAtual+1;
  if(nextIdx < FASES.length){
    player.faseAtual=nextIdx;
    player.vidas=3;
    buildWorld(nextIdx);
    updateHUDFase();
    updateHUDProgress();
    updateHUDVidas();
    gameState='playing';
    paused=true;
    setTimeout(function(){ showNPCDialog(nextIdx); },400);
  } else {
    showWinFinal();
  }
});

document.getElementById('btnReplayFase').addEventListener('click',function(){
  document.getElementById('faseCompleta').classList.add('hidden');
  player.vidas=3;
  buildWorld(player.faseAtual);
  updateHUDFase();
  updateHUDProgress();
  updateHUDVidas();
  gameState='playing';
  paused=false;
});

// ════════════════════════════════════════
// GAME OVER
// ════════════════════════════════════════
function showGameOver(){
  gameState='gameover';
  paused=true;
  document.getElementById('gameOver').classList.remove('hidden');
}

document.getElementById('btnReiniciarFase').addEventListener('click',function(){
  document.getElementById('gameOver').classList.add('hidden');
  player.vidas=3;
  buildWorld(player.faseAtual);
  updateHUDFase();
  updateHUDProgress();
  updateHUDVidas();
  gameState='playing';
  paused=false;
});

document.getElementById('btnMenuGO').addEventListener('click',function(){
  location.reload();
});

// ════════════════════════════════════════
// WIN FINAL
// ════════════════════════════════════════
function showWinFinal(){
  gameState='win';
  document.getElementById('hud').classList.add('hidden');
  document.getElementById('mobileCtrl').classList.add('hidden');

  var totalItens=FASES.reduce(function(s,f){return s+f.itens.length;},0);
  var totalQuiz=FASES.reduce(function(s,f){return s+f.quiz.length;},0);

  document.getElementById('winTotalItens').textContent=totalItens+'/'+totalItens;
  document.getElementById('winTotalTempo').textContent=formatTime(player.tempoTotal);

  var itemsGrid=document.getElementById('winItemsGrid');
  itemsGrid.innerHTML='';
  FASES.forEach(function(fase){
    fase.itens.forEach(function(item){
      var d=document.createElement('div');
      d.className='win-item';
      d.textContent=item.emoji+' '+item.label;
      itemsGrid.appendChild(d);
    });
  });

  document.getElementById('winFinal').classList.remove('hidden');
}
