FROM nginx:1.18.0-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY ./build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
