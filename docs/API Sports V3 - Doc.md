# Documentacion:

## Fuente: [API Football V3 - Documentation](https://www.api-football.com/documentation-v3#section/Logos-Images)

### Autenticacion

Utilizamos claves API para permitir el acceso a la API. Puedes registrar una nueva clave API en nuestro panel de control.

**API-SPORTS: https://v3.football.api-sports.io/**

Nuestra API requiere que la clave API se incluya en todas las solicitudes al servidor en un encabezado similar al siguiente:

Asegúrate de reemplazar `XxXxXxXxXxXxXxXxXxXxXxXx` con tu clave API.

#### ENCABEZADOS DE SOLICITUDES Y CORS

La API está configurada para funcionar solo con solicitudes **GET** y solo permite los encabezados que se enumeran a continuación:

`x-apisports-key`

Si realizas solicitudes que no sean **GET** o agregas encabezados que no están en la lista, recibirás un error de la API.

Algunos frameworks (especialmente en **JS, NodeJS, etc.**) agregan automáticamente encabezados adicionales; debes asegurarte de eliminarlos para obtener una respuesta de la API.

Por ejemplo, para utilizar la API con `Node.js`, debemos agregar el siguiente encabezado:

`"x-rapidapi-host": "v3.football.api-sports.io"`

### Ejemplos Script (Node.js)

Aquí tienes algunos ejemplos de cómo se utiliza la API en los principales lenguajes de programación.

Debes reemplazar `{endpoint}` por el nombre real del **endpoint** que deseas llamar, como por ejemplo `«leagues»` o `«fixtures»`. En todos los ejemplos de scripts, utilizaremos el endpoint `«leagues»`.

Además, deberás reemplazar XxXxXxXxXxXxXxXxXxXxXx con tu clave API proporcionada en el panel de control.

```js
//Axios

import axios from "axios";

const config = {
  method: "get",
  url: `https://v3.football.api-sports.io/leagues`,
  headers: {
    "x-rapidapi-key": "XxXxXxXYourAPIKeyXxXxXx",
    "x-rapidapi-host": "v3.football.api-sports.io",
  },
};

axios(config)
  .then((response)=>{
    console.log(JSON.stringify(response.data));
  })
  .catch((error)=>{
    console.log(error);
  });
```
