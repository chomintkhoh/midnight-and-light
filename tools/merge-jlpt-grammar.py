"""把 data/jlpt-grammar-additions.json 的文法和练习题写进 JLPT 页面内嵌的题库。
重复执行也安全：同一个 ID 会先删掉再加回去。
用法：python3 tools/merge-jlpt-grammar.py
"""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / "jlpt-n5-n4-practice-v7-standalone.html"
ADD = json.loads((ROOT / "data" / "jlpt-grammar-additions.json").read_text(encoding="utf-8"))
KEY = "window.__JLPT_DATA__="

s = PAGE.read_text(encoding="utf-8")
i = s.index(KEY) + len(KEY)
data, end = json.JSONDecoder().raw_decode(s[i:])

LEVEL = {"N5": "N5 Core", "N4": "N4 New / Expansion"}
ids = {g["id"] for g in ADD["grammar"]}
qids = {"GQ-ADD-" + g["id"][4:] for g in ADD["grammar"]}
data["grammar"] = [g for g in data["grammar"] if g["ID"] not in ids]
data["questions"] = [q for q in data["questions"] if q.get("id") not in qids]

for g in ADD["grammar"]:
    data["grammar"].append({
        "ID": g["id"], "Grammar / Function": g["name"], "Category": g["cat"],
        "Level path": LEVEL[g["lv"]], "Formation / Connection": g["form"],
        "Meaning / Function": g["meaning"], "Usage / Nuance": g["usage"],
        "Teaching example": g["ex"], "Prerequisite": g["pre"],
        "Common mistake": g["mistake"], "Contrast / Related": g["contrast"],
        "N5 evidence": "Yes" if g["lv"] == "N5" else "No",
        "N4 evidence": "Yes" if g["lv"] == "N4" else "No",
        "Source basis": "Mint checklist (old 4級／3級 grammar book), own examples",
        "Enrichment basis": "Written 2026-10-03",
        "Teaching priority": g["lv"] + " Must know", "Status": "Complete",
    })
    q = g["q"]
    data["questions"].append({
        "t": g["lv"].lower(), "q": q["q"], "o": q["o"], "a": 0, "e": q["e"], "e_en": q["e_en"],
        "id": "GQ-ADD-" + g["id"][4:], "type": "grammar", "lv": g["lv"],
    })

out = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
PAGE.write_text(s[:i] + out + s[i + end:], encoding="utf-8")
print(f"grammar {len(data['grammar'])} · questions {len(data['questions'])}")
