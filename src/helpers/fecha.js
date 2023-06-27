const today = new Date();
const ultimoDia = new Date(today.getFullYear(), today.getMonth() + 1, 0);
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yy = today.getFullYear().toString().slice(2, 4);
const yyyy = today.getFullYear();

const fechaDesde = `01${mm}${yyyy}`;
const periodoDesde = `${yyyy}${mm}`;
const fechaHasta = `${ultimoDia.getDate()}${mm}${yyyy}`;

const hoy = dd + mm + yy;

module.exports = {
  hoy,
  fechaDesde,
  periodoDesde,
  fechaHasta
};
