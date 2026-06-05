'use strict';

// ─── PARTICLE SYSTEM ───────────────────────
const ParticleSystem = (() => {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  const COLORS = ['#f59e0b', '#7c3aed', '#e11d48', '#0d9488', '#f43f5e', '#fcd34d'];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.radius = Math.random() * 2.5 + 0.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = -(Math.random() * 0.8 + 0.2);
      this.opacity = Math.random() * 0.6 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * (1 - this.life / this.maxLife);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: 120 }, () => new Particle());
    window.addEventListener('resize', resize);
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(loop);
  }

  return { init };
})();


// ─── CUSTOM CURSOR ─────────────────────────
const CursorEffect = (() => {
  const glow = document.getElementById('cursorGlow');
  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  function init() {
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    document.addEventListener('mousedown', () => {
      glow.style.width = '40px';
      glow.style.height = '40px';
      glow.style.background = 'radial-gradient(circle, rgba(245,158,11,0.9), transparent 70%)';
    });

    document.addEventListener('mouseup', () => {
      glow.style.width = '20px';
      glow.style.height = '20px';
      glow.style.background = 'radial-gradient(circle, rgba(245,158,11,0.6), transparent 70%)';
    });

    document.querySelectorAll('button, a, .tab, .event-card, .menu-card, .delivery-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        glow.style.width = '50px';
        glow.style.height = '50px';
        glow.style.background = 'radial-gradient(circle, rgba(124,58,237,0.7), rgba(245,158,11,0.3), transparent 70%)';
      });
      el.addEventListener('mouseleave', () => {
        glow.style.width = '20px';
        glow.style.height = '20px';
        glow.style.background = 'radial-gradient(circle, rgba(245,158,11,0.6), transparent 70%)';
      });
    });

    animate();
  }

  function animate() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }

  return { init };
})();


// ─── NAVBAR SCROLL ─────────────────────────
const NavbarEffect = (() => {
  const navbar = document.getElementById('navbar');

  function init() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Hamburger toggle for mobile
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(10,6,8,0.98)';
      navLinks.style.padding = '1.5rem 2rem';
      navLinks.style.borderBottom = '1px solid rgba(245,158,11,0.15)';
      navLinks.style.zIndex = '999';
    });
  }

  return { init };
})();


// ─── COUNTER ANIMATION ─────────────────────
const CounterAnimation = (() => {
  function animateValue(el, start, end, duration) {
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * (end - start) + start);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function init() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          animateValue(el, 0, target, 1800);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));
  }

  return { init };
})();


// ─── SCROLL REVEAL ─────────────────────────
const ScrollReveal = (() => {
  function init() {
    const targets = document.querySelectorAll(
      '.menu-card, .delivery-card, .event-card, .contact-item, .amb-feat, .delivery-note'
    );

    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  return { init };
})();


// ─── MENU FILTER ───────────────────────────
const MenuFilter = (() => {
  function init() {
    const tabs = document.querySelectorAll('.tab');
    const cards = document.querySelectorAll('.menu-card');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        cards.forEach((card, i) => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('hidden');
            card.style.animationDelay = `${(i % 8) * 0.06}s`;
            card.style.animation = 'none';
            setTimeout(() => {
              card.style.animation = `fadeInUp 0.5s ${(i % 8) * 0.06}s both`;
            }, 10);
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  return { init };
})();


// ─── SHOPPING CART ─────────────────────────
const Cart = (() => {
  let items = {};

  function addItem(name, price) {
    if (items[name]) {
      items[name].qty++;
    } else {
      items[name] = { price, qty: 1 };
    }
    render();
    showToast(`☕ ${name} added to your order!`);
    spawnAddEffect();
  }

  function removeItem(name) {
    delete items[name];
    render();
  }

  function getSubtotal() {
    return Object.values(items).reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getDeliveryFee() {
    const sel = document.getElementById('deliveryType');
    return sel ? parseFloat(sel.value) : 0;
  }

  function render() {
    const container = document.getElementById('cartItems');
    const totalsEl = document.getElementById('cartTotals');
    const emptyCount = Object.keys(items).length === 0;

    if (emptyCount) {
      container.innerHTML = '<p class="empty-cart">Your cart is empty. Add items from the menu!</p>';
      totalsEl.style.display = 'none';
      return;
    }

    container.innerHTML = Object.entries(items).map(([name, data]) => `
      <div class="cart-item">
        <span class="cart-item-name">${name}</span>
        <span class="cart-item-qty">×${data.qty}</span>
        <span class="cart-item-price">$${(data.price * data.qty).toFixed(2)}</span>
        <button class="cart-item-remove" onclick="Cart.remove('${name.replace(/'/g, "\\'")}')">✕</button>
      </div>
    `).join('');

    totalsEl.style.display = 'block';
    updateTotals();
  }

  function updateTotals() {
    const subtotal = getSubtotal();
    const delivery = getDeliveryFee();

    // Small handling fee if below $15 and delivery is selected
    let handling = 0;
    if (delivery > 0 && subtotal < 15) handling = 1.50;

    const total = subtotal + delivery + handling;

    const subtotalEl = document.getElementById('cartSubtotal');
    const feeEl = document.getElementById('deliveryFee');
    const totalEl = document.getElementById('cartTotal');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (feeEl) {
      let feeText = `$${(delivery + handling).toFixed(2)}`;
      if (handling > 0) feeText += ' (incl. $1.50 handling)';
      feeEl.textContent = feeText;
    }
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  function placeOrder() {
    if (Object.keys(items).length === 0) {
      showToast('🛒 Your cart is empty!');
      return;
    }
    const subtotal = getSubtotal();
    const delivery = getDeliveryFee();
    const total = subtotal + delivery + (delivery > 0 && subtotal < 15 ? 1.50 : 0);
    const deliveryType = document.getElementById('deliveryType');
    const typeName = deliveryType.options[deliveryType.selectedIndex].text;

    showModal(
      'Order Placed! ☕',
      `Your order of $${total.toFixed(2)} (${typeName}) has been confirmed. We'll have your bliss ready shortly!`
    );

    items = {};
    render();
  }

  function spawnAddEffect() {
    const orderBtn = document.querySelector('.add-btn:last-clicked') || document.querySelector('.add-btn');
    if (!orderBtn) return;
    const spark = document.createElement('div');
    spark.style.cssText = `
      position:fixed; pointer-events:none; z-index:9998;
      font-size:1.5rem; animation: sparkFloat 1s ease forwards;
      top:${window.innerHeight / 2}px; left:${window.innerWidth / 2}px;
    `;
    spark.textContent = '☕';
    document.body.appendChild(spark);

    if (!document.querySelector('#sparkStyle')) {
      const style = document.createElement('style');
      style.id = 'sparkStyle';
      style.textContent = `
        @keyframes sparkFloat {
          0% { transform: translate(0,0) scale(1); opacity:1; }
          100% { transform: translate(${(Math.random()-0.5)*100}px, -80px) scale(0); opacity:0; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => spark.remove(), 1000);
  }

  return {
    add: addItem,
    remove: removeItem,
    updateTotals,
    place: placeOrder
  };
})();

// Expose cart functions globally for inline onclick
window.addToCart = (name, price) => Cart.add(name, price);
window.updateDeliveryFee = () => Cart.updateTotals();
window.placeOrder = () => Cart.place();


// ─── RESERVATION ───────────────────────────
let selectedEventType = '';

function selectEvent(card, type) {
  document.querySelectorAll('.event-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedEventType = type;
  const input = document.getElementById('eventTypeInput');
  if (input) input.value = type;
  showToast(`✨ "${type}" selected! Fill the form below.`);
  setTimeout(() => scrollToSection('reserve'), 400);
  document.querySelector('.reservation-form-wrapper').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function submitReservation(e) {
  e.preventDefault();
  if (!selectedEventType) {
    showToast('⚠️ Please select an event type above!');
    return;
  }
  showModal(
    'Reservation Confirmed! 🎉',
    `Your "${selectedEventType}" has been reserved. We'll send a confirmation shortly. Get ready for the bliss!`
  );
  e.target.reset();
  selectedEventType = '';
  document.querySelectorAll('.event-card').forEach(c => c.classList.remove('selected'));
}


// ─── TOAST ─────────────────────────────────
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}


// ─── MODAL ─────────────────────────────────
function showModal(title, message) {
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  overlay.classList.add('active');

  // Confetti burst
  launchConfetti();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}


// ─── CONFETTI ──────────────────────────────
function launchConfetti() {
  const colors = ['#f59e0b', '#7c3aed', '#e11d48', '#0d9488', '#f43f5e', '#fcd34d', '#86efac'];
  const container = document.body;

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    const size = Math.random() * 10 + 5;
    confetti.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      top: ${Math.random() * 40 + 30}%;
      left: ${Math.random() * 100}%;
      pointer-events: none;
      z-index: 20000;
      animation: confettiFall ${Math.random() * 1.5 + 1}s ease forwards;
      transform-origin: center;
    `;
    container.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2500);
  }

  if (!document.querySelector('#confettiStyle')) {
    const style = document.createElement('style');
    style.id = 'confettiStyle';
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg) scale(1); opacity:1; }
        100% { transform: translateY(300px) rotate(${Math.random()*720}deg) scale(0.3); opacity:0; }
      }
    `;
    document.head.appendChild(style);
  }
}


// ─── SCROLL HELPER ─────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}


// ─── NEWSLETTER ────────────────────────────
function subscribeNewsletter() {
  const input = document.querySelector('.newsletter-form input');
  if (!input || !input.value.includes('@')) {
    showToast('⚠️ Please enter a valid email!');
    return;
  }
  showToast(`📧 Subscribed with ${input.value}! Weekly bliss incoming.`);
  input.value = '';
}


// ─── HOVER RIPPLE EFFECT ───────────────────
function initRipple() {
  document.querySelectorAll('.btn-primary, .btn-secondary, .add-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.25);
        transform:scale(0); animation:rippleAnim 0.6s ease-out forwards;
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  if (!document.querySelector('#rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}


// ─── TILT EFFECT ON CARDS ──────────────────
function initTilt() {
  document.querySelectorAll('.menu-card, .event-card, .delivery-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
  });
}


// ─── TYPING EFFECT FOR MOTTO ───────────────
function initTypingEffect() {
  const motto = document.querySelector('.hero-motto');
  if (!motto) return;

  const text = motto.textContent;
  motto.textContent = '';
  motto.style.borderRight = '2px solid var(--amber)';
  motto.style.whiteSpace = 'nowrap';
  motto.style.overflow = 'hidden';

  let i = 0;
  function type() {
    if (i < text.length) {
      motto.textContent += text.charAt(i);
      i++;
      setTimeout(type, 60);
    } else {
      setTimeout(() => {
        motto.style.borderRight = 'none';
      }, 1000);
    }
  }

  setTimeout(type, 1500);
}


// ─── ACTIVE NAV LINK ───────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          link.classList.remove('active-nav');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--amber)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}


// ─── GLITCH EFFECT ON LOGO ─────────────────
function initLogoGlitch() {
  const logo = document.querySelector('.logo-text');
  if (!logo) return;

  setInterval(() => {
    logo.style.textShadow = `
      ${(Math.random()-0.5)*4}px 0 var(--violet-light),
      ${(Math.random()-0.5)*4}px 0 var(--rose)
    `;
    setTimeout(() => {
      logo.style.textShadow = 'none';
    }, 80);
  }, 5000);
}


// ─── COFFEE CUP CLICK EASTER EGG ──────────
function initCupEasterEgg() {
  const cup = document.querySelector('.coffee-cup');
  if (!cup) return;
  let clickCount = 0;

  cup.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
      showToast('🎉 You found the secret! You deserve a free cookie today!');
      clickCount = 0;
      launchConfetti();
    } else {
      showToast(`☕ Sip ${clickCount}... Keep going!`);
    }
  });
}


// ─── SMOOTH HOVER GLOW ON SECTION HEADERS ──
function initHeaderGlow() {
  document.querySelectorAll('.section-title').forEach(title => {
    title.style.transition = 'text-shadow 0.3s ease';
    title.addEventListener('mouseenter', () => {
      title.style.textShadow = '0 0 40px rgba(245,158,11,0.3)';
    });
    title.addEventListener('mouseleave', () => {
      title.style.textShadow = 'none';
    });
  });
}


// ─── PRICE SPARKLE ON HOVER ────────────────
function initPriceSparkle() {
  document.querySelectorAll('.price').forEach(price => {
    price.addEventListener('mouseenter', () => {
      price.style.textShadow = '0 0 20px rgba(245,158,11,0.8)';
      price.style.transform = 'scale(1.1)';
      price.style.transition = 'all 0.2s ease';
    });
    price.addEventListener('mouseleave', () => {
      price.style.textShadow = 'none';
      price.style.transform = 'scale(1)';
    });
  });
}


// ─── KEYBOARD SHORTCUT ─────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
    }
    if (e.key === 'm' && !e.ctrlKey) {
      scrollToSection('menu');
    }
    if (e.key === 'r' && !e.ctrlKey) {
      scrollToSection('reserve');
    }
  });
}


// ─── BACKGROUND AMBIENT GLOW MOVEMENT ──────
function initAmbientGlow() {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.body.style.background = `
      radial-gradient(
        ellipse at ${x}% ${y}%,
        rgba(124,58,237,0.04) 0%,
        rgba(10,6,8,1) 60%
      )
    `;
  });
}


// ─── INIT ALL ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ParticleSystem.init();
  CursorEffect.init();
  NavbarEffect.init();
  CounterAnimation.init();
  ScrollReveal.init();
  MenuFilter.init();
  initRipple();
  initTilt();
  initTypingEffect();
  initActiveNav();
  initLogoGlitch();
  initCupEasterEgg();
  initHeaderGlow();
  initPriceSparkle();
  initKeyboardShortcuts();
  initAmbientGlow();

  // Expose selectEvent and submitReservation globally
  window.selectEvent = selectEvent;
  window.submitReservation = submitReservation;
  window.closeModal = closeModal;
  window.scrollToSection = scrollToSection;
  window.subscribeNewsletter = subscribeNewsletter;
  window.Cart = Cart;

  console.log('%c☕ Karthikk Cafe — Drink & Be Drowned in Bliss', 
    'font-family: Georgia, serif; font-size: 18px; color: #f59e0b; background: #0a0608; padding: 12px 20px;');
  console.log('%c🎮 Secret: Click the coffee cup 5 times for a surprise!', 
    'font-size: 12px; color: #7c3aed;');
  console.log('%c⌨️ Shortcuts: M = Menu, R = Reserve, Esc = Close modal', 
    'font-size: 12px; color: #0d9488;');
});