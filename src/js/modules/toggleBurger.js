const toggleBurger = () => {
  const burgerBtn = document.getElementById('burger');
  const nav = document.getElementById('nav');

  document.addEventListener('click', event => {
    const target = event.target;

    if (burgerBtn.classList.contains('burger--active') && !target.closest('.nav')) {
        burgerBtn.classList.remove('burger--active');
        nav.classList.remove('header__nav--active');

    } else if (target.closest('button#burger')) {
        burgerBtn.classList.toggle('burger--active');
        nav.classList.toggle('header__nav--active')
    }
  })

  window.addEventListener('scroll', () => {
    if (burgerBtn.classList.contains('burger--active') 
      && nav.classList.contains('header__nav--active')) {

      burgerBtn.classList.remove('burger--active');
      nav.classList.remove('header__nav--active');
    }
  });
}

export default toggleBurger;