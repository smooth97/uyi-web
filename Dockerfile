# Build environment
FROM node:12.16.2 as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY build /app/build
# RUN npm install
# RUN npm install react-scripts@3.4.0 -g --silent
# RUN rm -r node_modules/terser
# RUN npm install terser@3.14.1 --save-dev
# COPY . /app
# RUN npm run build

# Production environment
FROM nginx:1.16.0-alpine
COPY --from=builder /app/build /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]