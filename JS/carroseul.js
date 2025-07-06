const roll = document.querySelector('.recomend_roll');
const btnLeft = document.querySelector('.arrow.left');
const btnRight = document.querySelector('.arrow.right');

let currentScroll = 0;
const cardWidth = 320; // largura + gap

btnRight.addEventListener('click', () => {
  const maxScroll = roll.scrollWidth - roll.parentElement.offsetWidth;
  
  if (currentScroll < maxScroll) {
    currentScroll = Math.min(currentScroll + cardWidth, maxScroll);
    roll.style.transform = `translateX(-${currentScroll}px)`;
  }
});

btnLeft.addEventListener('click', () => {
  if (currentScroll > 0) {
    currentScroll = Math.max(currentScroll - cardWidth, 0);
    roll.style.transform = `translateX(-${currentScroll}px)`;
  }
});