const state = {
  lang: 'zh', page: 'overview', csrf: '', me: null, market: [], meta: null,
  selected: null, tradeSide: 'buy', authMode: 'login', marketFilter: 'all', search: '',
  announcements: [], lessons: [], leaderboard: [], orders: [], watchQuotes: [],
  completed: [], adminSummary: null
};

const I18N = {
  zh: {
    workspace:'工作區',accountRoleAdmin:'管理員',accountRolePaper:'虛擬模擬帳戶',paperTradingTaiwan:'台股模擬交易',practiceAccount:'練習帳戶',platformUpdates:'平台更新',chooseNext:'選擇下一步',marketOverview:'市場總覽',yourPaperAccount:'我的模擬帳戶',yourList:'我的清單',paperExecutions:'模擬成交紀錄',learnPracticeRepeat:'學習・練習・複習',community:'社群排行',platform:'平台',controlCenter:'控制中心',registeredAccounts:'註冊會員',platformMessages:'平台公告',learningContent:'教學內容',paperOrders:'模擬委託',administratorAccessRequired:'此功能僅限管理員使用。',published:'已發布',draft:'草稿',positions:'個部位',basedOnMarketValue:'依目前市值計算',educationalDisclaimer:'教育用途聲明',paperOrder:'模擬委託',accountMenu:'帳戶選單',openMenu:'開啟選單',close:'關閉',paperTradingPlatform:'模擬交易平台',virtualFundsOnly:'100% 虛擬資金',lessonMarkdownHint:'支援純文字與簡單 Markdown 格式…',englishLessonHint:'英文教學內容（選填）…',new:'新功能',officialMarketNote:'官方公開資料為收盤資訊，並非盤中即時報價。',demoMarketNote:'官方行情來源暫時無法連線；目前僅顯示示範資料，並非真實報價。',memberRole:'會員',overview:'總覽',markets:'市場行情',portfolio:'投資組合',orders:'交易紀錄',watchlist:'自選清單',discover:'探索',learn:'投資學院',leaderboard:'排行榜',announcements:'平台公告',admin:'管理後台',paperMode:'模擬交易模式',guest:'訪客',signInToSave:'登入以保存進度',taiwanMarket:'台灣市場',login:'登入',logout:'登出',footerNote:'教育與模擬用途，不構成投資建議。',
    welcome:'歡迎來到 TWEN Trade',welcomeSub:'用虛擬資金熟悉股票與 ETF，從理解市場開始。',startLearning:'開始學習',exploreMarket:'探索市場',register:'建立免費帳號',portfolioValue:'總資產',cashBalance:'可用現金',marketValue:'持倉市值',totalReturn:'累計報酬',startingCash:'初始虛擬本金 NT$1,000,000',fromStart:'相較初始本金',marketWatch:'市場焦點',viewAll:'查看全部',quickStart:'快速開始',quickTrade:'模擬下單',quickTradeSub:'用虛擬資金練習買賣',myPortfolio:'我的投資組合',myPortfolioSub:'查看持倉與損益',learnBasics:'從零開始學投資',learnBasicsSub:'用淺顯內容理解股票與 ETF',latestNews:'最新公告',noAnnouncements:'目前沒有公告。',englishTitleOptional:'英文標題（選填）',englishBodyOptional:'英文內容（選填）',englishCategoryOptional:'英文分類（選填）',englishDurationOptional:'英文閱讀時間（選填）',
    marketTitle:'市場行情',marketSub:'瀏覽台灣上市、上櫃股票與 ETF。行情來源會清楚標示，非盤中即時報價。',searchPlaceholder:'搜尋代號或名稱…',all:'全部',stocks:'股票',etfs:'ETF',symbol:'代號',company:'商品',lastPrice:'收盤價',change:'漲跌',volume:'成交量',market:'市場',action:'操作',watch:'加入自選',unwatch:'移除自選',trade:'交易',officialSource:'官方公開收盤資料',demoSource:'示範資料',notRealtime:'非即時',
    portfolioTitle:'投資組合',portfolioSub:'追蹤你的虛擬持倉、可用現金與損益。',equity:'總資產',cash:'可用現金',invested:'持倉市值',unrealized:'未實現損益',realized:'已實現損益',holdings:'目前持倉',allocation:'資產配置',noHoldings:'尚未持有任何商品。可到市場行情選擇商品練習模擬交易。',
    ordersTitle:'交易紀錄',ordersSub:'檢視已成交與等待條件觸發的模擬委託。',date:'時間',side:'方向',quantity:'股數',orderType:'委託類型',status:'狀態',buy:'買進',sell:'賣出',filled:'已成交',pending:'等待中',cancelled:'已取消',cancel:'取消',noOrders:'目前沒有交易紀錄。',marketOrder:'市價單',limitOrder:'限價單',
    watchlistTitle:'自選清單',watchlistSub:'將想觀察的股票與 ETF 集中在這裡。',emptyWatch:'自選清單目前是空的。到市場行情點擊星號即可加入。',
    learnTitle:'投資學院',learnSub:'從股票、ETF 到風險管理，循序建立市場基礎。',courseProgress:'學習進度',lessons:'堂課',completed:'已完成',continueLearning:'繼續閱讀',markComplete:'標記為已完成',lessonDisclaimer:'本教學僅供金融教育與知識理解，不構成投資建議、推薦或招攬。教學內容可能不完整或未即時更新。請勿僅依據本教學進行任何真實投資決策。使用者若將教學內容用於真實市場交易，應自行查證並承擔相關決策責任；本平台不提供券商服務，也不會代為執行真實交易。',
    leaderboardTitle:'模擬排行',leaderboardSub:'依照虛擬資產總值排列。排行榜只顯示平台暱稱，不代表投資能力或未來績效。',rank:'排名',player:'使用者',totalAssets:'總資產',return:'報酬率',
    announcementsTitle:'平台公告',announcementsSub:'平台更新、行情資料狀態與活動資訊。',
    adminTitle:'管理後台',adminSub:'管理平台公告與投資學院教學內容。',users:'會員數',announcementCount:'公告數',lessonCount:'課程數',orderCount:'委託數',createAnnouncement:'發布公告',announcementTitle:'公告標題',announcementBody:'公告內容',level:'公告類型',info:'一般',success:'更新',warning:'注意',urgent:'重要',publish:'發布',createLesson:'建立教學',lessonTitle:'課程標題',category:'分類',difficulty:'難度',lessonBody:'教學內容',duration:'閱讀時間',lessonImage:'教學圖片（選填）',saveLesson:'建立課程',manageContent:'內容管理',
    authTitle:'開始你的模擬投資旅程',authSub:'建立帳號後即可保存虛擬資產、交易紀錄與學習進度。',username:'帳號',email:'Email（選填）',password:'密碼',loginTab:'登入',registerTab:'註冊',loginNow:'登入平台',registerNow:'建立帳號',passwordHint:'至少 8 個字元。',
    tradeTitle:'模擬交易',tradeSub:'此為虛擬委託，不會連接或送出至任何券商。',referencePrice:'參考收盤價',tradeDirection:'交易方向',shares:'股數',limitPrice:'限價',estimatedTotal:'預估金額',estimatedFee:'預估手續費',disclaimerCheck:'我了解這是使用虛擬資金的模擬交易，不是真實券商委託；行情可能延遲或為示範資料。',confirmTrade:'確認模擬下單',tradeSuccess:'模擬委託已送出。',
    error:'發生錯誤',successToast:'完成',loading:'載入中…',retry:'重新載入',save:'儲存',delete:'刪除',cancelAction:'取消',noData:'目前沒有資料。',
    marketCaution:'行情僅供模擬練習。官方公開資料為收盤資訊、可能延遲；若顯示示範資料，絕非真實報價。',guestNotice:'登入後即可保存你的虛擬資產與學習進度。',loginRequired:'請先登入以使用此功能。',marketLabel:'市場資料',lastUpdate:'資料日期',
  },
  en: {
    workspace:'WORKSPACE',accountRoleAdmin:'Administrator',accountRolePaper:'Paper account',paperTradingTaiwan:'Taiwan paper trading',practiceAccount:'Practice account',platformUpdates:'Platform updates',chooseNext:'Choose where to go next',marketOverview:'Market overview',yourPaperAccount:'Your paper account',yourList:'Your watchlist',paperExecutions:'Paper executions',learnPracticeRepeat:'Learn · Practice · Repeat',community:'Community',platform:'Platform',controlCenter:'Control center',registeredAccounts:'Registered accounts',platformMessages:'Platform messages',learningContent:'Learning content',paperOrders:'Paper orders',administratorAccessRequired:'Administrator access required.',published:'Published',draft:'Draft',positions:'positions',basedOnMarketValue:'Based on current market value',educationalDisclaimer:'Educational disclaimer',paperOrder:'Paper order',accountMenu:'Account menu',openMenu:'Open menu',close:'Close',paperTradingPlatform:'Paper trading platform',virtualFundsOnly:'100% virtual funds',lessonMarkdownHint:'Plain text and simple Markdown are supported…',englishLessonHint:'English lesson content (optional)…',new:'NEW',officialMarketNote:'Official public feeds provide closing data, not intraday real-time quotes.',demoMarketNote:'Official feeds are temporarily unavailable; the displayed sample data is not a real quote.',memberRole:'Member',overview:'Overview',markets:'Markets',portfolio:'Portfolio',orders:'Orders',watchlist:'Watchlist',discover:'DISCOVER',learn:'Learn',leaderboard:'Leaderboard',announcements:'Announcements',admin:'Admin',paperMode:'Paper trading mode',guest:'Guest',signInToSave:'Sign in to save progress',taiwanMarket:'Taiwan market',login:'Sign in',logout:'Sign out',footerNote:'For education and simulation only. Not investment advice.',
    welcome:'Welcome to TWEN Trade',welcomeSub:'Learn stocks and ETFs with virtual funds. Start by understanding the market.',startLearning:'Start learning',exploreMarket:'Explore markets',register:'Create free account',portfolioValue:'Total equity',cashBalance:'Cash available',marketValue:'Position value',totalReturn:'Total return',startingCash:'NT$1,000,000 virtual starting capital',fromStart:'Since starting',marketWatch:'Market highlights',viewAll:'View all',quickStart:'Quick start',quickTrade:'Paper trade',quickTradeSub:'Practice with virtual funds',myPortfolio:'My portfolio',myPortfolioSub:'Positions and P/L',learnBasics:'Learn investing from zero',learnBasicsSub:'Understand stocks and ETFs in plain language',latestNews:'Latest announcements',noAnnouncements:'No announcements yet.',englishTitleOptional:'English title (optional)',englishBodyOptional:'English content (optional)',englishCategoryOptional:'English category (optional)',englishDurationOptional:'English reading time (optional)',
    marketTitle:'Markets',marketSub:'Browse Taiwan listed and OTC stocks and ETFs. Data sources are labelled; quotes are not intraday real-time.',searchPlaceholder:'Search ticker or name…',all:'All',stocks:'Stocks',etfs:'ETFs',symbol:'Symbol',company:'Instrument',lastPrice:'Close',change:'Change',volume:'Volume',market:'Market',action:'Action',watch:'Add to watchlist',unwatch:'Remove from watchlist',trade:'Trade',officialSource:'Official public closing data',demoSource:'Demo data',notRealtime:'Not real-time',
    portfolioTitle:'Portfolio',portfolioSub:'Track your virtual holdings, available cash and P/L.',equity:'Total equity',cash:'Cash',invested:'Market value',unrealized:'Unrealized P/L',realized:'Realized P/L',holdings:'Holdings',allocation:'Allocation',noHoldings:'No holdings yet. Visit Markets to practice a paper trade.',
    ordersTitle:'Order history',ordersSub:'Review filled and pending simulated orders.',date:'Date',side:'Side',quantity:'Shares',orderType:'Type',status:'Status',buy:'Buy',sell:'Sell',filled:'Filled',pending:'Pending',cancelled:'Cancelled',cancel:'Cancel',noOrders:'No orders yet.',marketOrder:'Market',limitOrder:'Limit',
    watchlistTitle:'Watchlist',watchlistSub:'Keep the instruments you want to follow in one place.',emptyWatch:'Your watchlist is empty. Add instruments from Markets using the star icon.',
    learnTitle:'Learning center',learnSub:'Build market fundamentals, from stocks and ETFs to risk management.',courseProgress:'Learning progress',lessons:'lessons',completed:'Completed',continueLearning:'Continue reading',markComplete:'Mark as completed',lessonDisclaimer:'This material is for financial education and general knowledge only. It is not investment advice, a recommendation, solicitation or a complete, continuously updated source. Do not make real investment decisions solely on this material. Anyone applying it to real-market activity must independently verify information and assume responsibility for their decisions. This platform does not provide brokerage services or execute real trades.',
    leaderboardTitle:'Paper trading leaderboard',leaderboardSub:'Ranked by virtual equity. Display names only; results do not indicate skill or future performance.',rank:'Rank',player:'Player',totalAssets:'Equity',return:'Return',
    announcementsTitle:'Announcements',announcementsSub:'Platform updates, market-data status and notices.',
    adminTitle:'Admin console',adminSub:'Manage platform announcements and learning content.',users:'Members',announcementCount:'Announcements',lessonCount:'Lessons',orderCount:'Orders',createAnnouncement:'Publish announcement',announcementTitle:'Title',announcementBody:'Message',level:'Type',info:'General',success:'Update',warning:'Notice',urgent:'Important',publish:'Publish',createLesson:'Create lesson',lessonTitle:'Lesson title',category:'Category',difficulty:'Level',lessonBody:'Lesson content',duration:'Reading time',lessonImage:'Lesson image (optional)',saveLesson:'Create lesson',manageContent:'Manage content',
    authTitle:'Start your paper trading journey',authSub:'Create an account to save virtual assets, orders and learning progress.',username:'Username',email:'Email (optional)',password:'Password',loginTab:'Sign in',registerTab:'Register',loginNow:'Sign in',registerNow:'Create account',passwordHint:'At least 8 characters.',
    tradeTitle:'Paper trade',tradeSub:'This is a virtual order. It is never sent to a broker.',referencePrice:'Reference close',tradeDirection:'Side',shares:'Shares',limitPrice:'Limit price',estimatedTotal:'Estimated total',estimatedFee:'Estimated commission',disclaimerCheck:'I understand this is a virtual paper trade, not a real brokerage order; prices may be delayed or demo data.',confirmTrade:'Confirm paper order',tradeSuccess:'Paper order submitted.',
    error:'Something went wrong',successToast:'Done',loading:'Loading…',retry:'Reload',save:'Save',delete:'Delete',cancelAction:'Cancel',noData:'No data yet.',
    marketCaution:'Quotes are for simulation only. Official public feeds provide closing data and may be delayed; demo data is never a real quote.',guestNotice:'Sign in to save your virtual portfolio and learning progress.',loginRequired:'Please sign in to use this feature.',marketLabel:'Market data',lastUpdate:'Data date',
  }
};
const t = key => (I18N[state.lang] && I18N[state.lang][key]) || I18N.zh[key] || key;
const localized = (item, zhKey, enKey) => state.lang === 'en' && item?.[enKey] ? item[enKey] : (item?.[zhKey] || '');
const lessonTitle = l => localized(l,'title','title_en');
const lessonBody = l => localized(l,'body','body_en');
const lessonCategory = l => localized(l,'category','category_en');
const lessonDuration = l => localized(l,'duration','duration_en');
const announcementTitle = a => localized(a,'title','title_en');
const announcementBody = a => localized(a,'body','body_en');
const marketName = m => state.lang==='en' ? (m==='上市'?'Listed':m==='上櫃'?'OTC':m) : m;
const categoryName = c => state.lang==='en' ? (c==='股票'?'Stock':c) : c;
const roleName = r => r==='admin' ? t('accountRoleAdmin') : t('memberRole');
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => 'NT$' + Number(n || 0).toLocaleString(state.lang === 'zh' ? 'zh-TW' : 'en-US', {maximumFractionDigits:2});
const num = n => Number(n || 0).toLocaleString(state.lang === 'zh' ? 'zh-TW' : 'en-US', {maximumFractionDigits:2});
const pct = n => `${Number(n || 0) > 0 ? '+' : ''}${Number(n || 0).toFixed(2)}%`;
const colorClass = n => Number(n) > 0 ? 'positive' : Number(n) < 0 ? 'negative' : 'neutral';
const fmtDate = value => { if(!value) return '—'; const d = new Date(value); return Number.isNaN(d.getTime()) ? esc(value) : d.toLocaleString(state.lang==='zh'?'zh-TW':'en-US',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}); };
const markdown = value => esc(value).replace(/^### (.*)$/gm,'<h3>$1</h3>').replace(/^## (.*)$/gm,'<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');

async function api(path, options={}) {
  const headers = {...(options.headers || {})};
  if (state.csrf && !['GET','HEAD'].includes((options.method || 'GET').toUpperCase())) headers['x-csrf-token'] = state.csrf;
  if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const response = await fetch(path,{credentials:'same-origin',...options,headers});
  const data = await response.json().catch(()=>({detail:'Unexpected server response'}));
  if (!response.ok) throw new Error(data.detail || `HTTP ${response.status}`);
  return data;
}
function toast(message, type='info') {
  const el=document.createElement('div'); el.className=`toast ${type}`; el.textContent=message;
  $('#toastStack').appendChild(el); setTimeout(()=>el.classList.add('show'),10); setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),240)},3200);
}
function showModal(html) { $('#modalContent').innerHTML=html; $('#modalBackdrop').classList.remove('hidden'); document.body.style.overflow='hidden'; }
function closeModal() { $('#modalBackdrop').classList.add('hidden'); document.body.style.overflow=''; }
function setPage(page) {
  state.page=page; $$('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.page===page)); $$('#mobileBottomNav button').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
  $('#pageHeading').textContent=t(({overview:'overview',markets:'markets',portfolio:'portfolio',orders:'orders',watchlist:'watchlist',learn:'learn',leaderboard:'leaderboard',announcements:'announcements',admin:'admin'})[page] || 'overview');
  $('#sidebar').classList.remove('open'); renderPage();
}
function updateLang() {
  document.documentElement.lang=state.lang==='zh'?'zh-Hant':'en';
  $$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(t(key))el.textContent=t(key)});
  $('#langToggle').textContent=state.lang==='zh'?'EN':'繁中';
  updateMarketNotice();
  $$('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
  $$('[data-i18n-title]').forEach(el=>el.setAttribute('title',t(el.dataset.i18nTitle)));
  document.title = state.lang==='zh' ? 'TWEN Trade — 台股模擬交易' : 'TWEN Trade — Paper Trading';
  $('#pageHeading').textContent=t(state.page);
  renderPage();
}
function updateUserShell() {
  const logged=!!state.me;
  $('#topLogin').textContent=logged?t('logout'):t('login');
  $('.sidebar-user-copy b').textContent=logged?state.me.user.username:t('guest');
  $('.sidebar-user-copy small').textContent=logged?(state.me.user.role==='admin'?t('accountRoleAdmin'):t('accountRolePaper')):t('signInToSave');
  $('.avatar').textContent=logged?state.me.user.username.slice(0,1).toUpperCase():'G';
  $$('.admin-only').forEach(el=>el.classList.toggle('hidden',!logged||state.me.user.role!=='admin'));
}
function updateMarketNotice() {
  if(!state.meta)return;
  $('#marketDate').textContent=state.meta.market_date || '—';
  const demo=state.meta.is_demo;
  $('#marketNotice').classList.toggle('demo-notice',!!demo);
  $('#marketNoticeText').textContent = demo ? `${t('demoSource')} · ${t('demoMarketNote')}` : `${t('officialSource')} · ${t('officialMarketNote')}`;
}
async function init() {
  try {
    const b=await api('/api/bootstrap'); state.csrf=b.csrf; state.meta=b.market; state.announcements=b.announcements||[]; updateMarketNotice();
  } catch(e){ console.warn(e); }
  await loadMarket();
  await loadMe();
  updateLang(); updateUserShell(); setPage('overview');
}
async function loadMarket(force=false) {
  try {
    const data=await api(`/api/market?force=${force?'true':'false'}`); state.market=data.quotes||[]; state.meta=data.meta; updateMarketNotice();
  } catch(e){ toast(e.message,'error'); }
}
async function loadMe() {
  try { state.me=await api('/api/me'); state.orders=state.me.orders||[]; state.completed=state.me.completed_lessons||[]; updateUserShell(); }
  catch(e){ if(!String(e.message).includes('請先登入')&&!String(e.message).includes('Please sign in')) console.warn(e); state.me=null; updateUserShell(); }
}
function requireLogin() { if(!state.me){openAuth('login');toast(t('loginRequired'),'info');return false;} return true; }
function pageHeader(title, subtitle, eyebrow='TWEN TRADE') {return `<div class="page-heading-row"><div><div class="eyebrow">${esc(eyebrow)}</div><h1 class="page-title">${esc(title)}</h1><p class="page-subtitle">${esc(subtitle)}</p></div></div>`;}
function statCard(label,value,foot,icon='◈',klass='') {return `<div class="card stat-card"><div class="stat-label"><span>${icon}</span>${esc(label)}</div><div class="stat-value ${klass}">${value}</div><div class="stat-foot">${foot}</div></div>`;}
function assetIcon(q){return `<span class="asset-icon">${esc(q.symbol.slice(0,4))}</span>`;}
function quoteRows(quotes, showWatch=true) {
  if(!quotes.length)return `<tr><td colspan="7"><div class="empty-state">${t('noData')}</div></td></tr>`;
  const watch=state.me?.watchlist||[];
  return quotes.map(q=>`<tr>
    <td><div class="asset-cell">${assetIcon(q)}<div class="asset-name"><b>${esc(q.name)}</b><small>${esc(q.symbol)} · ${esc(marketName(q.market))}</small></div></div></td>
    <td class="price">${money(q.price)}</td><td class="change ${colorClass(q.change)}">${q.change>0?'+':''}${num(q.change)} <small>(${pct(q.change_pct)})</small></td>
    <td>${num(q.volume)}</td><td><span class="tag ${q.category==='ETF'?'etf':'stock'}">${esc(categoryName(q.category))}</span></td>
    <td><div class="table-actions">${showWatch?`<button class="watch-star ${watch.includes(q.symbol)?'active':''}" data-action="watch" data-symbol="${esc(q.symbol)}" title="${watch.includes(q.symbol)?t('unwatch'):t('watch')}">${watch.includes(q.symbol)?'★':'☆'}</button>`:''}<button class="button-secondary button-small" data-action="open-stock" data-symbol="${esc(q.symbol)}">${t('trade')}</button></div></td>
  </tr>`).join('');
}
function marketTable(quotes, compact=false) {return `<div class="card market-table-card"><div class="table-wrap"><table><thead><tr><th>${t('company')}</th><th>${t('lastPrice')}</th><th>${t('change')}</th><th>${t('volume')}</th><th>${t('market')}</th><th>${t('action')}</th></tr></thead><tbody>${quoteRows(compact?quotes.slice(0,6):quotes)}</tbody></table></div></div>`;}
function announcementList(items) {if(!items.length)return `<div class="empty-state">${t('noAnnouncements')}</div>`;return items.map(a=>`<div class="announcement-item"><div class="announcement-top"><b>${esc(announcementTitle(a))}</b><time>${fmtDate(a.created_at)}</time></div><p>${esc(announcementBody(a))}</p></div>`).join('');}
function renderOverview() {
  const p=state.me?.portfolio;
  const balance=p?money(p.equity):'NT$1,000,000';
  const cash=p?money(p.cash):'NT$1,000,000';
  const value=p?money(p.market_value):'NT$0';
  const ret=p?`${pct(p.total_pnl_pct)}`:'0.00%';
  const returnClass=p?colorClass(p.total_pnl):'neutral';
  const items=state.market.slice().sort((a,b)=>Math.abs(b.change_pct)-Math.abs(a.change_pct)).slice(0,6);
  const authCta=state.me?`<button class="button-primary" data-action="go-markets">${t('exploreMarket')} ↗</button>`:`<button class="button-primary" data-action="auth-register">${t('register')} ↗</button>`;
  return `${pageHeader(t('welcome'),t('welcomeSub'),t('paperTradingTaiwan'))}
    <div class="stats-grid grid">
      ${statCard(t('portfolioValue'),balance,`<span class="stat-chip">TWD</span> ${t('startingCash')}`,'◈')}
      ${statCard(t('cashBalance'),cash,`<span>${t('cash')}</span>`,'＄')}
      ${statCard(t('marketValue'),value,`<span>${t('invested')}</span>`,'▤')}
      ${statCard(t('totalReturn'),ret,`<span>${t('fromStart')}</span>`, '↗', returnClass)}
    </div>
    ${!state.me?`<div class="card" style="margin-bottom:17px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap"><div><div class="eyebrow">${t('practiceAccount')}</div><b style="font-size:14px">${t('guestNotice')}</b><p class="page-subtitle">${t('startingCash')}</p></div>${authCta}</div>`:''}
    <div class="content-grid grid">
      <div class="grid">
        <section class="card"><div class="card-head"><div><h2 class="card-title">${t('marketWatch')}</h2><div class="card-subtitle">${esc(state.meta?.market_date||'')}</div></div><button class="text-link" data-page="markets">${t('viewAll')} ↗</button></div>
          <div class="table-wrap"><table><thead><tr><th>${t('company')}</th><th>${t('lastPrice')}</th><th>${t('change')}</th><th>${t('market')}</th><th></th></tr></thead><tbody>${items.map(q=>`<tr><td><div class="asset-cell">${assetIcon(q)}<div class="asset-name"><b>${esc(q.name)}</b><small>${esc(q.symbol)}</small></div></div></td><td class="price">${money(q.price)}</td><td class="change ${colorClass(q.change)}">${pct(q.change_pct)}</td><td><span class="tag ${q.category==='ETF'?'etf':'stock'}">${categoryName(q.category)}</span></td><td><button class="button-secondary button-small" data-action="open-stock" data-symbol="${q.symbol}">${t('trade')}</button></td></tr>`).join('')}</tbody></table></div>
        </section>
        <section class="card"><div class="card-head"><div><h2 class="card-title">${t('latestNews')}</h2><div class="card-subtitle">${t('platformUpdates')}</div></div><button class="text-link" data-page="announcements">${t('viewAll')} ↗</button></div><div class="list-stack">${announcementList(state.announcements.slice(0,3))}</div></section>
      </div>
      <div class="grid">
        <section class="card"><div class="card-head"><div><h2 class="card-title">${t('quickStart')}</h2><div class="card-subtitle">${t('chooseNext')}</div></div></div><div class="quick-actions">
          <button class="quick-action" data-action="go-markets"><span class="quick-icon">⌁</span><b>${t('quickTrade')}</b><small>${t('quickTradeSub')}</small></button>
          <button class="quick-action" data-action="go-portfolio"><span class="quick-icon">▤</span><b>${t('myPortfolio')}</b><small>${t('myPortfolioSub')}</small></button>
          <button class="quick-action" data-action="go-learn"><span class="quick-icon">⌘</span><b>${t('learnBasics')}</b><small>${t('learnBasicsSub')}</small></button>
          <button class="quick-action" data-action="go-watchlist"><span class="quick-icon">☆</span><b>${t('watchlist')}</b><small>${t('watchlistSub')}</small></button>
        </div></section>
        <section class="card"><div class="card-head"><div><h2 class="card-title">${t('marketLabel')}</h2><div class="card-subtitle">${t('lastUpdate')}: ${esc(state.meta?.market_date||'—')}</div></div><span class="tag">${state.meta?.is_demo?t('demoSource'):t('officialSource')}</span></div><p class="muted" style="font-size:10px;line-height:1.9;margin:0">${t('marketCaution')}</p></section>
      </div>
    </div>`;
}
function renderMarkets() {
  const q=state.search.toLowerCase(); let quotes=state.market.filter(x=>!q||x.symbol.toLowerCase().includes(q)||x.name.toLowerCase().includes(q));
  if(state.marketFilter==='stock')quotes=quotes.filter(x=>x.category==='股票'); if(state.marketFilter==='etf')quotes=quotes.filter(x=>x.category==='ETF');
  return `${pageHeader(t('marketTitle'),t('marketSub'),t('marketOverview'))}
    <div class="market-toolbar"><div class="search-box"><span class="search-icon">⌕</span><input id="marketSearch" placeholder="${t('searchPlaceholder')}" value="${esc(state.search)}"></div><div class="filter-tabs"><button data-filter="all" class="${state.marketFilter==='all'?'active':''}">${t('all')}</button><button data-filter="stock" class="${state.marketFilter==='stock'?'active':''}">${t('stocks')}</button><button data-filter="etf" class="${state.marketFilter==='etf'?'active':''}">${t('etfs')}</button></div><button class="button-secondary" data-action="refresh-market">↻ ${t('retry')}</button></div>
    <div class="card" style="padding:11px 14px;margin-bottom:14px;display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="muted" style="font-size:10px">${state.meta?.is_demo?t('demoSource'):t('officialSource')} · ${esc(state.meta?.market_date||'')}</span><span class="tag">${t('notRealtime')}</span></div>${marketTable(quotes)}`;
}
function renderPortfolio() {
  if(!state.me)return `${pageHeader(t('portfolioTitle'),t('portfolioSub'))}<div class="card empty-state"><div class="empty-icon">▤</div>${t('loginRequired')}<br><br><button class="button-primary" data-action="auth-login">${t('login')}</button></div>`;
  const p=state.me.portfolio, holdings=p.holdings||[];
  const allocation=holdings.map(h=>({...h,share:p.market_value>0?h.market_value/p.market_value*100:0}));
  return `${pageHeader(t('portfolioTitle'),t('portfolioSub'),t('yourPaperAccount'))}
    <div class="stats-grid grid">${statCard(t('equity'),money(p.equity),t('startingCash'),'◈')}${statCard(t('cash'),money(p.cash),t('cashBalance'),'＄')}${statCard(t('invested'),money(p.market_value),t('marketValue'),'▤')}${statCard(t('unrealized'),money(p.unrealized_pnl),pct(p.total_pnl_pct), '↗',colorClass(p.unrealized_pnl))}</div>
    <div class="portfolio-layout"><section class="card holding-card"><div class="card-head"><div><h2 class="card-title">${t('holdings')}</h2><div class="card-subtitle">${holdings.length} ${t('positions')}</div></div><button class="button-primary button-small" data-action="go-markets">+ ${t('trade')}</button></div>${holdings.length?`<div class="table-wrap"><table><thead><tr><th>${t('company')}</th><th>${t('quantity')}</th><th>${t('lastPrice')}</th><th>${t('invested')}</th><th>${t('unrealized')}</th></tr></thead><tbody>${holdings.map(h=>`<tr><td><div class="asset-cell">${assetIcon(h)}<div class="asset-name"><b>${esc(h.name)}</b><small>${esc(h.symbol)}</small></div></div></td><td>${num(h.quantity)}</td><td class="price">${money(h.current_price)}</td><td>${money(h.market_value)}</td><td class="${colorClass(h.unrealized_pnl)}">${money(h.unrealized_pnl)}<small> (${pct(h.unrealized_pct)})</small></td></tr>`).join('')}</tbody></table></div>`:`<div class="empty-state"><div class="empty-icon">◌</div>${t('noHoldings')}</div>`}</section>
    <section class="card"><div class="card-head"><div><h2 class="card-title">${t('allocation')}</h2><div class="card-subtitle">${t('basedOnMarketValue')}</div></div></div>${allocation.length?`<div class="allocation">${allocation.sort((a,b)=>b.share-a.share).map(h=>`<div class="allocation-row"><span>${esc(h.symbol)}</span><div class="allocation-track"><div class="allocation-fill" style="width:${Math.max(1,h.share)}%"></div></div><b>${h.share.toFixed(1)}%</b></div>`).join('')}</div>`:`<div class="empty-state">${t('noData')}</div>`}<div class="divider" style="height:1px;background:#26364b;margin:18px 0"></div><div style="display:flex;justify-content:space-between;font-size:10px;color:#8ea1b8"><span>${t('realized')}</span><b class="${colorClass(p.realized_pnl)}">${money(p.realized_pnl)}</b></div></section></div>`;
}
function renderOrders() {
  if(!state.me)return `${pageHeader(t('ordersTitle'),t('ordersSub'))}<div class="card empty-state">${t('loginRequired')}<br><br><button class="button-primary" data-action="auth-login">${t('login')}</button></div>`;
  const orders=state.orders||[];
  return `${pageHeader(t('ordersTitle'),t('ordersSub'),t('paperExecutions'))}<section class="card market-table-card"><div class="table-wrap"><table><thead><tr><th>#</th><th>${t('date')}</th><th>${t('company')}</th><th>${t('side')}</th><th>${t('quantity')}</th><th>${t('lastPrice')}</th><th>${t('status')}</th><th></th></tr></thead><tbody>${orders.length?orders.map(o=>`<tr><td>${o.id}</td><td>${fmtDate(o.created_at)}</td><td><div class="asset-name"><b>${esc(o.name)}</b><small>${esc(o.symbol)}</small></div></td><td class="${o.side==='buy'?'negative':'positive'}">${o.side==='buy'?t('buy'):t('sell')}</td><td>${num(o.quantity)}</td><td class="price">${money(o.price)}</td><td><span class="tag ${o.status==='FILLED'?'filled':o.status==='PENDING'?'pending':''}">${o.status==='FILLED'?t('filled'):o.status==='PENDING'?t('pending'):t('cancelled')}</span></td><td>${o.status==='PENDING'?`<button class="button-danger button-small" data-action="cancel-order" data-id="${o.id}">${t('cancel')}</button>`:''}</td></tr>`).join(''):`<tr><td colspan="8"><div class="empty-state">${t('noOrders')}</div></td></tr>`}</tbody></table></div></section>`;
}
async function loadWatchlist(){if(!requireLogin())return;try{const d=await api('/api/watchlist');state.watchQuotes=d.quotes||[];}catch(e){toast(e.message,'error');}}
function renderWatchlist(){if(!state.me)return `${pageHeader(t('watchlistTitle'),t('watchlistSub'))}<div class="card empty-state">${t('loginRequired')}<br><br><button class="button-primary" data-action="auth-login">${t('login')}</button></div>`;return `${pageHeader(t('watchlistTitle'),t('watchlistSub'),t('yourList'))}<div class="market-toolbar"><div class="muted" style="font-size:10px">${state.watchQuotes.length} ${t('company')}</div><button class="button-secondary" data-action="go-markets">+ ${t('markets')}</button></div>${state.watchQuotes.length?marketTable(state.watchQuotes):`<div class="card empty-state"><div class="empty-icon">☆</div>${t('emptyWatch')}</div>`}`;}
async function loadLessons(){if(!requireLogin())return;try{const d=await api('/api/lessons');state.lessons=d.lessons||[];state.completed=d.lessons.filter(x=>x.completed).map(x=>x.id);}catch(e){toast(e.message,'error');}}
function renderLearn(){if(!state.me)return `${pageHeader(t('learnTitle'),t('learnSub'))}<div class="card empty-state"><div class="empty-icon">⌘</div>${t('loginRequired')}<br><br><button class="button-primary" data-action="auth-login">${t('login')}</button></div>`;const done=state.lessons.filter(l=>l.completed).length;const progress=state.lessons.length?done/state.lessons.length*100:0;return `${pageHeader(t('learnTitle'),t('learnSub'),t('learnPracticeRepeat'))}<section class="card" style="margin-bottom:16px"><div class="card-head"><div><h2 class="card-title">${t('courseProgress')}</h2><div class="card-subtitle">${done} / ${state.lessons.length} ${t('lessons')} ${t('completed')}</div></div><b class="accent">${progress.toFixed(0)}%</b></div><div class="lesson-progress"><span style="width:${progress}%"></span></div></section><div class="grid lesson-grid">${state.lessons.map((l,i)=>`<article class="card lesson-card" data-action="open-lesson" data-id="${l.id}"><div class="lesson-art">${l.image_path?`<img src="${esc(l.image_path)}" alt="" style="width:100%;height:100%;object-fit:cover">`:['◉','▥','⌁','↗','◇'][i%5]}</div><div class="lesson-body"><div class="lesson-meta"><span>${esc(lessonCategory(l))}</span><span>${l.completed?'✓ '+t('completed'):`${t('lessons')} ${l.level}`}</span></div><h3>${esc(lessonTitle(l))}</h3><p>${esc(lessonBody(l).slice(0,78))}${lessonBody(l).length>78?'…':''}</p><div class="lesson-meta"><span>${esc(lessonDuration(l))}</span><b class="accent">${l.completed?'✓':t('continueLearning')}</b></div></div></article>`).join('')}</div>`;}
function renderLeaderboard(){return `${pageHeader(t('leaderboardTitle'),t('leaderboardSub'),t('community')) }<section class="card"><div class="leader-row" style="color:#7589a1;font-size:9px"><b>${t('rank')}</b><b>${t('player')}</b><b class="value">${t('totalAssets')}</b><b class="return">${t('return')}</b></div>${state.leaderboard.length?state.leaderboard.map((p,i)=>`<div class="leader-row"><b class="rank">${String(i+1).padStart(2,'0')}</b><div class="leader-user"><span class="leader-avatar">${esc(p.username.slice(0,1).toUpperCase())}</span><b>${esc(p.username)}</b></div><b class="value">${money(p.equity)}</b><span class="return ${colorClass(p.return_pct)}">${pct(p.return_pct)}</span></div>`).join(''):`<div class="empty-state">${t('noData')}</div>`}</section>`;}
function renderAnnouncements(){return `${pageHeader(t('announcementsTitle'),t('announcementsSub'),t('platform')) }<div class="grid">${state.announcements.length?state.announcements.map(a=>`<article class="card"><div class="announcement-top"><div style="display:flex;align-items:center;gap:9px"><span class="tag ${a.level==='urgent'?'pending':''}">${esc(a.level.toUpperCase())}</span><b>${esc(announcementTitle(a))}</b></div><time>${fmtDate(a.created_at)}</time></div><p style="font-size:11px;line-height:1.9;color:#a9b9cb;white-space:pre-wrap;margin:13px 0 0">${esc(announcementBody(a))}</p></article>`).join(''):`<div class="card empty-state">${t('noAnnouncements')}</div>`}</div>`;}
async function loadAdmin(){if(!requireLogin())return;try{const [summary,announcements,lessons,users]=await Promise.all([api('/api/admin/summary'),api('/api/admin/announcements'),api('/api/admin/lessons'),api('/api/admin/users')]);state.adminSummary=summary;state.adminAnnouncements=announcements.announcements||[];state.adminLessons=lessons.lessons||[];state.adminUsers=users.users||[];}catch(e){toast(e.message,'error');}}
function renderAdmin(){if(!state.me||state.me.user.role!=='admin')return `${pageHeader(t('adminTitle'),t('adminSub'))}<div class="card empty-state">${t('administratorAccessRequired')}</div>`;const s=state.adminSummary||{};return `${pageHeader(t('adminTitle'),t('adminSub'),t('controlCenter'))}<div class="stats-grid grid">${statCard(t('users'),num(s.users),t('registeredAccounts'),'♙')}${statCard(t('announcementCount'),num(s.announcements),t('platformMessages'),'◉')}${statCard(t('lessonCount'),num(s.lessons),t('learningContent'),'⌘')}${statCard(t('orderCount'),num(s.orders),t('paperOrders'),'↕')}</div><div class="grid admin-grid"><section class="admin-section"><div class="card"><div class="card-head"><h2 class="card-title">${t('createAnnouncement')}</h2></div><form id="announcementForm" class="form-grid"><div class="field full"><label>${t('announcementTitle')}</label><input name="title" required maxlength="100"></div><div class="field full"><label>${t('englishTitleOptional')}</label><input name="title_en" maxlength="100"></div><div class="field full"><label>${t('announcementBody')}</label><textarea name="body" required maxlength="5000"></textarea></div><div class="field full"><label>${t('englishBodyOptional')}</label><textarea name="body_en" maxlength="5000"></textarea></div><div class="field"><label>${t('level')}</label><select name="level"><option value="info">${t('info')}</option><option value="success">${t('success')}</option><option value="warning">${t('warning')}</option><option value="urgent">${t('urgent')}</option></select></div><div class="field" style="justify-content:end"><button class="button-primary" type="submit">${t('publish')} ↗</button></div></form></div><div class="card"><div class="card-head"><h2 class="card-title">${t('createLesson')}</h2></div><form id="lessonForm" class="form-grid"><div class="field full"><label>${t('lessonTitle')}</label><input name="title" required maxlength="120"></div><div class="field full"><label>${t('englishTitleOptional')}</label><input name="title_en" maxlength="120"></div><div class="field"><label>${t('category')}</label><input name="category" required value="基礎觀念" maxlength="40"></div><div class="field"><label>${t('englishCategoryOptional')}</label><input name="category_en" maxlength="40"></div><div class="field"><label>${t('difficulty')}</label><input name="level" type="number" min="1" max="10" value="1" required></div><div class="field"><label>${t('duration')}</label><input name="duration" value="5 分鐘"></div><div class="field"><label>${t('englishDurationOptional')}</label><input name="duration_en" value="5 min"></div><div class="field full"><label>${t('lessonBody')}</label><textarea name="body" required maxlength="12000" placeholder="${t('lessonMarkdownHint')}"></textarea></div><div class="field full"><label>${t('englishBodyOptional')}</label><textarea name="body_en" maxlength="12000" placeholder="${t('englishLessonHint')}"></textarea></div><div class="field full"><label>${t('lessonImage')}</label><input name="image" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></div><div class="field full"><button class="button-primary" type="submit">${t('saveLesson')} ↗</button></div></form></div></section><section class="admin-section"><div class="card"><div class="card-head"><h2 class="card-title">${t('manageContent')} · ${t('announcements')}</h2></div>${(state.adminAnnouncements||[]).map(a=>`<div class="admin-list-item"><div><b>${esc(announcementTitle(a))}</b><div class="muted" style="margin-top:5px">${fmtDate(a.created_at)}</div></div><button class="button-danger button-small" data-action="delete-announcement" data-id="${a.id}">${t('delete')}</button></div>`).join('')||`<p class="muted">${t('noData')}</p>`}</div><div class="card"><div class="card-head"><h2 class="card-title">${t('learn')}</h2></div>${(state.adminLessons||[]).map(l=>`<div class="admin-list-item"><div><b>${esc(lessonTitle(l))}</b><div class="muted" style="margin-top:5px">${esc(lessonCategory(l))} · ${l.is_published?t('published'):t('draft')}</div></div><button class="button-danger button-small" data-action="delete-lesson" data-id="${l.id}">${t('delete')}</button></div>`).join('')||`<p class="muted">${t('noData')}</p>`}</div><div class="card"><div class="card-head"><h2 class="card-title">${t('users')}</h2></div>${(state.adminUsers||[]).slice(0,8).map(u=>`<div class="admin-list-item"><div><b>${esc(u.username)}</b><div class="muted" style="margin-top:5px">${esc(roleName(u.role))} · ${fmtDate(u.created_at)}</div></div><span>${money(u.cash)}</span></div>`).join('')}</div></section></div>`;}
async function renderPage(){
  if(state.page==='watchlist'&&state.me)await loadWatchlist();
  if(state.page==='learn'&&state.me)await loadLessons();
  if(state.page==='leaderboard'){try{const d=await api('/api/leaderboard');state.leaderboard=d.leaderboard||[];}catch(e){console.warn(e)}}
  if(state.page==='admin'&&state.me?.user.role==='admin')await loadAdmin();
  const renderers={overview:renderOverview,markets:renderMarkets,portfolio:renderPortfolio,orders:renderOrders,watchlist:renderWatchlist,learn:renderLearn,leaderboard:renderLeaderboard,announcements:renderAnnouncements,admin:renderAdmin};
  $('#pageContent').innerHTML=(renderers[state.page]||renderOverview)();
}
async function toggleWatch(symbol){
  if(!requireLogin())return;
  const exists=(state.me.watchlist||[]).includes(symbol);
  if(exists){await api(`/api/watchlist/${encodeURIComponent(symbol)}`,{method:'DELETE'});state.me.watchlist=state.me.watchlist.filter(x=>x!==symbol);toast(t('unwatch'),'success');}
  else{await api('/api/watchlist',{method:'POST',body:JSON.stringify({symbol})});state.me.watchlist.push(symbol);toast(t('watch'),'success');}
  if(state.page==='watchlist')await loadWatchlist();
  renderPage();
  if(!$('#modalBackdrop').classList.contains('hidden')&&state.selected)openStock(state.selected.symbol);
}
async function submitAdminForm(e){
  e.preventDefault();const form=e.target;
  try{
    if(form.id==='announcementForm'){
      const fd=new FormData(form);await api('/api/admin/announcements',{method:'POST',body:JSON.stringify(Object.fromEntries(fd.entries()))});
      const publicData=await api('/api/announcements');state.announcements=publicData.announcements||[];
      await loadAdmin();renderPage();toast(t('publish'),'success');
    }else if(form.id==='lessonForm'){
      const fd=new FormData(form);const image=fd.get('image');
      const payload={title:fd.get('title'),title_en:fd.get('title_en'),category:fd.get('category'),category_en:fd.get('category_en'),level:Number(fd.get('level')),duration:fd.get('duration'),duration_en:fd.get('duration_en'),body:fd.get('body'),body_en:fd.get('body_en')};
      const d=await api('/api/admin/lessons',{method:'POST',body:JSON.stringify(payload)});
      if(image&&image.size){const upload=new FormData();upload.append('image',image);await api(`/api/admin/lessons/${d.id}/image`,{method:'POST',body:upload});}
      await loadAdmin();renderPage();toast(t('saveLesson'),'success');
    }
  }catch(err){toast(err.message,'error');}
}
function openAuth(mode='login'){
  state.authMode=mode;
  const isReg=mode==='register';
  showModal(`<div class="auth-brand"><span class="brand-mark">T</span><div><b>TWEN TRADE</b><small>${t('paperTradingPlatform')}</small></div></div><h2 class="modal-title">${t('authTitle')}</h2><p class="modal-desc">${t('authSub')}</p><div class="auth-switch"><button data-action="auth-mode" data-mode="login" class="${!isReg?'active':''}">${t('loginTab')}</button><button data-action="auth-mode" data-mode="register" class="${isReg?'active':''}">${t('registerTab')}</button></div><form id="authForm" class="form-grid">${isReg?`<div class="field full"><label>${t('username')}</label><input name="username" required minlength="3" maxlength="24" autocomplete="username"></div><div class="field full"><label>${t('email')}</label><input name="email" type="email" maxlength="120" autocomplete="email"></div>`:`<div class="field full"><label>${t('username')}</label><input name="username" required autocomplete="username"></div>`}<div class="field full"><label>${t('password')}</label><input name="password" type="password" required minlength="8" maxlength="128" autocomplete="${isReg?'new-password':'current-password'}"><span class="hint">${t('passwordHint')}</span></div><div class="field full"><button class="button-primary" type="submit" style="width:100%">${isReg?t('registerNow'):t('loginNow')} →</button></div></form><p class="hint" style="margin-top:16px">${t('startingCash')} · ${t('virtualFundsOnly')}</p>`);
}
function openTrade(symbol){
  if(!requireLogin())return;
  const q=state.market.find(x=>x.symbol===symbol);if(!q){toast(t('noData'),'error');return;}state.selected=q;state.tradeSide='buy';
  const html=`<div class="eyebrow">${t('paperOrder')} · ${esc(marketName(q.market))}</div><h2 class="modal-title">${t('tradeTitle')}</h2><p class="modal-desc">${esc(q.name)} (${esc(q.symbol)}) · ${t('referencePrice')}: <b style="color:#fff">${money(q.price)}</b></p><div class="side-switch"><button class="active buy" data-action="trade-side" data-side="buy">${t('buy')}</button><button class="sell" data-action="trade-side" data-side="sell">${t('sell')}</button></div><form id="tradeForm" class="form-grid" style="margin-top:14px"><div class="field"><label>${t('orderType')}</label><select name="order_type" id="orderType"><option value="market">${t('marketOrder')}</option><option value="limit">${t('limitOrder')}</option></select></div><div class="field"><label>${t('shares')}</label><input type="number" name="quantity" min="1" max="100000" step="1" value="100" required></div><div class="field full hidden" id="limitPriceField"><label>${t('limitPrice')} (TWD)</label><input type="number" name="limit_price" min="0.01" step="0.01" placeholder="0.00"></div><div class="field full"><div class="trade-preview"><span>${t('estimatedTotal')}</span><b id="tradeEstimated">${money(q.price*100)}</b></div><div class="trade-preview"><span>${t('estimatedFee')}</span><b id="tradeFee">${money(q.price*100*.001425)}</b></div></div><div class="field full"><div class="disclaimer-box">${t('tradeSub')}<br>${t('marketCaution')}</div><label class="checkline"><input type="checkbox" name="disclaimer_accepted" required><span>${t('disclaimerCheck')}</span></label></div><div class="field full"><button class="button-primary" type="submit" style="width:100%">${t('confirmTrade')} →</button></div></form>`;
  showModal(html); bindTradePreview();
}
function bindTradePreview(){const form=$('#tradeForm');if(!form)return;const update=()=>{const qty=Number(form.quantity.value||0),type=form.order_type.value,pr=type==='limit'&&Number(form.limit_price.value)>0?Number(form.limit_price.value):state.selected.price;$('#tradeEstimated').textContent=money(pr*qty);$('#tradeFee').textContent=money(pr*qty*.001425);};form.addEventListener('input',update);form.order_type.addEventListener('change',()=>{$('#limitPriceField').classList.toggle('hidden',form.order_type.value!=='limit');update()});}
function openStock(symbol){const q=state.market.find(x=>x.symbol===symbol);if(!q)return;const watch=state.me?.watchlist?.includes(symbol);showModal(`<div class="eyebrow">${esc(marketName(q.market))} · ${esc(categoryName(q.category))}</div><h2 class="modal-title">${esc(q.name)}</h2><p class="modal-desc">${esc(q.symbol)} · ${t('lastPrice')} ${money(q.price)}</p><div class="card" style="margin-bottom:15px"><div class="stat-label">${t('referencePrice')}</div><div class="stat-value">${money(q.price)}</div><div class="${colorClass(q.change)}">${q.change>0?'+':''}${num(q.change)} (${pct(q.change_pct)})</div><div class="stat-foot" style="margin-top:9px">${t('notRealtime')} · ${esc(state.meta?.market_date||'')}</div></div><div class="trade-preview"><span>${t('volume')}</span><b>${num(q.volume)} ${state.lang==='zh'?'股':'shares'}</b></div><div class="modal-actions"><button class="button-secondary" data-action="watch" data-symbol="${esc(q.symbol)}">${watch?t('unwatch'):t('watch')}</button><button class="button-primary" data-action="trade" data-symbol="${esc(q.symbol)}">${t('trade')} →</button></div>`);}
function openLesson(id){const l=state.lessons.find(x=>x.id===Number(id));if(!l)return;showModal(`<div class="eyebrow">${esc(lessonCategory(l))} · ${esc(lessonDuration(l))}</div><h2 class="modal-title">${esc(lessonTitle(l))}</h2><p class="modal-desc">${t('lessons')} ${l.level} · ${l.completed?t('completed'):t('continueLearning')}</p>${l.image_path?`<img class="lesson-image" src="${esc(l.image_path)}" alt="${esc(lessonTitle(l))}">`:''}<div class="lesson-content">${markdown(lessonBody(l))}</div><div class="disclaimer-box" style="margin-top:17px"><b>${t('educationalDisclaimer')}</b><br>${t('lessonDisclaimer')}</div><div class="modal-actions"><button class="button-primary" data-action="complete-lesson" data-id="${l.id}" ${l.completed?'disabled':''}>${l.completed?'✓ '+t('completed'):t('markComplete')}</button></div>`);}

$('#sideNav').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b)setPage(b.dataset.page)});
$('#mobileBottomNav').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b)setPage(b.dataset.page)});
$('#pageContent').addEventListener('click',async e=>{
  const page=e.target.closest('[data-page]');if(page){setPage(page.dataset.page);return;}
  const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;
  try{
    if(a==='go-markets')setPage('markets');else if(a==='go-portfolio')setPage('portfolio');else if(a==='go-learn')setPage('learn');else if(a==='go-watchlist')setPage('watchlist');
    else if(a==='auth-login')openAuth('login');else if(a==='auth-register')openAuth('register');
    else if(a==='open-stock')openStock(b.dataset.symbol);else if(a==='trade')openTrade(b.dataset.symbol);
    else if(a==='watch'){await toggleWatch(b.dataset.symbol);}
    else if(a==='refresh-market'){await loadMarket(true);renderPage();toast(t('successToast'),'success');}
    else if(a==='open-lesson')openLesson(b.dataset.id);
    else if(a==='complete-lesson'){await api(`/api/lessons/${b.dataset.id}/complete`,{method:'POST'});await loadLessons();toast(t('completed'),'success');openLesson(b.dataset.id);renderPage();}
    else if(a==='cancel-order'){await api(`/api/orders/${b.dataset.id}/cancel`,{method:'POST'});await loadMe();renderPage();toast(t('cancelled'),'success');}
    else if(a==='delete-announcement'){if(confirm(t('delete')+'?')){await api(`/api/admin/announcements/${b.dataset.id}`,{method:'DELETE'});await loadAdmin();renderPage();}}
    else if(a==='delete-lesson'){if(confirm(t('delete')+'?')){await api(`/api/admin/lessons/${b.dataset.id}`,{method:'DELETE'});await loadAdmin();renderPage();}}
  }catch(err){toast(err.message,'error');}
});
$('#pageContent').addEventListener('input',e=>{if(e.target.id==='marketSearch'){state.search=e.target.value;const pos=e.target.selectionStart;renderPage();const el=$('#marketSearch');el.focus();el.setSelectionRange(pos,pos);}});
$('#pageContent').addEventListener('click',e=>{const filter=e.target.closest('[data-filter]');if(filter){state.marketFilter=filter.dataset.filter;renderPage();}});
$('#topLogin').addEventListener('click',async()=>{if(state.me){try{await api('/api/logout',{method:'POST'});state.me=null;state.csrf='';await api('/api/bootstrap').then(d=>{state.csrf=d.csrf;state.meta=d.market;});updateUserShell();setPage('overview');toast(t('logout'),'success');}catch(e){toast(e.message,'error')}}else openAuth('login')});
$('#langToggle').addEventListener('click',()=>{state.lang=state.lang==='zh'?'en':'zh';updateLang();});
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#modalClose').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal()});
$('#userMenuBtn').addEventListener('click',()=>state.me?$('#topLogin').click():openAuth('login'));
$('#modalContent').addEventListener('click',async e=>{
  const b=e.target.closest('[data-action]');if(!b)return;
  if(b.dataset.action==='auth-mode')openAuth(b.dataset.mode);
  else if(b.dataset.action==='trade-side'){state.tradeSide=b.dataset.side;$$('.side-switch button').forEach(x=>{x.classList.remove('active');x.classList.remove('buy','sell')});b.classList.add('active',state.tradeSide);b.classList.add(state.tradeSide);}
  else if(b.dataset.action==='trade')openTrade(b.dataset.symbol);
  else if(b.dataset.action==='watch'){try{await toggleWatch(b.dataset.symbol);}catch(err){toast(err.message,'error');}}
  else if(b.dataset.action==='complete-lesson'){try{await api(`/api/lessons/${b.dataset.id}/complete`,{method:'POST'});await loadLessons();toast(t('completed'),'success');openLesson(b.dataset.id);renderPage();}catch(err){toast(err.message,'error');}}
});
$('#pageContent').addEventListener('submit',submitAdminForm);
$('#modalContent').addEventListener('submit',async e=>{
  e.preventDefault();const form=e.target;
  try{
    if(form.id==='authForm'){
      const fd=new FormData(form);const payload=Object.fromEntries(fd.entries());const endpoint=state.authMode==='register'?'/api/register':'/api/login';
      const d=await api(endpoint,{method:'POST',body:JSON.stringify(payload)});state.csrf=d.csrf;await loadMe();closeModal();setPage('overview');toast(state.authMode==='register'?t('registerNow'):t('loginNow'),'success');
    } else if(form.id==='tradeForm'){
      const fd=new FormData(form);const payload={symbol:state.selected.symbol,side:state.tradeSide,quantity:Number(fd.get('quantity')),order_type:fd.get('order_type'),limit_price:fd.get('limit_price')?Number(fd.get('limit_price')):null,disclaimer_accepted:fd.get('disclaimer_accepted')==='on'};
      const d=await api('/api/orders',{method:'POST',body:JSON.stringify(payload)});await loadMe();closeModal();setPage('orders');toast(d.status==='PENDING'?t('pending'):t('tradeSuccess'),'success');
    } else if(form.id==='announcementForm'){
      const fd=new FormData(form);await api('/api/admin/announcements',{method:'POST',body:JSON.stringify(Object.fromEntries(fd.entries()))});await loadAdmin();renderPage();toast(t('publish'),'success');
    } else if(form.id==='lessonForm'){
      const fd=new FormData(form);const image=fd.get('image');const payload={title:fd.get('title'),title_en:fd.get('title_en'),category:fd.get('category'),category_en:fd.get('category_en'),level:Number(fd.get('level')),duration:fd.get('duration'),duration_en:fd.get('duration_en'),body:fd.get('body'),body_en:fd.get('body_en')};const d=await api('/api/admin/lessons',{method:'POST',body:JSON.stringify(payload)});
      if(image&&image.size){const upload=new FormData();upload.append('image',image);await api(`/api/admin/lessons/${d.id}/image`,{method:'POST',body:upload});}
      await loadAdmin();renderPage();toast(t('saveLesson'),'success');
    }
  }catch(err){toast(err.message,'error');}
});
$('#marketNotice').addEventListener('click',()=>{});
init();
