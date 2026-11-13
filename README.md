# Exposición de Servicios y Configuración Segura en Minikube

## Descripción de la arquitectura

Este proyecto implementa una arquitectura de dos capas dentro de **Minikube**:

```
Navegador -> NodePort (backend-service) -> Pod Backend (Node.js) -> ClusterIP (mongo-service) -> Pod MongoDB
```

- **Frontend (Navegador)**: realiza una petición HTTP al puerto expuesto por el *NodePort*.
- **Backend**: aplicación Node.js + Express que se ejecuta en un Pod y obtiene su configuración a través de un `ConfigMap` y un `Secret`.
- **MongoDB**: base de datos en otro Pod, accesible únicamente mediante `ClusterIP` interna.

## Estructura del proyecto
```
/ (raíz)
├─ k8s/                     # Manifiestos de Kubernetes
│   ├─ 00-namespace.yaml
│   ├─ 01-app-configmap.yaml
│   ├─ 02-db-secret.yaml
│   ├─ 03-mongo-stack.yaml
│   └─ 04-backend-stack.yaml
├─ src/                     # Código fuente del backend
│   ├─ app.js               # API ligera (Express + Mongoose)
│   ├─ package.json
│   └─ Dockerfile
└─ README.md                # *Este* documento
```

## Pasos de instalación y despliegue
### 1. Iniciar Minikube y preparar Docker
```powershell
# En PowerShell (Windows)
minikube start
# Configurar el entorno Docker local para que apunte al daemon interno de Minikube
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```
> **Nota:** En Git Bash usar `eval $(minikube -p minikube docker-env)`; en Linux/macOS el mismo comando.

### 2. Construir la imagen del backend
```powershell
docker build -t backend-s08:v1 ./src
```
> La etiqueta `backend-s08:v1` será utilizada por el `Deployment`.

### 3. Aplicar los manifiestos en el orden correcto
```powershell
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-app-configmap.yaml
kubectl apply -f k8s/02-db-secret.yaml
kubectl apply -f k8s/03-mongo-stack.yaml
kubectl apply -f k8s/04-backend-stack.yaml
```

### 4. Validaciones rápidas
```powershell
# Ver recursos creados
kubectl get pods,svc,configmaps,secrets -n practica-s08

# Comprobar variables de entorno dentro del pod backend (reemplaza <pod-backend> por el nombre real)
kubectl exec -it <pod-backend> -n practica-s08 -- env

# Obtener URL accesible del servicio backend (NodePort)
minikube service backend-service -n practica-s08 --url
```

### 5. Probar la API
Con la URL obtenida en el paso anterior, abra su navegador o use `curl`:
```powershell
curl http://<IP>:30080/
```
Debería recibir una respuesta JSON similar a:
```json
{
  "mensaje": "Conexión exitosa a Kubernetes y MongoDB",
  "estadoBD": "Conectado",
  "DB_NAME": "practica_s08_db",
  "DB_HOST": "mongo-service",
  "APP_PORT": "3000",
  "DB_USER": "admin_s08",
  "hostname": "backend-deployment-xxxx"
}
```
*(La contraseña nunca se muestra).

## Buenas prácticas aplicadas
- **Namespace aislado** (`practica-s08`).
- **ConfigMap** para datos no sensibles y **Secret** (Base64) para credenciales.
- **envFrom** en el Deployment del backend para inyección automática de variables.
- **imagePullPolicy: IfNotPresent** evita búsquedas externas en Docker Hub.
- **NodePort** permite acceso externo sin necesidad de Ingress.
- Comentarios extensivos en español en todos los archivos YAML.

---
*Proyecto preparado para su evaluación. ¡Éxitos!*