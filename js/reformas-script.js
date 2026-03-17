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

        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = '<p>Enviando...</p>';

        try {
            const url = 'https://script.google.com/macros/s/AKfycbx2dZlZVtRkWtGTg3NYMlwnHEuy8QssI1A06B9KRqJGZY5e-q_ildA_FODtYA-2moSS/exec';

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            console.log("Status:", response.status);
            const text = await response.text();
            console.log("Respuesta RAW completa:", text);

            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                result = { success: false, error: "No es JSON válido: " + text };
            }

            if (result.success) {
                resultadoDiv.innerHTML = `
                    <h3>¡Formulario enviado correctamente!</h3>
                    <p><strong>Presupuesto aproximado:</strong> ${result.presupuesto} €</p>
                    <p><strong>Cita:</strong> ${result.cita}</p>
                `;
            } else {
                resultadoDiv.innerHTML = `<p style="color:red;">Error: ${result.error || 'Error desconocido'}</p>`;
            }

        } catch (error) {
            console.error("Error completo:", error);
            resultadoDiv.innerHTML = `<p style="color:red;">Error de conexión. Mira la consola (F12) y copia todo lo que aparece.</p>`;
        }
    });
});
