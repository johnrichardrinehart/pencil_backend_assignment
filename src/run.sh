docker build -t pbe:latest .
docker run -it --env MODE=$1 --init --rm --name app -p 8080:8080 -v $PWD:/var/app/src pbe:latest
