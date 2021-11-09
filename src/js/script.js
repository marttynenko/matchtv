$.fn.extend({
	printElement: function() {
		var frameName = 'printIframe';
		var doc = window.frames[frameName];
		if (!doc) {
			$('<iframe>').hide().attr('name', frameName).appendTo(document.body);
			doc = window.frames[frameName];
		}
		doc.document.body.innerHTML = this.html();
		doc.window.print();
		return this;
	}
});

$.fn.Tabs = function() {
	var selector = this;

	this.each(function() {
		var obj = $(this); 
		$(obj.attr('href')).hide();
		$(obj).click(function() {
			$(selector).removeClass('selected');
			
			$(selector).each(function(i, element) {
				$($(element).attr('href')).hide();
			});
			
			$(this).addClass('selected');
			$($(this).attr('href')).fadeIn();
			return false;
		});
	});

	$(this).show();
	$(this).first().click();
	if(location.hash!='' && $('a[href="' + location.hash + '"]').length)
		$('a[href="' + location.hash + '"]').click();	
};


 jQuery.validator.setDefaults({
  errorClass: 'invalid',
	successClass: 'valid',
	focusInvalid: false,
	errorElement: 'span',
	errorPlacement: function (error, element) {
    if ( element.parent().hasClass('jq-checkbox') ||  element.parent().hasClass('jq-radio')) {
      element.closest('label').after(error);
      
    } else if (element.parent().hasClass('jq-selectbox')) {
      element.closest('.jq-selectbox').after(error);
    } else {
      error.insertAfter(element);
    }
  },
  highlight: function(element, errorClass, validClass) {
    if ( $(element).parent().hasClass('jq-checkbox') ||  $(element).parent().hasClass('jq-radio') || $(element).parent().hasClass('jq-selectbox')) {
    	$(element).parent().addClass(errorClass).removeClass(validClass);
    } else {
    	$(element).addClass(errorClass).removeClass(validClass);
    }
  },
  unhighlight: function(element, errorClass, validClass) {
  	if ( $(element).parent().hasClass('jq-checkbox') ||  $(element).parent().hasClass('jq-radio') || $(element).parent().hasClass('jq-selectbox')) {
    	$(element).parent().removeClass(errorClass).addClass(validClass);
    } else {
    	$(element).removeClass(errorClass).addClass(validClass);
    }
  }
});
//дефолтные сообщения, предупреждения
jQuery.extend(jQuery.validator.messages, {
  required: "Обязательное поле",
  email: "Некорректный email адрес",
  url: "Некорректный URL",
  number: "Некорректный номер",
  digits: "Это поле поддерживает только числа",
  equalTo: "Поля не совпадают",
  maxlength: jQuery.validator.format('Максимальная длина поля {0} символа(ов)'),
  minlength: jQuery.validator.format('Минимальная длина поля {0} символа(ов)'),
  require_from_group: jQuery.validator.format('Отметьте миниммум {0} из этих полей')
});
//кастомные методы валидатора
jQuery.validator.addMethod("lettersonly", function(value, element) {
  return this.optional(element) || /^[a-zA-ZА-Яа-я\s]+$/i.test(value);
}, "Только буквы");

jQuery.validator.addMethod("telephone", function(value, element) {
  return this.optional(element) || /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){6,14}(\s*)?$/i.test(value);
}, "Некорректный формат"); 



const FARBA = {
	//функция для навешивания изображений фоном
	backgrounded (selector) {
		$(selector).each(function(){
			var $this = $(this),
			$src = $this.find('.ui-backgrounded-bg').attr('src');
			if($this.find('.ui-backgrounded-bg').length) {
				$this.addClass('backgrounded').css('backgroundImage','url('+$src+')');
			}
		});
	},

	//lazy load для сторонних либ
	lazyLibraryLoad(scriptSrc,linkHref,callback) {
		let script = document.createElement('script');
		script.src = scriptSrc;
		document.querySelector('#wrapper').after(script);
	
		if (linkHref !== '') {
			let style = document.createElement('link');
			style.href = linkHref;
			style.rel = 'stylesheet';
			document.querySelector('link').before(style);
		}
	
		script.onload = callback
	}
}


const Store = {
	files: [],
	removeFile: function(index) {
	  this.files.splice(index, 1);
	},
	addFiles: function(files) {
	  this.files = this.files.concat(files);
	},
	readURL: function(e,input,block) {
		const that = this;
		if (!e.target.files.length) { return }
	  const files = Object.keys(e.target.files).map((i) => e.target.files[i]);
	  that.addFiles(files);

	  for (var i = 0; i < that.files.length; i++) {
			var reader = new FileReader();
			$(block).find('.ui-files-preview').remove();
			reader.onload = function (e) {
				var image = document.createElement('img');
				var span = document.createElement('span');
				image.setAttribute('src',e.target.result);
				span.setAttribute('class','ui-files-preview');
				span.setAttribute('data-index',i);
				span.appendChild(image);
				$(span).append('<i class="ui-files-preview-delete"></i>');
				$(block).append(span);
			};
			reader.readAsDataURL(that.files[i]);
		}
	  e.target.value = '';
	},
	generateFormData: function(formData) {
		// const formData = new FormData();
		this.files.map((file, index) => {
				formData.append(`file${index + 1}`, file);
		});
		// return formData;
	}
}


jQuery(document).ready(function($){

	FARBA.backgrounded('.ui-backgrounded')

	if ($('.fotorama').length) {
		FARBA.lazyLibraryLoad(
			'https://cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.min.js',
			'https://cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.min.css',
			() => {
				const ww = document.documentElement.clientWidth
				$('.fotorama').fotorama({
					maxwidth: '100%',
					nav: 'thumbs',
					thumbwidth: ww > 992 ? 212 : 120,
					thumbheight: ww > 992 ? 142 : 85,
					thumbmargin: ww > 992 ? 15 : 10
				})
			}
		)
	}
	

	$(document).on('click','.mfp-custom-close',function(e){
		e.preventDefault();
		$.magnificPopup.close();
	});
   

	//инициализация MFP popup для форм
	$(document).on('click','.ajax-mfp',function(){
		var a = $(this);
		$.magnificPopup.open({
			items: { src: a.attr('data-href') },
			type: 'ajax',    
			overflowY: 'scroll',
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in',
			ajax: {
				tError: 'Ошибка. <a href="%url%">Контент</a> не может быть загружен',
			},
			callbacks: {
				open: function () {
					setTimeout(function(){
						$('.mfp-wrap').addClass('not_delay');
						$('.mfp-popup').addClass('not_delay');
					},700);
				}
		  }
		});
		return false;
	});
	


	//стилизация элементов форм
	$('input[type="checkbox"], input[type="radio"], input[type="file"], select').not('.not-styler').styler({
		// singleSelectzIndex: '1',
	});


});//ready close

if (document.querySelector('.ux-mask-date')) {
	FARBA.lazyLibraryLoad(
		'https://cdnjs.cloudflare.com/ajax/libs/imask/6.2.2/imask.min.js',
		'',
		() => {
			const masks = document.querySelectorAll('.ux-mask-date')
			const maskOptions = {
				mask: Date,
				pattern: '`d.`m.Y', 
				blocks: {
					d: {
						mask: IMask.MaskedRange,
						from: 1,
						to: 31,
						maxLength: 2,
					},
					m: {
						mask: IMask.MaskedRange,
						from: 1,
						to: 12,
						maxLength: 2,
					},
					Y: {
						mask: IMask.MaskedRange,
						from: 1900,
						to: 2999,
					}
				}
			}
			masks.forEach(el => {
        IMask(el, maskOptions)
      })
		}
	)
}

if (document.querySelector('.ux-mask-phone')) {
  FARBA.lazyLibraryLoad(
    '//cdnjs.cloudflare.com/ajax/libs/imask/6.2.2/imask.min.js',
    '',
    () => {
      const masks = document.querySelectorAll('.ux-mask-phone')
      const maskOptions = {
        mask: '+{375} (00) 000-00-00',
        lazy: false,
      }
      masks.forEach(el => {
        IMask(el, maskOptions)
      })
    }
  )
}