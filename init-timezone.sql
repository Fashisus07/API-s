-- Configurar zona horaria para Argentina (GMT-3)
SET timezone = '-03';

-- Verificar que la zona horaria esté configurada correctamente
SELECT current_setting('timezone') as current_timezone;

-- Mostrar la hora actual con la zona horaria
SELECT now() as current_time_with_timezone;

-- Configurar para que todas las nuevas conexiones usen esta zona horaria
ALTER DATABASE ecommerce SET timezone = '-03';
