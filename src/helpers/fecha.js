
    let today = new Date();
    let ultimoDia = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    let hoy

    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yy = today.getFullYear().toString().slice(2,4)
    let yyyy = today.getFullYear();

    let fechaDesde = `01${mm+yyyy}`
    let periodoDesde = `${yyyy+mm}` 
    let fechaHasta = `${ultimoDia.getDate()+mm+yyyy}`

    today = dd + '/' + mm + '/' + yyyy;
    hoy = dd + mm + yy

module.exports = {
    hoy,
    fechaDesde,
    periodoDesde,
    fechaHasta
}




  
