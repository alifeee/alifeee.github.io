a#!/bin/bash
# generate HTML from markdown,
#  then replace all lines between START_CONTENT and END_CONTENT with this HTML
#  in the file INDEX_FILE
# requires python markdown extension
#  pip3 install --user markdown
#  example:
#    python3 -m markdown -x def_list images.md
# usage:
#  ./build.sh content.md

set -e

date >> /dev/stderr

# check markdown is installed
python3 -c "import markdown" && echo "python markdown is instaled!" > /dev/stderr || (echo "markdown not installed, run: pip3 install --user markdown" && exit 1)

echo "found" $(find . -name "*.md" | wc -l) "files" >> /dev/stderr

# main content
LISTFILE="/tmp/list2i8yt7gw.html"
printf "" > $LISTFILE

# table of contents
contents="<ul>"

for file in *.md; do
  # notify script runner
  echo "  transforming ${file}" >> /dev/stderr

  # get name without file extensions
  sectionname=$(basename "${file%.*}")

  # add to contents
  contents="${contents}<li><a href=\"#${sectionname}\">${sectionname}</a></li>"

  last_edited=$(git log -1 --pretty="format:%ci" "${file}")

  # create section
  cat >> $LISTFILE << EOF
  <section>
  <h2 id="${sectionname}">
    ${sectionname}
    <a href="#${sectionname}">#</a>
    <span class=fade>
    from <a href="${file}">${file}</a>
    </span>
  </h2>
  <h3 class="last-edited">last edited: ${last_edited}</h3>
EOF
  python3 -m markdown -x def_list "${file}" >> $LISTFILE
  cat >> $LISTFILE << EOF
  </section>
  <hr />
EOF
done
# table of contents
contents="${contents}</ul><hr />"

INDEX_FILE="index.html"
TEMP_FILE="/tmp/index827fhu.html"
START_CONTENT="<!-- !!start content!! -->"
END_CONTENT="<!-- !!end content!! -->"

original_html=$(cat $INDEX_FILE)

html=$(cat $LISTFILE)

# get line numbers of START_CONTENT and END_CONTENT
start=$(echo "${original_html}" | grep -n "${START_CONTENT}" | cut -d : -f1)
end=$(echo "${original_html}" | grep -n "${END_CONTENT}" | cut -d : -f1)

if [ -z $start ] || [ -z $end ]; then
  echo "could not find start/end content tags" >> /dev/stderr
  echo "start: <$start>, end: <$end>" >> /dev/stderr
  exit 1
fi

rm -f $TEMP_FILE
echo "${original_html}" | awk 'NR <= '"${start}"'' >> $TEMP_FILE
echo "${contents}" >> $TEMP_FILE
echo "${html}" >> $TEMP_FILE
echo "${original_html}" | awk 'NR >= '"${end}"'' >> $TEMP_FILE

cat $TEMP_FILE > $INDEX_FILE
rm -f $TEMP_FILE

echo "done! saved to ${INDEX_FILE} 🚀" >> /dev/stderr
