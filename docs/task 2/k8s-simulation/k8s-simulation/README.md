# ShopSphere — Task 2.3: Multi-Cloud Namespace Simulation

Student ID: 30908170106047

This simulates a two-cloud setup using two Kubernetes namespaces, `aws-simulation`
and `gcp-simulation`, each running its own frontend pod, backend pod, and services.

## 1. Install and start minikube

```bash
# macOS
brew install minikube kubectl

# Windows (PowerShell, as admin)
choco install minikube kubernetes-cli

# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

Start the cluster:

```bash
minikube start
kubectl get nodes    # confirm the node is Ready
```

## 2. Apply the manifests

From this folder:

```bash
kubectl apply -f 00-namespaces.yaml
kubectl apply -f aws-simulation/manifests.yaml
kubectl apply -f gcp-simulation/manifests.yaml
```

Check both namespaces came up:

```bash
kubectl get pods -n aws-simulation
kubectl get pods -n gcp-simulation
kubectl get svc  -n aws-simulation
kubectl get svc  -n gcp-simulation
```

Wait until every pod shows `Running` and `1/1` ready before moving on.

## 3. Reach the services with port-forward

Open four terminals (or run one at a time), forwarding a different local port
for each service:

```bash
# Terminal 1 — AWS-sim frontend
kubectl port-forward -n aws-simulation svc/frontend-service 8081:80

# Terminal 2 — AWS-sim backend
kubectl port-forward -n aws-simulation svc/backend-service 8082:80

# Terminal 3 — GCP-sim frontend
kubectl port-forward -n gcp-simulation svc/frontend-service 8083:80

# Terminal 4 — GCP-sim backend
kubectl port-forward -n gcp-simulation svc/backend-service 8084:80
```

In another terminal, confirm each one actually responds:

```bash
curl http://localhost:8081/    # should mention "aws-simulation"
curl http://localhost:8082/    # should mention "aws-simulation"
curl http://localhost:8083/    # should mention "gcp-simulation"
curl http://localhost:8084/    # should mention "gcp-simulation"
```

Each response embeds its own namespace name, so a passing result here is
direct evidence the right pod in the right namespace answered — not just
that something is listed by `kubectl get`.

## 4. Verify namespace isolation

Confirm resources in one namespace are not visible from the other:

```bash
# A pod's short DNS name only resolves inside its own namespace
kubectl exec -n aws-simulation deploy/frontend -- \
  wget -qO- http://backend-service   # works (same namespace)

kubectl exec -n aws-simulation deploy/frontend -- \
  wget -qO- --timeout=3 http://backend-service.gcp-simulation \
  || echo "expected: cannot reach a Service by its aws-simulation name from another namespace context without the full FQDN"

# Listing one namespace never shows the other's objects
kubectl get all -n aws-simulation
kubectl get all -n gcp-simulation
```

Because Kubernetes Services only get a short DNS name inside their own
namespace, and `kubectl get -n <ns>` only ever lists that namespace's
objects, the two simulated "clouds" stay isolated from each other by
default — no NetworkPolicy is required for this basic separation, though
one could be added for stricter network-level isolation.

## 5. Clean up (optional)

```bash
kubectl delete namespace aws-simulation gcp-simulation
minikube stop
```

## What to capture for submission

- `kubectl get pods,svc -n aws-simulation` and the same for `gcp-simulation`
- The four `curl` outputs from step 3, showing each response is scoped to
  its own namespace
- The isolation check from step 4

## Files in this folder

| File | Purpose |
|---|---|
| `00-namespaces.yaml` | Creates `aws-simulation` and `gcp-simulation` |
| `aws-simulation/manifests.yaml` | Frontend + backend Deployments and Services for the AWS-simulation namespace |
| `gcp-simulation/manifests.yaml` | Frontend + backend Deployments and Services for the GCP-simulation namespace |
