# -*- coding: utf-8 -*-
# 用法：pip install pypinyin，然后 python3 preview/chinese/scripts/build_content.py
# 改内容只改 content/linking_words_src.py，再跑这个脚本；不要手改 data/*.js
import json,re,sys,os
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.dirname(HERE)
from pypinyin import pinyin, Style
from pypinyin.contrib.tone_convert import to_tone
exec(open(os.path.join(ROOT,"content","linking_words_src.py"),encoding="utf-8").read())
PUNCT=set("，。！？；：、")
def syl(word):
    return [x[0] for x in pinyin(word,style=Style.TONE3,neutral_tone_with_five=True)]
def sandhi(words):
    flat=[(wi,ci) for wi,(hz,s) in enumerate(words) for ci in range(len(s))]
    for k,(wi,ci) in enumerate(flat):
        hz,s=words[wi]; ch=hz[ci] if len(hz)==len(s) else None
        if ch not in ("一","不"): continue
        nxt=None
        if k+1<len(flat):
            nwi,nci=flat[k+1]
            if nwi==wi or words[nwi][0] not in PUNCT: nxt=words[nwi][1][nci]
        prev=hz[ci-1] if ci>0 else (words[wi-1][0][-1] if wi>0 else "")
        t=nxt[-1] if nxt and nxt[-1].isdigit() else None
        if ch=="不": s[ci]="bu2" if t=="4" else "bu4"
        else:
            if prev=="第" or t is None or t=="5": s[ci]="yi1"
            else: s[ci]="yi2" if t=="4" else "yi4"
    return words
def fmt(s): return "".join(to_tone(x.replace("5","")) if x[-1].isdigit() else x for x in s)
FIX={"爸爸":"bàba","妈妈":"māma","爷爷":"yéye","名字":"míngzi","马来西亚人":"Mǎláixīyàrén","反而":"fǎn'ér","早上":"zǎoshang","上":"shang","起来":"qǐlai","过":"guo","唱":"chàng","哥哥":"gēge","新年":"Xīnnián","喜欢":"xǐhuan","所以不":"suǒyǐ bù","但是不":"dànshì bù","也不":"yě bù","妹妹":"mèimei","弟弟":"dìdi","舒服":"shūfu","清楚":"qīngchu","还是":"háishi","晚上":"wǎnshang","路上":"lùshang","外面":"wàimian",
"个":"ge","答案":"dá'àn","小明":"Xiǎomíng","阿莉":"Ālì","美玲":"Měilíng","志豪":"Zhìháo","阿明":"Āmíng","华语":"Huáyǔ","日语":"Rìyǔ","空":"kòng",
"朋友":"péngyou","东西":"dōngxi","得":"de","农历新年":"Nónglì Xīnnián","咖啡店":"kāfēidiàn","面试官":"miànshìguān","自我介绍":"zìwǒ jièshào","家人":"jiārén","年饼":"niánbǐng","觉得":"juéde","那种":"nà zhǒng","种":"zhǒng"}
POLY=set("还得都了着地长重行便觉只为好空教发乐更")
review=[]
def tokenize(src, sid):
    words=[]
    for w in src.split():
        m=re.match(r"^\[(.+)#(\w+)\]$",w)
        hz,slot,role=(m.group(1),m.group(2),"connector") if m else (w,"","")
        if "/" in hz:
            hz,py=hz.split("/"); words.append([hz,None,role,slot,py]); continue
        words.append([hz,(syl(hz) if hz not in PUNCT else []),role,slot,None])
    core=[[w[0],w[1]] for w in words if w[1] is not None]
    sandhi(core)
    out=[]
    for w in words:
        if w[4] is not None: py=w[4]
        elif w[0] in PUNCT: py=""
        elif w[0] in FIX: py=FIX[w[0]]
        else: py=fmt(w[1])
        if any(c in POLY for c in w[0]): review.append(f"{sid}\t{w[0]}\t{py}")
        out.append([w[0],py,w[2],w[3]])
    return out
def wordpy(hz):
    if hz in FIX: return FIX[hz]
    return fmt(sandhi([[hz,syl(hz)]])[0][1])
def qtoks(src): return [t[:2] for t in tokenize(src,"q")]
teacher=[]
for n,sc in enumerate(TEACHER_BASIC):
    sid=f"TS-B-{n+1:02d}"
    toks=tokenize(sc["s"],sid)
    slots={t[3]:t[0] for t in toks if t[3]}
    errs=[]
    for (sl,wrong,typ,why,en) in sc["e"]:
        assert sl in slots,(sid,sl); assert wrong!=slots[sl]
        errs.append([sl,wrong,wordpy(wrong),typ,why,en])
    teacher.append(dict(id=sid,level="basic",family=sc["f"],tokens=toks,en=sc["en"],errors=errs,
        audio=dict(correct=sid.lower()+"-ok.mp3",errors=[f"{sid.lower()}-e{i+1}.mp3" for i in range(len(errs))])))
det=[]
for n,c in enumerate(DETECTIVE_BASIC):
    cid=f"DC-B-{n+1:02d}"
    toks=tokenize(c["s"],cid)
    corr={t[3]:(t[0],t[1]) for t in toks if t[3]}
    slots={}
    for sl,errs in c["slots"].items():
        assert sl in corr,(cid,sl)
        slots[sl]=dict(correct=corr[sl][0],correctPy=corr[sl][1],errors=[[w,wordpy(w),t,y,e] for (w,t,y,e) in errs])
    assert set(slots)==set(corr),(cid,set(corr)-set(slots))
    q,qEn,opts=c["q"]
    det.append(dict(id=cid,level="basic",title=c["title"].replace(" ",""),titleTokens=qtoks(c["title"]),tokens=toks,en=c["en"],slots=slots,
        question=dict(q=qtoks(q),qEn=qEn,options=[qtoks(o) for o in opts],answer=0)))
open(os.path.join(ROOT,"data","linking-words","teacher-scenes.js"),"w",encoding="utf-8").write(
 "// 由 scripts/build_content.py 从 content_src.py 生成，请勿手改\n(()=>{const openers="+json.dumps([
 "同学们，这句老师很有把握！","来，这一句很简单。","注意听，老师不会说错的。","这一题老师闭着眼睛都会。","今天老师状态很好，听清楚。",
 "这句肯定没有问题。","来挑战老师看看。","我先说，你来判断。","准备好了吗？听这一句。","老师先来示范一次。"],ensure_ascii=False)+
 ",praise="+json.dumps(["……被你发现了，你真厉害！","好眼力！老师服了。","答对了，这次算你厉害。","不错，逻辑抓得很准！","漂亮，这个错误藏不住。",
 "对，就是这里！","你比老师还仔细。","完全正确，继续！","这一分抓得很稳。","很好，你真的听懂关系了。"],ensure_ascii=False)+
 ",tease="+json.dumps(["嘿嘿，这次是你被老师抓到了。","差一点，再看清楚逻辑。","再想想前后是什么关系。","这次红笔要出场了。","别急，先看原因和结果。",
 "差一点点，再来。","这个搭配还要再检查。","被老师绕进去了吧？","下一题把这一分拿回来。"],ensure_ascii=False)+
 ",teaseRight=\"老师这次可没有说错哦。\""+
 ";const scenes="+json.dumps(teacher,ensure_ascii=False)+";window.ML_TEACHER_SCENES={openers,praise,tease,teaseRight,scenes};})();\n")
open(os.path.join(ROOT,"data","linking-words","detective-cases.js"),"w",encoding="utf-8").write("// 由 scripts/build_content.py 从 content_src.py 生成，请勿手改\nwindow.ML_DETECTIVE_CASES="+json.dumps(det,ensure_ascii=False)+";\n")
open(os.path.join(ROOT,"content","pinyin-review.tsv"),"w",encoding="utf-8").write("\n".join(review))
print(len(teacher),"teacher",len(det),"detective; review lines",len(review))
