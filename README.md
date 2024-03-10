# research-server

## docker-compose로 mariadb 접속

1. docker-compose 실행
```
docker-compose up -d
```

2. 실행 중인 docker 프로세스 확인
```
docker ps -a
```

3. mariadb 컨테이너 접속
```
docker exec -it re_search_mariadb /bin/bash
```

4. mariadb 접속
```
mariadb -uroot -p
```
