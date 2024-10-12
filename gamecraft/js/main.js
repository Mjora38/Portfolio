const penTitle = document.querySelector('.pen-title');
const menu = document.querySelector('.js-menu');
const menuTrigger = document.querySelectorAll('.js-menu-trigger');
menuTrigger.forEach(btn => {
  btn.addEventListener('click', function () {
    menuTrigger.forEach(b => {
      b.classList.toggle('menu-trigger--menu-open');
    });
    menu.classList.toggle('menu--open');
  });
});

document.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function(e) {
      e.preventDefault();
      var href = this.getAttribute('href');
      document.getElementById('transition-overlay').classList.add('active');
      setTimeout(function() {
          window.location.href = href;
      }, 500); // Match this delay to the transition duration in your CSS
  });
});

document.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var href = this.getAttribute('href');
    if (this.classList.contains('home-btn')) {
      // Handle home button click
      console.log('Home button clicked!');
      // Add your home button logic here
    } else {
      // Handle other links
      document.getElementById('transition-overlay').classList.add('active');
      setTimeout(function() {
        window.location.href = href;
      }, 500); // Match this delay to the transition duration in your CSS
    }
  });
});