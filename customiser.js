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

const layers = document.body.appendChild(create({ classes: ['avatar'] }));
const form   = document.body.appendChild(create({}));

([
  { opts: 15, display: 'Body type', type: 'body' },
  { opts: 10, display: 'Fur', type: 'fur' },
  { opts: 15, display: 'Eyes', type: 'eyes' },
  { opts: 10, display: 'Mouth', type: 'mouth' },
  { opts: 17, display: 'Accessory', type: 'accessorie' }
]).map(type => Object.assign(type, { layer: layers.appendChild(create({ type: 'img', classes: ['layer'] })) }))
  .forEach(({ display, opts, type, layer }) => {
    const value = create({ type: 'span', classes: ['value'] });
    const prev  = create({ classes: ['button', 'prev'], contents: `<span class="rotate180">➼</span>` });
    const next  = create({ classes: ['button', 'next'], contents: `➼` });
    const entry = form.appendChild(create({
      classes: ['entry'],
      children: [
        prev,
        create({ children: [create({ type: 'span', contents: `${ display }: ` }), value] }),
        next
      ]
    }));

    let current = 1;
    const updateValue = v => {
      layer.setAttribute('src', `./avatars/${ type }_${ v }.png`);
      value.innerHTML = v;
      current = v;
    };

    prev.addEventListener('click', () => updateValue(current - 1 || opts));
    next.addEventListener('click', () => updateValue((current + opts) % opts + 1));
    updateValue(current);
  });
