@echo off
cd SSM_APP
set NODE_PATH=%~dp0node-v22.17.0-win-x64
set PATH=%PATH%;%NODE_PATH%
echo Installing web dependencies...
"%NODE_PATH%\node.exe" "%NODE_PATH%\node_modules\npm\bin\npm-cli.js" install react-dom@19.0.0 react-native-web@^0.20.0 @expo/metro-runtime@~5.0.4
pause 