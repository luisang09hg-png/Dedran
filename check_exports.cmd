@echo off
setlocal enabledelayedexpansion

: Check export patterns in page files
echo Exporting pattern analysis...
grep -r "^export (default|const|function)" src/pages/*.jsx 2>nul | findstr "^export"

echo.
echo Checking nested page files:
for /r src/pages \%f in (*.jsx) do (
    if \%f NEQ src\pages\components\* (
        echo Checking \%f
        grep "^export default" "\%f"
        if !errorlevel 1 (
            echo Has default export
        ) else (
            echo Has named export (likely export const X)
        )
    )
)

goto :eof