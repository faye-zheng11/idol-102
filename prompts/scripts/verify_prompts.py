#!/usr/bin/env python3
"""反向抽取比对：文档 native 正文逐行应为源码字符串的子串（掏空占位符、归一空白后）。

用法：python3 scripts/verify_prompts.py
源码事实源默认取邻仓 ../oppaya-spring-boot-biz-idol102，可用环境变量 IDOL102_REPO 覆盖。
预期仅 scene.html F6 的「/」并排骨架行未命中（有意的结构化缩写）。
"""
import html
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = Path(os.environ.get("IDOL102_REPO", ROOT.parent / "oppaya-spring-boot-biz-idol102"))
BASE = REPO / "api-app/src/main/java/app/oppaya/biz/idol102"

SOURCES = [
    BASE / "facade/chat/CharacterReplyContentBuilder.java",
    BASE / "facade/chat/MemoryPromptAssembler.java",
    BASE / "facade/memory/WriteJudgmentFacadeService.java",
    BASE / "facade/trigger/TriggerEventMatchFacadeService.java",
    BASE / "facade/scene/SceneDirectorContentBuilder.java",
    BASE / "facade/scene/SceneOpeningFacadeService.java",
    BASE / "facade/scene/SceneRuntimeSummaryFacadeService.java",
    BASE / "facade/scene/SceneClosingWriter.java",
    BASE / "facade/location/LocationMomentSummaryFacadeService.java",
    BASE / "facade/location/LocationSceneFollowupFacadeService.java",
    BASE / "facade/location/LocationSessionMessageFacadeService.java",
    BASE / "service/scene/SceneContextBuilder.java",
    BASE / "service/chat/ChatSubtitleTranslator.java",
    BASE / "service/impl/chat/GptReplyModalityDecider.java",
]


def normalize_java(text: str) -> str:
    # 按序抽取字符串字面量拼接：text block 优先，剩余部分取普通字面量，消除一切拼接缝
    blocks = re.findall(r'"""(.*?)"""', text, re.S)
    rest = re.sub(r'"""(.*?)"""', "", text, flags=re.S)
    literals = re.findall(r'"((?:[^"\\\n]|\\.)*)"', rest)
    s = "".join(blocks) + "".join(literals)
    s = s.replace('\\"', '"')
    s = re.sub(r"\s+", "", s)
    s = s.replace("\\n", "")
    s = s.replace("%%", "%")
    s = s.replace("%s", "")
    s = s.replace("{p}", "")
    return s


def normalize_doc_line(line: str) -> str:
    # 去 cm 注释、掏空 ph 占位、剥标签、反转义、去空白
    line = re.sub(r'<span class="cm">.*?</span>', "", line)
    line = re.sub(r'<span class="ph">.*?</span>', "", line)
    line = re.sub(r"<[^>]+>", "", line)
    line = html.unescape(line)
    return re.sub(r"\s+", "", line)


missing_sources = [p for p in SOURCES if not p.exists()]
if missing_sources:
    print("源码文件缺失（检查邻仓路径或 IDOL102_REPO）:")
    for p in missing_sources:
        print(f"  {p}")
    sys.exit(2)

java_all = normalize_java("".join(p.read_text(encoding="utf-8") for p in SOURCES))

miss = 0
for page in ("chat.html", "scene.html", "media.html"):
    content = (ROOT / page).read_text(encoding="utf-8")
    # 逐个 .rb 条目：捕获 native 语言与其后所有 pre 块
    entries = re.split(r'(<div class="rb"[^>]*>)', content)
    i = 1
    while i < len(entries):
        rb_tag, chunk = entries[i], entries[i + 1]
        native = re.search(r'data-native="(\w+)"', rb_tag)
        entry_id = re.search(r'<span class="id">(.*?)</span>', chunk)
        eid = entry_id.group(1) if entry_id else "?"
        if native:
            pre = re.search(
                r'<pre class="v" data-lang="%s"><code>(.*?)</code></pre>' % native.group(1),
                chunk, re.S)
            if pre:
                for raw in pre.group(1).split("\n"):
                    # 整行是注释/占位骨架的跳过
                    if re.match(r'\s*<span class="cm">', raw) and "</span>" in raw and not re.sub(
                            r'<span class="cm">.*?</span>', "", raw).strip():
                        continue
                    norm = normalize_doc_line(raw)
                    if not norm or norm in ("---", "…"):
                        continue
                    if norm not in java_all:
                        miss += 1
                        print(f"[MISS] {page} {eid}: {raw.strip()[:110]}")
        i += 2

print(f"\n未命中行数: {miss}")
