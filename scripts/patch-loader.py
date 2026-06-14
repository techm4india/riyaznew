#!/usr/bin/env python3
"""Patch all HTML pages: fix loader black screen + link shared assets."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

HEAD_SNIPPET = """<script>(function(){try{var n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];if(sessionStorage.getItem('tm4_loader_seen')||(n&&n.type!=='navigate'))document.documentElement.classList.add('skip-loader');}catch(e){}})();</script>
<link href="assets/responsive-base.css" rel="stylesheet"/>
"""

SITE_INIT = '<script src="assets/site-init.js"></script>'

UNIFIED_PATTERN = re.compile(
    r'\n// ===== UNIFIED ROBUST SYSTEM SCRIPTS =====\n\(function\(\) \{[\s\S]*?\}\)\(\);\n',
    re.MULTILINE,
)

def patch_file(path: Path) -> bool:
    text = path.read_text(encoding='utf-8')
    original = text

    if 'assets/responsive-base.css' not in text:
        if '</head>' in text:
            text = text.replace('</head>', HEAD_SNIPPET + '</head>', 1)
        elif '</link></head>' in text:
            text = text.replace('</link></head>', '</link>\n' + HEAD_SNIPPET + '</head>', 1)

    if 'assets/site-init.js' not in text:
        m = UNIFIED_PATTERN.search(text)
        if m:
            text = text[: m.start()] + '\n' + SITE_INIT + '\n' + text[m.end() :]

    # Remove standalone body opacity on load (outside site-init)
    text = re.sub(
        r"\n\s*document\.body\.style\.opacity\s*=\s*'0';\s*\n\s*setTimeout\(function\(\)\s*\{[\s\S]*?document\.body\.style\.opacity\s*=\s*'1';\s*\n\s*\},\s*100\);\n",
        '\n',
        text,
    )

    if text != original:
        path.write_text(text, encoding='utf-8')
        return True
    return False


def main():
    updated = []
    for html in sorted(ROOT.glob('*.html')):
        if html.name == 'admin.html':
            continue  # admin may have different setup
        if patch_file(html):
            updated.append(html.name)
    print('Updated:', ', '.join(updated) if updated else 'none')


if __name__ == '__main__':
    main()
