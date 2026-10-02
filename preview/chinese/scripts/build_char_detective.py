"""生成 preview/chinese/data/char-detective.js
用法：python3 preview/chinese/scripts/build_char_detective.py   （需要 pip install pypinyin）
来源：content/char_detective_src.py（一至四年级）＋ uasa-vocab.html 的 CONFUSED_CHAR_DATA / CHAR_MIX_A / CHAR_MIX_B / CHAR_PASSAGE（五、六年级·升中）
拼音：pypinyin 自动标，再用 PY_FIX（整句里的词→拼音）修正多音字和轻声。改了题目要重跑并检查 --review 输出。"""
import json, re, sys, os, unicodedata
from pypinyin import pinyin, Style, load_phrases_dict
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.insert(0, os.path.join(ROOT, "preview/chinese/content"))
import char_detective_src as SRC

# 轻声与多音字修正（词 → 每字拼音，空格分隔）。按长度优先匹配。
PY_FIX = {
 "妈妈":"mā ma","爸爸":"bà ba","哥哥":"gē ge","姐姐":"jiě jie","弟弟":"dì di","妹妹":"mèi mei","爷爷":"yé ye","奶奶":"nǎi nai","叔叔":"shū shu","星星":"xīng xing",
 "朋友":"péng you","东西":"dōng xi","休息":"xiū xi","知道":"zhī dao","衣服":"yī fu","耳朵":"ěr duo","眼睛":"yǎn jing","清楚":"qīng chu","漂亮":"piào liang","舒服":"shū fu",
 "我们":"wǒ men","你们":"nǐ men","他们":"tā men","她们":"tā men","同学们":"tóng xué men","大家":"dà jiā","收拾":"shōu shi","明白":"míng bai","事情":"shì qing","意思":"yì si",
 "杯子":"bēi zi","兔子":"tù zi","桌子":"zhuō zi","椅子":"yǐ zi","鼻子":"bí zi","房子":"fáng zi","帽子":"mào zi","孩子":"hái zi","王子":"wáng zǐ","样子":"yàng zi","日子":"rì zi","肚子":"dù zi","本子":"běn zi","篮子":"lán zi","胡子":"hú zi","种子":"zhǒng zi",
 "木头":"mù tou","石头":"shí tou","里头":"lǐ tou","地方":"dì fang","时候":"shí hou","告诉":"gào su","喜欢":"xǐ huan","认识":"rèn shi","麻烦":"má fan","热闹":"rè nao","商量":"shāng liang","打扮":"dǎ ban","故事":"gù shi","先生":"xiān sheng","脑袋":"nǎo dai","豆腐":"dòu fu","萝卜":"luó bo","葡萄":"pú tao","玻璃":"bō li","力气":"lì qi","客气":"kè qi","名字":"míng zi","钥匙":"yào shi","护士":"hù shi","聪明":"cōng ming","暖和":"nuǎn huo","凉快":"liáng kuai","厉害":"lì hai","便宜":"pián yi","风筝":"fēng zheng","头发":"tóu fa","粮食":"liáng shi","关系":"guān xi","东边":"dōng bian","南边":"nán bian","这边":"zhè biān","那边":"nà biān","上边":"shàng bian",
 "长得":"zhǎng de","长长":"cháng cháng","看得":"kàn de","跑得":"pǎo de","画得":"huà de","写得":"xiě de","说得":"shuō de","做得":"zuò de","长大":"zhǎng dà",
 "一数":"yī shǔ","数到":"shǔ dào","得到":"dé dào","觉得":"jué de","记得":"jì de","值得":"zhí de","懂得":"dǒng de","显得":"xiǎn de","晒干":"shài gān","干净":"gān jìng","擦干":"cā gān",
 "还未":"hái wèi","还有":"hái yǒu","还是":"hái shì","还要":"hái yào","还没":"hái méi","还给":"huán gěi","一行":"yì háng","行为":"xíng wéi","银行":"yín háng",
 "着眼镜":"zhe yǎn jìng","戴着":"dài zhe","穿着":"chuān zhe","看着":"kàn zhe","站着":"zhàn zhe","坐着":"zuò zhe","拿着":"ná zhe","睡着":"shuì zháo","着急":"zháo jí",
 "乐器":"yuè qì","音乐":"yīn yuè","快乐":"kuài lè","重要":"zhòng yào","重新":"chóng xīn","一重":"yì chóng","好高骛远":"hào gāo wù yuǎn","爱好":"ài hào","好奇":"hào qí",
 "教导":"jiào dǎo","教室":"jiào shì","请教":"qǐng jiào","教我":"jiāo wǒ","了解":"liǎo jiě","为了":"wèi le","因为":"yīn wèi","为什么":"wèi shén me","作为":"zuò wéi","成为":"chéng wéi",
 "处理":"chǔ lǐ","到处":"dào chù","相处":"xiāng chǔ","空气":"kōng qì","空地":"kòng dì","没有":"méi yǒu","种田":"zhòng tián","种植":"zhòng zhí","种了":"zhòng le","种小":"zhòng xiǎo","种满":"zhòng mǎn","各种":"gè zhǒng","一种":"yì zhǒng","不同":"bù tóng",
 "地写":"de xiě","地跳":"de tiào","地走":"de zǒu","地跑":"de pǎo","地种":"de zhòng","地说":"de shuō","地听":"de tīng","地在":"de zài","地教":"de jiào","地指":"de zhǐ","地点":"dì diǎn","地方":"dì fang",
 "背着":"bēi zhe","答应":"dā ying","当地":"dāng dì","挣得":"zhèng dé","种着":"zhòng zhe","获得":"huò dé","实地":"shí dì","书包":"shū bāo","落叶":"luò yè","降落":"jiàng luò","参加":"cān jiā","参观":"cān guān","便利":"biàn lì","方便":"fāng biàn","发现":"fā xiàn","头发":"tóu fa","正确":"zhèng què",
}
for k,v in PY_FIX.items(): assert len(k)==len(v.split()),(k,v)
load_phrases_dict({k:[[p] for p in v.split()] for k,v in PY_FIX.items()})

def py_of(text):
    """返回每个字的拼音（标点给空字串）"""
    out = [p[0] for p in pinyin(text, style=Style.TONE, neutral_tone_with_five=False, errors=lambda x: [""]*len(x))]
    # pinyin() 对连续非汉字会合并；对齐到逐字
    res=[]; i=0; j=0
    while i < len(text):
        c=text[i]
        if '一'<=c<='鿿':
            res.append(out[j]); j+=1
        else:
            res.append("")
            if j<len(out) and out[j]=="": j+=1  # skip
        i+=1
    # 再按 PY_FIX 覆盖（保险）
    for k,v in sorted(PY_FIX.items(), key=lambda kv:-len(kv[0])):
        for m in re.finditer(re.escape(k), text):
            for n,p in enumerate(v.split()): res[m.start()+n]=p
    # 句末/动词后的「了」「的」「着」「们」等一律轻声
    for i,c in enumerate(text):
        if c=="们": res[i]="men"
        if c in "吗呢吧": res[i]={"吗":"ma","呢":"ne","吧":"ba"}[c]
        if c=="了" and not text[i:i+2]=="了解": res[i]="le"
        if c=="的" and not text[i-1:i+1] in ("目的",): res[i]="de"
        if c=="得" and res[i] in ("dé","děi") and not (text[i:i+2] in ("得到",) or text[i-1:i+1] in ("值得","获得","取得","懂得","挣得")): res[i]="de"
        if c=="得" and text[i-1:i+1] in ("懂得","值得","觉得","记得","显得"): res[i]="de"
        if c=="一": res[i]="yī"
        if c=="不": res[i]="bù"
        if c=="个": res[i]="gè"
        if c=="都" and text[i-1:i+1] not in ("首都",) and text[i:i+2]!="都市": res[i]="dōu"
        if c=="只" and i>0 and text[i-1] in "一两三四五六七八九十几这那每": res[i]="zhī"
        if c=="地" and not any(text[a:a+len(w)]==w for w in ("当地","实地","地方","地点","土地","草地","地上","地图","空地") for a in range(max(0,i-len(w)+1),i+1)): res[i]="de"
    return res

def tokens(text):
    """把 {X} 标记的句子转成 [[字,拼音,是否目标], ...]"""
    plain = re.sub(r"[{}]", "", text); marks=set(); k=0
    for m in re.finditer(r"\{(.)\}", text): marks.add(m.start()-2*k); k+=1
    pys = py_of(plain)
    return [[c, pys[i], 1 if i in marks else 0] for i,c in enumerate(plain)]

# ── 五、六年级：旧资料 ──
html = open(os.path.join(ROOT,"uasa-vocab.html"),encoding="utf-8").read()
def grab(name):
    i=html.find("const "+name); i=html.find("[",i); j=html.find("];",i)+1; return json.loads(html[i:j])
OLD = grab("CONFUSED_CHAR_DATA"); MIXA=grab("CHAR_MIX_A"); MIXB=grab("CHAR_MIX_B"); PASS=grab("CHAR_PASSAGE")
HARD = {"辍","涵","骛"}  # 只在五、六年级出现，较难
def strip(p): return "".join(c for c in unicodedata.normalize("NFD",p) if unicodedata.category(c)!="Mn")
L3_WORDS = {"已":"已经","己":"自己","在":"正在","再":"再见","做":"做功课","作":"作文","带":"带领","戴":"戴帽子","近":"附近","进":"进入",
 "清":"清楚","晴":"晴朗","情":"心情","睛":"眼睛","园":"公园","圆":"圆形","密":"秘密","蜜":"蜂蜜","值":"值得","植":"植物","采":"采访","彩":"精彩",
 "蓝":"蓝色","篮":"篮球","旁":"身旁","傍":"傍晚","辨":"分辨","辩":"辩论","竟":"竟然","竞":"竞赛","需":"需要","须":"必须","既":"既然","即":"立即",
 "历":"经历","厉":"严厉","祥":"吉祥","详":"详细","座":"座位","坐":"坐下","争":"竞争","挣":"挣钱","幸":"幸福","辛":"辛苦","涵":"涵盖","函":"公函",
 "辍":"辍学","缀":"点缀","躁":"急躁","燥":"干燥","骛":"好高骛远","鹜":"趋之若鹜"}
def word_with(ch, sent): return L3_WORDS[ch]
old_pairs=[]
for x in OLD:
    a,b,pa,pb,ea,eb,ta,tb,xa,xb,qs=x
    kind = "same" if pa==pb else "look"
    def conv(q,ans): return re.sub(r"（([^）／]+)／([^）]+)）", "{"+ans+"}", q)
    sents=[conv(q,ans) for q,ans in qs]
    for q,ans in MIXA+MIXB:
        m=re.search(r"（([^）／]+)／([^）]+)）",q)
        if m and {m.group(1),m.group(2)}=={a,b}: sents.append(conv(q,ans))
    old_pairs.append(dict(id="L3-"+a+b, lv=3, kind=kind, hard=a in HARD,
        members=[(a,pa,ea,ta.replace("“","「").replace("”","」"),word_with(a,xa)),(b,pb,eb,tb.replace("“","「").replace("”","」"),word_with(b,xb))],
        sents=sents, ex=[xa,xb]))
old_boss=[]
for txt,ans in PASS:
    al=ans.split("|"); n=[0]
    def f(m): r="{"+al[n[0]]+"}"; n[0]+=1; return r
    old_boss.append(dict(lv=3, text=re.sub(r"（([^）]+)）", f, txt)))

pairs = SRC.PAIRS + old_pairs
boss = SRC.BOSS + old_boss
# 检查：每句目标字必须是该组成员；Boss 目标字必须在同级某组里
out_pairs=[]
for p in pairs:
    mem=[m[0] for m in p["members"]]
    sents=[]
    for s in p["sents"]:
        t=re.findall(r"\{(.)\}",s); assert len(t)==1 and t[0] in mem,(p["id"],s)
        sents.append(tokens(s))
    out_pairs.append(dict(id=p["id"],lv=p["lv"],kind=p["kind"],hard=bool(p.get("hard")),
        m=[dict(c=c,py=py,en=en,tip=tip,w=w,wpy=" ".join(x for x in py_of(w) if x)) for c,py,en,tip,w in p["members"]],
        s=sents))
out_boss=[]
for b in boss:
    toks=tokens(b["text"]); refs=[]
    for i,t in enumerate(toks):
        if t[2]:
            cand=[p["id"] for p in out_pairs if p["lv"]==b["lv"] and any(m["c"]==t[0] for m in p["m"])]
            assert cand,(b,t)
            refs.append([i,cand[0]])
    for t in toks: t[2]=0
    out_boss.append(dict(lv=b["lv"],t=toks,refs=refs))

if "--review" in sys.argv:
    from pypinyin import pinyin as pp
    seen={}
    for p in out_pairs:
        for s in p["s"]+[b["t"] for b in out_boss if False]:
            txt="".join(t[0] for t in s)
            for i,t in enumerate(s):
                h=pp(t[0],heteronym=True,style=Style.TONE)[0]
                if len(h)>1: seen.setdefault(t[0]+":"+t[1],[]).append(txt[max(0,i-3):i+4])
    for b in out_boss:
        txt="".join(t[0] for t in b["t"])
        for i,t in enumerate(b["t"]):
            h=pp(t[0],heteronym=True,style=Style.TONE)[0]
            if len(h)>1: seen.setdefault(t[0]+":"+t[1],[]).append(txt[max(0,i-3):i+4])
    for k in sorted(seen): print(k, len(seen[k]), " | ".join(sorted(set(seen[k]))[:12]))
    sys.exit()

js = "/* 自动生成：preview/chinese/scripts/build_char_detective.py —— 不要手改，改 content/char_detective_src.py 再重跑 */\nwindow.CHAR_DETECTIVE="+json.dumps(dict(pairs=out_pairs,boss=out_boss),ensure_ascii=False,separators=(",",":"))+";\n"
open(os.path.join(ROOT,"preview/chinese/data/char-detective.js"),"w",encoding="utf-8").write(js)
print("pairs",len(out_pairs),"sentences",sum(len(p["s"]) for p in out_pairs),"boss",len(out_boss),{lv:sum(1 for p in out_pairs if p["lv"]==lv) for lv in (1,2,3)})
