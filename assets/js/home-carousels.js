/* Independent, progressively enhanced carousels. The original cards remain in the DOM. */
(function () {
  'use strict';
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  [
    ['home-packages', 'packages', 'Service packages', 25],
    ['portfolio-grid', 'projects', 'Featured projects', 23],
    ['blog-grid', 'blog', 'Latest blog articles', 19],
    ['home-testimonials', 'testimonials', 'Client testimonials', 21],
    ['home-team', 'team', 'Team members', 22]
  ].forEach(function (config) {
    var track = document.getElementById(config[0]);
    if (!track) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'home-carousel home-carousel--' + config[1];
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', config[2] + ' carousel');
    var viewport = document.createElement('div');
    viewport.className = 'home-carousel__viewport';
    track.parentNode.insertBefore(wrapper, track);
    wrapper.appendChild(viewport);
    viewport.appendChild(track);
    track.classList.add('home-carousel__track');
    var controls = document.createElement('div');
    controls.className = 'home-carousel__controls';
    controls.innerHTML = '<button type="button" aria-label="Previous ' + config[2] + '">← <span>Previous</span></button><button type="button" aria-label="Pause ' + config[2] + ' carousel">Pause</button><button type="button" aria-label="Next ' + config[2] + '"><span>Next</span> →</button>';
    wrapper.appendChild(controls);
    var previous = controls.children[0], toggle = controls.children[1], next = controls.children[2];
    var offset = 0, cycle = 0, step = 0, last = 0, paused = false, hovering = false, focused = false, dragging = false, startX = 0, startY = 0;
    var observer = new MutationObserver(rebuild);
    function paint() { track.style.transform = 'translate3d(' + (-offset) + 'px,0,0)'; }
    function rebuild() {
      observer.disconnect();
      track.querySelectorAll('[data-carousel-copy]').forEach(function (node) { node.remove(); });
      var originals = Array.from(track.children);
      if (!originals.length) { controls.hidden = true; observer.observe(track, { childList: true }); return; }
      controls.hidden = false;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      step = originals[0].getBoundingClientRect().width + gap;
      cycle = step * originals.length;
      // Add enough copies to cover the viewport at every position, including single-item filters.
      var copies = Math.ceil(viewport.clientWidth / cycle) + 1;
      for (var i = 0; i < copies; i++) originals.forEach(function (item) {
        var copy = item.cloneNode(true);
        copy.dataset.carouselCopy = 'true';
        copy.setAttribute('aria-hidden', 'true');
        copy.removeAttribute('id');
        copy.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
        copy.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach(function (el) { el.setAttribute('tabindex', '-1'); });
        copy.classList.remove('reveal');
        track.appendChild(copy);
      });
      offset = cycle ? ((offset % cycle) + cycle) % cycle : 0;
      paint();
      observer.observe(track, { childList: true });
    }
    function move(delta) { if (!cycle) return; offset = ((offset + delta) % cycle + cycle) % cycle; paint(); }
    previous.addEventListener('click', function () { move(-step); });
    next.addEventListener('click', function () { move(step); });
    function updateToggle() {
      toggle.textContent = paused ? 'Play' : 'Pause';
      toggle.setAttribute('aria-label', (paused ? 'Play ' : 'Pause ') + config[2] + ' carousel');
    }
    paused = motion.matches; updateToggle();
    toggle.addEventListener('click', function () { paused = !paused; updateToggle(); });
    motion.addEventListener('change', function (e) { paused = e.matches; updateToggle(); });
    wrapper.addEventListener('mouseenter', function () { hovering = true; });
    wrapper.addEventListener('mouseleave', function () { hovering = false; });
    wrapper.addEventListener('focusin', function (e) {
      focused = true;
      var card = e.target.closest('.home-carousel__track > *');
      if (card && !card.hasAttribute('data-carousel-copy')) {
        var index = Array.from(track.children).indexOf(card);
        var left = index * step;
        if (left < offset || left + step > offset + viewport.clientWidth + 1) { offset = left; paint(); }
      }
    });
    wrapper.addEventListener('focusout', function (e) { if (!wrapper.contains(e.relatedTarget)) focused = false; });
    viewport.addEventListener('touchstart', function (e) { if (e.touches.length !== 1) return; dragging = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
    viewport.addEventListener('touchend', function (e) { if (!dragging || !e.changedTouches.length) return; dragging = false; var dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY; if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? step : -step); }, { passive: true });
    viewport.addEventListener('touchcancel', function () { dragging = false; }, { passive: true });
    window.addEventListener('resize', rebuild);
    function frame(time) {
      if (last && !paused && !hovering && !focused && !dragging && !document.hidden) move(config[3] * Math.min((time - last) / 1000, .05));
      last = time; requestAnimationFrame(frame);
    }
    rebuild(); requestAnimationFrame(frame);
  });
}());
