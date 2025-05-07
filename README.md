# 🏟️ Club Deportivo - Plataforma Integral

Este proyecto es una plataforma web para la gestión de un club deportivo, permitiendo a los usuarios registrarse, hacer reservas, pagar membresías, gestionar su cuenta, consultar actividades y mucho más. Está construido con una arquitectura de frontend en **Next.js** y backend en **NestJS**.

---

## 🚀 Tecnologías utilizadas

### Frontend
- **Next.js** (React)
- **Tailwind CSS** (Estilizado)
- **Auth0** (Autenticación)
- **Stripe** (Pagos)
- **Socket.IO** (Websockets)
- **Leaflet** (Mapas interactivos)
- **Axios** (Solicitudes HTTP)

### Backend
- **NestJS**
- **PostgreSQL** (Base de datos)
- **TypeORM** (ORM)
- **Cloudinary** (Gestión de imágenes)
- **JWT** (Autenticación)
- **Socket.IO** (Websockets)
- **Stripe** (Pagos)

---

## 🏗️ Instalación

### Requisitos previos

Asegúrate de tener instalado:

- **Node.js** (>= 18)
- **npm** o **yarn** o **pnpm** o **bun** para la gestión de dependencias
- **PostgreSQL** para la base de datos (si usas el backend)

### Paso 1: Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd club-deportivo

```

Paso 2: Instalar dependencias
Frontend
Navegar a la carpeta del frontend:

```

cd front
Instalar dependencias:

npm install
# o
yarn install
# o
pnpm install

```


Backend
Navegar a la carpeta del backend:

```

cd ../back
Instalar dependencias:

npm install
# o
yarn install
# o
pnpm install

```

🏃‍♀️ Correr el proyecto en desarrollo
Frontend
En la carpeta front, ejecuta el siguiente comando para iniciar el servidor de desarrollo:

```

npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev

```

Luego abre tu navegador y visita http://localhost:3000.

Backend
En la carpeta back, ejecuta el siguiente comando para iniciar el servidor de desarrollo:

```

npm run start:dev
# o
yarn start:dev
# o
pnpm start:dev

```

🧑‍💻 Estructura del proyecto
Frontend (carpeta front)
- Hooks: Contiene los hooks personalizados.
   -usePrivate.ts: Hook para gestionar la lógica privada.
   -useUser.ts: Hook para gestionar el estado del usuario.

- app: Directorio principal con las páginas y componentes de la aplicación.

Ejemplos de archivos o carpetas especificas (en next js se ocupa enrutado por carpetas):

```

- ClubActiveCenter
- Formulario
- Login2
- Membresias
- Registro
- Reservas
- cart
- contacto
- tienda

```

- components: Componentes reutilizables.

- config: Configuraciones de la aplicación.

- context: Contextos para la gestión del estado global.

- helpers: Funciones auxiliares.

- interface: Interfaces TypeScript.

- lib: Librerías externas o configuraciones.

- service: Servicios que gestionan la lógica de negocio.

- utils: Funciones utilitarias generales.



# 🚀 PASO A PASO PARA HACER UN PULL REQUEST Y SUBIR UN CAMBIO A LA RAMA PRINCIPAL (MAIN) (pasos especificos y rapidos)

1. **Posicionarse en la rama `main`:**
   ```bash
   git checkout main   
   ```
   Nos aseguramos de estar en la rama principal.

2. **Ver todas las ramas creadas (opcional):**
   ```bash
   git branch
   ```
   Esto muestra todas las ramas locales disponibles.

3. **Traer los últimos cambios de la rama `main`:**
   ```bash
   git pull
   ```
   Nos traemos los últimos cambios mergeados y aprobados en `main`.  
   Si se necesita traer cambios de otra rama, usar:
   ```bash
   git pull origin nombreRama
   ```

4. **Crear una nueva rama desde `main`:**
   ```bash
   git checkout -b nombreRama
   ```
   Es importante crear una nueva rama para cada nueva funcionalidad o corrección, para evitar conflictos.

5. **Realizar los cambios necesarios en la nueva rama.**

6. **Verificar los archivos modificados:**
   ```bash
   git status
   ```
   Esto muestra los archivos que han sido modificados y están listos para ser agregados a un commit.

7. **Agregar los archivos al commit:**
   - Para un archivo específico:
     ```bash
     git add nombreDeArchivoModificado
     ```
   - Para todos los archivos modificados:
     ```bash
     git add .
     ```

8. **Subir los cambios a la rama remota del repositorio:**
   ```bash
   git push -u origin nombreRamaDeTrabajo
   ```
   Por ejemplo, si la rama creada en el paso 4 se llama `feature/login`, el comando sería:
   ```bash
   git push -u origin feature/login
   ```

9. **Crear un Pull Request en GitHub:**
   - Ir al repositorio en GitHub.
   - Hacer clic en el botón verde que dice **"CREATE PULL REQUEST"**.

10. **Revisión y aprobación:**
    - Uno o varios colaboradores revisarán y aceptarán los cambios.

11. **Merge de los cambios:**
    - Hacer clic en el botón **"CONFIRM SQUASH AND MERGE"**.  
      Esto reflejará los cambios en la rama `main`.

12. **Eliminar la rama creada para la tarea (opcional):**
    Si ya no se necesita la rama, se puede eliminar.

13. **Repetir el ciclo para una nueva tarea.**

```

🧑‍💻 Autoría
Este proyecto fue creado y mantenido por:

Maria Ignacia Fernández - Desarrolladora Frontend (Colaboradora)

Compañeros del equipo - Colaboradores del proyecto

📝 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

📄 Contacto
Si tienes alguna duda o sugerencia, no dudes en contactarme a través de mi mail mfernandezpolanco@gmail.com


```
