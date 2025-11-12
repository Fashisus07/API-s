@echo off
REM Script para levantar la aplicación completa
REM Requiere: Java 17, Maven, Node.js y npm

echo.
echo ========================================
echo   INICIANDO APLICACION ECOMMERCE
echo ========================================
echo.

REM Verificar Java
echo [1/4] Verificando Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java no está instalado
    pause
    exit /b 1
)
echo OK: Java encontrado

REM Verificar Node.js
echo [2/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado
    pause
    exit /b 1
)
echo OK: Node.js encontrado

REM Verificar npm
echo [3/4] Verificando npm...
cmd /c npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm no está instalado
    pause
    exit /b 1
)
echo OK: npm encontrado

REM Verificar Docker
echo [4/4] Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ADVERTENCIA: Docker no está instalado
    echo La base de datos PostgreSQL debe estar levantada manualmente
) else (
    echo OK: Docker encontrado
)

echo.
echo ========================================
echo   VERIFICACIONES COMPLETADAS
echo ========================================
echo.
echo Selecciona una opcion:
echo 1 - Compilar Backend (Maven)
echo 2 - Iniciar Frontend (npm start)
echo 3 - Levantar con Docker Compose (recomendado)
echo 4 - Ver documentacion
echo 5 - Salir
echo.

set /p option="Ingresa tu opcion (1-5): "

if "%option%"=="1" goto compile_backend
if "%option%"=="2" goto start_frontend
if "%option%"=="3" goto docker_compose
if "%option%"=="4" goto docs
if "%option%"=="5" exit /b 0

echo Opcion invalida
pause
exit /b 1

:compile_backend
echo.
echo Compilando Backend...
cd /d "c:\Final\API-s-ultima-version\API-s-EndpointVerificados\backend"
call mvnw clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: No se pudo compilar el backend
    pause
    exit /b 1
)
echo Backend compilado exitosamente
echo El JAR se encuentra en: target\ecommerce-backend-1.0.0.jar
pause
goto end

:start_frontend
echo.
echo Instalando dependencias del Frontend...
cd /d "c:\Final\API-s-ultima-version\API-s-EndpointVerificados\frontend"
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)
echo.
echo Iniciando Frontend en http://localhost:3000...
call npm start
goto end

:docker_compose
echo.
echo Levantando servicios con Docker Compose...
cd /d "c:\Final\API-s-ultima-version\API-s-EndpointVerificados"
docker-compose up -d
echo.
echo Servicios levantados:
echo - Backend: http://localhost:8080
echo - Frontend: http://localhost:3000
echo - PostgreSQL: localhost:5433
echo.
pause
goto end

:docs
cd /d "c:\Final\API-s-ultima-version"
echo.
echo Abriendo documentacion...
echo Archivos disponibles:
echo - CORRECCIONES_REALIZADAS.md
echo - GUIA_COMPILACION_TESTING.md
echo - CHECKLIST_CORRECCIONES.md
echo.
pause
goto end

:end
echo.
echo Proceso completado
exit /b 0
