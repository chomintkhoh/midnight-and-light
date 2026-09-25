# 用法：先 node -e 'global.window={};require("./preview/data/linking-words-masterdeck.js");require("fs").writeFileSync("deck.json",JSON.stringify(window.LINKING_WORDS_MASTER_DECK))'
# 再 pip install pypinyin && python3 preview/chinese/scripts/build_deck_tokens.py，输出 deck-tokens.js（移到 preview/chinese/data/linking-words/）
import json,re
from pypinyin import pinyin, Style
from pypinyin.contrib.tone_convert import to_tone
D=json.load(open("deck.json",encoding="utf-8"))
PUN=set("，。！？；：、“”‘’（）…—")
# 按词覆盖（轻声、专名、多音字常见错）
FIX={"东西":["dōng","xi"],"朋友":["péng","you"],"清楚":["qīng","chu"],"舒服":["shū","fu"],"还是":["hái","shi"],"晚上":["wǎn","shang"],
"早上":["zǎo","shang"],"路上":["lù","shang"],"喜欢":["xǐ","huan"],"觉得":["jué","de"],"时候":["shí","hou"],"知道":["zhī","dao"],"妈妈":["mā","ma"],
"爸爸":["bà","ba"],"哥哥":["gē","ge"],"姐姐":["jiě","jie"],"弟弟":["dì","di"],"妹妹":["mèi","mei"],"便宜":["pián","yi"],"意思":["yì","si"],"休息":["xiū","xi"],"事情":["shì","qing"],
"漂亮":["piào","liang"],"认识":["rèn","shi"],"衣服":["yī","fu"],"地方":["dì","fang"],"消息":["xiāo","xi"],"麻烦":["má","fan"],"客气":["kè","qi"],"关系":["guān","xi"],"头发":["tóu","fa"]}
def conv(s):
    raw=[x[0] for x in pinyin(s,style=Style.TONE3,neutral_tone_with_five=True,errors=lambda c:[c])]
    chars=list(s)
    # 覆盖词
    for w,p in FIX.items():
        for m in re.finditer(w,s):
            for k,v in enumerate(p): raw[m.start()+k]=v
    # 一/不 变调
    def tone(i):
        return raw[i][-1] if i<len(raw) and raw[i][-1:].isdigit() else None
    for i,c in enumerate(chars):
        if c not in "一不": continue
        n=tone(i+1); prev=chars[i-1] if i else ""
        if c=="不": raw[i]="bu2" if n=="4" else "bu4"
        else:
            if prev=="第" or n is None or (i+1<len(chars) and chars[i+1] in "十二三四五六七八九〇零"): raw[i]="yi1"
            else: raw[i]="yi2" if n=="4" else "yi4"
    for i,c in enumerate(chars):
        nx=chars[i+1] if i+1<len(chars) else "";pv=chars[i-1] if i else ""
        if c=="都" and pv+c not in ("首都",) and c+nx!="都市": raw[i]="dou1"
        if c=="得" and nx not in "到出" and pv not in "获取": raw[i]="de5"
        if c=="地" and nx not in "图方铁区点址球上下面": raw[i]="de5"
    out=[]
    for c,r in zip(chars,raw):
        if c in PUN or not re.match(r"[一-鿿]",c): out.append([c,""])
        else: out.append([c,to_tone(r.replace("5","")) if r[-1].isdigit() else r])
    # 连续英文/数字合并为一个 token
    m=[]
    for t in out:
        if m and not t[1] and t[0] not in PUN and m[-1][0] not in PUN and not m[-1][1] and re.match(r"[A-Za-z0-9]",t[0]): m[-1][0]+=t[0]
        else: m.append(t)
    return m
POLY=set("还得都了着地长重行便觉只为好空教发乐更干调种数处少")
res={};review=[]
for x in D:
    res[x["id"]]={}
    for lv in ("basic","mixed","challenge"):
        t=conv(x[lv]);res[x["id"]][lv]=t
        for c,p in t:
            if c in POLY: review.append((c,p,x[lv]))
open("deck-tokens.js","w",encoding="utf-8").write("// 由 deck_tokens.py 从 linking-words-masterdeck.js 生成：逐字 [汉字, 拼音]；多音字已人工规则处理，仍需 Mint 抽查\nwindow.ML_DECK_TOKENS="+json.dumps(res,ensure_ascii=False)+";\n")
from collections import Counter
cnt=Counter((c,p) for c,p,_ in review)
print(len(res),"cards ×3"); print(sorted(cnt.items(),key=lambda k:k[0]))
for c,p,s in review:
    if (c,p) in [("还","huán"),("得","dé"),("得","děi"),("地","dì"),("着","zháo"),("着","zhuó"),("了","liǎo"),("行","háng"),("长","zhǎng"),("重","chóng"),("只","zhī"),("为","wéi"),("好","hào"),("空","kōng"),("种","zhòng"),("调","diào"),("数","shǔ"),("处","chù"),("少","shào"),("都","dū"),("干","gān"),("教","jiāo"),("发","fà"),("乐","yuè"),("更","gēng"),("便","pián"),("觉","jiào")]:
        print("  CHECK",c,p,"|",s)
