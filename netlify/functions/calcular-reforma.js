// Netlify Function para cálculo y envío de emails
exports.handler = async (event, context) => {
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        
        // Cálculo del presupuesto
        let presupuesto = 1000;

        const m2 = parseInt(data.m2) || 0;
        const habitaciones = parseInt(data.habitaciones) || 0;
        const banos = parseInt(data.banos) || 0;
        const reformaIntegral = data.reforma_integral === true || data.reforma_integral === 'on';

        presupuesto += 75 * m2;
        presupuesto += 4200 * habitaciones;
        presupuesto += 7400 * banos;

        if (reformaIntegral) {
            presupuesto *= 1.2;
        }

        // Cambios distribución
        if (data.cambios_distribucion) presupuesto += 6692;

        // Cocina
        if (data.reforma_cocina) {
            presupuesto += 12000;
            if (data.recupera_cocina) {
                presupuesto -= 12000 * 0.15;
            }
        }

        // Baños
        if (data.reforma_banos_integral) {
            const costoBanosExtra = 100 * banos;
            presupuesto += costoBanosExtra;
            if (data.recupera_banos) {
                presupuesto -= (banos * 7400 + costoBanosExtra) * 0.15;
            }
        }

        // Fontanería
        if (data.renovacion_fontaneria) presupuesto += 6500;

        // Calefacción
        if (data.cambiar_caldera === 'si') {
            presupuesto += 2890;
        }

        // Electricidad
        if (data.renovacion_electricidad) presupuesto += 4527;

        // Aire acondicionado
        if (data.aire_acondicionado) presupuesto += 1500;

        // Carpintería exterior
        if (data.cambios_carpinteria_exterior === 'si') {
            const numElementosExterior = parseInt(data.cambios_carpinteria_exterior_cuantos) || 0;
            presupuesto += numElementosExterior * 2750;
        }

        // Carpintería interior
        if (data.cambios_carpinteria_interior === 'si') {
            const numElementosInterior = parseInt(data.cambios_carpinteria_interior_cuantos) || 0;
            presupuesto += numElementosInterior * 875;
        }

        // Solados
        if (data.cambios_suelo === 'si') {
            if (data.tipo_solado === 'tarima') {
                presupuesto += m2 * 57;
            } else if (data.tipo_solado === 'ceramico') {
                presupuesto += m2 * 75;
            }
        }

        // Techos
        if (data.cambios_techo) presupuesto += 1500;
        if (data.falso_techo) presupuesto += 500;

        // Verificar fecha disponible
        const fechasDisponibles = ['2026-02-10', '2026-02-15', '2026-02-20'];
        const fechaInicioObra = data.fecha_inicio_obra || '';
        const citaAgendada = fechasDisponibles.includes(fechaInicioObra)
            ? `Cita agendada para ${fechaInicioObra}`
            : 'Fecha no disponible';

        // Formatear presupuesto
        const presupuestoFormateado = new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(presupuesto);

        // Enviar emails (usando Netlify Email o servicio externo)
        // Opción 1: Usar fetch a un servicio como SendGrid, Mailgun, etc.
        // Opción 2: Usar Netlify Forms con notificaciones
        
        // Ejemplo con SendGrid (necesitas configurar SENDGRID_API_KEY en Netlify)
        if (process.env.SENDGRID_API_KEY && data.email) {
            await enviarEmail(data, presupuestoFormateado, citaAgendada);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                presupuesto: presupuestoFormateado,
                cita: citaAgendada,
                data: data
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false, 
                error: 'Error al procesar la solicitud' 
            })
        };
    }
};

// Función auxiliar para enviar emails (ejemplo con SendGrid)
async function enviarEmail(data, presupuesto, cita) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const mensaje = `
        Nueva Solicitud de Reforma
        
        Presupuesto aproximado: ${presupuesto} €
        ${cita}
        
        Datos del cliente:
        - Nombre: ${data.nombre}
        - Email: ${data.email}
        - Teléfono: ${data.telefono}
        - Dirección: ${data.direccion}
        - m²: ${data.m2}
        - Habitaciones: ${data.habitaciones}
        - Baños: ${data.banos}
    `;

    // Email al administrador
    await sgMail.send({
        to: process.env.ADMIN_EMAIL || 'admin@tudominio.com',
        from: 'noreply@tudominio.com',
        subject: 'Nueva Solicitud de Reforma',
        text: mensaje
    });

    // Email al cliente
    if (data.email) {
        await sgMail.send({
            to: data.email,
            from: 'noreply@tudominio.com',
            subject: 'Tu presupuesto de reforma',
            text: mensaje
        });
    }
}
