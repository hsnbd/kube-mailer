# Challenges

## Steps to create docker images
- create Docker file
    - choose right image
    - copy file and build
    - do multi-stage build and optimized prod build if possible
    - expose necessary port
    - run necessary command
    - for any ARG support do ARG
- build docker image
    - create with latest tag and version tag both 
    ^ (`docker build -t kube-mailer/mailer-ui:latest -t kube-mailer/mailer-ui:1.0.0 ./services/mailer-ui`)
- push to registry



# Run Docker images locally
- create a network
```bash
docker create network kube-mailer
```
> Here challenges is when docker container starts its trying to resolve proxy_pass http://primary-server:3001; in nginx and fail by `host not found in upstream "primary-server"`
Solution: 
```
before 
proxy_pass http://primary-server:3001;

after
resolver 127.0.0.11 valid=30s;  # Docker embedded DNS for user-defined networks (within http after http block starts)

set $backend "http://primary-server:3001";
proxy_pass $backend;
```
```
docker exec -it kube-mailer-mail-ui sh
ping kube-mailer-primary-server
curl http://kube-mailer-primary-server:3001/api/health
```

- create .env-docker for env variables (--env service/.env-docker or instant -e KEY=val)