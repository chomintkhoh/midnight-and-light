/* =====================================================================
   Midnight & Light — Greetings & everyday phrases (kids track)
   Mint's own recordings, one file per phrase.
   Each phrase:
     id     : file name in assets/audio/japanese/greetings/
     jp     : the phrase
     scene  : emoji picture of the situation
     when   : [English, 中文] — the situation (what the student sees in a quiz)
     mean   : [English, 中文] — what the phrase means
   audio    : list of files played in order (わたしは＿です = two files)
   ===================================================================== */
const GREETINGS=[
 {id:"ohayou",jp:"おはようございます",scene:"🌅👋",when:["You meet your teacher in the morning.","早上见到老师。"],mean:["Good morning (polite)","早安（礼貌）"]},
 {id:"konnichiwa",jp:"こんにちは",scene:"☀️👋",when:["You meet someone in the afternoon.","下午见到别人。"],mean:["Hello / Good afternoon","你好／午安"]},
 {id:"konbanwa",jp:"こんばんは",scene:"🌙👋",when:["You meet someone in the evening.","晚上见到别人。"],mean:["Good evening","晚上好"]},
 {id:"arigatou",jp:"ありがとうございます",scene:"🎁🙏",when:["Someone gives you a present.","别人送你礼物。"],mean:["Thank you (polite)","谢谢（礼貌）"]},
 {id:"sayounara",jp:"さようなら",scene:"🏫👋",when:["School is over. Say goodbye to your teacher.","放学了，跟老师说再见。"],mean:["Goodbye","再见"]},
 {id:"watashiwa",jp:"わたしは ＿＿ です",scene:"🙋",when:["Introduce yourself: say your name.","自我介绍：说出你的名字。"],mean:["I am ＿＿.","我是＿＿。"],audio:["watashiwa","desu"]},
 {id:"oyasumi",jp:"おやすみなさい",scene:"🛏️😴",when:["It's bedtime. Say good night.","要睡觉了，说晚安。"],mean:["Good night","晚安"]},
 {id:"matane",jp:"またね",scene:"🧒👋🧒",when:["Say bye to your friend after playing.","玩完了，跟朋友说拜拜。"],mean:["See you! (casual)","拜拜！（朋友之间）"]},
 {id:"gomennasai",jp:"ごめんなさい",scene:"💥😣",when:["You broke your friend's toy.","你弄坏了朋友的玩具。"],mean:["I'm sorry","对不起"]},
 {id:"sumimasen",jp:"すみません",scene:"🙋‍♀️❓",when:["Excuse me! You want to ask a stranger something.","不好意思！你想问陌生人一件事。"],mean:["Excuse me / Sorry","不好意思"]},
 {id:"wakarimashita",jp:"わかりました",scene:"💡👍",when:["The teacher explains. Now you understand.","老师解释完，你懂了。"],mean:["I understand / OK","我明白了"]},
 {id:"itadakimasu",jp:"いただきます",scene:"🍱🙏",when:["Before you start eating.","开动吃饭之前。"],mean:["(said before eating)","我开动了"]},
 {id:"gochisousama",jp:"ごちそうさまでした",scene:"🍽️😋",when:["You finished eating.","吃饱了，吃完饭。"],mean:["(said after eating) Thank you for the meal","我吃饱了／谢谢款待"]},
 {id:"ittekimasu",jp:"いってきます",scene:"🏠➡️🏫",when:["You leave home to go to school.","你出门去上学。"],mean:["I'm off! (leaving home)","我出门了"]},
 {id:"itterasshai",jp:"いってらっしゃい",scene:"👩👋🧒",when:["Your family member is leaving home. Say bye to them.","家人要出门，你送他们。"],mean:["Have a good day! (to someone leaving)","路上小心／慢走"]},
 {id:"tadaima",jp:"ただいま",scene:"🏫➡️🏠",when:["You come home from school.","你放学回到家。"],mean:["I'm home!","我回来了"]},
 {id:"okaerinasai",jp:"おかえりなさい",scene:"👩🤗🧒",when:["Your family member comes home. Welcome them.","家人回到家，你迎接他们。"],mean:["Welcome home","你回来啦"]},
 {id:"hai",jp:"はい",scene:"🙆",when:["Say yes.","说「是」。"],mean:["Yes","是"]},
 {id:"iie",jp:"いいえ",scene:"🙅",when:["Say no.","说「不是」。"],mean:["No","不是"]},
 {id:"chottomatte",jp:"ちょっと まって ください",scene:"✋⏳",when:["Your friend is walking too fast. Ask them to wait.","朋友走太快，请他等一下。"],mean:["Please wait a moment","请等一下"]},
 {id:"damedesu",jp:"ダメです",scene:"🚫",when:["Someone wants to do something not allowed. Say no!","有人要做不可以做的事，说不行！"],mean:["No! / Not allowed","不行"]},
 {id:"daijoubu",jp:"だいじょうぶです。",scene:"👌🙂",when:["Someone asks if you're hurt. You're fine.","别人问你有没有受伤，你没事。"],mean:["I'm OK.","我没事。"]},
 {id:"daijoubuka",jp:"だいじょうぶですか。",scene:"🤕❓",when:["Your friend falls down. Ask if they are OK.","朋友跌倒了，问他还好吗。"],mean:["Are you OK?","你还好吗？"]}
];
