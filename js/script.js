/**
 * Aurora — Landing Page (Etapa 1)
 * JS vanilla, sem dependências externas:
 *  - cabeçalho com sombra ao rolar
 *  - menu mobile acessível (teclado + aria-expanded)
 *  - revelação suave de seções ao rolar (progressive enhancement)
 *  - diagnóstico rápido interativo (multi-etapas, 100% client-side)
 *  - validação e feedback do formulário de lead (sem envio real nesta etapa)
 */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Rola até um elemento e o destaca com um anel temporário — usado tanto pelos
     "módulos recomendados" do diagnóstico quanto pelos chips de navegação da
     seção RH as a Service (mesmo padrão de interação nos dois lugares). */
  function scrollToAndHighlight(selector) {
    var target = document.querySelector(selector);
    if (!target) { return; }
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    target.classList.add('ring-4');
    window.setTimeout(function () { target.classList.remove('ring-4'); }, 2200);
  }

  /* ---------- Header: sombra ao rolar ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle('shadow-md', window.scrollY > 4);
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
  }

  /* ---------- Menu mobile ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('navPrincipal');
  var iconMenu = document.getElementById('iconMenu');
  var iconClose = document.getElementById('iconClose');

  function closeNav() {
    if (!nav) { return; }
    nav.classList.add('hidden');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    iconMenu.classList.remove('hidden');
    iconClose.classList.add('hidden');
  }

  function openNav() {
    nav.classList.remove('hidden');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu de navegação');
    iconMenu.classList.add('hidden');
    iconClose.classList.remove('hidden');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) { closeNav(); } else { openNav(); }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { closeNav(); }
    });
  }

  /* ---------- Revelação suave ao rolar (progressive enhancement) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    revealEls.forEach(function (el) { el.classList.add('reveal-hidden'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-hidden');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }
  /* Se prefers-reduced-motion estiver ativo ou IntersectionObserver não existir,
     os elementos simplesmente nunca recebem reveal-hidden e ficam sempre visíveis. */

  /* ---------- Diagnóstico rápido ---------- */
  var diagForm = document.getElementById('diagForm');
  if (diagForm) {
    var steps = ['1', '2', '3', 'result'];
    var current = 0;

    var progressLabel = document.getElementById('diagProgressLabel');
    var backBtn = document.getElementById('diagBack');
    var nextBtn = document.getElementById('diagNext');
    var nav_ = diagForm.querySelector('[data-step-nav]');
    var restartBtn = document.getElementById('diagRestart');
    var resultCta = document.getElementById('diagResultCta');
    var resultTitle = document.getElementById('diagResultTitle');
    var resultText = document.getElementById('diagResultText');
    var resultModules = document.getElementById('diagResultModules');

    function stepEl(key) {
      return diagForm.querySelector('.diag-step[data-step="' + key + '"]');
    }

    function updateDots() {
      diagForm.querySelectorAll('[data-dot]').forEach(function (dot, index) {
        var stepNumber = index + 1;
        var reached = steps.indexOf(String(stepNumber)) <= current;
        dot.classList.toggle('bg-violet', reached);
        dot.classList.toggle('bg-line', !reached);
      });
    }

    function showStep(index) {
      steps.forEach(function (key, i) {
        var el = stepEl(key);
        if (!el) { return; }
        el.classList.toggle('hidden', i !== index);
      });

      var isResult = steps[index] === 'result';
      nav_.classList.toggle('hidden', isResult);
      backBtn.classList.toggle('invisible', index === 0);

      if (!isResult) {
        progressLabel.textContent = 'Etapa ' + (index + 1) + ' de 3';
        updateDots();
        var legend = document.getElementById('diagStep' + steps[index] + 'Title');
        if (legend) { legend.focus(); }
      } else {
        if (resultTitle) { resultTitle.focus(); }
      }
    }

    function currentFieldset() {
      return stepEl(steps[current]);
    }

    function validateCurrentStep() {
      var fieldset = currentFieldset();
      if (!fieldset) { return true; }
      var checked = fieldset.querySelector('input:checked');
      var errorEl = fieldset.querySelector('.diag-error');
      if (!checked) {
        if (errorEl) { errorEl.classList.remove('hidden'); }
        return false;
      }
      if (errorEl) { errorEl.classList.add('hidden'); }
      return true;
    }

    // Módulos reais da Aurora, agrupados por cluster (mesmos ids usados em #rh-as-a-service)
    var MODULES = {
      radar: { label: 'Radar de Experiência', anchor: '#cluster-escuta' },
      pesquisas: { label: 'Pesquisas Customizáveis', anchor: '#cluster-escuta' },
      ciclo: { label: 'Ciclo de Performance', anchor: '#cluster-performance' },
      feedbacks: { label: 'Feedbacks Contínuos', anchor: '#cluster-cultura' },
      valores: { label: 'Avaliação de Valores', anchor: '#cluster-cultura' },
      boreal: { label: 'Chatbot Boreal', anchor: '#cluster-acao' },
      planos: { label: 'Planos de Ação', anchor: '#cluster-acao' }
    };

    function computeResult() {
      var q1 = diagForm.querySelector('input[name="q1"]:checked');
      var q2 = diagForm.querySelector('input[name="q2"]:checked');
      var q3 = diagForm.querySelector('input[name="q3"]:checked');
      var v1 = q1 ? parseInt(q1.value, 10) : 0; // maturidade do processo de decisão
      var v2 = q2 ? parseInt(q2.value, 10) : 0; // maturidade da consolidação de dados
      var total = v1 + v2;

      var profile;
      if (total <= 1) {
        profile = {
          title: 'Hoje as decisões acontecem no escuro',
          text: 'Sem processo estruturado e sem dados centralizados, decisões sobre pessoas ficam reféns da percepção de quem está mais por perto. O caminho começa por mapear o que está acontecendo com o time e estruturar como as decisões passam a ser tomadas a partir daí.',
          modules: ['radar', 'ciclo']
        };
      } else if (total === 4) {
        profile = {
          title: 'Vocês já pensam como a Aurora: hora de escalar',
          text: 'Decisões com dados consolidados e um processo estruturado: essa é exatamente a base que um motor de IA precisa para gerar planos de ação automáticos e acompanháveis, em vez de depender de análise manual a cada ciclo.',
          modules: ['boreal', 'planos']
        };
      } else if (v1 === v2) {
        profile = {
          title: 'Meio caminho andado, dos dois lados',
          text: 'Existe um começo de processo e um começo de dados, mas nenhum dos dois está consolidado. Fechar esse ciclo ajuda a dar consistência ao que já está em andamento antes de avançar para automação com IA.',
          modules: ['feedbacks', 'valores']
        };
      } else if (v1 < v2) {
        profile = {
          title: 'Os dados existem, mas ainda não viram decisão',
          text: 'Vocês já têm dados de performance e cultura mais organizados do que o processo usado para decidir com eles. O gargalo está em transformar informação em ação, com recomendações práticas para cada decisão.',
          modules: ['boreal', 'planos']
        };
      } else {
        profile = {
          title: 'Vocês sabem o que querem decidir, mas faltam dados para sustentar',
          text: 'O processo de decisão já existe, mas sem dados centralizados ele fica apoiado em percepção. Consolidar essa informação num só lugar dá base para as decisões que vocês já tentam tomar com mais consciência.',
          modules: ['radar', 'pesquisas']
        };
      }

      resultTitle.textContent = profile.title;
      resultText.textContent = profile.text;

      resultModules.innerHTML = '';
      profile.modules.forEach(function (key) {
        var mod = MODULES[key];
        var a = document.createElement('a');
        a.href = mod.anchor;
        a.className = 'module-pill';
        a.textContent = mod.label;
        a.addEventListener('click', function (event) {
          event.preventDefault();
          scrollToAndHighlight(mod.anchor);
        });
        resultModules.appendChild(a);
      });

      // Personalização: leva a resposta sobre porte da empresa para o formulário de lead
      if (q3) {
        resultCta.dataset.colaboradores = q3.value;
      }
    }

    nextBtn.addEventListener('click', function () {
      if (!validateCurrentStep()) { return; }

      if (steps[current] === '3') {
        computeResult();
      }

      if (current < steps.length - 1) {
        current += 1;
        showStep(current);
      }
    });

    backBtn.addEventListener('click', function () {
      if (current > 0) {
        current -= 1;
        showStep(current);
      }
    });

    restartBtn.addEventListener('click', function () {
      diagForm.reset();
      diagForm.querySelectorAll('.diag-error').forEach(function (el) { el.classList.add('hidden'); });
      current = 0;
      showStep(current);
    });

    resultCta.addEventListener('click', function () {
      var colaboradoresField = document.getElementById('colaboradores');
      if (colaboradoresField && resultCta.dataset.colaboradores) {
        colaboradoresField.value = resultCta.dataset.colaboradores;
      }
      var contato = document.getElementById('contato');
      if (contato) { contato.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' }); }
      var nomeField = document.getElementById('nome');
      if (nomeField) { window.setTimeout(function () { nomeField.focus(); }, prefersReducedMotion ? 0 : 500); }
    });

    showStep(current);
  }

  /* ---------- RH as a Service: chips de navegação rápida por cluster ---------- */
  document.querySelectorAll('[data-cluster-chip]').forEach(function (chip) {
    chip.addEventListener('click', function (event) {
      event.preventDefault();
      scrollToAndHighlight(chip.getAttribute('href'));
    });
  });

  /* ---------- Motor de inteligência: linha de progresso conectando as etapas ---------- */
  var engineList = document.getElementById('engineList');
  var engineWrapper = document.getElementById('engineWrapper');
  var engineProgressLine = document.getElementById('engineProgressLine');
  if (engineList && engineWrapper && engineProgressLine && !prefersReducedMotion && 'IntersectionObserver' in window) {
    var engineSteps = Array.prototype.slice.call(engineList.querySelectorAll('.engine-step'));
    var engineHighestActive = -1;

    // Deslocamento fixo (top-10) já embutido na posição CSS da linha —
    // descoberto lendo o próprio elemento, então funciona igual em qualquer
    // zoom/tamanho de fonte, sem número "mágico" fixo em pixels.
    function engineLineOffset() {
      return engineProgressLine.getBoundingClientRect().top - engineWrapper.getBoundingClientRect().top;
    }

    function updateEngineProgress() {
      if (engineHighestActive < 0) { return; }
      var dot = engineSteps[engineHighestActive].querySelector('.engine-dot');
      if (!dot) { return; }
      var wrapperTop = engineWrapper.getBoundingClientRect().top;
      var dotRect = dot.getBoundingClientRect();
      var dotCenter = dotRect.top + dotRect.height / 2 - wrapperTop;
      var height = Math.max(0, dotCenter - engineLineOffset());
      engineProgressLine.style.height = height + 'px';
    }

    var engineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-active');
        var index = engineSteps.indexOf(entry.target);
        if (index > engineHighestActive) {
          engineHighestActive = index;
        }
      });
      updateEngineProgress();
    }, { threshold: 0.5, rootMargin: '0px 0px -10% 0px' });

    engineSteps.forEach(function (step) { engineObserver.observe(step); });
    window.addEventListener('resize', updateEngineProgress);
  }

  /* ---------- Depoimentos: vitrine com scroll horizontal (drag + snap) ---------- */
  var testimonialTrack = document.getElementById('testimonialTrack');
  if (testimonialTrack) {
    var testimonialPrev = document.getElementById('testimonialPrev');
    var testimonialNext = document.getElementById('testimonialNext');
    var fadeLeft = document.getElementById('testimonialFadeLeft');
    var fadeRight = document.getElementById('testimonialFadeRight');

    function testimonialStep() {
      var firstSlide = testimonialTrack.querySelector('.testimonial-slide');
      var gap = parseFloat(window.getComputedStyle(testimonialTrack).columnGap) || 20;
      return (firstSlide ? firstSlide.getBoundingClientRect().width : 320) + gap;
    }

    function testimonialScrollBy(amount) {
      testimonialTrack.scrollBy({ left: amount, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }

    function updateTestimonialEdges() {
      var maxScroll = testimonialTrack.scrollWidth - testimonialTrack.clientWidth;
      var atStart = testimonialTrack.scrollLeft <= 2;
      var atEnd = testimonialTrack.scrollLeft >= maxScroll - 2;
      if (fadeLeft) { fadeLeft.style.opacity = atStart ? '0' : '1'; }
      if (fadeRight) { fadeRight.style.opacity = atEnd ? '0' : '1'; }
      if (testimonialPrev) { testimonialPrev.disabled = atStart; }
      if (testimonialNext) { testimonialNext.disabled = atEnd; }
    }

    if (testimonialPrev) {
      testimonialPrev.addEventListener('click', function () { testimonialScrollBy(-testimonialStep()); });
    }
    if (testimonialNext) {
      testimonialNext.addEventListener('click', function () { testimonialScrollBy(testimonialStep()); });
    }

    // Setas do teclado quando a vitrine está focada (além do Tab/scroll nativo)
    testimonialTrack.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        testimonialScrollBy(testimonialStep());
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        testimonialScrollBy(-testimonialStep());
      }
    });

    testimonialTrack.addEventListener('scroll', updateTestimonialEdges, { passive: true });
    window.addEventListener('resize', updateTestimonialEdges);
    updateTestimonialEdges();

    // Arrastar com o mouse (touch e trackpad já rolam nativamente sem isso)
    var isDragging = false;
    var dragStartX = 0;
    var dragStartScroll = 0;
    var draggedDistance = 0;

    testimonialTrack.addEventListener('mousedown', function (event) {
      isDragging = true;
      draggedDistance = 0;
      dragStartX = event.clientX;
      dragStartScroll = testimonialTrack.scrollLeft;
      testimonialTrack.classList.add('is-dragging');
      testimonialTrack.style.scrollSnapType = 'none'; // evita "brigar" com o snap durante o arraste
    });

    window.addEventListener('mousemove', function (event) {
      if (!isDragging) { return; }
      var delta = event.clientX - dragStartX;
      draggedDistance = Math.abs(delta);
      testimonialTrack.scrollLeft = dragStartScroll - delta;
    });

    function stopTestimonialDrag() {
      if (!isDragging) { return; }
      isDragging = false;
      testimonialTrack.classList.remove('is-dragging');
      testimonialTrack.style.scrollSnapType = ''; // volta a valer o snap-x/snap-mandatory do Tailwind
    }
    window.addEventListener('mouseup', stopTestimonialDrag);
    window.addEventListener('mouseleave', stopTestimonialDrag);

    // Depois de um arraste, evita que o "solte do mouse" seja lido como clique dentro do card
    testimonialTrack.addEventListener('click', function (event) {
      if (draggedDistance > 5) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  }

  /* ---------- Formulário de captação de lead ---------- */
  var form = document.getElementById('leadForm');
  if (!form) { return; }

  var statusEl = document.getElementById('formStatus');

  var validators = {
    nome: function (value) { return value.trim().length > 1; },
    email: function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); },
    empresa: function (value) { return value.trim().length > 1; },
    telefone: function (value) { return value.trim().length >= 8; },
    colaboradores: function (value) { return value !== ''; }
  };

  function validateField(field) {
    var validator = validators[field.name];
    if (!validator) { return true; }

    var errorEl = document.getElementById('erro-' + field.name);
    var isValid = validator(field.value);

    field.setAttribute('aria-invalid', String(!isValid));
    if (errorEl) { errorEl.classList.toggle('hidden', isValid); }

    return isValid;
  }

  form.querySelectorAll('input, select').forEach(function (field) {
    if (!validators[field.name]) { return; }
    field.addEventListener('blur', function () { validateField(field); });
  });

  var submitBtn = form.querySelector('button[type="submit"]');

  function showFormStatus(kind, message) {
    statusEl.classList.remove('hidden');
    statusEl.textContent = message;
    // "assertive" para erro (interrompe o que o leitor de tela está lendo,
    // porque o envio falhou e a pessoa precisa saber agora) e "polite" para
    // sucesso/estado intermediário (não é urgente a ponto de interromper).
    statusEl.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    statusEl.classList.toggle('border-teal', kind !== 'error');
    statusEl.classList.toggle('border-rosa-dark', kind === 'error');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var honeypot = form.querySelector('#site');
    if (honeypot && honeypot.value !== '') { return; }

    var fields = form.querySelectorAll('input[required], select[required]');
    var allValid = true;

    fields.forEach(function (field) {
      if (!validateField(field)) { allValid = false; }
    });

    if (!allValid) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) { firstInvalid.focus(); }
      return;
    }

    if (submitBtn) { submitBtn.disabled = true; }
    showFormStatus('pending', 'Enviando...');

    // Envio real para o Formspree (captação de lead de verdade, não só feedback
    // visual). O `action`/`method` no <form> continuam funcionando como fallback:
    // se o JavaScript não carregar, o navegador envia o formulário diretamente
    // para o mesmo endpoint (a página só não fica com a mensagem inline).
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          showFormStatus('success', 'Recebemos seu pedido! Nossa equipe entra em contato em até 8 horas úteis.');
          form.reset();
          form.querySelectorAll('[aria-invalid]').forEach(function (field) {
            field.removeAttribute('aria-invalid');
          });
        } else {
          showFormStatus('error', 'Não foi possível enviar seu pedido agora. Tente novamente em instantes ou escreva para contato@aurorapro.com.br.');
        }
      })
      .catch(function () {
        showFormStatus('error', 'Não foi possível enviar seu pedido agora. Verifique sua conexão e tente novamente, ou escreva para contato@aurorapro.com.br.');
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; }
      });
  });
})();
