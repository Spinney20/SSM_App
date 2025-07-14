@echo on
cd "SSM_APP"
set "PATH=%PATH%;%~dp0node-v22.17.0-win-x64"
"%~dp0node-v22.17.0-win-x64\node.exe" "%~dp0node-v22.17.0-win-x64\node_modules\npm\bin\npm-cli.js" run start -- --host lan
pause 