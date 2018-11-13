function create({ type = 'div', id = '', classes = [], contents = '', children = [], attributes = {} }) {
  const e = document.createElement(type);
  e.id = id;
  e.classList.add(...classes);
  e.innerHTML = contents;
  e.pickStylesFrom = (from, props) => Object.assign(e.style, (s => props.reduce((acc, p) => ({ ...acc, [p]: s[p] }), {}))(window.getComputedStyle(from))); // jshint ignore: line
  Object.keys(attributes).forEach(k => e.setAttribute(k, attributes[k]));
  children.forEach(e.appendChild.bind(e));
  return e;
}

const layers = document.querySelector('.avatar');
const form = document.querySelector('.form');

[
  { opts: 15, display: 'Body type', type: 'body' },
  { opts: 10, display: 'Fur', type: 'fur' },
  { opts: 15, display: 'Eyes', type: 'eyes' },
  { opts: 10, display: 'Mouth', type: 'mouth' },
  { opts: 17, display: 'Accessory', type: 'accessorie' }
].forEach(({ display, opts, type }) => {

  const layer = create({ type: 'img', classes: ['layer'] });
  layers.append(layer);

  let current = 1;

  const value = create({ type: 'span', classes: ['value'] });
  const prev = create({ classes: ['button', 'prev'], contents: `<span class="rotate180">➼</span>` });
  const next = create({ classes: ['button', 'next'], contents: `➼` });
  const entry = create({
    classes: ['entry'],
    children: [
      prev,
      create({
        children: [
          create({ type: 'span', contents: `${ display }: ` }),
          value
        ]
      }),
      next
    ]
  });

  form.appendChild(entry);

  const updateValue = v => {
    layer.setAttribute('src', `./avatars/${ type }_${ v }.png`);
    value.innerHTML = v;
    current = v;
  };

  prev.addEventListener('click', () => updateValue(current - 1 || opts));
  next.addEventListener('click', () => updateValue((current + opts) % opts + 1));

  updateValue(1);
});
