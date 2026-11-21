FROM nginx:1.31-alpine

# L'image ne contient que la page et sa configuration, pas le reste du dépôt.
RUN rm -rf /usr/share/nginx/html/*
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY En-aparte.html /usr/share/nginx/html/En-aparte.html

EXPOSE 80
