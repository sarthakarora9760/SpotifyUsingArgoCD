Notes:-

Docker images used in both applications:-
saarora123/spotifyv1, saarora123/netflixv1
Step-1: I had my own web application projects so I hosted the source code for the same in this github repository under folders netflix and spotify.


Step-2: I installed minikube cluster on my windows machine using Docker as a driver (Kubernetes v1.28.3 on Docker 24.0.7) and after executing minikube start --driver=docker, I was able to view the cluster in my Docker Desktop.


Then, I followed the offical guide to install and setup Argo CD into my cluster and when all my pods were in ready state, I port forwarded the service- ArgoCD to 8080 and accessed the Argo CD UI.


Step=3: I then installed Argo Rollouts for my cluster and followed the offical guide.


Step-4: Then, I dockerized two of my simple web applications (Netflix by Sarthak) and (Spotify by Sarthak) using a simple Dockerfile that contains nginx:alpine as base image. Also, I pushed the images to my public registry saarora123/spotifyv1 and saarora123/netflixv1


Then in this github repository, I created a fresh kubernetes manifests file (dev/deployment.yaml) to use the latest docker image that I just built.
Also, I created application.yaml which I applied to my cluster. Available in the main branch by the name application.yaml


Then I checked the status of my application in Argo CD UI and it was healthy. It started monitoring this github repo.

![image](https://github.com/sarthakarora9760/SpotifyUsingArgoCD/assets/60189057/5d952de1-b762-4c29-a4ba-ba1d6c3b4cd5)

Also, I was able to see the container running in my docker desktop.

![image](https://github.com/sarthakarora9760/SpotifyUsingArgoCD/assets/60189057/d81d1321-c541-4910-a01c-d15123b67e48)

In my 8080 port, I was able to access the container.

![image](https://github.com/sarthakarora9760/SpotifyUsingArgoCD/assets/60189057/1bfa229a-d950-4263-9910-2446d244fb20)


Step-5: Then, I created rollout.yaml to define canary rollout stratefy for my rollouts and I applied it to my cluster. It's available in this same github repository in the main branch by name rollout.yaml

Step-6: To trigger the rollout, I changed my deployment.yaml file to point to my new docker image saarora123/netflixv1

![Screenshot 2024-03-06 120127](https://github.com/sarthakarora9760/SpotifyUsingArgoCD/assets/60189057/81712f9f-50a3-477d-bd26-d86eef5e9e77)

![Screenshot 2024-03-06 120234](https://github.com/sarthakarora9760/SpotifyUsingArgoCD/assets/60189057/6324b887-c780-4b29-b907-a5cfa0382719)


As I commit the changes, Argo CD service got out of sync and it started applying the changes and spinning up a new container.

![Screenshot 2024-03-06 120300](https://github.com/sarthakarora9760/SpotifyUsingArgoCD/assets/60189057/4b131d28-bcdc-4b8e-8bbd-68b395d4dd13)

After some time, It got synced and healthy

![Screenshot 2024-03-06 120311](https://github.com/sarthakarora9760/SpotifyUsingArgoCD/assets/60189057/911960ad-e569-4522-b0a3-102bbac08e2b)

In the logs, I was able to see a successfull rollout from previous version to new version. (Spotifyv1 to netflxv1)



Cleanups:-

Cleanup is a crucial part in order to free all the resources, firstly I stopped and deleted the live containers from my docker desktop and that stopped minikube cluster. After that, I deleted minikube using minikube delete command.

And with that my Argocd, argorollout basicallly my whole cluster memory got cleaned up.

Challenges:-

1- I got stuck at a point where my windows powershell was continously throwing an error while I was trying to start my minikube cluster using --driver docker. Then, I looked over the internet and found out that powershell needs to be restarted in order to recognize installation of docker.
