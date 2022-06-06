FROM mysql/mysql-server

ENV MYSQL_ROOT_PASSWORD test

COPY Proiect_MDS_BD.sql /docker-entrypoint-initdb.d/
EXPOSE 3306
