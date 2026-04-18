export default {
    code: "uk",
    name: "Українська",
    htmlLang: "uk-UA",

    ui: {
        tagline:           "Автомат для всіх форматів.",
        inputLabel:        "Введення",
        outputLabel:       "Виведення",
        inputFormatLabel:  "Введення",
        outputFormatLabel: "Виведення",
        actionLabel:       "Дія",
        indentLabel:       "Відступ",
        indent2:           "2 пробіли",
        indent4:           "4 пробіли",
        indentTab:         "Табуляція",
        optionsLabel:      "Параметри",

        actionPretty:      "Читабельно",
        actionMinify:      "Стиснути",

        sortKeys:          "Сортувати ключі",
        autoDetected:      "визначено автоматично",
        manual:            "вручну",

        inputPlaceholder:  "Вставте або введіть дані тут…",
        outputPlaceholder: "Відформатований результат з'явиться тут.",

        empty:             "—",
        byteUnit:          "Б",
        lineUnit:          "рядків",

        tooltipPaste:      "Вставити з буфера обміну",
        tooltipClearInput: "Очистити введення",
        tooltipCopy:       "Копіювати в буфер обміну",
        tooltipDownload:   "Завантажити",
        tooltipExpand:     "Розгорнути",
        tooltipCollapse:   "Згорнути",

        copySuccess:       "Скопійовано!",
        copyFailed:        "Помилка копіювання",

        errorAt:           "рядок {line}, стовп {col}",

        jsonErrors: {
            InvalidSymbol:           "Недопустимий символ",
            InvalidNumberFormat:     "Неправильний формат числа",
            PropertyNameExpected:    "Очікується ім'я властивості",
            ValueExpected:           "Очікується значення",
            ColonExpected:           "Очікується двокрапка",
            CommaExpected:           "Очікується кома",
            CloseBraceExpected:      "Очікується закриваюча фігурна дужка",
            CloseBracketExpected:    "Очікується закриваюча квадратна дужка",
            EndOfFileExpected:       "Очікується кінець файлу",
            InvalidCommentToken:     "Недопустимий коментар",
            UnexpectedEndOfComment:  "Неочікуваний кінець коментаря",
            UnexpectedEndOfString:   "Неочікуваний кінець рядка",
            UnexpectedEndOfNumber:   "Неочікуваний кінець числа",
            InvalidUnicode:          "Недопустимий символ Unicode",
            InvalidEscapeCharacter:  "Недопустимий escape-символ",
            InvalidCharacter:        "Недопустимий символ",
        },

        footerSupportText: "Formatomat — некомерційний проєкт і залишатиметься безкоштовним. Якщо ви хочете підтримати розробку, {link}.",
        footerSupportLink: "натисніть тут",

        supportTitle:      "Підтримати Formatomat",
        supportIntro:      "Formatomat — приватний некомерційний проєкт і завжди буде безкоштовним.",
        supportP1:         "Якщо ви хочете підтримати розробку та витрати на хостинг, можете зробити невеликий внесок.",
        supportPaypalLabel: "Підтримати через PayPal",

        aboutLink:         "Про проєкт",
        sourceLink:        "Вихідний код",
        impressumLink:     "Правова інформація",
        privacyLink:       "Конфіденційність",

        aboutTitle:        "Про Formatomat",
        aboutP1:           "Formatomat — швидкий інструмент з захистом конфіденційності для конвертації, форматування та стиснення структурованих даних. Вся обробка відбувається локально у вашому браузері — ваші дані ніколи не залишають пристрій.",
        aboutP2:           "Підтримувані формати: JSON, YAML, XML, TOML, INI і PHP.",
        aboutP3:           "Відкритий вихідний код, ліцензія MIT.",
        aboutDepsLabel:    "Використані компоненти з відкритим кодом:",

        privacyTitle:      "Конфіденційність та використання даних",
        privacyP1:         "Formatomat не зберігає жодних персональних даних на сервері.",
        privacyP2:         "Formatomat не використовує трекінг, аналітику або сторонні файли cookie.",
        privacyP3:         "Для зручності деякі налаштування (наприклад, мова та тема) зберігаються лише в локальному сховищі вашого браузера. Ці дані ніколи не залишають ваш пристрій.",
        privacyP4:         "Вся обробка (розбір, форматування, конвертація) відбувається локально у вашому браузері. Введені дані ніколи не залишають ваш пристрій.",

        impressumTitle:    "Правова інформація",
        impressumProviderLabel: "Відповідальна особа",
        impressumContactLabel:  "Контакт",
        impressumEmailLabel:    "E-mail: ",
        impressumP3:       "Formatomat є приватним некомерційним проєктом. Увесь вміст надається без жодних гарантій.",
        impressumP4:       "Посилання на зовнішні сайти наведено лише для зручності. За їхній вміст відповідають виключно власники цих сайтів.",

        sample_json: `{
  "назва": "Formatomat",
  "версія": 1,
  "функції": ["читабельно", "стиснути", "конвертувати"],
  "активний": true
}`,

        sample_yaml: `назва: Formatomat
версія: 1
функції:
  - читабельно
  - стиснути
  - конвертувати
активний: true`,

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
    'features' => ['читабельний', 'компактний', 'конвертувати'],
];`,

        sample_ini: `; Налаштування програми
[app]
name = Formatomat
version = 1
active = true

[features]
list = читабельний, компактний, конвертувати`,
    },
};
