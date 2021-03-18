  var main = new gsap.timeline();
  main.fromTo(".home-section img", {
    scale: 0.7,
    opacity: 0,
  }, {
    scale: 1,
    opacity: 1,
    duration: 0.8,
    delay: .5
  });
  main.fromTo(".home-section button", {
    opacity: 0,
    y: 30
  }, {
    opacity: 1,
    y: 0,
    duration: .5
  });

  function openGamesRoom() {
    var t1 = new gsap.timeline();
    t1.to(".home-section button", {
      opacity: 0,
      duration: 0.5
    });
    t1.to(".home-section img", {
      opacity: 0,
      duration: 0.5
    });
    t1.to(".home-section", {
      display: "none",
      duration: .1
    });
    t1.to(".about-section", {
      visibility: "visible",
      duration: .1
    });
    t1.fromTo(".games-title", {
      opacity: 0
    }, {
      opacity: 1,
      duration: 0.2
    });
    t1.fromTo(".about-box", {
      opacity: 0,
    }, {
      display: "flex",
      opacity: 1,
      duration: .5
    });
    t1.fromTo(".carousel-cell", {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      stagger: 0.3
    });
    var elem = document.querySelector('.main-carousel');
    var flkty = new Flickity(elem, {
        // options
        cellAlign: 'left',
        contain: true,
        wrapAround: true,
        autoPlay: 2300,
        prevNextButtons: false,
        pageDots: true,
        adaptiveHeight: true,
        setGallerySize: false,
        draggable: true,
        on: {
          ready: function() {
            console.log('Flickity is ready');
          }
        }
    });
    }

    function backToGamesRoom() {
      $(".home-section").css("opacity", "0");
      window.open("index.html", "_self");
    }

    function openTetris() {
      window.open("tetris.html", "_self");
    }

    function openSpace() {
      window.open("space.html", "_self");
    }

    function openPacman() {
      window.open("pacman.html", "_self");
    }

    function openBrick() {
      window.open("brick.html", "_self");
    }

    function openPing() {
      window.open("ping.html", "_self");
    }

    function openSnake() {
      window.open("snake.html", "_self");
    }
