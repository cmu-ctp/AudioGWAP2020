@REM Echoes CLI Bootstrapper

@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\cli" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\cli" %*
)
