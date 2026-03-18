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

    document.getElementById('form-reformas').addEventListener('submit', async function(e){
        e.preventDefault();

        const formData = new FormData(this);
        const data = {};

        formData.forEach((value, key) => data[key] = value);

        this.querySelectorAll('input[type="checkbox"]').forEach(cb => data[cb.name] = cb.checked);
        this.querySelectorAll('input[type="radio"]:checked').forEach(radio => data[radio.name] = radio.value);

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
        resultadoDiv.innerHTML = '<p>Enviando...</p>';

        try {
            const params = new URLSearchParams(data);
            const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(
                'https://script.google.com/macros/s/AKfycbya1alTIYtoxiOhmYeTEVu9BZsqIxpErpvnHgTimaxk6DXlgphjZGP5IFI2A0zsk_Rq/exec?' + params.toString()
            );

            const response = await fetch(proxyUrl);
            const text = await response.text();
            console.log("Respuesta raw:", text);

            const result = JSON.parse(text);

            if (result.success) {
                resultadoDiv.innerHTML = `
                    <h3>¡Formulario enviado correctamente!</h3>
                    <p><strong>Presupuesto aproximado:</strong> ${presupuesto.toFixed(2)} €</p>
                    <p><strong>Cita:</strong> ${cita}</p>
                `;
            } else {
                resultadoDiv.innerHTML = `<p style="color:red;">Error: ${result.error || 'Error desconocido'}</p>`;
            }

        } catch (error) {
            console.error("Error completo:", error);
            resultadoDiv.innerHTML = `<p style="color:red;">Error al enviar. Revisa la consola (F12) y copia todo lo que aparece.</p>`;
        }
    });
});
