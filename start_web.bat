@echo off
cd SSM_APP
set NODE_PATH=%~dp0node-v22.17.0-win-x64
set PATH=%PATH%;%NODE_PATH%
echo Node.js path: %NODE_PATH%
"%NODE_PATH%\node.exe" -e "console.log('Node.js version:', process.version)"

echo Running Expo Web...
"%NODE_PATH%\node.exe" "node_modules\expo\bin\cli" start --web
pause 