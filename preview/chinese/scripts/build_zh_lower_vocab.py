"""生成 data/zh-vocab-lower.js：词语页「低年级」主题，资料来自共用单词总表 data/lexicon.csv（中文栏）。
用法：python3 preview/chinese/scripts/build_zh_lower_vocab.py   （需要 pypinyin；拼音修正沿用 build_char_detective.py 的 PY_FIX）
总表改了中文或加了图，重跑一次即可。"""
import csv, json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.argv = [sys.argv[0]]  # build_char_detective 只取函式，不要它的 --review
import importlib.util
spec = importlib.util.spec_from_file_location("bcd", os.path.join(ROOT, "preview/chinese/scripts/build_char_detective.py"))
# 只借用拼音函式：读入原始码、截到 tokens() 定义为止再执行
src = open(spec.origin, encoding="utf-8").read()
src = src[:src.index("# ── 五、六年级：旧资料 ──")]
NS = {"__file__": spec.origin}
exec(src, NS)
py_of, PY_FIX = NS["py_of"], NS["PY_FIX"]
EXTRA = {"地铁":"dì tiě","校长室":"xiào zhǎng shì","T恤":"T xù","橘子":"jú zi","狮子":"shī zi","桃子":"táo zi","椅子":"yǐ zi","裤子":"kù zi","裙子":"qún zi","袜子":"wà zi","鞋子":"xié zi","帽子":"mào zi","鼻子":"bí zi",
 "嘴巴":"zuǐ ba","耳朵":"ěr duo","眼睛":"yǎn jing","头发":"tóu fa","肩膀":"jiān bǎng","衣服":"yī fu","葡萄":"pú tao","胡萝卜":"hú luó bo","萝卜":"luó bo","包菜":"bāo cài",
 "葡萄柚":"pú tao yòu","西兰花":"xī lán huā","马铃薯":"mǎ líng shǔ","豆腐":"dòu fu","薯条":"shǔ tiáo","薯片":"shǔ piàn","便宜":"pián yi","长":"cháng","好吃":"hǎo chī",
 "觉":"jiào","睡觉":"shuì jiào","量":"liáng","乒乓球":"pīng pāng qiú","德士":"dé shì","脚踏车":"jiǎo tà chē","咖啡色":"kā fēi sè","咖喱饭":"gā lí fàn","咖喱":"gā lí",
 "温开水":"wēn kāi shuǐ","冰开水":"bīng kāi shuǐ","扫把":"sào bǎ","直笛":"zhí dí","室内鞋":"shì nèi xié","汤匙":"tāng chí","教职员室":"jiào zhí yuán shì","教室":"jiào shì",
 "银行":"yín háng","派出所":"pài chū suǒ","药房":"yào fáng","重":"zhòng","刷牙":"shuā yá","奶奶":"nǎi nai","爷爷":"yé ye","长颈鹿":"cháng jǐng lù","牛油果":"niú yóu guǒ",
 "爆米花":"bào mǐ huā","口香糖":"kǒu xiāng táng","订书机":"dìng shū jī","笔记本":"bǐ jì běn","文件夹":"wén jiàn jiā","花坛":"huā tán","游泳池":"yóu yǒng chí","体育馆":"tǐ yù guǎn"}
def pinyin(w):
    if w in EXTRA: return EXTRA[w]
    if w in PY_FIX: return PY_FIX[w]
    res = py_of(w)
    for k, v in sorted(EXTRA.items(), key=lambda kv: -len(kv[0])):
        for m in re.finditer(re.escape(k), w):
            for n, p in enumerate(v.split()): res[m.start()+n] = p
    return " ".join(x for x in res if x)
def clean(zh):
    zh = zh.strip()
    special = {"刷（牙）": "刷牙", "热（天气）": "热", "冷（天气）": "冷"}
    if zh in special: return special[zh]
    zh = re.split(r"[／/・]", zh)[0]
    return re.sub(r"（[^）]*）", "", zh).strip()
TOPICS = [  # 类别, 中文标题, 英文, 图示
 ("animals","动物","Animals","🐻"),("fruit","水果","Fruit","🍎"),("vegetables","蔬菜","Vegetables","🥕"),("food","食物","Food","🍚"),
 ("snacks","零食","Snacks","🍬"),("family","家人","Family","👨‍👩‍👧"),("body","身体","Body","👀"),("colours","颜色","Colours","🎨"),
 ("clothes","衣服","Clothes","👕"),("stationery","文具","Stationery","✏️"),("places","地方","Places","🏫"),("transport","交通","Transport","🚌"),
 ("sports","运动","Sports","⚽"),("adjectives","形容词","Describing words","📏"),("verbs","动作","Action words","🏃")]
rows = list(csv.DictReader(open(os.path.join(ROOT, "data/lexicon.csv"), encoding="utf-8-sig")))
out = {}
for cat, zt, et, icon in TOPICS:
    words, seen = [], set()
    for r in rows:
        if r["category"] != cat or not r["zh"].strip(): continue
        zh = clean(r["zh"])
        if not zh or zh in seen: continue
        seen.add(zh)
        img = r["image"] if r["has_image"].strip().lower() in ("yes", "1", "true") else ""
        if img and not os.path.exists(os.path.join(ROOT, img)): img = ""
        en = re.split(r"\s*/\s*", r["en"])[0]
        words.append([zh, pinyin(zh), en, img, r["emoji"], r["id"]])
    out["low-" + cat] = {"title": zt + " " + et, "icon": icon, "grade": "low", "words": words, "scenes": []}
js = "/* 自动生成：preview/chinese/scripts/build_zh_lower_vocab.py（来源 data/lexicon.csv）——不要手改 */\nwindow.ZH_LOWER=" + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
open(os.path.join(ROOT, "data/zh-vocab-lower.js"), "w", encoding="utf-8").write(js)
print({k: len(v["words"]) for k, v in out.items()}, "images:", sum(1 for v in out.values() for w in v["words"] if w[3]))
if "--list" in os.environ.get("LIST", ""):
    pass
for v in out.values():
    print(v["title"], " ".join(f"{w[0]}({w[1]})" for w in v["words"]))
