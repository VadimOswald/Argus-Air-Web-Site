//------------------------------------------//
//---ПРАВИЛЬНЫЙ ПЕРЕНОС СТРОК ДЛЯ МОБИЛКИ--//
//-----------------------------------------//
const updateTextBreaks = () => {
  const el = document.querySelector('.hero__description');
  if (!el) return;
  
  const width = window.innerWidth;
  
  if (width < 900) {
    el.innerHTML = `Точная смета. Чёткие сроки.<br>Бесшумная работа. Получите<br>расчёт стоимости и сроков вашего<br>проекта за 24 часа`;
  } else {
    el.innerHTML = `Точная смета. Чёткие сроки. Бесшумная работа. Получите расчёт<br>стоимости и сроков вашего проекта<br>за 24 часа`;
  }
};

window.addEventListener('resize', updateTextBreaks);
updateTextBreaks();
//------------------------------------------//
//-----------------КОНЕЦ--------------------//
//------------------------------------------//


//=== Обработчики попапов ===//
(function() {
  'use strict';

  const popups = document.querySelectorAll('.popup');
  let activePopup = null;

  function openPopup(id) {
    const popup = document.getElementById(id);
    if (!popup) return;
    
    if (activePopup) {
      activePopup.classList.remove('is-active');
    }
    
    popup.classList.add('is-active');
    activePopup = popup;
    
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      const btn = popup.querySelector('.popup__button');
      if (btn) btn.focus();
    }, 100);
  }

  function closePopup() {
    if (!activePopup) return;
    
    activePopup.classList.remove('is-active');
    activePopup = null;
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('popup__overlay')) {
      closePopup();
      return;
    }
    
    if (e.target.classList.contains('popup__button')) {
      closePopup();
      return;
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closePopup();
    }
  });

  window.ArgusPopup = {
    open: openPopup,
    close: closePopup
  };

})();
//========== КОНЕЦ ПОПАПОВ ==========//


//=== Обработчики форм ===//
document.addEventListener('DOMContentLoaded', function() {

  // Форма: consultation--first → popup1
  const formFirst = document.querySelector('.consultation--first .consultation__form');
  if (formFirst) {
    formFirst.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      
      try {
        const response = await fetch('handler.php', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.success) {
          window.ArgusPopup.open('popup1');
          this.reset();
        }
      } catch (error) {}
    });
  }

  // Форма: consultation--second → popup2
  const formSecond = document.querySelector('.consultation--second .consultation__form');
  if (formSecond) {
    formSecond.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      
      try {
        const response = await fetch('handler.php', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.success) {
          window.ArgusPopup.open('popup2');
          this.reset();
        }
      } catch (error) {}
    });
  }

  // Форма: newsletter → popup2
  const formNewsletter = document.querySelector('.newsletter__form');
  if (formNewsletter) {
    formNewsletter.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      
      try {
        const response = await fetch('handler.php', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.success) {
          window.ArgusPopup.open('popup3');
          this.reset();
        }
      } catch (error) {}
    });
  }

  // Форма: consultation--news → popup1
  const formNewsConsult = document.querySelector('.consultation--news .consultation__form');
  if (formNewsConsult) {
    formNewsConsult.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      
      try {
        const response = await fetch('handler.php', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.success) {
          window.ArgusPopup.open('popup1');
          this.reset();
        }
      } catch (error) {}
    });
  }

});
//========== КОНЕЦ ОБРАБОТЧИКОВ ФОРМ ==========//



(() => {
  let targetScroll = window.scrollY;
  let currentScroll = window.scrollY;

  const ease = 0.05;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function updateTarget(e) {
    targetScroll += e.deltaY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    targetScroll = clamp(targetScroll, 0, maxScroll);
  }

  window.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      updateTarget(e);
    },
    { passive: false }
  );

  function animate() {
    currentScroll += (targetScroll - currentScroll) * ease;

    window.scrollTo(0, currentScroll);
    requestAnimationFrame(animate);
  }

  animate();
})(); 
