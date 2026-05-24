// ═══════════════════════════════════════════
// QUALITY QUEST v2 — DATA
// Empresas, operadores, missões, ferramentas
// ═══════════════════════════════════════════

var BELTS = [
  { id:'white',  label:'White Belt',  cor:'#d6d3c8', emoji:'🤍' },
  { id:'yellow', label:'Yellow Belt', cor:'#f0a832', emoji:'💛' },
  { id:'green',  label:'Green Belt',  cor:'#27c97c', emoji:'💚' },
  { id:'black',  label:'Black Belt',  cor:'#a78bfa', emoji:'🖤' },
  { id:'master', label:'Master BB',   cor:'#c084fc', emoji:'💜' },
];

// ══════════════════════════════════════════
// MUNDO EXTERNO — segmentos entre fábricas
// ══════════════════════════════════════════
var MUNDO_EXTERNO = {
  bgSky:    ['#87CEEB','#4a90d9','#2563a8'],  // gradiente céu ensolarado
  bgGrass:  '#4a7c3f',
  bgGrassTop:'#5a9a4f',
  bgRoad:   '#6b6560',
  bgRoadLine:'#f0d080',
  nuvens: true,
  pajaros: true,
};

// ══════════════════════════════════════════
// EMPRESAS / FASES
// ══════════════════════════════════════════
var EMPRESAS = [

  // ═══════ 1. TOYOTA ═══════
  {
    id: 'toyota',
    nome: 'Toyota Motor Corporation',
    pais: 'Toyota City, Japão — 1937',
    descricao: 'Berço do Sistema Toyota de Produção (TPS), Kaizen e Kanban. A Toyota revolucionou a manufatura mundial com o conceito de eliminação de desperdícios e melhoria contínua.',
    fatos: ['Recebe 700.000 sugestões/ano dos funcionários', 'Criou o Just-in-Time e o Kanban', 'TPS é a base do Lean Manufacturing'],
    emojiFabrica: '🚗',
    belt: 0,
    beltLabel: 'White Belt',

    // Visual interior
    bgTop:    '#0a1208',
    bgBot:    '#0d1a0f',
    chaoColor:'#1a2818',
    chaoTop:  '#2a5020',
    platColor:'#243820',
    platTop:  '#4a8040',
    corAcento:'#27c97c',

    // Placa externa
    placa: {
      titulo: '🏭 TOYOTA MOTOR',
      sub1:   'Toyota City, Japão — 1937',
      sub2:   'Berço do Kaizen e Kanban',
      cor:    '#27c97c',
    },

    // Operadores dentro da fábrica
    operadores: [
      {
        id: 'tanaka',
        nome: 'Tanaka-san',
        cargo: 'Lider de Linha',
        emoji: '👷',
        corUniforme: '#2a5020',
        x: 500,
        acao: 'montando',  // animação
        dialogo1: 'Konnichiwa! Sou Tanaka, lider desta linha de montagem. Aqui na Toyota, cada operador é responsável pela qualidade do seu processo.',
        missao: 'Ajude-me a organizar o quadro Kanban! Colete as 3 fichas de tarefa espalhadas pela linha.',
        dialogo2: 'Perfeito! O KANBAN nasceu aqui na Toyota. Taiichi Ohno se inspirou nos supermercados americanos — repõe só o que foi consumido. WIP Limit evita sobrecarga!',
        itemEnsinado: 'kanban',
      },
      {
        id: 'yuki',
        nome: 'Yuki',
        cargo: 'Analista de Processo',
        emoji: '👩‍🔧',
        corUniforme: '#1a4010',
        x: 1400,
        acao: 'inspecionando',
        dialogo1: 'Oi! Sou Yuki. Estou monitorando as melhorias diárias aqui na linha B. Na Toyota, qualquer operador pode parar a linha se encontrar um problema — isso é Kaizen!',
        missao: 'Identifique os 3 desperdícios escondidos nessa área. Procure as placas vermelhas de MUDA!',
        dialogo2: 'Excelente! KAIZEN significa melhoria contínua. Pequenas melhorias diárias de TODOS superam grandes projetos raros. A Toyota recebe 700.000 sugestões por ano!',
        itemEnsinado: 'kaizen',
      },
      {
        id: 'ohno_npc',
        nome: 'Sensei Ohno',
        cargo: 'Fundador do TPS',
        emoji: '🧓',
        corUniforme: '#0d2010',
        x: 2400,
        acao: 'observando',
        dialogo1: 'Eu sou Taiichi Ohno. Criei o Sistema Toyota de Produção. A essência é simples: vá ao GEMBA — o chão de fábrica — e elimine tudo que não agrega valor ao cliente.',
        missao: 'Complete o mapa DMAIC coletando as 5 letras espalhadas pela fábrica!',
        dialogo2: 'DMAIC: Definir, Medir, Analisar, Melhorar, Controlar. Este framework, combinado com o TPS, é o que a GE usou para economizar US$ 10 bilhões em 5 anos!',
        itemEnsinado: 'dmaic',
      },
    ],

    // Elementos visuais da fábrica
    elementos: [
      { tipo:'esteira', x:300,  label:'Linha A — Montagem' },
      { tipo:'esteira', x:1200, label:'Linha B — Inspeção' },
      { tipo:'maquina', x:800,  label:'Robô Solda' },
      { tipo:'kanban_board', x:600, label:'Quadro Kanban' },
      { tipo:'paleteira', x:1800, velocidade:1.2 },
      { tipo:'carro_montagem', x:400 },
    ],

    quiz: [
      {
        pergunta: 'O KANBAN foi criado inspirado em qual sistema?',
        opcoes: ['Fábricas alemãs', 'Supermercados americanos', 'Escritórios japoneses', 'Linhas de trem'],
        correta: 1,
        explicacao: 'Taiichi Ohno observou que supermercados repõem prateleiras só quando o produto é consumido — o mesmo princípio do pull system.'
      },
      {
        pergunta: 'KAIZEN significa:',
        opcoes: ['Trabalho em equipe', 'Melhoria contínua', 'Eliminação de desperdício', 'Qualidade total'],
        correta: 1,
        explicacao: 'Kai = mudança, Zen = bom/melhor. Juntos: mudança para melhor, de forma contínua e incremental.'
      },
      {
        pergunta: 'No DMAIC, o que significa a letra "A"?',
        opcoes: ['Aplicar', 'Avaliar', 'Analisar', 'Atualizar'],
        correta: 2,
        explicacao: 'A = Analisar as causas-raiz com dados. É a fase onde as ferramentas estatísticas entram em ação.'
      },
    ],
  },

  // ═══════ 2. 3M ═══════
  {
    id: '3m',
    nome: '3M Company',
    pais: 'Minnesota, EUA — 1902',
    descricao: 'Com mais de 60.000 produtos, a 3M é referência em inovação e controle de qualidade. O CEP e o Histograma são fundamentais para garantir a consistência de produtos como fitas adesivas, Post-its e muito mais.',
    fatos: ['60.000+ produtos em catálogo', 'Post-it nasceu de um adesivo "que não colava direito"', 'Referência mundial em controle estatístico de processo'],
    emojiFabrica: '🏭',
    belt: 1,
    beltLabel: 'Yellow Belt',

    bgTop:    '#080a18',
    bgBot:    '#0a0c20',
    chaoColor:'#10143a',
    chaoTop:  '#1828a0',
    platColor:'#141860',
    platTop:  '#3050c0',
    corAcento:'#4b8ef0',

    placa: {
      titulo: '🏭 3M COMPANY',
      sub1:   'Minnesota, EUA — 1902',
      sub2:   '60.000+ produtos com qualidade',
      cor:    '#4b8ef0',
    },

    operadores: [
      {
        id: 'maria',
        nome: 'Maria Silva',
        cargo: 'Inspetora de Qualidade',
        emoji: '👩‍🏭',
        corUniforme: '#141860',
        x: 500,
        acao: 'inspecionando_fita',
        dialogo1: 'Olá! Sou Maria, inspetora de qualidade aqui na linha de fitas. Medimos a espessura de cada lote produzido e monitoramos tudo em tempo real com cartas de controle.',
        missao: 'Colete as 3 amostras de fita espalhadas na linha e traga para eu medir!',
        dialogo2: 'Com os dados das amostras plotamos o CEP — Controle Estatístico de Processo. Se um ponto sair dos limites LCS ou LCI, paramos a linha imediatamente. Criado por Shewhart em 1924!',
        itemEnsinado: 'cep',
      },
      {
        id: 'carlos',
        nome: 'Carlos Mendes',
        cargo: 'Analista Estatístico',
        emoji: '👨‍💻',
        corUniforme: '#0d1450',
        x: 1500,
        acao: 'digitando',
        dialogo1: 'E aí! Sou Carlos. Faço análise estatística dos dados de produção. O histograma é minha ferramenta favorita — ele mostra a FORMA da distribuição, não só média e desvio.',
        missao: 'Ajude-me a coletar os 3 pontos de dados dessa corrida de produção!',
        dialogo2: 'Perfeito! Com esses dados vejo se a distribuição é normal, bimodal ou assimétrica. Um histograma bimodal me diz que há duas populações misturadas — talvez dois turnos diferentes!',
        itemEnsinado: 'histograma',
      },
      {
        id: 'roberto',
        nome: 'Roberto',
        cargo: 'Operador de Paleteira',
        emoji: '🧑‍🏭',
        corUniforme: '#1a2060',
        x: 2300,
        acao: 'paleteira',
        dialogo1: 'Fala! Aqui eu movo os pallets de produto acabado para expedição. Todo lote passa por inspeção final com Pareto — a gente ataca os maiores problemas primeiro!',
        missao: 'Encontre os 3 defeitos marcados nessa área de expedição!',
        dialogo2: 'Isso! Pareto 80/20: 80% dos defeitos vêm de 20% das causas. Na nossa linha eram só 2 problemas gerando 78% das reclamações. Resolvendo esses 2, o resto some quase sozinho!',
        itemEnsinado: 'pareto',
      },
    ],

    elementos: [
      { tipo:'esteira_fita', x:200,  label:'Linha Fita Adesiva' },
      { tipo:'esteira_fita', x:1100, label:'Linha Post-it' },
      { tipo:'maquina',      x:700,  label:'Extrusora EX-04' },
      { tipo:'paleteira',    x:1900, velocidade:1.0 },
      { tipo:'grafico_cep',  x:900,  label:'Carta de Controle' },
      { tipo:'operador_linha', x:350,  acao:'embalando' },
      { tipo:'operador_linha', x:1300, acao:'inspecionando' },
    ],

    quiz: [
      {
        pergunta: 'No CEP, LCS e LCI representam:',
        opcoes: ['Limite de Confiança Superior/Inferior', 'Limite de Controle Superior/Inferior', 'Linha Central Superior/Inferior', 'Limite de Calibração do Sistema'],
        correta: 1,
        explicacao: 'LCS = Limite de Controle Superior (LC + 3σ) e LCI = Limite de Controle Inferior (LC - 3σ). Pontos fora indicam causa especial.'
      },
      {
        pergunta: 'Um histograma BIMODAL (2 picos) indica:',
        opcoes: ['Processo excelente e bem centrado', 'Duas populações misturadas no mesmo gráfico', 'Dados insuficientes para análise', 'Processo com alta variabilidade normal'],
        correta: 1,
        explicacao: 'Dois picos = dois grupos diferentes sendo tratados como um. Ex: turno A e turno B com ajustes diferentes na máquina.'
      },
      {
        pergunta: 'O Princípio de Pareto aplicado à qualidade diz:',
        opcoes: ['Todos os defeitos têm igual importância', '50% das causas geram 50% dos efeitos', '20% das causas geram 80% dos defeitos', '100% das causas devem ser eliminadas'],
        correta: 2,
        explicacao: 'Os "vitais poucos" — 20% das causas — geram 80% dos problemas. Foque neles primeiro para máximo impacto com mínimo esforço.'
      },
    ],
  },

  // ═══════ 3. BELL LABS (SHEWHART) ═══════
  {
    id: 'belllabs',
    nome: 'Bell Telephone Laboratories',
    pais: 'Murray Hill, EUA — 1925',
    descricao: 'Walter Shewhart desenvolveu aqui as cartas de controle e o ciclo PDCA em 1924. Os Bell Labs produziram mais de 30.000 patentes e 9 Prêmios Nobel. É o laboratório mais inovador da história.',
    fatos: ['Walter Shewhart criou o CEP em 1924', 'W. Edwards Deming aprendeu com Shewhart aqui', 'O transistor foi inventado aqui em 1947'],
    emojiFabrica: '🔬',
    belt: 2,
    beltLabel: 'Green Belt',

    bgTop:    '#0a080a',
    bgBot:    '#150d20',
    chaoColor:'#1a1028',
    chaoTop:  '#503080',
    platColor:'#281840',
    platTop:  '#8050c0',
    corAcento:'#a78bfa',

    placa: {
      titulo: '🔬 BELL LABS',
      sub1:   'Murray Hill, EUA — 1925',
      sub2:   'Onde o CEP foi criado em 1924',
      cor:    '#a78bfa',
    },

    operadores: [
      {
        id: 'shewhart_npc',
        nome: 'Walter Shewhart',
        cargo: 'Físico e Pai do CEP',
        emoji: '👨‍🔬',
        corUniforme: '#281840',
        x: 600,
        acao: 'plotando_grafico',
        dialogo1: 'Bem-vindo ao Bell Labs! Sou Walter Shewhart. Em 1924 descobri que processos têm dois tipos de variação: causas comuns (normais) e causas especiais (anomalias que precisam de ação).',
        missao: 'Colete as 3 amostras de medição para plotarmos uma carta de controle juntos!',
        dialogo2: 'Com esses dados calculamos: LC (média), LCS (LC + 3σ) e LCI (LC - 3σ). Qualquer ponto fora = investigar imediatamente. Deming levou isso ao Japão em 1950 e mudou o mundo!',
        itemEnsinado: 'cep',
      },
      {
        id: 'ana_lab',
        nome: 'Dra. Ana Chen',
        cargo: 'Engenheira de Qualidade',
        emoji: '👩‍🔬',
        corUniforme: '#1e1030',
        x: 1600,
        acao: 'medindo',
        dialogo1: 'Oi! Sou a Dra. Ana. Trabalho com análise de capabilidade — verifico se o processo consegue produzir DENTRO das especificações do cliente de forma consistente.',
        missao: 'Meça os 3 componentes nessa bancada e traga os resultados!',
        dialogo2: 'Com essas medidas calculo o Cpk! Se Cpk ≥ 1.33 o processo é capaz. Se Cp é alto mas Cpk baixo, o processo é variável mas descentrado — precisamos ajustar a média primeiro.',
        itemEnsinado: 'cpk',
      },
      {
        id: 'roy_fisher',
        nome: 'Prof. Roy',
        cargo: 'Estatístico Sênior',
        emoji: '🧑‍🏫',
        corUniforme: '#201540',
        x: 2500,
        acao: 'explicando',
        dialogo1: 'Olá! Sou especialista em ANOVA — Análise de Variância. Desenvolvida por Ronald Fisher em 1921, ela responde: há diferença real entre esses grupos ou é só acaso?',
        missao: 'Colete os dados dos 3 grupos de teste espalhados pelo laboratório!',
        dialogo2: 'Com esses dados calculo a estatística F e o p-valor. Se p < 0.05, a diferença é real com 95% de confiança. Isso me diz QUAL turno, máquina ou operador está causando o problema!',
        itemEnsinado: 'anova',
      },
    ],

    elementos: [
      { tipo:'bancada_lab', x:300,  label:'Bancada de Medição' },
      { tipo:'bancada_lab', x:1200, label:'Análise Estatística' },
      { tipo:'grafico_cep', x:800,  label:'Carta de Controle Original' },
      { tipo:'microscopio', x:1800, label:'Análise de Materiais' },
      { tipo:'operador_linha', x:450,  acao:'medindo_amostra' },
      { tipo:'operador_linha', x:1400, acao:'anotando_dados' },
    ],

    quiz: [
      {
        pergunta: 'Walter Shewhart criou as cartas de controle em:',
        opcoes: ['1900', '1924', '1950', '1986'],
        correta: 1,
        explicacao: 'Shewhart criou as cartas de controle nos Bell Labs em 1924. Deming levou o conceito ao Japão em 1950.'
      },
      {
        pergunta: 'Um Cpk de 1.5 indica que o processo é:',
        opcoes: ['Incapaz — produzindo defeitos', 'Capaz mas abaixo do padrão Six Sigma', 'Capaz e acima do padrão automotivo (1.33)', 'Excelente — nível Six Sigma'],
        correta: 2,
        explicacao: 'Cpk 1.5 > 1.33 (padrão automotivo): processo capaz e com boa margem de segurança. Cpk ≥ 1.67 seria nível Six Sigma.'
      },
      {
        pergunta: 'Na ANOVA, p-valor = 0.03 significa:',
        opcoes: ['Não há diferença entre grupos', 'Diferença real com 97% de confiança', 'Erro no experimento', 'Amostra insuficiente'],
        correta: 1,
        explicacao: 'p = 0.03 < 0.05: rejeitamos H0. Há diferença estatisticamente significativa entre os grupos com 97% de confiança.'
      },
    ],
  },

  // ═══════ 4. MOTOROLA ═══════
  {
    id: 'motorola',
    nome: 'Motorola Inc.',
    pais: 'Schaumburg, Illinois — 1986',
    descricao: 'Berço do Six Sigma! Bill Smith criou a metodologia aqui em 1986. A meta: menos de 3.4 defeitos por milhão de oportunidades. A GE adotou em 1995 e economizou US$ 10 bilhões em 5 anos.',
    fatos: ['Six Sigma criado por Bill Smith em 1986', 'Meta: 3.4 DPMO — 6 desvios-padrão', 'Jack Welch adotou na GE em 1995'],
    emojiFabrica: '⚡',
    belt: 3,
    beltLabel: 'Black Belt',

    bgTop:    '#120808',
    bgBot:    '#1a0a0a',
    chaoColor:'#2a1010',
    chaoTop:  '#903030',
    platColor:'#3a1515',
    platTop:  '#c04040',
    corAcento:'#e8455a',

    placa: {
      titulo: '⚡ MOTOROLA INC.',
      sub1:   'Schaumburg, Illinois — 1986',
      sub2:   'Berço do Six Sigma',
      cor:    '#e8455a',
    },

    operadores: [
      {
        id: 'bill_smith',
        nome: 'Bill Smith',
        cargo: 'Criador do Six Sigma',
        emoji: '👨‍💼',
        corUniforme: '#3a1515',
        x: 500,
        acao: 'analisando_dados',
        dialogo1: 'Eu sou Bill Smith. Criei o Six Sigma aqui na Motorola em 1986. A pergunta era: como garantir qualidade em escala industrial? A resposta foi matemática: 6 desvios-padrão entre a média e o limite mais próximo.',
        missao: 'Ajude-me a testar os 3 circuitos desta linha. Colete os resultados de cada um!',
        dialogo2: 'Six Sigma = 3.4 DPMO. Isso significa: em 1 milhão de oportunidades, apenas 3.4 serão defeituosas. Para atingir isso usamos DOE — Design of Experiments — para otimizar múltiplos fatores simultaneamente!',
        itemEnsinado: 'doe',
      },
      {
        id: 'sarah_bb',
        nome: 'Sarah Johnson',
        cargo: 'Black Belt Sênior',
        emoji: '👩‍💼',
        corUniforme: '#2a1010',
        x: 1600,
        acao: 'apresentando',
        dialogo1: 'Oi! Sou Sarah, Black Belt há 8 anos. Aqui na Motorola aprendi que todo projeto Six Sigma precisa de justificativa financeira. ROI é a linguagem que a diretoria entende!',
        missao: 'Colete os 3 relatórios de saving espalhados pelos setores!',
        dialogo2: 'Com esses números calculo o ROI: (Ganho - Investimento) / Investimento × 100%. Um projeto Six Sigma bem conduzido retorna em média 10x o investimento. Isso garante aprovação e continuidade!',
        itemEnsinado: 'roi',
      },
      {
        id: 'marcus_lean',
        nome: 'Marcus Torres',
        cargo: 'Especialista Lean',
        emoji: '🧑‍🔧',
        corUniforme: '#4a1818',
        x: 2600,
        acao: 'mapeando',
        dialogo1: 'E aí! Sou Marcus, especialista em Lead Time e Lean. Aqui mapeamos todo o fluxo de valor — do pedido à entrega — para identificar onde o tempo é desperdiçado.',
        missao: 'Meça o tempo das 3 etapas do processo e me traga os dados!',
        dialogo2: 'Com esses tempos calculo a Eficiência do Fluxo: Tempo VA / Lead Time Total × 100%. Na maioria dos processos, menos de 10% do tempo agrega valor! Os outros 90% são desperdício eliminável. Isso é Lean!',
        itemEnsinado: 'leadtime',
      },
    ],

    elementos: [
      { tipo:'bancada_eletro', x:300,  label:'Linha de Circuitos' },
      { tipo:'bancada_eletro', x:1200, label:'Teste Final' },
      { tipo:'maquina',        x:800,  label:'Robô Soldagem SMT' },
      { tipo:'paleteira',      x:2000, velocidade:1.5 },
      { tipo:'grafico_cep',    x:1000, label:'Monitor de Qualidade' },
      { tipo:'operador_linha', x:600,  acao:'testando_circuito' },
      { tipo:'operador_linha', x:1400, acao:'anotando_dados' },
      { tipo:'operador_linha', x:2200, acao:'embalando' },
    ],

    quiz: [
      {
        pergunta: 'Six Sigma significa atingir no máximo:',
        opcoes: ['6 defeitos por 100 peças', '3.4 defeitos por milhão de oportunidades', '6% de taxa de defeitos', '3.4 sigma de distância'],
        correta: 1,
        explicacao: '3.4 DPMO = Defeitos Por Milhão de Oportunidades. Equivale a 6 desvios-padrão entre a média e o limite mais próximo da especificação.'
      },
      {
        pergunta: 'Um DOE Fatorial 2³ testa quantas combinações?',
        opcoes: ['3 combinações', '6 combinações', '8 combinações', '12 combinações'],
        correta: 2,
        explicacao: '2³ = 2×2×2 = 8 corridas. Testa todas as combinações de 3 fatores em 2 níveis (alto/baixo) — muito mais eficiente que testar um fator por vez.'
      },
      {
        pergunta: 'Se Lead Time = 80h e Tempo VA = 8h, a eficiência é:',
        opcoes: ['8%', '10%', '80%', '92%'],
        correta: 1,
        explicacao: 'Eficiência = 8/80 × 100% = 10%. Apenas 10% do tempo agrega valor. Os outros 90% são desperdícios Lean a eliminar.'
      },
    ],
  },
];

// ══════════════════════════════════════════
// ITENS COLETÁVEIS (missões)
// mapeados por itemEnsinado dos operadores
// ══════════════════════════════════════════
var ITEM_INFO = {
  kanban:    { emoji:'📋', cor:'#f0a832', label:'KANBAN',    formula:'WIP Limit = capacidade real' },
  kaizen:    { emoji:'🔄', cor:'#27c97c', label:'KAIZEN',    formula:'Hoje > Ontem → Amanhã > Hoje' },
  dmaic:     { emoji:'⚙️', cor:'#4b8ef0', label:'DMAIC',     formula:'D → M → A → I → C' },
  cep:       { emoji:'📉', cor:'#e8455a', label:'CEP/SPC',   formula:'LC ± 3σ → LCS e LCI' },
  histograma:{ emoji:'📊', cor:'#27c97c', label:'HISTOGRAMA',formula:'Classes = 1 + 3.322×log₁₀(n)' },
  pareto:    { emoji:'📋', cor:'#f0a832', label:'PARETO',    formula:'20% causas → 80% efeitos' },
  cpk:       { emoji:'📊', cor:'#a78bfa', label:'Cp/Cpk',    formula:'Cpk = min[(LSE-μ)/3σ,(μ-LIE)/3σ]' },
  anova:     { emoji:'📈', cor:'#4b8ef0', label:'ANOVA',     formula:'F = Var.Entre / Var.Dentro' },
  doe:       { emoji:'🧪', cor:'#f0a832', label:'DOE',       formula:'Corridas = 2ᵏ (fatorial completo)' },
  roi:       { emoji:'💰', cor:'#a78bfa', label:'ROI',       formula:'ROI = (Ganho-Invest.)/Invest.×100%' },
  leadtime:  { emoji:'⏱️', cor:'#27c97c', label:'LEAD TIME', formula:'Eficiência = (VA/LT) × 100%' },
};
