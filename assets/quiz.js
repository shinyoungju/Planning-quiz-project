// v3: quiz logic + Canvas share image
const QUESTIONS = [
  { t: '새로운 사람들과의 만남은 보통', k: 'Spark', a: ['즐겁다','가끔 즐겁다','상황에 따라','부담스럽다'] },
  { t: '주말 계획은', k: 'Navigator', a: ['세부 계획 필수','대략만 세운다','그때그때','완전 즉흥'] },
  { t: '문제 해결 시 나는', k: 'Navigator', a: ['데이터와 근거 우선','근거+직관 병행','경험 의존','감으로 돌파'] },
  { t: '팀 회의에서 나는', k: 'Spark', a: ['먼저 말문을 연다','적극 의견','필요할 때만','끝까지 듣는 편'] },
  { t: '일상 리듬은', k: 'Anchor', a: ['규칙적','대체로 규칙','약간 들쭉날쭉','완전 유동'] },
  { t: '새로운 아이디어에는', k: 'Maverick', a: ['바로 실험','우선 메모','가능성 검토 후','기존 방식을 선호'] },
  { t: '예상치 못한 변화가 생기면', k: 'Anchor', a: ['침착히 정리','우선 안정 확보','약간 흔들림','흥분한다'] },
  { t: 'SNS/메신저 활동은', k: 'Spark', a: ['활발','보통','드문 편','거의 안 함'] },
  { t: '복잡한 과제를 보면', k: 'Navigator', a: ['쪼개서 계획','우선순위 지정','쉬운 것부터','한번에 몰아침'] },
  { t: '모험적 선택 앞에서', k: 'Maverick', a: ['뛰어든다','작게 테스트','신중 보류','지양한다'] }
];

const ARCH = {
  Spark:  { name: 'Spark (전기빛 블루)', color: '#4D96FF', desc: '사람과 에너지에서 동력을 얻는 활기형. 시작의 불꽃을 잘 일으킵니다.' },
  Anchor: { name: 'Anchor (숲녹 그린)', color: '#22C55E', desc: '안정과 지속에 강한 균형형. 팀의 중심을 잡아주는 든든함.' },
  Navigator: { name: 'Navigator (딥 바이올렛)', color: '#8b5cf6', desc: '분석·계획에 강한 전략가형. 복잡한 퍼즐을 구조화합니다.' },
  Maverick: { name: 'Maverick (선셋 오렌지)', color: '#FF6B6B', desc: '새로움을 사랑하는 개척형. 규칙 밖에서 기회를 찾습니다.' }
};

const ol = document.querySelector('.q-list');
QUESTIONS.forEach((q, i) => {
  const li = document.createElement('li'); li.className = 'q';
  const fs = document.createElement('fieldset');
  const lg = document.createElement('legend'); lg.textContent = `${i+1}. ${q.t}`;
  fs.appendChild(lg);
  const opts = document.createElement('div'); opts.className = 'opts';
  q.a.forEach((label, idx) => {
    const id = `q${i}_o${idx}`;
    const wrap = document.createElement('label'); wrap.className = 'opt'; wrap.setAttribute('for', id);
    const input = document.createElement('input');
    input.type = 'radio'; input.name = `q${i}`; input.id = id; input.required = true;
    input.dataset.arch = q.k;
    input.dataset.weight = [3,2,1,0][idx];
    const span = document.createElement('span'); span.textContent = label;
    wrap.appendChild(input); wrap.appendChild(span);
    opts.appendChild(wrap);
  });
  fs.appendChild(opts);
  li.appendChild(fs);
  ol.appendChild(li);
});

const form = document.getElementById('quiz');
const result = document.getElementById('result');
const titleEl = document.getElementById('result-title');
const descEl = document.getElementById('result-desc');
const swatch = document.getElementById('swatch');
const shareBtn = document.getElementById('shareBtn');
const copyLink = document.getElementById('copyLink');

const canvas = document.getElementById('resultCanvas');
const ctx = canvas.getContext('2d');
const genBtn = document.getElementById('generateImage');
const dlLink = document.getElementById('downloadImage');

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function drawShareImage(title, desc, color) {
  const w = canvas.width, h = canvas.height;
  // background
  ctx.fillStyle = '#F9F9F9';
  ctx.fillRect(0,0,w,h);

  // soft gradient blob
  const grd = ctx.createLinearGradient(0,0,w,h);
  grd.addColorStop(0, 'rgba(77,150,255,0.18)');
  grd.addColorStop(1, 'rgba(255,107,107,0.15)');
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,w,h);

  // card
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#E7E7E7';
  ctx.lineWidth = 2;
  const pad = 48;
  const cardX = pad, cardY = pad, cardW = w - pad*2, cardH = h - pad*2;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // swatch
  ctx.fillStyle = color || '#FF6B6B';
  ctx.fillRect(cardX + 32, cardY + 32, 96, 96);

  // title
  ctx.fillStyle = '#2E2E2E';
  ctx.font = 'bold 56px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, cardX + 152, cardY + 96);

  // desc
  ctx.fillStyle = '#6B6B6B';
  ctx.font = '24px Inter, sans-serif';
  wrapText(ctx, desc, cardX + 32, cardY + 170, cardW - 64, 34);

  // brand footer
  ctx.font = '600 22px Inter, sans-serif';
  ctx.fillStyle = '#4D96FF';
  ctx.fillText('MindMint • planning-quiz-project', cardX + 32, cardY + cardH - 28);
}

async function generateAndOfferImage() {
  // Wait fonts ready for accurate text metrics
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch(e) {}
  }
  const title = titleEl.textContent || 'My Color Mood';
  const desc = descEl.textContent || '컬러 무드 결과';
  const color = swatch.style.backgroundColor || '#FF6B6B';
  drawShareImage(title, desc, color);

  // Provide download link
  const dataURL = canvas.toDataURL('image/png');
  dlLink.href = dataURL;
  dlLink.hidden = false;

  // Optional: share files if supported
  if (navigator.canShare && navigator.canShare({ files: [] })) {
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], 'mindmint-result.png', { type: 'image/png' });
      navigator.share({ files: [file], title: title, text: desc }).catch(()=>{});
    }, 'image/png');
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const scores = {Spark:0, Anchor:0, Navigator:0, Maverick:0};
  const data = new FormData(form);
  for (let [key, val] of data.entries()) {
    const input = document.getElementById(val);
    const arch = input.dataset.arch;
    const w = parseInt(input.dataset.weight, 10) || 0;
    scores[arch] += w;
  }
  const best = Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
  const meta = ARCH[best];
  titleEl.textContent = meta.name;
  descEl.textContent = meta.desc;
  swatch.style.background = meta.color;
  result.hidden = false;

  const params = new URLSearchParams({ a: best });
  const shareUrl = new URL(location.href);
  shareUrl.search = params.toString();

  copyLink.href = shareUrl.toString();
  copyLink.onclick = (ev)=>{
    ev.preventDefault();
    navigator.clipboard.writeText(shareUrl.toString());
    copyLink.textContent = '복사됨!';
    setTimeout(()=> copyLink.textContent = '링크 복사', 1500);
  };

  if (navigator.share) {
    shareBtn.onclick = async ()=>{
      try {
        await navigator.share({
          title: `내 컬러 무드: ${meta.name}`,
          text: meta.desc,
          url: shareUrl.toString()
        });
      } catch(e){}
    };
  } else {
    shareBtn.disabled = true;
    shareBtn.textContent = '브라우저 공유 미지원';
  }
});

document.getElementById('generateImage').addEventListener('click', generateAndOfferImage);

// init from shared URL param
(function initFromURL(){
  const a = new URLSearchParams(location.search).get('a');
  if (a && ARCH[a]) {
    const meta = ARCH[a];
    titleEl.textContent = meta.name;
    descEl.textContent = meta.desc;
    swatch.style.background = meta.color;
    result.hidden = false;
  }
})();