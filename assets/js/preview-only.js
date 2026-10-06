/* ==========================================================================
   ÖNİZLEMEYE ÖZEL davranış katmanı — ÜRETİMDE BU DOSYA KULLANILMAZ.

   Üretimde bu sayfa /Scripts/commonpayment-new.js dosyasını yükler.
   Buradaki kod yalnızca statik önizlemenin, o dosyanın görsel olarak
   önemli davranışlarını taklit etmesini sağlar:

     · kart numarası / ad soyad / ay-yıl / CVC'nin görsel karta yansıması
     · CVC alanına odaklanınca kartın arka yüzünün dönmesi
     · kart tipi logosunun (Visa / Mastercard / Maestro / Troy) gösterilmesi
     · kayıtlı kart yoksa sekme çubuğunun gizlenmesi

   Ayrıca tasarım incelemesini kolaylaştıran demo kısayolları ekler.
   Adres sonuna ekleyin (virgülle birden fazla):
     index.html#filled      dolu form + doğrulanmış kart (banka adı dahil)
     index.html#error       hata ve doğrulama durumları
     index.html#flipped     kartın arka yüzü
     index.html#eft         Havale / EFT akışı
     index.html#tabs        sekme çubuğu görünür
     index.html#modal-save  "şifre belirle" modalı
     index.html#modal-enter "şifre gir" modalı
     index.html#mobile      mobil genişlikte inceleme için daraltılmış sayfa
   ========================================================================== */
(function () {
    'use strict';

    var q = function (sel, root) { return (root || document).querySelector(sel); };
    var qa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
    var setText = function (sel, value) { var el = q(sel); if (el) { el.innerHTML = value; } };

    /* ---------------------------------------------------------------------
       1. Üretimdeki davranışların görsel taklidi
       --------------------------------------------------------------------- */

    // Kayıtlı kart yoksa sekme çubuğu gizlenir (commonpayment-new.js ile aynı koşul)
    var hiddenCardCount = q('#cardOfHiddenCount');
    if (hiddenCardCount && (hiddenCardCount.value === '' || hiddenCardCount.value === '0')) {
        var tabUL = q('#tabUL');
        if (tabUL) { tabUL.style.display = 'none'; }
    }

    // Hata çipi başlangıçta gizli ($("#wrongCard").hide() karşılığı)
    var wrongCard = q('#wrongCard');
    if (wrongCard) { wrongCard.style.display = 'none'; }

    var CARD_LOGOS = ['visa', 'mastercard', 'maestro', 'troy', 'american_express'];

    function detectCardType(number) {
        var n = (number || '').split(' ').join('');
        if (/^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/.test(n)) { return 'maestro'; }
        if (/^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/.test(n)) { return 'visa'; }
        if (/^(5[1-5][0-9]{14}|2[2-7][0-9]{14})$/.test(n)) { return 'mastercard'; }
        if (/^9792\d+$/.test(n)) { return 'troy'; }
        return null;
    }

    function setCardTypeLogo(type) {
        var host = q('#cardType');
        if (!host) { return; }
        host.innerHTML = type && CARD_LOGOS.indexOf(type) > -1
            ? '<img src="assets/img/card_logos/' + type + '.png" class="img-responsive center-block" alt="' + type + '" />'
            : '';
    }

    function formatCardNumber(value) {
        var digits = (value || '').replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(.{4})/g, '$1 ').trim();
    }

    function formatExpiry(value) {
        var digits = (value || '').replace(/\D/g, '').slice(0, 4);
        if (digits.length <= 2) { return digits; }
        return digits.slice(0, 2) + '/' + digits.slice(2);
    }

    var cardNumberInput = q('#CardNumber');
    var cardHolderInput = q('#CardHolderFullName');
    var expiryInput = q('#MonthYearNumber');
    var cvcInput = q('#CvcNumber');
    var cardArea = q('.credit-card-area');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function (e) {
            var formatted = formatCardNumber(e.target.value);
            e.target.value = formatted;
            setCardTypeLogo(detectCardType(formatted));
            setText('.credit-card-front__card-number p', formatted || '**** **** **** ****');
        });
    }

    if (cardHolderInput) {
        cardHolderInput.addEventListener('input', function (e) {
            setText('.credit-card-front__name p', (e.target.value || '**** ****').toUpperCase());
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', function (e) {
            var formatted = formatExpiry(e.target.value);
            e.target.value = formatted;
            setText('.credit-card-front__expiration-date', formatted
                ? '<div class="credit-card-front__expiration-date__description">VALID THRU</div><p>' + formatted + '</p>'
                : '');
        });
    }

    if (cvcInput) {
        cvcInput.addEventListener('input', function (e) {
            setText('.credit-card-back__cvv p', e.target.value || '***');
        });
        cvcInput.addEventListener('focus', function () {
            if (cardArea) { cardArea.classList.add('is-flipped'); }
        });
        cvcInput.addEventListener('blur', function () {
            if (cardArea) { cardArea.classList.remove('is-flipped'); }
        });
    }

    // Demo amaçlı hafif doğrulama: düğmeye basınca hata durumları görünür olur
    function showFieldError(anchor, message) {
        if (!anchor) { return; }
        var existing = q('.field-validation-error', anchor.parentNode);
        if (existing) { existing.parentNode.removeChild(existing); }
        var span = document.createElement('span');
        span.className = 'field-validation-error';
        span.textContent = message;
        anchor.parentNode.appendChild(span);
    }

    function clearFieldError(anchor) {
        if (!anchor) { return; }
        var existing = q('.field-validation-error', anchor.parentNode);
        if (existing) { existing.parentNode.removeChild(existing); }
    }

    var payButton = q('#commonPaymentPageButton');
    if (payButton) {
        payButton.addEventListener('click', function () {
            var number = cardNumberInput ? cardNumberInput.value.replace(/\s/g, '') : '';
            if (number.length < 16) {
                if (wrongCard) { wrongCard.style.display = ''; }
                if (cardNumberInput) { cardNumberInput.focus(); }
                return;
            }
            if (wrongCard) { wrongCard.style.display = 'none'; }

            var kvkk = q('#IsReadKvkkTab1');
            if (kvkk && !kvkk.checked) {
                showFieldError(kvkk, 'Lütfen Kvkk bilgilendirme metnini okuyup, onay veriniz');
                kvkk.focus();
                return;
            }
            clearFieldError(kvkk);
        });
    }

    /* ---------------------------------------------------------------------
       2. İnceleme kısayolları (#filled, #error, #flipped, #eft, ...)
       --------------------------------------------------------------------- */
    var flags = (location.hash || '').replace(/^#/, '').split(',').map(function (f) { return f.trim(); });
    var has = function (flag) { return flags.indexOf(flag) > -1; };

    if (has('filled') && cardNumberInput) {
        cardHolderInput.value = 'AHMET YILMAZ';
        cardHolderInput.dispatchEvent(new Event('input'));
        cardNumberInput.value = '5528 7900 0000 0008';
        cardNumberInput.dispatchEvent(new Event('input'));
        expiryInput.value = '12/30';
        expiryInput.dispatchEvent(new Event('input'));
        cvcInput.value = '123';
        cvcInput.dispatchEvent(new Event('input'));
        cardHolderInput.blur();
        var kvkkBox = q('#IsReadKvkkTab1');
        if (kvkkBox) { kvkkBox.checked = true; }
        // Üretimde BIN sorgusu banka adını buraya yazar
        var bank = q('#cardBankNameDivId');
        if (bank) { bank.textContent = 'İŞ BANKASI'; }
    }

    if (has('error')) {
        if (wrongCard) { wrongCard.style.display = ''; }
        var kvkkError = q('#IsReadKvkkTab1');
        if (kvkkError) { showFieldError(kvkkError, 'Lütfen Kvkk bilgilendirme metnini okuyup, onay veriniz'); }
    }

    if (has('flipped') && cardArea) {
        cardArea.classList.add('is-flipped');
    }

    if (has('tabs')) {
        var tabList = q('#tabUL');
        if (tabList) { tabList.style.display = ''; }
        var firstTab = q('#tabUL li');
        if (firstTab) { firstTab.classList.add('ui-tabs-active'); }
    }

    if (has('eft')) {
        var eft = q('#eftContainer');
        if (eft) { eft.style.display = 'block'; }
        var card1 = q('#cardContainer');
        if (card1) { card1.style.display = 'none'; }
        qa('.transfer-payment, .loading-spinner', eft).forEach(function (el) { el.classList.remove('d-none'); });
        qa('.loading-spinner', eft).forEach(function (el) { el.style.display = 'none'; });
        var refValue = q('.transfer-payment__reference-value');
        if (refValue) { refValue.textContent = 'MK-9F4A-2C71-88B0'; }
        var ibanList = q('#iban-list-container');
        if (ibanList) {
            ibanList.innerHTML =
                '<div class="transfer-payment__block transfer-payment__iban-box">' +
                '  <div class="transfer-payment__iban-inline">' +
                '    <div>' +
                '      <p class="transfer-payment__iban-label">TR12 0006 4000 0011 2345 6789 01</p>' +
                '      <p class="transfer-payment__iban-value">TEST BANKASI A.Ş.</p>' +
                '      <p class="transfer-payment__iban-sub">Alıcı: Moka United Ödeme Hizmetleri A.Ş.</p>' +
                '    </div>' +
                '    <button class="transfer-payment__copy-btn" type="button">Kopyala</button>' +
                '  </div>' +
                '</div>';
        }
    }

    // Modal önizlemesi: üretimde Bootstrap modal JS'i kullanılır
    function openModal(hash, id) {
        if (!has(hash)) { return; }
        var modal = q(id);
        if (!modal) { return; }
        if (!q('#moka-preview-modal-style')) {
            var style = document.createElement('style');
            style.id = 'moka-preview-modal-style';
            style.textContent =
                '.modal.moka-preview-open{display:block!important;opacity:1!important;position:fixed;inset:0;z-index:2000;overflow:auto;padding:40px 16px;background:rgba(14,27,66,.5)}' +
                '.modal.moka-preview-open .modal-dialog{max-width:460px;margin:0 auto;transform:none!important;pointer-events:auto}';
            document.head.appendChild(style);
        }
        modal.classList.add('moka-preview-open');
    }

    openModal('modal-save', '#modalSavePassword');
    openModal('modal-enter', '#modalEnterPassword');

    if (has('mobile')) {
        document.documentElement.style.maxWidth = '420px';
        document.documentElement.style.margin = '0 auto';
        document.documentElement.style.borderInline = '1px dashed #c9d2e6';
    }

    /* Tasarım kontrolü için ölçüm dökümü (#measure → sayfa sonunda JSON) */
    if (has('measure')) {
        var out = {};
        ['.credit-card-container', '.credit-card-area', '.credit-card-front', '.credit-card-container__logo img',
         '.user-info-container', '.card-info-title', '#CardHolderFullName', '#CardNumber',
         '#MonthYearNumber', '#CvcNumber', '#commonPaymentPageButton', '#payWithMaximumMobile a',
         '.credit-card-front__chip', '.credit-card-front__chip svg',
         '.credit-card-front__contactless', '.credit-card-front__card-number',
         '.credit-card-front__card-number p', '.credit-card-front__name',
         '.credit-card-front__name p', '.credit-card-front__expiration-date',
         '.footer-container-logos', '.credit-card-upper-left-layer svg',
         '.credit-card-bottom-right-layer svg'].forEach(function (sel) {
            var el = q(sel);
            if (!el) { return; }
            var r = el.getBoundingClientRect();
            var cs = window.getComputedStyle(el);
            out[sel] = {
                x: Math.round(r.x), y: Math.round(r.y),
                w: Math.round(r.width), h: Math.round(r.height),
                fontSize: cs.fontSize, color: cs.color,
                radius: cs.borderRadius, bg: cs.backgroundColor
            };
        });
        var pre = document.createElement('pre');
        pre.id = 'moka-measure';
        pre.textContent = JSON.stringify(out, null, 2);
        document.body.appendChild(pre);
    }
})();
