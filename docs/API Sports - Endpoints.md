# Endpoints

## Leagues

`GET` **https://v3.football.api-sports.io/leagues**

---

Obtén la lista de **ligas** y **copas** disponibles.

Los **ID** de las `ligas` son únicos en la API y se conservan durante todas las temporadas.

Para obtener el logo de una competición, debes acceder a la siguiente URL: https://media.api-sports.io/football/leagues/{league_id}.png

Este endpoint también devuelve la cobertura de cada competición, lo que permite saber qué información está disponible para esa liga o copa.

Los valores devueltos por la cobertura indican los datos disponibles en el momento de la llamada a la API. Por lo tanto, para una competición que aún no ha comenzado, es normal que todas las características estén configuradas como False. Esta información se actualizará una vez que la competición haya comenzado.

- Query params:

| Parámetro | Tipo      | Descripción                                                                           | Valores / Formato                                        |
| --------- | --------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `id`      | `integer` | ID de la liga.                                                                        | -                                                        |
| `name`    | `string`  | Nombre de la liga.                                                                    | -                                                        |
| `country` | `string`  | Nombre del país de la liga.                                                           | -                                                        |
| `code`    | `string`  | Código Alpha del país.                                                                | Entre **2 y 6** caracteres (`FR`, `GB-ENG`, `IT`, etc.). |
| `season`  | `integer` | Temporada de la liga.                                                                 | Formato **YYYY** (4 dígitos).                            |
| `team`    | `integer` | ID del equipo.                                                                        | -                                                        |
| `type`    | `string`  | Tipo de competición.                                                                  | `"league"` \| `"cup"`                                    |
| `current` | `string`  | Devuelve las temporadas activas o la última temporada disponible de cada competición. | `"true"` \| `"false"`                                    |
| `search`  | `string`  | Busca por nombre de la liga o del país.                                               | Mínimo **3 caracteres**.                                 |
| `last`    | `integer` | Devuelve las últimas **X** ligas/copas agregadas a la API.                            | Máximo **2 dígitos**.                                    |

> > Nota: si usamos solo el endpoint **https://v3.football.api-sports.io/leagues**, nos devolvera un json con todas las ligas disponibles de la API.

    Por eso, con el uso de estos query params, podemos filtrar una liga especifica pasandole el `id` de la liga, o buscar todas las ligas disponibles de un pais, o etc.

Ejemplo, podemos buscar las ligas disponibles de un pais, enviando en el cuerpo de la solicitud, el nombre del pais (`country`):

```JSON
{
    "country":"argentina",
}
```

```ts
app.post("/leagues", async (req: Request, res: Response) => {
  const { country } = req.body;
  const config = {
    method: "get",
    url: `https://v3.football.api-sports.io/leagues?country=${country}`,
    headers: {
      "x-rapidapi-key": "xxxxxxxxxxxxxxxxxxxxxxxx",
      "x-rapidapi-host": "v3.football.api-sports.io",
    },
  };
  const { data } = await axios(config);
  res.json({ status: 200, message: "Recurso creado (?", data });
});
```

Ejemplo de la respuesta:

```json
{
  "status": 200,
  "message": "Recurso creado (?",
  "data": {
    "get": "leagues",
    "parameters": {
      "country": "argentina"
    },
    "errors": [],
    "results": 14,
    "paging": {
      "current": 1,
      "total": 1
    },
    "response": [
      {
        "league": {
          "id": 131,
          "name": "Primera B Metropolitana",
          "type": "League",
          "logo": "https://media.api-sports.io/football/leagues/131.png"
        },
        "country": {
          "name": "Argentina",
          "code": "AR",
          "flag": "https://media.api-sports.io/flags/ar.svg"
        },
        "seasons": [
          {. . .},
          {. . .},
          {
            "year": 2026,
            "start": "2026-02-07",
            "end": "2026-10-24",
            "current": true,
            "coverage": {
              "fixtures": {
                "events": true,
                "lineups": true,
                "statistics_fixtures": false,
                "statistics_players": false
              },
              "standings": true,
              "players": false,
              "top_scorers": false,
              "top_assists": false,
              "top_cards": false,
              "injuries": false,
              "predictions": true,
              "odds": true
            }
          }
        ]
      },
      {. . .},
      {. . .},
      {. . .},
      {. . .},
      {. . .},
      {. . .},
      {. . .},
      {. . .},
    ]
  }
}
```

## Standings

`GET` **https://v3.football.api-sports.io/leagues**

---

Obtén la clasificación de una liga o un equipo.

Devuelve una tabla con una o más clasificaciones según la liga o copa.

Algunas competiciones tienen varias clasificaciones al año: fase de grupos, clasificación inicial, clasificación final, etc.

Ejemplos disponibles en la sección "Casos de uso" de la solicitud.

La mayoría de los parámetros de este endpoint se pueden usar conjuntamente.

Frecuencia de actualización: Este endpoint se actualiza cada hora.

Llamadas recomendadas: 1 llamada por hora para las ligas o equipos con al menos un partido en curso; de lo contrario, 1 llamada al día.

- Query params:

| Parámetro | Tipo      | Descripción                                                                           | Valores / Formato                                        |
| --------- | --------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `league`      | `integer` | ID de la liga.                                                                        | -                                                        |
| `season` (requerido)    | `integer`  | Temporada de la Liga                                                                   | Formato **YYYY** (4 dígitos).         |
| `team` | `integer`  | ID del equipo.                                                           | -                                                        |


```JSON
{
    "league": 128,
    "season":2026,
}
```

```ts
app.post("/standings", async (req: Request, res: Response) => {
  const { league,season } = req.body;
  const config = {
    method: "get",
    url: `https://v3.football.api-sports.io/standings?league=${league}&season=${season}`,
    headers: {
      "x-rapidapi-key": "xxxxxxxxxxxxxxxxxxxxxxxx",
      "x-rapidapi-host": "v3.football.api-sports.io",
    },
  };
  const { data } = await axios(config);
  res.json({ status: 200, message: "Recurso creado (?", data });
});
```

Ejemplo de la respuesta:

```json
{
	"get": "standings",
	"parameters": {
		"league": "128",
		"season": "2026"
	},
	"errors": [],
	"results": 1,
	"paging": {
		"current": 1,
		"total": 1
	},
	"response": [
		{
			"league": {
				"id": 128,
				"name": "Liga Profesional Argentina",
				"country": "Argentina",
				"logo": "https://media.api-sports.io/football/leagues/128.png",
				"flag": "https://media.api-sports.io/flags/ar.svg",
				"season": 2026,
				"standings": [
					[
						{
							"rank": 1,
							"team": {
								"id": 450,
								"name": "Estudiantes L.P.",
								"logo": "https://media.api-sports.io/football/teams/450.png"
							},
							"points": 31,
							"goalsDiff": 12,
							"group": "Apertura - Group A",
							"form": "LLWDW",
							"status": "same",
							"description": "Knockout Phase",
							"all": {
								"played": 16,
								"win": 9,
								"draw": 4,
								"lose": 3,
								"goals": {
									"for": 19,
									"against": 7
								}
							},
							"home": {
								"played": 8,
								"win": 5,
								"draw": 1,
								"lose": 2,
								"goals": {
									"for": 11,
									"against": 4
								}
							},
							"away": {
								"played": 8,
								"win": 4,
								"draw": 3,
								"lose": 1,
								"goals": {
									"for": 8,
									"against": 3
								}
							},
							"update": "2026-07-28T00:00:00+00:00"
						},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
                        {. . .},
					],
                    [. . .],
                    [. . .],
                    [. . .],
				]
			}
		}
	]
}
```