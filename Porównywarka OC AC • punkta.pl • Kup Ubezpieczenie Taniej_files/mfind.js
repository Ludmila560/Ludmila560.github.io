(function ($) {
  window.mfind = {
    loader: {
      show: function (option) {
        $('.loader-container').fadeIn(option);
      },
      hide: function (option) {
        $('.loader-container').fadeOut(option);
      }
    },
    /**
     * Form helpers methods
     */
    form: {
      validate: function (form) {
        form.find('[required], .required').each(function () {
          var $this = $(this);
          var showError = !$this.val() && $this.is(':visible');
          var name = $this.attr('name');
          if ($this.attr('type') === 'radio' || $this.attr('type') === 'checkbox') {
            showError = ($this.closest('.col-field').find('input[name=' + name + ']:checked').length === 0);
          }
          if (showError) {
            mfind.errors.showAt(name, ['Pole jest wymagane']);
          }
        });
        form.find('[type="email"]').each(function () {
          var $this = $(this);
          var currentVal = $this.val();
          var name = $this.attr('name');
          var filter = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/;
          if (currentVal) {
            if (!filter.test(currentVal)) {
              mfind.errors.showAt(name, ['Pole ma nieprawidłowy format']);
            } else {
              window.dataLayer.push({'event': 'fieldFillSuccess', 'formId': 'email'});
            }
          }
        });
        form.find('[name="phone"]').each(function () {
          var filter = /^\d{9}$/;
          var currentVal = $(this).cleanVal();
          if (currentVal) {
            if (!filter.test(currentVal)) {
              mfind.errors.showAt('phone', ['Pole ma nieprawidłowy format']);
            } else {
              window.dataLayer.push({'event': 'fieldFillSuccess', 'formId': 'phone'});
            }
          }
        });
        form.find('input[data-mask]').each(function () {
          if ($(this).val() && $(this).val().length != $(this).data('mask').mask.length) {
            mfind.errors.showAt($(this).attr('name'), [$(this).data('errormask')]);
          }
        })
        mfind.errors.scrollTo('first');
        return $('.validation-error:visible').length === 0;
      },
      showIf: function (row, condition) {
        row.hide();
        var fieldToWatch = condition[condition.length - 2];
        var field = $('[name=' + fieldToWatch + ']');
        if (field.length) {
          if (field.length > 1) {
            field.each(function () {
              if ($(this).is(':checked') && $(this).val() == condition[condition.length - 1]) {
                row.show();
              }
            })
          } else if ($('[name=' + fieldToWatch + ']').val() == condition[condition.length - 1]) {
            row.show();
          }
        }
        field.on('change', function () {
          if ($(this).val() == condition[condition.length - 1]) {
            row.show();
          } else {
            row.hide();
          }
        });
      }
    },
    /**
     * Serv errors
     */
    errors: {
      serveAll: function (errors) {
        for (key in errors) {
          mfind.errors.showAt(key, errors[key]);
        }
        mfind.errors.scrollTo('first');
      },
      showAt: function (key, error) {
        var fieldContainer = $('.' + key + '-row');
        var colField = fieldContainer.find('.col-field');
        colField.addClass('validation-error');
        colField.find('.field-error').remove();
        colField.append('<div class="field-error">' + error.join(', ') + '</div>');
        colField.find('input, select').on('change', mfind.errors.removeFrom);
      },
      removeFrom: function (e) {
        var colField = $(e.target).closest('.col-field');
        colField.removeClass('validation-error');
        colField.find('.field-error').remove();
        colField.find('input, select').off('change', mfind.errors.removeFrom);
      },
      clearAll: function (e) {
        var colField = $(e.target).find('.col-field');
        colField.removeClass('validation-error');
        colField.find('.field-error').remove();
        colField.find('input, select').off('change', mfind.errors.removeFrom);
      },
      scrollTo: function (target) {
        if (target === 'first' || !target) {
          target = $('.validation-error:first');
        }
        if (target.length) {
          var targetTop = target.offset().top;
          if (!(window.pageYOffset < targetTop && window.outerHeight > targetTop)) {
            $('html, body').animate({ scrollTop: targetTop }, 500);
          }
        }
      }
    },
    /**
     * Results helper methods
     */
    results: {
      appearWithAnimation: function () {
        var cmpName = $('input[name=cmp_name]').val();
        var offers = $('.offers-list .offer-item');
        offers.hide();
        $('.active-insurer-preloader img').each(function () {
          var insurerIdentify = $(this).attr('class');
          var img = $(this).clone()
          offers.find('.' + insurerIdentify).replaceWith(img);
        })
        $('.offers-list').show();
        if (offers.length == 0) {
          $('#offers-data > p').remove();
          $('.offers-list').html('<p>Niestety nie udało nam się znaleźć ofert dla wprowadzonych danych.<p/> \
            <p><a class="order-call">Zamów rozmowę</a> z naszym doradcą, aby uzyskać wsparcie w znalezieniu pakietu \
            ubezpieczenia dopasowanego do Twoich potrzeb.</p>');
          window.dataLayer.push({'event': 'no_results'});
          return mfind.loader.hide('slow');
        }
        var min = 2000;
        var max = 7000;
        var impressionHashes = [];
        offers.each(function (index, item) {
          var rand = Math.floor(Math.random() * (max - min)) + min;
          setTimeout(function () {
            $(item).show();
            if ($('.offers-list .offer-item:not(:visible)').length <= 0) {
              mfind.loader.hide('slow');
              window.dataLayer.push({'event': 'closeLoaderModal'});
            }
          }, rand);
          var offer = $(item);
          impressionHashes.push({
            'id': offer.data('offerId'),
            'name': offer.find('.offer-number').text(),
            'price': offer.find('.offer-price-container .price').text().replace(/\D+/g, ''),
            'brand': offer.find('.offer-insurer-logo img').attr('alt'),
            'category': 'Insurance\/' + cmpName,
            'list': cmpName + ' Search Results',
            'position': index + 1
          });
        });
        window.dataLayer.push({
          'event': 'comparisons_displayed',
          'ecommerce': {
            'currencyCode': 'PLN',
            'impressions': impressionHashes
          }
        });
      }
    }
  }

  $(document).on('change', '[id*="phone"]', sendGTMPhoneNumberFillEvent);
  function sendGTMPhoneNumberFillEvent(e) {
    if (!/^\d{9}$/.test(e.target.value.replace(/\s/g,''))) return;
    window.dataLayer.push({
      event: 'phoneNumberFill',
      eventApp: 'household',
      eventContext: window.location.href.indexOf('wyniki') === -1 ? 'step_1' : 'step_2',
      eventSource: e.target.id
    });
  }
})(jQuery);
