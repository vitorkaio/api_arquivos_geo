const filesNear = (myCoord, fileCoord) => {
  // const distancia_max = 10 -> 10km
  // const distancia_max = 0.1 -> 100m
  const distancia_max = 0.0001; // 1m
  const distancia = distancia_entre_dois_pontos(myCoord, fileCoord);

  console.log("\n\nDistancia: " + distancia);
  if(distancia <= distancia_max) {
    console.log("Dentro do raio");
    return true;
  }
    else {
      console.log("Fora do raio");
      return false;
    }
}

const distancia_entre_dois_pontos = (myCoord, fileCoord) => {
  const sua_lat = myCoord.lat;
  const sua_lon = myCoord.lon;
  const arquivo_lat = fileCoord.lat;
  const arquivo_lon = fileCoord.lon;

  const R = 6371;

  const d_lat = grau_radianos(arquivo_lat - sua_lat);
  const d_lon = grau_radianos(arquivo_lon - sua_lon);

  const a = Math.sin(d_lat / 2) * Math.sin(d_lat / 2) + Math.cos(grau_radianos(sua_lat)) * Math.cos(grau_radianos(arquivo_lat)) * Math.sin(d_lon / 2) * Math.sin(d_lon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;

  return d;

}

const grau_radianos = (graus) => {
  return graus * (Math.PI / 180);
}

export default filesNear;