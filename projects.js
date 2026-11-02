// Curated from public repository READMEs, reviewed 2026-11-02.
// Descriptions distinguish implemented features from future plans.
const portfolioProjects = Object.freeze([
  {
    slug: 'life-dev-lab-course', category: 'teaching', label: '教學教材',
    title: '生活開發實驗室', subtitle: '從生活問題，走到可交付的產品。',
    description: '以個人行事曆為主題的八堂任務式教材，串起 Git、AI 協作、雲端資料與部署，讓初學者透過實作累積開發經驗。',
    tags: ['Git / GitHub', 'AI Coding', '雲端應用'], symbol: '01',
    detail: '教材包含本機行事曆、刻意設計的除錯練習、學習單與教師指引；進階路線需要自行設定雲端服務。八堂課是教材規劃，並非已開課的紀錄。',
    demo: { label: '開啟互動教材', url: 'https://life-development-lab.vercel.app/#/tasks/0' }
  },
  {
    slug: 'nfc-card-teaching-kit', category: 'teaching', label: '教學教材',
    title: 'NFC 數位名片教學套件', subtitle: '讓一張名片，成為認識彼此的入口。',
    description: '用靜態 HTML、CSS 與原生 JavaScript 製作個人數位名片，搭配教師教案、學生講義與學習單，連結網頁與 NFC 標籤。',
    tags: ['HTML / CSS / JS', 'NFC', 'vCard'], symbol: '02',
    detail: '提供 180 分鐘教案與 120 分鐘精簡版，名片範本可下載中文 vCard 聯絡人。實體 NFC 讀寫與手機通訊錄匯入仍須使用實際設備驗收。'
  },
  {
    slug: 'AI-grades-register', category: 'tools', label: '應用工具',
    title: '語音成績登記工具', subtitle: '把重複登記，交給語音與自動化。',
    description: '從科目小老師登記考卷成績的需求出發，以語音辨識取得分數，透過 Google Sheets API 寫入雲端試算表。',
    tags: ['Python', 'SpeechRecognition', 'Google Sheets API'], symbol: '03',
    detail: '目前 README 描述的 MVP 為即時語音辨識與成績寫入；影像辨識、自訓模型與工具網站屬於未來計畫。',
    demo: { label: '觀看操作影片', url: 'https://youtu.be/ICIQxyWSBdY' }
  },
  {
    slug: 'discord_bot', category: 'tools', label: '應用工具',
    title: 'Discord Bot', subtitle: '從聊天平台，練習模組化開發。',
    description: '以 Python 製作的 Discord 機器人專案，透過指令集與擴充模組組織功能，探索聊天工具與自動化應用。',
    tags: ['Python', 'Discord Bot', '模組化'], symbol: '04',
    detail: 'README 列出啟動核心、指令集、擴充模組、圖片處理與日曆記事等程式結構。展示的是原始碼專案，沒有宣稱提供持續在線的機器人服務。'
  },
  {
    slug: 'personal-website', category: 'web', label: '網頁作品',
    title: '在山野與程式之間', subtitle: '一個持續生長的個人網站。',
    description: '整理技術實作、共學與登山日常，以響應式版面、Canvas 山形動畫與 JavaScript 作品篩選，呈現自己的不同面向。',
    tags: ['JavaScript', 'Canvas', '響應式設計'], symbol: '05',
    detail: '使用原生 JavaScript 依資料渲染作品，搭配捲動進場與閱讀進度。減少動態效果設定會停用動畫；不執行 JavaScript 時仍可閱讀主要內容與作品連結。'
  }
]);
