# **ARCO App v1.1 - Sistema de Gestión de Equipamiento y Toners**

## **Descripción**
ARCO App es una aplicación de escritorio desarrollada con Electron y React que permite gestionar los cambios de equipamiento informático y toners de impresoras en una organización. La aplicación facilita el registro, seguimiento y exportación de datos relacionados con movimientos de equipos y consumibles.

## **Características Principales**
* **Gestión de Equipamiento**: Registro y seguimiento de equipos informáticos
* **Cambios de Equipamiento**: Documentación de movimientos, actualizaciones y retiros
* **Gestión de Toners**: Control completo del ciclo de vida de toners en impresoras ✨ **¡NUEVO!**
* **Estadísticas de Rendimiento**: Análisis de páginas impresas por toner ✨ **¡NUEVO!**
* **Almacenamiento en Excel**: Persistencia de datos en archivos Excel
* **Interfaz Adaptable**: Incluye modo claro y oscuro para mayor comodidad visual
* **Modo Escritorio**: Aplicación nativa para Windows con todas las funcionalidades

## **Requisitos del Sistema**
* Windows 10/11
* 4GB RAM mínimo
* 100MB de espacio en disco
* Acceso a la carpeta compartida P:\ArcoData

## **Instalación**
### **Para Usuarios Finales**
1. Ejecute el archivo de instalación `arco-app-setup.exe`
2. Siga las instrucciones del instalador
3. La aplicación se iniciará automáticamente después de la instalación

### **Para Desarrolladores**
1. Clonar el repositorio:
```
git clone https://github.com/tu-usuario/arco-app.git
```
2. Instalar dependencias:
```
npm install
```
3. Iniciar en modo desarrollo:
```
npm start
```
4. Construir la aplicación:
```
npm run build
npm run electron:build
```
El instalador se generará en la carpeta `dist_electron`.

## **Uso**
### **Módulos Principales**
* **Cambios de Objetos**: Permite registrar movimientos y cambios de objetos
* **Registro de Equipos**: Inventario y gestión de equipos informáticos
* **Cambios de Equipos**: Seguimiento de movimientos y actualizaciones de equipos
* **Gestión de Toners**: Control del ciclo de vida de toners de impresoras ✨ **¡NUEVO!**

### **Módulo de Gestión de Toners ✨**
* **Registro de Impresoras**: Datos completos de todas las impresoras de la organización
* **Cambio de Toners**: Registro de reemplazos con contador de páginas
* **Historial de Toners**: Visualización del historial completo por impresora
* **Estadísticas de Rendimiento**: Páginas impresas, promedio por toner y más

### **Interfaz de Usuario**
* **Barra de Navegación**: Acceso rápido a todos los módulos
* **Selector de Tema**: Cambie entre modo claro y oscuro según su preferencia
* **Formularios Intuitivos**: Diseño simplificado para el registro eficiente de información
* **Modo de Edición**: Control de acceso para modificación de datos

## **Estructura del Proyecto**
```
arco-app/
├── src/                # Código fuente
│   ├── components/     # Componentes React
│   │   ├── common/     # Componentes comunes (navbar, forms, etc.)
│   │   ├── TonerManagement/ # Componentes del módulo de toners ✨
│   ├── data/           # Gestión de datos y almacenamiento
│   ├── pages/          # Páginas principales de la aplicación
│   ├── utils/          # Utilidades
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Punto de entrada React
├── electron/           # Código Electron
│   ├── main.cjs        # Punto de entrada Electron
│   └── preload.cjs     # Script de precarga
├── dist/               # Distribución compilada
└── package.json        # Dependencias y scripts
```

## **Solución de Problemas**
### **La aplicación muestra una pantalla en blanco**
* Reinicie la aplicación
* Verifique que tenga permisos de administrador si es necesario

### **Problemas con la visualización de datos**
* Asegúrese de que los archivos Excel no estén abiertos en otras aplicaciones
* Verifique que tenga permisos de escritura en la carpeta P:\ArcoData

### **Error de conexión a la carpeta compartida**
* Verifique que la unidad P: esté correctamente mapeada
* Asegúrese de tener los permisos necesarios en la carpeta compartida

### **Problemas con los contadores de toners**
* Los valores del contador deben ser numéricos
* El primer registro de un toner sirve como punto de referencia inicial

## **Tecnologías Utilizadas**
* React 18
* Electron 25
* Vite 6
* FontAwesome 6
* SheetJS (para manipulación de Excel)

## **Historial de versiones**
### **v1.1 (Abril 2025)**
* ✨ Añadido nuevo módulo de gestión de toners
* 🔧 Optimizaciones en el rendimiento
* 🐛 Correcciones de errores en la interfaz
* 🚀 Mejoras en el sistema de navegación

### **v1.0 (Enero 2025)**
* 📝 Versión inicial
* 🔄 Gestión de cambios de objetos y equipos
* 🖥️ Registro de equipos

## **Mantenimiento y Actualizaciones**
Las actualizaciones de la aplicación se distribuirán mediante nuevos instaladores. Para actualizarla:
1. Desinstale la versión anterior (opcional, pero recomendado)
2. Ejecute el nuevo instalador
3. Siga las instrucciones en pantalla

## **Contacto y Soporte**
Para reportar problemas puedes abrir un Issue en github y con gusto lo intentaré resolver.