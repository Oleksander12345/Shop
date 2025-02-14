# Используем Node.js для сборки React
FROM node:18-alpine AS build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json перед установкой зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем React-приложение
RUN npm run build

# Используем Nginx для раздачи статических файлов
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Прокидываем порт, который будет использоваться
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
