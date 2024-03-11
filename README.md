# research-server

## docker 환경에서 mariadb 접속

docker-compose 실행
```
docker-compose up -d
```

실행 중인 docker 프로세스 확인
```
docker ps -a
```

mariadb 컨테이너 접속
```
docker exec -it re_search_mariadb /bin/bash
```

mariadb 접속
```
mariadb -uroot -p
```

## mariadb migration (테이블 자동 생성 및 업데이트)

프로젝트에 config/config.json 생성
```
{
  "development": {
    "username": "admin",
    "password": "admin",
    "database": "re_search",
    "host": "127.0.0.1",
    "dialect": "mariadb"
  }
}

```

sequelize-cli로 migration 실행
```
npx sequelize-cli db:migrate
```

