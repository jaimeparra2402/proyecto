FROM node:20-alpine AS build

WORKDIR /app

COPY list ./list
COPY frontend-ionic ./frontend-ionic

RUN cd list && npm install && npm run build

RUN cd frontend-ionic && npm install && npm run build --configuration=production

FROM nginx:alpine

COPY --from=build /app/frontend-ionic/www /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]