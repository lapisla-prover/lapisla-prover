import { Monaco } from "@monaco-editor/react";

export const configureMonaco = (monaco: Monaco) => {
    monaco.languages.register({ id: "lapisla" });

    monaco.languages.setMonarchTokensProvider("lapisla", {
        defaultToken: "invalid",
        keywords: ["Theorem", "qed", "apply", "use", "import", "axiom", "constant", "prop"],
        operators: ["∧", "∨", "→", "⊤", "⊥", "∀", "∃", "λ", "⊢"],
        symbols: /[∀∃⊤⊥∧∨→λ\\,\.]/,
        tokenizer: {
            root: [
                [
                    /[a-zA-Z_]\w*/,
                    {
                        cases: {
                            "@keywords": "keyword",
                            "@default": "identifier",
                        },
                    },
                ],
                { include: "@whitespace" },
                [
                    /@symbols/,
                    {
                        cases: {
                            "@operators": "operator",
                            "@keywords": "keyword",
                            "@default": "",
                        },
                    },
                ],
                [/[(){}\[\]]/, "@brackets"],
                [/[;:]/, "delimiter"],
                [/\d+/, "number"],
            ],
            whitespace: [
                [/[ \t\r\n]+/, "white"],
                [/#.*$/, "comment"],
            ],
        },
    });

    monaco.languages.registerCompletionItemProvider("lapisla", {
        provideCompletionItems: (model, position, context, token) => {
            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
            };

            const suggestions = [
                {
                    label: 'lambda',
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: 'λ',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Lambda abstraction operator',
                    range: range
                },
                {
                    label: 'top',
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: '⊤',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Top element',
                    range: range
                },
                {
                    label: 'bottom',
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: '⊥',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Bottom element',
                    range: range
                },
                {
                    label: 'and',
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: '∧',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Conjunction operator',
                    range: range
                },
                {
                    label: 'or',
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: '∨',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Disjunction operator',
                    range: range
                },
                {
                    label: 'imply',
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: '→',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Implication operator',
                    range: range

                },
                {
                    label: 'forall',
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: '∀',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Universal quantification operator',
                    range: range
                },
                {
                    label: 'exist',
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: '∃',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Existential quantification operator',
                    range: range
                },
                {
                    label: 'vdash',
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: '⊢',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Turnstile',
                    range: range
                },
                {
                    label: 'Theorem',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'Theorem $1 $2\n$3\nqed',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Theorem declaration',
                    range: range
                },
                {
                    label: 'qed',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'qed',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Proof end',
                    range: range
                },
                {
                    label: 'apply',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'apply',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Apply rule',
                    range: range
                },
                {
                    label: 'use',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'use',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Use hypothesis',
                    range: range
                },
                {
                    label: 'mapsto',
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: '↦',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'mappping operator',
                    range: range
                },
                {
                    label: 'import',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'import',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Import theorems',
                    range: range
                },
                {
                    label: 'constant',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'constant',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Declare constant',
                    range: range
                },
                {
                    label: 'axiom',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'axiom',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Declare axiom',
                    range: range
                },
                {
                    label: 'prop',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'prop',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Type of propositions',
                    range: range
                },
            ];

            return { suggestions };
        },
    });

    monaco.languages.register({ id: "proof-state" });

    monaco.languages.setMonarchTokensProvider("proof-state", {
        defaultToken: "invalid",
        keywords: ["Goal"],
        operators: ["∧", "∨", "→", "⊤", "⊥", "∀", "∃", "λ", "⊢"],
        symbols: /[∀∃⊤⊥∧∨→λ\\,\.]/,
        tokenizer: {
            root: [
                [
                    /[a-zA-Z_]\w*/,
                    {
                        cases: {
                            "@keywords": "keyword",
                            "@default": "identifier",
                        },
                    },
                ],
                { include: "@whitespace" },
                [
                    /@symbols/,
                    {
                        cases: {
                            "@operators": "operator",
                            "@keywords": "keyword",
                            "@default": "",
                        },
                    },
                ],
                [/[(){}\[\]]/, "@brackets"],
                [/[;:]/, "delimiter"],
                [/\d+/, "number"],
                [/─{20,}/, "delimiter"],
            ],
            whitespace: [
                [/[ \t\r\n]+/, "white"],
            ],
        },
    });
};
