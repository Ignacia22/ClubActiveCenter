# 🚀 PASO A PASO PARA HACER UN PULL REQUEST Y SUBIR UN CAMBIO A LA RAMA PRINCIPAL (MAIN)

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

