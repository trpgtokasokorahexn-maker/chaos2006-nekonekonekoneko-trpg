// サイトのメインJavaScriptファイル

// DOMの読み込みが完了してから実行
document.addEventListener('DOMContentLoaded', function() {
    // 初期化処理
    initializeSite();
    
    // 検索ボックスでEnterキーが押されたら検索を実行
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRules();
            }
        });
    }
});

// サイトの初期化
function initializeSite() {
    console.log('クトゥルフ神話TRPG 7版 ルールブック サイトが読み込まれました');
    
    // 初期セクションを表示
    showSection('basic-rules');
    
    // スムーズスクロールの設定
    setupSmoothScroll();
}

// セクションの表示切り替え
function showSection(sectionId) {
    // すべてのセクションを非表示
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // 検索結果も非表示
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
    
    // 指定されたセクションを表示
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // アニメーション効果
        setTimeout(() => {
            targetSection.style.opacity = '1';
        }, 10);
    }
    
    // ナビゲーションのアクティブ状態を更新
    updateNavigation(sectionId);
}

// ナビゲーションのアクティブ状態を更新
function updateNavigation(activeSection) {
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(activeSection)) {
            link.classList.add('active');
        }
    });
}

// 検索機能
function searchRules() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchResultsContent = document.getElementById('searchResultsContent');
    
    if (!searchInput || !searchResults || !searchResultsContent) return;
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        alert('検索キーワードを入力してください');
        return;
    }
    
    // 検索結果をクリア
    searchResultsContent.innerHTML = '';
    
    // すべてのセクションを非表示
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // 検索結果を表示
    searchResults.style.display = 'block';
    
    // 検索を実行
    const results = performSearch(searchTerm);
    
    if (results.length > 0) {
        displaySearchResults(results, searchTerm);
    } else {
        displayNoResults(searchTerm);
    }
    
    // 検索結果にスクロール
    searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 検索を実行
function performSearch(searchTerm) {
    const results = [];
    const allContent = getAllContent();
    
    allContent.forEach(content => {
        if (content.text.toLowerCase().includes(searchTerm)) {
            const relevance = calculateRelevance(content.text, searchTerm);
            results.push({
                ...content,
                relevance: relevance,
                excerpt: createExcerpt(content.text, searchTerm)
            });
        }
    });
    
    // 関連性でソート
    results.sort((a, b) => b.relevance - a.relevance);
    
    return results;
}

// すべてのコンテンツを取得
function getAllContent() {
    const content = [];
    
    // 各セクションからコンテンツを抽出
    const sections = [
        {
            id: 'basic-rules',
            title: '基本ルール',
            items: [
                {
                    title: 'ダイス判定',
                    text: '成功率を百分率で表し、1d100で振って目標値以下なら成功。イクストリーム成功は技能値の1/5以下、ハード成功は技能値の1/2以下、通常成功は技能値以下、失敗は技能値を超える。'
                },
                {
                    title: 'プッシュロール',
                    text: '失敗したロールをもう一度振り直すことができる。失敗した場合、より危険な結果になる可能性がある。KPの許可が必要で、状況が悪化する代償がある。'
                },
                {
                    title: 'ボーナス・ペナルティダイス',
                    text: '状況に応じてダイスに修正を加える。ボーナスダイスは1つ多くの10の位ダイスを振る。ペナルティダイスは1つ多くの10の位ダイスを振り、最悪の結果を採用。'
                },
                {
                    title: '幸運の消費',
                    text: '幸運を消費して状況を好転させる。幸運ロールで成功すれば、状況を好転できる。消費した幸運は回復せず、KPの判断による。'
                },
                {
                    title: '対抗ロール',
                    text: '2人のキャラクターが互いに能力を競う場合。両者が同時にロールを行い、成功レベルが高い方が勝利。同じ成功レベルなら、技能値が高い方が勝利。'
                }
            ]
        },
        {
            id: 'character',
            title: 'キャラクター',
            items: [
                {
                    title: '能力値',
                    text: 'STR筋力、CON体力、DEX敏捷、INT知性、POW精神力、APP外見、SIZサイズ、EDU教育の8つの能力値でキャラクターを定義する。'
                },
                {
                    title: '派生値',
                    text: 'HPはCON+SIZ÷10、MPはPOW÷5、SANはPOW×5、幸運はPOW×5、ビルドとムーブは能力値から算出される。'
                },
                {
                    title: '技能上限',
                    text: '技能の成長には上限がある。基本上限は技能値の75%、職業技能は90%、興味本位技能は50%。成長ロールで上限を超えることも可能。'
                }
            ]
        },
        {
            id: 'combat',
            title: '戦闘',
            items: [
                {
                    title: '基本応戦',
                    text: 'DEXの高い順に行動。1ラウンドは6秒で、1回の行動でできることは1つ。移動または攻撃のどちらか。'
                },
                {
                    title: '貫通攻撃',
                    text: '攻撃が貫通値以上のダメージを与えた場合、追加ダメージを与え、防具を無視したダメージ計算を行う。'
                },
                {
                    title: '反撃',
                    text: '攻撃を受けた場合、同じターンに反撃可能。反撃は通常攻撃と同じ扱い、DEXが同じ場合、同時に攻撃。'
                },
                {
                    title: 'ノックアウト',
                    text: 'HPが0以下になった場合、毎ラウンドCONロールを行う。失敗すると死亡、成功しても1d6時間意識不明。'
                }
            ]
        },
        {
            id: 'mythos',
            title: '神話生物',
            items: [
                {
                    title: '代表的な神話生物',
                    text: 'ディープ・ワン、ミ＝ゴ、シャンブル・フロッグス、ナイト・ガント、クトゥルフなど、クトゥルフ神話に登場する生物たち。'
                },
                {
                    title: '遭遇の影響',
                    text: '神話生物との遭遇時にSANロールが必要。失敗すると正気度ポイントを失い、イクストリーム失敗で一時的狂気。累積的な恐怖による精神的創傷。'
                }
            ]
        },
        {
            id: 'madness',
            title: '狂気',
            items: [
                {
                    title: '狂気の発動',
                    text: 'SANポイントを1回で5以上失った場合、または累計で現在の半分以下になった場合、狂気ロールを行い、失敗すると一時的狂気。'
                },
                {
                    title: '一時的狂気',
                    text: '1d10ラウンド続く短期的な精神的異常。戦闘不能になることもあり、症状は多種多様で、回復後も記憶に残る。'
                },
                {
                    title: '恒久的狂気',
                    text: 'SANポイントが0になった場合、キャラクターが精神崩壊。治療が必要で、回復は非常に困難。'
                }
            ]
        },
        {
            id: 'skills',
            title: '技能',
            items: [
                {
                    title: '主要技能カテゴリ',
                    text: '戦闘技能、知識技能、行動技能、交渉技能、芸術技能など、技能の種類と用途をカテゴリ別に分類。'
                },
                {
                    title: '技能の成長',
                    text: '成功した技能ロールに対して成長ロール。1d100を振って技能値を超えたら成長し、1d10ポイント上昇。失敗しても成長の可能性あり。'
                },
                {
                    title: '職業技能',
                    text: '職業に関連する技能。職業ごとに得意な技能が決まっており、より高い初期値を持ち、成長しやすい。'
                },
                {
                    title: '信用',
                    text: '信用技能はキャラクターの社会的地位、評判、経済力を表す。高い信用を持つキャラクターは社会的に信頼され、金銭的な余裕があり、人脈も広い。信用は職業によって初期値が異なり、成功すれば情報収集、物品調達、人脈利用などが可能になる。'
                }
            ]
        }
    ];
    
    sections.forEach(section => {
        section.items.forEach(item => {
            content.push({
                title: item.title,
                text: item.text,
                section: section.title,
                sectionId: section.id
            });
        });
    });
    
    return content;
}

// 関連性を計算
function calculateRelevance(text, searchTerm) {
    const words = searchTerm.split(' ');
    let score = 0;
    
    words.forEach(word => {
        const regex = new RegExp(word, 'gi');
        const matches = text.match(regex);
        if (matches) {
            score += matches.length;
        }
    });
    
    // 完全一致の場合はさらに加点
    if (text.toLowerCase().includes(searchTerm)) {
        score += 5;
    }
    
    return score;
}

// 要約を作成
function createExcerpt(text, searchTerm) {
    const maxLength = 150;
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    
    if (index === -1) {
        return text.substring(0, maxLength) + '...';
    }
    
    let start = Math.max(0, index - 50);
    let end = Math.min(text.length, index + searchTerm.length + 100);
    
    let excerpt = text.substring(start, end);
    
    if (start > 0) {
        excerpt = '...' + excerpt;
    }
    if (end < text.length) {
        excerpt = excerpt + '...';
    }
    
    // 検索語をハイライト
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    excerpt = excerpt.replace(regex, '<mark>$1</mark>');
    
    return excerpt;
}

// 検索結果を表示
function displaySearchResults(results, searchTerm) {
    const searchResultsContent = document.getElementById('searchResultsContent');
    
    let html = `<p>「${searchTerm}」の検索結果: ${results.length}件見つかりました</p>`;
    
    results.forEach(result => {
        html += `
            <div class="search-result-item">
                <h4>${result.title}</h4>
                <p>${result.excerpt}</p>
                <p><strong>カテゴリ:</strong> ${result.section}</p>
                <a href="#" onclick="showSection('${result.sectionId}'); return false;">
                    詳細を見る <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
    });
    
    searchResultsContent.innerHTML = html;
}

// 検索結果がない場合の表示
function displayNoResults(searchTerm) {
    const searchResultsContent = document.getElementById('searchResultsContent');
    
    searchResultsContent.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
            <p>「${searchTerm}」に関連する検索結果がありません。</p>
            <p>別のキーワードでお試しください。</p>
        </div>
    `;
}

// スムーズスクロールの設定
function setupSmoothScroll() {
    // 内部リンクのスムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ナビゲーションのスタイルを追加
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        background: #e74c3c !important;
        border-bottom-color: #c0392b !important;
    }
    
    mark {
        background: #e74c3c;
        color: white;
        padding: 2px 4px;
        border-radius: 3px;
    }
    
    .search-result-item a {
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }
    
    .search-result-item a:hover i {
        transform: translateX(3px);
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);

// ページトップへスクロール
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// キーボードショートカット
document.addEventListener('keydown', function(e) {
    // Ctrl+K で検索ボックスにフォーカス
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape で検索結果をクリア
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
        }
        if (searchResults && searchResults.style.display !== 'none') {
            searchResults.style.display = 'none';
            // 最初のセクションを表示
            showSection('basic-rules');
        }
    }
});

// コンソールにヘルプを表示
console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  クトゥルフ神話TRPG 7版 ルールブック - ヘルプ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【キーボードショートカット】
・Ctrl+K: 検索ボックスにフォーカス
・Escape: 検索結果をクリア

【検索機能】
・画面上部の検索ボックスからルールを検索できます
・複数のキーワードをスペースで区切って検索可能です

【ナビゲーション】
・上部メニューから各セクションに移動できます
・スムーズスクロールで快適に移動します

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
// ★ ページ遷移用
function goToPage(page) {
    window.location.href = page;
}
