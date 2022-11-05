
$(document).ready(function(){
    $('.carousel__inner').slick({ 
      speed: 1200,
      adaptiveHeight: false, //картинки разной высоты
      prevArrow: '<button type="button" class="slick-prev"><img src="icons/left.svg" alt="left"></button>',
      nextArrow: '<button type="button" class="slick-next"><img src="icons/right.svg" alt="right"></button>',
      responsive: [
        {
            breakpoint: 992,
            settings: {
                dots: true,
                arrows: false
            }
        }
    ]
      
    });
    // Tabs

    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
      $(this)
      // this ссылается на тот эл-т что мы нажали
      //если мы нажали на таб, тот что не активен, то добавляем ему класс активности  addClass
      //Далее все соседние табы, которые не включают активный таб, они должны удалить класс Актив, если он есть  removeClass
        .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')

      //Ищем ближайший эл-т closest
      //Ищем ближайший блок с контентом  find
      //Удаляем класс актив у тех эл-тов что нашли removeClass
      // .eq($(this).index()) получает номер эл-та тот что мы нажали
      //дальш определенному контенту добавляем определенный номер класса  addClass 
        .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
    });

//Открываем карточки "ПОДРОБНЕЕ"

  function toggleSlide(item) {
    $(item).each(function(i) {
      //Ссылаемся на каждый эл-т что сейчас перебирается
        $(this).on('click', function(e) {
      
            e.preventDefault();
      /* 
      Описываем что при клике на "подробнее", мы должны взять класс контента, и при клике должен переключаться класс команда toggleClass/
      Если класс есть, то он убирается, если нету, то он присваивается
      eq позволяет получать элемент по порядку по определенному индексу 
      */

            $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
            $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
        })
    });
};

    toggleSlide('.catalog-item__link');
    toggleSlide('.catalog-item__list-back');

// MODAL

/* fadeOut позволяет анимированно скрыть эл-ты
Например скрыть кнопки
$('[data-modal=consultation]').fadeOut();
*/

$('[data-modal="consultation"]').on('click', function() {
  $('.overlay, #consultation').fadeIn('slow');
});

//Скрипт для закрытия модального окна крестиком
$('.modal__close').on('click', function() {
  $('.overlay, #consultation, #order, #thanks').fadeOut('slow');
})

//Скрипт для кнопок купить
// $('.button_price').on('click', function() {
//   $('.overlay, #order').fadeIn('slow');
// })
/*
Скрипт переборки кнопок под правильное название.
Нужно чтобы скрипт при нажатии на кнопку "купить", сначала находил бы эл-та subtitle название в этой карточке, после этого он бы вытаскивал текст с карточки и перед открытием модального окна, он бы заменял текст на нужный
*/
$('.button_price').each(function(i) {
  $(this).on('click', function() {
    $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
    $('.overlay, #order').fadeIn('slow');
  })
});

//ВАЛИДАТОР ФОРМ
// $('#order form').validate();
// $('#consultation form').validate({
//   rules: {
//     name: {
//       required: true,
//       minlength: 2,
//     },
//     phone: "required",
//     email: {
//       required: true,
//       email: true,
//     },
//   },
//   messages: {
//     name: {
//       required:  "Пожалуйста, введите своё имя",
//       minlength: jQuery.validator.format('Минимальное кол-во символов {0}'),
//     },
    
//     phone: "Пожалуйста, введите свой номер телефона",
//     email: {
//       required: "Пожалуйста, введите свой почтовый адрес",
//       email: "Почтовый адрес должен быть в формате name@domain",

//     }
//   }
// });
// $('#consultation-main-form').validate();

//ОПТИМИЗИРУЕМ КОД ДЛЯ ВСЕХ ФОРМ

function validateForm(form) {
  $(form).validate({
     rules: {
       name: {
         required: true,
         minlength: 2,
       },
       phone: "required",
       email: {
         required: true,
         email: true,
       },
     },
     messages: {
       name: {
         required:  "Пожалуйста, введите своё имя",
         minlength: jQuery.validator.format('Минимальное кол-во символов {0}'),
       },
  
       phone: "Пожалуйста, введите свой номер телефона",
       email: {
         required: "Пожалуйста, введите свой почтовый адрес",
         email: "Почтовый адрес должен быть в формате name@domain",
    
       }
     }
   });
};
    validateForm('#consultation-main-form');
    validateForm('#consultation form');
    validateForm('#order form');


    //Подключаем Маску к формам

    $('input[name=phone]').mask('+38(999)999-99-99');

    //Скрипт для отправки данных с любой из форм
    //submit когда прошли все условия в заполнении форм
    $('form').submit(function(e) {
      //при prevent после отправки формы перезагрузки страницы не будет
      e.preventDefault();

      /*
      при загрузке на реальный хостинг, пустые форма не очищаются, для этого напишем небольшой скрипт
      и говорим, что если форма не прошла валидацию на сайте, то мы эту функцию прекратим и код не дойдет до отпарвки смарт php */
      if (!$(this).valid()) {
        return;
      }


      //отправляем данные на сервер через Ajax
      $.ajax({
        type: 'POST', //отправка данных
        url: 'mailer/smart.php',
        //подготовка данных перед отправкой на сервер с помощью метода serialize
        data: $(this).serialize(),
      }).done(function() {
        //внутри формы находит инпуты и устанавливаем value val ( с пустой строкой) и очистим все инпуты
        $(this).find('input').val('');

        // скрываем форму после отправки и выводим форму "спасибо"
        $('#consultation, #order').fadeOut();
        $('.overlay, #thanks').fadeIn('slow');
        
        //очистить и обновить форму после отправки trigger
        $('form').trigger('reset');
      });
      return false;
    })

    //Smooth scroll and page-up
    $(window).scroll(function() {
      if ($(this).scrollTop() > 1600) {
        //Скролл будет появляться после пролистывания вниз больше 1600 пикселей
        $('.page-up').fadeIn();
      } else
        $('.page-up').fadeOut();
    });

    // Скрипт плавной прокрутки

    //нам нужно получить параметры по оперделнному атрибуту
    $("a[href^='#up']").click(function() {
      const _href = $(this).attr("href");
      $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
        return false;

    });

    new WOW().init();
    
      
});     
