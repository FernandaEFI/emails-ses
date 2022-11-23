## EMAILS AWS AMPLIFY

Instalación 🚀

Clonar el repositorio GIT: https://github.com/efinfo/emails_aws_amplify.git

Pre-requisitos 📋

Al tener el proyecto clonado debemos instalar todas los modulos necesarios para el proyecto
npm install

Construido con 🛠

NextJs
Material UI
Amplify

Autores ✒
Gabriela Cuellar
Fernanda Cruz

## Getting Started

Para correr el proyecto.

```bash
npm run dev
# or
yarn dev
```

Abrir [http://localhost:3000](http://localhost:3000) En el navegador para ver el resultado.

## Subir cambios de la plataforma a producción

Antes de hacer el commit al branch es necesario ejecutar:
npm run build
Si no marca ninigún error se puede hacer el commit, de lo contrario se debera de resolver el error para que no afecte en producción

## Amplify

Descargar los cambios de Amplify
amplify pull --appId d1sh731zw37gwi --envName

Subir los cambios de Amplify
amplify push

Añadir funciones lambda en el proyecto (https://docs.amplify.aws/cli/function/#graphql-from-lambda)
amplify add function
[Nota] Es necesario que los desencadenadores de la función se agegen manualmente desde la consola, de igual manera los permisos de la función

Actualizar funcion
amplify update function

## Learn More

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
