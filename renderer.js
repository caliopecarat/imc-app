const boton = document.getElementById('calcularBtn');
const resultado = document.getElementById('resultado');
const historialDiv = document.getElementById('historial');

function obtenerCategoria(imc) {
  if (imc < 18.5) {
    return 'Bajo peso';
  } else if (imc < 25) {
    return 'Peso normal';
  } else if (imc < 30) {
    return 'Sobrepeso';
  } else {
    return 'Obesidad';
  }
}

async function mostrarHistorial() {
  const historial = await window.apiIMC.leerHistorial();

  if (!historial || historial.length === 0) {
    historialDiv.innerHTML = `
      <h2>Historial de cálculos</h2>
      <p>No hay registros guardados todavía.</p>
    `;
    return;
  }

  let html = `
    <h2>Historial de cálculos</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Peso</th>
          <th>Altura</th>
          <th>IMC</th>
          <th>Categoría</th>
        </tr>
      </thead>
      <tbody>
  `;

  historial.forEach(registro => {
    html += `
      <tr>
        <td>${registro.nombre}</td>
        <td>${registro.peso} kg</td>
        <td>${registro.altura} m</td>
        <td>${registro.imc}</td>
        <td>${registro.categoria}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  historialDiv.innerHTML = html;
}

boton.addEventListener('click', async () => {
  const nombre = document.getElementById('nombre').value.trim();
  const peso = parseFloat(document.getElementById('peso').value);
  const altura = parseFloat(document.getElementById('altura').value);

  if (nombre === '' || isNaN(peso) || isNaN(altura) || altura <= 0 || peso <= 0) {
    resultado.innerHTML = `
      <h2>Resultado</h2>
      <p style="color: red; font-weight: bold;">
        Por favor, completa todos los campos correctamente.
      </p>
    `;
    return;
  }

  const imc = peso / (altura * altura);
  const imcRedondeado = parseFloat(imc.toFixed(2));
  const categoria = obtenerCategoria(imc);

  const nuevoRegistro = {
    nombre,
    peso,
    altura,
    imc: imcRedondeado,
    categoria
  };

  const respuesta = await window.apiIMC.guardarIMC(nuevoRegistro);

  if (!respuesta.ok) {
    resultado.innerHTML = `
      <h2>Resultado</h2>
      <p style="color: red; font-weight: bold;">Error al guardar el registro.</p>
    `;
    return;
  }

  resultado.innerHTML = `
    <h2>Resultado</h2>
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Peso:</strong> ${peso} kg</p>
    <p><strong>Altura:</strong> ${altura} m</p>
    <p><strong>IMC:</strong> ${imcRedondeado}</p>
    <p><strong>Categoría:</strong> ${categoria}</p>
  `;

  document.getElementById('nombre').value = '';
  document.getElementById('peso').value = '';
  document.getElementById('altura').value = '';

  mostrarHistorial();
});

mostrarHistorial();