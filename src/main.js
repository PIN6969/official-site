import './styles/main.scss';
import { Offcanvas } from 'bootstrap';
import { register } from 'swiper/element/bundle';
import { initI18n, getStoredLang, messages } from './i18n.js';

initI18n();
register();

/** 遊戲供應商 logo 跑馬燈：載入 `assets/img/game_company_logo` 內所有圖檔並無縫循環 */
function initGameCompanyLogoMarquee() {
  const track = document.querySelector('[data-game-logo-marquee]');
  const wrap = document.querySelector('[data-game-logo-marquee-wrap]');
  if (!track || !wrap) return;

  const modules = import.meta.glob('./assets/img/game_company_logo/*.{png,jpg,jpeg,svg,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
  });

  const urls = Object.keys(modules)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((key) => modules[key]);

  if (!urls.length) {
    wrap.hidden = true;
    return;
  }

  const buildItems = () => {
    const frag = document.createDocumentFragment();
    urls.forEach((src) => {
      const item = document.createElement('div');
      item.className = 'section-games__marquee-item';
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      item.appendChild(img);
      frag.appendChild(item);
    });
    return frag;
  };

  track.appendChild(buildItems());
  track.appendChild(buildItems());
}

initGameCompanyLogoMarquee();

const heroVideo = document.querySelector('.section-banner__video');
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.loop = true;
  heroVideo.autoplay = true;
  heroVideo.playsInline = true;
  const tryPlay = () => {
    heroVideo.play().catch(() => {});
  };
  heroVideo.addEventListener('canplay', tryPlay, { once: true });
  tryPlay();
}

const productsSection = document.getElementById('section-products');
const productsHeroContent = document.querySelector('#section-products .hero-content');
if (productsSection && productsHeroContent) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // 只要進入視窗就觸發，避免 intersectionRatio 門檻過高導致動畫看不到
        if (entry.isIntersecting) {
          productsSection.classList.add('is-visible');
          observer.disconnect();
        }
      });
    },
    {
      threshold: [0, 0.15, 0.3],
      rootMargin: '0px 0px -10% 0px',
    }
  );
  observer.observe(productsHeroContent);
}

/** section-games：捲到區塊後左側文字滑入、hero 圖片浮現 */
const gamesSection = document.getElementById('section-games');
if (gamesSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        gamesSection.classList.add('is-visible');
        observer.disconnect();
      });
    },
    { threshold: [0, 0.15, 0.3], rootMargin: '0px 0px -10% 0px' }
  );
  observer.observe(gamesSection);
}

const productsSwiper = document.querySelector('.products-swiper');
if (productsSwiper) {
  Object.assign(productsSwiper, {
    slidesPerView: 1.12,
    centeredSlides: true,
    loop: false,
    speed: 520,
    spaceBetween: 16,
    grabCursor: true,
    pagination: {
      el: '.products-swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      992: {
        enabled: false,
      },
    },
  });
  productsSwiper.initialize();

  const prevBtn = document.querySelector('.products-swiper-nav--prev');
  const nextBtn = document.querySelector('.products-swiper-nav--next');
  const syncProductsNavState = () => {
    const swiper = productsSwiper.swiper;
    if (!swiper) return;
    const atStart = swiper.isBeginning;
    const atEnd = swiper.isEnd;
    prevBtn?.classList.toggle('is-disabled', atStart);
    nextBtn?.classList.toggle('is-disabled', atEnd);
    if (prevBtn) prevBtn.disabled = atStart;
    if (nextBtn) nextBtn.disabled = atEnd;
  };

  prevBtn?.addEventListener('click', () => {
    productsSwiper.swiper?.slidePrev();
  });
  nextBtn?.addEventListener('click', () => {
    productsSwiper.swiper?.slideNext();
  });
  productsSwiper.addEventListener('swiperslidechange', syncProductsNavState);
  syncProductsNavState();
}

const advantageSwiper = document.querySelector('.advantage-swiper');
const advantageImages = document.querySelectorAll('[data-advantage-image]');
if (advantageSwiper) {
  const syncAdvantageImage = (index) => {
    advantageImages.forEach((img, i) => {
      img.classList.toggle('is-active', i === index);
    });
  };

  Object.assign(advantageSwiper, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 20,
    speed: 520,
    /** 在可捲動頁面內：不攔截 touchstart，頁面才能正常上下滑；橫滑仍由 Swiper 處理 */
    nested: true,
    touchStartPreventDefault: false,
    touchReleaseOnEdges: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    grabCursor: true,
    pagination: {
      el: '.advantage-swiper-pagination',
      clickable: true,
    },
  });
  advantageSwiper.initialize();
  syncAdvantageImage(0);

  advantageSwiper.addEventListener('swiperslidechange', () => {
    const currentIndex = advantageSwiper.swiper?.realIndex ?? 0;
    syncAdvantageImage(currentIndex);
  });
}

/** section-advantage：標題區 title-group 預設隱藏，滾入後由左滑出 */
const advantageSection = document.getElementById('section-advantage');
if (advantageSection) {
  const target = advantageSection.querySelector('.hero-content') || advantageSection;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          advantageSection.classList.add('is-visible');
          observer.disconnect();
        }
      });
    },
    { threshold: [0, 0.2, 0.35], rootMargin: '0px 0px -10% 0px' }
  );
  observer.observe(target);
}

/** section-tech：捲到區塊後 header 滑入、cards 依序翻動 */
const techSection = document.getElementById('section-tech');
if (techSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        techSection.classList.add('is-visible');
        observer.disconnect();
      });
    },
    { threshold: [0, 0.15, 0.3], rootMargin: '0px 0px -10% 0px' }
  );
  observer.observe(techSection);
}

/** 非循環：僅 update；PC / H5 兩台 swiper 進度互不帶入對方索引。 */
const syncTemplatesSwiperLayout = (swiper, options = {}) => {
  const { repeatForInitialPeek = false } = options;
  if (!swiper || swiper.destroyed || !swiper.initialized) return;

  const run = () => {
    swiper.update();
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      run();
      if (repeatForInitialPeek) {
        setTimeout(run, 0);
        setTimeout(run, 120);
      }
    });
  });
};

document.querySelectorAll('#section-templates .templates-swiper').forEach((templatesSwiper) => {
  const isPcTemplates = Boolean(templatesSwiper.closest('.templates-showcase.pc-show'));

  Object.assign(templatesSwiper, {
    slidesPerView: 'auto',
    centeredSlides: true,
    slidesPerGroup: 1,
    spaceBetween: 20,
    speed: 480,
    loop: false,
    rewind: false,
    watchOverflow: false,
    watchSlidesProgress: true,
    roundLengths: true,
    grabCursor: true,
    observer: true,
    observeParents: true,
    breakpoints: {
      0: {
        slidesPerView: 'auto',
        spaceBetween: 14,
      },
      768: {
        slidesPerView: 'auto',
        spaceBetween: 18,
      },
      1200: {
        slidesPerView: 'auto',
        spaceBetween: 20,
      },
    },
  });
  templatesSwiper.initialize();
  const runSync = () => {
    const inst = templatesSwiper.swiper;
    if (inst) syncTemplatesSwiperLayout(inst, { repeatForInitialPeek: isPcTemplates });
    else requestAnimationFrame(runSync);
  };
  runSync();
});

const templatesSection = document.getElementById('section-templates');
const templateDeviceButtons = templatesSection?.querySelectorAll('[data-template-device-btn]') || [];
const templatePcBtn = templatesSection?.querySelector('[data-template-device-btn="pc"]');
const templateH5Btn = templatesSection?.querySelector('[data-template-device-btn="h5"]');
const templatePcSwiperEl = templatesSection?.querySelector('.templates-showcase.pc-show .templates-swiper');
const templateH5SwiperEl = templatesSection?.querySelector('.templates-showcase.h5-show .templates-swiper');

const setTemplateDevice = (device) => {
  if (!templatesSection) return;

  templatesSection.classList.toggle('is-h5', device === 'h5');

  templateDeviceButtons.forEach((btn) => {
    const isActive = btn.getAttribute('data-template-device-btn') === device;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  const targetSwiper = device === 'h5' ? templateH5SwiperEl?.swiper : templatePcSwiperEl?.swiper;
  syncTemplatesSwiperLayout(targetSwiper, { repeatForInitialPeek: device === 'pc' });
};

templatePcBtn?.addEventListener('click', () => setTemplateDevice('pc'));
templateH5Btn?.addEventListener('click', () => setTemplateDevice('h5'));

// 窄視窗（手機）預設顯示 H5 手機模板圖；桌機預設 PC。
const mobileTemplatesMql = window.matchMedia('(max-width: 767.98px)');
const syncTemplateDeviceToViewport = () => {
  setTemplateDevice(mobileTemplatesMql.matches ? 'h5' : 'pc');
};
syncTemplateDeviceToViewport();
mobileTemplatesMql.addEventListener('change', syncTemplateDeviceToViewport);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const header = document.querySelector('.site-header');
    const offset = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    const oc = document.getElementById('mobileNav');
    if (oc) {
      const instance = Offcanvas.getInstance(oc);
      if (instance) instance.hide();
    }
  });
});

// contact 頁面：點選導回首頁 section 的連結時，強制執行跳轉
document.querySelectorAll('[data-home-section-link]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    window.location.href = href;
  });
});

/** mobile menu: 同步 toggler 圖示（漢堡 <-> 叉叉） */
const mobileNav = document.getElementById('mobileNav') || document.getElementById('mobileNavContact');
if (mobileNav) {
  mobileNav.addEventListener('show.bs.offcanvas', () => {
    document.body.classList.add('is-mobile-menu-open');
  });
  mobileNav.addEventListener('hidden.bs.offcanvas', () => {
    document.body.classList.remove('is-mobile-menu-open');
  });
}

/** contact page: 點擊官方信箱按鈕時複製信箱 */
const copyEmailBtn = document.querySelector('[data-copy-email]');
if (copyEmailBtn) {
  const lang = getStoredLang();
  const dict = messages[lang] || messages['zh-TW'];
  const copyToastMessage = dict.contact_copy_toast || '已複製信箱帳號';
  let toastTimer = null;
  let copyToast = null;
  const showCopyToast = () => {
    if (!copyToast) {
      copyToast = document.createElement('div');
      copyToast.className = 'copy-toast';
      copyToast.textContent = copyToastMessage;
      document.body.appendChild(copyToast);
    }
    copyToast.classList.add('is-show');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      copyToast?.classList.remove('is-show');
    }, 1400);
  };

  copyEmailBtn.addEventListener('click', async () => {
    const email = copyEmailBtn.getAttribute('data-copy-email');
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      copyEmailBtn.classList.add('is-copied');
      window.setTimeout(() => copyEmailBtn.classList.remove('is-copied'), 1200);
      showCopyToast();
    } catch {
      // fallback for older browsers / blocked clipboard permission
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showCopyToast();
    }
  });
}

/** section-business：
 *  1) 滾入區塊時右下角「回到頁面頂部」按鈕顯示
 *  2) 圖示區塊每 2 秒由左至右輪流變色
 */
const businessSection = document.getElementById('section-business');
const businessSteps = document.querySelectorAll('[data-business-step]');
const businessScrollTopBtn = document.querySelector('[data-business-scroll-top]');

let businessStepIndex = 0;
let businessStepTimer = null;

const setBusinessStepActive = (index) => {
  businessSteps.forEach((el, i) => el.classList.toggle('is-active', i === index));
};

const startBusinessStepCycle = () => {
  if (!businessSteps.length) return;
  if (businessStepTimer) return;

  businessStepTimer = window.setInterval(() => {
    businessStepIndex = (businessStepIndex + 1) % businessSteps.length;
    setBusinessStepActive(businessStepIndex);
  }, 2000);
};

const stopBusinessStepCycle = () => {
  if (!businessStepTimer) return;
  window.clearInterval(businessStepTimer);
  businessStepTimer = null;
};

if (businessSection && businessSteps.length && businessScrollTopBtn) {
  businessScrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target !== businessSection) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          businessScrollTopBtn.classList.add('is-show');
          businessStepIndex = 0;
          setBusinessStepActive(businessStepIndex);
          startBusinessStepCycle();
        } else {
          businessScrollTopBtn.classList.remove('is-show');
          stopBusinessStepCycle();
          businessStepIndex = 0;
          setBusinessStepActive(businessStepIndex);
        }
      });
    },
    { threshold: [0, 0.15, 0.3], rootMargin: '0px 0px -10% 0px' },
  );

  io.observe(businessSection);
}
