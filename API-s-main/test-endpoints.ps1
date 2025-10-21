# Script para probar endpoints, DTOs y manejo de excepciones
$baseUrl = "http://localhost:8080/api"

Write-Host "=== PRUEBAS DE ENDPOINTS, DTOs Y MANEJO DE EXCEPCIONES ===" -ForegroundColor Green

# Función para hacer peticiones POST
function Test-PostEndpoint {
    param(
        [string]$Url,
        [string]$JsonFile,
        [string]$Description
    )
    
    Write-Host "`n--- $Description ---" -ForegroundColor Yellow
    Write-Host "URL: $Url"
    Write-Host "Datos: $(Get-Content $JsonFile -Raw)"
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method POST -ContentType "application/json" -Body (Get-Content $JsonFile -Raw) -ErrorAction Stop
        Write-Host "✅ SUCCESS:" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 3)
        return $response
    }
    catch {
        Write-Host "❌ ERROR:" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
        Write-Host "Message: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody"
        }
    }
}

# Función para hacer peticiones GET
function Test-GetEndpoint {
    param(
        [string]$Url,
        [string]$Description,
        [hashtable]$Headers = @{}
    )
    
    Write-Host "`n--- $Description ---" -ForegroundColor Yellow
    Write-Host "URL: $Url"
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -Headers $Headers -ErrorAction Stop
        Write-Host "✅ SUCCESS:" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 3)
        return $response
    }
    catch {
        Write-Host "❌ ERROR:" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
        Write-Host "Message: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody"
        }
    }
}

# 1. PROBAR ENDPOINTS PÚBLICOS
Write-Host "`n🔍 1. PROBANDO ENDPOINTS PÚBLICOS" -ForegroundColor Cyan
Test-GetEndpoint "$baseUrl/products" "Obtener productos (debe funcionar)"

# 2. PROBAR REGISTRO CON DATOS VÁLIDOS
Write-Host "`n🔍 2. PROBANDO REGISTRO CON DATOS VÁLIDOS" -ForegroundColor Cyan
$registerResponse = Test-PostEndpoint "$baseUrl/auth/register" "test-register.json" "Registro con datos válidos"

# 3. PROBAR REGISTRO CON DATOS INVÁLIDOS (VALIDACIONES DTO)
Write-Host "`n🔍 3. PROBANDO VALIDACIONES DTO - REGISTRO INVÁLIDO" -ForegroundColor Cyan
Test-PostEndpoint "$baseUrl/auth/register" "test-register-invalid.json" "Registro con datos inválidos (debe fallar con validaciones)"

# 4. PROBAR LOGIN CON DATOS VÁLIDOS
Write-Host "`n🔍 4. PROBANDO LOGIN" -ForegroundColor Cyan
$loginResponse = Test-PostEndpoint "$baseUrl/auth/login" "test-login.json" "Login con credenciales válidas"

# 5. PROBAR ENDPOINTS PROTEGIDOS SIN TOKEN
Write-Host "`n🔍 5. PROBANDO ENDPOINTS PROTEGIDOS SIN AUTENTICACIÓN" -ForegroundColor Cyan
Test-PostEndpoint "$baseUrl/products" "test-product.json" "Crear producto sin token (debe fallar 401/403)"

# 6. SI EL LOGIN FUE EXITOSO, PROBAR CON TOKEN
if ($loginResponse -and $loginResponse.token) {
    $authHeaders = @{
        "Authorization" = "Bearer $($loginResponse.token)"
    }
    
    Write-Host "`n🔍 6. PROBANDO ENDPOINTS CON AUTENTICACIÓN" -ForegroundColor Cyan
    
    # Crear producto válido
    Write-Host "`n--- Crear producto con datos válidos ---" -ForegroundColor Yellow
    try {
        $productResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -ContentType "application/json" -Body (Get-Content "test-product.json" -Raw) -Headers $authHeaders -ErrorAction Stop
        Write-Host "✅ SUCCESS:" -ForegroundColor Green
        Write-Host ($productResponse | ConvertTo-Json -Depth 3)
    }
    catch {
        Write-Host "❌ ERROR:" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
        Write-Host "Message: $($_.Exception.Message)"
    }
    
    # Crear producto inválido
    Write-Host "`n--- Crear producto con datos inválidos ---" -ForegroundColor Yellow
    try {
        $invalidProductResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -ContentType "application/json" -Body (Get-Content "test-product-invalid.json" -Raw) -Headers $authHeaders -ErrorAction Stop
        Write-Host "✅ SUCCESS:" -ForegroundColor Green
        Write-Host ($invalidProductResponse | ConvertTo-Json -Depth 3)
    }
    catch {
        Write-Host "❌ ERROR (esperado):" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody"
        }
    }
    
    # Probar carrito
    Test-GetEndpoint "$baseUrl/cart" "Obtener carrito del usuario" $authHeaders
}

Write-Host "`n=== PRUEBAS COMPLETADAS ===" -ForegroundColor Green
Write-Host "Revisa los resultados arriba para verificar:" -ForegroundColor White
Write-Host "✅ DTOs con validaciones funcionando" -ForegroundColor White
Write-Host "✅ Manejo de excepciones personalizado" -ForegroundColor White
Write-Host "✅ Autenticación JWT" -ForegroundColor White
Write-Host "✅ Endpoints protegidos y públicos" -ForegroundColor White
