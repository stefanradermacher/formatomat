export default {
    code: "tr",
    name: "Türkçe",
    htmlLang: "tr-TR",

    ui: {
        tagline:           "Tüm formatlar için otomat.",
        inputLabel:        "Girdi",
        outputLabel:       "Çıktı",
        inputFormatLabel:  "Girdi",
        outputFormatLabel: "Çıktı",
        actionLabel:       "İşlem",
        indentLabel:       "Girinti",
        indent2:           "2 boşluk",
        indent4:           "4 boşluk",
        indentTab:         "Sekme",
        optionsLabel:      "Seçenekler",

        actionPretty:      "Okunabilir",
        actionMinify:      "Kompakt",

        sortKeys:          "Anahtarları sırala",
        autoDetected:      "otomatik algılandı",
        manual:            "manuel",

        inputPlaceholder:  "Verilerinizi buraya yapıştırın veya yazın…",
        outputPlaceholder: "Biçimlendirilmiş sonuç burada görünecek.",

        empty:             "—",
        byteUnit:          "B",
        lineUnit:          "satır",

        tooltipPaste:      "Panodan yapıştır",
        tooltipClearInput: "Girdiyi temizle",
        tooltipCopy:       "Panoya kopyala",
        tooltipDownload:   "İndir",
        tooltipExpand:     "Genişlet",
        tooltipCollapse:   "Daralt",

        copySuccess:       "Kopyalandı!",
        copyFailed:        "Kopyalama başarısız",

        errorAt:           "satır {line}, sütun {col}",

        jsonErrors: {
            InvalidSymbol:           "Geçersiz sembol",
            InvalidNumberFormat:     "Geçersiz sayı biçimi",
            PropertyNameExpected:    "Özellik adı bekleniyor",
            ValueExpected:           "Değer bekleniyor",
            ColonExpected:           "İki nokta üst üste bekleniyor",
            CommaExpected:           "Virgül bekleniyor",
            CloseBraceExpected:      "Kapatma küme parantezi bekleniyor",
            CloseBracketExpected:    "Kapatma köşeli parantezi bekleniyor",
            EndOfFileExpected:       "Dosya sonu bekleniyor",
            InvalidCommentToken:     "Geçersiz yorum",
            UnexpectedEndOfComment:  "Beklenmeyen yorum sonu",
            UnexpectedEndOfString:   "Beklenmeyen dize sonu",
            UnexpectedEndOfNumber:   "Beklenmeyen sayı sonu",
            InvalidUnicode:          "Geçersiz Unicode karakteri",
            InvalidEscapeCharacter:  "Geçersiz kaçış karakteri",
            InvalidCharacter:        "Geçersiz karakter",
        },

        footerSupportText: "Formatomat ticari olmayan bir projedir ve ücretsiz kalacaktır. Geliştirmeyi desteklemek isterseniz, {link}.",
        footerSupportLink: "buraya tıklayın",

        supportTitle:      "Formatomat'ı Destekle",
        supportIntro:      "Formatomat özel, ticari olmayan bir yan projedir ve her zaman ücretsiz kalacaktır.",
        supportP1:         "Geliştirme ve barındırma maliyetlerini desteklemek isterseniz küçük bir bağış yapabilirsiniz.",
        supportPaypalLabel: "PayPal ile bağış yap",

        aboutLink:         "Hakkında",
        sourceLink:        "Kaynak kodu",
        impressumLink:     "Yasal bilgi",
        privacyLink:       "Gizlilik",

        aboutTitle:        "Formatomat Hakkında",
        aboutP1:           "Formatomat, yapılandırılmış verileri dönüştürmek, biçimlendirmek ve sıkıştırmak için hızlı ve gizliliğe saygılı bir araçtır. Tüm işlemler tarayıcınızda yerel olarak gerçekleşir — verileriniz cihazınızı terk etmez.",
        aboutP2:           "Desteklenen formatlar: JSON, YAML, XML, TOML, INI ve PHP.",
        aboutP3:           "Açık kaynak, MIT lisansı.",
        aboutDepsLabel:    "Kullanılan açık kaynak bileşenler:",

        privacyTitle:      "Gizlilik ve Veri Kullanımı",
        privacyP1:         "Formatomat sunucuda hiçbir kişisel verinizi saklamaz.",
        privacyP2:         "Herhangi bir izleme, analiz aracı veya üçüncü taraf çerez kullanılmaz.",
        privacyP3:         "Kolaylık için bazı tercihler (dil, tema gibi) yalnızca tarayıcınızın yerel depolamasında saklanır. Bu veriler cihazınızı terk etmez.",
        privacyP4:         "Tüm işlemler (ayrıştırma, biçimlendirme, dönüştürme) tarayıcınızda yerel olarak gerçekleşir. Girdi verileriniz hiçbir zaman cihazınızı terk etmez.",

        impressumTitle:    "Yasal Bilgi",
        impressumProviderLabel: "Sorumlu kişi",
        impressumContactLabel:  "İletişim",
        impressumEmailLabel:    "E-posta: ",
        impressumP3:       "Formatomat özel ve ticari olmayan bir projedir. Tüm içerik herhangi bir garanti verilmeden sunulur.",
        impressumP4:       "Harici bağlantılar yalnızca kolaylık amaçlıdır. Bu sitelerin içeriğinden yalnızca ilgili işletmeciler sorumludur.",

        sample_json: `{
  "ad": "Formatomat",
  "sürüm": 1,
  "özellikler": ["okunabilir", "kompakt", "dönüştür"],
  "etkin": true
}`,

        sample_yaml: `ad: Formatomat
sürüm: 1
özellikler:
  - okunabilir
  - kompakt
  - dönüştür
etkin: true`,

        sample_xml: `<?xml version="1.0" encoding="UTF-8"?>
<app name="Formatomat" version="1">
  <features>
    <feature>pretty</feature>
    <feature>minify</feature>
    <feature>convert</feature>
  </features>
  <active>true</active>
</app>`,

        sample_toml: `name = "Formatomat"
version = 1
active = true

[features]
list = ["pretty", "minify", "convert"]`,

        sample_phparray: `<?php
return [
    'name' => 'Formatomat',
    'version' => 1,
    'active' => true,
    'features' => ['okunabilir', 'kompakt', 'dönüştür'],
];`,

        sample_ini: `; Uygulama ayarları
[app]
name = Formatomat
version = 1
active = true

[features]
list = okunabilir, kompakt, dönüştür`,
    },
};
