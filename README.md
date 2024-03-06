# SpotifyUsingArgoCD
Deploying my Spotify project using Argo CD and Argo Rollout Strategies

Step-1: I had my own web application project so I hosted the source code on this github repository.

Step-2: I installed minikube cluster on my windows machine using Docker as a driver (Kubernetes v1.28.3 on Docker 24.0.7) and after executing minikube start --driver=docker, I was able to view the cluster in my Docker Desktop.

Then, I followed the offical guide to install and setup Argo CD into my cluster and when all my pods were in ready state, I port forwarded the service- ArgoCD to 8080 and accessed the Argo CD UI.

Step=3: I then installed Argo Rollouts for my cluster and followed the offical guide.

Step-4: Then, I dockerized two of my simple web applications (Netflix by Sarthak) and (Spotify by Sarthak) using a simple Dockerfile that contains nginx:alpine as base image. Also, I pushed the images to my public registry saarora123/spotifyv1 and saarora123/netflixv1
Then in this github repository, I created a fresh kubernetes manifests file to use the latest docker image that I just built.

Step-5: 
