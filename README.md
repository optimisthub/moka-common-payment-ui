# Moka United Checkout UI Redesign

**by Optimist Hub** · [Canlı Demo](https://optimisthub.github.io/moka-united-checkout-ui-redesign/) ·
[Karşılaştırma Galerisi](https://optimisthub.github.io/moka-united-checkout-ui-redesign/karsilastirma.html)

`https://clientwebpos.refmokaunited.com/commonpaymentpage/{requestId}` sayfasının görsel
katmanı için hazırlanan HTML + CSS çalışması.

**Yapı sözleşmesi birebir korundu:** hiçbir `id`, `class`, `name`, form alanı, gizli input,
`onclick`, `data-*` niteliği veya DOM sırası değiştirilmedi. Değişen tek şey görünüm.
Sayfadaki tüm JS (`/Scripts/commonpayment-new.js`) bu dosyalarla aynen çalışmaya devam eder.

| | |
|---|---|
| Canlı sayfa | 1440px'te iki kolon, kart paneli 646px, kart görseli 650×380 **sabit** (panelin dışına taşıyordu) |
| Yeni tasarım | Aynı iki kolon, kart paneli içerik kutusuna göre **ölçeklenen** kart (1440px'te 558×326), tüm ölçüler tek değişkenden türetilir |

| # | Değişiklik | Sonuç |
|---|---|---|
| 1 | **Kart Sahibi alanı gruptan kopuyordu düzeltildi** — `.mid-input` sınıfı hem kart numarası alanında hem de hata çipi satırında kullanılıyor; hata satırı için yazılan `margin-top: 12px` kart numarasına da uygulanıyordu. Seçici `#container-new-ui .card-info .row > .form-floating.mid-input` ile yalnızca `.row`'un doğrudan çocuğu olan hata satırına daraltıldı. | Dört alan artık tek parça: Kart Sahibi → Kart Numarası arası **0px**, Ay/Yıl ile arası **1px** (paylaşılan çizgi). Ölçümle doğrulandı. |
| 2 | **Mobilde marka bloğu tek satırlık ince şeride dönüştü** — logo ve kart artık alt alta değil **yan yana** (`flex-direction: row`). Kart genişliği `min(100cqw − logo − boşluk, 320px)` ile hesaplanır; logo 96–104px, iç boşluklar 12–14px. Küçük kartta iç tipografi oranları (numara/isim/ay-yıl) yükseltilir. Şerit ≤767px boyunca geçerli, 768px'te tablet düzeni (iki kolon) başlar. | 390px'te marka bloğu **343px → 157px (−%54)**, "Ödeme Onayı" **y=471 → y=272**. 360px'te 139px. İlk ekranda tutar + form görünür. |
| 3 | **SVG ölçekleme hatası düzeltildi** — çip ve temassız ikonun `height: auto`'su **sarmalayıcı div'e** yazılmıştı; içteki SVG kendi `height="53"` niteliğini koruduğu için kart küçülünce ikon 53px yüksekliğinde kalıp kart numarasının üzerine biniyordu. Masaüstünde orijinalin kendi ölçüsü (67×53) geçerli; telefonda sarmalayıcı `calc(var(--w) * …)` ile ölçeklenir ve içteki SVG `width/height: 100%` ile kutuyu doldurur. | Mobilde kart numarası artık tam görünüyor (**5528 7900 0000 0008**); çip telefonda 23×18'e iner. |
| 4 | **Geniş ekran taşması düzeltildi** — 1600px üstünde `.credit-card-area` `width: 100%` olduğu için kart panel kadar genişliyor, kartın -80px solundaki/sağındaki dekoratif halkalar iki yana 80'er px taşıyordu (1664px'te butonların ve KVKK linkinin üzerine biniyordu). Alan tüm genişliklerde **490px**'e sabitlendi, kart üst sınırı **590px**'e çekildi. | Halkaların panele göre konumu: 1366px **+33**, 1440/1664/1920px **−2**, 2560px **+118** px — hiçbir genişlikte taşma yok. |
| 5 | **Kart alanının zemini kaldırıldı** — gri panel yerine şeffaf zemin; logo, kart ve halkalar doğrudan sayfa yüzeyinde durur. Işık desenleri kartın dışına taşıyıp leke bıraktığı için kırpma eklendi; kırpma **kart yüzeyine değil**, desenleri saran `.credit-card-front__effects` katmanına (`overflow: hidden` + `border-radius: inherit`) verildi. | Zemin `rgba(0,0,0,0)`. Kart yüzeyindeki kırpma Chrome'un `backface-visibility` culling'ini bozuyor ve arka yüz zaman zaman ön yüzün üstüne biniyordu (canlı demoda 3 render'ın 2'sinde); katmana taşındıktan sonra 8/8 temiz. Ayrıca kırpma katmanı konumlandırılınca ikinci ışık SVG'sinin akıştan gelen yatay konumu kaybolduğu için `left: 50%` ile orijinal değerine sabitlendi (aksi hâlde desen sola kayıp kartın ortasında sert bir kenar oluşturuyordu). |

---

## 1. Dosya yapısı

```
moka-united-checkout-ui-redesign/
├── index.html                                  Statik önizleme (üretim markup'ının birebir kopyası)
├── karsilastirma.html                          Karşılaştırma Galerisi (önce/sonra + ölçümler + durumlar)
├── README.md                                   Bu dosya
├── .gitignore                                  İç notları ve çalışma dosyalarını dışarıda tutar
├── .nojekyll                                   GitHub Pages'in dosyaları olduğu gibi sunması için
├── preview/
│   ├── karsilastirma-masaustu.png              Önce / sonra — masaüstü (1440px)
│   ├── karsilastirma-mobil.png                 Önce / sonra — mobil (390px, yan yana)
│   ├── dolu-form.png                           Doldurulmuş formun yakın planı
│   ├── acik-tema-genis-ekran.png               1664px — geniş ekran (halkalar sınır içinde)
│   ├── acik-tema-havale-eft.png                Havale / EFT akışı
│   ├── acik-tema-modallar.png                  Şifre modalı
│   └── acik-tema-hata.png                      Hata ve doğrulama durumları
└── assets/
    ├── css/commonpayment-new.css         ★     TESLİM EDİLEN DOSYA (üretimdekinin yerine geçer)
    ├── js/preview-only.js                      Yalnızca önizleme; üretimde KULLANILMAZ
    ├── img/mokaunitedlogo.png                  Önizleme için kopyalandı
    ├── img/card_logos/*.png                    Kart tipi + alt şerit logoları
    ├── fonts/source-sans-pro/*.woff2           Gerçek 600/700 ağırlıkları (opsiyonel, bkz. §6)
    └── vendor/
        ├── bootstrap.min.css                   Bootstrap 5 (MIT)
        └── preview-fonts.css                   Yalnızca önizleme font tanımları
```

> Demo, Moka'nın `mokacustom.css` dosyasına ihtiyaç duymaz: görsel etkisi ölçülerek
> sıfır bulundu (onunla ve onsuz render arasında RMSE = 0), bu yüzden pakete dahil
> edilmedi. Üretimde sayfa bu dosyayı yükler.

---

## 2. Üretime entegrasyon

### Zorunlu tek adım

`/Content/Web/css/commonpayment-new.css` dosyasının **içeriğini**
`assets/css/commonpayment-new.css` ile değiştirin.

Başka hiçbir şey gerekmez. Dosya, üretimde zaten yüklü olan katmanların
(Bootstrap 5 → jquery-ui.css → mokacustom.css) **üzerine** yazılmak üzere tasarlandı ve
tüm sayfa kuralları `#container-new-ui` kapsamına alındı; bu yüzden aynı CSS'i kullanan
diğer Moka sayfaları (`.transfer-payment`, `.payment-tab`, `.installment-options`,
`.saveCardTable` …) etkilenmez — o sınıflar bilinçli olarak global bırakıldı.

> CSS'in `<link>` sırası değişmemeli: `commonpayment-new.css` en sonda kalmalı.

### Opsiyonel adımlar

**a) Gerçek 600/700 ağırlıkları** — bkz. §6.

**b) İki satır içi stilin kaldırılması** (CSS bunları `!important` ile nötrlüyor,
ama markup'tan silinirse daha temiz olur):

```diff
- <a class="… mokablue py-2 w-100" href="…" style="font-size: 18px;">Maksimum Mobile İle Öde</a>
+ <a class="… mokablue py-2 w-100" href="…">Maksimum Mobile İle Öde</a>

- <button class="… commonPaymentPageButton" style="font-size: 18px;" id="commonPaymentPageButton" …>
+ <button class="… commonPaymentPageButton" id="commonPaymentPageButton" …>

- <label for="CvcNumber" style="font-size: 15px;">Cvc Numarası*</label>
+ <label for="CvcNumber">Cvc Numarası*</label>
```

**c) `<html lang="tr">`** — bkz. §3 Tipografi.

---

## 3. Neler değişti

### Renk
- Tüm renkler tek bir token setine bağlandı (`:root` içinde `--m-*`): marka lacivert `#223886`,
  derin lacivert `#0D3C94`, logo minti `#00F77B`.
- Mint **yalnızca** odak halkası, bilgi noktası ve başarı durumunda kullanıldı; metin
  kontrastı için koyulaştırılmış `#00B45F` tercih edildi (mint beyaz üzerinde okunmaz).
- Kart panelinin zemini **orijinaldeki `#F2F2F1`** olarak bırakıldı (düz renk, gradyan yok).
- Metin hiyerarşisi: `--m-ink` #0E1B42 → `--m-ink-2` → `--m-muted` #5C6780
  (hepsi beyaz üzerinde ≥4.5:1).
- Durum renkleri (hata / başarı / uyarı) ve doğrulama mesajları token'landı.

### Yerleşim
- Sayfa içeriği 1360px'te ortalanır; iki kolon `flex: 1 1 420px` + 28px boşluk ile
  tarayıcı genişliğine göre kendiliğinden alt alta iner.
- **Kart alanının ölçüleri orijinalle birebir** (kart 650/590/550/490 px ve tüm iç
  yerleşimler — bkz. §3 "Orijinalden birebir korunan değerler"). Kart yalnızca panel
  genişliğinden darsa `min(…, 100cqw)` güvenlik sınırıyla kırpılır; 1920px'te bile
  panelden taşmaz (orijinalde 650px kart dar panelde taşabiliyordu).
- **Yalnızca telefonda (≤767px)** kart ölçeklenir: logo sola geçer, kart panel içerik
  genişliğinden türetilir ve tüm iç öğeler `--w` ile orantılı küçülür.
- **Bilgi kartı ile form artık aynı hizada:** ikisi de x=734, genişlik 646
  (eski tasarımda bilgi kartı 12px dışarı taşıyordu).
- **Kart paneli sağ kolonla üstten ve alttan tam hizalı:** iki kolon `align-items: stretch`
  ile aynı yüksekliğe yayılır, panel de kolonun tam yüksekliğini kaplar. 1440px'te panel
  y=80..743; "Ödeme Onayı" başlığının üstü y=80 (**0px fark**), kart logolarının altı
  y=743 (**0px fark**). Panel içeriği (logo + kart) dikeyde ortalanır.
- Butonlar eşit genişlikte (317px) ve eşit yükseklikte (54px).
- Bölüm başlıkları ("Ödeme Onayı", "Kart Bilgileri") ince bir ayırıcı çizgiyle
  aynı görsel dile bağlandı.
- **Telefonda marka bloğu tek satır:** logo solda, kart sağda; ikisi dikey alanı paylaşır.
  Kart genişliği panel içerik genişliğinden logo + boşluk düşülerek hesaplanır ve
  320px'te sınırlanır; logo 96–104px. 390px'te marka bloğu 343px → **157px**,
  "Ödeme Onayı" **227px yukarıda** (y=471 → y=272). 360px'te 139px.
  Marka bloğunu telefonda tamamen gizlemek isterseniz §9'daki tek satırlık kurala bakın.

### Tipografi
- Sayfa **gerçekten yüklenen** fontu kullanıyor: `Source Sans Pro`
  (`/Content/web/css/font-sans.css` → `/fonts/sans/*.woff2`).
  Eski CSS `'Source Sans Pro'` istiyordu ama `font.css` içindeki Lato dosyaları sunucuda
  **404** döndüğü için tarayıcı sistem fontuna düşüyordu.
- 17px/700 bölüm başlıkları, 15px gövde, 11.5px etiketler, 12.5–13px notlar.
- Tutar ve kart numarası `font-variant-numeric: tabular-nums` ile hizalanır.
- Uppercase dönüşümü **etiketlerde kullanılmadı** (Türkçe `i → İ` sorunu, bkz. §3 Tipografi).

### Bileşenler
- **Üst marka bandı:** orijinaldeki gibi **tek düz renk** `#223886` (gradyan, ışık veya
  çizgi yok — mokacustom `.blue` ile birebir).
- **Ölçek:** masaüstünde kart bloğu (kart + halkalar + desenler) `--m-card-scale: .9` ile %10 küçültülür; `transform` kullanıldığı için iç ölçüler ve logo değişmez. Telefonda ödeme düğmeleri %10 kısadır (54px → 49px).
- **Kart alanının zemini yok (şeffaf):** logo, kart ve halkalar doğrudan sayfa
  zemini üzerinde durur; alan sağ kolonla üstten/alttan hizalı kalmaya devam eder.
  Gri zemine dönmek için tek satır: `--m-panel-bg: #F3F4F6` (modernize gri) veya
  `#F2F2F1` (orijinal gri) — `:root` içindeki token değerini değiştirmek yeterli.
- **Kart görseli orijinalle birebir:** gradyan, kart ölçüsü (650/590/550/490 px),
  köşe yarıçapı (40/35/30 px), çip (top:100 left:64), temassız (top:30 right:44),
  numara (34px · bottom:120 left:72), isim (21px · bottom:8 left:72), ay-yıl
  (28px · bottom:68 right:180), kart tipi (70px), arka şerit (top:42 h:82 · `#010202`),
  CVC (335×60 · 26px), imza (122×78 · radius:38) ve halkalar (-80/-70) — hepsi eski
  CSS'teki değerlerin aynısı. Üzerine hiçbir katman (karartma, parlaklık, gölge,
  `text-shadow`, `perspective`) eklenmedi. Çevirme geçişi orijinaldeki `transform .6s`.
  Tek sapma: kart yüzeyine `overflow: hidden` eklendi. Orijinalde dekoratif ışık
  desenleri kartın dışına taşıyordu ve gri zemin bunu maskeliyordu; zemin şeffaf
  olunca koyu sayfada leke olarak görünüyordu. Kırpma yalnızca kart dışını temizler,
  kartın içindeki görünüm orijinalle aynıdır.
- **Ödeme Onayı:** beyaz kart yüzeyi, 2×2 ızgara, dikey+yatay ince ayırıcılar
  (mobilde yalnızca yatay), etiket/değer hiyerarşisi, tutar 23px lacivert,
  ödeme tipi küçük bir etiket.
- **Kart formu:** alan yüksekliği 37px → **54px**; etiketler gerçekten yüzüyor
  (Bootstrap'ın 2.3rem'lik sıkışıklığı giderildi), placeholder'ın etiketle çakışması
  `color: transparent` ile çözüldü, dört alan **tek parça** bir kontrol gibi birleşti
  (Kart Sahibi–Kart Numarası arası 0px, alt satırla 1px paylaşılan çizgi),
  odakta lacivert çerçeve + mint halka, kart numarasında harf aralığı ve tabular rakamlar.
- **Butonlar:** orijinaldeki gibi **ikisi de dolu `mokablue`**; hover/active davranışı
  mokacustom'daki `.btn-default` ile aynı (aynı zemin, `opacity: .9`). Köşe yarıçapı
  **6px** — Bootstrap `.btn` varsayılanı, orijinaldeki değer. Ölçüm: her iki düğme de
  `radius=6px`, `background=rgb(34,56,134)`, beyaz metin, eşit genişlik (317px) ve
  yükseklik (54px).
- **KVKK:** onay kutusu özel olarak çizildi; bağlantı metni orijinaldeki gibi
  **standart mavi link rengi** (`var(--bs-link-color)` = `#0d6efd`) ve altı çizili —
  link olduğu ilk bakışta anlaşılır. Gereksiz `<br>` satır kırıkları kaldırıldı,
  doğrulama mesajı kutuyla aynı satırda kalıyor.
- **Hata durumu:** "Yanlış Kart Numarası!" düz kırmızı yazı yerine hata çipi;
  banka adı (BIN sorgusundan) küçük lacivert etiket olarak görünür hale geldi.
- **Alt logo şeridi:** üstten ayırıcı, eşit yükseklik (26px / mobilde 20px), ortalama.
- **Havale / EFT akışı ve iki şifre modalı** aynı görsel dile getirildi.
  Bootstrap 5'te `.close` sınıfı olmadığı için stilsiz kalan kapatma (`&times;`)
  düğmesi yeniden çizildi.
- **Tarayıcı yüzeyleri:** seçim rengi (mint %32), `caret-color`, özel kaydırma çubuğu,
  `:focus-visible` halkaları.
- `prefers-reduced-motion: reduce` ve `@media print` desteği eklendi.

### Orijinalden birebir korunan değerler

| Öğe | Değer | Kaynak |
|---|---|---|
| Üst marka bandı | düz `#223886` | `mokacustom.css` `.blue` |
| Kart paneli zemini | düz `#F2F2F1` | eski `commonpayment-new.css` |
| Kart yüzeyi (ön/arka) | `radial-gradient(100.04% 183.04% at -0.04% 99.9%, #00F77B 0%, rgba(38,66,154,.89) 66.61%, #0D3C94 100%)` | eski CSS, birebir |
| Kart ölçüsü / yarıçapı | 650 → **590** → 550 (≤1366) → 490 (≤1280) px · 40 → **35** → 30 px | eski CSS; üst sınır 590px + masaüstünde **%90 ölçek** (`--m-card-scale`) |
| Kart içi yerleşim | çip 100/64 · temassız 30/44 · numara 34px 120/72 · isim 21px 8/72 · ay-yıl 28px 68/180 · tip 70px 68/46 · şerit 42/82 · CVC 335×60 150/22 26px · imza 122×78 38/44 | eski CSS, birebir |
| Arka şerit / CVC zemini | `#010202` / `#E2E2E0` | eski CSS, birebir |
| Kart halkaları konumu | `-80/-70` (≤1400: `-40/-70`) | eski CSS, birebir |
| Logo | 200px + `margin-bottom: 24px` | eski CSS, birebir |
| Panel yarıçapı | 36px | eski CSS, birebir |
| Panel zemini | **kaldırıldı — şeffaf** (orijinal `#F2F2F1`) | bilinçli değişiklik |
| Üst-sol halka / yıldız | `#00F77B` @ `fill-opacity="0.3"` + `#233981` | önizleme markup'ındaki SVG nitelikleri |
| Alt-sağ halka / yıldız | `#AEF8D3` + `#0D3C94` | aynı |
| Düğme zemini + köşe | `#223886` + `border-radius: 6px` | `.mokablue` + Bootstrap `.btn` |
| Düğme hover | aynı zemin, `opacity: .9` | `.btn-default:hover` |
| KVKK bağlantısı | `#0d6efd` + altı çizili | Bootstrap `--bs-link-color` |
| Butonların genişlik/yüksekliği | 317px / 54px (eşit) | ölçüm |


---

## 4. Önizleme ve inceleme kısayolları

`index.html`'i tarayıcıda açın. Adres sonuna `#` + anahtar kelime ekleyerek
tasarımın tüm durumlarını görebilirsiniz (virgülle birden fazla):

| Hash | Ne gösterir |
|---|---|
| *(boş)* | Boş form — üretimdeki varsayılan hâl |
| `#filled` | Dolu form: kart görseli, kart tipi logosu, işaretli KVKK, banka adı etiketi |
| `#error` | Hata çipi + KVKK doğrulama mesajı |
| `#flipped` | Kartın arka yüzü (CVC alanı) |
| `#eft` | Havale / EFT akışı |
| `#tabs` | Kayıtlı kart varsa görünen sekme çubuğu |
| `#modal-save` / `#modal-enter` | Şifre belirleme / şifre girme modalları |
| `#measure` | Sayfa sonuna tüm kritik ölçüleri JSON olarak basar (tasarım denetimi) |
| `#mobile` | Masaüstünde mobil genişliği taklit eder |

Önce/sonra ve tüm durum görüntüleri `preview/` klasöründedir (masaüstü, mobil,
dolu form, havale/EFT, şifre modalı, hata durumu).

### Karşılaştırma Galerisi

`karsilastirma.html` bu görselleri **açıklamalarıyla** sunan bağımsız bir sayfadır:
önce/sonra farkları (neler değişti / neler değişmedi), ölçüm tablosu, durum ekranları
ve yapı sözleşmesi. Ödeme sayfasının CSS'inden etkilenmez, kendi token'larını taşır.

- Yayında: <https://optimisthub.github.io/moka-united-checkout-ui-redesign/karsilastirma.html>
- Yerelde: `moka-united-checkout-ui-redesign/karsilastirma.html`

`assets/js/preview-only.js` yalnızca bu önizleme içindir; kart numarasının görsel karta
yansıması, kart çevirme, kart tipi logosu ve sekme gizleme davranışlarını üretimdeki
`commonpayment-new.js` ile aynı kurallarla taklit eder.

---

## 5. Doğrulama

- **Genişlikler:** 1440 / 1280 / 1100 / 1024 / 820 / 620 / 390 px — kart her genişlikte
  panelin içinde ve ortada, hiçbir yatay taşma (overflow) yok.
- **Alan grubu bitişikliği (1440px):** Kart Sahibi y=347–401, Kart Numarası y=401–455
  (0px), Ay/Yıl y=456 (1px = paylaşılan çizgi).
- **Mobil marka şeridi (ölçüldü):**

  | Genişlik | Panel | Kart | Logo | "Ödeme Onayı" |
  |---|---|---|---|---|
  | 360px | 328×139 | 190×111 | 96px | y=255 |
  | 390px | 358×157 | 220×129 | 96px | y=272 |
  | 480px | 448×201 | 300×175 | 104px | y=317 |
  | 600–767px | 568–735×213 | 320×187 (üst sınır) | 104px | y=329 |
  | 768px+ | tablet düzeni — iki kolon | 650×380 | 200px | sütun başında |

  Kart numarası her genişlikte kutuya sığıyor (390px'te 129px kullanılıyor / 171px izin).
- **Kart alanı ölçümü (1440px):** panel 646×663, zemini `rgba(0,0,0,0)` (şeffaf) ·
  alan 490×380 @(138,241) ·
  kart 590×380 @(88,241) radius 35px · çip 67×53 (karta göre 64/100 — orijinalin aynısı) ·
  numara 34px (bottom 120, left 72) · isim 21px (bottom 8, left 72) · logo 200×100.
- **Panel hizalaması (1440px):** panel y=80..743 · "Ödeme Onayı" başlığı üstü y=80
  (**0px**) · kart logoları altı y=743 (**0px**) · panel 646×663.
- **Düğmeler:** her ikisi de `border-radius: 6px`, `background: rgb(34,56,134)`,
  beyaz metin, 317×54px.
- **Bilinen durum (bilinçli):**
  1. Denetleyici kart görselinde 4 adet düşük kontrast uyarısı veriyor (beyaz metin /
     `#00F77B` mint gradyan durağı — 1.4:1). Bu **orijinalin kendi** durumudur; kartın
     birebir korunması istendiği için üzerine karartma katmanı eklenmedi. İstenirse
     `linear-gradient(to top, rgba(8,18,48,.62), transparent 46%)` katmanıyla ~5:1'e çıkar.
  2. KVKK bağlantısı istenen standart mavi (`#0d6efd`) ile sayfa zemininde **4.2:1**
     (AA eşiği 4.5:1). Link ayrıca altı çizili olduğu için link olduğu anlaşılır.
     WCAG AA istenirse `--bs-link-color` yerine Bootstrap'ın `#0b5ed7` değeri kullanılabilir
     (aynı görünüm, **5.4:1**).
  3. Kartın arka yüzü **3B culling'e bırakılmaz**: `backface-visibility` tek başına
     yeterli olmadığı için arka yüz `visibility: hidden` ile gizlenir ve çevirme
     animasyonunun ortasında (300ms) anahtarlanır. Böylece CSS gecikmeli yüklense bile
     arka yüz ön yüzün üstüne binemez.
- **Geniş ekran taşması:** 1366 / 1440 / 1664 / 1920 / 2560 px'te halkaların panel
  sınırına göre konumu ölçüldü (+33 / -2 / -2 / -2 / +118 px). 1664px'te eskiden
  80px taşıyorlardı; alan genişliği tüm genişliklerde 490px'e sabitlenerek düzeltildi.
- **Hizalama (1440px):** `.user-info-container`, `.card-info-title`, `#CardNumber`,
  `#commonPaymentPageButton`, `.footer-container-logos` → hepsi `x=734, w=646`.
  Kart paneli `x=60, w=646`; kolonlar arası boşluk 28px.
- **Kontrast:** gövde/metin ≥4.5:1, beyaz üzerindeki ikincil metin `#5C6780` ≈5.9:1.
  Kart görselindeki beyaz yazılar alt karartma ile ~2:1 → ~5:1 seviyesine çıkarıldı
  (isim 18.7px/600, numara 30px — WCAG "büyük metin" eşiğinin üzerinde).
- **Mekanik denetleyici** (Impeccable `detect`): 6 bulgudan düzeltilebilir olanların
  tamamı giderildi (koyu yüzeyde renkli gölge, geniş dağılımlı gölge + hairline kenar,
  0 offset'li renkli hale). Kalan 3 bulgu:
  - 2 × *cramped-padding* — yanlış pozitif: denetleyici iç boşluğu `#container-new-ui
    .user-info-container` üzerinde arıyor, oysa gerçek iç boşluk (16–22px) bir seviye
    içerideki `.container` üzerinde ve `.user-info-row` kendi `padding-top: 15px`'ini
    taşıyor. Ekran görüntüsünde içerik kenara yapışmıyor.
- **Odak durumları:** tüm etkileşimli öğelerde `:focus-visible` halkası var.

---

## 6. Opsiyonel: gerçek 600/700 ağırlıkları

Şu anda `font-sans.css` yalnızca **400** ağırlığını tanımlıyor; 600/700 tarayıcı
tarafından sentezleniyor (üretimde bugün de böyle). Gerçek ağırlıkları açmak için:

1. `assets/fonts/source-sans-pro/` içindeki 6 dosyayı `/fonts/sans/` altına kopyalayın.
2. `font-sans.css` sonuna ekleyin:

```css
@font-face{font-family:'Source Sans Pro';font-style:normal;font-weight:600;font-display:swap;
  src:url('/fonts/sans/SourceSansPro-600-latin.woff2') format('woff2');
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:'Source Sans Pro';font-style:normal;font-weight:600;font-display:swap;
  src:url('/fonts/sans/SourceSansPro-600-latin-ext.woff2') format('woff2');
  unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF;}
@font-face{font-family:'Source Sans Pro';font-style:normal;font-weight:700;font-display:swap;
  src:url('/fonts/sans/SourceSansPro-700-latin.woff2') format('woff2');
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:'Source Sans Pro';font-style:normal;font-weight:700;font-display:swap;
  src:url('/fonts/sans/SourceSansPro-700-latin-ext.woff2') format('woff2');
  unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF;}
```

> `latin-ext` şart: `ğ ş Ğ Ş` (U+011E/U+011F/U+015E/U+015F) bu aralıkta.
> Dosyalar eksik kalırsa `@font-face` sessizce devre dışı kalır ve tarayıcı sentetik
> kalın kullanır — yani hiçbir şey bozulmaz.

---

## 7. `!important` kullanılan yerler

Dosyada toplam 18 `!important` var; 8'i bu sayfanın markup'ındaki satır içi stilleri ve
yardımcı sınıfları nötrlemek için, geri kalanı ise üretimdeki eski davranışı korumak için.

### Markup kaynaklı olanlar (markup düzeltilirse kaldırılabilir — §2b)

| Kural | Neyi nötrlüyor |
|---|---|
| `.bottom-right-input > label` (hem duran hem yüzen hâli) | `<label style="font-size:15px">` |
| `.bottom-buttons .btn { font-size:16px }` | `<a … style="font-size:18px">` ve `<button … style="font-size:18px">` |
| `#cardBankNameDivId:not(:empty) { display:inline-flex }` | `<div id="cardBankNameDivId" style="display:none">` — BIN sorgusundan gelen banka adını görünür yapar. İstemezseniz bu bloğu silin. |
| `#wrongCard { color: var(--m-danger) }` | `<span id="wrongCard" style="color: red">` |
| `.c-page-new svg`, `#commonPaymentPageButton svg { margin:0 }` | Bootstrap `.mb-1` yardımcı sınıfı (ikonu dikey ortadan kaydırıyordu) |

### Eski davranışı koruyanlar

| Kural | Neden |
|---|---|
| `.table { --bs-table-color/bg/striped-color: revert }` | Bootstrap 5 tablo değişkenlerini sıfırlar (kayıtlı kart tablosu) |
| `.msg-label`, `.custom-card-label`, `.transfer-payment__copy-btn` font-size | Eski CSS'te de `!important` ile yazılmıştı; davranış değişmesin diye korundu |
| `@media (prefers-reduced-motion: reduce)` ve `@media print` blokları | Hareketi ve çıktıyı zorunlu olarak kapatır (kart görseli, butonlar ve logolar yazdırmada gizlenir) |

---

## 8. Tarayıcı desteği

- **Kart ölçeklemesi:** `container-type: inline-size` + `cqw` (Chrome/Edge 105+,
  Safari 16+, Firefox 110+). Desteklemeyen tarayıcılar için `@supports not (width: 1cqw)`
  bloğunda bilerek dar seçilmiş yedek değerler var — kart biraz küçük kalır, ama asla taşmaz.
- Kullanılan diğer özellikler: `clamp()`, `gap`, `:focus-visible`, `appearance: none`,
  `font-variant-numeric`, `object-fit` — hepsi eşdeğer şekilde geriye dönük uyumlu.
- Renkler 6 haneli hex ve `rgba()` ile yazıldı (8 haneli hex yok); `color-mix()`,
  `oklch()`, `:has()` veya `subgrid` kullanılmadı.
- `color-scheme: light` ile bildirilir; tarayıcının otomatik koyulaştırması devre dışı kalır.
- **Mobil zoom kilidi:** `html, body { touch-action: pan-x pan-y }` pinch-zoom'u ve çift
  dokunma zoom'unu kapatır, kaydırmayı etkilemez (iOS Safari 13+, Android Chrome).
  iOS'un eski sürümleri bu kuralı yok saydığı için layout'taki viewport meta'sına
  `maximum-scale=1.0, user-scalable=no` eklenmelidir; demoda (`index.html`) bu şekildedir.
  İstemezseniz CSS'teki iki satırı ve meta'daki iki anahtarı silmek yeterli.
  Not: WCAG 1.4.4 metin büyütmeyi gerektirir; bu kilit bilinçli bir tercihtir.

**İsteğe bağlı — telefonda kart görselini tamamen gizlemek:**

```css
@media (max-width: 600px) {
    #container-new-ui .credit-card-area { display: none; }
}
```

Bu durumda panel yalnızca logoyu gösterir (~90px yükseklik). Form akışı etkilenmez.

---

## 9. Üçüncü taraf varlıklar ve lisans

| Varlık | Sahibi / lisans |
|---|---|
| `assets/vendor/bootstrap.min.css` | Bootstrap 5 — MIT |
| `assets/fonts/source-sans-pro/*.woff2` | Source Sans Pro — SIL Open Font License 1.1 (Google Fonts) |
| `assets/img/mokaunitedlogo.png` | Moka United logosu — ilgili sahibinin markası; sayfa tasarımını birebir yansıtmak için kullanıldı |
| `assets/img/card_logos/*.png` | Visa, Mastercard, Maestro, American Express, Troy marka logoları — ilgili sahiplerinin markaları |

Bu depo, Moka United ortak ödeme sayfasının görsel katmanını yeniden üreten bir
**tasarım çalışmasıdır**; Moka United ile bir bağlantıyı veya onayı ima etmez.
Depo için ayrıca bir açık kaynak lisansı tanımlanmamıştır (varsayılan: tüm hakları saklıdır).
