export default {
    code: "pt",
    name: "Português",
    htmlLang: "pt-PT",

    ui: {
        tagline:           "O autómato para todos os formatos.",
        inputLabel:        "Entrada",
        outputLabel:       "Saída",
        inputFormatLabel:  "Entrada",
        outputFormatLabel: "Saída",
        actionLabel:       "Ação",
        indentLabel:       "Indentação",
        indent2:           "2 espaços",
        indent4:           "4 espaços",
        indentTab:         "Tabulação",
        optionsLabel:      "Opções",

        actionPretty:      "Legível",
        actionMinify:      "Compacto",

        sortKeys:          "Ordenar chaves",
        autoDetected:      "detetado automaticamente",
        manual:            "manual",

        inputPlaceholder:  "Cole ou escreva os seus dados aqui…",
        outputPlaceholder: "O resultado formatado aparecerá aqui.",

        empty:             "—",
        byteUnit:          "B",
        lineUnit:          "linhas",

        tooltipPaste:      "Colar da área de transferência",
        tooltipClearInput: "Limpar entrada",
        tooltipCopy:       "Copiar para a área de transferência",
        tooltipDownload:   "Transferir",
        tooltipExpand:     "Expandir",
        tooltipCollapse:   "Recolher",

        copySuccess:       "Copiado!",
        copyFailed:        "Erro ao copiar",

        errorAt:           "linha {line}, col {col}",

        jsonErrors: {
            InvalidSymbol:           "Símbolo inválido",
            InvalidNumberFormat:     "Formato de número inválido",
            PropertyNameExpected:    "Nome de propriedade esperado",
            ValueExpected:           "Valor esperado",
            ColonExpected:           "Dois-pontos esperados",
            CommaExpected:           "Vírgula esperada",
            CloseBraceExpected:      "Chave de fechamento esperada",
            CloseBracketExpected:    "Colchete de fechamento esperado",
            EndOfFileExpected:       "Fim de arquivo esperado",
            InvalidCommentToken:     "Comentário inválido",
            UnexpectedEndOfComment:  "Fim de comentário inesperado",
            UnexpectedEndOfString:   "Fim de cadeia inesperado",
            UnexpectedEndOfNumber:   "Fim de número inesperado",
            InvalidUnicode:          "Caractere Unicode inválido",
            InvalidEscapeCharacter:  "Caractere de escape inválido",
            InvalidCharacter:        "Caractere inválido",
        },

        footerSupportText: "Formatomat é um projeto não comercial e continuará gratuito. Se quiser apoiar o desenvolvimento, {link}.",
        footerSupportLink: "clique aqui",

        supportTitle:      "Apoiar o Formatomat",
        supportIntro:      "Formatomat é um projeto hobby não comercial e permanece gratuito para ti.",
        supportP1:         "Se quiseres apoiar o desenvolvimento e o alojamento com uma doação voluntária, podes fazê-lo aqui.",
        supportPaypalLabel: "Doar via PayPal",

        aboutLink:         "Sobre",
        sourceLink:        "Código-fonte",
        impressumLink:     "Aviso legal",
        privacyLink:       "Privacidade",

        aboutTitle:        "Sobre o Formatomat",
        aboutP1:           "Formatomat é uma ferramenta rápida e respeitadora da privacidade para converter, formatar e compactar dados estruturados. Todo o processamento é feito localmente no seu navegador — os seus dados nunca saem do dispositivo.",
        aboutP2:           "Formatos suportados: JSON, YAML, XML, TOML, INI e PHP.",
        aboutP3:           "Código aberto, licença MIT.",
        aboutDepsLabel:    "Componentes open source utilizados:",

        privacyTitle:      "Privacidade e Utilização de Dados",
        privacyP1:         "Formatomat não armazena quaisquer dados pessoais no servidor.",
        privacyP2:         "Formatomat não utiliza rastreamento, análises nem cookies de terceiros.",
        privacyP3:         "Para sua comodidade, algumas preferências (idioma, tema) são guardadas no armazenamento local do seu navegador. Estes dados nunca saem do seu dispositivo.",
        privacyP4:         "Todo o processamento (análise, formatação, conversão) é realizado localmente no seu navegador. Os seus dados de entrada nunca saem do dispositivo.",

        impressumTitle:    "Aviso Legal",
        impressumProviderLabel: "Prestador de serviço",
        impressumContactLabel:  "Contacto",
        impressumEmailLabel:    "E-mail: ",
        impressumP3:       "Formatomat é um projeto privado e não comercial. Todo o conteúdo é disponibilizado sem garantias e sem qualquer reivindicação de exatidão ou completude.",
        impressumP4:       "As ligações a sítios externos são fornecidas apenas por conveniência. Os respetivos operadores são os únicos responsáveis pelo seu conteúdo.",

        sample_json: `{
  "nome": "Formatomat",
  "versão": 1,
  "funções": ["legível", "compacto", "converter"],
  "ativo": true
}`,

        sample_yaml: `nome: Formatomat
versão: 1
funções:
  - legível
  - compacto
  - converter
ativo: true`,

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
    'features' => ['legível', 'compacto', 'converter'],
];`,

        sample_ini: `; Configurações da aplicação
[app]
name = Formatomat
version = 1
active = true

[features]
list = legível, compacto, converter`,
    },
};
