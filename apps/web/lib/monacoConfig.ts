import { Monaco } from "@monaco-editor/react";

export const configureMonaco = (monaco: Monaco) => {
    monaco.languages.register({ id: "lapisla" });

    monaco.languages.setMonarchTokensProvider("lapisla", {
        defaultToken: "invalid",
        keywords: ["ThmD", "qed", "apply"],
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
        provideCompletionItems: (model, position) => {
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
                    label: 'ThmD',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'ThmD $1 $2\n$3\nqed',
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
            ];

            return { suggestions };
        },
    });
};
