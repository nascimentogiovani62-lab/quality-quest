// ═══════════════════════════════════════════
// QUALITY QUEST v2 — ENGINE
// Mundo externo, transições, física, câmera
// ═══════════════════════════════════════════

var canvas = document.getElementById('gameCanvas');
var ctx    = canvas.getContext('2d');
var W, H;
function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
resize();
window.addEventListener('resize', resize);

// ══ CONSTANTES ══
var GRAVITY    = 0.52;
var JUMP_FORCE = -13.5;
var SPEED      = 4.8;
var WORLD_W_EXT  = 7000;  // largura do mundo externo total
var FABRICA_W    = 5500;  // largura de cada fábrica

// ══ ESTADO ══
var gameState  = 'start';  // start|mundo|transicao|fabrica|dialogo|missao|popup|quiz|fasecompleta|win
var paused     = false;
var CAM_X      = 0;
var fadeAlpha  = 0;
var fadeDir    = 0;  // 0=nenhum, 1=escurecendo, -1=clareando
var fadeCallback = null;

// ══ INPUT ══
var keys = {};
var mob  = { left:false, right:false, jump:false };

// ══ PLAYER ══
var player = {
  x:120, y:0, w:32, h:48,
  vx:0, vy:0,
  onGround:false,
  dir:1,
  vidas:3,
  invencivel:0,
  beltIdx:0,
  empresaAtual:-1,   // -1 = mundo externo
  toolsColetadas:[],
  totalScore:0,
  tempoTotal:0,
};

// ══ MUNDO EXTERNO ══
var mundoPlataformas = [];
var mundoPlacas      = [];
var mundoPortas      = [];
var mundoNuvens      = [];
var mundoPajaros     = [];

// ══ FÁBRICA (interior) ══
var fabPlataformas   = [];
var fabOperadores    = [];
var fabItens         = [];
var fabElementos     = [];
var fabInimigos      = [];
var particulas       = [];

// ══ NUVENS ══
function initNuvens(){
  mundoNuvens = [];
  for(var i=0;i<14;i++){
    mundoNuvens.push({
      x: Math.random()*WORLD_W_EXT,
      y: 40 + Math.random()*(H*0.35),
      w: 80 + Math.random()*120,
      h: 30 + Math.random()*40,
      vx: 0.2 + Math.random()*0.4,
    });
  }
  mundoPajaros = [];
  for(var j=0;j<6;j++){
    mundoPajaros.push({
      x: Math.random()*WORLD_W_EXT,
      y: 60 + Math.random()*(H*0.25),
      vx: 0.8+Math.random()*0.8,
      frame:0, timer:0,
    });
  }
}

// ══════════════════════════════════════════
// CONSTRUIR MUNDO EXTERNO
// ══════════════════════════════════════════
function buildMundoExterno(){
  mundoPlataformas = [];
  mundoPlacas      = [];
  mundoPortas      = [];
  particulas       = [];
  CAM_X            = 0;

  // Chão contínuo
  mundoPlataformas.push({x:0,y:H-55,w:WORLD_W_EXT,h:55,tipo:'chao'});

  // Plataformas decorativas
  var plats = [
    {x:250,y:H-130,w:100,h:16},{x:500,y:H-180,w:80,h:16},
    {x:900,y:H-150,w:120,h:16},{x:1300,y:H-200,w:100,h:16},
    {x:1800,y:H-160,w:90,h:16},{x:2400,y:H-190,w:110,h:16},
    {x:3000,y:H-150,w:100,h:16},{x:3600,y:H-180,w:120,h:16},
    {x:4200,y:H-160,w:100,h:16},{x:4800,y:H-200,w:110,h:16},
    {x:5400,y:H-150,w:90,h:16},{x:6000,y:H-170,w:120,h:16},
  ];
  plats.forEach(function(p){ mundoPlataformas.push({x:p.x,y:p.y,w:p.w,h:p.h,tipo:'plat'}); });

  // Placas e portas por empresa
  var posicoes = [800, 2200, 3800, 5400];
  EMPRESAS.forEach(function(emp, i){
    var px = posicoes[i];

    // Placa (lida antes da porta)
    mundoPlacas.push({
      x: px - 200, y: H-55-120,
      w:180, h:100,
      empresa:emp,
      lida:false,
    });

    // Porta (fachada da fábrica)
    mundoPortas.push({
      x: px, y: H-55-180,
      w:100, h:180,
      empresa:emp,
      empresaIdx:i,
      visitada:false,
    });
  });

  initNuvens();

  // Player começa no início
  player.x=80;
  player.y=H-200;
  player.vx=player.vy=0;
  player.empresaAtual=-1;
}

// ══════════════════════════════════════════
// CONSTRUIR FÁBRICA INTERIOR
// ══════════════════════════════════════════
function buildFabrica(empIdx){
  var emp = EMPRESAS[empIdx];
  fabPlataformas = [];
  fabOperadores  = [];
  fabItens       = [];
  fabElementos   = [];
  fabInimigos    = [];
  particulas     = [];
  CAM_X          = 0;

  // Chão fábrica
  fabPlataformas.push({x:0,y:H-55,w:FABRICA_W,h:55,cor:emp.chaoColor,topo:emp.chaoTop,tipo:'chao'});

  // Plataformas (esteiras elevadas, bancadas)
  var layouts = [
    // Toyota
    [{x:300,y:H-160,w:200,h:18},{x:700,y:H-220,w:180,h:18},{x:1100,y:H-180,w:200,h:18},{x:1600,y:H-250,w:180,h:18},{x:2200,y:H-200,w:200,h:18},{x:2800,y:H-260,w:180,h:18},{x:330,y:H-310,w:80,h:14},{x:900,y:H-350,w:80,h:14},{x:1400,y:H-380,w:90,h:14}],
    // 3M
    [{x:280,y:H-155,w:200,h:18},{x:680,y:H-215,w:180,h:18},{x:1080,y:H-175,w:200,h:18},{x:1580,y:H-245,w:180,h:18},{x:2180,y:H-195,w:200,h:18},{x:2780,y:H-255,w:180,h:18},{x:360,y:H-300,w:75,h:14},{x:880,y:H-340,w:75,h:14}],
    // Bell Labs
    [{x:260,y:H-165,w:200,h:18},{x:660,y:H-225,w:180,h:18},{x:1060,y:H-185,w:200,h:18},{x:1560,y:H-255,w:180,h:18},{x:2160,y:H-205,w:200,h:18},{x:2760,y:H-265,w:180,h:18},{x:400,y:H-320,w:80,h:14},{x:900,y:H-360,w:80,h:14}],
    // Motorola
    [{x:300,y:H-170,w:200,h:18},{x:720,y:H-240,w:180,h:18},{x:1120,y:H-190,w:200,h:18},{x:1620,y:H-260,w:180,h:18},{x:2220,y:H-210,w:200,h:18},{x:2820,y:H-270,w:180,h:18},{x:450,y:H-330,w:85,h:14},{x:950,y:H-370,w:85,h:14},{x:1500,y:H-400,w:90,h:14}],
  ];
  var layout = layouts[empIdx]||layouts[0];
  layout.forEach(function(p){
    fabPlataformas.push({x:p.x,y:p.y,w:p.w,h:p.h,cor:emp.platColor,topo:emp.platTop,tipo:'plat'});
  });

  // Operadores
  emp.operadores.forEach(function(op){
    fabOperadores.push({
      x:op.x, y:H-55-52,
      w:36, h:52,
      op:op,
      estado:'idle',  // idle|acenando|dialogo|missao
      frameTimer:0, frame:0,
      missaoConcluida:false,
      itensMissao:[],
      itensMissaoColetados:0,
    });
  });

  // Itens de missão (3 por operador, espalhados)
  emp.operadores.forEach(function(op, oi){
    var info = ITEM_INFO[op.itemEnsinado]||{emoji:'📦',cor:'#fff',label:'Item'};
    for(var k=0;k<3;k++){
      fabItens.push({
        x: op.x + 400 + k*280 + (Math.random()-0.5)*80,
        y: H-55-44,
        w:36, h:40,
        operadorIdx:oi,
        itemId:op.itemEnsinado,
        info:info,
        coletado:false,
        floatOff:Math.random()*Math.PI*2,
      });
    }
  });

  // Elementos decorativos
  emp.elementos.forEach(function(el){
    fabElementos.push({x:el.x, tipo:el.tipo, label:el.label||'', velocidade:el.velocidade||1, acao:el.acao||'', frame:0, frameTimer:0});
  });

  // Inimigos (defeitos) — mais nas fases avançadas
  var numInimigos = empIdx * 2 + 2;
  for(var i=0;i<numInimigos;i++){
    fabInimigos.push({
      x:600+i*350+Math.random()*100,
      y:H-55-36,
      w:34,h:34,
      vx:(Math.random()>0.5?1:-1)*(1.2+empIdx*0.4),
      vivo:true,
      frame:0, frameTimer:0,
    });
  }

  // Porta de saída (final da fábrica)
  fabPlataformas.push({
    x:FABRICA_W-160, y:H-55-200,
    w:80, h:200,
    tipo:'porta_saida', cor:'#1a1a2e', topo:'#4b8ef0',
  });

  player.x=80;
  player.y=H-200;
  player.vx=player.vy=0;
  player.empresaAtual=empIdx;
}

// ══════════════════════════════════════════
// FADE TRANSITION
// ══════════════════════════════════════════
function fadeOut(cb){
  fadeAlpha=0; fadeDir=1; fadeCallback=cb;
}
function fadeIn(){
  fadeAlpha=1; fadeDir=-1; fadeCallback=null;
}
function updateFade(){
  if(fadeDir===0) return;
  fadeAlpha += fadeDir*0.05;
  if(fadeDir===1 && fadeAlpha>=1){
    fadeAlpha=1; fadeDir=0;
    if(fadeCallback){ var cb=fadeCallback; fadeCallback=null; cb(); }
  }
  if(fadeDir===-1 && fadeAlpha<=0){ fadeAlpha=0; fadeDir=0; }
}
function drawFade(){
  if(fadeAlpha<=0) return;
  ctx.fillStyle='rgba(0,0,0,'+fadeAlpha+')';
  ctx.fillRect(0,0,W,H);
}

// ══════════════════════════════════════════
// FÍSICA
// ══════════════════════════════════════════
function getPlats(){
  return (player.empresaAtual<0) ? mundoPlataformas : fabPlataformas;
}

function updatePlayer(){
  var left  = keys['ArrowLeft']||keys['a']||keys['A']||mob.left;
  var right = keys['ArrowRight']||keys['d']||keys['D']||mob.right;
  var jump  = keys['ArrowUp']||keys['w']||keys['W']||keys[' ']||mob.jump;

  if(left)  { player.vx=-SPEED; player.dir=-1; }
  else if(right){ player.vx=SPEED; player.dir=1; }
  else      { player.vx*=0.78; }

  if(jump&&player.onGround){
    player.vy=JUMP_FORCE;
    player.onGround=false;
    mob.jump=false;
    spawnParts(player.x+16,player.y+player.h,'#7c3aed',6,true);
  }

  player.vy+=GRAVITY;
  if(player.vy>22) player.vy=22;
  player.x+=player.vx;
  player.y+=player.vy;

  var maxW=(player.empresaAtual<0)?WORLD_W_EXT:FABRICA_W;
  if(player.x<0) player.x=0;
  if(player.x+player.w>maxW) player.x=maxW-player.w;

  // Colisão plataformas
  player.onGround=false;
  getPlats().forEach(function(p){
    if(p.tipo==='porta_saida') return;
    if(player.x+player.w>p.x && player.x<p.x+p.w){
      var bot=player.y+player.h;
      if(bot-player.vy<=p.y+2 && bot>=p.y && player.vy>=0){
        player.y=p.y-player.h;
        player.vy=0;
        player.onGround=true;
      }
    }
  });

  // Caiu
  if(player.y>H+120){
    if(player.empresaAtual>=0){ danificar(); }
    player.x=120; player.y=H-200; player.vx=player.vy=0;
  }

  if(player.invencivel>0) player.invencivel--;

  // Câmera
  var tw=player.x-W/2+player.w/2;
  var mw=(player.empresaAtual<0)?WORLD_W_EXT:FABRICA_W;
  tw=Math.max(0,Math.min(tw,mw-W));
  CAM_X+=(tw-CAM_X)*0.1;

  // Checar interações
  if(player.empresaAtual<0){
    checkMundoInteracoes();
  } else {
    checkFabricaInteracoes();
  }
}

function danificar(){
  if(player.invencivel>0) return;
  player.vidas--;
  player.invencivel=90;
  player.vy=JUMP_FORCE*0.5;
  document.getElementById('damageFlash').classList.add('show');
  setTimeout(function(){document.getElementById('damageFlash').classList.remove('show');},200);
  updateHUDVidas();
  if(player.vidas<=0) showGameOver();
}

// ══════════════════════════════════════════
// INTERAÇÕES MUNDO EXTERNO
// ══════════════════════════════════════════
function checkMundoInteracoes(){
  // Checar placas
  mundoPlacas.forEach(function(placa){
    var px=placa.x-CAM_X;
    var near=(player.x+player.w>placa.x-30 && player.x<placa.x+placa.w+30);
    if(near && !placa.lida){
      // Mostrar prompt de leitura
      showPromptMundo('E / ▲ — Ler placa');
      var interact=keys['e']||keys['E']||mob.jump;
      if(interact){
        mob.jump=false; keys['e']=false; keys['E']=false;
        placa.lida=true;
        showPlacaModal(placa.empresa);
      }
    }
  });

  // Checar portas
  mundoPortas.forEach(function(porta){
    var near=(player.x+player.w>porta.x-10 && player.x<porta.x+porta.w+10 && player.y+player.h>porta.y);
    if(near){
      showPromptMundo('E / ▲ — Entrar na '+porta.empresa.nome);
      var interact=keys['e']||keys['E']||mob.jump;
      if(interact){
        mob.jump=false; keys['e']=false; keys['E']=false;
        enterFabrica(porta.empresaIdx);
      }
    }
  });
}

function enterFabrica(empIdx){
  paused=true;
  gameState='transicao';
  var emp=EMPRESAS[empIdx];
  fadeOut(function(){
    showTransicaoTexto(emp, function(){
      buildFabrica(empIdx);
      updateHUDFase(empIdx);
      updateHUDProgress();
      updateHUDVidas();
      gameState='fabrica';
      paused=false;
      fadeIn();
      // NPC intro depois de 1s
      setTimeout(function(){ showNPCIntro(empIdx); },800);
    });
  });
}

function exitFabrica(){
  paused=true;
  gameState='transicao';
  fadeOut(function(){
    var empIdx=player.empresaAtual;
    EMPRESAS[empIdx]; // marca visitada
    mundoPortas[empIdx].visitada=true;
    player.beltIdx=Math.min(empIdx+1,BELTS.length-1);
    buildMundoExterno();
    // Reposicionar player perto da porta de saída
    var porta=mundoPortas[empIdx];
    player.x=porta.x+120;
    player.y=H-200;
    player.empresaAtual=-1;
    gameState='mundo';
    updateHUDMundo();
    fadeIn();
  });
}

// ══════════════════════════════════════════
// INTERAÇÕES FÁBRICA
// ══════════════════════════════════════════
function checkFabricaInteracoes(){
  var emp=EMPRESAS[player.empresaAtual];

  // Porta de saída
  var portaSaida=fabPlataformas.find(function(p){return p.tipo==='porta_saida';});
  if(portaSaida){
    var near=(player.x+player.w>portaSaida.x-10 && player.x<portaSaida.x+portaSaida.w+10);
    // Só sai se concluiu todas as missões
    var todasMissoes=fabOperadores.every(function(op){return op.missaoConcluida;});
    if(near && todasMissoes){
      showPromptFab('E / ▲ — Sair da fábrica');
      if(keys['e']||keys['E']||mob.jump){
        mob.jump=false;keys['e']=false;keys['E']=false;
        iniciarQuiz(player.empresaAtual);
      }
    } else if(near && !todasMissoes){
      showPromptFab('Complete todas as missões primeiro!');
    }
  }

  // Operadores
  fabOperadores.forEach(function(opObj, oi){
    var near=(player.x+player.w>opObj.x-50 && player.x<opObj.x+opObj.w+50 && Math.abs(player.y-opObj.y)<80);
    if(near){
      opObj.estado='acenando';
      if(!opObj.missaoConcluida){
        var interactPrompt = opObj.itensMissao.length===0 ? 'E / ▲ — Falar com '+opObj.op.nome : '';
        if(interactPrompt) showPromptFab(interactPrompt);
        var interact=keys['e']||keys['E']||mob.jump;
        if(interact && opObj.itensMissao.length===0){
          mob.jump=false;keys['e']=false;keys['E']=false;
          startDialogo(opObj, oi);
        }
      } else {
        showPromptFab('✅ '+opObj.op.nome+' — Missão concluída!');
      }
    } else {
      if(opObj.estado==='acenando') opObj.estado='idle';
    }
  });

  // Itens de missão
  fabItens.forEach(function(item){
    if(item.coletado) return;
    var near=(player.x+player.w>item.x && player.x<item.x+item.w &&
              player.y+player.h>item.y && player.y<item.y+item.h);
    if(near){
      item.coletado=true;
      spawnParts(item.x+18,item.y+20,item.info.cor,18,false);
      var opObj=fabOperadores[item.operadorIdx];
      if(opObj){
        opObj.itensMissaoColetados++;
        var total=fabItens.filter(function(it){return it.operadorIdx===item.operadorIdx;}).length;
        if(opObj.itensMissaoColetados>=total){
          setTimeout(function(){ finalizarMissao(opObj, item.operadorIdx); },400);
        }
      }
      updateHUDProgress();
    }
  });

  // Inimigos
  if(player.invencivel===0){
    fabInimigos.forEach(function(en){
      if(!en.vivo) return;
      if(player.x+player.w-4>en.x && player.x+4<en.x+en.w &&
         player.y+player.h>en.y && player.y+player.h<en.y+12 && player.vy>0){
        en.vivo=false; player.vy=JUMP_FORCE*0.6;
        spawnParts(en.x+17,en.y+17,'#e8455a',14,false);
      } else if(player.x+player.w-6>en.x+4 && player.x+6<en.x+en.w-4 &&
                player.y+player.h-4>en.y+4 && player.y+4<en.y+en.h){
        danificar();
      }
    });
  }
}

function startDialogo(opObj, oi){
  paused=true;
  gameState='dialogo';
  showDialogo1(opObj, function(){
    // Ativar itens de missão
    opObj.itensMissao=fabItens.filter(function(it){return it.operadorIdx===oi;});
    paused=false;
    gameState='fabrica';
    showMissaoHUD(opObj.op.missao, opObj.itensMissao.length);
  });
}

function finalizarMissao(opObj, oi){
  paused=true;
  gameState='dialogo';
  showDialogo2(opObj, function(){
    opObj.missaoConcluida=true;
    var itemId=opObj.op.itemEnsinado;
    if(player.toolsColetadas.indexOf(itemId)<0){
      player.toolsColetadas.push(itemId);
    }
    showItemBadge(itemId, function(){
      paused=false;
      gameState='fabrica';
      updateHUDProgress();
      hideMissaoHUD();
      // Checar se todas as missões foram concluídas
      var todas=fabOperadores.every(function(op){return op.missaoConcluida;});
      if(todas) showPromptFab('🏆 Todas as missões concluídas! Vá até a porta de saída →');
    });
  });
}

// ══════════════════════════════════════════
// INIMIGOS FÁBRICA
// ══════════════════════════════════════════
function updateInimigos(){
  fabInimigos.forEach(function(en){
    if(!en.vivo) return;
    en.x+=en.vx;
    if(en.x<50){en.x=50;en.vx=Math.abs(en.vx);}
    if(en.x>FABRICA_W-80){en.x=FABRICA_W-80;en.vx=-Math.abs(en.vx);}
    en.frameTimer++;
    if(en.frameTimer>10){en.frame=(en.frame+1)%2;en.frameTimer=0;}
  });
  fabElementos.forEach(function(el){
    if(el.tipo==='paleteira'){
      el.x+=el.velocidade*(el._dir||1);
      if(el.x>FABRICA_W-200){el._dir=-1;}
      if(el.x<100){el._dir=1;}
    }
    el.frameTimer=(el.frameTimer||0)+1;
    if(el.frameTimer>8){el.frame=(el.frame+1)%4;el.frameTimer=0;}
  });
}

// ══════════════════════════════════════════
// PARTÍCULAS
// ══════════════════════════════════════════
function spawnParts(x,y,cor,qtd,isJump){
  for(var i=0;i<qtd;i++){
    var a=isJump?(Math.PI+Math.random()*Math.PI):Math.random()*Math.PI*2;
    var s=isJump?Math.random()*3+1:Math.random()*5+2;
    particulas.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(isJump?0:1),cor:cor,sz:isJump?Math.random()*4+2:Math.random()*6+3,life:38,max:38});
  }
}
function updateParts(){
  particulas=particulas.filter(function(p){return p.life>0;});
  particulas.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.vy+=0.2;p.life--;});
}

// ══════════════════════════════════════════
// RENDER MUNDO EXTERNO
// ══════════════════════════════════════════
function drawMundo(){
  // Céu gradiente
  var sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#1a6fcc');
  sky.addColorStop(0.5,'#56aaee');
  sky.addColorStop(0.8,'#a8d8f0');
  sky.addColorStop(1,'#c8e8f8');
  ctx.fillStyle=sky;
  ctx.fillRect(0,0,W,H);

  // Sol
  var sx=(2000-CAM_X*0.02+W/2)%W;
  ctx.fillStyle='#fff8c0';
  ctx.beginPath();ctx.arc(sx,80,40,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,240,100,0.25)';
  ctx.beginPath();ctx.arc(sx,80,65,0,Math.PI*2);ctx.fill();

  // Nuvens
  mundoNuvens.forEach(function(nu){
    nu.x+=nu.vx;
    if(nu.x>WORLD_W_EXT) nu.x=-nu.w;
    var nx=nu.x-CAM_X*0.3;
    if(nx+nu.w<0||nx>W) return;
    ctx.fillStyle='rgba(255,255,255,0.88)';
    ctx.beginPath();ctx.ellipse(nx+nu.w/2,nu.y,nu.w/2,nu.h/2,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(nx+nu.w*0.3,nu.y+5,nu.w*0.3,nu.h*0.4,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(nx+nu.w*0.7,nu.y+3,nu.w*0.32,nu.h*0.42,0,0,Math.PI*2);ctx.fill();
  });

  // Pássaros
  mundoPajaros.forEach(function(b){
    b.x+=b.vx;
    if(b.x>WORLD_W_EXT+50) b.x=-50;
    b.timer++;
    if(b.timer>15){b.frame=(b.frame+1)%2;b.timer=0;}
    var bx=b.x-CAM_X*0.6;
    if(bx<-20||bx>W+20) return;
    ctx.strokeStyle='#1a3a6a';ctx.lineWidth=1.5;
    ctx.beginPath();
    if(b.frame===0){ctx.moveTo(bx-8,b.y);ctx.quadraticCurveTo(bx,b.y-6,bx+8,b.y);}
    else{ctx.moveTo(bx-8,b.y);ctx.quadraticCurveTo(bx,b.y+3,bx+8,b.y);}
    ctx.stroke();
  });

  // Montanhas (paralax)
  ctx.fillStyle='#2a5f8f';
  for(var m=0;m<8;m++){
    var mx=((m*700-CAM_X*0.15)%WORLD_W_EXT+WORLD_W_EXT)%WORLD_W_EXT-100;
    var mh=100+m%3*60;
    ctx.beginPath();ctx.moveTo(mx,H-55);ctx.lineTo(mx+160,H-55-mh);ctx.lineTo(mx+320,H-55);ctx.fill();
  }
  ctx.fillStyle='#3a7faf';
  for(var m=0;m<6;m++){
    var mx=((m*500-CAM_X*0.25)%WORLD_W_EXT+WORLD_W_EXT)%WORLD_W_EXT;
    var mh=60+m%2*40;
    ctx.beginPath();ctx.moveTo(mx,H-55);ctx.lineTo(mx+120,H-55-mh);ctx.lineTo(mx+240,H-55);ctx.fill();
  }

  // Grama
  ctx.fillStyle='#4a7c3f';
  ctx.fillRect(0,H-55,W,55);
  ctx.fillStyle='#5a9a4f';
  ctx.fillRect(0,H-55,W,6);

  // Árvores (decorativas)
  for(var t=0;t<20;t++){
    var tx=((t*380-CAM_X*0.8)%WORLD_W_EXT+WORLD_W_EXT)%WORLD_W_EXT-20;
    if(tx<-40||tx>W+40) continue;
    ctx.fillStyle='#3d2010';ctx.fillRect(tx+10,H-110,8,55);
    ctx.fillStyle='#2d6820';
    ctx.beginPath();ctx.arc(tx+14,H-115,22,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3d8828';
    ctx.beginPath();ctx.arc(tx+10,H-128,16,0,Math.PI*2);ctx.fill();
  }

  // Plataformas do mundo
  mundoPlataformas.forEach(function(p){
    if(p.tipo==='chao') return; // chão já desenhado
    var px=p.x-CAM_X;
    if(px+p.w<0||px>W) return;
    ctx.fillStyle='#5a4020';ctx.fillRect(px,p.y,p.w,p.h);
    ctx.fillStyle='#7a6030';ctx.fillRect(px,p.y,p.w,4);
  });

  // Placas de empresa
  mundoPlacas.forEach(function(placa){
    var px=placa.x-CAM_X;
    if(px+placa.w<-20||px>W+20) return;
    var emp=placa.empresa;
    // Poste
    ctx.fillStyle='#5a4020';ctx.fillRect(px+80,placa.y+placa.h,8,H-55-placa.y-placa.h);
    // Placa
    ctx.fillStyle='#1a1a2e';ctx.fillRect(px,placa.y,placa.w,placa.h);
    ctx.strokeStyle=emp.placa.cor;ctx.lineWidth=3;
    ctx.strokeRect(px,placa.y,placa.w,placa.h);
    // Texto
    ctx.fillStyle=emp.placa.cor;
    ctx.font='bold 10px "Press Start 2P",monospace';
    ctx.textAlign='center';
    ctx.fillText(emp.placa.titulo,px+placa.w/2,placa.y+22);
    ctx.font='7px "Press Start 2P",monospace';
    ctx.fillStyle='#aaa';
    ctx.fillText(emp.placa.sub1,px+placa.w/2,placa.y+40);
    ctx.fillText(emp.placa.sub2,px+placa.w/2,placa.y+56);
    ctx.fillStyle=emp.placa.cor;
    ctx.font='7px "Press Start 2P",monospace';
    ctx.fillText(placa.lida?'✓ LIDA':'[ E ] LER',px+placa.w/2,placa.y+76);
  });

  // Portas (fachadas)
  mundoPortas.forEach(function(porta){
    var px=porta.x-CAM_X;
    if(px+porta.w<-20||px>W+20) return;
    var emp=porta.empresa;

    // Prédio
    ctx.fillStyle=porta.visitada?'#1a2a1a':'#1a1a2e';
    ctx.fillRect(px-20,porta.y,porta.w+40,porta.h);
    ctx.strokeStyle=emp.placa.cor;
    ctx.lineWidth=4;
    ctx.strokeRect(px-20,porta.y,porta.w+40,porta.h);

    // Janelas
    ctx.fillStyle='rgba(100,200,255,0.2)';
    for(var wy=0;wy<3;wy++){
      ctx.fillRect(px-10,porta.y+20+wy*45,20,28);
      ctx.fillRect(px+porta.w-10,porta.y+20+wy*45,20,28);
    }

    // Porta central
    ctx.fillStyle=emp.placa.cor+'88';
    ctx.fillRect(px+porta.w/2-18,porta.y+porta.h-80,36,80);
    ctx.strokeStyle=emp.placa.cor;ctx.lineWidth=2;
    ctx.strokeRect(px+porta.w/2-18,porta.y+porta.h-80,36,80);

    // Nome empresa
    ctx.fillStyle='#fff';
    ctx.font='bold 7px "Press Start 2P",monospace';
    ctx.textAlign='center';
    ctx.fillText(emp.id==='belllabs'?'BELL LABS':emp.id.toUpperCase(),px+porta.w/2,porta.y+18);

    // Emoji e status
    ctx.font='18px serif';
    ctx.fillText(emp.emojiFabrica,px+porta.w/2,porta.y+48);
    if(porta.visitada){
      ctx.fillStyle='#27c97c';
      ctx.font='bold 7px "Press Start 2P",monospace';
      ctx.fillText('✓ VISITADA',px+porta.w/2,porta.y+porta.h-100);
    }
  });
}

// ══════════════════════════════════════════
// RENDER FÁBRICA INTERIOR
// ══════════════════════════════════════════
function drawFabrica(){
  var emp=EMPRESAS[player.empresaAtual];

  // Fundo
  var bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,emp.bgTop);
  bg.addColorStop(1,emp.bgBot);
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  // Grid industrial
  ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
  for(var gx=(-CAM_X%80+80)%80;gx<W;gx+=80){
    ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();
  }
  for(var gy=0;gy<H;gy+=80){
    ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();
  }

  // Elementos decorativos
  drawFabricaElementos(emp);

  // Plataformas
  fabPlataformas.forEach(function(p){
    var px=p.x-CAM_X;
    if(px+p.w<-20||px>W+20) return;
    if(p.tipo==='chao'){
      ctx.fillStyle=p.cor||emp.chaoColor;ctx.fillRect(px,p.y,p.w,p.h);
      ctx.fillStyle=p.topo||emp.chaoTop;ctx.fillRect(px,p.y,p.w,5);
      // Linhas de chão industrial
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1;
      for(var li=0;li<p.w;li+=40){ctx.beginPath();ctx.moveTo(px+li,p.y);ctx.lineTo(px+li,p.y+p.h);ctx.stroke();}
    } else if(p.tipo==='porta_saida'){
      ctx.fillStyle='#1a1a2e';ctx.fillRect(px,p.y,p.w,p.h);
      ctx.strokeStyle='#4b8ef0';ctx.lineWidth=3;ctx.strokeRect(px,p.y,p.w,p.h);
      ctx.fillStyle='rgba(75,142,240,0.3)';ctx.fillRect(px+10,p.y,p.w-20,p.h);
      ctx.fillStyle='#fff';ctx.font='bold 7px "Press Start 2P",monospace';ctx.textAlign='center';
      ctx.fillText('SAÍDA',px+p.w/2,p.y+p.h/2);
      ctx.font='18px serif';ctx.fillText('🚪',px+p.w/2,p.y+p.h*0.3);
    } else {
      ctx.fillStyle=p.cor||emp.platColor;ctx.fillRect(px,p.y,p.w,p.h);
      ctx.fillStyle=p.topo||emp.platTop;ctx.fillRect(px,p.y,p.w,4);
    }
  });

  // Itens de missão
  var now=Date.now()/1000;
  fabItens.forEach(function(item){
    if(item.coletado) return;
    var ox=item.x-CAM_X;
    if(ox<-60||ox>W+60) return;
    var fy=item.y+Math.sin(now*2.5+item.floatOff)*6;
    var grd=ctx.createRadialGradient(ox+18,fy+20,3,ox+18,fy+20,32);
    grd.addColorStop(0,item.info.cor+'55');grd.addColorStop(1,'transparent');
    ctx.fillStyle=grd;ctx.fillRect(ox-14,fy-14,64,68);
    ctx.fillStyle=item.info.cor+'30';ctx.fillRect(ox,fy,item.w,item.h);
    ctx.strokeStyle=item.info.cor;ctx.lineWidth=2.5;ctx.strokeRect(ox,fy,item.w,item.h);
    [[ox-2,fy-2],[ox+item.w-4,fy-2],[ox-2,fy+item.h-4],[ox+item.w-4,fy+item.h-4]].forEach(function(c){ctx.fillStyle=item.info.cor;ctx.fillRect(c[0],c[1],5,5);});
    ctx.font='18px serif';ctx.textAlign='center';ctx.fillText(item.info.emoji,ox+18,fy+24);
    ctx.fillStyle='#fff';ctx.font='bold 5px "Press Start 2P",monospace';ctx.fillText(item.info.label.slice(0,6),ox+18,fy+38);
    ctx.globalAlpha=0.5+Math.sin(now*4)*0.5;
    ctx.fillStyle=item.info.cor;ctx.font='12px serif';ctx.fillText('▲',ox+18,fy-10);
    ctx.globalAlpha=1;
  });

  // Operadores
  drawOperadores();

  // Inimigos
  drawInimigos();
}

function drawFabricaElementos(emp){
  fabElementos.forEach(function(el){
    var ex=el.x-CAM_X;
    if(ex<-200||ex>W+200) return;
    var now=Date.now()/1000;

    if(el.tipo==='esteira'||el.tipo==='esteira_fita'){
      // Base da esteira
      ctx.fillStyle='#333';ctx.fillRect(ex,H-130,240,30);
      // Correia animada
      ctx.strokeStyle=emp.corAcento+'80';ctx.lineWidth=3;
      var off=(now*40)%30;
      for(var si=0;si<8;si++){ctx.beginPath();ctx.moveTo(ex+(si*30-off+240)%240,H-120);ctx.lineTo(ex+(si*30-off+240)%240,H-100);ctx.stroke();}
      // Label
      ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='5px "Press Start 2P",monospace';ctx.textAlign='center';
      if(el.label)ctx.fillText(el.label,ex+120,H-138);

    } else if(el.tipo==='maquina'||el.tipo==='bancada_lab'||el.tipo==='bancada_eletro'){
      ctx.fillStyle='#2a2a3a';ctx.fillRect(ex,H-180,80,125);
      ctx.strokeStyle=emp.corAcento;ctx.lineWidth=2;ctx.strokeRect(ex,H-180,80,125);
      ctx.fillStyle=emp.corAcento+'40';
      // Luz piscante
      ctx.fillStyle=Math.sin(now*3)>0?emp.corAcento:'#333';
      ctx.beginPath();ctx.arc(ex+68,H-168,5,0,Math.PI*2);ctx.fill();
      if(el.label){ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='5px "Press Start 2P",monospace';ctx.textAlign='center';ctx.fillText(el.label.slice(0,8),ex+40,H-190);}

    } else if(el.tipo==='paleteira'){
      // Paleteira com pallet
      ctx.fillStyle='#8B4513';ctx.fillRect(ex,H-75,80,20);
      ctx.fillStyle='#A0522D';ctx.fillRect(ex,H-80,80,8);
      // Caixas no pallet
      ctx.fillStyle=emp.corAcento+'90';ctx.fillRect(ex+5,H-115,70,36);
      ctx.strokeStyle=emp.corAcento;ctx.lineWidth=1;ctx.strokeRect(ex+5,H-115,70,36);
      ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='5px "Press Start 2P",monospace';ctx.textAlign='center';
      ctx.fillText(emp.id.toUpperCase(),ex+40,H-100);
      // Rodas
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(ex+20,H-56,8,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(ex+60,H-56,8,0,Math.PI*2);ctx.fill();

    } else if(el.tipo==='kanban_board'){
      ctx.fillStyle='#1a1a2e';ctx.fillRect(ex,H-230,120,160);
      ctx.strokeStyle='#f0a832';ctx.lineWidth=2;ctx.strokeRect(ex,H-230,120,160);
      // Colunas
      ['A FAZER','FAZENDO','FEITO'].forEach(function(col,ci){
        ctx.fillStyle='rgba(240,168,50,0.15)';ctx.fillRect(ex+2+ci*39,H-225,36,148);
        ctx.fillStyle='#f0a832';ctx.font='4px "Press Start 2P",monospace';ctx.textAlign='center';ctx.fillText(col.slice(0,5),ex+20+ci*39,H-215);
        // Cartões
        for(var card=0;card<(ci+1);card++){
          ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fillRect(ex+4+ci*39,H-205+card*28,32,22);
        }
      });

    } else if(el.tipo==='grafico_cep'){
      ctx.fillStyle='#0a0a1a';ctx.fillRect(ex,H-220,140,160);
      ctx.strokeStyle='#4b8ef0';ctx.lineWidth=1.5;ctx.strokeRect(ex,H-220,140,160);
      // Linha de controle
      ctx.strokeStyle='#27c97c';ctx.lineWidth=1;ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(ex+10,H-140);ctx.lineTo(ex+130,H-140);ctx.stroke();
      ctx.setLineDash([]);
      // LCS e LCI
      ctx.strokeStyle='#e8455a';ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(ex+10,H-100);ctx.lineTo(ex+130,H-100);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ex+10,H-180);ctx.lineTo(ex+130,H-180);ctx.stroke();
      ctx.setLineDash([]);
      // Dados
      ctx.strokeStyle='#4b8ef0';ctx.lineWidth=2;
      ctx.beginPath();
      var pts=[H-145,H-138,H-142,H-130,H-148,H-125,H-138,H-90,H-135,H-140];
      pts.forEach(function(py,pi){
        if(pi===0)ctx.moveTo(ex+10+pi*13,py);
        else ctx.lineTo(ex+10+pi*13,py);
      });ctx.stroke();
      // Ponto fora
      ctx.fillStyle='#e8455a';ctx.beginPath();ctx.arc(ex+10+7*13,H-90,4,0,Math.PI*2);ctx.fill();

    } else if(el.tipo==='operador_linha'){
      // Operador de linha simples
      var oFrame=el.frame%4;
      drawOperadorSimples(ex, H-55-48, emp.chaoTop, el.acao||'idle', oFrame, 1);

    } else if(el.tipo==='microscopio'){
      ctx.fillStyle='#2a2a3a';ctx.fillRect(ex,H-195,50,140);
      ctx.fillStyle='#888';ctx.fillRect(ex+18,H-195,14,80);
      ctx.fillStyle='#555';ctx.fillRect(ex+10,H-195,30,8);
      ctx.beginPath();ctx.arc(ex+25,H-120,20,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#4b8ef0';ctx.lineWidth=1;ctx.strokeRect(ex,H-195,50,140);
      ctx.fillStyle='rgba(75,142,240,0.3)';ctx.beginPath();ctx.arc(ex+25,H-120,15,0,Math.PI*2);ctx.fill();
    }
  });
}

function drawOperadorSimples(x,y,cor,acao,frame,dir){
  // Pernas
  ctx.fillStyle='#333';
  if(frame===0||frame===2){ctx.fillRect(x+6,y+32,9,15);ctx.fillRect(x+15,y+32,9,15);}
  else if(frame===1){ctx.fillRect(x+4,y+32,9,17);ctx.fillRect(x+17,y+30,9,15);}
  else{ctx.fillRect(x+17,y+32,9,17);ctx.fillRect(x+4,y+30,9,15);}
  // Sapatos
  ctx.fillStyle=cor;ctx.fillRect(x+3,y+45,12,6);ctx.fillRect(x+15,y+45,12,6);
  // Corpo
  ctx.fillStyle='#555';ctx.fillRect(x+4,y+18,24,16);
  // Capacete
  ctx.fillStyle='#f0a832';ctx.fillRect(x+4,y,24,5);ctx.fillRect(x+2,y+3,28,4);
  // Cabeça
  ctx.fillStyle='#c4a882';ctx.fillRect(x+6,y+6,18,14);
  // Ação visual
  if(acao==='embalando'){ctx.fillStyle='#f0a832';ctx.fillRect(x+24,y+20,12,10);}
  else if(acao==='inspecionando'||acao==='inspecionando_fita'){ctx.fillStyle='#4b8ef0';ctx.fillRect(x+24,y+20,14,4);}
  else if(acao==='digitando'||acao==='anotando_dados'){ctx.fillStyle='#eee';ctx.fillRect(x+22,y+22,16,12);}
}

function drawOperadores(){
  var now=Date.now()/1000;
  fabOperadores.forEach(function(opObj){
    var ox=opObj.x-CAM_X;
    if(ox<-80||ox>W+80) return;
    opObj.frameTimer++;
    if(opObj.frameTimer>12){opObj.frame=(opObj.frame+1)%4;opObj.frameTimer=0;}

    var emp=EMPRESAS[player.empresaAtual];
    drawOperadorSimples(ox,opObj.y,emp.corAcento,opObj.op.acao,opObj.frame,1);

    // Emblema de função
    ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(ox-20,opObj.y-32,76,18);
    ctx.strokeStyle=emp.corAcento;ctx.lineWidth=1;ctx.strokeRect(ox-20,opObj.y-32,76,18);
    ctx.fillStyle=emp.corAcento;ctx.font='5px "Press Start 2P",monospace';ctx.textAlign='center';
    ctx.fillText(opObj.op.nome,ox+18,opObj.y-20);

    // Acenando
    if(opObj.estado==='acenando' && !opObj.missaoConcluida){
      ctx.fillStyle='rgba(0,0,0,0.8)';ctx.fillRect(ox+5,opObj.y-60,60,24);
      ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.strokeRect(ox+5,opObj.y-60,60,24);
      ctx.fillStyle='#fff';ctx.font='5px "Press Start 2P",monospace';ctx.textAlign='center';
      var promptTxt=opObj.itensMissao.length===0?'[ E ] FALAR':'COLETE OS ITENS!';
      ctx.fillText(promptTxt,ox+35,opObj.y-44);
      // Seta apontando
      ctx.fillStyle='#f0a832';ctx.font='14px serif';ctx.fillText('▼',ox+18,opObj.y-8);
    }

    // Concluída
    if(opObj.missaoConcluida){
      ctx.fillStyle='rgba(39,201,124,0.9)';ctx.beginPath();ctx.arc(ox+28,opObj.y-12,8,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='10px serif';ctx.textAlign='center';ctx.fillText('✓',ox+28,opObj.y-8);
    }
  });
}

function drawInimigos(){
  var now=Date.now()/1000;
  fabInimigos.forEach(function(en){
    if(!en.vivo) return;
    var ex=en.x-CAM_X;
    if(ex<-60||ex>W+60) return;
    var bounce=Math.abs(Math.sin(now*4))*3;
    ctx.fillStyle='rgba(232,69,90,.85)';ctx.fillRect(ex,en.y-bounce,en.w,en.h);
    ctx.strokeStyle='#ff6070';ctx.lineWidth=2;ctx.strokeRect(ex,en.y-bounce,en.w,en.h);
    ctx.font='16px serif';ctx.textAlign='center';ctx.fillText('⚠️',ex+en.w/2,en.y-bounce+en.h*0.62);
    ctx.fillStyle='#fff';ctx.font='bold 4px "Press Start 2P",monospace';ctx.fillText('DEFEITO',ex+en.w/2,en.y-bounce+en.h-4);
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(ex+4,en.y+en.h-2,en.w-8,5);
  });
}

// ══════════════════════════════════════════
// PLAYER RENDER
// ══════════════════════════════════════════
function drawPlayer(){
  var px=player.x-CAM_X;
  var py=player.y;
  if(player.invencivel>0&&Math.floor(player.invencivel/6)%2===0) return;
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(px+4,py+player.h-3,player.w-8,5);
  var la=player.onGround?Math.floor(Date.now()/110)%4:2;
  ctx.fillStyle='#3d1f7a';
  if(la===0||la===2){ctx.fillRect(px+6,py+32,10,16);ctx.fillRect(px+16,py+32,10,16);}
  else if(la===1){ctx.fillRect(px+4,py+32,10,18);ctx.fillRect(px+18,py+30,10,16);}
  else{ctx.fillRect(px+18,py+32,10,18);ctx.fillRect(px+4,py+30,10,16);}
  ctx.fillStyle='#27c97c';
  if(la===0||la===2){ctx.fillRect(px+3,py+46,13,6);ctx.fillRect(px+14,py+46,13,6);}
  else if(la===1){ctx.fillRect(px+1,py+48,14,6);ctx.fillRect(px+16,py+44,12,6);}
  else{ctx.fillRect(px+15,py+48,14,6);ctx.fillRect(px+1,py+44,12,6);}
  ctx.fillStyle='#7c3aed';ctx.fillRect(px+4,py+18,24,18);
  ctx.fillStyle='#fff';ctx.fillRect(px+7,py+22,16,8);
  ctx.fillStyle='#3d1f7a';ctx.font='bold 5px "Press Start 2P"';ctx.textAlign='left';ctx.fillText('SSAP',px+8,py+29);
  ctx.fillStyle='#7c3aed';
  if(player.dir===1){ctx.fillRect(px+27,py+19,8,13);ctx.fillRect(px-3,py+21,8,11);}
  else{ctx.fillRect(px-3,py+19,8,13);ctx.fillRect(px+27,py+21,8,11);}
  ctx.fillStyle='#c4a882';ctx.fillRect(px+6,py+2,20,18);
  ctx.fillStyle='#1a0840';
  if(player.dir===1){ctx.fillRect(px+18,py+8,4,4);ctx.fillRect(px+22,py+8,2,4);}
  else{ctx.fillRect(px+8,py+8,4,4);ctx.fillRect(px+6,py+8,2,4);}
  ctx.fillStyle='#1a1040';ctx.fillRect(px+6,py+2,20,5);ctx.fillRect(px+4,py+4,4,8);
  var beltCores=['#d6d3c8','#f0a832','#27c97c','#a78bfa','#c084fc'];
  ctx.fillStyle=beltCores[player.beltIdx]||'#f0a832';
  ctx.fillRect(px+4,py,24,5);ctx.fillRect(px+2,py+3,28,4);
}

function drawParticulas(){
  particulas.forEach(function(p){
    ctx.globalAlpha=p.life/p.max;
    ctx.fillStyle=p.cor;
    ctx.fillRect(p.x-CAM_X,p.y,p.sz,p.sz);
    ctx.globalAlpha=1;
  });
}

// ══════════════════════════════════════════
// PROMPT FLUTUANTE NO CANVAS
// ══════════════════════════════════════════
var promptMundoTxt='';
var promptFabTxt='';
function showPromptMundo(txt){ promptMundoTxt=txt; }
function showPromptFab(txt){ promptFabTxt=txt; }
function clearPrompts(){ promptMundoTxt=''; promptFabTxt=''; }

function drawPrompt(txt){
  if(!txt) return;
  var px=player.x-CAM_X+16;
  var py=player.y-24;
  ctx.fillStyle='rgba(0,0,0,0.82)';ctx.fillRect(px-60,py-16,120,20);
  ctx.strokeStyle='#f0a832';ctx.lineWidth=1;ctx.strokeRect(px-60,py-16,120,20);
  ctx.fillStyle='#f0a832';ctx.font='5px "Press Start 2P",monospace';ctx.textAlign='center';
  ctx.fillText(txt.slice(0,22),px,py-2);
}

// ══════════════════════════════════════════
// GAME LOOP
// ══════════════════════════════════════════
var rafId=null;
function gameLoop(){
  rafId=requestAnimationFrame(gameLoop);
  clearPrompts();

  if(!paused && (gameState==='mundo'||gameState==='fabrica')){
    updatePlayer();
    if(gameState==='fabrica'){
      updateInimigos();
    }
  }
  updateParts();
  updateFade();

  if(gameState==='mundo'||gameState==='transicao'){
    drawMundo();
  } else if(gameState==='fabrica'||gameState==='dialogo'||gameState==='popup'){
    drawFabrica();
  }

  if(gameState!=='start'){
    drawParticulas();
    drawPlayer();
    if(gameState==='mundo') drawPrompt(promptMundoTxt);
    if(gameState==='fabrica') drawPrompt(promptFabTxt);
    drawFade();
  }
}

function startGame(){
  buildMundoExterno();
  gameState='mundo';
  if(rafId) cancelAnimationFrame(rafId);
  gameLoop();
}
