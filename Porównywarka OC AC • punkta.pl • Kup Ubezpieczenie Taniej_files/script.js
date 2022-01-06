(function ($) {
  $(document).ready(function () {
    var form = $('form.mfind-comparer');
    var cmpName = $('input[name=cmp_name]').val();
    var comparerId = $('input[name=comparerId]').val();
    var token = $('input[name=token]').val();
    var data = {};

    $('input[data-mask]').each(function () {
      if (typeof $(this).data('mask') === 'string') {
        $(this).mask($(this).data('mask'));
      }
    });

    $('.show-if').each(function () {
      var row = $(this).closest('.row')
      row.hide();
      var classes = $(this).attr('class').split(" ")
      for (var key in classes) {
        if (classes[key].indexOf('show-if-') >= 0) {
          var condition = classes[key].split("-");
          mfind.form.showIf(row, condition);
        }
      }
    });

    $('.checkbox a.more-btn').on('click', function(e) {
      e.preventDefault();
      var open = ($(this).text().indexOf('więcej') !== -1);
      $(this).find('b').text(open ? 'ukryj' : 'więcej');
      $(this).next('div').toggle(open);
      return false;
    });

    // $('input[type="email"], input[name="phone"]').on('blur', function() {
    //   $('.rule-marketing-row').toggle( !!$(this).val() );
    //   if (!!$(this).val() && !$('.rule-marketing-row input').is(':checked')) {
    //     $('input[name="select_all_agreements"]').prop('checked', false);
    //   }
    // });

    $('input[type="email"]').on('blur', function() {
      $('.rule_email_agreement-row').toggle( !!$(this).val() );
      if($(this).val().length > 0){
        $('input[name="rule_email_agreement"]').prop('required', true)
      }
      else{
        $('input[name="rule_email_agreement"]').prop({ required: false, checked: false })
      }
    });

    $('input[name="phone"]').on('blur', function() {
      $('.rule_phone_agreement-row').toggle( !!$(this).val() );
      $('.rule_sms_agreement-row').toggle( !!$(this).val() );
      if($(this).val().length > 0){
        $('input[name="rule_phone_agreement"]').prop('required', true)
        $('input[name="rule_sms_agreement"]').prop('required', true)
      }else{
        $('input[name="rule_phone_agreement"]').prop({ required: false, checked: false })
        $('input[name="rule_sms_agreement"]').prop({ required: false, checked: false })
      }
    });

    $('input[name="select_all_agreements"]').on('change', function(){
      var agree = $(this).is(':checked');
      $('.checkbox-group-container:visible input[name^="rule"]').prop('checked', agree).trigger('change');
    });

    function allVisibleRulesChecked() {
      var allChecked = true;
      $('.checkbox-group-container:visible input[name^="rule"]').each(function(){
        if (!$(this).is(':checked')) {
          allChecked = false;
        }
      });
      return allChecked;
    }

    $('.checkbox-group-container input[name^="rule"]').on('change', function() {
      if (!$(this).is(':checked')) {
        $('input[name="select_all_agreements"]').prop('checked', false);
        if ($(this).attr('required'))
          mfind.errors.showAt($(this).attr('name'), ['Pole jest wymagane']);
      } else if (allVisibleRulesChecked()) {
        $('input[name="select_all_agreements"]').prop('checked', true);
      }
    });

    if (form.length) {
      form.find('[type=submit]').attr('formnovalidate', '')
      form.on('submit', function (e) {
        e.preventDefault();
        if (!mfind.form.validate(form)) return false;

        $('input.field_phone').unmask();
        mfind.loader.show('fast');
        data = {
          'action': 'mc_save_calculation',
          'form': form.serialize(),
          'comparer_id': comparerId,
          'token': token
        };
        $.ajax({
          url: form[0].action,
          type: 'POST',
          data: data,
          success: function (response) {
            if (response['errors']) {
              mfind.errors.serveAll(response['errors']);
              mfind.loader.hide('slow');
            } else {
              if (response.calculation && response.calculation.token && window.history) {
                window.history.replaceState({}, '', '?token=' + response.calculation.token);
              }
              if (response['redirect']) {
                window.location.href = response['redirect'];
              } else {
                window.location.reload();
              }
            }
          }
        });
      });
    }

    if (token) {
      mfind.loader.show(10);
      if (form.length) {
        $.ajax({
          url: adminAjax,
          type: 'POST',
          data: {
            'action': 'mc_get_calculation',
            'token': token
          },
          success: function (response) {
            var calculation = response['calculation'];
            for (field in calculation) {
              var input = $("[name='" + field + "']");
              var type = input.attr("type");

              if (input.prop("tagName") == "INPUT" && (type == "checkbox" || type == "radio")) {
                input.each(function () {
                  if ($(this).val() == calculation[field]) {
                    this.checked = true;
                    $(this).trigger('change');
                  }
                });
              } else if (calculation[field]) {
                input.val(calculation[field]).trigger('change').trigger('blur');
              }
            }
            if (response['errors']) {
              mfind.errors.serveAll(response['errors']);
            }
            $('input[data-mask]').each(function () {
              $(this).unmask()
              $(this).mask($(this).data('mask'));
            });
            mfind.loader.hide('slow');
          }
        });
      } else if ($('body').hasClass('page-comparer-results')) {
        $.ajax({
          url: adminAjax,
          type: 'POST',
          data: {
            'action': 'mc_get_offers',
            'token': token
          },
          success: function (response, textStatus, jqXHR) {
            $('.offers-list').html(response);
            mfind.results.appearWithAnimation();

            $('.btn.cta.buy_button').on('click', function (e) {
              var offer = $(e.target).closest('.offer-item');
              window.dataLayer.push({
                'event': 'btnClick',
                'btnId': 'btn_kup_online',
                'ecommerce': {
                  'click': {
                    'actionField': { 'list': cmpName + ' Search Results' },
                    'products': [{
                      'id': offer.data('offerId'),
                      'name': offer.find('.offer-number').text(),
                      'price': offer.find('.offer-price-container .price').text().replace(/\D+/g, ''),
                      'brand': offer.find('.offer-insurer-logo img').attr('alt'),
                      'category': 'Insurance\/' + cmpName,
                      'position': offer.index() + 1
                    }]
                  }
                }
              });
            })
          }
        })
      }
    }

    // ORDER CALL MODAL SERVE
    var orderCall = function () {
      window.dataLayer.push({'event': 'btnClick', 'btnId': 'btn_call_me_back'});
      try {
        var offerId = $(this).closest('.offer-item').data('offerId');
        $('.offer-call-modal input[name=offer_id]').val(offerId);
      } catch (e) { }
      $('.offer-call-modal').show().parent().show();
      $('.offer-call-modal input[name=phone]').focus();
    }

    $('.order-call-adbanner .order-call').on('click', orderCall);
    $('.offers-list').on('click', '.order-call', orderCall);

    document.addEventListener('keydown', (e) => {
      if ($('.order-call-container:visible').length && e.keyCode === 27) {
        $('.order-call-container').hide()
        mfind.errors.clearAll({ target: '.offer-call-modal' })
      }
    })

    $('.offer-call-modal .close').on('click', function (e) {
      e.preventDefault();
      $('.order-call-container').hide()
      mfind.errors.clearAll({ target: '.offer-call-modal' })
    })

    $('.order-call-container').on('click', function (e) {
      if (e.target.className.split('order-call-container').length > 1) {
        $(this).hide();
        mfind.errors.clearAll({ target: '.offer-call-modal' })
      }
    })

    $('.offer-call-modal').on('submit', function (e) {
      e.preventDefault();
      if (!mfind.form.validate($('.offer-call-modal'))) return false;

      $('.offer-call-modal .loader-container').fadeIn(10);
      var marketingRule = false;
      var marketingInputEl = $('.offer-call-modal input[name="rule-marketing"]');
      if (marketingInputEl.length && marketingInputEl.is(':checked')) {
        marketingRule = marketingInputEl.val();
      }
      $.ajax({
        url: adminAjax,
        type: 'POST',
        data: {
          'action': 'mc_order_call',
          'form': {
            token: $('.offer-call-modal input[name="token"]').val(),
            comparer_id: $('.offer-call-modal input[name="comparer_id"]').val(),
            phone: $('.offer-call-modal input[name="phone"]').cleanVal(),
            'rule-marketing': marketingRule
          }
        },
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
          $('.offer-call-modal .loader-container').fadeOut('slow');
          if (response['error'] || response['success'] == false) {
            window.dataLayer.push({'event': 'formSubmissionErrors', formId: 'form_call_me_back'});
            alert('Wystąpił nieoczekiwany błąd, spróbuj ponownie później');
          } else {
            window.dataLayer.push({'event': 'formSubmissionSuccess', formId: 'form_call_me_back'});
          }
          $('.order-call-container').hide();
        }
      })
    });
  });
})(jQuery);
