(function () {
  'use strict';

  /*
   * Utils
   */
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

  const waitFor = src => new Promise(resolve => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.src = src;
  });

  /*
   * DOM setup
   */
  const ctx = document.body.appendChild(create({ type: 'canvas', classes: ['avatar'], attributes: { width: 256, height: 256 } })).getContext('2d');
  const dashboard = document.body.appendChild(create({}));

  const layers = ([
    { opts: 15, display: 'Body type', type: 'body' },
    { opts: 10, display: 'Fur', type: 'fur' },
    { opts: 15, display: 'Eyes', type: 'eyes' },
    { opts: 10, display: 'Mouth', type: 'mouth' },
    { opts: 17, display: 'Accessory', type: 'accessorie' }
  ]).map(({ display, opts, type }) => {
    const value = create({ type: 'span', classes: ['value'] });
    const prev = create({ classes: ['button', 'prev'], contents: `<span class="rotate180">➼</span>` });
    const next = create({ classes: ['button', 'next'], contents: `➼` });
    dashboard.appendChild(create({
      classes: ['entry'],
      children: [prev, create({ children: [create({ type: 'span', contents: `${ display }: ` }), value] }), next]
    }));

    return { value, prev, next, type, current: 1, max: opts };
  });

  /*
   * Implement interactivity
   */
  const refresh = () => Promise.all(layers.map(i => waitFor(i.src)))
    .then(layersData => (ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height), layersData.forEach(i => ctx.drawImage(i, 0, 0))));

  layers.forEach(layer => {
    const updateValue = v => Promise.resolve(Object.assign(layer, ({ current: v, src: `./avatars/${ layer.type }_${ v }.png` })), layer.value.innerHTML = v).then(refresh);
    layer.prev.addEventListener('click', () => updateValue(layer.current - 1 || layer.max));
    layer.next.addEventListener('click', () => updateValue((layer.current + layer.max) % layer.max + 1));
    updateValue(1);
  });
}());
