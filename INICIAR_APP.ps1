# Script para iniciar la aplicación ecommerce
# Ejecutar desde PowerShell

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIAR APLICACION ECOMMERCE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar prerrequisitos
Write-Host "[1/3] Verificando requisitos..." -ForegroundColor Yellow

# Verificar Java
try {
    $java = java -version 2>&1
    Write-Host "  ✅ Java encontrado" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Java no está instalado" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar Node.js
try {
    $node = node --version 2>&1
    Write-Host "  ✅ Node.js encontrado ($node)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js no está instalado" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar npm
try {
    $npm = cmd /c npm --version 2>&1
    Write-Host "  ✅ npm encontrado (v$npm)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ npm no está instalado" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar Docker
$dockerInstalled = $false
try {
    $docker = docker --version 2>&1
    Write-Host "  ✅ Docker encontrado ($docker)" -ForegroundColor Green
    $dockerInstalled = $true
} catch {
    Write-Host "  ⚠️  Docker no instalado (opcional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[2/3] Todos los requisitos están OK" -ForegroundColor Green
Write-Host ""

# Menu de opciones
Write-Host "Selecciona cómo quieres iniciar:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Docker Compose (RECOMENDADO - más fácil)" -ForegroundColor Green
if (-not $dockerInstalled) {
    Write-Host "     ⚠️  (Docker no instalado)" -ForegroundColor Yellow
}
Write-Host "2️⃣  Backend Manual + Frontend Manual (más control)" -ForegroundColor Green
Write-Host "3️⃣  Solo Backend (compilar)" -ForegroundColor Cyan
Write-Host "4️⃣  Solo Frontend (npm start)" -ForegroundColor Cyan
Write-Host "5️⃣  Ver documentación" -ForegroundColor Cyan
Write-Host "0️⃣  Salir" -ForegroundColor Gray
Write-Host ""

$opcion = Read-Host "Ingresa tu opción (0-5)"

switch ($opcion) {
    "1" {
        if (-not $dockerInstalled) {
            Write-Host ""
            Write-Host "❌ Docker no está instalado" -ForegroundColor Red
            Write-Host "Descárgalo desde: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
            Read-Host "Presiona Enter para volver"
            exit 1
        }
        
        Write-Host ""
        Write-Host "🐳 Levantando servicios con Docker Compose..." -ForegroundColor Cyan
        Write-Host ""
        
        Set-Location "c:\Final\API-s-ultima-version\API-s-EndpointVerificados"
        docker-compose up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Servicios levantados exitosamente!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Accede a:" -ForegroundColor Green
            Write-Host "  🌐 Frontend:   http://localhost:3000" -ForegroundColor Cyan
            Write-Host "  📡 Backend:    http://localhost:8080" -ForegroundColor Cyan
            Write-Host "  🗄️  Database:   localhost:5433" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Login de prueba:" -ForegroundColor Green
            Write-Host "  📧 Email: admin@ecommerce.com" -ForegroundColor Yellow
            Write-Host "  🔐 Pass:  admin123" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Ver logs: docker-compose logs -f" -ForegroundColor Gray
            Write-Host "Parar:    docker-compose down" -ForegroundColor Gray
        } else {
            Write-Host "❌ Error levantando servicios" -ForegroundColor Red
        }
        
        Read-Host "Presiona Enter para salir"
    }
    
    "2" {
        Write-Host ""
        Write-Host "Iniciando Backend + Frontend manualmente..." -ForegroundColor Cyan
        Write-Host ""
        
        # Preguntar si quiere usar WSL o CMD
        Write-Host "Se abrirán dos ventanas diferentes:" -ForegroundColor Yellow
        Write-Host "  - Una para el Backend (Java)" -ForegroundColor Cyan
        Write-Host "  - Una para el Frontend (npm)" -ForegroundColor Cyan
        Write-Host ""
        
        # Backend
        $backendPath = "c:\Final\API-s-ultima-version\API-s-EndpointVerificados\backend"
        
        Write-Host "🔨 Compilando Backend..." -ForegroundColor Cyan
        Set-Location $backendPath
        
        & cmd /c "mvnw clean package -DskipTests"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Backend compilado" -ForegroundColor Green
            Write-Host "🚀 Iniciando Backend en una nueva ventana..." -ForegroundColor Cyan
            Write-Host ""
            
            # Abrir backend en nueva ventana
            $backendCmd = "cd /d `"$backendPath`" && java -jar target/ecommerce-backend-1.0.0.jar && pause"
            Start-Process cmd -ArgumentList "/k", $backendCmd
            
            Start-Sleep -Seconds 5
            
            # Frontend
            $frontendPath = "c:\Final\API-s-ultima-version\API-s-EndpointVerificados\frontend"
            
            Write-Host "📦 Instalando dependencias del Frontend..." -ForegroundColor Cyan
            Set-Location $frontendPath
            
            & cmd /c "npm install"
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
                Write-Host "🚀 Iniciando Frontend en una nueva ventana..." -ForegroundColor Cyan
                Write-Host ""
                
                # Abrir frontend en nueva ventana
                $frontendCmd = "cd /d `"$frontendPath`" && npm start"
                Start-Process cmd -ArgumentList "/k", $frontendCmd
                
                Write-Host ""
                Write-Host "✅ Todo iniciado!" -ForegroundColor Green
                Write-Host ""
                Write-Host "Accede a:" -ForegroundColor Green
                Write-Host "  🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
                Write-Host "  📡 Backend:  http://localhost:8080" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "Las ventanas se abrieron automáticamente" -ForegroundColor Yellow
            } else {
                Write-Host "❌ Error instalando dependencias del Frontend" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Error compilando Backend" -ForegroundColor Red
        }
        
        Read-Host "Presiona Enter para salir"
    }
    
    "3" {
        Write-Host ""
        Write-Host "🔨 Compilando Backend..." -ForegroundColor Cyan
        
        Set-Location "c:\Final\API-s-ultima-version\API-s-EndpointVerificados\backend"
        
        & cmd /c "mvnw clean package -DskipTests"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Backend compilado exitosamente!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Para ejecutarlo, corre:" -ForegroundColor Cyan
            Write-Host "  java -jar target/ecommerce-backend-1.0.0.jar" -ForegroundColor Yellow
            Write-Host ""
        } else {
            Write-Host ""
            Write-Host "❌ Error compilando Backend" -ForegroundColor Red
        }
        
        Read-Host "Presiona Enter para salir"
    }
    
    "4" {
        Write-Host ""
        Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
        
        Set-Location "c:\Final\API-s-ultima-version\API-s-EndpointVerificados\frontend"
        
        & cmd /c "npm install"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
            Write-Host ""
            Write-Host "🚀 Iniciando Frontend..." -ForegroundColor Cyan
            Write-Host ""
            
            & cmd /c "npm start"
        } else {
            Write-Host ""
            Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        }
        
        Read-Host "Presiona Enter para salir"
    }
    
    "5" {
        Write-Host ""
        Write-Host "📚 Documentación disponible:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  1. COMO_HACER_FUNCIONAR.md (Esta que leíste)" -ForegroundColor Yellow
        Write-Host "  2. CORRECCIONES_REALIZADAS.md (Cambios técnicos)" -ForegroundColor Yellow
        Write-Host "  3. GUIA_COMPILACION_TESTING.md (Guía avanzada)" -ForegroundColor Yellow
        Write-Host "  4. CHECKLIST_CORRECCIONES.md (Checklist)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Se encuentran en: c:\Final\API-s-ultima-version\" -ForegroundColor Gray
        Write-Host ""
        Read-Host "Presiona Enter para salir"
    }
    
    "0" {
        Write-Host ""
        Write-Host "👋 ¡Hasta pronto!" -ForegroundColor Green
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Opción inválida" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fin del script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
