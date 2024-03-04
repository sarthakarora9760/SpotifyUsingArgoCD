# SpotifyUsingArgoCD
Deploying my Spotify project using Argo CD and Argo Rollout Strategies

Step-1: I had my own web application project so I hosted the source code on this github repository.

Step-2: I installed minikube cluster on my windows machine using Docker as a driver. And after executing minikube start --driver=docker, I was able to view the cluster in my Docker Desktop.

Then, I followed the offical guide to install and setup Argo CD into my cluster and when all my pods were in ready state, I port forwarded the service- ArgoCD to 8080 and accessed the Argo CD UI.

Step=3: I then installed Argo Rollouts for my cluster and followed the offical guide.
