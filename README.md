# Run Dev Rig
yarn start -l ./aws-cta-panel-ext/manifest.json 
# Host Public Folder in Dev Rig
yarn host -d ./aws-cta-panel-ext/public -p 8080 -l
# Run Backend Services
node ./aws-cta-panel-ext/services/backend.js -l manifest.json 