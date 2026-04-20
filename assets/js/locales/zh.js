export default {
    code: "zh",
    name: "中文",
    htmlLang: "zh-CN",

    ui: {
        tagline:           "所有格式的自动机。",
        inputLabel:        "输入",
        outputLabel:       "输出",
        inputFormatLabel:  "输入",
        outputFormatLabel: "输出",
        actionLabel:       "操作",
        indentLabel:       "缩进",
        indent2:           "2个空格",
        indent4:           "4个空格",
        indentTab:         "制表符",
        optionsLabel:      "选项",

        actionPretty:      "美化",
        actionMinify:      "压缩",

        sortKeys:          "排序键",
        autoDetected:      "自动检测",
        manual:            "手动",

        inputPlaceholder:  "在此粘贴或输入数据…",
        outputPlaceholder: "格式化结果将显示在此处。",

        empty:             "—",
        byteUnit:          "B",
        lineUnit:          "行",

        tooltipPaste:      "从剪贴板粘贴",
        tooltipClearInput: "清除输入",
        tooltipCopy:       "复制到剪贴板",
        tooltipDownload:   "下载",
        tooltipExpand:     "展开",
        tooltipCollapse:   "收起",

        copySuccess:       "已复制！",
        copyFailed:        "复制失败",

        errorAt:           "第{line}行，第{col}列",

        jsonErrors: {
            InvalidSymbol:           "无效符号",
            InvalidNumberFormat:     "无效的数字格式",
            PropertyNameExpected:    "期望属性名",
            ValueExpected:           "期望值",
            ColonExpected:           "期望冒号",
            CommaExpected:           "期望逗号",
            CloseBraceExpected:      "期望右花括号",
            CloseBracketExpected:    "期望右方括号",
            EndOfFileExpected:       "期望文件结束",
            InvalidCommentToken:     "无效注释",
            UnexpectedEndOfComment:  "注释意外结束",
            UnexpectedEndOfString:   "字符串意外结束",
            UnexpectedEndOfNumber:   "数字意外结束",
            InvalidUnicode:          "无效的Unicode字符",
            InvalidEscapeCharacter:  "无效的转义字符",
            InvalidCharacter:        "无效字符",
        },

        footerSupportText: "Formatomat 是免费的非商业项目。如果您想支持开发，{link}。",
        footerSupportLink: "请点击这里",

        supportTitle:      "支持 Formatomat",
        supportIntro:      "Formatomat 是一个非商业性的业余爱好项目，对你免费。",
        supportP1:         "如果你想通过自愿捐款支持进一步的开发和托管，可以在此处进行。",
        supportPaypalLabel: "通过 PayPal 捐款",

        aboutLink:         "关于",
        sourceLink:        "源代码",
        impressumLink:     "法律信息",
        privacyLink:       "隐私",

        aboutTitle:        "关于 Formatomat",
        aboutP1:           "Formatomat 是一款快速、注重隐私的工具，用于转换、美化和压缩结构化数据。所有处理均在您的浏览器本地进行 — 您的数据永远不会离开您的设备。",
        aboutP2:           "支持的格式：JSON、YAML、XML、TOML、INI 和 PHP。",
        aboutP3:           "开源，MIT许可证。",
        aboutDepsLabel:    "所使用的开源组件：",

        privacyTitle:      "隐私与数据使用",
        privacyP1:         "Formatomat 不在服务器上存储任何个人数据。",
        privacyP2:         "Formatomat 不使用任何跟踪、分析或第三方 Cookie。",
        privacyP3:         "为方便起见，部分偏好设置（如语言、主题）仅存储在您浏览器的本地存储中，这些数据不会离开您的设备。",
        privacyP4:         "所有处理（解析、格式化、转换）均在您的浏览器本地进行。您的输入数据永远不会离开您的设备。",

        impressumTitle:    "法律信息",
        impressumProviderLabel: "负责人",
        impressumContactLabel:  "联系方式",
        impressumEmailLabel:    "电子邮件：",
        impressumP3:       "Formatomat 是私人非商业项目，所有内容不提供任何保证。",
        impressumP4:       "外部链接仅为便利而提供，相关网站的内容由其运营者负责。",

        sample_json: `{
  "名称": "Formatomat",
  "版本": 1,
  "功能": ["美化", "压缩", "转换"],
  "启用": true
}`,

        sample_yaml: `名称: Formatomat
版本: 1
功能:
  - 美化
  - 压缩
  - 转换
启用: true`,

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
    'features' => ['格式化', '压缩', '转换'],
];`,

        sample_ini: `; 应用程序设置
[app]
name = Formatomat
version = 1
active = true

[features]
list = 格式化, 压缩, 转换`,
    },
};
