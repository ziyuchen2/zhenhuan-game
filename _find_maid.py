# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

f = open('index.html', 'r', encoding='utf-8')
lines = f.readlines()
f.close()

girl = '\U0001f467'      # 👧
princess = '\U0001f478'   # 👸

for i, line in enumerate(lines, 1):
    if girl in line or princess in line:
        emoji_type = 'girl' if girl in line else 'princess'
        # Truncate for readability
        clean = line.rstrip()[:200]
        print(f'Line {i} [{emoji_type}]: {clean}')
