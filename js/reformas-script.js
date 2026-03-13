document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar Flatpickr
    flatpickr("#calendario-inicio", {
        enable: ["2026-02-10", "2026-02-15", "2026-02-20"],
        dateFormat: "Y-m-d"
    });

    // Toggle: Plano
    document.getElementById('plano_si').addEventListener('change', () => {
        document.getElementById('upload_plano').style.display = 'block';
        document.getElementById('estancias_texto').style.display = 'none';
    });
    document.getElementById('plano_no').addEventListener('change', () => {
        document.getElementById('upload_plano').style.display = 'none';
        document.getElementById('estancias_texto').style.display = 'block';
    });

    // Toggle: Suelos
    document.getElementById('suelo_si').addEventListener('change', () => {
        document.getElementById('detalle_suelo').style.display = 'block';
    });
    document.getElementById('suelo_no').addEventListener('change', () => {
        document.getElementById('detalle_suelo').style.display = 'none';
    });

    // Toggle: Calefacción
    document.getElementById('calef_si').addEventListener('change', () => {
        document.getElementById('detalle_calefaccion').style.display = 'block';
    });
    document.getElementById('calef_no').addEventListener('change', () => {
        document.getElementById('detalle_calefaccion').style.display = 'none';
    });

    // Toggle: Carpintería exterior
    document.getElementById('carp_ext_si').addEventListener('change', () => {
        document.getElementById('detalle_carp_exterior').style.display = 'block';
    });
    document.getElementById('carp_ext_no').addEventListener('change', () => {
        document.getElementById('detalle_carp_exterior').style.display = 'none';
    });

    // Toggle: Carpintería interior
    document.getElementById('carp_int_si').addEventListener('change', () => {
        document.getElementById('detalle_carp_interior').style.display = 'block';
    });
    document.getElementById('carp_int_no').addEventListener('change', () => {
        document.getElementById('detalle_carp_interior').style.display = 'none';
    });

    // Envío del formulario
    document.getElementById('form-reformas').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {};
        
        // Convertir FormData a objeto
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Manejar checkboxes (si no están marcados, no aparecen en FormData)
        const checkboxes = this.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            data[cb.name] = cb.checked;
        });

        try {
            const response = await fetch('/.netlify/functions/calcular-reforma', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.style.display = 'block';
            
            if (result.success) {
                resultadoDiv.innerHTML = `
                    <h3>¡Formulario enviado!</h3>
                    <p><strong>Presupuesto aproximado:</strong> ${result.presupuesto} €</p>
                    <p><strong>Cita:</strong> ${result.cita}</p>
                `;
            } else {
                resultadoDiv.innerHTML = `<p style="color:red;">Error: ${result.error}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('resultado').innerHTML = 
                '<p style="color:red;">Error al procesar la solicitud.</p>';
            document.getElementById('resultado').style.display = 'block';
        }
    });
});
