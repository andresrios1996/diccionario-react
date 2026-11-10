import { useState, useEffect } from 'react'
import TarjetaPalabra from './components/TarjetaPalabra'
import './App.css'

function App() {
  const [entrada, setEntrada] = useState('')
  const [palabraBuscada, setPalabraBuscada] = useState('')
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('favoritos')
    return guardados ? JSON.parse(guardados) : []
  })

  useEffect(() => {
    if (!palabraBuscada) return

    let ignorar = false

    async function buscar() {
      setCargando(true)
      setError('')
      setResultado(null)

      try {
        const respuesta = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${palabraBuscada}`
        )
        if (!respuesta.ok) {
          throw new Error('No se encontró la palabra.')
        }
        const datos = await respuesta.json()
        if (!ignorar) setResultado(datos[0])
      } catch (err) {
        console.error(err)
        if (!ignorar) {
          setError('No se encontró la palabra o hubo un problema de conexión.')
        }
      } finally {
        if (!ignorar) setCargando(false)
      }
    }

    buscar()

    return () => {
      ignorar = true
    }
  }, [palabraBuscada])

  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos))
  }, [favoritos])

  function manejarEnvio(e) {
    e.preventDefault()
    setPalabraBuscada(entrada.trim().toLowerCase())
  }

  function alternarFavorita() {
    const palabra = resultado.word.toLowerCase()
    if (favoritos.includes(palabra)) {
      setFavoritos(favoritos.filter((f) => f !== palabra))
    } else {
      setFavoritos([...favoritos, palabra])
    }
  }

  function buscarFavorita(palabra) {
    setEntrada(palabra)
    setPalabraBuscada(palabra)
  }

  const significado = resultado?.meanings[0]
  const definicion = significado?.definitions[0]
  const fonetica =
    resultado?.phonetic || resultado?.phonetics.find((p) => p.text)?.text
  const audio =
    resultado?.phonetics.find((p) => p.audio?.includes('-us'))?.audio ||
    resultado?.phonetics.find((p) => p.audio)?.audio
  const esFavorita = resultado
    ? favoritos.includes(resultado.word.toLowerCase())
    : false

  return (
    <div className="app">
      <h1>Diccionario</h1>

      <form className="buscador" onSubmit={manejarEnvio}>
        <input
          type="text"
          placeholder="Busca una palabra en inglés..."
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
        />
        <button className="boton" type="submit">Buscar</button>
      </form>

      {cargando && <p className="mensaje">Buscando...</p>}
      {error && <p className="mensaje mensaje-error">{error}</p>}

      {resultado && (
        <TarjetaPalabra
          palabra={resultado.word}
          fonetica={fonetica}
          tipo={significado.partOfSpeech}
          definicion={definicion.definition}
          ejemplo={definicion.example}
          audio={audio}
          esFavorita={esFavorita}
          onToggleFavorita={alternarFavorita}
        />
      )}

      <section className="favoritos">
        <h2>Favoritos</h2>
        {favoritos.length === 0 && (
          <p className="mensaje">Aún no has guardado ninguna palabra.</p>
        )}
        <ul className="lista-favoritos">
          {favoritos.map((f) => (
            <li key={f}>
              <button className="boton-sec" onClick={() => buscarFavorita(f)}>
                {f}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default App