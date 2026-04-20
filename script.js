const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
  }
);

document.querySelectorAll(".reveal").forEach(section => {
  revealObserver.observe(section);
});

const linkMap = new Map(
  navLinks.map(link => [link.getAttribute("href").slice(1), link])
);

if (navLinks.length > 0) {
  const navObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const activeLink = linkMap.get(entry.target.id);
        if (!activeLink) {
          return;
        }

        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove("is-active"));
          activeLink.classList.add("is-active");
        }
      });
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: 0.1,
    }
  );

  document.querySelectorAll("main section[id]").forEach(section => {
    navObserver.observe(section);
  });
}

const getSlidesPerView = () => {
  if (window.innerWidth <= 640) {
    return 1;
  }

  if (window.innerWidth <= 980) {
    return 2;
  }

  return 3;
};

document.querySelectorAll("[data-carousel]").forEach(carousel => {
  const viewport = carousel.querySelector(".projects-viewport");
  const track = carousel.querySelector(".projects-track");
  const slides = [...carousel.querySelectorAll(".project-slide")];
  const prevButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");

  if (!viewport || !track || slides.length === 0 || !prevButton || !nextButton) {
    return;
  }

  let index = 0;

  const updateCarousel = () => {
    const slidesPerView = getSlidesPerView();
    const maxIndex = Math.max(0, slides.length - slidesPerView);
    index = Math.min(index, maxIndex);

    const offset = slides[index]?.offsetLeft ?? 0;
    track.style.transform = `translateX(-${offset}px)`;

    prevButton.disabled = index === 0;
    nextButton.disabled = index >= maxIndex;
  };

  prevButton.addEventListener("click", () => {
    const step = getSlidesPerView();
    index = Math.max(0, index - step);
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    const step = getSlidesPerView();
    const maxIndex = Math.max(0, slides.length - step);
    index = Math.min(maxIndex, index + step);
    updateCarousel();
  });

  window.addEventListener("resize", updateCarousel);

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(updateCarousel);
    resizeObserver.observe(viewport);
  }

  updateCarousel();
});
