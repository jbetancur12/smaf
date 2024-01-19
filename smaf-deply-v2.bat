@echo off

REM Nombre del archivo de registro de errores
set error_log="C:\Users\Jorge Betancur\Desktop\IOT\error.log"

REM Función para mostrar los errores
:show_errors
if exist %error_log% (
    echo Se produjeron errores. Consulta el archivo %error_log% para más detalles.
) else (
    echo El script se ejecutó sin errores.
)
goto :eof

REM Función para imprimir un mensaje en color verde
:print_green
echo %1
goto :eof

REM Mostrar un mensaje antes de conectarse al equipo remoto
echo Conectándose al equipo remoto...
echo.

REM Obtener la fecha y hora actual en el formato deseado
set timestamp=%date:~4,2%%date:~7,2%%date:~10,4%-%time:~0,2%%time:~3,2%%time:~6,2%

REM Mostrar un mensaje antes de renombrar la carpeta 'build'
echo Renombrando la carpeta 'build' a 'build%timestamp%'...
echo.

cd "C:\Users\Jorge Betancur\Documents\Vite\smaf-mui"

REM Renombrar la carpeta 'build' con el formato 'buildMMDDYYYY-hhmmss'
ren dist "build%timestamp%-v2"
echo.

REM Mostrar un mensaje antes de copiar la carpeta renombrada al equipo remoto
echo Copiando la carpeta renombrada al equipo remoto...
echo.


REM Mostrar un mensaje antes de conectarse al equipo remoto nuevamente
echo Conectándose al equipo remoto...
echo.

REM Conectarse al equipo remoto

REM Mostrar los errores capturados
call :show_errors
echo.

REM Mostrar un mensaje al final del script
echo ¡El script ha finalizado!

REM Mantener el terminal abierto
pause
