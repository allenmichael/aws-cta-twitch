#!/usr/bin/env bash

# only works for OSX
osascript <<END 
tell application "Terminal"
    do script "cd \"`pwd`\"; node ./aws-cta-panel-ext/services/backend.js -l ./aws-cta-panel-ext/manifest.json;"
    do script "cd \"`pwd`\"; yarn host -d ./aws-cta-panel-ext/public -p 8080 -l;"
    do script "cd \"`pwd`\"; yarn start -l ./aws-cta-panel-ext/manifest.json;"
end tell
END