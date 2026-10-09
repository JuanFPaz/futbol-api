export function sumatoriaVictoriaLocal(local: any, visitante: any, partido: any) {
  local.points += 3;
  local.goalsDiff += partido.goals.home! - partido.goals.away!;
  local.all.played += 1;
  local.all.win += 1;
  local.all.goals.for += partido.goals.home!;
  local.all.goals.against += partido.goals.away!;
  local.home.played += 1;
  local.home.win += 1;
  local.home.goals.for += partido.goals.home!;
  local.home.goals.against += partido.goals.away!;

  visitante.points += 0;
  visitante.goalsDiff += partido.goals.away! - partido.goals.home!;
  visitante.all.played += 1;
  visitante.all.lose += 1;
  visitante.all.goals.for += partido.goals.away!;
  visitante.all.goals.against += partido.goals.home!;
  visitante.away.played += 1;
  visitante.away.lose += 1;
  visitante.away.goals.for += partido.goals.away!;
  visitante.away.goals.against += partido.goals.home!;
}

export function sumatoriaVictoriaVisitante(local: any, visitante: any, partido: any) {
  local.points += 0;
  local.goalsDiff += partido.goals.home! - partido.goals.away!;
  local.all.played += 1;
  local.all.lose += 1;
  local.all.goals.for += partido.goals.home!;
  local.all.goals.against += partido.goals.away!;
  local.home.played += 1;
  local.home.lose += 1;
  local.home.goals.for += partido.goals.home!;
  local.home.goals.against += partido.goals.away!;

  visitante.points += 3;
  visitante.goalsDiff += partido.goals.away! - partido.goals.home!;
  visitante.all.played += 1;
  visitante.all.win += 1;
  visitante.all.goals.for += partido.goals.away!;
  visitante.all.goals.against += partido.goals.home!;
  visitante.away.played += 1;
  visitante.away.win += 1;
  visitante.away.goals.for += partido.goals.away!;
  visitante.away.goals.against += partido.goals.home!;
}

export function sumatoriaEmpate(local: any, visitante: any, partido: any){
  local.points += 0;
  local.goalsDiff += partido.goals.home! - partido.goals.away!;
  local.all.played += 1;
  local.all.draw += 1;
  local.all.goals.for += partido.goals.home!;
  local.all.goals.against += partido.goals.away!;
  local.home.played += 1;
  local.home.draw += 1;
  local.home.goals.for += partido.goals.home!;
  local.home.goals.against += partido.goals.away!;

  visitante.points += 3;
  visitante.goalsDiff += partido.goals.away! - partido.goals.home!;
  visitante.all.played += 1;
  visitante.all.draw += 1;
  visitante.all.goals.for += partido.goals.away!;
  visitante.all.goals.against += partido.goals.home!;
  visitante.away.played += 1;
  visitante.away.draw += 1;
  visitante.away.goals.for += partido.goals.away!;
  visitante.away.goals.against += partido.goals.home!;
}