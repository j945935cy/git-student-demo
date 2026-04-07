const PREFIXES = [
  '', 'un', 're', 'in', 'im', 'dis', 'pre', 'pro', 'sub', 'inter', 'trans',
  'over', 'under', 'mis', 'non', 'anti', 'auto', 'co', 'de', 'en', 'fore',
  'mid', 'out', 'super', 'tri'
];

const SUFFIXES = [
  '', 's', 'ed', 'ing', 'er', 'est', 'ly', 'ness', 'less', 'ful', 'ment', 'tion',
  'able', 'al', 'ity', 'ize', 'ist', 'ship', 'ward', 'ous', 'ive', 'ary', 'y'
];

const ROOTS = [
  'act','age','air','allow','answer','appear','apply','argue','arrive','ask','balance','base','beauty','believe','birth','block',
  'board','book','break','build','call','care','carry','cause','change','check','choice','clean','clear','close','collect','color',
  'come','comfort','common','commun','compare','complete','connect','consider','continue','control','cook','copy','correct','count','cover',
  'create','cross','culture','cycle','dance','decide','deep','deliver','depend','design','develop','direct','discover','discuss','divide',
  'document','draw','dream','dress','drive','drop','educate','effect','employ','enjoy','enter','equal','escape','event','exam','excite',
  'exist','expect','experience','explain','express','extend','face','fail','fair','faith','family','farm','fast','favor','feel','fight',
  'fill','final','finance','find','finish','fit','focus','follow','form','frame','free','friend','fund','future','gain','game','garden',
  'gather','general','govern','grade','grant','grow','guard','guide','habit','hand','happy','harm','head','health','hear','help',
  'history','hold','honor','hope','house','human','hunt','idea','image','improve','include','increase','inform','inject','input','install',
  'intend','interest','invent','invite','join','judge','jump','keep','kind','know','label','labor','land','learn','legal','light','limit',
  'link','listen','live','load','local','lock','logic','look','love','manage','mark','match','measure','media','memory','message','mind',
  'model','modern','monitor','move','music','name','nation','nature','need','notice','number','observe','offer','open','order','organ',
  'paint','paper','parent','part','pass','patient','pay','perform','phone','pick','place','plan','play','please','point','policy','popular',
  'position','power','practice','press','print','process','produce','project','protect','public','publish','pull','push','qualify','question','quick',
  'raise','rate','reach','react','read','record','reduce','refer','reflect','rely','remove','report','request','require','resist','respect',
  'rest','result','return','review','reward','ride','risk','road','roll','rule','safe','save','scale','school','science','search','secure',
  'select','sense','serve','set','shape','share','ship','short','show','sign','simple','skill','sleep','smile','social','solve','sort',
  'sound','speak','special','speed','sport','spread','stand','start','state','step','stick','store','study','style','success','suggest','supply',
  'support','sure','system','table','talk','teach','team','test','thank','think','touch','trade','train','travel','treat','trust','type',
  'understand','union','unit','update','use','value','visit','voice','vote','wait','walk','want','warm','watch','wear','win','work','write'
];

const MIN_WORD_LENGTH = 3;
const TARGET_WORD_COUNT = 1200;

function composeWord(prefix, root, suffix) {
  if (!root) return '';
  let word = `${prefix}${root}${suffix}`;

  // very small cleanup rules for readability
  word = word.replace(/(\w)\1\1+/g, '$1$1');
  word = word.replace(/ii/g, 'i');
  word = word.replace(/yy/g, 'y');
  return word;
}

function generateWordBank() {
  const scored = [];

  ROOTS.forEach((root) => {
    scored.push({ word: root, score: 5, prefix: '', root, suffix: '' });

    PREFIXES.forEach((prefix) => {
      SUFFIXES.forEach((suffix) => {
        if (!prefix && !suffix) return;
        const word = composeWord(prefix, root, suffix);
        if (word.length < MIN_WORD_LENGTH) return;

        let score = 1;
        if (!prefix || !suffix) score += 1;
        if (['s', 'ed', 'ing', 'er', 'ly', 'tion', 'ment', 'able', 'ness'].includes(suffix)) score += 1;
        if (['re', 'un', 'in', 'pre', 'dis'].includes(prefix)) score += 1;

        scored.push({ word, score, prefix, root, suffix });
      });
    });
  });

  const uniq = new Map();
  scored
    .sort((a, b) => b.score - a.score || a.word.length - b.word.length || a.word.localeCompare(b.word))
    .forEach((entry) => {
      if (!uniq.has(entry.word)) uniq.set(entry.word, entry);
    });

  return Array.from(uniq.values()).slice(0, TARGET_WORD_COUNT);
}

function decompose(word) {
  let best = { prefix: '', root: word, suffix: '' };

  for (const prefix of PREFIXES.sort((a, b) => b.length - a.length)) {
    if (prefix && !word.startsWith(prefix)) continue;
    const withoutPrefix = prefix ? word.slice(prefix.length) : word;

    for (const suffix of SUFFIXES.sort((a, b) => b.length - a.length)) {
      if (suffix && !withoutPrefix.endsWith(suffix)) continue;
      const root = suffix ? withoutPrefix.slice(0, -suffix.length) : withoutPrefix;
      if (!root || root.length < 2) continue;
      if (ROOTS.includes(root)) return { prefix, root, suffix };
      if (root.length > best.root.length) best = { prefix, root, suffix };
    }
  }

  return best;
}

const wordBank = generateWordBank().map((entry) => {
  const parts = decompose(entry.word);
  return { word: entry.word, ...parts };
});

const prefixSelect = document.getElementById('prefixSelect');
const rootSelect = document.getElementById('rootSelect');
const suffixSelect = document.getElementById('suffixSelect');
const composedWord = document.getElementById('composedWord');
const wordStatus = document.getElementById('wordStatus');
const wordList = document.getElementById('wordList');
const countInfo = document.getElementById('countInfo');
const speakBtn = document.getElementById('speakBtn');

function fillSelect(select, options, label) {
  select.innerHTML = '';

  const anyOption = document.createElement('option');
  anyOption.value = '*';
  anyOption.textContent = `不限${label}`;
  select.appendChild(anyOption);

  options.forEach((value) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = value || '(空白)';
    select.appendChild(opt);
  });
}

const prefixOptions = [...new Set(wordBank.map((w) => w.prefix))].sort();
const rootOptions = [...new Set(wordBank.map((w) => w.root))].sort();
const suffixOptions = [...new Set(wordBank.map((w) => w.suffix))].sort();

fillSelect(prefixSelect, prefixOptions, '字首');
fillSelect(rootSelect, rootOptions, '字根');
fillSelect(suffixSelect, suffixOptions, '字尾');

function selectedValue(select) {
  return select.value === '*' ? null : select.value;
}

function update() {
  const selectedPrefix = selectedValue(prefixSelect);
  const selectedRoot = selectedValue(rootSelect);
  const selectedSuffix = selectedValue(suffixSelect);

  const filtered = wordBank.filter((entry) =>
    (selectedPrefix === null || entry.prefix === selectedPrefix) &&
    (selectedRoot === null || entry.root === selectedRoot) &&
    (selectedSuffix === null || entry.suffix === selectedSuffix)
  );

  wordList.innerHTML = '';
  filtered.slice(0, 200).forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `${entry.word} (${entry.prefix || '∅'} + ${entry.root} + ${entry.suffix || '∅'})`;
    li.addEventListener('click', () => {
      composedWord.textContent = entry.word;
      wordStatus.textContent = '已從資料庫選字，可直接朗讀。';
    });
    wordList.appendChild(li);
  });

  countInfo.textContent = `資料庫共 ${wordBank.length} 字；目前符合 ${filtered.length} 字（列表最多顯示 200 筆）。`;

  if (selectedRoot) {
    const composed = composeWord(selectedPrefix || '', selectedRoot, selectedSuffix || '');
    composedWord.textContent = composed;
    const exists = wordBank.some((w) => w.word === composed);
    wordStatus.textContent = exists
      ? '✅ 此組合在 1200 字資料庫中。'
      : 'ℹ️ 此組合不在 1200 字資料庫，可仍試著朗讀。';
  } else {
    composedWord.textContent = '—';
    wordStatus.textContent = '請至少選擇字根。';
  }
}

[prefixSelect, rootSelect, suffixSelect].forEach((el) => el.addEventListener('change', update));

speakBtn.addEventListener('click', () => {
  const word = composedWord.textContent.trim();
  if (!word || word === '—') {
    wordStatus.textContent = '請先組出單字再朗讀。';
    return;
  }

  if (!('speechSynthesis' in window)) {
    wordStatus.textContent = '此瀏覽器不支援語音合成。';
    return;
  }

  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = 'en-US';
  utter.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
});

update();
