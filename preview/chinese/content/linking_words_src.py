# -*- coding: utf-8 -*-
# 关联词题库 · 内容源档（唯一真实来源；data/*.js 由 scripts/build_content.py 生成）
#
# 写法：词与词之间用空格；可被弄错的位置写成 [词#slot]；需要手动指定拼音写成 词/pinyin
# errors: (slot, 错误写法, 偏误类型, 中文说明, English)
#
# 选句规则（Mint 定）：
#   1. 正确句必须是真实生活中会发生的情境，前后逻辑关系本来就存在，不是为了语法硬造。
#   2. 错误句只收学习者真实常犯的关联词偏误，不为了凑错随便换词。
#      PAIR  搭配错误：只要…才、只有…就、虽然…所以、如果…所以、即使…但是、既然…所以
#      LOGIC 语义误用：果然/竟然、而且/但是、不但没…而且（应为反而）、不是…就是（应为而是）
#      FORM  条件句式错误：无论/不管 + 陈述句（应该用「多」「哪」等表示任何情况）
#      TIME  就/才误用：早、快用「就」；晚、慢用「才」
#   3. 近义词互换（但是/可是、所以/因此、仍然/依然、竟然/居然）不算错误，永远不能出题。

TEACHER_BASIC = [
# ---------- 因为……所以 ----------
dict(f="CAUSE", s="[因为#c1] 早上 的 巴士 一直 不 来 ， [所以#c2] 阿明 叫 了 Grab/Grab 去 上班 。",
 e=[("c1","虽然","PAIR","「虽然」要和「但是」搭配；这里巴士不来是叫Grab的原因","虽然 pairs with 但是; here the bus not coming is the reason.")],
 en="Because the morning bus never came, Ah Ming took a Grab to work."),
dict(f="CAUSE", s="[因为#c1] 高速公路 发生 车祸 ， [所以#c2] 爸爸 比 平时 晚 了 一 个 小时 到家 。",
 e=[("c1","虽然","PAIR","「虽然」不能和「所以」搭配","虽然 can't pair with 所以.")],
 en="Because there was an accident on the highway, Dad got home an hour later than usual."),
# ---------- 虽然……但是 / 却 ----------
dict(f="TURN", s="[虽然#c1] 这 摊 榴莲 比较 贵 ， [但是#c2] 每天 都 有 人 排队 。",
 e=[("c2","所以","PAIR","「虽然」要和「但是」搭配，不能接「所以」","虽然 pairs with 但是, not 所以."),
    ("c1","因为","PAIR","「因为」不能和「但是」搭配","因为 can't pair with 但是.")],
 en="Although this durian stall is pricier, there's a queue every day."),
dict(f="TURN", s="[虽然#c1] 他 是 马来西亚人 ， [但是#c2] 从来 没 吃 过 榴莲 。",
 e=[("c2","所以","PAIR","「虽然」要和「但是」搭配；没吃过榴莲是出乎意料，不是结果","虽然 pairs with 但是; never trying durian is unexpected, not a result.")],
 en="Although he's Malaysian, he has never eaten durian."),
dict(f="TURN", s="[虽然#c1] 阿莉 学 了 两 年 华语 ， 看到 汉字 [却#c2] 还是 很 头痛 。",
 e=[("c1","因为","PAIR","「因为」不能和「却」搭配；学了两年还头痛是反差，不是原因","因为 can't pair with 却; it's a contrast, not a cause.")],
 en="Although Ali has studied Mandarin for two years, Chinese characters still give her a headache."),
dict(f="TURN", s="[虽然#c1] 她 说 自己 不 会 唱歌 ， [但是#c2] 唱 起来 很 好听 。",
 e=[("c1","因为","PAIR","「因为」不能和「但是」搭配","因为 can't pair with 但是.")],
 en="Although she said she can't sing, she actually sings beautifully."),
# ---------- 尽管……还是 ----------
dict(f="CONCESSION", s="[尽管#c1] 医生 叫 他 少 吃 甜 的 ， 他 [还是#c2] 每天 喝 奶茶 。",
 e=[("c1","因为","LOGIC","医生的话和他的做法相反，是让步，不是原因","The doctor's advice contrasts with what he does; it's not a reason.")],
 en="Even though the doctor told him to cut down on sweets, he still drinks milk tea every day."),
# ---------- 而且 / 但是（成对教学） ----------
dict(f="MORE", s="这 间 房 租金 便宜/piányi ， [而且#c1] 走路 到 地铁站 只要 五 分钟 。",
 e=[("c1","但是","LOGIC","便宜和离地铁站近都是优点，没有转折，要用「而且」","Both are advantages — no contrast, so use 而且.")],
 en="This room is cheap, and it's only a five-minute walk to the MRT station."),
dict(f="TURN", s="这 间 房 租金 便宜/piányi ， [但是#c1] 离 地铁站 很 远 ， 每天 要 多 花 一 个 小时 。",
 e=[("c1","而且","LOGIC","便宜是优点，离得远是缺点，前后相反，要用「但是」","Cheap is good, far is bad — that's a contrast, so use 但是.")],
 en="This room is cheap, but it's far from the MRT — an extra hour every day."),
# ---------- 不但……而且 ----------
dict(f="MORE_PAIR", s="这 个 补习 老师 [不但#c1] 教 得 清楚 ， [而且#c2] 很 有 耐心 。",
 e=[("c1","虽然","PAIR","两个都是优点，是递进；「虽然」不能和「而且」搭配","Both are strengths; 虽然 can't pair with 而且.")],
 en="This tutor not only explains clearly, but is also very patient."),
dict(f="MORE_PAIR", s="这 家 店 的 椰浆饭 [不但#c1] 便宜/piányi ， [而且#c2] 分量 很 多 。",
 e=[("c1","虽然","PAIR","便宜和分量多都是优点；「虽然」不能和「而且」搭配","Both are good points; 虽然 can't pair with 而且.")],
 en="The nasi lemak here is not only cheap, but the portions are big."),
# ---------- 不但没……反而 ----------
dict(f="OPPOSITE", s="吃 了 药 以后 ， 感冒 不但 没 好 ， [反而#c1] 更 严重 了 。",
 e=[("c1","而且","LOGIC","结果和预期相反，要用「反而」；「而且」只是再加一点","The result goes against expectation, so use 反而; 而且 just adds.")],
 en="After taking the medicine, the cold didn't get better — it actually got worse."),
# ---------- 如果……就 ----------
dict(f="CONDITION", s="[如果#c1] 明天 还 下 大雨 ， [就#c2] 改成 网上 上课 吧 。",
 e=[("c2","所以","PAIR","「如果」是假设，要和「就」搭配，不能接「所以」","如果 is a hypothesis and pairs with 就, not 所以.")],
 en="If it's still pouring tomorrow, let's switch to online class."),
dict(f="CONDITION", s="[如果#c1] 你 下午 有 空/kòng ， [就#c2] 一起 去 看 新 房子 吧 。",
 e=[("c2","所以","PAIR","「如果」要和「就」搭配","如果 pairs with 就.")],
 en="If you're free this afternoon, let's go see the new house together."),
# ---------- 只要……就 ----------
dict(f="SUFFICIENT", s="[只要#c1] 先 在 网上 预约 ， 到 了 诊所 [就#c2] 可以 直接 看 医生 。",
 e=[("c2","才","PAIR","「只要」和「就」搭配；「才」是和「只有」搭配的","只要 pairs with 就; 才 goes with 只有.")],
 en="As long as you book online first, you can see the doctor straight away at the clinic."),
dict(f="SUFFICIENT", s="[只要#c1] 手机 有 网络 ， 你 [就#c2] 可以 用 这 个 App/App 上课 。",
 e=[("c2","才","PAIR","「只要」和「就」搭配，不是「才」","只要 pairs with 就, not 才.")],
 en="As long as your phone has internet, you can take class with this app."),
dict(f="SUFFICIENT", s="[只要#c1] 按 一下 这 个 按钮 ， 门 [就#c2] 会 打开 。",
 e=[("c2","才","PAIR","「只要」和「就」搭配，不是「才」","只要 pairs with 就, not 才.")],
 en="Just press this button and the door will open."),
# ---------- 只有……才 ----------
dict(f="NECESSARY", s="[只有#c1] 交 了 报名费 ， 名字 [才#c2] 会 出现 在 名单 上 。",
 e=[("c2","就","PAIR","「只有」和「才」搭配；「就」是和「只要」搭配的","只有 pairs with 才; 就 goes with 只要.")],
 en="Only after paying the registration fee will your name appear on the list."),
dict(f="NECESSARY", s="[只有#c1] 每天 开口 说 ， 口语 [才#c2] 会 慢慢 流利 起来 。",
 e=[("c2","就","PAIR","「只有」要和「才」搭配","只有 must pair with 才.")],
 en="Only by speaking every day will your spoken Chinese gradually become fluent."),
# ---------- 即使……也 ----------
dict(f="CONCESSION", s="[即使#c1] 这次 考试 没 考好 ， [也#c2] 不要 放弃 。",
 e=[("c2","但是","PAIR","「即使」要和「也」搭配；「即使……但是」是常见错误","即使 pairs with 也; 即使…但是 is a common mistake.")],
 en="Even if you didn't do well in this exam, don't give up."),
dict(f="CONCESSION", s="[即使#c1] 老板 没有 要求 ， [也#c2] 要 把 报告 检查 两 次 。",
 e=[("c2","但是","PAIR","「即使」要和「也」搭配","即使 pairs with 也.")],
 en="Even if the boss doesn't ask for it, you should check the report twice."),
dict(f="CONCESSION", s="[即使#c1] 只有 一 个 学生 来 ， [也#c2] 要 照常 上课 。",
 e=[("c2","但是","PAIR","「即使」要和「也」搭配","即使 pairs with 也.")],
 en="Even if only one student comes, class goes ahead as usual."),
# ---------- 无论 / 不管 + 任何情况 ----------
dict(f="UNRESTRICTED", s="无论 天气 [多#c1] 热 ， 爷爷 都 坚持 每天 早上 散步 。",
 e=[("c1","很","FORM","「无论」后面要说「任何情况」，用「多热」，不能用「很热」","无论 needs \"however hot\" (多热), not a plain statement (很热).")],
 en="No matter how hot it is, Grandpa insists on a walk every morning."),
dict(f="UNRESTRICTED", s="无论 你 选 [哪#c1] 一 天 ， 我 都 有 空/kòng 。",
 e=[("c1","这","FORM","「无论」后面要有选择，用「哪一天」，不能是确定的「这一天」","无论 needs an open choice (哪一天), not a fixed one (这一天).")],
 en="Whichever day you pick, I'm free."),
dict(f="UNRESTRICTED", s="不管 工作 [多#c1] 忙 ， 他 都 会 回家 吃 晚饭 。",
 e=[("c1","很","FORM","「不管」后面要说「任何情况」，用「多忙」","不管 needs \"however busy\" (多忙), not 很忙.")],
 en="However busy work gets, he always comes home for dinner."),
# ---------- 既然……就 ----------
dict(f="CAUSE_DECISION", s="[既然#c1] 你 已经 买 了 票 ， [就#c2] 一起 去 看 吧 。",
 e=[("c2","所以","PAIR","「既然」后面用「就」提出决定，不用「所以」","既然 is followed by 就 for the decision, not 所以.")],
 en="Since you've already bought the tickets, let's go watch it together."),
dict(f="CAUSE_DECISION", s="[既然#c1] 明天 学校 放假 ， 今天 [就#c2] 不用 准备 功课 了 。",
 e=[("c1","虽然","LOGIC","放假是做决定的理由，不是转折","The holiday is the reason for the decision, not a contrast.")],
 en="Since school is off tomorrow, there's no need to prepare homework today."),
# ---------- 果然 / 竟然 ----------
dict(f="EXPECTED", s="天气 预报 说 傍晚 会 下雨 ， 傍晚 [果然#c1] 下 起 了 大雨 。",
 e=[("c1","竟然","LOGIC","预报已经说了，下雨是意料之中，要用「果然」","The forecast predicted it — expected, so 果然.")],
 en="The forecast said it would rain in the evening, and sure enough it poured."),
dict(f="EXPECTED", s="妈妈 说 那 家 店 的 面 很 好吃 ， 我 一 试 ， [果然#c1] 很 好吃 。",
 e=[("c1","竟然","LOGIC","妈妈已经说过，好吃是意料之中","Mum already said so — it's expected.")],
 en="Mum said that shop's noodles are great; I tried them, and sure enough they were."),
dict(f="SURPRISE", s="阿明 平时 很 少 运动 ， 这次 马拉松 [竟然#c1] 跑 完 了 全程 。",
 e=[("c1","果然","LOGIC","平时很少运动，跑完全程是意料之外，要用「竟然」","He rarely exercises — finishing was a surprise, so 竟然.")],
 en="Ah Ming rarely exercises, yet he actually finished the whole marathon."),
dict(f="SURPRISE", s="我 只是 随便 买 了 一 张 彩票 ， [竟然#c1] 中/zhòng 了 奖 。",
 e=[("c1","果然","LOGIC","随便买的，中奖是意料之外","A random ticket winning is unexpected.")],
 en="I just bought a lottery ticket on a whim, and I actually won."),
# ---------- 就 / 才（时间早晚） ----------
dict(f="TIME", s="阿莉 平常 七 点 就 到 公司 ， 今天 九 点 [才#c1] 到 。",
 e=[("c1","就","TIME","九点比平常晚，晚要用「才」","Nine is later than usual — late takes 才.")],
 en="Ali usually gets to the office at seven, but today she only arrived at nine."),
dict(f="TIME", s="这 份 报告 他 一 个 小时 [就#c1] 写 完 了 ， 大家 都 很 惊讶 。",
 e=[("c1","才","TIME","一个小时就写完是很快，快要用「就」","Finishing in an hour is fast — fast takes 就.")],
 en="He finished this report in just an hour; everyone was amazed."),
# ---------- 不是……而是 ----------
dict(f="CORRECTION", s="我 迟到 不是 因为 睡过头 ， [而是#c1] 因为 地铁 故障 。",
 e=[("c1","就是","LOGIC","「不是……就是……」表示二选一；这里是更正原因，要用「而是」","不是…就是… means either/or; to correct the reason use 而是.")],
 en="I was late not because I overslept, but because the MRT broke down."),
]

# DETECTIVE 短文暂不录音（阅读模式，没有录音也能玩）。以下三篇待 Mint 按同样标准审核后再扩充。
DETECTIVE_BASIC = [
dict(title="下雨 的 星期六",
 s="星期六 下午 ， 美玲 约 了 朋友 去 夜市 。 [因为#s1] 突然 下起 大雨 ， [所以#s2] 她们 先 在 咖啡店 等 雨 停 。 [虽然#s3] 等 了 半 个 小时 ， [但是#s4] 雨 一直 没有 变小 。 她们 只好 改 去 附近 的 商场 吃 晚餐 。",
 slots=dict(
  s1=[("虽然","PAIR","「虽然」不能和「所以」搭配","虽然 can't pair with 所以.")],
  s2=[("但是","PAIR","「因为」不能和「但是」搭配","因为 can't pair with 但是.")],
  s3=[("因为","PAIR","「因为」不能和「但是」搭配","因为 can't pair with 但是.")],
  s4=[("所以","PAIR","「虽然」要和「但是」搭配","虽然 pairs with 但是.")]),
 en="On Saturday afternoon Meiling arranged to go to the night market with a friend. Because heavy rain suddenly started, they first waited in a café. Although they waited half an hour, the rain didn't ease, so they went to a nearby mall for dinner instead.",
 q=("她们 最后 为什么 没有 去 夜市 ？","Why didn't they go to the night market in the end?",
    ["雨 一直 没有 变小","夜市 没有 开","美玲 不 想 见 朋友"])),
dict(title="阿明 的 第一次 面试",
 s="阿明 下个月 有 一 个 面试 。 [只要#s1] 有 空/kòng ， 他 [就#s2] 对着 镜子 练习 自我介绍 。 面试 那天 路上 很 塞车 ， [但是#s3] 他 提早 出门 ， 还是 准时 到 了 。 面试官 [不但#s4] 问 了 他 的 经验 ， [而且#s5] 请 他 用 华语 介绍 自己 。",
 slots=dict(
  s1=[("只有","PAIR","「只有」要和「才」搭配","只有 pairs with 才.")],
  s2=[("才","PAIR","「只要」要和「就」搭配","只要 pairs with 就.")],
  s3=[("而且","LOGIC","塞车是阻碍，提早出门是应对，前后是转折","Traffic is an obstacle; leaving early counters it — a contrast.")],
  s4=[("虽然","PAIR","「虽然」不能和「而且」搭配","虽然 can't pair with 而且.")],
  s5=[("但是","LOGIC","两个都是面试官的要求，是递进，不是转折","Both are the interviewer's requests — they add up, no contrast.")]),
 en="Ah Ming has an interview next month. Whenever he has time, he practises his self-introduction in the mirror. On the day, traffic was bad, but he left early and still arrived on time. The interviewer not only asked about his experience, but also asked him to introduce himself in Mandarin.",
 q=("阿明 为什么 能 准时 到 ？","Why did Ah Ming arrive on time?",
    ["他 提早 出门","路上 不 塞车","面试 延迟 了"])),
dict(title="新年 前 的 超市",
 s="农历新年 快 到 了 ， 超市 里 人 特别 多 。 志豪 想 买 年饼 ， [可是#s1] 他 最 喜欢 的 那种 已经 卖完 了 。 [既然#s2] 买 不 到 ， 他 [就#s3] 决定 回家 自己 做 。 [虽然#s4] 第一次 做 得 不 太 好看 ， 家人 [却#s5] 都 说 很 好吃 。",
 slots=dict(
  s1=[("而且","LOGIC","想买和卖完了是冲突，要用转折","Wanting it vs. sold out is a conflict — use a contrast word.")],
  s2=[("虽然","LOGIC","买不到是做决定的理由，不是让步","Not finding them is the reason for his decision.")],
  s3=[("所以","PAIR","「既然」后面用「就」提出决定","既然 is followed by 就.")],
  s4=[("因为","LOGIC","不好看和好吃是反差，不是原因","Not pretty vs. tasty is a contrast, not a cause.")],
  s5=[("所以","PAIR","「虽然」不能和「所以」搭配","虽然 can't pair with 所以.")]),
 en="Chinese New Year is coming and the supermarket is packed. Zhihao wanted to buy New Year cookies, but his favourite kind was sold out. Since he couldn't buy them, he decided to make them at home. Although his first batch didn't look great, his family all said they were delicious.",
 q=("志豪 为什么 自己 做 年饼 ？","Why did Zhihao make the cookies himself?",
    ["他 喜欢 的 那种 卖完 了","超市 没有 开","家人 叫 他 做"])),
]