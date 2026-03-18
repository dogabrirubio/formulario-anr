document.addEventListener('DOMContentLoaded', function() {

    flatpickr("#calendario-inicio", { dateFormat: "Y-m-d" });

    function toggleBlock(siId, noId, divId) {
        const si = document.getElementById(siId);
        const no = document.getElementById(noId);
        const div = document.getElementById(divId);
        if (!si || !no || !div) return;

        div.style.display = si.checked ? 'block' : 'none';

        si.addEventListener('change', () => div.style.display = 'block');
        no.addEventListener('change', () => div.style.display = 'none');
    }

    toggleBlock("carp_ext_si","carp_ext_no","detalle_carp_exterior");
    toggleBlock("suelo_si","suelo_no","detalle_suelo");
    toggleBlock("calef_si","calef_no","detalle_calefaccion");
    toggleBlock("carp_int_si","carp_int_no","detalle_carp_interior");

    const planoSi = document.getElementById('plano_si');
    const planoNo = document.getElementById('plano_no');
    const uploadPlano = document.getElementById('upload_plano');
    const estanciasTexto = document.getElementById('estancias_texto');

    if(planoSi && planoNo){
        planoSi.addEventListener('change', () => {
            uploadPlano.style.display = 'block';
            estanciasTexto.style.display = 'none';
        });

        planoNo.addEventListener('change', () => {
            uploadPlano.style.display = 'none';
            estanciasTexto.style.display = 'block';
        });
    }

    document.getElementById('form-reformas').addEventListener('submit', function(e){
        e.preventDefault();

        const formData = new FormData(this);
        const data = {};

        formData.forEach((value, key) => data[key] = value);

        this.querySelectorAll('input[type="checkbox"]').forEach(cb => data[cb.name] = cb.checked);
        this.querySelectorAll('input[type="radio"]:checked').forEach(radio => data[radio.name] = radio.value);

        // Cálculo del presupuesto
        let presupuesto = 1000;

        const m2 = parseFloat(data.m2) || 0;
        const habitaciones = parseInt(data.habitaciones) || 0;
        const banos = parseInt(data.banos) || 0;
        const reforma_integral = data.reforma_integral === true || data.reforma_integral === "true";

        presupuesto += 75 * m2;
        presupuesto += 4200 * habitaciones;
        presupuesto += 7400 * banos;

        if (reforma_integral) presupuesto *= 1.2;

        if (data.cambios_distribucion === true || data.cambios_distribucion === "true") presupuesto += 6692;
        if (data.reforma_cocina === true || data.reforma_cocina === "true") {
            presupuesto += 12000;
            if (data.recuperar_cocina === true || data.recuperar_cocina === "true") presupuesto -= 12000 * 0.15;
        }
        if (data.reforma_banos_integral === true || data.reforma_banos_integral === "true") {
            const extra = 100 * banos;
            presupuesto += extra;
            if (data.recuperar_banos === true || data.recuperar_banos === "true") presupuesto -= (banos * 7400 + extra) * 0.15;
        }
        if (data.renovacion_fontaneria === true || data.renovacion_fontaneria === "true") presupuesto += 6500;
        if (data.cambiar_caldera === true || data.cambiar_caldera === "true") presupuesto += 2890;
        if (data.renovacion_electricidad === true || data.renovacion_electricidad === "true") presupuesto += 4527;
        if (data.aire_acondicionado === true || data.aire_acondicionado === "true") presupuesto += 1500;

        presupuesto += (parseInt(data.cambios_carpinteria_exterior_cuantos) || 0) * 2750;

        if (data.cambios_carpinteria_interior === true || data.cambios_carpinteria_interior === "true") {
            presupuesto += (parseInt(data.cambios_carpinteria_interior_cuantos) || 0) * 875;
        }

        if (data.cambios_suelo === true || data.cambios_suelo === "true") {
            if (data.tipo_solado === "tarima") presupuesto += m2 * 57;
            if (data.tipo_solado === "ceramico") presupuesto += m2 * 75;
        }

        if (data.cambios_techo === true || data.cambios_techo === "true") presupuesto += 1500;
        if (data.falso_techo === true || data.falso_techo === "true") presupuesto += 500;

        const cita = "Cita agendada para 2026-02-15";

        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = `
            <h3>¡Formulario procesado!</h3>
            <p><strong>Presupuesto aproximado:</strong> ${presupuesto.toFixed(2)} €</p>
            <p><strong>Cita:</strong> ${cita}</p>
            <br>
            <button id="btn-hoja" style="background:#2196F3; color:white; padding:10px 15px;">Copiar para hoja de cálculo</button>
            <button id="btn-completo" style="background:#4CAF50; color:white; padding:10px 15px; margin-left:10px;">Copiar formulario completo</button>
        `;

        // Botón 1: Copiar solo valores en orden (para hoja de cálculo)
        document.getElementById('btn-hoja').addEventListener('click', () => {
            const orden = [
                data.fecha, data.nombre, data.direccion, data.telefono, data.email, 
                data.disponibilidad, data.reforma_integral, data.m2, data.habitaciones, 
                data.banos, data.consiste_obra, data.inversion_mayor, data.calidad_precio, 
                data.estilo, data.fecha_inicio_obra, data.ascensor, data.plano, 
                data.cambios_distribucion, data.reforma_cocina, data.recuperar_cocina, 
                data.reforma_banos_integral, data.recuperar_banos, data.renovacion_fontaneria, 
                data.renovacion_calefaccion, data.cambiar_caldera, data.renovacion_electricidad, 
                data.instalacion_comunitaria, data.aire_acondicionado, data.tipo_ac, 
                data.cambios_carpinteria_exterior, data.cambios_carpinteria_exterior_cuantos, 
                data.cambios_carpinteria_interior, data.cambios_carpinteria_interior_cuantos, 
                data.cambios_suelo, data.tipo_solado, data.cambios_techo, data.falso_techo
            ];

            const texto = orden.join('\t');   // ← tabulador (mejor que coma para Excel)
            navigator.clipboard.writeText(texto).then(() => {
                alert("✅ Copiado en orden para hoja de cálculo.\nPégalo directamente en tu Excel/Google Sheets.");
            });
        });

        // Botón 2: Copiar formulario completo (como antes)
        document.getElementById('btn-completo').addEventListener('click', () => {
            let texto = "";
            for (let key in data) {
                texto += `${key}: ${data[key]}\n`;
            }
            navigator.clipboard.writeText(texto).then(() => {
                alert("✅ Formulario completo copiado.");
            });
        });
    });
});
