export function esClausuraApertura(tournament?: string){
    return tournament === 'apertura' || tournament === 'clausura'
}

export function esCopaDeLaLiga(league?:string){
    return league === "copa-lpf"
}

export function esLigaProfesional(league?:string){
    return league === "lpf"
}

export function esTemporada(season:string, year:number){
    return Number(season) === year
}

export function esFaseRegular(fase: string){
    // 'Apertura - 1'
    // 'Apertura - Octavos de final'
    // Con este patron, comparamos si lo que le sigue al guion, es un numero.
    return / - \d+$/.test(fase);
}

export function esFasePlayoff(fase:string){
    return !esFaseRegular(fase) && fase !== 'Relegation Decider'
}

export function esPartidoFinalizado(partido:string){
    return partido === "Match Finished"
}

export function esVictoriaLocal(local:any){
    return local.winner === true
}

export function esVictoriaVisitante(visitante: any){
    return visitante.winner === true
}

export function esEmpate(local: any, visitante: any){
   return local.winner === null && visitante.winner === null
}