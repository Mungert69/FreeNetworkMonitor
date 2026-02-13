FROM ubuntu/apache2
LABEL maintainer="mungert@gmail.com"
RUN a2enmod rewrite ssl headers
COPY ./dist/ /var/www/html/
COPY ./out/images/ /var/www/html/images
COPY ./out/blogpics/ /var/www/html/blogpics
COPY htaccess /var/www/html/.htaccess
COPY default-ssl.conf /etc/apache2/sites-enabled/default-ssl.conf
COPY 000-default.conf /etc/apache2/sites-enabled/000-default.conf
COPY apache2.conf /etc/apache2/
EXPOSE 443
CMD ["apachectl", "-D", "FOREGROUND"]
