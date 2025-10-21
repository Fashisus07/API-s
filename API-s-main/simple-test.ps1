# Prueba simple de validaciones
Write-Host "=== PRUEBA DE VALIDACIONES Y MANEJO DE EXCEPCIONES ===" -ForegroundColor Green

# Datos inválidos para registro
$invalidData = @{
    username = "ab"  # Muy corto (mín 3)
    email = "invalid-email"  # Email inválido
    password = "123"  # Muy corto (mín 6)
    firstName = ""  # Vacío
    lastName = "A"  # Muy corto (mín 2)
} | ConvertTo-Json

Write-Host "`nProbando registro con datos inválidos..." -ForegroundColor Yellow
Write-Host "Datos: $invalidData"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -ContentType "application/json" -Body $invalidData -ErrorAction Stop
    Write-Host "❌ PROBLEMA: Debería haber fallado pero fue exitoso" -ForegroundColor Red
    Write-Host ($response | ConvertTo-Json)
}
catch {
    Write-Host "✅ CORRECTO: Falló como se esperaba" -ForegroundColor Green
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Response:" -ForegroundColor Cyan
        Write-Host $errorBody
    }
}

# Probar endpoint protegido sin token
Write-Host "`nProbando endpoint protegido sin autenticación..." -ForegroundColor Yellow

$productData = @{
    name = "Test Product"
    description = "This is a test product description"
    price = 19.99
    stock = 5
    category = "test"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -ContentType "application/json" -Body $productData -ErrorAction Stop
    Write-Host "❌ PROBLEMA: Debería requerir autenticación" -ForegroundColor Red
    Write-Host ($response | ConvertTo-Json)
}
catch {
    Write-Host "✅ CORRECTO: Requiere autenticación" -ForegroundColor Green
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
}

Write-Host "`n=== PRUEBA COMPLETADA ===" -ForegroundColor Green
