Set-Location "$PSScriptRoot\.."

Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:ALL_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:GIT_HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:GIT_HTTPS_PROXY -ErrorAction SilentlyContinue

$env:EXPO_NO_TELEMETRY = "1"
$env:JAVA_HOME = "C:\Users\Jonas\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

npx expo start --port 8081 --clear
