// main interactive behavior for the AI Talent site
document.addEventListener('DOMContentLoaded', () => {
  // ---------- Dark mode toggle ----------
  const darkToggle = document.getElementById('darkToggle');
  darkToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    darkToggle.setAttribute('aria-pressed', String(isDark));
    darkToggle.textContent = isDark ? '☀️' : '🌙';
    // persist preference
    try { localStorage.setItem('ai_dark', isDark ? '1' : '0'); } catch(e){}
  });
  // restore preference
  try {
    if (localStorage.getItem('ai_dark') === '1') {
      document.body.classList.add('dark-mode');
      darkToggle.textContent = '☀️';
      darkToggle.setAttribute('aria-pressed','true');
    }
  } catch(e){}

  // ---------- Smooth navigation for header links ----------
  document.querySelectorAll('.site-nav a').forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---------- Chart: talent shortage by role ----------
  const chartEl = document.getElementById('aiChart').getContext('2d');
  // Data can be changed or fetched from an API later
  const chartData = {
    labels: ['AI Engineers', 'ML Engineers', 'Data Scientists', 'Ethics Experts'],
    datasets: [{
      label: 'Estimated Shortage (%)',
      data: [70, 65, 55, 40],
      backgroundColor: [
        'rgba(30,58,138,0.9)',
        'rgba(56,189,248,0.85)',
        'rgba(16,185,129,0.8)',
        'rgba(234,88,12,0.8)'
      ],
      borderColor: '#071232',
      borderWidth: 1,
    }]
  };
  const aiChart = new Chart(chartEl, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });

  // animate stat numbers (simple)
  const stat1 = document.getElementById('stat1');
  const stat2 = document.getElementById('stat2');
  const stat3 = document.getElementById('stat3');
  [ {el:stat1, to:62}, {el:stat2, to:40}, {el:stat3, to:3} ].forEach((s, idx) => {
    if (!s.el) return;
    let current = 0;
    const step = Math.max(1, Math.floor(s.to / 30));
    const int = setInterval(() => {
      current += step;
      if (current >= s.to) { current = s.to; clearInterval(int); }
      s.el.textContent = (idx===2 ? current + 'x' : current + '%');
    }, 18 + idx*10);
  });

  // ---------- Quiz handling ----------
  const quizForm = document.getElementById('quizForm');
  const quizResult = document.getElementById('quizResult');
  const quizReset = document.getElementById('quizReset');
  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(quizForm);
      let score = 0;
      if (form.get('q1') === 'ml') score++;
      if (form.get('q2') === 'bootcamp') score++;
      if (form.get('q3') === 'false') score++;
      quizResult.textContent = `You scored ${score} / 3 — ${score === 3 ? 'Excellent!' : score === 2 ? 'Good' : 'Consider learning more about AI ops & ethics.'}`;
    });
    quizReset.addEventListener('click', () => {
      quizForm.reset();
      quizResult.textContent = '';
    });
  }

  // ---------- Contact form (client-side demo) ----------
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const downloadTemplate = document.getElementById('downloadTemplate');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nm = document.getElementById('name').value.trim();
      const em = document.getElementById('email').value.trim();
      const msg = document.getElementById('message').value.trim();
      if (!nm || !em || !msg) {
        formFeedback.textContent = 'Please fill all fields.';
        formFeedback.style.color = 'crimson';
        return;
      }
      // In a real app we'd send to the backend here.
      formFeedback.style.color = 'limegreen';
      formFeedback.textContent = 'Request received. (Demo only — no server in this example.)';
      contactForm.reset();
    });
  }

  // ---------- Download 90-day plan (client-side) ----------
  if (downloadTemplate) {
    downloadTemplate.addEventListener('click', () => {
      const plan = [
        '90-day Talent Sprint Template',
        '',
        'Week 1-4: Skills audit, hire 1 ML engineer, run a two-week pilot.',
        'Week 5-8: Internal bootcamp for data engineering & MLOps. Set up monitoring.',
        'Week 9-12: Launch pilot to production with vendor support, implement governance.'
      ].join('\n');
      const blob = new Blob([plan], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = '90-day-talent-sprint.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }
});
