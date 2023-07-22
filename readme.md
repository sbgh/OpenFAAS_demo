# Production 101 demo

## OpenFAAS

The following are the approximate steps to create an OpenFaaS instance with Kubernetes and Docker.

There is no reason to clone this repository. Following the instructions below will build the OpenFAAS file structure. 

See demo docker containers on [Dockerhub](https://hub.docker.com/r/dhscott/adsl-demo)

**Install Docker:**

Based On:
https://cloudcone.com/docs/article/how-to-install-and-run-docker-on-ubuntu-20-04-lts/#:~:text=By%20default%2C%20Ubuntu%2020.04%20systems,from%20the%20official%20Docker%20repositories.&text=The%20version%20of%20docker%20packages,indicated%20in%20the%20second%20column

 
https://www.digitalocean.com/community/questions/how-to-fix-docker-got-permission-denied-while-trying-to-connect-to-the-docker-daemon-socket

    sudo apt update

    sudo apt install docker-ce docker-ce-cli containerd.io

**To create the docker group and add your user:**

Create the docker group.

    sudo groupadd docker

Add your user to the docker group.

    sudo usermod -aG docker ${USER}

You would need to log out and log back in so that your group membership is re-evaluated or type the following command:

    su -s ${USER}

Verify that you can run docker commands without sudo.

    docker run hello-world

## Install Kubernetes

  
Based on:
https://www.learnitguide.net/2023/04/how-to-install-kubernetes-on-ubuntu-2004.html

(if: https://serverfault.com/questions/1124015/kubeadm-is-showing-error-cri)

delete the config.tomal file 

    sudo rm /etc/containerd/config.toml

restart containerd 

    systemctl restart containerd

(turn off swap)

    sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
    sudo swapoff -a

    mkdir -p $HOME/.kube

    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config


You should now deploy a pod network to the cluster.

https://kubernetes.io/docs/concepts/cluster-administration/addons/

https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart

  
## Install openFaas

    curl -SLsf https://get.arkade.dev/ | sudo sh

    arkade install openfaas

To verify that openfaas has started, run:

    kubectl -n openfaas get deployments -l "release=openfaas, app=openfaas"

To retrieve the admin password, run:

    echo $(kubectl -n openfaas get secret basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode)

  
xxxxxxxxxxxxxxxxx

    arkade info openfaas

—————————————————

Info for app: openfaas

# Get the faas-cli

    curl -SLsf https://cli.openfaas.com | sudo sh

  

# Forward the gateway to your machine

    kubectl rollout status -n openfaas deploy/gateway

    kubectl port-forward -n openfaas svc/gateway 8080:8080 &

  

# If basic auth is enabled, you can now log into your gateway:

    export PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)

xxxxxxxxxxxx

    echo -n $PASSWORD | faas-cli login --username admin --password-stdin



    faas-cli list

  

**Find out more at:**

https://github.com/openfaas/faas

Create new docker swarm

    docker swarm init

Forward kubectl port (may need to happen after each reboot)
 

    kubectl port-forward -n openfaas svc/gateway 8080:8080 &

Log into cli

    faas-cli login --username admin --password xxxxxxxxx

  

    jobs

  

    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
Install nodejs 

    sudo apt install -y nodejs

  
  

https://hackernoon.com/how-to-create-serverless-functions-with-openfaas-in-17-steps-u21l3y7m

  

    faas-cli template store list

    faas-cli template pull

  
See if forwarded port is still running

    ps -aux | grep 8080
If not run it again

    kubectl port-forward -n openfaas svc/gateway 8080:8080 &

  

    faas-cli template store list

  Create account on DockerHub

    docker login --username your_username

  

    faas-cli new adsl-demo --lang node

    faas-cli build -f adsl-demo.yml

  
    docker images


    faas-cli push -f adsl-demo.yml
    
      
    faas-cli deploy -f adsl-demo.yml
      
    
    faas-cli list
    
      
    faas-cli describe adsl-demo
    
      
    faas-cli invoke -f adsl-demo.yml adsl-demo

(ctl - d to end)

 

    curl http://127.0.0.1:8080/function/adsl-demo

    
If all is good you can modify the code to your liking. Add js code to handler.js. You can copy the weather demo code from this repo Create an accout at openweathermap.org and gererate your api key. install sync-request (npm install sync-request). Add your accout name to the app .yml file (image: your_dockerhub_acct/rac-hello-world:latest)
    
    faas-cli build -f adsl-demo.yml; 
    faas-cli push -f adsl-demo.yml; 
    faas-cli deploy -f adsl-demo.yml; 
    
    curl http://127.0.0.1:8080/function/adsl-demo
