#!/bin/sh
#
# demo.sh - sample usage of toposplit
#
# The first two steps are just to download the sample file
# because it was bigger than I wanted in my repo
#

# 1. Get the source data -- block-level shapefiles of Connecticut
echo
echo "DOWNLOADING SAMPLE FILE"
echo "======================="
mkdir -p raw
wget "https://www2.census.gov/geo/tiger/TIGER2016/TABBLOCK/tl_2016_09_tabblock10.zip" -O raw/tl_2016_09_tabblock10.zip

# 2. Unzip it
echo
echo "UNZIPPING SAMPLE FILE"
echo "====================="
unzip raw/tl_2016_09_tabblock10.zip -d raw/tl_2016_09_tabblock10

# 3. Mapeshape it to a big json file
echo
echo "CONVERTING SAMPLE FILE TO TOPOJSON"
echo "=================================="
# Create index
mapshaper -i raw/tl_2016_09_tabblock10/tl_2016_09_tabblock10.shp -simplify 0.75 -split-on-grid 20,20 -o format=topojson bbox-index

# Slice into layers
mapshaper -i raw/tl_2016_09_tabblock10/tl_2016_09_tabblock10.shp -simplify 0.75 -split-on-grid 20,20 -o raw/tl_2016_09_tabblock10.topojson format=topojson


# 4. toposplit it
echo
echo "FINALLY, TOPOSPLITTING IT"
echo "========================="
toposplit --input raw/tl_2016_09_tabblock10.topojson --outdir parts

echo
echo "Separated parts should be in the parts directory now."
