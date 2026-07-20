/**
 * FIT-TI — script.js
 * App State · Screen Manager · Quiz Engine · Loading · Result Renderer
 */

// ── STATE ─────────────────────────────────────────────────
const App = { selectedCodes: [], currentQ: 0, locked: false };

// ── UTILS ─────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = s => document.querySelectorAll(s);

// ── SCREENS ───────────────────────────────────────────────
function show(id) {
  ['landing','quiz-screen','loading-screen','result-screen'].forEach(sid => {
    const el = $(sid);
    if (!el) return;
    if (sid === id) {
      el.classList.remove('hidden');
      el.style.display = '';
    } else {
      el.classList.add('hidden');
    }
  });
  if (id !== 'landing') {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// ── START ─────────────────────────────────────────────────
function startTest() {
  App.selectedCodes = [];
  App.currentQ = 0;
  App.locked = false;
  show('quiz-screen');
  window.scrollTo(0, 0);
  renderQuestion();
}

// ── QUIZ ──────────────────────────────────────────────────
function renderQuestion() {
  const q = QUESTIONS[App.currentQ];
  const total = QUESTIONS.length;
  const pct = (App.currentQ / total) * 100;

  // Progress
  $('q-progress').style.width = pct + '%';
  $('q-counter').textContent = `${App.currentQ + 1} / ${total}`;

  // Animate out
  const body = $('q-body');
  body.classList.remove('fade-in');
  body.classList.add('fade-out');

  setTimeout(() => {
    // Question text
    $('q-text').innerHTML = q.q.replace(/\n/g, '<br>');

    // Answers
    const wrap = $('q-answers');
    wrap.innerHTML = '';
    App.locked = false;

    q.answers.forEach((a, i) => {
      const btn = document.createElement('button');
      btn.className = 'a-btn';
      btn.textContent = a.text;
      btn.style.setProperty('--delay', `${i * 0.07}s`);
      btn.addEventListener('click', () => choose(a.code, btn));
      wrap.appendChild(btn);
    });

    body.classList.remove('fade-out');
    body.classList.add('fade-in');
  }, 240);
}

function choose(code, btn) {
  if (App.locked) return;
  App.locked = true;

  // Visual feedback
  $$('.a-btn').forEach(b => b.classList.add('dim'));
  btn.classList.remove('dim');
  btn.classList.add('chosen');

  App.selectedCodes.push(code);

  setTimeout(() => {
    App.currentQ++;
    if (App.currentQ >= QUESTIONS.length) {
      startLoading();
    } else {
      renderQuestion();
    }
  }, 460);
}

// ── LOADING ───────────────────────────────────────────────
function startLoading() {
  show('loading-screen');
  document.body.style.overflow = 'hidden';

  const C = 2 * Math.PI * 52;
  const ring = $('l-ring');
  ring.style.strokeDasharray = C;
  ring.style.strokeDashoffset = C;

  const msgs = [
    '행동 패턴 분석 중...',
    '결정 구조 확인 중...',
    '반복 패턴 매핑 중...',
    '결과 생성 중...',
    '완료'
  ];

  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(p + 1.6, 100);
    ring.style.strokeDashoffset = C * (1 - p / 100);
    $('l-pct').textContent = Math.floor(p) + '%';
    $('l-msg').textContent = msgs[Math.min(Math.floor(p / 22), 4)];
    if (p >= 100) { clearInterval(iv); setTimeout(showResult, 400); }
  }, 30);
}

// ── RESULT ────────────────────────────────────────────────
function showResult() {
  const R = calculateResult(App.selectedCodes);
  renderResult(R);
  show('result-screen');
  document.body.style.overflow = '';
  window.scrollTo(0, 0);
}

function renderResult(R) {
  const el = $('result-screen');

  el.innerHTML = `
    <nav class="r-nav">
      <span class="r-nav-logo">FIT-TI</span>
      <button class="r-nav-retry" onclick="location.reload()">다시 검사하기</button>
    </nav>

    <section class="r-hero">
      <div class="r-hero-bg"></div>
      <div class="r-hero-inner">
        <span class="r-badge">FIT-TI RESULT</span>
        <div class="r-icon">${R.icon}</div>
        <h1 class="r-name">${R.name}</h1>
        <p class="r-subtitle">${R.subtitle}</p>
        <p class="r-desc">${R.description}</p>
      </div>
    </section>

    <section class="r-section">
      <div class="r-inner">
        <h2 class="r-sec-title">"이런 모습이 익숙하지 않으신가요?"</h2>
        <div class="r-recs">
          ${R.recs.map((r,i) => `
            <div class="r-rec" style="--i:${i}">
              <span class="r-rec-check">✔</span>
              <span>${r}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="r-section r-section--dark">
      <div class="r-inner">
        <p class="r-loop-label">당신의 결정 루프</p>
        <div class="r-loop">
          ${R.loop.map((s,i) => `
            <div class="r-loop-item" style="--i:${i}">
              <div class="r-loop-dot"></div>
              <span class="r-loop-text">${s}</span>
            </div>
            ${i < R.loop.length-1 ? '<div class="r-loop-arrow">↓</div>' : ''}
          `).join('')}
        </div>
      </div>
    </section>

    <section class="r-section">
      <div class="r-inner">
        <div class="r-pat-card">
          <p class="r-pat-eye">이 패턴의 가장 큰 특징</p>
          <h3 class="r-pat-title">${R.patTitle}</h3>
          <p class="r-pat-body">${R.patBody}</p>
        </div>
      </div>
    </section>

    <section class="r-section r-section--dark">
      <div class="r-inner">
        <div class="r-why">
          <p class="r-why-eye">이 패턴이 반복되는 진짜 이유</p>
          <p class="r-why-text">${R.why}</p>
          <div class="r-why-blur"></div>
        </div>
      </div>
    </section>

    <section class="r-section r-upsell">
      <div class="r-inner">
        <p class="r-up-eye">여기까지가 무료 분석입니다.</p>
        <h2 class="r-up-title">하지만<br>가장 중요한 질문은<br>아직 남아 있습니다.</h2>
        <p class="r-up-q">왜 나는 항상<br>같은 선택을 반복할까?</p>
        <ul class="r-up-list">
          <li>왜 항상 같은 상황에서 흔들리는가</li>
          <li>무엇이 운동보다 우선되는가</li>
          <li>어떤 말로 나를 설득하는가</li>
          <li>왜 하루가 일주일이 되는가</li>
          <li>왜 시작은 쉬운데 유지가 어려운가</li>
          <li>어떤 방식으로 습관을 바꿔야 오래가는가</li>
        </ul>
        <a href="payment.html" class="r-up-btn">내 행동패턴 끝까지 분석하기 →</a>
        <a href="http://pf.kakao.com/_xdIpXX" target="_blank" class="r-kakao-btn">
          💬 카카오로 직접 연결하기
        </a>
      </div>
    </section>`;

  // 모든 요소 바로 표시 (fixed 컨테이너 IntersectionObserver 호환성 문제 해결)
  setTimeout(() => {
    $$('.r-rec, .r-loop-item, .r-pat-card, .r-why, .r-upsell').forEach(el => el.classList.add('visible'));
  }, 50);
}

// ── KEYBOARD SUPPORT ──────────────────────────────────────
document.addEventListener('keydown', e => {
  if ($('quiz-screen') && !$('quiz-screen').classList.contains('hidden')) {
    const n = parseInt(e.key);
    const btns = $$('.a-btn');
    if (n >= 1 && n <= btns.length) btns[n-1].click();
  }
});

// ── INTRO SCROLL ANIMATIONS ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.15 });
  $$('[data-anim]').forEach(el => io.observe(el));

  // Scroll indicator fade
  const ind = $('scroll-ind');
  if (ind) {
    window.addEventListener('scroll', () => {
      ind.style.opacity = window.scrollY > 60 ? '0' : '1';
    }, { passive: true });
  }
});
