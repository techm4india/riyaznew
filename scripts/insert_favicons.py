import os

root_dir = "/Users/mdriyaz/Downloads/riyaz/TECH_M4-main"

html_files = []
for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

favicon_tags = """<head>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="shortcut icon" href="/favicon.ico">"""

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Avoid adding duplicates
    if "apple-touch-icon" in content or "favicon-32x32.png" in content:
        print(f"Favicon tags already exist in {os.path.relpath(file_path, root_dir)}")
        continue
        
    # Replace the <head> tag
    if "<head>" in content:
        new_content = content.replace("<head>", favicon_tags, 1)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Added favicons to {os.path.relpath(file_path, root_dir)}")
    else:
        print(f"Warning: <head> tag not found in {os.path.relpath(file_path, root_dir)}")
