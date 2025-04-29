interface MathSymbol {
    [key: string]: string;
}

const advancedMathSymbols: MathSymbol = {
    // Phép toán cơ bản
    '\\plus': '+',
    '\\minus': '−',
    '\\times': '×',
    '\\div': '÷',
    '\\pm': '±',

    // So sánh
    '\\eq': '=',
    '\\neq': '≠',
    '\\lt': '<',
    '\\gt': '>',
    '\\leq': '≤',
    '\\geq': '≥',
    '\\approx': '≈',

    // Ký hiệu đặc biệt
    '\\infty': '∞',
    '\\partial': '∂',
    '\\nabla': '∇',
    '\\exists': '∃',
    '\\forall': '∀',
    '\\in': '∈',
    '\\notin': '∉',

    // Tập hợp
    '\\cup': '∪',
    '\\cap': '∩',
    '\\subset': '⊂',
    '\\supset': '⊃',

    // Hy Lạp
    '\\alpha': 'α',
    '\\beta': 'β',
    '\\gamma': 'γ',
    '\\delta': 'Δ',
    '\\theta': 'θ',
    '\\pi': 'π',
    '\\sigma': 'σ',
    '\\omega': 'ω',

    // Thêm các ký hiệu mới
    '\\le': '≤',
    '\\ldots': '…',
    '\\cdot': '·',
    '_1': '₁',
    '_2': '₂',
    '_i': 'ᵢ',
    '_n': 'ₙ',
    '\\sum': 'Σ',
    '\\dots': '…',         // Dấu ba chấm ngang
    '\\cdots': '⋯',       // Dấu ba chấm giữa
    '\\vdots': '⋮',       // Dấu ba chấm dọc
    '\\ddots': '⋱',       // Dấu ba chấm chéo
};

const mathPatterns = {
    // Phân số phức tạp
    fraction: /\\frac\{([^}]+)\}\{([^}]+)\}/g,

    // Căn bậc n
    nthRoot: /\\sqrt\[([^]]+)\]\{([^}]+)\}/g,

    // Căn bậc 2
    sqrt: /\\sqrt\{([^}]+)\}/g,

    // Tích phân
    integral: /\\int_{([^}]+)}^{([^}]+)}/g,

    // Giới hạn
    limit: /\\lim_{([^}]+)}/g,

    // Tổng
    sum: /\\sum_{([^}]+)}^{([^}]+)}/g,

    // Chỉ số trên
    superscript: /\^{([^}]+)}/g,

    // Chỉ số dưới
    subscript: /_{([^}]+)}/g,

    // Ma trận
    matrix: /\\begin{matrix}([\s\S]*?)\\end{matrix}/g,

    // Thêm các pattern mới cho bài toán
    inlineMath: /~([^~]+)~/g,                    // Xử lý math trong dấu ~
    powerNotation: /(\d+)\^(\d+)/g,     // Xử lý 10^6 không có ngoặc
    powerBraceNotation: /(\d+)\^{(\d+)}/g,  // Xử lý 10^{6} có ngoặc
    percentage: /(\d+)\\%/g,                      // Xử lý phần trăm
    userMention: /\[user:([^\]]+)\]/g,           // Xử lý mention user

    // Thêm các pattern mới
    subscriptVar: /([a-z])_([1-9i-n])/g,     // Xử lý x_1, x_2, x_i, x_n
    markdownTable: /\|([^\n]+)\|/g,          // Xử lý bảng markdown
    scientificNotation: /\\cdot 10\^{(\d+)}/g,  // Xử lý dạng a·10^n
    subscriptPair: /_{(\([^)]+\))}/g,          // Xử lý a_{(i,j)}
    multiplicationSign: /\\times/g,             // Xử lý n \times m
    sumExpression: /\\sum_{([^}]+)}^{([^}]+)}/g,  // Xử lý \sum_{i=x_1}^{x_1+a-1}
    arrayNotation: /a=\[([^\]]+)\]/g, // Xử lý a=[1,2,3,4,5]
    inequalityChain: /(\d+)≤([^≤]+)≤(\d+)/g, // Xử lý 1≤N≤10^5
    scientificRange: /10\^{([^}]+)}/g,  // Xử lý 10^5, 10^6

    // Thêm pattern cho block math
    blockMath: /\$\$([\s\S]*?)\$\$/g,  // Xử lý công thức toán nằm giữa $$

    // Cập nhật pattern cho chỉ số
    subscriptLetter: /([a-z])_([A-Z])/g,  // Xử lý a_N, b_N, x_N,...
    subscriptNumber: /([a-z])_(\d+)/g,    // Xử lý a_1, a_2,...
};

export function processMathContent(content: string): string {
    let processedContent = content;

    // Xử lý phân số
    processedContent = processedContent.replace(mathPatterns.fraction, (_, num, den) =>
        `<span class="math-frac"><span class="num">${num}</span><span class="den">${den}</span></span>`
    );

    // Xử lý căn bậc n
    processedContent = processedContent.replace(mathPatterns.nthRoot, (_, n, expr) =>
        `<span class="math-root"><sup>${n}</sup>√<span class="radicand">${expr}</span></span>`
    );

    // Xử lý căn bậc 2
    processedContent = processedContent.replace(mathPatterns.sqrt, (_, expr) =>
        `<span class="math-sqrt">√<span class="radicand">${expr}</span></span>`
    );

    // Xử lý tích phân
    processedContent = processedContent.replace(mathPatterns.integral, (_, lower, upper) =>
        `<span class="math-integral">∫<sub>${lower}</sub><sup>${upper}</sup></span>`
    );

    // Xử lý giới hạn
    processedContent = processedContent.replace(mathPatterns.limit, (_, expr) =>
        `<span class="math-limit">lim<sub>${expr}</sub></span>`
    );

    // Xử lý tổng
    processedContent = processedContent.replace(mathPatterns.sum, (_, lower, upper) =>
        `<span class="math-sum">Σ<sub>${lower}</sub><sup>${upper}</sup></span>`
    );

    // Xử lý chỉ số trên và dưới
    processedContent = processedContent.replace(mathPatterns.superscript, '<sup>$1</sup>');
    processedContent = processedContent.replace(mathPatterns.subscript, '<sub>$1</sub>');

    // Xử lý ma trận
    processedContent = processedContent.replace(mathPatterns.matrix, (_, content) => {
        const rows = content.trim().split('\\\\');
        const cells = rows.map((row: string) =>
            row.trim().split('&').map((cell: string) =>
                `<td>${cell.trim()}</td>`
            ).join('')
        );
        return `<table class="math-matrix"><tbody>${cells.map((row: string, rowIndex: number) => `<tr key="row-${rowIndex}">${row}</tr>`).join('')
            }</tbody></table>`;
    });

    // Thêm xử lý cho các pattern mới

    // Xử lý mention user
    processedContent = processedContent.replace(
        mathPatterns.userMention,
        '<span class="user-mention">@$1</span>'
    );

    // Xử lý phần trăm
    processedContent = processedContent.replace(
        mathPatterns.percentage,
        '$1%'
    );

    // Xử lý số mũ có ngoặc
    processedContent = processedContent.replace(
        mathPatterns.powerBraceNotation,
        '$1<sup>$2</sup>'
    );

    // Xử lý số mũ không có ngoặc
    processedContent = processedContent.replace(
        mathPatterns.powerNotation,
        '$1<sup>$2</sup>'
    );

    // Xử lý biến có chỉ số
    processedContent = processedContent.replace(
        mathPatterns.subscriptVar,
        (_, variable, index) => {
            const subscript = {
                '1': '₁',
                '2': '₂',
                'i': 'ᵢ',
                'n': 'ₙ'
            } as const;
            return `${variable}${subscript[index as keyof typeof subscript] || index}`;
        }
    );

    // Xử lý ký hiệu khoa học
    processedContent = processedContent.replace(
        mathPatterns.scientificNotation,
        (_, power) => `·10<sup>${power}</sup>`
    );

    // Xử lý biểu thức tổng
    processedContent = processedContent.replace(
        mathPatterns.sumExpression,
        (_, lower, upper) => `<span class="math-sum">Σ<sub>${lower}</sub><sup>${upper}</sup></span>`
    );

    // Xử lý chỉ số dạng (i,j)
    processedContent = processedContent.replace(
        mathPatterns.subscriptPair,
        (_, pair) => `<sub>${pair}</sub>`
    );

    // Xử lý dấu nhân
    processedContent = processedContent.replace(
        mathPatterns.multiplicationSign,
        '×'
    );

    // Xử lý math trong dấu ~
    processedContent = processedContent.replace(
        mathPatterns.inlineMath,
        (_, content) => {
            let mathContent = content;

            // Xử lý số mũ
            mathContent = mathContent.replace(
                /(\d+)\^{(\d+)}/g,
                '$1<sup>$2</sup>'
            );

            // Xử lý dấu ≤
            mathContent = mathContent.replace(/\\le/g, '≤');

            // Xử lý dấu ba chấm
            mathContent = mathContent.replace(/\\dots/g, '…');

            // Xử lý chỉ số
            mathContent = mathContent.replace(
                /a_([1-9i-n])/g,
                'a<sub>$1</sub>'
            );

            return mathContent;
        }
    );

    // Xử lý bảng markdown (giữ nguyên định dạng)
    processedContent = processedContent.replace(
        mathPatterns.markdownTable,
        (match) => match
    );

    // Thay thế các ký hiệu toán học
    Object.entries(advancedMathSymbols).forEach(([symbol, replacement]) => {
        processedContent = processedContent.replace(
            new RegExp(symbol.replace(/\\/g, '\\\\'), 'g'),
            replacement
        );
    });

    // Xử lý block math (công thức nằm giữa $$)
    processedContent = processedContent.replace(
        mathPatterns.blockMath,
        (_, content) => {
            let mathContent = content.trim();

            // Xử lý tổng
            mathContent = mathContent.replace(
                /\\sum_{([^}]+)}^{([^}]+)}/g,
                '<span class="math-sum">Σ<sub>$1</sub><sup>$2</sup></span>'
            );

            // Xử lý chỉ số phức tạp
            mathContent = mathContent.replace(
                /_{(\([^)]+\))}/g,
                '<sub>$1</sub>'
            );

            // Xử lý dấu ≤
            mathContent = mathContent.replace(/\\leq/g, '≤');

            return `<div class="block-math">${mathContent}</div>`;
        }
    );

    // Xử lý mảng
    processedContent = processedContent.replace(
        mathPatterns.arrayNotation,
        (_, numbers) => `a=[${numbers}]`
    );

    // Xử lý chỉ số của a
    processedContent = processedContent.replace(
        mathPatterns.subscriptNumber,
        (_, num) => `a<sub>${num}</sub>`
    );

    // Xử lý dãy số mũ
    processedContent = processedContent.replace(
        mathPatterns.scientificRange,
        (_, power) => `10<sup>${power}</sup>`
    );

    // Xử lý chỉ số chữ cái viết hoa
    processedContent = processedContent.replace(
        mathPatterns.subscriptLetter,
        (_, variable, letter) => {
            const subscriptMap: { [key: string]: string } = {
                'N': 'ₙ',
                'I': 'ᵢ',
                'J': 'ⱼ',
                'K': 'ₖ',
                'M': 'ₘ'
            };
            return `${variable}${subscriptMap[letter] || `<sub>${letter}</sub>`}`;
        }
    );

    return processedContent;
} 