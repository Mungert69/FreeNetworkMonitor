FROM ubuntu/apache2
MAINTAINER mungert@gmail.com
RUN apt-get update && apt-get -y upgrade && \a2enmod rewrite && \a2enmod ssl && apt-get -y clean 
COPY ./build/ /var/www/html/
COPY ./out/ /var/www/html/blog
COPY ./out/images/ /var/www/html/images
COPY ./out/blogpics/ /var/www/html/blogpics
COPY htaccess /var/www/html/.htaccess
COPY htaccess-blank /var/www/html/blog/.htaccess
COPY default-ssl.conf /etc/apache2/sites-enabled
COPY 000-default.conf /etc/apache2/sites-enabled
COPY security.conf /etc/apache2/conf-enabled
COPY apache2.conf /etc/apache2/
EXPOSE 443
CMD apachectl -D FOREGROUND

