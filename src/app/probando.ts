export function prueba() {
  //Dado un arreglo de [[{group:'Apertura'}], [{group:'Apertura'}]]
  // Queremos filtrar si el group empieza por Apertura o clausura.
  // Pero solo si es season 2026.
  // De lo contrario, devolvemos true por defecto (guardamos todo, hacemos el sort, mapeo y al final, un flat map)
  let season = 2025;
  let torneo = "apertura";
  const data = [
      [{group:'Apertura - A'}],
      [{group:'Apertura - B'}],
      [{group:'Clausura - A'}],
      [{group:'Clausura - B'}],
  ]

//   const data = [
//     [{ group: "Clausura - A" }],
//     [{ group: "Clausura - B" }],
//   ];

  let miau = data.flatMap((standing) => {
    const filter = standing.filter((team) => {
      if (season === 2026) return team.group.toLowerCase().startsWith(torneo);
      return true;
    });

    return filter;
  });

  console.log(miau);
}
