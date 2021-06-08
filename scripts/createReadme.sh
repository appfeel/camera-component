#!/bin/sh

README=./readme.md
TEMPLATE=./readme-template.md
RM_COMPONENT=./src/components/camera-component/readme.md
RM_CONTROLLER=./src/components/camera-controller/readme.md

echo '' > "$README"
cat "$TEMPLATE" >> "$README"
cat "$RM_COMPONENT" >> "$README"
echo '' >> "$README"
echo '' >> "$README"
cat "$RM_CONTROLLER" >> "$README"
