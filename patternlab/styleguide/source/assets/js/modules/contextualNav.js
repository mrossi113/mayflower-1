// Open menu.
var menuButton = document.querySelector(".js-header-menu-button");

if (null !== menuButton) {
  menuButton.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector("body").classList.toggle("show-menu");
  });
}

// Remove current page from contextual nav menu.
var contextualNavLinks = document.querySelectorAll(".ma__contextual-navigation--anchor");
var currentLocation = window.location.href;

contextualNavLinks.forEach(function (navLink) {

  var navLinkHref = navLink.getAttribute("href");

  if (navLinkHref == currentLocation) {
    navLink.parentNode.remove();
  }
});

// Open submenus.
document.querySelectorAll('.ma__contextual-navigation__nav-wrapper .ma__main-nav__top-link').forEach(function (button) {
  button.addEventListener('click', function () {
    var menuIsOpen = document.querySelector("body").classList.contains('show-submenu');
    var subMenu = button.parentNode.querySelector('.js-main-nav-content');
    var isClosed = subMenu.classList.contains('is-closed');

    if (menuIsOpen) {
      document.querySelector("body").classList.remove('show-submenu');
    }
    else {
      document.querySelector("body").classList.add('show-submenu');
    }


    if (isClosed) {
      subMenu.classList.add('is-open');
      subMenu.classList.remove('is-closed');
    } else {
      subMenu.classList.remove('is-open');
      subMenu.classList.add('is-closed');
    }
  });
});

// Close Submenus 
document.querySelector('.ma__contextual-navigation__nav-wrapper .js-close-sub-nav').addEventListener('click', function () {
  var openMenu = document.querySelectorAll(".js-main-nav-content.is-open");
  var menuIsOpen = document.querySelector("body").classList.contains('show-submenu');

  if (menuIsOpen) {
    document.querySelector("body").classList.remove('show-submenu');
  }
  else {
    document.querySelector("body").classList.add('show-submenu');
  }

  [].forEach.call(openMenu, function (el) {
    el.classList.remove('is-open');
    el.classList.add('is-closed');
  });
});
