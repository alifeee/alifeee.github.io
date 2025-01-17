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







# do changelog
echo "generating RSS from changelog" >> /dev/stderr
cl=$(cat changelog.json | jq 'reverse')

num_items=$(echo "${cl}" | jq 'length')
echo "  found ${num_items} items in changelog" >> /dev/stderr

last_date=$(echo "${cl}" | jq -r '.[-1] | .date')
last_date_rfc3339=$(date --date="${last_date}" --rfc-3339="seconds" | sed 's/ /T/')
echo "  last change was on ${last_date_rfc3339}" >> /dev/stderr

feed="feed.xml"
printf "" > $feed

cat >> $feed << EOF
<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns="http://www.w3.org/2005/Atom">

<title>alifeee's favourite things</title>
<link href='https://alifeee.co.uk/favourites/' rel='self' />
<updated>${last_date_rfc3339}</updated>
<author>
  <name>alifeee</name>
</author>
<id>https://alifeee.co.uk/favourites/</id>
<icon>https://alifeee.co.uk/profile-picture.png</icon>
EOF

for i in `seq 1 "${num_items}"`; do
  date_str=$(echo "${cl}" | jq -r '.['$((i-1))'] | .date')
  date_rfc3339=$(date --date="${date_str}" --rfc-3339="seconds" | sed 's/ /T/')
  update=$(echo "${cl}" | jq -r '.['$((i-1))'] | .update')
  cat >> $feed << EOF
<entry>
  <title>update ${date_str}</title>
  <link href="https://alifeee.co.uk/favourites/" />
  <id>https://alifeee.co.uk/favourites/#${date_str}</id>
  <updated>${date_rfc3339}</updated>
  <summary>${update}</summary>
</entry>
EOF
done

cat >> $feed << EOF
</feed>
EOF

echo "done!"
