export default {
    code: "ru",
    name: "Русский",
    htmlLang: "ru",

    ui: {
        tagline:           "Автомат для всех форматов.",
        inputLabel:        "Ввод",
        outputLabel:       "Вывод",
        inputFormatLabel:  "Ввод",
        outputFormatLabel: "Вывод",
        actionLabel:       "Действие",
        indentLabel:       "Отступ",
        indent2:           "2 пробела",
        indent4:           "4 пробела",
        indentTab:         "Табуляция",
        optionsLabel:      "Параметры",

        actionPretty:      "Красиво",
        actionMinify:      "Сжать",

        sortKeys:          "Сортировать ключи",
        autoDetected:      "определено автоматически",
        manual:            "вручную",

        inputPlaceholder:  "Вставьте или введите данные здесь…",
        outputPlaceholder: "Отформатированный результат появится здесь.",

        empty:             "—",
        byteUnit:          "Б",
        lineUnit:          "строк",

        tooltipPaste:      "Вставить из буфера обмена",
        tooltipClearInput: "Очистить ввод",
        tooltipCopy:       "Копировать в буфер обмена",
        tooltipDownload:   "Скачать",
        tooltipExpand:     "Развернуть",
        tooltipCollapse:   "Свернуть",

        copySuccess:       "Скопировано!",
        copyFailed:        "Ошибка копирования",

        errorAt:           "строка {line}, столбец {col}",

        jsonErrors: {
            InvalidSymbol:           "Недопустимый символ",
            InvalidNumberFormat:     "Неверный формат числа",
            PropertyNameExpected:    "Ожидается имя свойства",
            ValueExpected:           "Ожидается значение",
            ColonExpected:           "Ожидается двоеточие",
            CommaExpected:           "Ожидается запятая",
            CloseBraceExpected:      "Ожидается закрывающая фигурная скобка",
            CloseBracketExpected:    "Ожидается закрывающая квадратная скобка",
            EndOfFileExpected:       "Ожидается конец файла",
            InvalidCommentToken:     "Недопустимый комментарий",
            UnexpectedEndOfComment:  "Неожиданный конец комментария",
            UnexpectedEndOfString:   "Неожиданный конец строки",
            UnexpectedEndOfNumber:   "Неожиданный конец числа",
            InvalidUnicode:          "Недопустимый символ Unicode",
            InvalidEscapeCharacter:  "Недопустимый escape-символ",
            InvalidCharacter:        "Недопустимый символ",
        },

        footerSupportText: "Formatomat — некоммерческий проект и останется бесплатным. Чтобы поддержать разработку, {link}.",
        footerSupportLink: "нажмите здесь",

        supportTitle:      "Поддержать Formatomat",
        supportIntro:      "Formatomat — некоммерческий хобби-проект, который остаётся для тебя бесплатным.",
        supportP1:         "Если ты хочешь поддержать дальнейшую разработку и хостинг добровольным пожертвованием, ты можешь сделать это здесь.",
        supportPaypalLabel: "Пожертвовать через PayPal",

        aboutLink:         "О проекте",
        sourceLink:        "Исходный код",
        impressumLink:     "Правовая информация",
        privacyLink:       "Конфиденциальность",

        aboutTitle:        "О Formatomat",
        aboutP1:           "Formatomat — быстрый инструмент с защитой конфиденциальности для конвертации, форматирования и минификации структурированных данных. Вся обработка происходит локально в браузере — ваши данные никогда не покидают устройство.",
        aboutP2:           "Поддерживаемые форматы: JSON, YAML, XML, TOML, INI и PHP.",
        aboutP3:           "Открытый исходный код, лицензия MIT.",
        aboutDepsLabel:    "Используемые компоненты с открытым исходным кодом:",

        privacyTitle:      "Конфиденциальность и использование данных",
        privacyP1:         "Formatomat не хранит персональные данные на сервере.",
        privacyP2:         "Formatomat не использует отслеживание, аналитику или сторонние куки.",
        privacyP3:         "Для удобства некоторые настройки (язык, тема) сохраняются только в localStorage вашего браузера. Эти данные не покидают ваше устройство.",
        privacyP4:         "Вся обработка (разбор, форматирование, конвертация) происходит локально в вашем браузере. Введённые данные никогда не покидают ваше устройство.",

        impressumTitle:    "Правовая информация",
        impressumProviderLabel: "Ответственное лицо",
        impressumContactLabel:  "Контакт",
        impressumEmailLabel:    "E-mail: ",
        impressumP3:       "Formatomat является частным некоммерческим проектом и предоставляется без гарантий.",
        impressumP4:       "Ссылки на внешние ресурсы предоставлены для удобства. За их содержание отвечают исключительно владельцы этих сайтов.",

        sample_json: `{
  "название": "Formatomat",
  "версия": 1,
  "функции": ["красиво", "сжать", "конвертировать"],
  "активен": true
}`,

        sample_yaml: `название: Formatomat
версия: 1
функции:
  - красиво
  - сжать
  - конвертировать
активен: true`,

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
    'features' => ['читаемый', 'компактный', 'конвертировать'],
];`,

        sample_ini: `; Настройки приложения
[app]
name = Formatomat
version = 1
active = true

[features]
list = читаемый, компактный, конвертировать`,
    },
};
