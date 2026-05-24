// ═══════════════════════════════════════════
// QUALITY QUEST — DATA
// Fases, itens, quizzes, NPCs, belts
// ═══════════════════════════════════════════

var BELTS = [
  { id:'white',  label:'White Belt',  cor:'#f1efe8', emoji:'🤍', min:0  },
  { id:'yellow', label:'Yellow Belt', cor:'#f0a832', emoji:'💛', min:1  },
  { id:'green',  label:'Green Belt',  cor:'#27c97c', emoji:'💚', min:2  },
  { id:'black',  label:'Black Belt',  cor:'#1a1a2e', emoji:'🖤', min:3  },
  { id:'master', label:'Master BB',   cor:'#7c3aed', emoji:'💜', min:4  },
];

var FASES = [
  // ═══════ FASE 1 — ESCRITÓRIO / GENÉRICA ═══════
  {
    id: 'escritorio',
    nome: 'Fase 1 — O Escritório',
    empresa: 'Empresa Genérica S.A.',
    belt: 'White Belt',
    beltCor: '#f1efe8',
    bgTop: '#0d0d1a',
    bgBot: '#1a1024',
    chaoColor: '#2a2040',
    chaoTop: '#6b5fa0',
    platColor: '#3d3060',
    platTop: '#8b7cc8',
    descricao: 'Bem-vindo ao escritório! Aqui você aprende as metodologias base da qualidade. Conheça o DMAIC, o Kaizen e o Kanban — as ferramentas que organizam a melhoria.',
    npc: {
      nome: 'Gerente Silva',
      fala: 'Filho, aqui a gente trabalha no escuro sem dados. Aprenda essas metodologias e salve essa empresa!',
      emoji: '👔'
    },
    inimigos: [],
    itens: [
      {
        id:'dmaic', emoji:'⚙️', cor:'#4b8ef0', label:'DMAIC',
        nome:'DMAIC — O Framework do Six Sigma',
        empresa:'Motorola, 1986',
        texto:'Criado na Motorola e popularizado pela GE com Jack Welch. DMAIC é a estrutura que transforma problemas crônicos em melhorias permanentes através de 5 fases rigorosas.',
        fases:[
          '► DEFINIR: qual é o problema? Qual o impacto no cliente?',
          '► MEDIR: qual é o estado atual do processo com dados reais?',
          '► ANALISAR: quais são as causas-raiz do problema?',
          '► MELHORAR: quais soluções eliminam as causas-raiz?',
          '► CONTROLAR: como garantir que não vamos regredir?'
        ],
        formula: 'D → M → A → I → C',
        dica:'A GE economizou US$ 10 bilhões nos primeiros 5 anos usando DMAIC.'
      },
      {
        id:'kaizen', emoji:'🔄', cor:'#27c97c', label:'KAIZEN',
        nome:'KAIZEN — Melhoria Contínua',
        empresa:'Toyota, Japão, 1950s',
        texto:'Do japonês "kai" (mudança) + "zen" (bom). Filosofia que prega melhorias pequenas e diárias feitas por TODOS os colaboradores — do CEO ao operador. Não espera grandes projetos.',
        fases:[
          '► Toda pessoa é um especialista no seu próprio trabalho',
          '► Melhorias pequenas diárias superam grandes mudanças raras',
          '► Foco em eliminar MUDA (desperdício) em 8 tipos',
          '► Eventos Kaizen: times focados por 3-5 dias num problema',
          '► Resultados imediatos, sustentados pela cultura'
        ],
        formula: 'Hoje > Ontem → Amanhã > Hoje',
        dica:'Toyota recebe mais de 700.000 sugestões de melhoria por ano dos funcionários.'
      },
      {
        id:'kanban', emoji:'📋', cor:'#f0a832', label:'KANBAN',
        nome:'KANBAN — Gestão Visual do Fluxo',
        empresa:'Toyota, Taiichi Ohno, 1953',
        texto:'Sistema visual que limita o trabalho em progresso (WIP) para revelar gargalos e manter fluxo contínuo. Criado por Taiichi Ohno inspirado nos supermercados americanos.',
        fases:[
          '► Colunas: A Fazer → Em Progresso → Concluído',
          '► WIP Limit: máximo de tarefas simultâneas por coluna',
          '► Pull system: só puxa nova tarefa quando há capacidade',
          '► Métricas: Lead Time e Throughput revelam saúde do fluxo',
          '► Kanban eletrônico: Trello, Jira, Azure DevOps'
        ],
        formula: 'WIP Limit = capacidade real da equipe',
        dica:'Limitar WIP parece contra-intuitivo mas acelera a entrega — foco vence multitarefa.'
      },
    ],
    quiz: [
      {
        pergunta: 'O que significa a letra "A" no DMAIC?',
        opcoes: ['Aplicar', 'Analisar', 'Avaliar', 'Automatizar'],
        correta: 1,
        explicacao: 'A = ANALISAR as causas-raiz do problema com dados e ferramentas estatísticas.'
      },
      {
        pergunta: 'KAIZEN é uma palavra japonesa que significa:',
        opcoes: ['Trabalho duro', 'Melhoria contínua', 'Qualidade total', 'Sem desperdício'],
        correta: 1,
        explicacao: 'Kai = mudança, Zen = bom. Juntos: mudança para melhor, de forma contínua.'
      },
      {
        pergunta: 'O Kanban foi criado inspirado em:',
        opcoes: ['Fábricas alemãs', 'Supermercados americanos', 'Escritórios japoneses', 'Linhas de trem'],
        correta: 1,
        explicacao: 'Taiichi Ohno se inspirou no sistema de reposição de prateleiras dos supermercados americanos.'
      },
    ]
  },

  // ═══════ FASE 2 — FÁBRICA TOYOTA ═══════
  {
    id: 'toyota',
    nome: 'Fase 2 — Chão de Fábrica Toyota',
    empresa: 'Toyota Motor Corporation',
    belt: 'Yellow Belt',
    beltCor: '#f0a832',
    bgTop: '#0a1208',
    bgBot: '#0d1a10',
    chaoColor: '#1a2a18',
    chaoTop: '#3a6a32',
    platColor: '#2a4828',
    platTop: '#5a9850',
    descricao: 'Bem-vindo à fábrica da Toyota em Toyota City! Aqui nascem o CEP, o Histograma e o Pareto — ferramentas que monitoram e priorizam a qualidade no chão de fábrica.',
    npc: {
      nome: 'Sensei Ohno',
      fala: 'Vá ao gemba — o chão de fábrica! Os dados vivem lá, não nos relatórios. Aprenda a ver o que os números dizem!',
      emoji: '🏭'
    },
    inimigos: [
      { tipo:'refugo', emoji:'⚠️', label:'Refugo', velocidade:1.2 },
      { tipo:'defeito', emoji:'❌', label:'Defeito', velocidade:1.8 },
    ],
    itens: [
      {
        id:'cep', emoji:'📉', cor:'#e8455a', label:'CEP/SPC',
        nome:'CEP — Controle Estatístico de Processo',
        empresa:'Walter Shewhart, Bell Labs, 1924',
        texto:'Desenvolvido por Walter Shewhart na Bell Labs e popularizado por W. Edwards Deming no Japão. As cartas de controle distinguem variação normal (causas comuns) de anomalias que exigem ação (causas especiais).',
        fases:[
          '► Carta Xbar-R: monitora média e amplitude de subgrupos',
          '► Carta I-MR: monitora valores individuais',
          '► LCS e LCI: Limites de Controle Superior e Inferior (±3σ)',
          '► Regras de Nelson: 8 padrões que detectam causas especiais',
          '► Processo estável ≠ processo capaz — ambos devem ser garantidos'
        ],
        formula: 'LC ± 3σ → LCS e LCI',
        dica:'Deming ensinou CEP no Japão em 1950. É por isso que o "Made in Japan" virou sinônimo de qualidade.'
      },
      {
        id:'histo', emoji:'📊', cor:'#27c97c', label:'HISTOGRAMA',
        nome:'Histograma — Distribuição de Dados',
        empresa:'Karl Pearson, 1895',
        texto:'Criado pelo estatístico Karl Pearson. O histograma revela a FORMA da distribuição dos dados — algo que médias e desvios-padrão sozinhos não mostram. É a radiografia do processo.',
        fases:[
          '► Distribuição Normal (sino): processo centrado e estável',
          '► Assimétrica à direita: outliers altos, investigar causas',
          '► Bimodal (2 picos): duas populações misturadas — 2 turnos? 2 máquinas?',
          '► Truncada: dados sendo removidos manualmente — suspeito!',
          '► Nº de classes: regra de Sturges = 1 + 3.322 × log₁₀(n)'
        ],
        formula: 'Classes = 1 + 3.322 × log₁₀(n)',
        dica:'Um histograma bimodal é o maior alerta: dois processos diferentes estão sendo tratados como um.'
      },
      {
        id:'pareto', emoji:'📋', cor:'#f0a832', label:'PARETO',
        nome:'Pareto — O Princípio 80/20',
        empresa:'Vilfredo Pareto → Joseph Juran, 1940s',
        texto:'Vilfredo Pareto descobriu que 80% da terra italiana pertencia a 20% da população. Joseph Juran aplicou o princípio à qualidade: 80% dos defeitos vêm de 20% das causas — os "vitais poucos".',
        fases:[
          '► Coleta: lista de defeitos com frequência ou custo',
          '► Ordenação: do maior para o menor',
          '► Acumulação: percentual acumulado em linha secundária',
          '► Vitais poucos: causas até ~80% do acumulado',
          '► Ação: resolver os 2-3 primeiros itens antes dos demais'
        ],
        formula: '20% das causas → 80% dos efeitos',
        dica:'Não tente resolver tudo de uma vez. O Pareto diz onde focar para máximo impacto com mínimo esforço.'
      },
    ],
    quiz: [
      {
        pergunta: 'No CEP, o que significa LCS?',
        opcoes: ['Limite de Controle Seletivo', 'Limite de Controle Superior', 'Linha Central Sigma', 'Limite de Conformidade Superior'],
        correta: 1,
        explicacao: 'LCS = Limite de Controle Superior = LC + 3σ. Qualquer ponto acima indica causa especial.'
      },
      {
        pergunta: 'Um histograma com 2 picos (bimodal) indica:',
        opcoes: ['Processo excelente', 'Duas populações misturadas', 'Dados insuficientes', 'Processo centrado'],
        correta: 1,
        explicacao: 'Bimodal = dois grupos misturados. Ex: turno A e turno B com comportamentos diferentes.'
      },
      {
        pergunta: 'O Princípio de Pareto diz que aproximadamente:',
        opcoes: ['50% das causas geram 50% dos efeitos', '80% das causas geram 20% dos efeitos', '20% das causas geram 80% dos efeitos', '100% das causas têm igual importância'],
        correta: 2,
        explicacao: '20% das causas (vitais poucos) geram 80% dos problemas. Foque nelas primeiro.'
      },
    ]
  },

  // ═══════ FASE 3 — LABORATÓRIO 3M ═══════
  {
    id: '3m',
    nome: 'Fase 3 — Laboratório 3M',
    empresa: '3M Company — Minnesota',
    belt: 'Green Belt',
    beltCor: '#27c97c',
    bgTop: '#080a18',
    bgBot: '#0a0d28',
    chaoColor: '#10143a',
    chaoTop: '#2040a0',
    platColor: '#182060',
    platTop: '#4060d0',
    descricao: 'Bem-vindo ao laboratório de inovação da 3M em Minnesota! Aqui você aprende Capabilidade, ANOVA e Gage R&R — as ferramentas que garantem que o produto sai certo desde o primeiro.',
    npc: {
      nome: 'Dra. Chen',
      fala: 'Na 3M desenvolvemos mais de 60.000 produtos. Sem Capabilidade e ANOVA, seria impossível garantir qualidade em escala. Vamos aprender!',
      emoji: '🔬'
    },
    inimigos: [
      { tipo:'variacao', emoji:'📈', label:'Variação', velocidade:2.0 },
      { tipo:'outlier',  emoji:'💥', label:'Outlier',  velocidade:2.5 },
    ],
    itens: [
      {
        id:'cpk', emoji:'📊', cor:'#a78bfa', label:'Cp / Cpk',
        nome:'Capabilidade — Cp e Cpk',
        empresa:'Conceito desenvolvido nos anos 1970-80',
        texto:'Índices que respondem a pergunta: o processo consegue produzir DENTRO das especificações do cliente de forma consistente? Cp mede potencial. Cpk mede performance real considerando o centramento.',
        fases:[
          '► Cp: largura da especificação / variabilidade do processo (6σ)',
          '► Cpk: considera se o processo está centralizado entre LSE e LIE',
          '► Cp < 1.0: processo incapaz — vai produzir defeitos',
          '► Cp ≥ 1.33: capaz — padrão mínimo da indústria automotiva',
          '► Cp ≥ 1.67: excelente — Six Sigma level'
        ],
        formula: 'Cpk = min[(LSE-μ)/3σ , (μ-LIE)/3σ]',
        dica:'Cp alto com Cpk baixo = processo variável mas descentrado. Ajuste a média antes de reduzir variação.'
      },
      {
        id:'anova', emoji:'📈', cor:'#4b8ef0', label:'ANOVA',
        nome:'ANOVA — Análise de Variância',
        empresa:'Ronald Fisher, 1921',
        texto:'Desenvolvida por Ronald Fisher para experimentos agrícolas. Testa se há diferença estatisticamente significativa entre 3 ou mais grupos. Separa a variação ENTRE grupos da variação DENTRO dos grupos.',
        fases:[
          '► H0 (nula): todos os grupos têm a mesma média',
          '► H1 (alternativa): pelo menos um grupo é diferente',
          '► Estatística F: razão da variância entre/dentro grupos',
          '► p-valor < 0.05: rejeita H0 — diferença é real (95% confiança)',
          '► Post-hoc (Tukey): identifica QUAIS grupos diferem entre si'
        ],
        formula: 'F = Variância Entre Grupos / Variância Dentro dos Grupos',
        dica:'p < 0.05 significa: há menos de 5% de chance dessa diferença ser acaso.'
      },
      {
        id:'grr', emoji:'📏', cor:'#e8455a', label:'GAGE R&R',
        nome:'Gage R&R — Sistema de Medição (MSA)',
        empresa:'AIAG — Indústria Automotiva',
        texto:'Antes de confiar nos dados, você precisa confiar no instrumento de medição! Gage R&R separa a variação total em: variação do produto (boa) vs variação do sistema de medição (ruim).',
        fases:[
          '► Repeatability (R): mesmo operador, mesmo instrumento — varia?',
          '► Reproducibility (R): operadores diferentes — variam entre si?',
          '► %GRR < 10%: sistema de medição aceitável',
          '► %GRR 10-30%: aceitável dependendo do contexto',
          '► %GRR > 30%: sistema de medição inadequado — investigar'
        ],
        formula: '%GRR = (σ_medição / σ_total) × 100',
        dica:'Se o Gage R&R for ruim, toda análise estatística baseada nesses dados é suspeita. Comece sempre pelo MSA.'
      },
    ],
    quiz: [
      {
        pergunta: 'Um Cpk de 1.2 indica que o processo é:',
        opcoes: ['Excelente — Six Sigma', 'Capaz mas abaixo do ideal industrial', 'Incapaz — produzindo defeitos', 'Centrado mas variável'],
        correta: 1,
        explicacao: 'Cpk 1.2 > 1.0 (capaz) mas < 1.33 (padrão automotivo). Aceitável em alguns contextos, mas há espaço para melhoria.'
      },
      {
        pergunta: 'Na ANOVA, um p-valor de 0.03 significa:',
        opcoes: ['Não há diferença entre os grupos', 'Diferença real com 97% de confiança', 'Amostra insuficiente', 'Erro no cálculo'],
        correta: 1,
        explicacao: 'p = 0.03 < 0.05: rejeita H0. Há diferença estatisticamente significativa com 97% de confiança.'
      },
      {
        pergunta: 'Um %GRR de 35% indica:',
        opcoes: ['Sistema de medição excelente', 'Sistema de medição aceitável', 'Sistema de medição inadequado', 'Processo fora de controle'],
        correta: 2,
        explicacao: '%GRR > 30% indica que o instrumento ou operadores introduzem variação excessiva. O sistema precisa ser melhorado antes de confiar nos dados.'
      },
    ]
  },

  // ═══════ FASE 4 — MOTOROLA / BLACK BELT ═══════
  {
    id: 'motorola',
    nome: 'Fase 4 — Centro de Excelência Motorola',
    empresa: 'Motorola — Berço do Six Sigma',
    belt: 'Black Belt',
    beltCor: '#a78bfa',
    bgTop: '#120a0a',
    bgBot: '#1a0d0d',
    chaoColor: '#2a1010',
    chaoTop: '#8a3030',
    platColor: '#3a1818',
    platTop: '#c04040',
    descricao: 'Você chegou à Motorola — onde o Six Sigma nasceu em 1986! Esta é a fase mais desafiadora. Aprenda DOE, Lead Time e ROI para se tornar um Black Belt completo.',
    npc: {
      nome: 'Bill Smith',
      fala: 'Eu criei o Six Sigma aqui na Motorola em 1986. A meta é clara: menos de 3.4 defeitos por milhão de oportunidades. Você está pronto?',
      emoji: '🏆'
    },
    inimigos: [
      { tipo:'refugo',   emoji:'⚠️', label:'Refugo',   velocidade:2.2 },
      { tipo:'defeito',  emoji:'❌', label:'Defeito',   velocidade:2.8 },
      { tipo:'variacao', emoji:'📈', label:'Variação',  velocidade:3.0 },
    ],
    itens: [
      {
        id:'doe', emoji:'🧪', cor:'#f0a832', label:'DOE',
        nome:'DOE — Planejamento de Experimentos',
        empresa:'Ronald Fisher → Box, Hunter, 1978',
        texto:'Design of Experiments permite testar múltiplos fatores simultaneamente com o mínimo de experimentos possível. Em vez de testar um fator por vez, o DOE revela interações que experimentos isolados jamais detectariam.',
        fases:[
          '► Fatorial 2k: k fatores em 2 níveis (alto/baixo) = 2k corridas',
          '► Efeito principal: impacto individual de cada fator',
          '► Interação: quando o efeito de A depende do nível de B',
          '► Combinação ótima: maximiza ou minimiza a resposta',
          '► Screening: elimina fatores não significativos antes do DOE completo'
        ],
        formula: 'Corridas = 2k (fatorial completo)',
        dica:'Um DOE 2³ (3 fatores) testa 8 combinações e revela efeitos que 24 experimentos isolados não revelariam.'
      },
      {
        id:'lead', emoji:'⏱️', cor:'#27c97c', label:'LEAD TIME',
        nome:'Lead Time — Tempo de Ciclo e Eficiência',
        empresa:'Lean Manufacturing — Toyota Production System',
        texto:'Lead Time é o tempo total desde o pedido do cliente até a entrega. Composto por Tempo de Valor Agregado (VA) e Tempo de Não Valor Agregado (NVA). A eficiência típica de processos é de apenas 5-30%!',
        fases:[
          '► Lead Time total = VA + NVA (esperas, filas, transporte)',
          '► Eficiência = Tempo VA / Lead Time total × 100%',
          '► Value Stream Map: visualiza todo o fluxo e identifica desperdícios',
          '► 8 Desperdícios LEAN: transporte, inventário, movimento, espera, superprodução, superprocessamento, defeitos, talento',
          '► Meta: aumentar %VA eliminando etapas NVA'
        ],
        formula: 'Eficiência = (Tempo VA / Lead Time) × 100%',
        dica:'Na maioria dos processos, menos de 10% do tempo é realmente valor agregado. Os outros 90% são desperdício eliminável.'
      },
      {
        id:'roi', emoji:'💰', cor:'#a78bfa', label:'ROI',
        nome:'ROI — Retorno sobre o Investimento',
        empresa:'Conceito financeiro aplicado à Qualidade',
        texto:'Todo projeto Six Sigma precisa ser justificado financeiramente. ROI quantifica o retorno gerado pelo projeto em relação ao investimento realizado. É o que convence a diretoria a aprovar e continuar financiando projetos.',
        fases:[
          '► Ganho anual: redução de refugo + retrabalho + reclamações + horas',
          '► Investimento: horas do time + consultoria + equipamentos + treinamento',
          '► ROI = (Ganho - Investimento) / Investimento × 100%',
          '► Payback: em quantos meses o investimento se paga',
          '► Hard savings vs Soft savings: contabilize só o que pode provar'
        ],
        formula: 'ROI = (Ganho Anual - Investimento) / Investimento × 100%',
        dica:'Um projeto Six Sigma bem conduzido retorna em média 10x o investimento. Documente tudo para comprovar o saving.'
      },
    ],
    quiz: [
      {
        pergunta: 'Um DOE Fatorial 2³ (3 fatores) requer quantas corridas?',
        opcoes: ['3 corridas', '6 corridas', '8 corridas', '12 corridas'],
        correta: 2,
        explicacao: '2³ = 2×2×2 = 8 corridas no fatorial completo. Testa todas as combinações de 3 fatores em 2 níveis cada.'
      },
      {
        pergunta: 'Se o Lead Time é 40h e o Tempo VA é 4h, a eficiência é:',
        opcoes: ['4%', '10%', '40%', '90%'],
        correta: 1,
        explicacao: 'Eficiência = 4/40 × 100% = 10%. Apenas 10% do tempo gera valor — 90% é desperdício a eliminar.'
      },
      {
        pergunta: 'No Six Sigma, a meta de 3.4 DPMO significa:',
        opcoes: ['3.4 defeitos por 100 peças', '3.4 defeitos por 1.000 peças', '3.4 defeitos por 1.000.000 de oportunidades', '3.4% de taxa de defeitos'],
        correta: 2,
        explicacao: 'DPMO = Defeitos Por Milhão de Oportunidades. 3.4 DPMO equivale a 6 desvios-padrão entre a média e o limite mais próximo.'
      },
    ]
  },
];
