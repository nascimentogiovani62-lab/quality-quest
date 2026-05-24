// ═══════════════════════════════════════════
// QUALITY QUEST — ENGINE
// Física, render, câmera, partículas
// ═══════════════════════════════════════════

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var W, H;
function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// ══ CONSTANTES ══
var GRAVITY   = 0.52;
var JUMP_FORCE= -13.5;
var SPEED     = 4.8;
var WORLD_W   = 5000;

// ══ ESTADO ══
var CAM_X = 0;
var gameState = 'start'; // start | playing | popup | quiz | fasecompleta | gameover | win
var paused    = false;

// ══ INPUT ══
var keys = {};
var mob  = {left:false, right:false, jump:false};

// ══ PLAYER ══
var player = {
  x:100, y:0, w:32, h:48,
  vx:0, vy:0,
  onGround:false,
  dir:1,
  vidas:3,
  invencivel:0,
  coletados:0,
  faseAtual:0,
  beltAtual:0,
  acertosQuiz:0,
  tempoFase:0,
  tempoTotal:0,
};

// ══ OBJETOS MUNDO ══
var plataformas = [];
var itensObj    = [];
var inimigosObj = [];
var particulas  = [];
var coletados   = {};

// ══ TIMER ══
var faseStartTime = 0;
var quizCorretas  = 0;

// ════════════════════════════════════════
// CONSTRUIR MUNDO POR FASE
// ════════════════════════════════════════
function buildWorld(faseIdx){
  var fase = FASES[faseIdx];
  plataformas  = [];
  itensObj     = [];
  inimigosObj  = [];
  particulas   = [];
  coletados    = {};
  CAM_X        = 0;
  player.coletados = 0;
  player.invencivel = 0;

  // Chão
  plataformas.push({
    x:0, y:H-58, w:WORLD_W, h:58,
    cor:fase.chaoColor, topo:fase.chaoTop,
    solida:true, decorativa:false
  });

  // Layout de plataformas por fase (fixo + único por fase)
  var layouts = [
    // Fase 1 — Escritório
    [
      {x:180,  y:H-150, w:150, h:18},
      {x:440,  y:H-220, w:140, h:18},
      {x:720,  y:H-170, w:150, h:18},
      {x:1000, y:H-250, w:160, h:18},
      {x:1300, y:H-200, w:150, h:18},
      {x:1580, y:H-280, w:170, h:18},
      {x:1880, y:H-220, w:150, h:18},
      {x:2180, y:H-300, w:180, h:18},
      // decorativas
      {x:320,  y:H-310, w:90,  h:14},
      {x:600,  y:H-340, w:90,  h:14},
      {x:860,  y:H-360, w:100, h:14},
      {x:1150, y:H-380, w:90,  h:14},
      {x:1450, y:H-370, w:90,  h:14},
    ],
    // Fase 2 — Toyota
    [
      {x:200,  y:H-160, w:160, h:18},
      {x:480,  y:H-240, w:150, h:18},
      {x:760,  y:H-190, w:160, h:18},
      {x:1060, y:H-270, w:170, h:18},
      {x:1360, y:H-210, w:160, h:18},
      {x:1660, y:H-290, w:170, h:18},
      {x:1960, y:H-230, w:160, h:18},
      {x:2260, y:H-310, w:180, h:18},
      {x:330,  y:H-330, w:80,  h:14},
      {x:620,  y:H-360, w:80,  h:14},
      {x:900,  y:H-390, w:90,  h:14},
    ],
    // Fase 3 — 3M
    [
      {x:220,  y:H-170, w:150, h:18},
      {x:500,  y:H-250, w:150, h:18},
      {x:790,  y:H-200, w:160, h:18},
      {x:1080, y:H-280, w:170, h:18},
      {x:1380, y:H-220, w:160, h:18},
      {x:1680, y:H-300, w:170, h:18},
      {x:1980, y:H-240, w:160, h:18},
      {x:2280, y:H-320, w:180, h:18},
      {x:360,  y:H-350, w:85,  h:14},
      {x:640,  y:H-380, w:85,  h:14},
    ],
    // Fase 4 — Motorola
    [
      {x:240,  y:H-180, w:160, h:18},
      {x:520,  y:H-260, w:150, h:18},
      {x:820,  y:H-210, w:160, h:18},
      {x:1120, y:H-290, w:170, h:18},
      {x:1420, y:H-230, w:160, h:18},
      {x:1720, y:H-310, w:170, h:18},
      {x:2020, y:H-250, w:160, h:18},
      {x:2320, y:H-330, w:180, h:18},
      {x:400,  y:H-370, w:85,  h:14},
      {x:680,  y:H-400, w:85,  h:14},
      {x:960,  y:H-430, w:90,  h:14},
    ],
  ];

  var layout = layouts[faseIdx] || layouts[0];
  layout.forEach(function(p){
    plataformas.push({x:p.x, y:p.y, w:p.w, h:p.h, cor:fase.platColor, topo:fase.platTop, solida:true});
  });

  // Itens nas 8 primeiras plataformas (as maiores)
  var mainPlats = layout.slice(0, fase.itens.length);
  fase.itens.forEach(function(item, i){
    var p = mainPlats[i];
    itensObj.push({
      x: p.x + p.w/2 - 20,
      y: p.y - 52,
      w:40, h:48,
      item:item,
      coletado:false,
      floatOff: Math.random()*Math.PI*2,
    });
  });

  // Inimigos (Fases 2+)
  if(fase.inimigos && fase.inimigos.length > 0){
    var numInimigos = 4 + faseIdx * 2;
    for(var i=0;i<numInimigos;i++){
      var tipo = fase.inimigos[i % fase.inimigos.length];
      inimigosObj.push({
        x: 600 + i * 320 + Math.random()*100,
        y: H - 58 - 36,
        w:36, h:36,
        vx: (Math.random()>0.5?1:-1) * tipo.velocidade,
        tipo: tipo,
        vivo: true,
        frame:0, frameTimer:0,
      });
    }
  }

  // Posição inicial do player
  player.x = 80;
  player.y = H - 200;
  player.vx = 0;
  player.vy = 0;
  faseStartTime = Date.now();
}

// ════════════════════════════════════════
// FÍSICA
// ════════════════════════════════════════
function updatePlayer(){
  var left  = keys['ArrowLeft']||keys['a']||keys['A']||mob.left;
  var right = keys['ArrowRight']||keys['d']||keys['D']||mob.right;
  var jump  = keys['ArrowUp']||keys['w']||keys['W']||keys[' ']||mob.jump;

  if(left)  { player.vx = -SPEED; player.dir = -1; }
  else if(right){ player.vx = SPEED; player.dir = 1; }
  else      { player.vx *= 0.78; }

  if(jump && player.onGround){
    player.vy = JUMP_FORCE;
    player.onGround = false;
    mob.jump = false;
    spawnParticulas(player.x+16, player.y+player.h, '#7c3aed', 6, true);
  }

  player.vy += GRAVITY;
  if(player.vy > 22) player.vy = 22;
  player.x += player.vx;
  player.y += player.vy;

  // Limites do mundo
  if(player.x < 0) player.x = 0;
  if(player.x + player.w > WORLD_W) player.x = WORLD_W - player.w;

  // Colisão com plataformas
  player.onGround = false;
  plataformas.forEach(function(p){
    if(!p.solida) return;
    var px = player, py = player;
    if(player.x + player.w > p.x && player.x < p.x + p.w){
      var bot = player.y + player.h;
      var prevBot = bot - player.vy;
      if(prevBot <= p.y + 2 && bot >= p.y && player.vy >= 0){
        player.y = p.y - player.h;
        player.vy = 0;
        player.onGround = true;
      }
    }
  });

  // Caiu do mundo
  if(player.y > H + 150){
    danificarPlayer();
    player.x = 80;
    player.y = H - 200;
    player.vx = player.vy = 0;
  }

  // Câmera suave
  var targetCam = player.x - W/2 + player.w/2;
  targetCam = Math.max(0, Math.min(targetCam, WORLD_W - W));
  CAM_X += (targetCam - CAM_X) * 0.1;

  // Invencibilidade
  if(player.invencivel > 0) player.invencivel--;

  // Coleta itens
  itensObj.forEach(function(obj){
    if(obj.coletado) return;
    if(player.x+player.w > obj.x && player.x < obj.x+obj.w &&
       player.y+player.h > obj.y && player.y < obj.y+obj.h){
      obj.coletado = true;
      coletados[obj.item.id] = true;
      player.coletados++;
      spawnParticulas(obj.x+20, obj.y+24, obj.item.cor, 22, false);
      updateHUDProgress();
      showItemPopup(obj.item);
    }
  });

  // Colisão inimigos
  if(player.invencivel === 0){
    inimigosObj.forEach(function(en){
      if(!en.vivo) return;
      // Player pula em cima do inimigo
      if(player.x+player.w-4 > en.x && player.x+4 < en.x+en.w &&
         player.y+player.h > en.y && player.y+player.h < en.y+16 && player.vy > 0){
        en.vivo = false;
        player.vy = JUMP_FORCE * 0.6;
        spawnParticulas(en.x+18, en.y+18, '#e8455a', 16, false);
      }
      // Inimigo acerta player
      else if(player.x+player.w-6 > en.x+4 && player.x+6 < en.x+en.w-4 &&
              player.y+player.h-4 > en.y+4 && player.y+4 < en.y+en.h){
        danificarPlayer();
      }
    });
  }
}

function danificarPlayer(){
  if(player.invencivel > 0) return;
  player.vidas--;
  player.invencivel = 90;
  player.vy = JUMP_FORCE * 0.5;
  document.getElementById('damageFlash').classList.add('show');
  setTimeout(function(){ document.getElementById('damageFlash').classList.remove('show'); }, 180);
  updateHUDVidas();
  if(player.vidas <= 0) showGameOver();
}

function updateInimigos(){
  inimigosObj.forEach(function(en){
    if(!en.vivo) return;
    en.x += en.vx;
    // Limites
    if(en.x < 50){ en.x=50; en.vx=Math.abs(en.vx); }
    if(en.x > WORLD_W-100){ en.x=WORLD_W-100; en.vx=-Math.abs(en.vx); }
    // Virar na borda das plataformas (chão)
    var naPlat = false;
    plataformas.forEach(function(p){
      if(p.h < 30) return;
      if(en.x + en.w > p.x && en.x < p.x+p.w && en.y+en.h >= p.y && en.y+en.h <= p.y+p.h+4){
        naPlat = true;
      }
    });
    if(!naPlat) en.vx *= -1;
    // Frame
    en.frameTimer++;
    if(en.frameTimer > 10){ en.frame = (en.frame+1)%2; en.frameTimer=0; }
  });
}

// ════════════════════════════════════════
// PARTÍCULAS
// ════════════════════════════════════════
function spawnParticulas(x, y, cor, qtd, isJump){
  for(var i=0;i<qtd;i++){
    var angle = isJump ? (Math.PI + Math.random()*Math.PI) : Math.random()*Math.PI*2;
    var spd   = isJump ? Math.random()*3+1 : Math.random()*5+2;
    particulas.push({
      x:x, y:y,
      vx:Math.cos(angle)*spd,
      vy:Math.sin(angle)*spd - (isJump?0:1),
      cor:cor,
      size: isJump ? Math.random()*4+2 : Math.random()*6+3,
      life:35, max:35
    });
  }
}

function updateParticulas(){
  particulas = particulas.filter(function(p){ return p.life>0; });
  particulas.forEach(function(p){
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.18; p.life--;
  });
}

// ════════════════════════════════════════
// RENDER
// ════════════════════════════════════════
function drawBg(fase){
  var grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0, fase.bgTop);
  grad.addColorStop(1, fase.bgBot);
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  // Estrelas
  ctx.fillStyle = 'rgba(255,255,255,.45)';
  for(var i=0;i<50;i++){
    var sx = ((i*137 + CAM_X*0.04) % W + W) % W;
    var sy = (i*79) % (H*0.55);
    ctx.beginPath();
    ctx.arc(sx,sy, i%4===0?1.4:0.7, 0, Math.PI*2);
    ctx.fill();
  }

  // Elementos decorativos de fundo por fase
  drawFaseBg(fase);

  // Grid sutil
  ctx.strokeStyle = 'rgba(124,58,237,0.06)';
  ctx.lineWidth = 1;
  var g = 100;
  for(var gx=(-CAM_X%g+g)%g;gx<W;gx+=g){
    ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();
  }
}

function drawFaseBg(fase){
  var cx = -CAM_X * 0.15;
  if(fase.id==='escritorio'){
    // Janelas de escritório
    ctx.fillStyle = 'rgba(75,142,240,0.08)';
    for(var i=0;i<8;i++){
      var wx = ((i*400+cx)%W+W)%W;
      ctx.fillRect(wx, H*0.15, 80, 120);
      ctx.strokeStyle='rgba(75,142,240,0.15)';
      ctx.lineWidth=1;
      ctx.strokeRect(wx,H*0.15,80,120);
      ctx.beginPath();ctx.moveTo(wx+40,H*0.15);ctx.lineTo(wx+40,H*0.15+120);ctx.stroke();
      ctx.beginPath();ctx.moveTo(wx,H*0.15+60);ctx.lineTo(wx+80,H*0.15+60);ctx.stroke();
    }
  } else if(fase.id==='toyota'){
    // Esteiras
    ctx.strokeStyle='rgba(90,152,80,0.2)';
    ctx.lineWidth=3;
    for(var i=0;i<5;i++){
      var ex=((i*600+cx*2)%WORLD_W-CAM_X+WORLD_W)%W;
      ctx.beginPath();ctx.moveTo(ex,H-58);ctx.lineTo(ex+200,H-58);ctx.stroke();
    }
  } else if(fase.id==='3m'){
    // Tubos de laboratório
    ctx.strokeStyle='rgba(64,96,208,0.15)';
    ctx.lineWidth=4;
    for(var i=0;i<6;i++){
      var tx=((i*380+cx)%W+W)%W;
      ctx.beginPath();ctx.moveTo(tx,H*0.1);ctx.lineTo(tx,H*0.7);ctx.stroke();
    }
  } else if(fase.id==='motorola'){
    // Servidores (retângulos vermelhos)
    ctx.fillStyle='rgba(138,48,48,0.1)';
    for(var i=0;i<5;i++){
      var sx=((i*420+cx)%W+W)%W;
      ctx.fillRect(sx,H*0.1,60,H*0.6);
      ctx.strokeStyle='rgba(192,64,64,0.15)';
      ctx.lineWidth=1;
      ctx.strokeRect(sx,H*0.1,60,H*0.6);
    }
  }
}

function drawPlataformas(){
  plataformas.forEach(function(p){
    var px = p.x - CAM_X;
    if(px+p.w<-20||px>W+20) return;
    ctx.fillStyle = p.cor;
    ctx.fillRect(px, p.y, p.w, p.h);
    ctx.fillStyle = p.topo;
    ctx.fillRect(px, p.y, p.w, 4);
    if(p.h > 30){
      ctx.fillStyle='rgba(255,255,255,0.04)';
      for(var ri=0;ri<p.w;ri+=18) ctx.fillRect(px+ri,p.y+8,9,9);
    }
  });
}

function drawItens(){
  var now = Date.now()/1000;
  itensObj.forEach(function(obj){
    if(obj.coletado) return;
    var ox = obj.x - CAM_X;
    if(ox<-80||ox>W+80) return;
    var fy = obj.y + Math.sin(now*2+obj.floatOff)*5;

    // Glow aura
    var grd=ctx.createRadialGradient(ox+20,fy+24,4,ox+20,fy+24,40);
    grd.addColorStop(0,obj.item.cor+'50');
    grd.addColorStop(1,'transparent');
    ctx.fillStyle=grd;
    ctx.fillRect(ox-20,fy-16,80,88);

    // Caixa
    ctx.fillStyle=obj.item.cor+'30';
    ctx.fillRect(ox,fy,obj.w,obj.h);
    ctx.strokeStyle=obj.item.cor;
    ctx.lineWidth=3;
    ctx.strokeRect(ox,fy,obj.w,obj.h);

    // Cantos pixel
    ctx.fillStyle=obj.item.cor;
    [[ox-2,fy-2],[ox+obj.w-4,fy-2],[ox-2,fy+obj.h-4],[ox+obj.w-4,fy+obj.h-4]].forEach(function(c){
      ctx.fillRect(c[0],c[1],6,6);
    });

    // Emoji + label
    ctx.font='22px serif';
    ctx.textAlign='center';
    ctx.fillText(obj.item.emoji,ox+20,fy+26);
    ctx.fillStyle='#fff';
    ctx.font='bold 6px "Press Start 2P",monospace';
    var lbl=obj.item.label.length>7?obj.item.label.slice(0,6)+'..':obj.item.label;
    ctx.fillText(lbl,ox+20,fy+42);

    // Seta piscante
    ctx.fillStyle=obj.item.cor;
    ctx.globalAlpha=0.5+Math.sin(now*4)*0.5;
    ctx.font='14px serif';
    ctx.fillText('▲',ox+20,fy-10);
    ctx.globalAlpha=1;
  });
}

function drawInimigos(){
  inimigosObj.forEach(function(en){
    if(!en.vivo) return;
    var ex = en.x - CAM_X;
    if(ex<-60||ex>W+60) return;
    var bounce = Math.abs(Math.sin(Date.now()/200))*4;
    // Sombra
    ctx.fillStyle='rgba(0,0,0,.25)';
    ctx.fillRect(ex+4,en.y+en.h-2,en.w-8,6);
    // Corpo
    ctx.fillStyle=en.frame===0?'rgba(232,69,90,.85)':'rgba(200,50,70,.85)';
    ctx.fillRect(ex,en.y-bounce,en.w,en.h);
    ctx.strokeStyle='#ff6080';
    ctx.lineWidth=2;
    ctx.strokeRect(ex,en.y-bounce,en.w,en.h);
    // Emoji
    ctx.font='18px serif';
    ctx.textAlign='center';
    ctx.fillText(en.tipo.emoji,ex+en.w/2,en.y-bounce+en.h*0.62);
    ctx.font='bold 5px "Press Start 2P",monospace';
    ctx.fillStyle='#fff';
    ctx.fillText(en.tipo.label,ex+en.w/2,en.y-bounce+en.h-4);
  });
}

function drawPlayer(){
  var px = player.x - CAM_X;
  var py = player.y;

  // Pisca quando invencível
  if(player.invencivel > 0 && Math.floor(player.invencivel/6)%2===0) return;

  // Sombra
  ctx.fillStyle='rgba(0,0,0,.28)';
  ctx.fillRect(px+4,py+player.h-3,player.w-8,5);

  var la = player.onGround ? Math.floor(Date.now()/110)%4 : 2;

  // Pernas
  ctx.fillStyle='#3d1f7a';
  if(la===0||la===2){ctx.fillRect(px+6,py+32,10,16);ctx.fillRect(px+16,py+32,10,16);}
  else if(la===1){ctx.fillRect(px+4,py+32,10,18);ctx.fillRect(px+18,py+30,10,16);}
  else{ctx.fillRect(px+18,py+32,10,18);ctx.fillRect(px+4,py+30,10,16);}

  // Sapatos
  ctx.fillStyle='#27c97c';
  if(la===0||la===2){ctx.fillRect(px+3,py+46,13,6);ctx.fillRect(px+14,py+46,13,6);}
  else if(la===1){ctx.fillRect(px+1,py+48,14,6);ctx.fillRect(px+16,py+44,12,6);}
  else{ctx.fillRect(px+15,py+48,14,6);ctx.fillRect(px+1,py+44,12,6);}

  // Corpo
  ctx.fillStyle='#7c3aed';
  ctx.fillRect(px+4,py+18,24,18);

  // Crachá
  ctx.fillStyle='#fff';ctx.fillRect(px+7,py+22,16,8);
  ctx.fillStyle='#3d1f7a';ctx.font='bold 5px "Press Start 2P"';ctx.textAlign='left';
  ctx.fillText('SSAP',px+8,py+29);

  // Braços
  ctx.fillStyle='#7c3aed';
  if(player.dir===1){ctx.fillRect(px+27,py+19,8,13);ctx.fillRect(px-3,py+21,8,11);}
  else{ctx.fillRect(px-3,py+19,8,13);ctx.fillRect(px+27,py+21,8,11);}

  // Cabeça
  ctx.fillStyle='#c4a882';ctx.fillRect(px+6,py+2,20,18);

  // Olhos
  ctx.fillStyle='#1a0840';
  if(player.dir===1){ctx.fillRect(px+18,py+8,4,4);ctx.fillRect(px+22,py+8,2,4);}
  else{ctx.fillRect(px+8,py+8,4,4);ctx.fillRect(px+6,py+8,2,4);}

  // Cabelo
  ctx.fillStyle='#1a1040';ctx.fillRect(px+6,py+2,20,5);ctx.fillRect(px+4,py+4,4,8);

  // Capacete (cor muda por belt)
  var beltCores = ['#f1efe8','#f0a832','#27c97c','#1a1a2e','#7c3aed'];
  ctx.fillStyle = beltCores[player.beltAtual]||'#f0a832';
  ctx.fillRect(px+4,py,24,5);
  ctx.fillRect(px+2,py+3,28,4);
}

function drawParticulas(){
  particulas.forEach(function(p){
    p.x+=p.vx;p.y+=p.vy;p.vy+=0.18;p.life--;
    ctx.globalAlpha=p.life/p.max;
    ctx.fillStyle=p.cor;
    ctx.fillRect(p.x-CAM_X,p.y,p.size,p.size);
    ctx.globalAlpha=1;
  });
}

function drawArrowGuia(){
  var next=null;
  itensObj.forEach(function(o){ if(!o.coletado&&!next) next=o; });
  if(!next) return;
  var dx=(next.x+20)-(player.x+16);
  var screenX=player.x+16-CAM_X;
  if(Math.abs(dx)<220) return;
  var now=Date.now()/1000;
  ctx.save();
  ctx.globalAlpha=0.6+Math.sin(now*4)*0.4;
  ctx.fillStyle=next.item.cor;
  ctx.font='20px serif';
  ctx.textAlign='center';
  ctx.fillText(dx>0?'►':'◄',screenX,76);
  ctx.font='bold 6px "Press Start 2P",monospace';
  ctx.fillStyle='#fff';
  ctx.fillText(Math.round(Math.abs(dx)/10)*10+'px',screenX,92);
  ctx.restore();
}

function drawNPCNoMundo(fase){
  // NPC parado no início do mapa
  if(player.coletados > 0) return; // some depois de coletar o primeiro item
  var nx = 300 - CAM_X;
  if(nx < -80 || nx > W+80) return;
  var ny = H - 58 - 52;
  var now = Date.now()/1000;

  // Corpo NPC simples
  ctx.fillStyle='#c4a882';ctx.fillRect(nx+8,ny+2,16,14);
  ctx.fillStyle='#4b8ef0';ctx.fillRect(nx+4,ny+16,24,16);
  ctx.fillStyle='#3d1f7a';ctx.fillRect(nx+6,ny+32,10,14);
  ctx.fillRect(nx+16,ny+32,10,14);
  ctx.font='18px serif';
  ctx.textAlign='center';
  ctx.fillText(fase.npc.emoji,nx+16,ny+16);

  // Balão de fala
  ctx.fillStyle='rgba(255,255,255,.9)';
  ctx.fillRect(nx-60,ny-44,140,32);
  ctx.fillStyle='rgba(255,255,255,.9)';
  ctx.beginPath();ctx.moveTo(nx+8,ny-12);ctx.lineTo(nx+16,ny);ctx.lineTo(nx+24,ny-12);ctx.fill();
  ctx.fillStyle='#1a1a2e';
  ctx.font='5px "Press Start 2P",monospace';
  ctx.textAlign='center';
  var falaShort = fase.npc.nome+'!';
  ctx.fillText(falaShort,nx+10,ny-30);
  ctx.font='6px "Press Start 2P",monospace';
  ctx.fillStyle='#7c3aed';
  ctx.fillText('[ fale comigo ]',nx+10,ny-18);
}

// ════════════════════════════════════════
// GAME LOOP
// ════════════════════════════════════════
var rafId = null;
function loop(){
  rafId = requestAnimationFrame(loop);
  if(gameState !== 'playing' && gameState !== 'popup') return;
  if(!paused){
    updatePlayer();
    updateInimigos();
  }
  updateParticulas();

  var fase = FASES[player.faseAtual];
  drawBg(fase);
  drawPlataformas();
  drawItens();
  drawInimigos();
  drawParticulas();
  drawPlayer();
  drawArrowGuia();
  drawNPCNoMundo(fase);
}

function startLoop(){
  if(rafId) cancelAnimationFrame(rafId);
  loop();
}
