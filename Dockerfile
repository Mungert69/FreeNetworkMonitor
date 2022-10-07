FROM ubuntu/apache2
MAINTAINER mungert@gmail.com
RUN apt-get update;\apt-get upgrade;\a2enmod rewrite;\a2enmod ssl; apt-get clean
COPY ./build/ /var/www/html/
COPY default-ssl.conf /etc/apache2/sites-enabled
COPY 000-default.conf /etc/apache2/sites-enabled
COPY server.crt /etc/apache2/
COPY server.key /etc/apache2/
COPY apache2.conf /etc/apache2/
EXPOSE 443
CMD apachectl -D FOREGROUND

