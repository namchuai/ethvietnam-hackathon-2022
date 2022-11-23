FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/clever-launch-backend .
ENV NO_COLOR="true"
EXPOSE 80
RUN npm install --omit=dev
# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js
