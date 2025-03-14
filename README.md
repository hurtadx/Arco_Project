# ARCO App - Sistema de Gestión de Cambios de Equipamiento

## Descripción
ARCO App es una aplicación de escritorio desarrollada con Electron y React que permite gestionar los cambios de equipamiento informático en una organización. La aplicación facilita el registro, seguimiento y exportación de datos relacionados con movimientos y cambios de equipos.

## Características Principales
- **Gestión de Equipamiento**: Registro y seguimiento de equipos informáticos
- **Cambios de Equipamiento**: Documentación de movimientos, actualizaciones y retiros
- **Sistema de Bloqueo**: Mecanismo para evitar conflictos en edición simultánea
- **Almacenamiento en Excel**: Persistencia de datos en archivos Excel compartidos
- **Modo Web y Escritorio**: Funciona tanto en navegador (modo limitado) como en aplicación de escritorio

## Requisitos del Sistema
- Node.js 18 o superior
- Windows 10/11 (recomendado)
- 4GB RAM mínimo
- Acceso a carpeta compartida (para modo multi-usuario)

## Instalación

### Desarrollo
1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/arco-app.git
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar en modo desarrollo:
```bash
npm start
```

### Producción
1. Construir la aplicación:
```bash
npm run build
```

El instalador se generará en la carpeta `dist`.

## Configuración

### Directorio de Datos Compartidos
Por defecto, la aplicación utiliza la ruta `ArcoData` como directorio compartido para los datos. Si esta ruta no está disponible, la aplicación utilizará una ubicación local en `%USERPROFILE%\Documents\ARCO_Datos`.

Para modificar la ubicación predeterminada, edita la variable `dataDir` en el archivo `main.cjs`.

### Sistema de Bloqueo
El sistema de bloqueo tiene un timeout de 5 minutos para prevenir bloqueos huérfanos. Este valor puede modificarse editando la constante `LOCK_TIMEOUT` en el archivo `main.cjs`.

## Uso

### Módulos Principales
- **Cambios de Equipamiento**: Permite registrar movimientos, actualizaciones y retiros de equipos
- **Cambios de Objetos**: Gestión de cambios en objetos del sistema informático
- **Equipos**: Inventario y gestión de equipos informáticos
- **Reportes**: Generación de informes y exportación de datos

### Sistema de Bloqueo
Para editar datos compartidos:

1. Verifica si los archivos están bloqueados (indicador en la barra de estado)
2. Si están bloqueados, puedes ver quién los está editando
3. Si no están bloqueados, puedes adquirir el bloqueo haciendo clic en "Solicitar Edición"
4. Al terminar, libera el bloqueo haciendo clic en "Liberar Edición"

## Estructura del Proyecto
```
arco-app/
├── src/                # Código fuente
│   ├── components/     # Componentes React
│   ├── services/       # Servicios y lógica de negocio
│   ├── utils/          # Utilidades
│   ├── App.jsx         # Componente principal
│   └── main.cjs        # Punto de entrada Electron
├── public/             # Archivos estáticos
├── dist/               # Distribución compilada
└── package.json        # Dependencias y scripts
```

## Solución de Problemas

### La aplicación no puede acceder a los datos compartidos
- Verifica que la ruta `ArcoData` esté disponible y accesible
- Confirma que tienes permisos de lectura y escritura en la carpeta

### Error en el sistema de bloqueo
1. Cierra todas las instancias de la aplicación
2. Elimina manualmente el archivo `arco-lock.json` en la carpeta de datos
3. Reinicia la aplicación

## Contribución
1. Fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Commit de tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia
## No hay <3 CHAOOO