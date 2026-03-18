// Dentro del addEventListener('submit', ...) , reemplaza el listener de btn-hoja por esto:

document.getElementById('btn-hoja').addEventListener('click', () => {
    const getSiNo = (value) => {
        const v = String(value || '').toLowerCase().trim();
        if (v === 'true' || v === 'si' || v === 'sí' || v === 'yes' || v === '1') return "Sí";
        return "No";
    };

    const getCantidad = (value) => {
        const num = parseInt(value);
        if (isNaN(num) || num <= 0) return "Ninguno";
        return num.toString();
    };

    const orden = [
        data.fecha || '',
        data.nombre || '',
        data.direccion || '',
        data.telefono || '',
        data.email || '',
        data.disponibilidad || '',
        getSiNo(data.reforma_integral),
        data.m2 || '',
        data.habitaciones || '',
        data.banos || '',
        data.consiste_obra || '',
        getSiNo(data.inversion_mayor),
        data.calidad_precio || '',
        data.estilo || '',
        data.fecha_inicio_obra || '',
        getSiNo(data.ascensor),
        getSiNo(data.cambios_distribucion),
        getSiNo(data.reforma_cocina),
        getSiNo(data.recuperar_cocina),
        getSiNo(data.reforma_banos_integral),
        getSiNo(data.recuperar_banos),
        getSiNo(data.renovacion_fontaneria),
        data.renovacion_calefaccion || 'No',
        data.cambiar_caldera || 'No',
        getSiNo(data.renovacion_electricidad),
        getSiNo(data.instalacion_comunitaria),
        getSiNo(data.aire_acondicionado),
        data.tipo_ac || '',
        data.cambios_carpinteria_exterior || 'No',
        getCantidad(data.cambios_carpinteria_exterior_cuantos),
        data.cambios_carpinteria_interior || 'No',
        getCantidad(data.cambios_carpinteria_interior_cuantos),
        data.cambios_suelo || 'No',
        data.tipo_solado || '',
        getSiNo(data.cambios_techo),
        getSiNo(data.falso_techo)
    ];

    // ←←← Aquí está el cambio solicitado: coma + espacio
    const texto = orden.join(', ');

    navigator.clipboard.writeText(texto).then(() => {
        alert("Copiado con formato: valor, valor, valor...\n(coma + espacio)\nPégalo directamente en una fila de Excel o Google Sheets.");
    }).catch(() => {
        alert("No se pudo copiar al portapapeles.");
    });
});
