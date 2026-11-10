import { useState } from 'react'

function TarjetaPalabra({
    palabra,
    fonetica,
    tipo,
    definicion,
    ejemplo,
    audio,
    esFavorita,
    onToggleFavorita,
}) {
    const [errorAudio, setErrorAudio] = useState(false)

    function reproducir() {
        setErrorAudio(false)
        const url = audio.startsWith('//') ? 'https:' + audio : audio
        new Audio(url).play().catch((err) => {
            console.error('Error de audio:', err)
            setErrorAudio(true)
        })
    }

    return (
        <div className="tarjeta">
            <h2>{palabra}</h2>
            {fonetica && <p className="fonetica">{fonetica}</p>}
            <span className="tipo">{tipo}</span>
            <p className="definicion">{definicion}</p>
            {ejemplo && <p className="ejemplo"><em>"{ejemplo}"</em></p>}

            <div className="acciones">
                {audio && (
                    <button className="boton-sec" onClick={reproducir}>
                        🔊 Escuchar
                    </button>
                )}
                <button className="boton-sec" onClick={onToggleFavorita}>
                    {esFavorita ? '★ Quitar de favoritos' : '☆ Guardar en favoritos'}
                </button>
            </div>
            {errorAudio && (
                <p className="mensaje mensaje-error">No se pudo reproducir el audio.</p>
            )}
        </div>
    )
}

export default TarjetaPalabra