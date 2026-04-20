export default {
    code: "ja",
    name: "日本語",
    htmlLang: "ja-JP",

    ui: {
        tagline:           "すべてのフォーマットのためのオートマット。",
        inputLabel:        "入力",
        outputLabel:       "出力",
        inputFormatLabel:  "入力",
        outputFormatLabel: "出力",
        actionLabel:       "操作",
        indentLabel:       "インデント",
        indent2:           "スペース2",
        indent4:           "スペース4",
        indentTab:         "タブ",
        optionsLabel:      "オプション",

        actionPretty:      "整形",
        actionMinify:      "圧縮",

        sortKeys:          "キーを並べ替え",
        autoDetected:      "自動検出",
        manual:            "手動",

        inputPlaceholder:  "データをここに貼り付けるか入力してください…",
        outputPlaceholder: "整形されたрезультатはここに表示されます。",

        empty:             "—",
        byteUnit:          "B",
        lineUnit:          "行",

        tooltipPaste:      "クリップボードから貼り付け",
        tooltipClearInput: "入力をクリア",
        tooltipCopy:       "クリップボードにコピー",
        tooltipDownload:   "ダウンロード",
        tooltipExpand:     "展開",
        tooltipCollapse:   "折りたたむ",

        copySuccess:       "コピーしました！",
        copyFailed:        "コピーに失敗しました",

        errorAt:           "{line}行目、{col}列",

        jsonErrors: {
            InvalidSymbol:           "無効なシンボル",
            InvalidNumberFormat:     "無効な数値形式",
            PropertyNameExpected:    "プロパティ名が必要です",
            ValueExpected:           "値が必要です",
            ColonExpected:           "コロンが必要です",
            CommaExpected:           "カンマが必要です",
            CloseBraceExpected:      "閉じ波括弧が必要です",
            CloseBracketExpected:    "閉じ角括弧が必要です",
            EndOfFileExpected:       "ファイルの終端が必要です",
            InvalidCommentToken:     "無効なコメント",
            UnexpectedEndOfComment:  "コメントが予期せず終了しました",
            UnexpectedEndOfString:   "文字列が予期せず終了しました",
            UnexpectedEndOfNumber:   "数値が予期せず終了しました",
            InvalidUnicode:          "無効なUnicode文字",
            InvalidEscapeCharacter:  "無効なエスケープ文字",
            InvalidCharacter:        "無効な文字",
        },

        footerSupportText: "Formatomat は非商業的な無料プロジェクトです。開発を支援したい方は{link}してください。",
        footerSupportLink: "こちらをクリック",

        supportTitle:      "Formatomat を支援する",
        supportIntro:      "Formatomat は非商業的な趣味のプロジェクトで、あなたにとって無料のままです。",
        supportP1:         "開発とホスティングを任意の寄付で支援したい場合は、こちらからどうぞ。",
        supportPaypalLabel: "PayPal で寄付する",

        aboutLink:         "このツールについて",
        sourceLink:        "ソースコード",
        impressumLink:     "法的情報",
        privacyLink:       "プライバシー",

        aboutTitle:        "Formatomat について",
        aboutP1:           "Formatomat は、構造化データを変換・整形・圧縮するための高速でプライバシーに配慮したツールです。すべての処理はブラウザ内でローカルに行われます — データがデバイス外に出ることはありません。",
        aboutP2:           "対応フォーマット：JSON、YAML、XML、TOML、INI および PHP。",
        aboutP3:           "オープンソース、MITライセンス。",
        aboutDepsLabel:    "使用しているオープンソースコンポーネント：",

        privacyTitle:      "プライバシーとデータの利用",
        privacyP1:         "Formatomat はサーバーに個人データを保存しません。",
        privacyP2:         "トラッキング、アナリティクス、サードパーティ Cookie は使用しません。",
        privacyP3:         "利便性のため、一部の設定（言語・テーマなど）はブラウザのローカルストレージにのみ保存されます。このデータがお使いのデバイス外に出ることはありません。",
        privacyP4:         "すべての処理（解析、整形、変換）はブラウザ内でローカルに行われます。入力データがデバイス外に出ることはありません。",

        impressumTitle:    "法的情報",
        impressumProviderLabel: "運営者",
        impressumContactLabel:  "連絡先",
        impressumEmailLabel:    "メール：",
        impressumP3:       "Formatomat は個人・非商業プロジェクトです。すべてのコンテンツは保証なしで提供されます。",
        impressumP4:       "外部リンクは利便性のためのみに提供されます。各サイトのコンテンツについては各運営者が責任を負います。",

        sample_json: `{
  "名前": "Formatomat",
  "バージョン": 1,
  "機能": ["整形", "圧縮", "変換"],
  "有効": true
}`,

        sample_yaml: `名前: Formatomat
バージョン: 1
機能:
  - 整形
  - 圧縮
  - 変換
有効: true`,

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
    'features' => ['整形', '最小化', '変換'],
];`,

        sample_ini: `; アプリケーション設定
[app]
name = Formatomat
version = 1
active = true

[features]
list = 整形, 最小化, 変換`,
    },
};
