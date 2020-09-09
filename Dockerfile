FROM nginx:1.15.2-alpine

# Copy the nginx configrations
COPY deployments/nginx.conf /etc/nginx/nginx.conf
# COPY deployments/.htpasswd /etc/nginx/.htpasswd
COPY deployments/start.sh /opt/start.sh
RUN chmod +x /opt/start.sh

RUN rm -rf /var/www/
COPY ./build /var/www

EXPOSE 80

CMD ["./opt/start.sh"]
