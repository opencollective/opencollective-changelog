#!/bin/bash
date=`date +%m-%d-%Y`
git add "scripts/config.json"  "changelogs/"
git commit -m "Update changelog for $date"
git push origin master
