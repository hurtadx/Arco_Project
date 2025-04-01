# ARCO App - Sistema de Gestión de Cambios de Equipamiento

## Descripción
ARCO App es una aplicación de escritorio desarrollada con Electron y React que permite gestionar los cambios de equipamiento informático en una organización. La aplicación facilita el registro, seguimiento y exportación de datos relacionados con movimientos y cambios de equipos.

## Características Principales
* **Gestión de Equipamiento**: Registro y seguimiento de equipos informáticos
* **Cambios de Equipamiento**: Documentación de movimientos, actualizaciones y retiros
* **Almacenamiento en Excel**: Persistencia de datos en archivos Excel
* **Interfaz Adaptable**: Incluye modo claro y oscuro para mayor comodidad visual
* **Modo Escritorio**: Aplicación nativa para Windows con todas las funcionalidades

## Requisitos del Sistema
* Windows 10/11
* 4GB RAM mínimo
* 100MB de espacio en disco

## Instalación

### Para Usuarios Finales
1. Ejecute el archivo de instalación `arco-app-setup.exe`
2. Siga las instrucciones del instalador
3. La aplicación se iniciará automáticamente después de la instalación

### Para Desarrolladores
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
4. Construir la aplicación:
```bash
npm run build
npm run electron:build
```
El instalador se generará en la carpeta `dist`.

## Uso

### Módulos Principales
* **Cambios de Equipamiento**: Permite registrar movimientos, actualizaciones y retiros de equipos
* **Equipos**: Inventario y gestión de equipos informáticos
* **Configuración**: Opciones para personalizar la aplicación, incluyendo cambio de tema

### Interfaz de Usuario
* **Barra de Navegación**: Acceso rápido a todos los módulos
* **Selector de Tema**: Cambie entre modo claro y oscuro según su preferencia
* **Formularios Intuitivos**: Diseño simplificado para el registro eficiente de información

## Estructura del Proyecto
```
arco-app/
├── src/                # Código fuente
│   ├── components/     # Componentes React
│   ├── data/           # Gestión de datos y almacenamiento
│   ├── utils/          # Utilidades
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Punto de entrada React
├── electron/           # Código Electron
│   ├── main.cjs        # Punto de entrada Electron
│   └── preload.cjs     # Script de precarga
├── dist/               # Distribución compilada
└── package.json        # Dependencias y scripts
```

## Solución de Problemas

### La aplicación muestra una pantalla en blanco
* Reinicie la aplicación
* Verifique que tenga permisos de administrador si es necesario

### Problemas con la visualización de datos
* Asegúrese de que los archivos Excel no estén abiertos en otras aplicaciones
* Verifique que tenga permisos de escritura en la carpeta donde se almacenan los datos

### Errores al guardar información
* Compruebe que dispone de espacio suficiente en disco
* Verifique la conexión a la red si está utilizando una ubicación compartida

## Tecnologías Utilizadas
* React 18
* Electron 25
* Vite 6
* Bootstrap 5 (personalizado)
* SheetJS (para manipulación de Excel)

## Mantenimiento y Actualizaciones
Las actualizaciones de la aplicación se distribuirán mediante nuevos instaladores. Para actualizarla:
1. Desinstale la versión anterior (opcional, pero recomendado)
2. Ejecute el nuevo instalador
3. Siga las instrucciones en pantalla

## Contacto y Soporte
Para reportar problemas Puedes abrir un Issue en github y con gusto lo intentare resolver


Desarrollado por Andres Hurtado © 2025