(function () {
  const items = window.PORTFOLIO_ITEMS || [];
  const gallery = document.querySelector("[data-gallery]");
  const count = document.querySelector(".gallery-count");
  const buttons = document.querySelectorAll(".filter-button");
  const dialog = document.querySelector(".lightbox");
  const dialogImage = dialog.querySelector("img");
  const dialogCaption = dialog.querySelector("figcaption");
  const closeButton = dialog.querySelector(".lightbox-close");
  const previousButton = dialog.querySelector(".lightbox-nav.previous");
  const nextButton = dialog.querySelector(".lightbox-nav.next");

  let filteredItems = items;
  let activeIndex = 0;

  function humanTitle(item, index) {
    return `${item.label} work ${index + 1}`;
  }

  function render(filter) {
    filteredItems =
      filter === "all" ? items : items.filter((item) => item.category === filter);

    gallery.innerHTML = filteredItems
      .map(
        (item, index) => `
          <figure class="photo-card">
            <button type="button" data-index="${index}" aria-label="Open ${humanTitle(
              item,
              index
            )}">
              <img src="${item.src}" alt="${humanTitle(
          item,
          index
        )}" loading="lazy" decoding="async" />
              <figcaption>
                <span>${item.label}</span>
                <strong>${humanTitle(item, index)}</strong>
              </figcaption>
            </button>
          </figure>
        `
      )
      .join("");

    count.textContent = `${filteredItems.length} photos shown`;
  }

  function openPhoto(index) {
    const item = filteredItems[index];
    if (!item) return;

    activeIndex = index;
    dialogImage.src = item.src;
    dialogImage.alt = humanTitle(item, index);
    dialogCaption.textContent = humanTitle(item, index);
    dialog.showModal();
  }

  function movePhoto(direction) {
    const nextIndex =
      (activeIndex + direction + filteredItems.length) % filteredItems.length;
    openPhoto(nextIndex);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      render(button.dataset.filter);
    });
  });

  gallery.addEventListener("click", (event) => {
    const trigger = event.target.closest("button[data-index]");
    if (!trigger) return;
    openPhoto(Number(trigger.dataset.index));
  });

  closeButton.addEventListener("click", () => dialog.close());
  previousButton.addEventListener("click", () => movePhoto(-1));
  nextButton.addEventListener("click", () => movePhoto(1));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowLeft") movePhoto(-1);
    if (event.key === "ArrowRight") movePhoto(1);
  });

  render("all");
})();
