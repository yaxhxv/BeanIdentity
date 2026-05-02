(() => {
  const heroSelector = '[data-editorial-hero]';
  const quickAddSelector = '[data-editorial-quick-add-form]';

  function setHeroState() {
    const hero = document.querySelector(heroSelector);
    const body = document.body;

    if (!hero) {
      body.classList.remove('editorial-hero-active', 'editorial-hero-past');
      return;
    }

    const header = document.querySelector('.section-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const heroBounds = hero.getBoundingClientRect();
    const isActive = heroBounds.top <= headerHeight && heroBounds.bottom > headerHeight;
    const isPast = heroBounds.bottom <= headerHeight + 24;

    body.classList.add('editorial-hero-active');
    body.classList.toggle('editorial-hero-past', !isActive || isPast);
  }

  async function refreshCartBubble() {
    try {
      const response = await fetch(`${window.Shopify.routes.root}cart.js`, {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) return;

      const cart = await response.json();
      document.querySelectorAll('#cart-icon-bubble').forEach((bubble) => {
        bubble.innerHTML = cart.item_count > 0
          ? `<div class="cart-count-bubble"><span aria-hidden="true">${cart.item_count}</span><span class="visually-hidden">${cart.item_count} items</span></div>`
          : '';
      });
    } catch (error) {
      console.warn('Bean editorial cart refresh failed.', error);
    }
  }

  async function handleQuickAddSubmit(event) {
    const form = event.currentTarget;
    const submitButton = form.querySelector('[type="submit"]');
    const message = form.querySelector('[data-quick-add-message]');

    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
    }

    if (message) {
      message.textContent = '';
    }

    try {
      const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || 'Unable to add this item right now.');
      }

      await response.json();
      await refreshCartBubble();

      if (message) {
        message.textContent = form.dataset.successMessage || 'Added to cart.';
      }
    } catch (error) {
      if (message) {
        message.textContent = error.message;
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
      }
    }
  }

  function bindQuickAddForms(root = document) {
    root.querySelectorAll(quickAddSelector).forEach((form) => {
      if (form.dataset.editorialQuickAddBound === 'true') return;
      form.dataset.editorialQuickAddBound = 'true';
      form.addEventListener('submit', handleQuickAddSubmit);
    });
  }

  function init() {
    bindQuickAddForms();
    setHeroState();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('shopify:section:load', (event) => {
    bindQuickAddForms(event.target);
    setHeroState();
  });
  document.addEventListener('shopify:section:reorder', setHeroState);
  window.addEventListener('scroll', setHeroState, { passive: true });
  window.addEventListener('resize', setHeroState);
})();
