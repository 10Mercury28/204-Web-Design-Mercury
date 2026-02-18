

document.addEventListener("DOMContentLoaded", () => {

  const minusBtn   = document.getElementById("minusBtn");
  const plusBtn    = document.getElementById("plusBtn");
  const diceNumEl  = document.getElementById("diceNum");
  const counterBox = document.getElementById("diceCounter");

  const diceRow    = document.getElementById("diceRow");
  const rollBtn    = document.getElementById("rollBtn");

  const quizArea   = document.getElementById("quizArea");
  const confettiEl = document.getElementById("confetti");

  const resetBtn   = document.getElementById("tryReset");
  const rollHint   = document.getElementById("rollHint");
  const lockHint   = document.getElementById("lockHint");

  if (!minusBtn || !plusBtn || !diceNumEl || !counterBox || !diceRow || !rollBtn || !quizArea || !confettiEl || !resetBtn) {
    console.warn("[dice_try.js] Missing required DOM nodes. Check main4 markup/ids.");
    return;
  }


  const PATTERN_MAP = new Map([
    // 赏采
    ["6-6-6", "碧油 [Biyou] Green Oil"],
    ["5-5-5", "桃花重五 [Taohua Chongwu] Peach Blossom Double Five"],
    ["4-4-4", "堂印 [Tangyin] All Fours"],
    ["3-3-3", "雁行儿 [Yanxing'er] Wild Geese Formation"],
    ["2-2-2", "拍板儿 [Paiban'er] Clappers"],
    ["1-1-1", "满盆星 [Manpen Xing] Basin of Stars"],
    ["6-6-5", "黑十七 [Hei Shiqi] Black Seventeen"],
    ["6-5-4", "马军 [Ma Jun] Horse Troops"],
    ["6-3-2", "靴檀 [Xue Tan] Boot Wood"],
    ["5-4-1", "银十 [Yin Shi] Silver Ten"],
    ["6-3-1", "撮十 [Cuo Shi] Gathered Ten"],

    ["6-6-4", "赤牛 [Chi Niu] Red Ox"],
    ["6-5-5", "黑牛 [Hei Niu] Black Ox"],
    ["6-6-3", "驴嘴 [Lü Zui] Donkey Mouth"],
    ["6-5-3", "角搜 [Jiao Sou] Horn Search"],
    ["6-4-4", "大开门 [Da Kaimen] Grand Opening Gate"],
    ["5-5-4", "正台 [Zheng Tai] Main Platform"],
    ["6-6-2", "筳策 [Ting Ce] Bamboo Tablet"],
    ["6-5-2", "暮宿 [Mu Su] Evening Rest"],
    ["6-6-1", "大枪 [Da Qiang] Long Spear"],
    ["5-5-3", "皂鹤 [Zao He] Black Crane"],
    ["6-4-3", "野鸡顶 [Yeji Ding] Pheasant Crest"],
    ["5-4-4", "八五 [Ba Wu] Eight-Five"],
    ["5-4-3", "花盖 [Huagai] Floral Canopy"],
    ["5-5-2", "Y角儿 [Y Jiao'er] Y Corner"],
    ["6-3-3", "条巾 [Tiao Jin] Striped Scarf"],
    ["6-4-2", "赤十二 [Chi Shier] Red Twelve"],
    ["6-5-1", "腰曲缨 [Yao Qu Ying] Curved Waist Tassel"],
    ["5-3-3", "饯(食+达)儿 [Jian'er] Feast Token"],
    ["4-4-3", "红鹤 [Hong He] Red Crane"],
    ["5-4-2", "九二 [Jiu Er] Nine-Two"],
    ["5-5-1", "小枪 [Xiao Qiang] Small Spear"],
    ["6-4-1", "急火钻 [Ji Huo Zuan] Rapid Fire Drill"],
    ["5-3-2", "胡十 [Hu Shi] Hu Ten"],
    ["4-3-3", "蛾眉 [E Mei] Moth Eyebrow"],
    ["6-2-2", "夹十 [Jia Shi] Pinched Ten"],
    ["4-4-2", "平头 [Ping Tou] Flat Head"],
    ["5-3-1", "撮九 [Cuo Jiu] Gathered Nine"],
    ["6-2-1", "扔九 [Reng Jiu] Thrown Nine"],
    ["4-3-2", "妹九 [Mei Jiu] Younger Sister Nine"],
    ["5-2-2", "夹九 [Jia Jiu] Pinched Nine"],
    ["4-4-1", "丁九 [Ding Jiu] Ding Nine"],
    ["3-3-2", "雁八 [Yan Ba] Goose Eight"],
    ["4-3-1", "撮八 [Cuo Ba] Gathered Eight"],
    ["5-2-1", "扔八 [Reng Ba] Thrown Eight"],
    ["6-1-1", "大肚 [Da Du] Big Belly"],
    ["4-2-2", "夹八 [Jia Ba] Pinched Eight"],
    ["5-1-1", "白七 [Bai Qi] White Seven"],
    ["3-3-1", "川七 [Chuan Qi] River Seven"],
    ["3-2-2", "夹七 [Jia Qi] Pinched Seven"],
    ["4-2-1", "扔七 [Reng Qi] Thrown Seven"],
    ["4-1-1", "火筒儿 [Huo Tong'er] Fire Tube"],
    ["2-2-1", "小嘴 [Xiao Zui] Small Mouth"],
    ["3-1-1", "葫芦头 [Hulu Tou] Gourd Head"],

    ["3-2-1", "小浮图 [Xiao Futu] Little Pagoda"],
    ["2-1-1", "小娘子 [Xiao Niangzi] Young Lady"],
  ]);




  let diceCount = 1;
  let locked = false;
  let rolling = false;
  let finalFaces = []; 


  function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function clearNode(node){
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function canonicalKey(triple){
    const a = [...triple].sort((x,y)=>y-x);
    return a.join("-");
  }

  function getPatternName(triple){
    return PATTERN_MAP.get(canonicalKey(triple)) || null;
  }

  function setCounterUI(){
    diceNumEl.textContent = String(diceCount);

    minusBtn.disabled = locked || diceCount <= 1;
    plusBtn.disabled  = locked || diceCount >= 3;

    rollBtn.disabled = !locked || rolling;

    lockHint.textContent = locked
      ? "The Next Stage Unlocked."
      : "The Next Stage Unlocks Only After The Correct Number Is Set.";

    rollHint.textContent = locked
      ? "Roll!"
      : "This Stage Unlocks Only After The Correct Number Is Set.";
  }

  function buildDice(n){
    clearNode(diceRow);
    for (let i = 0; i < n; i++){
      const die = document.createElement("div");
      die.className = `die face-1`;
      die.setAttribute("aria-label", "die");
      diceRow.appendChild(die);
    }
  }

  function lockIfNeeded(){
    if (!locked && diceCount === 3){
      locked = true;

      counterBox.classList.remove("lock-flash");
      void counterBox.offsetWidth;
      counterBox.classList.add("lock-flash");

      minusBtn.disabled = true;
      plusBtn.disabled = true;
      rollBtn.disabled = false;
    }
  }

  function setDiceFaces(faces){
    const dice = [...diceRow.querySelectorAll(".die")];
    dice.forEach((die, idx) => {
      const f = faces[idx] ?? 1;

      const keep = die.className.split(" ").filter(c => c && !c.startsWith("face-") && c !== "die");
      die.className = ["die", ...keep, `face-${f}`].join(" ");
    });
  }

  function makeTripleRandom(){
    return [randInt(1,6), randInt(1,6), randInt(1,6)];
  }

  function makeTripleNamed(maxTries = 80){
    for (let i = 0; i < maxTries; i++){
      const t = makeTripleRandom();
      if (getPatternName(t)) return t;
    }
    const keys = [...PATTERN_MAP.keys()];
    const key = keys[randInt(0, keys.length - 1)];
    const parts = key.split("-").map(Number);
    for (let i = parts.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [parts[i], parts[j]] = [parts[j], parts[i]];
    }
    return parts;
  }

  async function rollDice(){
    if (!locked || rolling) return;

    rolling = true;
    rollBtn.disabled = true;

    const dice = [...diceRow.querySelectorAll(".die")];
    const flips = 3;

    for (let k = 0; k < flips; k++){
      const faces = [randInt(1,6), randInt(1,6), randInt(1,6)];
      setDiceFaces(faces);

      dice.forEach(d => {
        d.classList.remove("flip");
        void d.offsetWidth;
        d.classList.add("flip");
      });

      await new Promise(res => setTimeout(res, 260));
    }

    finalFaces = makeTripleNamed();
    setDiceFaces(finalFaces);

    dice.forEach(d => {
      d.classList.remove("flip");
      void d.offsetWidth;
      d.classList.add("flip");
    });

    await new Promise(res => setTimeout(res, 260));

    rolling = false;
    rollBtn.disabled = true; 

    renderQuiz();
  }

  function buildOptions(correctTriple){
    const correctName = getPatternName(correctTriple);
    const correctSum  = correctTriple.reduce((a,b)=>a+b,0);

    const correctKey = canonicalKey(correctTriple);
    const options = [{ name: correctName, sum: correctSum, key: correctKey }];

    const used = new Set([`${correctName}|${correctSum}|${correctKey}`]);


    const allKeys = [...PATTERN_MAP.keys()];

    while (options.length < 3){
      const k = allKeys[randInt(0, allKeys.length - 1)];
      const name = PATTERN_MAP.get(k);
      const parts = k.split("-").map(Number);
      const sum = parts.reduce((a,b)=>a+b,0);


      const sig = `${name}|${sum}|${k}`;
      if (used.has(sig)) continue;

     
      if (name === correctName && Math.random() < 0.8) continue;

      used.add(sig);
      options.push({ name, sum, key: k });
    }


    for (let i = options.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }

  function disableAllChoices(){
    quizArea.querySelectorAll(".choice").forEach(btn => btn.disabled = true);
  }

  function fireConfetti(){
    clearNode(confettiEl);
    const pieces = 36;
    const colors = ["#0e6e41", "#7fcfa4", "#5fbf8b", "#d4eaf0", "#b11226"];

    for (let i = 0; i < pieces; i++){
      const p = document.createElement("i");
      p.style.left = `${randInt(0, 100)}%`;

      const w = randInt(6, 12);
      const h = randInt(10, 18);
      p.style.width = `${w}px`;
      p.style.height = `${h}px`;

      p.style.animationDelay = `${Math.random() * 0.25}s`;
      p.style.background = colors[randInt(0, colors.length - 1)];

      confettiEl.appendChild(p);

      setTimeout(() => {
        if (p && p.parentNode) p.parentNode.removeChild(p);
      }, 1200);
    }
  }

  function renderQuiz(){
    const name = getPatternName(finalFaces);
    const sum  = finalFaces.reduce((a,b)=>a+b,0);

    clearNode(quizArea);

    const hint = document.createElement("p");
    hint.className = "try-hint";
    hint.textContent = "Please Select The Option That Matches Both The Pattern And The Count.";
    quizArea.appendChild(hint);

    if (!name){
      const warn = document.createElement("p");
      warn.className = "try-hint";
      warn.textContent = "This Pattern Combination Is Not Recorded. Please Reset.";
      quizArea.appendChild(warn);
    }

    const correctTriple = [...finalFaces];
    const correctKey = canonicalKey(correctTriple);

    const options = buildOptions(correctTriple);
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = `Pattern：${opt.name} · Count：${opt.sum}`;

      btn.addEventListener("click", () => {

        if (opt.key === correctKey){
          btn.classList.add("correct");
          disableAllChoices();
          fireConfetti();
        } else {
          btn.classList.add("wrong");
          setTimeout(() => btn.classList.add("fade-out"), 420);
        }
      });

      quizArea.appendChild(btn);
    });
  }

  function resetAll(){
    diceCount = 1;
    locked = false;
    rolling = false;
    finalFaces = [];

    counterBox.classList.remove("lock-flash");
    buildDice(diceCount);

    clearNode(quizArea);
    quizArea.innerHTML = `<p class="try-hint">roll 后会出现选项。</p>`;

    clearNode(confettiEl);

    setCounterUI();
  }


  minusBtn.addEventListener("click", () => {
    if (locked) return;
    diceCount = Math.max(1, diceCount - 1);
    buildDice(diceCount);
    setCounterUI();
  });

  plusBtn.addEventListener("click", () => {
    if (locked) return;
    diceCount = Math.min(3, diceCount + 1);
    buildDice(diceCount);
    setCounterUI();
    lockIfNeeded();
    setCounterUI();
  });

  rollBtn.addEventListener("click", rollDice);
  resetBtn.addEventListener("click", resetAll);


  buildDice(diceCount);
  setCounterUI();
});
