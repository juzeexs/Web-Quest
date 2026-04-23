/* ================================================================
   FASE 1: PARADIGMA ORIENTADO A OBJETOS
   Classe Jogador — Encapsulamento com métodos getters/setters
================================================================ */

/**
 * Classe Jogador
 * Responsável por guardar nome, XP e nível do jogador.
 * Aplica Encapsulamento: o XP só pode ser modificado via addXP().
 */
class Jogador {
  /** @param {string} nome - Nome do jogador */
  constructor(nome) {
    this._nome  = nome;        // Propriedade privada (convenção _)
    this._xp    = 0;           // XP começa zerado
    this._nivel = 1;           // Nível inicial: 1
  }

  /** Getter: retorna o nome do jogador */
  get nome()  { return this._nome; }

  /** Getter: retorna o XP atual */
  get xp()    { return this._xp; }

  /** Getter: retorna o nível atual */
  get nivel() { return this._nivel; }

  /**
   * Adiciona XP ao jogador e atualiza o nível automaticamente.
   * @param {number} pontos - Quantidade de XP a adicionar
   * @returns {boolean} - True se houve level up
   */
  adicionarXP(pontos) {
    const nivelAntes = this._nivel;
    this._xp += pontos;                     // Soma o XP
    this._nivel = calcularNivel(this._xp);  // Recalcula o nível
    return this._nivel > nivelAntes;        // Retorna true se subiu de nível
  }

  /**
   * Retorna o nome do nível atual com base no nível numérico.
   * @returns {string} Título do nível
   */
  get tituloNivel() {
    return NIVEIS[this._nivel - 1] || NIVEIS[NIVEIS.length - 1];
  }

  /** Calcula o progresso até o próximo nível (0-100) */
  get progressoXP() {
    const xpPorNivel = 100; // XP necessário para cada nível
    return Math.min(100, (this._xp % xpPorNivel) / xpPorNivel * 100);
  }
}

/* ================================================================
   FASE 1: HERANÇA E POLIMORFISMO
   Classe base Questao e subclasses
================================================================ */

/**
 * Classe base Questao
 * Define a estrutura de uma questão genérica.
 */
class Questao {
  /**
   * @param {string} enunciado    - Texto da pergunta
   * @param {string} respCorreta  - Chave da resposta correta
   * @param {string} tipo         - Tipo da questão
   */
  constructor(enunciado, respCorreta, tipo) {
    this.enunciado   = enunciado;
    this.respCorreta = respCorreta;
    this.tipo        = tipo;
  }

  /**
   * Método polimórfico: valida a resposta do usuário.
   * @param {string} resposta - Resposta fornecida pelo usuário
   * @returns {boolean}
   */
  validarResposta(resposta) {
    return resposta === this.respCorreta;  // Operador relacional ==
  }

  /** @returns {string} Descrição do tipo da questão */
  get descricaoTipo() { return 'Questão Genérica'; }
}

/**
 * Classe QuestaoMultiplaEscolha — herda de Questao
 * Representa questões com 4 alternativas (A, B, C, D).
 */
class QuestaoMultiplaEscolha extends Questao {
  /**
   * @param {string}   enunciado   - Texto da pergunta
   * @param {Object}   alternativas - { a, b, c, d }
   * @param {string}   respCorreta - 'a' | 'b' | 'c' | 'd'
   */
  constructor(enunciado, alternativas, respCorreta) {
    super(enunciado, respCorreta, 'multipla_escolha');
    this.alternativas = alternativas;
  }

  /** @returns {string} */
  get descricaoTipo() { return 'Múltipla Escolha'; }
}

/**
 * Classe QuestaoVerdadeiroFalso — herda de Questao
 * Representa questões com apenas Verdadeiro ou Falso.
 */
class QuestaoVerdadeiroFalso extends Questao {
  /**
   * @param {string}  enunciado  - Texto da afirmação
   * @param {boolean} resposta   - true = Verdadeiro, false = Falso
   */
  constructor(enunciado, resposta) {
    super(enunciado, resposta ? 'v' : 'f', 'verdadeiro_falso');
    this.alternativas = { v: 'Verdadeiro', f: 'Falso' };
  }

  /** @returns {string} */
  get descricaoTipo() { return 'Verdadeiro ou Falso'; }
}

/* ================================================================
   FASE 3: BANCO DE DADOS (LEITURA DE ARQUIVOS SIMULADA)
   Simula leitura de arquivos .csv/.txt com as questões.
   Em produção: fetch('./questoes_python.csv').then(...)
================================================================ */

/**
 * Banco de questões organizado por tema.
 * Simula um arquivo CSV/TXT lido do sistema de arquivos.
 * Cada entrada usa instâncias das classes de Questao.
 * @type {Object.<string, Questao[]>}
 */
const BANCO_QUESTOES = {

  python: [
    // Questão 1 — Histórico do Python
    new QuestaoMultiplaEscolha(
      'Em que ano Guido van Rossum começou a desenvolver a linguagem Python?',
      { a: '1982', b: '1989', c: '1995', d: '2001' },
      'b'
    ),
    // Questão 2 — Paradigmas
    new QuestaoMultiplaEscolha(
      'Qual paradigma de programação o Python NÃO suporta nativamente?',
      { a: 'Orientado a Objetos', b: 'Funcional', c: 'Lógico (Prolog-style)', d: 'Procedural' },
      'c'
    ),
    // Questão 3 — Operadores
    new QuestaoMultiplaEscolha(
      'Qual é o resultado da expressão em Python: 17 // 5?',
      { a: '3.4', b: '3', c: '2', d: '4' },
      'b'
    ),
    // Questão 4 — Verdadeiro/Falso sobre tipagem
    new QuestaoVerdadeiroFalso(
      'Python é uma linguagem de tipagem estática, exigindo declaração explícita de tipos em todas as variáveis.',
      false
    ),
    // Questão 5 — Sistemas Operacionais e Embarcados
    new QuestaoMultiplaEscolha(
      'MicroPython é uma implementação do Python para qual categoria de dispositivos?',
      { a: 'Servidores de alto desempenho', b: 'Microcontroladores e sistemas embarcados', c: 'Computação em nuvem', d: 'Sistemas de banco de dados' },
      'b'
    ),
  ],

  php: [
    // Questão 1 — Histórico
    new QuestaoMultiplaEscolha(
      'PHP foi criado originalmente por Rasmus Lerdorf para qual finalidade?',
      { a: 'Computação científica', b: 'Gerenciar sua página pessoal na web', c: 'Desenvolvimento de jogos', d: 'Automação de sistemas operacionais' },
      'b'
    ),
    // Questão 2 — Paradigma
    new QuestaoVerdadeiroFalso(
      'PHP suporta programação Orientada a Objetos desde sua versão 5, com suporte a classes, herança e interfaces.',
      true
    ),
    // Questão 3 — Operadores
    new QuestaoMultiplaEscolha(
      'No PHP, o operador === (três iguais) verifica:',
      { a: 'Apenas o valor das variáveis', b: 'Apenas o tipo das variáveis', c: 'Valor e tipo das variáveis (identidade)', d: 'Apenas se a variável existe' },
      'c'
    ),
    // Questão 4 — Sistemas Web
    new QuestaoMultiplaEscolha(
      'Qual das alternativas descreve corretamente o modelo de execução padrão do PHP?',
      { a: 'Execução persistente como servidor sempre ativo', b: 'Interpretado a cada requisição HTTP pelo servidor web', c: 'Compilado em bytecode antes de ser servido', d: 'Executado no navegador do cliente' },
      'b'
    ),
    // Questão 5 — Paradigmas de Programação
    new QuestaoVerdadeiroFalso(
      'PHP é exclusivamente uma linguagem procedural e não permite a criação de funções anônimas (closures).',
      false
    ),
  ]
};

/* ================================================================
   RESUMOS DOS TEMAS (simulam leitura de arquivos .txt)
================================================================ */

/** @type {Object.<string, string>} Conteúdo HTML dos resumos por tema */
const RESUMOS = {
  python: `
    <p><strong>Python</strong> é uma linguagem de programação de alto nível criada por <strong>Guido van Rossum</strong>, com desenvolvimento iniciado em <strong>1989</strong> e primeira versão pública em 1991. O nome é uma homenagem ao grupo de comédia britânico <em>Monty Python</em>.</p>
    <div class="key-points">
      <div class="key-point"><div class="key-point-dot" style="background:#3b82f6"></div><span><strong>Paradigmas:</strong> Python é <em>multiparadigma</em> — suporta programação <code>procedural</code>, <code>orientada a objetos</code> e <code>funcional</code>.</span></div>
      <div class="key-point"><div class="key-point-dot" style="background:#3b82f6"></div><span><strong>Tipagem:</strong> Dinâmica e forte. Variáveis não precisam de tipo declarado, mas o tipo é verificado em operações.</span></div>
      <div class="key-point"><div class="key-point-dot" style="background:#3b82f6"></div><span><strong>Operadores:</strong> <code>//</code> divisão inteira, <code>**</code> potência, <code>%</code> módulo. Operadores de comparação retornam booleanos.</span></div>
      <div class="key-point"><div class="key-point-dot" style="background:#3b82f6"></div><span><strong>Embarcados:</strong> <code>MicroPython</code> permite rodar Python em microcontroladores como ESP32 e Raspberry Pi Pico.</span></div>
      <div class="key-point"><div class="key-point-dot" style="background:#3b82f6"></div><span><strong>Destaque:</strong> Filosofia do "código legível". Indentação é parte da sintaxe, não apenas estética.</span></div>
    </div>
  `,
  php: `
    <p><strong>PHP</strong> (Hypertext Preprocessor) é uma linguagem de script server-side criada por <strong>Rasmus Lerdorf</strong> em <strong>1993/1994</strong> para gerenciar sua página pessoal. Hoje é uma das linguagens web mais utilizadas no mundo.</p>
    <div class="key-points">
      <div class="key-point"><div class="key-point-dot" style="background:#a855f7"></div><span><strong>Paradigmas:</strong> Suporta <code>procedural</code>, <code>orientado a objetos</code> (desde PHP 5) e elementos de programação <code>funcional</code>.</span></div>
      <div class="key-point"><div class="key-point-dot" style="background:#a855f7"></div><span><strong>Execução:</strong> Interpretado pelo servidor (Apache, Nginx) a cada requisição HTTP. O resultado enviado ao navegador é HTML puro.</span></div>
      <div class="key-point"><div class="key-point-dot" style="background:#a855f7"></div><span><strong>Operadores:</strong> <code>==</code> compara valor, <code>===</code> compara valor e tipo. Operador <code>??</code> para null coalescing.</span></div>
      <div class="key-point"><div class="key-point-dot" style="background:#a855f7"></div><span><strong>POO:</strong> Classes com herança, interfaces, traits, métodos mágicos como <code>__construct()</code> e <code>__toString()</code>.</span></div>
      <div class="key-point"><div class="key-point-dot" style="background:#a855f7"></div><span><strong>Closures:</strong> PHP suporta funções anônimas e closures com a palavra-chave <code>use</code> para capturar variáveis do escopo externo.</span></div>
    </div>
  `
};

/* ================================================================
   FASE 2: MOTOR DO JOGO
   Funções, controle de fluxo, tipos e coleções
================================================================ */

/** @type {string[]} Lista de títulos de nível (coleção) */
const NIVEIS = [
  'Padawan',
  'Desenvolvedor Júnior',
  'Desenvolvedor Pleno',
  'Desenvolvedor Sênior',
  'Tech Lead',
  'Arquiteto de Software'
];

/** XP necessário para cada nível */
const XP_POR_NIVEL = 100;

/** XP ganho por acerto */
const XP_PRIMEIRA    = 50;
const XP_SEGUNDA     = 20;
const XP_ERRO        = 0;

// Estado global do jogo (dicionário/objeto)
let jogador       = null;  // Instância de Jogador
let temaAtual     = '';    // 'python' | 'php'
let questoes      = [];    // Array de Questao[]
let indexAtual    = 0;     // Índice da questão atual
let tentativas    = 0;     // Tentativas na questão atual (0 ou 1)
let acertosTotal  = 0;     // Total de acertos
let acertosPrimeira = 0;   // Acertos de primeira
let levelUpPendente = false;// Flag de level up aguardando modal

/**
 * Calcula o nível do jogador com base no XP.
 * @param {number} xpAtual - XP acumulado
 * @returns {number} Nível atual (mínimo 1)
 */
function calcularNivel(xpAtual) {
  // Controle de fluxo: divisão inteira para determinar nível
  const nivel = Math.floor(xpAtual / XP_POR_NIVEL) + 1;
  return Math.min(nivel, NIVEIS.length); // Limita ao nível máximo
}

/**
 * Exibe a questão atual na interface.
 * @param {string} tema - Tema selecionado (usado para estilização)
 */
function exibirQuestao(tema) {
  const questao = questoes[indexAtual];  // Acessa o banco de questões
  const total   = questoes.length;

  // Atualiza texto e tipo da questão
  document.getElementById('questionText').textContent    = questao.enunciado;
  document.getElementById('questionCounter').textContent = `Questão ${indexAtual + 1}/${total}`;

  // Badge de tipo — Polimorfismo: cada subclasse retorna seu descricaoTipo
  const typeBadge = document.getElementById('questionType');
  typeBadge.textContent = questao.descricaoTipo;
  typeBadge.className   = 'question-type-badge ' +
    (questao.tipo === 'multipla_escolha' ? 'badge-mc' : 'badge-tf');

  // Barra de progresso
  const pct = ((indexAtual) / total) * 100;
  const fill = document.getElementById('progressFill');
  fill.style.width = pct + '%';
  fill.className   = 'progress-fill ' + tema;

  // Gera os botões de alternativa dinamicamente
  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';

  const letras = ['A', 'B', 'C', 'D'];
  let idx = 0;

  // Itera sobre as alternativas do dicionário
  for (const [chave, texto] of Object.entries(questao.alternativas)) {
    const btn = document.createElement('button');
    btn.className   = 'option-btn';
    btn.dataset.key = chave;
    btn.innerHTML   = `<span class="option-letter">${letras[idx]}</span><span>${texto}</span>`;
    btn.onclick     = () => responder(chave);
    grid.appendChild(btn);
    idx++;
  }

  // Reseta feedback e botão de próxima
  document.getElementById('feedbackBox').className = 'feedback-box';
  document.getElementById('btnNext').style.display = 'none';
  tentativas = 0;  // Zera tentativas para a nova questão
}

/**
 * Processa a resposta do usuário.
 * Aplica lógica de XP: +50 na 1ª tentativa, +20 na 2ª, 0 no erro.
 * @param {string} chaveResposta - Chave da alternativa clicada
 */
function responder(chaveResposta) {
  const questao  = questoes[indexAtual];
  const correta  = questao.validarResposta(chaveResposta); // Polimorfismo
  const feedback = document.getElementById('feedbackBox');
  const btns     = document.querySelectorAll('.option-btn');

  tentativas++;  // Incrementa tentativas (controle de fluxo)

  if (correta) {
    // === ACERTO ===
    // Destaca botão correto
    btns.forEach(b => {
      b.disabled = true;
      if (b.dataset.key === chaveResposta) b.classList.add('correct');
    });

    // Calcula XP por tentativa (operadores relacionais)
    let xpGanho = (tentativas === 1) ? XP_PRIMEIRA : XP_SEGUNDA;
    acertosTotal++;
    if (tentativas === 1) acertosPrimeira++;

    // Adiciona XP ao jogador (Encapsulamento: método adicionarXP)
    const levelUp = jogador.adicionarXP(xpGanho);
    atualizarHUD();

    // Feedback visual de sucesso
    feedback.className   = 'feedback-box show success';
    document.getElementById('feedbackIcon').textContent = '✓';
    document.getElementById('feedbackText').textContent =
      tentativas === 1 ? `+${xpGanho} XP — Perfeito! Acertou de primeira!`
                       : `+${xpGanho} XP — Correto na segunda tentativa!`;

    // Animação de XP flutuante
    mostrarXPFlutuante('+' + xpGanho + ' XP');

    // Verifica level up
    if (levelUp) mostrarLevelUp();

    document.getElementById('btnNext').style.display = 'block';

  } else {
    // === ERRO ===
    btns.forEach(b => {
      if (b.dataset.key === chaveResposta) {
        b.classList.add('wrong');
        b.disabled = true;  // Desabilita apenas a errada
      }
    });

    if (tentativas >= 2) {
      // Segunda tentativa errada: revela correta e encerra
      btns.forEach(b => {
        b.disabled = true;
        if (b.dataset.key === questao.respCorreta) b.classList.add('correct');
      });
      feedback.className   = 'feedback-box show error';
      document.getElementById('feedbackIcon').textContent = '✗';
      document.getElementById('feedbackText').textContent = `0 XP — Não foi dessa vez. A resposta correta foi marcada.`;
      document.getElementById('btnNext').style.display = 'block';
    } else {
      // Primeira tentativa errada: dá mais uma chance
      feedback.className   = 'feedback-box show warning';
      document.getElementById('feedbackIcon').textContent = '!';
      document.getElementById('feedbackText').textContent = `Errou! Você ainda tem uma tentativa. Um acerto agora vale +${XP_SEGUNDA} XP.`;
    }
  }
}

/**
 * Avança para a próxima questão ou exibe o resultado final.
 */
function nextQuestion() {
  indexAtual++;  // Incrementa índice (operador aritmético)

  if (indexAtual < questoes.length) {
    // Ainda há questões: exibe a próxima
    exibirQuestao(temaAtual);
  } else {
    // Todas as questões respondidas: tela de resultado
    mostrarResultado();
  }
}

/* ================================================================
   FUNÇÕES DE NAVEGAÇÃO E UI
================================================================ */

/** Inicia o jogo após o jogador digitar o nome */
function startGame() {
  const nome = document.getElementById('playerNameInput').value.trim();

  // Validação simples de entrada
  if (!nome) {
    document.getElementById('playerNameInput').focus();
    return;
  }

  // Instancia o Jogador (POO)
  jogador = new Jogador(nome);
  atualizarHUD();

  document.getElementById('greetingTitle').textContent = `Olá, ${jogador.nome}! 👋`;
  document.getElementById('playerHud').classList.add('visible');
  document.getElementById('hudAvatar').textContent = nome[0].toUpperCase();

  showScreen('screen-topic');
}

/**
 * Seleciona o tema e exibe o resumo correspondente.
 * @param {string} tema - 'python' | 'php'
 */
function selectTopic(tema) {
  temaAtual = tema;

  // Preenche a tela de resumo com dados do "arquivo" (RESUMOS)
  document.getElementById('summaryLabel').textContent =
    tema + ' · resumo antes do quiz';
  document.getElementById('summaryTitle').textContent =
    tema === 'python' ? '🐍 Python' : '🐘 PHP';
  document.getElementById('summaryContent').innerHTML = RESUMOS[tema];

  showScreen('screen-summary');
}

/** Inicia o quiz com as questões do tema selecionado */
function startQuiz() {
  // Carrega as questões do banco (coleção/lista)
  questoes       = BANCO_QUESTOES[temaAtual];
  indexAtual     = 0;
  acertosTotal   = 0;
  acertosPrimeira = 0;

  showScreen('screen-quiz');
  exibirQuestao(temaAtual);
}

/** Exibe a tela de resultado final */
function mostrarResultado() {
  const pct = Math.round((acertosTotal / questoes.length) * 100);

  // Define troféu e título com base na performance
  let trofeu = '🏆', titulo = 'Quiz Concluído!';
  if (pct === 100)      { trofeu = '🥇'; titulo = 'Resultado Perfeito!'; }
  else if (pct >= 80)   { trofeu = '🥈'; titulo = 'Excelente!'; }
  else if (pct >= 60)   { trofeu = '🥉'; titulo = 'Bom trabalho!'; }
  else if (pct < 40)    { trofeu = '📚'; titulo = 'Continue estudando!'; }

  document.getElementById('resultTrophy').textContent  = trofeu;
  document.getElementById('resultTitle').textContent   = titulo;
  document.getElementById('statXP').textContent        = jogador.xp;
  document.getElementById('statCorrect').textContent   = `${acertosTotal}/${questoes.length}`;
  document.getElementById('statFirst').textContent     = acertosPrimeira;
  document.getElementById('resultLevel').textContent   = `Nível ${jogador.nivel} — ${jogador.tituloNivel}`;

  showScreen('screen-result');
}

/** Volta para a seleção de tema */
function goToTopicSelection() {
  showScreen('screen-topic');
}

/** Repete o quiz do tema atual */
function retryQuiz() {
  startQuiz();
}

/** Atualiza o HUD do jogador com os dados atuais */
function atualizarHUD() {
  document.getElementById('hudName').textContent  = jogador.nome;
  document.getElementById('hudLevel').textContent = `Nv. ${jogador.nivel} · ${jogador.tituloNivel}`;
  document.getElementById('hudXp').textContent    = jogador.xp + ' XP';
  document.getElementById('hudXpBar').style.width = jogador.progressoXP + '%';
}

/**
 * Exibe uma animação de XP flutuante na tela.
 * @param {string} texto - Texto a exibir (ex: "+50 XP")
 */
function mostrarXPFlutuante(texto) {
  const el = document.createElement('div');
  el.className   = 'xp-float';
  el.textContent = texto;
  // Posição aleatória no centro superior da tela
  el.style.left  = (40 + Math.random() * 20) + '%';
  el.style.top   = '40%';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

/** Exibe modal de Level Up */
function mostrarLevelUp() {
  const modal = document.getElementById('levelUpModal');
  document.getElementById('levelUpText').textContent =
    `Você é agora: Nível ${jogador.nivel} — ${jogador.tituloNivel}!`;
  modal.classList.add('show');
}

/** Fecha o modal de Level Up */
function closeLevelUp() {
  document.getElementById('levelUpModal').classList.remove('show');
}

/**
 * Controla a exibição das telas (máquina de estados simples).
 * @param {string} id - ID da tela a exibir
 */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Permite confirmar com Enter no campo de nome
document.getElementById('playerNameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') startGame();
});