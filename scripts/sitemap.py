# finds every html file and makes a sitemap

import os
import re
import sys


def find_html_files():
    """finds every html file in the current directory and subdirectories

    Returns:
        list[str]: list of html files
    """
    skip_dirs = ["node_modules"]
    html_files = []
    for root, dirs, files in os.walk(os.getcwd()):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for file in files:
            if file.endswith(".html"):
                relative_path = os.path.relpath(root, os.getcwd())
                html_files.append(os.path.join(relative_path, file))
    return html_files


def main(out_file):
    """Replace the <div id="sitemap"></div> in the given file with a sitemap
    Sitemap is a list of links in the format
    - ./
    - ./named_file.html
      - ./subpage
      - ./subpage/more_content.html
        - ./subpage/subsubpage

    Args:
        out_file (str): file to write the sitemap to
    """
    html_files = find_html_files()
    tree = "<ul>\n"
    depth = 1
    for file in html_files:
        if file[:2] != ".\\":
            file = ".\\" + file
        file = file.replace("\\", "/")
        if file.count("/") > depth:
            tree += "<ul>\n"
            depth += 1
        elif file.count("/") < depth:
            tree += "</ul>\n"
            depth -= 1
        # if file ends in "/index.html", strip it, unless it's the root
        if re.search(r"/index\.html$", file) and file != "./index.html":
            file = file[:-11]
        tree += f"<li><a href='{file}'>{file}</a></li>\n"
    while depth >= 1:
        tree += "</ul>\n"
        depth -= 1

    with open(out_file, "r") as f:
        content = f.read()
    # put tree inside <div id="sitemap">...</div>
    content = re.sub(
        r"<div id=\"sitemap\">.*</div>",
        f'<div id="sitemap">\n{tree}</div>',
        content,
        flags=re.DOTALL,
    )
    with open(out_file, "w") as f:
        f.write(content)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        print("No output file specified")