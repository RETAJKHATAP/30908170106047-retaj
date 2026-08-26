# ShopSphere — Task 2.3: Namespace Simulation Evidence

**Student ID:** 30908170106047

## 1. Pods and Services in Both Namespaces

```
$ kubectl get all -n aws-simulation
NAME                            READY   STATUS    RESTARTS   AGE
pod/backend-575f4ff8b7-9zqhl    1/1     Running   0          3m52s
pod/frontend-6b47cc5859-znqgs   1/1     Running   0          3m53s

NAME                       TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
service/backend-service    ClusterIP   10.107.101.155   <none>        80/TCP    3m52s
service/frontend-service   ClusterIP   10.101.33.218    <none>        80/TCP    3m53s

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/backend    1/1     1            1           3m53s
deployment.apps/frontend   1/1     1            1           3m53s
```

```
$ kubectl get all -n gcp-simulation
NAME                            READY   STATUS    RESTARTS   AGE
pod/backend-575f4ff8b7-srqn4    1/1     Running   0          4m2s
pod/frontend-6b47cc5859-8rs9t   1/1     Running   0          4m3s

NAME                       TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
service/backend-service    ClusterIP   10.109.16.201    <none>        80/TCP    4m2s
service/frontend-service   ClusterIP   10.111.175.247   <none>        80/TCP    4m3s

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/backend    1/1     1            1           4m2s
deployment.apps/frontend   1/1     1            1           4m3s
```

## 2. Services Responding via `kubectl port-forward`

```
$ curl http://localhost:8081/    # aws-simulation frontend-service
<html>
  <body style="font-family: sans-serif; background:#232f3e; color:white; padding:2rem;">
    <h1>ShopSphere frontend</h1>
    <p>Namespace: aws-simulation</p>
    <p>Simulated cloud: AWS</p>
  </body>
</html>

$ curl http://localhost:8082/    # aws-simulation backend-service
{"service": "shopsphere-backend", "namespace": "aws-simulation", "simulated_cloud": "AWS", "status": "ok"}

$ curl http://localhost:8083/    # gcp-simulation frontend-service
<html>
  <body style="font-family: sans-serif; background:#1a73e8; color:white; padding:2rem;">
    <h1>ShopSphere frontend</h1>
    <p>Namespace: gcp-simulation</p>
    <p>Simulated cloud: GCP</p>
  </body>
</html>

$ curl http://localhost:8084/    # gcp-simulation backend-service
{"service": "shopsphere-backend", "namespace": "gcp-simulation", "simulated_cloud": "GCP", "status": "ok"}
```

Each response embeds its own namespace name, confirming the right pod in the right namespace answered.

## 3. Namespace Isolation

`kubectl get all -n aws-simulation` and `kubectl get all -n gcp-simulation` (above) each list only their own pods, services, and deployments — the two namespaces never appear in each other's output, confirming resources in one namespace are not visible from the other.
