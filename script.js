// 日本の祝日・記念日データ
const holidays = {
    '01-01': ['元日', '新年を祝う国民の祝日'],
    '01-02': ['初夢の日', '一年で最初に見る夢を大切にする日'],
    '01-07': ['人日の節句（七草の日）', '七草粥を食べて無病息災を祈る日'],
    '01-11': ['鏡開き', 'お正月に飾った鏡餅を食べる日'],
    '02-03': ['節分', '豆まきをして邪気を払う日'],
    '02-11': ['建国記念の日', '建国をしのび、国を愛する心を養う'],
    '02-14': ['バレンタインデー', '愛を伝える日'],
    '03-03': ['ひな祭り（桃の節句）', '女の子の健やかな成長を祈る日'],
    '03-14': ['ホワイトデー', 'バレンタインのお返しをする日'],
    '04-01': ['エイプリルフール', 'harmlessな嘘をついても良い日'],
    '04-29': ['昭和の日', '激動の日々を経て、復興を遂げた昭和の時代を顧み、国の将来に思いをいたす'],
    '05-03': ['憲法記念日', '日本国憲法の施行を記念し、国の成長を期する'],
    '05-04': ['みどりの日', '自然に親しむとともにその恩恵に感謝し、豊かな心をはぐくむ'],
    '05-05': ['こどもの日', 'こどもの人格を重んじ、こどもの幸福をはかるとともに、母に感謝する'],
    '05-08': ['母の日（第2日曜日）', '母への感謝を表す日'],
    '06-19': ['父の日（第3日曜日）', '父への感謝を表す日'],
    '07-07': ['七夕', '織姫と彦星が年に一度会える日、願い事をする日'],
    '08-11': ['山の日', '山に親しむ機会を得て、山の恩恵に感謝する'],
    '09-15': ['敬老の日（第3月曜日）', '多年にわたり社会につくしてきた老人を敬愛し、長寿を祝う'],
    '10-10': ['体育の日（スポーツの日）', 'スポーツにしたしみ、健康な心身をつちかう'],
    '10-31': ['ハロウィン', '仮装を楽しむ日'],
    '11-03': ['文化の日', '自由と平和を愛し、文化をすすめる'],
    '11-15': ['七五三', '3歳・5歳・7歳の子どもの成長を祝う日'],
    '11-23': ['勤労感謝の日', '勤労をたっとび、生産を祝い、国民たがいに感謝しあう'],
    '12-24': ['クリスマスイブ', 'クリスマス前夜'],
    '12-25': ['クリスマス', 'イエス・キリストの降誕を祝う日'],
    '12-31': ['大晦日', '一年の最後の日、年越しの準備をする日']
};

// 毎月の記念日
const monthlyEvents = {
    1: ['お正月月間', '成人の日'],
    2: ['節分月間', '梅の開花時期'],
    3: ['卒業・卒園シーズン', '桜の開花時期'],
    4: ['入学・入社シーズン', '新年度スタート'],
    5: ['ゴールデンウィーク', '新緑の季節'],
    6: ['梅雨シーズン', '父の日月間'],
    7: ['夏休みシーズン', '七夕月間'],
    8: ['お盆シーズン', '夏祭りシーズン'],
    9: ['秋の始まり', '敬老の日月間'],
    10: ['紅葉シーズン', 'ハロウィン月間'],
    11: ['秋の深まり', '七五三シーズン'],
    12: ['師走', 'クリスマス・年末シーズン']
};

// DOM要素の取得
const dateInput = document.getElementById('date-input');
const searchBtn = document.getElementById('search-btn');
const resultSection = document.getElementById('result-section');
const dateDisplay = document.getElementById('date-display');
const eventsList = document.getElementById('events-list');
const loading = document.getElementById('loading');

// 今日の日付をデフォルトに設定
dateInput.value = new Date().toISOString().split('T')[0];

// 検索ボタンのイベントリスナー
searchBtn.addEventListener('click', searchDate);
dateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchDate();
    }
});

function searchDate() {
    const selectedDate = dateInput.value;
    if (!selectedDate) {
        alert('日付を選択してください');
        return;
    }

    showLoading();
    
    // 少し待ってからリアルな検索感を演出
    setTimeout(() => {
        displayResults(selectedDate);
        hideLoading();
    }, 800);
}

function showLoading() {
    loading.style.display = 'block';
    resultSection.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    resultSection.style.display = 'block';
}

function displayResults(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthDay = String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    
    // 日付の表示
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const formattedDate = date.toLocaleDateString('ja-JP', options);
    dateDisplay.textContent = formattedDate;
    
    // イベントリストをクリア
    eventsList.innerHTML = '';
    
    let eventsFound = false;
    
    // 特定の日付のイベントを検索
    if (holidays[monthDay]) {
        eventsFound = true;
        const [title, description] = holidays[monthDay];
        addEventItem(title, description, '🎌');
    }
    
    // 月のイベントを追加
    if (monthlyEvents[month]) {
        eventsFound = true;
        monthlyEvents[month].forEach(event => {
            addEventItem(event, `${month}月の特徴的なイベント・季節です`, '📅');
        });
    }
    
    // 曜日に基づくイベント
    const weekday = date.getDay();
    const weekdayEvents = getWeekdayEvents(weekday);
    if (weekdayEvents.length > 0) {
        eventsFound = true;
        weekdayEvents.forEach(event => {
            addEventItem(event.title, event.description, '📆');
        });
    }
    
    // 季節のイベント
    const seasonEvent = getSeasonEvent(month);
    if (seasonEvent) {
        eventsFound = true;
        addEventItem(seasonEvent.title, seasonEvent.description, '🌸');
    }
    
    // イベントが見つからない場合
    if (!eventsFound) {
        addEventItem('特別なイベントはありません', 'この日は特別な記念日ではありませんが、きっと素敵な一日になりますよ！', '✨');
    }
    
    // ランダムな豆知識を追加
    addRandomFact(month, day);
}

function addEventItem(title, description, icon = '🎉') {
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    
    eventItem.innerHTML = `
        <div class="event-title">${icon} ${title}</div>
        <div class="event-description">${description}</div>
    `;
    
    eventsList.appendChild(eventItem);
}

function getWeekdayEvents(weekday) {
    const weekdayNames = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
    const events = [];
    
    if (weekday === 0) { // 日曜日
        events.push({
            title: '日曜日',
            description: '週末のリラックスタイム。家族や友人と過ごしたり、趣味を楽しんだりする日です。'
        });
    } else if (weekday === 6) { // 土曜日
        events.push({
            title: '土曜日',
            description: '週末の始まり。お出かけやアクティビティを楽しむのに最適な日です。'
        });
    } else if (weekday === 1) { // 月曜日
        events.push({
            title: '月曜日',
            description: '新しい週の始まり。フレッシュな気持ちで一週間をスタートしましょう！'
        });
    }
    
    return events;
}

function getSeasonEvent(month) {
    if (month >= 3 && month <= 5) {
        return {
            title: '春の季節',
            description: '新緑が美しく、新しい出会いや始まりの季節です。桜や花々が咲き誇ります。'
        };
    } else if (month >= 6 && month <= 8) {
        return {
            title: '夏の季節',
            description: '暑い日が続きますが、夏祭りや花火大会など楽しいイベントがたくさんあります。'
        };
    } else if (month >= 9 && month <= 11) {
        return {
            title: '秋の季節',
            description: '紅葉が美しく、食べ物が美味しい季節です。読書や芸術に親しむのにも良い時期です。'
        };
    } else {
        return {
            title: '冬の季節',
            description: '寒い日が続きますが、雪景色やイルミネーションが美しい季節です。温かい食べ物が恋しくなります。'
        };
    }
}

function addRandomFact(month, day) {
    const facts = [
        '今日は新しいことにチャレンジするのに良い日です',
        '今日は大切な人に感謝の気持ちを伝えてみませんか',
        '今日は自分を労わる時間を作ってみましょう',
        '今日は美味しいものを食べて幸せを感じる日です',
        '今日は自然に触れてリフレッシュしてみませんか',
        '今日は読書や学習に集中するのに良い日です',
        '今日は友人や家族と過ごす時間を大切にしましょう',
        '今日は創作活動や趣味に時間を使ってみませんか'
    ];
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    addEventItem('今日のメッセージ', randomFact, '💫');
}

// ページ読み込み時に今日の情報を表示
window.addEventListener('load', () => {
    searchDate();
});