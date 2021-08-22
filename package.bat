@echo off
setlocal enableextensions

set curdir=%cd%
set interdir=lambda

if not exist "dist\%interdir%\" (
    mkdir "dist\%interdir%\"
)
copy "%interdir%\*" "dist\%interdir%"
@REM cd "dist\%interdir%\"
@REM start /B npm install
@REM cd "%curdir%"
