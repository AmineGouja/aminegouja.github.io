const sections = [...document.querySelectorAll(".reveal, main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav a")];

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
