// Small helpers for building the page: elements, pictograms, dates.

/** h('div.a.b', { attrs }, ...children). Children may be text, elements, arrays, or nothing. */
export function h(spec, ...rest) {
  const [tag, ...classes] = spec.split('.');
  const el = document.createElement(tag || 'div');
  if (classes.length) el.className = classes.join(' ');
  let children = rest;
  const first = rest[0];
  if (first && typeof first === 'object' && !(first instanceof Node) && !Array.isArray(first)) {
    children = rest.slice(1);
    for (const [key, value] of Object.entries(first)) {
      if (value === null || value === undefined || value === false) continue;
      if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
      else if (key === 'html') el.innerHTML = value;
      else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
      else if (key in el && key !== 'list' && typeof value !== 'string') el[key] = value;
      else el.setAttribute(key, value === true ? '' : value);
    }
  }
  const add = child => {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) child.forEach(add);
    else el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  };
  children.forEach(add);
  return el;
}
export const clear = el => { el.replaceChildren(); return el; };

// Pictograms: filled figures on one 24 px grid, the way sign pictograms are cut. The few line marks (plus, minus,
// undo, sync, the chevron) are controls, drawn with one stroke weight.
const SOLID = {
  bench: 'M1 10.9h22v2.2H1z M3.6 6h3.2v12H3.6z M7.8 8h2.2v8H7.8z M14 8h2.2v8H14z M17.2 6h3.2v12h-3.2z',
  pull: 'M2 2.6h20v2.3H2z M12 5.6a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6z M5.9 4.9h2.5l1.9 5.9h3.4l1.9-5.9h2.5l-2.5 7.6v3.7l1.1 5.2h-2.5L12 17.2l-2.2 4.2H7.3l1.1-5.2v-3.7z',
  legs: 'M2.5 7h19v2H2.5z M12 1.6a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6z M9.2 9h5.6v4.6l3.9 1.7v7.1h-2.6v-5l-4.1-1.3-4.1 1.3v5H5.3v-7.1l3.9-1.7z',
  bed: 'M2 5.5h2.5V14H22v6h-2.5v-2.7h-15V20H2z M10.3 8.8h7.2A4.5 4.5 0 0 1 22 13.3H10.3z M7 8.6a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2z',
  timer: 'M9 1h6v2.3H9z M12 4.8a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8zm0 2.5a5.9 5.9 0 1 1 0 11.8 5.9 5.9 0 0 1 0-11.8z M10.9 9.2h2.2v3.5l2.5 1.6-1.2 1.9-3.5-2.3z',
  check: 'M2.6 12.6l2.9-2.9 4.2 4.2 8.8-8.8 2.9 2.9L9.7 19.7z',
  arrow: 'M3 10.6h11.9l-4.2-4.2 2-2 7.8 7.6-7.8 7.6-2-2 4.2-4.2H3z',
  today: 'M2 3.5h20v12.2h-8.6V21h-2.8v-5.3H2z M6.8 8.6v2h6.4l-1.9 1.9 1.4 1.4 4.3-4.3-4.3-4.3-1.4 1.4 1.9 1.9z',
  week: 'M3 5h3.2V2.8h2.5V5h6.6V2.8h2.5V5H21v16H3z M5.5 10.2v8.3h13V10.2z',
  progress: 'M3 3h2.5v15.5H21V21H3z M7.6 16.6v-5h2.8v5z M12 16.6V7.4h2.8v9.2z M16.4 16.6V4.6h2.8v12z',
  plan: 'M5 2h14v20H5z M8 6.4v2h8v-2z M8 10.4v2h8v-2z M8 14.4v2h5v-2z',
  you: 'M12 2.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2z M3.2 21.6c.6-5.4 4-8.2 8.8-8.2s8.2 2.8 8.8 8.2z',
  flag: 'M4.6 2h2.5v1.6H19l-2.4 4.4 2.4 4.4H7.1V22H4.6z',
};
const WINDOWED = new Set(['timer', 'today', 'week', 'plan']);
const LINE = {
  undo: 'M4 9h10a5 5 0 0 1 0 10H8 M8 5L4 9l4 4',
  minus: 'M5 12h14',
  plus: 'M5 12h14 M12 5v14',
  sync: 'M20 8a8 8 0 0 0-14.5-2 M4 3v4h4 M4 16a8 8 0 0 0 14.5 2 M20 21v-4h-4',
  chevron: 'M9 5l7 7-7 7',
};
export function icon(name, size = 24) {
  const solid = SOLID[name];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('aria-hidden', 'true');
  // shapes drawn over one another (a bar through its plates) fill solid; the four with a window cut in them say so
  if (solid) { svg.setAttribute('fill', 'currentColor'); if (WINDOWED.has(name)) svg.setAttribute('fill-rule', 'evenodd'); }
  else { svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '2.6'); svg.setAttribute('stroke-linecap', 'square'); svg.setAttribute('stroke-linejoin', 'miter'); }
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', solid || LINE[name] || LINE.chevron);
  svg.append(path);
  return svg;
}
/** A pictogram on its black square, as on a sign panel. */
export const picto = (name, extra = '') => h(`span.picto${extra}`, icon(name, 36));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const shortDate = d => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
export const clock = seconds => `${Math.floor(seconds / 60)}:${String(Math.max(0, seconds) % 60).padStart(2, '0')}`;
/** 162.4 -> "162.4", 162 -> "162". */
export const num = v => (Number.isFinite(v) ? String(Math.round(v * 10) / 10) : '');
