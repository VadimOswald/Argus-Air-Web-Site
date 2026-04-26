(function () {
    'use strict';
  
    const COMPONENTS = {
      header: '/header.html',
      footer: '/footer.html',
    };
  
    class HydrationLoader {
      constructor() {
        this.cache = new Map();
        this.inFlight = new Map();
  
        this.init();
      }
  
      init() {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.hydrate());
        } else {
          this.hydrate();
        }
      }
  
      async hydrate() {
        const components = Object.keys(COMPONENTS);
  
        await Promise.all(
          components.map((name) => this.hydrateComponent(name))
        );
  
        window.dispatchEvent(new CustomEvent('componentsHydrated'));
        this.activateNavigation();
      }
  
      async fetchComponent(path) {
        if (this.cache.has(path)) return this.cache.get(path);
        if (this.inFlight.has(path)) return this.inFlight.get(path);
  
        const promise = fetch(path, { cache: 'force-cache' })
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.text();
          })
          .then((html) => {
            this.cache.set(path, html);
            this.inFlight.delete(path);
            return html;
          })
          .catch((err) => {
            this.inFlight.delete(path);
            throw err;
          });
  
        this.inFlight.set(path, promise);
        return promise;
      }
  
      async hydrateComponent(name) {
        const el = document.querySelector(`[data-component="${name}"]`);
        if (!el) return;
  
        try {
          const html = await this.fetchComponent(COMPONENTS[name]);
  
          // ВАЖНО: заменяем INNER, не сам элемент
          // → нет layout shift
          el.innerHTML = html;
  
          el.setAttribute('data-hydrated', 'true');
  
          window.dispatchEvent(new CustomEvent(`${name}Hydrated`));
  
        } catch (err) {
          console.error(`Hydration failed: ${name}`, err);
          this.fallback(el, name);
        }
      }
  
      fallback(el, name) {
        const map = {
          header: '<div class="header">ARGUS AIR</div>',
          footer: '<div class="footer">© 2026 ARGUS AIR</div>',
        };
  
        el.innerHTML = map[name] || '';
      }
  
      activateNavigation() {
        const current = window.location.pathname;
  
        document.querySelectorAll('[data-component] a').forEach((link) => {
          const href = link.getAttribute('href');
          if (!href) return;
  
          if (href !== '/' && current.includes(href)) {
            link.classList.add('active');
          }
        });
      }
    }
  
    window.hydrationLoader = new HydrationLoader();
  })();