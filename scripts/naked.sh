#!/bin/bash
# script to remove stylesheets, style tags, and inline styles from an HTML file
# 1. remove <link rel="stylesheet" ...>
# 2. remove <style> ... </style>
# 3. remove style="..." attributes
# notes:
#   perl "0777" is so that perl sees newlines as "any character" (so <link> can wrap onto new lines)
#   "|gms" helps with the same thing. see https://regex101.com/
# example:
#   ./naked.sh index.html > index-naked.html
# to modify a file in place you must use a temporary file, because of how bash does redirection
#   ./naked.sh index.html > index.html.temp && mv index.html.temp index.html
# to change lots of files, use `find` and `xargs`
#  e.g., find all files ending with ".html" and replace them with the output of this script
#   find . -name "*.html" -print0 | xargs -0 -i bash -c './scripts/naked.sh "{}" > "{}.temp" && mv "{}.temp" "{}"'

cat "$1" | perl -0777pe 's|<link[^>]*rel="stylesheet"[^>]*/>||gms' | perl -0777pe 's|<style>.*?</style>||gms' | perl -0777pe 's|style="[^"]*"||gms'
