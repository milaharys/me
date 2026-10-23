// "powered by" credit with the XTC mark: at the top of the gallery and the archive, the first thing seen when either opens;
// never over the photo strips. Hovering it sends a decaying wave through the letters (after wisprflow.ai).
import { REDUCED } from './media.js?v=7020ddca';

const LINK = 'https://t.me/kutexyz';   // only the mark is a link: the words stay quiet
const MARK = `<a class="credit-link" href="${LINK}" target="_blank" rel="noopener" aria-label="xtc — telegram"><svg class="credit-mark" viewBox="0 0 1838 467" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="M 650 2 C 651 2,671 8,695 15 C 719 21,753 31,770 36 C 787 42,811 49,823 52 C 835 55,845 59,845 59 C 846 59,844 61,840 61 C 835 63,749 88,730 94 C 722 96,701 102,659 114 C 648 117,639 120,639 120 C 639 121,677 121,724 121 L 809 121 845 110 C 865 104,896 94,913 89 C 931 83,946 79,947 79 C 949 79,1067 116,1078 120 C 1081 121,1095 121,1177 121 C 1272 121,1272 120,1266 119 C 1256 115,1208 101,1135 80 C 1096 69,1065 59,1066 59 C 1066 59,1076 56,1086 53 C 1098 49,1122 42,1142 36 C 1161 31,1185 24,1196 21 C 1206 18,1225 12,1238 8 L 1261 2 1175 1 L 1090 1 1028 20 C 994 30,965 39,964 39 C 962 39,949 35,867 9 L 842 1 746 1 C 693 1,650 1,650 2 M 1488 174 C 1396 176,1331 183,1311 193 C 1301 198,1302 195,1302 235 C 1302 275,1301 272,1311 277 C 1328 285,1370 291,1448 295 C 1489 297,1641 297,1680 295 C 1780 290,1823 284,1835 272 C 1838 269,1838 269,1838 260 L 1838 250 1752 250 L 1666 250 1666 258 C 1666 270,1665 271,1659 273 C 1646 277,1623 279,1575 279 C 1522 279,1495 277,1487 272 L 1484 270 1484 235 L 1484 200 1488 198 C 1496 193,1528 191,1586 191 C 1631 192,1642 193,1655 196 C 1665 198,1665 199,1666 208 L 1666 216 1752 216 L 1838 216 1838 208 C 1838 201,1838 201,1835 198 C 1824 187,1779 180,1692 175 C 1656 174,1535 173,1488 174 M 14 177 C 23 180,147 216,178 225 C 194 230,205 234,205 234 C 204 234,200 236,196 237 C 187 239,175 243,34 284 C 16 289,2 294,1 294 C 0 295,38 295,84 295 L 169 295 238 274 L 306 253 373 274 L 440 295 536 295 L 631 294 563 275 C 525 264,486 252,474 249 C 464 246,447 241,439 238 L 423 234 430 231 C 434 230,443 228,450 225 C 458 223,468 220,474 218 C 481 217,500 211,518 206 C 537 200,567 191,586 186 L 621 176 536 175 L 450 175 386 195 L 323 214 297 206 C 283 201,255 193,235 186 L 199 175 103 175 C 9 175,8 175,14 177 M 670 184 L 670 192 765 192 L 860 192 860 244 L 860 295 951 295 L 1042 295 1042 244 L 1042 192 1138 192 L 1233 192 1233 183 L 1233 175 952 175 L 670 175 670 184 M 860 344 C 768 347,711 354,692 365 C 690 366,688 368,687 369 C 686 370,686 384,686 405 C 686 438,686 439,688 441 C 697 453,753 461,850 465 C 888 467,1020 467,1058 465 C 1155 461,1211 453,1220 441 C 1222 439,1222 437,1222 429 L 1222 420 1136 420 L 1050 420 1050 429 C 1050 442,1049 443,1032 446 C 1000 450,917 450,886 445 C 875 444,869 442,868 439 C 868 437,868 421,868 403 L 868 370 873 367 C 880 364,896 362,930 361 C 964 360,1011 361,1029 364 C 1036 364,1042 366,1045 367 L 1050 370 1050 377 L 1050 385 1136 385 L 1222 385 1222 378 C 1222 369,1221 368,1216 365 C 1199 355,1153 349,1074 345 C 1047 344,894 343,860 344"/></svg></a>`;

function make(cls) {
  const el = document.createElement('div');
  el.className = 'credit ' + cls;
  el.setAttribute('role', 'note');
  el.setAttribute('aria-label', 'powered by xtc');
  const text = [...'powered by'].map(ch => `<i aria-hidden="true">${ch === ' ' ? '&nbsp;' : ch}</i>`).join('');
  el.innerHTML = `<span class="credit-text">${text}</span>${MARK}`;
  wave(el);
  return el;
}

// each letter rises and falls on its own delay, so the wave runs left to right; the swing dies out in about a second
function wave(el) {
  const letters = [...el.querySelectorAll('.credit-text i')];
  const AMP = 0.32, HZ = 2.4, DECAY = 0.42, STEP = 0.045, END = 1.4 + letters.length * STEP;   // em, cycles/s, s, s per letter
  let t0 = 0, raf = 0;
  const step = now => {
    const t = (now - t0) / 1000;
    letters.forEach((l, i) => {
      const ti = t - i * STEP;
      const y = ti <= 0 ? 0 : -AMP * Math.exp(-ti / DECAY) * Math.sin(2 * Math.PI * HZ * ti);
      l.style.transform = y ? `translate3d(0,${y.toFixed(3)}em,0)` : '';
    });
    if (t < END) raf = requestAnimationFrame(step); else { raf = 0; for (const l of letters) l.style.transform = ''; }
  };
  const start = () => { if (REDUCED.matches) return; t0 = performance.now(); if (!raf) raf = requestAnimationFrame(step); };
  el.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') start(); });   // a mouse: on hover
  el.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') start(); });    // a finger has no hover: on touch
}

export function mountCredit(scrolls) {
  for (const s of scrolls) s.prepend(make('credit-head'));
}
