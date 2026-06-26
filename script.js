/* ═══════════════════════════════════════════════════════════
   DEBM — script.js
   Different Exercise Behavior Mapping
   ─────────────────────────────────────────────────────────
   1.  QUESTIONS
   2.  RESULT TYPES
   3.  STATE
   4.  UTILS
   5.  SCREEN MANAGER
   6.  QUIZ ENGINE
   7.  LOADING ENGINE
   8.  RESULT RENDERER
   9.  SCROLL ANIMATIONS
   10. INIT
═══════════════════════════════════════════════════════════ */

/* ── 1. QUESTIONS ──────────────────────────────────────────
   Each option maps to weighted scores across 8 patterns:
   emotion / selftalk / thinking / environment /
   motivation / behavior / recovery / relationship
─────────────────────────────────────────────────────────── */
const QUESTIONS = [
  {
    text: "퇴근 후 오늘 운동을 안 가는 날.\n가장 먼저 드는 생각은?",
    tag: "감정 패턴",
    options: [
      { text: "오늘 너무 힘들어.",           scores: { emotion: 3, behavior: 1 } },
      { text: "내일부터 하면 되지.",           scores: { selftalk: 2, recovery: 1, thinking: 1 } },
      { text: "오늘 하루 정도는 괜찮아.",       scores: { thinking: 2, behavior: 1 } },
      { text: "운동보다 그냥 쉬고 싶다.",       scores: { emotion: 2, environment: 2 } }
    ]
  },
  {
    text: "운동을 쉬기 시작하면\n보통 얼마나 쉬나요?",
    tag: "회복 패턴",
    options: [
      { text: "하루 정도",                     scores: { recovery: 3 } },
      { text: "2~3일",                         scores: { recovery: 2, behavior: 1 } },
      { text: "일주일 이상",                   scores: { behavior: 3, recovery: 1 } },
      { text: "다시 시작하기가 너무 어렵다.",   scores: { selftalk: 3, recovery: 2 } }
    ]
  },
  {
    text: "운동을 못한 날\n가장 많이 하는 생각은?",
    tag: "자기대화 패턴",
    options: [
      { text: "내일부터 하지.",                 scores: { thinking: 2, behavior: 1 } },
      { text: "오늘은 어쩔 수 없어.",           scores: { thinking: 2, environment: 1 } },
      { text: "나는 원래 오래 못 가.",           scores: { selftalk: 3, thinking: 1 } },
      { text: "왜 나는 항상 이럴까.",           scores: { selftalk: 2, emotion: 2 } }
    ]
  },
  {
    text: "스트레스를 많이 받은 날\n가장 먼저 하는 행동은?",
    tag: "감정 패턴",
    options: [
      { text: "그냥 눕는다.",                   scores: { emotion: 2, behavior: 2 } },
      { text: "핸드폰을 계속 본다.",             scores: { emotion: 1, environment: 2, behavior: 1 } },
      { text: "음식을 먹는다.",                 scores: { emotion: 3, behavior: 2 } },
      { text: "아무것도 하기 싫다.",             scores: { emotion: 3, motivation: 1 } }
    ]
  },
  {
    text: "운동이 가장 잘되는 날은?",
    tag: "동기 패턴",
    options: [
      { text: "누가 같이 있을 때",               scores: { relationship: 3, motivation: 1 } },
      { text: "기분이 좋을 때",                  scores: { emotion: 3, motivation: 1 } },
      { text: "일정이 규칙적일 때",               scores: { environment: 3, behavior: 1 } },
      { text: "뚜렷한 목표가 있을 때",           scores: { motivation: 3, thinking: 1 } }
    ]
  },
  {
    text: "운동을 오래 쉬게 되는\n가장 큰 계기는?",
    tag: "행동 패턴",
    options: [
      { text: "하루만 쉬자는 생각",               scores: { thinking: 2, behavior: 2 } },
      { text: "야근이나 갑작스러운 일정 변화",     scores: { environment: 3, behavior: 1 } },
      { text: "몸이 피곤한 느낌",                 scores: { emotion: 2, environment: 1, behavior: 1 } },
      { text: "한 번 못했으니 이미 망했다는 생각", scores: { selftalk: 3, thinking: 1, recovery: 1 } }
    ]
  },
  {
    text: "운동을 시작할 때는\n어떤 편인가요?",
    tag: "사고 패턴",
    options: [
      { text: "그냥 바로 시작한다.",               scores: { motivation: 2, behavior: 2 } },
      { text: "계획을 꼼꼼히 세운 뒤 시작한다.",   scores: { thinking: 2, environment: 1, behavior: 1 } },
      { text: "완벽하게 준비가 되어야 시작한다.",   scores: { thinking: 3, selftalk: 1 } },
      { text: "계속 미루다가 갑자기 시작한다.",     scores: { behavior: 2, emotion: 1, recovery: 1 } }
    ]
  },
  {
    text: "운동을 며칠 쉬면\n가장 먼저 드는 생각은?",
    tag: "회복 패턴",
    options: [
      { text: "빨리 다시 해야겠다.",               scores: { recovery: 3, motivation: 1 } },
      { text: "이미 늦었다.",                       scores: { selftalk: 2, thinking: 2 } },
      { text: "다음 주부터 다시 하자.",             scores: { thinking: 2, behavior: 2 } },
      { text: "이번에도 실패했네.",                 scores: { selftalk: 3, emotion: 2 } }
    ]
  },
  {
    text: "누군가 운동하자고 하면?",
    tag: "관계 패턴",
    options: [
      { text: "바로 간다.",                         scores: { relationship: 3, motivation: 2 } },
      { text: "고민하다가 간다.",                   scores: { relationship: 2, thinking: 1 } },
      { text: "상황을 봐서 결정한다.",               scores: { environment: 2, relationship: 1 } },
      { text: "대부분 거절하게 된다.",               scores: { motivation: 2, emotion: 1, relationship: 1 } }
    ]
  },
  {
    text: "다이어트를 시작하면?",
    tag: "행동 패턴",
    options: [
      { text: "꽤 오래 유지하는 편이다.",           scores: { behavior: 3, recovery: 2 } },
      { text: "초반에만 열심히 하다 흐지부지된다.", scores: { motivation: 2, behavior: 2 } },
      { text: "며칠 잘하다가 갑자기 무너진다.",     scores: { behavior: 2, emotion: 2, recovery: 1 } },
      { text: "항상 비슷한 시점에 포기한다.",       scores: { behavior: 3, selftalk: 2 } }
    ]
  },
  {
    text: "운동을 포기하게 되는\n가장 큰 이유는?",
    tag: "동기 패턴",
    options: [
      { text: "시간이 없어서",                      scores: { environment: 3, thinking: 1 } },
      { text: "몸이 피곤해서",                      scores: { emotion: 2, environment: 2 } },
      { text: "의욕이 없어서",                      scores: { motivation: 3, emotion: 1 } },
      { text: "마음이 지쳐서",                      scores: { emotion: 3, selftalk: 1 } }
    ]
  },
  {
    text: "당신과 가장 가까운\n문장은?",
    tag: "자기대화 패턴",
    options: [
      { text: "운동은 해야 한다.",                   scores: { thinking: 2, selftalk: 1 } },
      { text: "운동은 하고 싶다.",                   scores: { motivation: 3 } },
      { text: "운동을 꾸준히 하고 싶다.",            scores: { behavior: 2, motivation: 2 } },
      { text: "왜 항상 반복될까?",                   scores: { selftalk: 3, thinking: 1, emotion: 2 } }
    ]
  }
];

/* ── 2. RESULT TYPES ───────────────────────────────────────
   8 types, one per dominant pattern.
   titleEm = the highlighted phrase in the result headline.
─────────────────────────────────────────────────────────── */
const RESULTS = {

  emotion: {
    icon: "🌊",
    titleEm: "감정이 흔들리는 순간<br>운동도 함께 멈추는 패턴",
    sub: "당신은 운동을 싫어하는 사람이 아닙니다.\n감정이 흔들리는 순간 행동도 함께 멈추는 패턴이 반복되고 있습니다.",
    recs: [
      "운동을 못 한 것보다 '또 못 했네…' 하며 나 자신을 더 오래 탓한다.",
      "'오늘은 너무 힘들어.' 한마디가 어느새 일주일의 공백이 된다.",
      "스트레스받은 날은 운동 생각이 완전히 사라진다.",
      "운동하는 사람을 보면 자극보다 자책이 먼저 든다.",
      "운동은 해야 한다는 걸 누구보다 잘 아는데, 막상 몸은 움직이지 않는다."
    ],
    patTitle: "당신은 운동을 포기하는 사람이 아닙니다.",
    patBody: "감정이 회복될 때까지 행동도 함께 멈추는 사람입니다.\n\n운동 계획보다 먼저 무너지는 것은 기분입니다. 그리고 운동을 다시 시작하지 못하게 만드는 것도 의지가 아니라 감정의 여운입니다.",
    loop: ["퇴근", "'오늘 너무 힘들다.'", "운동 미루기", "죄책감", "야식 or 폰", "'내일부터 하지 뭐.'", "운동 중단"]
  },

  selftalk: {
    icon: "🔮",
    titleEm: "스스로에게 하는 말이<br>행동을 멈추게 만드는 패턴",
    sub: "당신은 의지가 없는 사람이 아닙니다.\n스스로에게 하는 말이 행동보다 먼저 무너지고 있습니다.",
    recs: [
      "'어차피 나는 오래 못 가는 사람이야.' 라는 생각이 시작 전부터 깔려 있다.",
      "조금만 실수해도 나 자신에게 상당히 가혹한 말을 한다.",
      "살이 찌는 것보다 '나는 역시 의지가 없어'라는 생각이 더 괴롭다.",
      "운동을 쉰 날 '이미 이번 달은 망했다'고 자동으로 생각한다.",
      "다시 시작할 때도 '이번에도 어차피...'가 먼저 머릿속에 떠오른다."
    ],
    patTitle: "당신은 의지가 없는 사람이 아닙니다.",
    patBody: "자기 자신에게 하는 말이 행동보다 먼저 무너지는 패턴입니다.\n\n운동을 시작하기 전부터 '어차피 또 실패하겠지'라는 말이 먼저 옵니다. 그 말이 발걸음을 막고 있었습니다.",
    loop: ["운동 계획", "'어차피 또 실패하겠지'", "시작 망설임", "하루 미룸", "자기비판", "'나는 원래 이래'", "포기"]
  },

  thinking: {
    icon: "💭",
    titleEm: "생각이 많을수록<br>행동이 굳어지는 패턴",
    sub: "당신은 운동을 모르는 사람이 아닙니다.\n생각과 계획이 행동을 앞서는 패턴이 반복되고 있습니다.",
    recs: [
      "완벽한 루틴을 짜야 시작할 수 있다고 생각한다.",
      "계획이 조금이라도 틀어지면 아예 다음 주로 미룬다.",
      "운동 방법은 누구보다 잘 알지만, 정작 행동이 따라오지 않는다.",
      "시작 전에 너무 많은 것을 고민하느라 정작 시작이 계속 늦어진다.",
      "'다음 달 1일부터 다시 시작하자'는 말을 반복한 적이 여러 번 있다."
    ],
    patTitle: "당신은 운동을 모르는 사람이 아닙니다.",
    patBody: "생각이 행동보다 빠르게 달려가는 패턴입니다.\n\n완벽한 계획을 세우려는 순간, 오히려 시작이 늦어집니다. 그리고 한 번 어긋난 계획은 전체 포기로 이어집니다.",
    loop: ["운동 다짐", "완벽한 루틴 구상", "일정 조율 중", "하루 어긋남", "'이미 계획이 틀어졌다'", "다음 달로 연기", "반복"]
  },

  environment: {
    icon: "🌿",
    titleEm: "환경이 바뀌는 순간<br>운동도 함께 사라지는 패턴",
    sub: "당신은 의지가 부족한 사람이 아닙니다.\n환경의 변화에 민감하게 반응하는 패턴이 반복되고 있습니다.",
    recs: [
      "야근이 생기면 그 주 운동은 자연스럽게 끝나버린다.",
      "헬스장 위치가 조금만 불편해도 가기가 갑자기 부담스럽다.",
      "날씨나 피곤함 같은 외부 변수가 운동 여부를 결정한다.",
      "주변 환경이 바뀌면 힘들게 쌓은 운동 루틴이 완전히 무너진다.",
      "누군가 같이 하거나 PT가 있을 때는 꽤 꾸준히 되는 편이다."
    ],
    patTitle: "당신은 의지가 부족한 사람이 아닙니다.",
    patBody: "환경의 변화에 민감하게 반응하는 패턴입니다.\n\n환경이 받쳐주면 운동이 됩니다. 하지만 환경이 흔들리면 행동도 함께 흔들립니다. 이것은 약함이 아니라 패턴입니다.",
    loop: ["운동 루틴 형성", "일정 변화 발생", "'오늘 하루만 쉬자'", "환경 변화 지속", "루틴 붕괴", "'다음 주부터 다시'", "반복"]
  },

  motivation: {
    icon: "⚡",
    titleEm: "이유를 잃는 순간<br>행동도 함께 사라지는 패턴",
    sub: "당신은 열심히 하지 않는 사람이 아닙니다.\n강한 이유가 있을 때는 누구보다 잘하는 사람입니다.",
    recs: [
      "결혼식, 여행, 소개팅 같은 이벤트가 있으면 강하게 불이 붙는다.",
      "이벤트가 끝나면 동기도 자연스럽게 함께 꺼진다.",
      "'왜 운동해야 하지?'라는 질문에 답이 흐릿해지는 순간 멈춘다.",
      "목표가 사라지면 그동안의 습관도 함께 사라진다.",
      "혼자 할 때보다 누가 봐주거나 함께할 때 훨씬 더 열심히 하게 된다."
    ],
    patTitle: "당신은 열심히 하지 않는 사람이 아닙니다.",
    patBody: "강한 이유가 있을 때는 누구보다 집중하는 사람입니다.\n\n하지만 그 이유가 흐릿해지는 순간, 행동도 함께 멈춥니다. 문제는 의지가 아니라 동기의 설계입니다.",
    loop: ["강한 목표 설정", "초반 폭발적 실행", "목표 점점 희미해짐", "'왜 해야 하지?'", "의욕 저하", "점점 빠지기 시작", "자연스러운 중단"]
  },

  behavior: {
    icon: "🔁",
    titleEm: "항상 같은 지점에서<br>같은 이유로 멈추는 패턴",
    sub: "당신은 처음부터 포기하는 사람이 아닙니다.\n정확히 같은 지점에서 같은 방식으로 멈추는 패턴이 있습니다.",
    recs: [
      "운동을 시작하고 2~3주쯤 되면 항상 비슷한 이유로 멈춘다.",
      "다이어트를 시작하면 항상 비슷한 시점에 무너진다.",
      "처음에는 의욕적으로 시작하지만 어느 순간 자연스럽게 가지 않게 된다.",
      "몇 번을 반복해도 비슷한 흐름이 계속 반복된다.",
      "'왜 나는 항상 여기서 멈추지?'라는 생각을 자주 한다."
    ],
    patTitle: "당신은 처음부터 포기하는 사람이 아닙니다.",
    patBody: "정확히 같은 지점에서 같은 방식으로 멈추는 패턴이 있습니다.\n\n이건 의지력의 문제가 아닙니다. 무의식적으로 반복되는 행동의 구조입니다. 그 구조를 바꾸지 않으면 어떤 방법도 같은 결과를 만듭니다.",
    loop: ["의욕적으로 시작", "2~3주 유지", "특정 트리거 발생", "하루 이틀 쉼", "'이미 늦었다'", "루틴 붕괴", "처음으로 돌아감"]
  },

  recovery: {
    icon: "🌱",
    titleEm: "한 번 무너진 뒤<br>다시 시작이 가장 어려운 패턴",
    sub: "당신은 오래 포기하는 사람이 아닙니다.\n한 번 멈춘 뒤 다시 시작하는 데 너무 많은 에너지가 필요한 패턴입니다.",
    recs: [
      "운동을 쉬면 다시 시작하기까지 생각보다 시간이 오래 걸린다.",
      "'이미 망했다'는 생각이 들면 한동안 아무것도 안 하게 된다.",
      "한 번 무너지면 다음에는 더 완벽하게 시작하려다 또 미룬다.",
      "다시 시작하는 게 운동 자체보다 훨씬 더 어렵다.",
      "회복하는 데 드는 에너지가 너무 커서 시작 자체가 두렵다."
    ],
    patTitle: "당신은 오래 포기하는 사람이 아닙니다.",
    patBody: "한 번 멈춘 뒤 다시 시작하는 데 너무 많은 에너지가 필요한 패턴입니다.\n\n무너지는 것보다 회복하는 것이 더 어렵습니다. 그것은 약함이 아니라, 회복 전략이 아직 없다는 신호입니다.",
    loop: ["운동 진행 중", "예상치 못한 공백", "죄책감 발생", "'이미 늦었다'", "더 긴 공백", "다시 시작 두려움", "완벽한 타이밍 기다림"]
  },

  relationship: {
    icon: "🤝",
    titleEm: "혼자서는 유지하기 어렵지만<br>함께할 때 가장 강해지는 패턴",
    sub: "당신은 의지가 없는 사람이 아닙니다.\n관계와 환경에서 동기를 찾는 사람입니다.",
    recs: [
      "혼자 운동하면 빠지는 날이 많지만, 누가 같이 하면 꼭 간다.",
      "PT를 등록하면 잘 가는데, 혼자 헬스장에 가는 건 이상하게 어렵다.",
      "운동 친구가 생기면 꾸준히 되는 시기가 찾아온다.",
      "누군가 기다리고 있거나 봐줄 때 훨씬 더 열심히 하게 된다.",
      "혼자 있을 때는 운동 동기가 특히 쉽게 사라진다."
    ],
    patTitle: "당신은 의지가 없는 사람이 아닙니다.",
    patBody: "관계와 환경에서 동기를 찾는 사람입니다.\n\n이것은 약점이 아닙니다. 당신이 움직이는 방식이 다를 뿐입니다. 혼자 하는 운동보다 함께하는 구조가 당신에게 더 맞습니다.",
    loop: ["혼자 운동 다짐", "이틀 실행", "외로움 / 지루함", "빠지는 날 발생", "혼자 회복 어려움", "루틴 중단", "다시 등록"]
  }
};

/* ── 3. STATE ──────────────────────────────────────────────*/
const state = {
  currentQ: 0,
  hasChosen: false,
  scores: { emotion:0, selftalk:0, thinking:0, environment:0, motivation:0, behavior:0, recovery:0, relationship:0 }
};

/* ── 4. UTILS ──────────────────────────────────────────────*/
const get   = (id)  => document.getElementById(id);
const qAll  = (sel) => document.querySelectorAll(sel);

/* ── 5. SCREEN MANAGER ─────────────────────────────────────*/
const SCREENS = ['screen-land', 'screen-quiz', 'screen-load', 'screen-result'];

function showScreen(targetId) {
  SCREENS.forEach(id => {
    const el = get(id);
    if (!el) return;
    if (id === targetId) {
      el.classList.remove('hidden');
      el.classList.add('screen-enter');
    } else {
      el.classList.add('hidden');
      el.classList.remove('screen-enter');
    }
  });
}

/* ── 6. QUIZ ENGINE ────────────────────────────────────────*/
function startQuiz() {
  // Reset state
  state.currentQ = 0;
  state.hasChosen = false;
  Object.keys(state.scores).forEach(k => { state.scores[k] = 0; });

  showScreen('screen-quiz');
  document.body.style.overflow = 'hidden';
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[state.currentQ];
  state.hasChosen = false;

  // Update header
  get('q-num').textContent = state.currentQ + 1;
  get('q-tag').textContent = q.tag;
  get('qprog-fill').style.width = `${(state.currentQ / QUESTIONS.length) * 100}%`;

  const body = get('quiz-body');

  // Exit animation
  body.classList.add('is-exiting');

  setTimeout(() => {
    // Render new question
    body.innerHTML = `
      <p class="q-text">${q.text.replace(/\n/g, '<br>')}</p>
      <div class="q-opts">
        ${q.options.map((opt, i) => `
          <button class="q-opt" data-i="${i}">${opt.text}</button>
        `).join('')}
      </div>
    `;

    // Bind clicks
    body.querySelectorAll('.q-opt').forEach(btn => {
      btn.addEventListener('click', () => chooseOption(parseInt(btn.dataset.i)));
    });

    // Enter animation
    body.classList.remove('is-exiting');
    body.style.opacity = '0';
    body.style.transform = 'translateY(16px)';

    requestAnimationFrame(() => {
      body.style.transition = 'opacity 0.38s ease, transform 0.38s ease';
      body.style.opacity = '1';
      body.style.transform = 'translateY(0)';
    });
  }, 230);
}

function chooseOption(idx) {
  if (state.hasChosen) return;
  state.hasChosen = true;

  // Visual feedback
  const opts = qAll('.q-opt');
  opts[idx].classList.add('is-selected');
  opts.forEach((btn, i) => { if (i !== idx) btn.classList.add('is-dim'); });

  // Accumulate scores
  const scoreMap = QUESTIONS[state.currentQ].options[idx].scores;
  Object.entries(scoreMap).forEach(([key, val]) => {
    state.scores[key] = (state.scores[key] || 0) + val;
  });

  // Advance
  setTimeout(() => {
    state.currentQ++;
    if (state.currentQ >= QUESTIONS.length) {
      startLoading();
    } else {
      renderQuestion();
    }
  }, 400);
}

/* ── 7. LOADING ENGINE ─────────────────────────────────────*/
function startLoading() {
  showScreen('screen-load');

  const CIRCUMFERENCE = 2 * Math.PI * 42; // ≈ 263.9
  const ring = get('load-ring');
  ring.style.strokeDasharray  = CIRCUMFERENCE;
  ring.style.strokeDashoffset = CIRCUMFERENCE;

  const steps = [
    { pct: 18,  msg: "행동패턴 분석 중..." },
    { pct: 41,  msg: "감정 패턴 확인 중..." },
    { pct: 63,  msg: "행동 루프 생성 중..." },
    { pct: 82,  msg: "운동 지속성 분석 중..." },
    { pct: 100, msg: "맞춤 전략 생성 중..." }
  ];

  let i = 0;

  function tick() {
    if (i >= steps.length) { setTimeout(renderResult, 500); return; }

    const { pct, msg } = steps[i];

    // Ring progress
    ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct / 100);
    get('load-pct').textContent  = `${pct}%`;

    // Message fade swap
    const msgEl = get('load-msg');
    msgEl.style.opacity = '0';
    setTimeout(() => { msgEl.textContent = msg; msgEl.style.opacity = '1'; }, 220);

    i++;
    setTimeout(tick, 620);
  }

  setTimeout(tick, 350);
}

/* ── 8. RESULT RENDERER ────────────────────────────────────*/
function getTopPattern() {
  return Object.entries(state.scores)
    .sort((a, b) => b[1] - a[1])[0][0];
}

function renderResult() {
  showScreen('screen-result');
  document.body.style.overflow = '';
  window.scrollTo(0, 0);

  const key = getTopPattern();
  const R   = RESULTS[key];

  // ── Hero
  get('res-icon').textContent = R.icon;

  get('res-title').innerHTML =
    `당신은<br><em>${R.titleEm}</em>이<br>가장 강하게 나타났습니다.`;

  get('res-sub').innerHTML = R.sub.replace(/\n/g, '<br>');

  // ── Recognition cards
  get('recog-list').innerHTML = R.recs.map(r => `
    <div class="recog-card anim-up">
      <span class="recog-check">✔</span>${r}
    </div>
  `).join('');

  // ── Pattern analysis
  get('pat-title').textContent = R.patTitle;
  get('pat-body').innerHTML    = R.patBody.replace(/\n/g, '<br>');

  // ── Behavior loop
  get('loop-list').innerHTML = R.loop.map((item, i) => `
    <div class="loop-step" style="transition-delay:${i * 0.1}s">
      <div class="loop-dot"></div>
      <div class="loop-text">${item}</div>
    </div>
    ${i < R.loop.length - 1 ? '<div class="loop-arrow">↓</div>' : ''}
  `).join('');

  // ── Trigger animations after paint
  setTimeout(() => {
    initScrollObserver();

    // Stagger loop steps
    qAll('.loop-step').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), i * 130 + 500);
    });
  }, 200);
}

/* ── 9. SCROLL ANIMATIONS ──────────────────────────────────*/
function initScrollObserver() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });

  qAll('.anim-up').forEach(el => io.observe(el));
}

/* ── 10. INIT ──────────────────────────────────────────────*/
function init() {
  // Start buttons (landing page — multiple)
  qAll('.js-start').forEach(btn => {
    btn.addEventListener('click', startQuiz);
  });

  // Kakao CTA
  const kakaoBtn = document.querySelector('.js-kakao');
  if (kakaoBtn) {
    kakaoBtn.addEventListener('click', () => {
      // 실제 카카오 채널 URL로 교체하세요
      window.open('https://pf.kakao.com/_your_channel', '_blank');
    });
  }

  // Init scroll animations for landing page
  initScrollObserver();
}

document.addEventListener('DOMContentLoaded', init);
