#!/usr/bin/env python3
"""
Gera aurora-artifact.html: uma versão 100% autocontida do site (CSS/JS
inline, imagens em data URI) para publicar via Artifact tool. Rodar depois
de qualquer mudança em index.html, src/input.css (recompilado) ou js/script.js.

Uso: python3 build_artifact.py
"""
import re, base64, mimetypes, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with open('index.html', encoding='utf-8') as f:
    html = f.read()
with open('css/tailwind.css', encoding='utf-8') as f:
    css = f.read()
with open('js/script.js', encoding='utf-8') as f:
    js = f.read()

def encode_image(path):
    mime, _ = mimetypes.guess_type(path)
    with open(path, 'rb') as f:
        data = base64.b64encode(f.read()).decode('ascii')
    return f"data:{mime};base64,{data}"

for p in sorted(set(re.findall(r'src="(assets/[^"]+)"', html))):
    html = html.replace(f'src="{p}"', f'src="{encode_image(p)}"')

head_content = re.search(r'<head>(.*?)</head>', html, re.S).group(1)
head_content = re.sub(r'\s*<link rel="stylesheet" href="css/tailwind\.css">\s*', '\n', head_content)
head_content = re.sub(r'<meta charset="UTF-8">\s*', '', head_content)
head_content = re.sub(r'<meta name="viewport"[^>]*>\s*', '', head_content)

body_match = re.search(r'<body[^>]*class="([^"]*)"[^>]*>(.*)</body>', html, re.S)
body_class, body_content = body_match.group(1), body_match.group(2)
body_content = body_content.replace('<script src="js/script.js"></script>', f'<script>\n{js}\n</script>')

final = "\n".join([
    head_content.strip(),
    f'<style>\n{css}\n</style>',
    f'<div class="{body_class}">',
    body_content,
    '</div>',
])

with open('aurora-artifact.html', 'w', encoding='utf-8') as f:
    f.write(final)
print(f"aurora-artifact.html gerado ({len(final):,} bytes)")
