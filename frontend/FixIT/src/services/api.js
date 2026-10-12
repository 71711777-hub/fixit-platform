const API_URL = import.meta.env.VITE_API_URL
// REGISTRAR USUARIO
export async function registrarUsuario(datos) {
  const respuesta = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.message || 'No se pudo crear la cuenta')
  }

  return resultado
}
// INICIAR SESIÓN
export async function iniciarSesion(datos) {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.message || 'No se pudo iniciar sesión')
  }

  return resultado
}
// OBTENER USUARIO JWT
export async function obtenerUsuarioActual() {
  const token = localStorage.getItem('fixit_token')

  if (!token) {
    throw new Error('No hay una sesión iniciada')
  }

  const respuesta = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.message || 'No se pudo obtener el usuario')
  }

  return resultado
}

// Obtener creendciales
export async function obtenerMisIncidencias() {
  const token = localStorage.getItem('fixit_token');

  const respuesta = await fetch(
    `${API_URL}/incidencias/mis-incidencias`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.message || 'Error al obtener las incidencias'
    );
  }

  return resultado.data;
}


/// ACTUALIZAR USUARIO
export async function actualizarUsuario(datos) {
  const token = localStorage.getItem('fixit_token')

  if (!token) {
    throw new Error('No hay una sesión iniciada')
  }

  const respuesta = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(datos)
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.message || 'No se pudieron actualizar los datos')
  }

  return resultado
}

// CONSULTAR CATÁLOGO
export async function obtenerCatalogosIncidencia() {
  const respuesta = await fetch(`${API_URL}/incidencias/catalogos`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      resultado.message || 'No se pudieron cargar los catálogos'
    )
  }

  return resultado.data
}


// REGISTAR INCIDENCIA
export async function registrarIncidencia(datos) {
  const token = localStorage.getItem('fixit_token');

  if (!token) {
    throw new Error('Debes iniciar sesión para registrar una incidencia.');
  }

  const respuesta = await fetch(`${API_URL}/incidencias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(datos)
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.message || 'No se pudo registrar la incidencia.'
    );
  }

  return resultado.data;
}


// REGISTRAR EN TRIAJE
export async function registrarRespuestasTriaje(datos) {
  const token = localStorage.getItem('fixit_token')

  if (!token) {
    throw new Error('Debes iniciar sesión para continuar.')
  }

  const respuesta = await fetch(`${API_URL}/triaje/respuestas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(datos)
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      resultado.message || 'No se pudieron guardar las respuestas del triaje.'
    )
  }

  return resultado.data
}

//OBTENER PREGUNTAS DE TRIAJE
export async function obtenerPreguntasTriaje() {
  const token = localStorage.getItem('fixit_token')

  if (!token) {
    throw new Error('Debes iniciar sesión para realizar el triaje.')
  }

  const respuesta = await fetch(`${API_URL}/triaje/preguntas`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      resultado.message || 'No se pudieron cargar las preguntas.'
    )
  }

  return resultado.data
}

//GUARDAR RESPUESTA TRIAJE
export async function guardarRespuestasTriaje(incidenciaId, respuestas) {
  const token = localStorage.getItem('fixit_token')

  if (!token) {
    throw new Error('Debes iniciar sesión para guardar el triaje.')
  }

  const respuesta = await fetch(`${API_URL}/triaje/respuestas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      incidencia_id: incidenciaId,
      respuestas
    })
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      resultado.message || 'No se pudieron guardar las respuestas.'
    )
  }

  return resultado.data
}

//OBTENER TECNICOS

export async function obtenerTecnicos() {
  const respuesta = await fetch(`${API_URL}/tecnicos`);

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.message || 'No se pudo cargar el catálogo de técnicos'
    );
  }

  return resultado.data;
}


// OBTENER INCIDENCIASS
export async function obtenerDetalleIncidencia(id) {
  const token = localStorage.getItem('fixit_token');

  const respuesta = await fetch(
    `${API_URL}/incidencias/${encodeURIComponent(id)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.message || 'No se pudo obtener el detalle'
    );
  }

  return resultado.data;
}


