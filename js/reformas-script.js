document.addEventListener('DOMContentLoaded', function() {

    flatpickr("#calendario-inicio", { dateFormat: "Y-m-d" });

    // Toggle genérico
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

    // Plano
    document.getElementById('plano_si').addEventListener('change', () => {
        document.getElementById('upload_plano').style.display = 'block';
        document.getElementById('estancias_texto').style.display = 'none';
    });
    document.getElementById('plano_no').addEventListener('change', () => {
        document.getElementById('upload_plano').style.display = 'none';
        document.getElementById('estancias_texto').style.display = 'block';
    });

    // Navegación entre partes
    window.mostrarParte = function(parte) {
        document.getElementById('parte1').style.display = parte === 1 ? 'block' : 'none';
        document.getElementById('parte2').style.display = parte === 2 ? 'block' : 'none';
        document.getElementById('parte3').style.display = parte === 3 ? 'block' : 'none';
    };

    mostrarParte(1);

    // SUBMIT - Versión robusta
    document.getElementById('form-reformas').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {};

        formData.forEach((value, key) => data[key] = value);

        // Checkboxes y radios
        this.querySelectorAll('input[type="checkbox"]').forEach(cb => data[cb.name] = cb.checked);
        this.querySelectorAll('input[type="radio"]:checked').forEach(radio => data[radio.name] = radio.value);

        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = '<p>Enviando...</p>';

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzVyiR-hqgtwYEHLeQOSrlxL4asPFZQEy4hp5KfiIg8wdmbZK7MkDTCvirnjWBMLQnW/exec', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const text = await response.text();
            console.log("Respuesta raw:", text);

            const result = JSON.parse(text);

            if (result.success) {
                resultadoDiv.innerHTML = `
                    <h3>¡Formulario enviado correctamente!</h3>
                    <p><strong>Presupuesto aproximado:</strong> ${result.presupuesto} €</p>
                    <p><strong>Cita agendada:</strong> ${result.cita}</p>
                `;
            } else {
                resultadoDiv.innerHTML = `<p style="color:red;">Error: ${result.error || 'Error desconocido'}</p>`;
            }

        } catch (error) {
            console.error(error);
            resultadoDiv.innerHTML = `<p style="color:red;">Error de conexión. Revisa la consola (F12).</p>`;
        }
    });
});
