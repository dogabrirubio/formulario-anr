document.addEventListener('DOMContentLoaded', function() {

    // -------- CALENDARIO --------
    flatpickr("#calendario-inicio", { dateFormat: "Y-m-d" });

    // -------- FUNCION TOGGLE GENERICA --------
    function toggleBlock(siId, noId, divId) {
        const si = document.getElementById(siId);
        const no = document.getElementById(noId);
        const div = document.getElementById(divId);
        if (!si || !no || !div) return;
        div.style.display = si.checked ? 'block' : 'none';
        si.addEventListener('change', () => div.style.display = 'block');
        no.addEventListener('change', () => div.style.display = 'none');
    }

    // -------- TOGGLES --------
    toggleBlock("carp_ext_si","carp_ext_no","detalle_carp_exterior");
    toggleBlock("suelo_si","suelo_no","detalle_suelo");
    toggleBlock("calef_si","calef_no","detalle_calefaccion");
    toggleBlock("carp_int_si","carp_int_no","detalle_carp_interior");

    // -------- PLANO --------
    const planoSi = document.getElementById('plano_si');
    const planoNo = document.getElementById('plano_no');
    const uploadPlano = document.getElementById('upload_plano');
    const estanciasTexto = document.getElementById('estancias_texto');

    if(planoSi && planoNo){
        planoSi.addEventListener('change', () => {
            uploadPlano.style.display='block';
            estanciasTexto.style.display='none';
        });
        planoNo.addEventListener('change', () => {
            uploadPlano.style.display='none';
            estanciasTexto.style.display='block';
        });
    }

    // -------- SUBMIT FORMULARIO --------
    document.getElementById('form-reformas').addEventListener('submit', async function(e){
        e.preventDefault();

        const formData = new FormData(this);
        const data = {};

        // Convertir FormData a objeto
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Añadir valores de checkboxes
        const checkboxes = this.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => data[cb.name] = cb.checked);

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbxewbqbI-T_CRsPdi5RErGh-QIRbJNydGPqoWVabcpb-lR7jPYtQ8KekhvlEc5Le6WE/exec', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.style.display = 'block';

            if(result.success){
                resultadoDiv.innerHTML = `
                    <h3>¡Formulario enviado!</h3>
                    <p><strong>Presupuesto aproximado:</strong> ${result.presupuesto} €</p>
                    <p><strong>Cita:</strong> ${result.cita}</p>
                `;
            } else {
                resultadoDiv.innerHTML = `<p style="color:red;">Error: ${result.error}</p>`;
            }

        } catch(error){
            console.error(error);
            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.style.display = 'block';
            resultadoDiv.innerHTML = '<p style="color:red;">Error al procesar la solicitud.</p>';
        }

    });

});
