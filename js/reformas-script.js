document.addEventListener('DOMContentLoaded', function() {

    // Calendario
    flatpickr("#calendario-inicio", { dateFormat: "Y-m-d" });

    // Toggle genérico
    function toggleBlock(siId, noId, divId) {
        const si = document.getElementById(siId);
        const no = document.getElementById(noId);
        const div = document.getElementById(divId);
        if(!si || !no || !div) return;
        div.style.display = si.checked ? 'block' : 'none';
        si.addEventListener('change', () => div.style.display='block');
        no.addEventListener('change', () => div.style.display='none');
    }

    toggleBlock("carp_ext_si","carp_ext_no","detalle_carp_exterior");
    toggleBlock("suelo_si","suelo_no","detalle_suelo");
    toggleBlock("calef_si","calef_no","detalle_calefaccion");
    toggleBlock("carp_int_si","carp_int_no","detalle_carp_interior");

    // Rodapié depende de carpintería interior
    const carpIntSi = document.getElementById("carp_int_si");
    const carpIntNo = document.getElementById("carp_int_no");
    const detalleRodapie = document.getElementById("detalle_rodapie");
    if(carpIntSi && carpIntNo && detalleRodapie){
        detalleRodapie.style.display = carpIntSi.checked ? "block" : "none";
        carpIntSi.addEventListener("change", ()=> detalleRodapie.style.display = "block");
        carpIntNo.addEventListener("change", ()=> detalleRodapie.style.display = "none");
    }

    // Plano
    const planoSi = document.getElementById('plano_si');
    const planoNo = document.getElementById('plano_no');
    const uploadPlano = document.getElementById('upload_plano');
    const estanciasTexto = document.getElementById('estancias_texto');

    if(planoSi && planoNo){
        planoSi.addEventListener('change',()=>{ uploadPlano.style.display='block'; estanciasTexto.style.display='none'; });
        planoNo.addEventListener('change',()=>{ uploadPlano.style.display='none'; estanciasTexto.style.display='block'; });
    }

    // Submit
    document.getElementById('form-reformas').addEventListener('submit', async function(e){
        e.preventDefault();
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value,key)=> data[key]=value);
        const checkboxes = this.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb=>data[cb.name]=cb.checked);

        try{
            const response = await fetch('/.netlify/functions/calcular-reforma',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(data)
            });
            const result = await response.json();
            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.style.display='block';
            if(result.success){
                resultadoDiv.innerHTML = `
                    <h3>¡Formulario enviado!</h3>
                    <p><strong>Presupuesto aproximado:</strong> ${result.presupuesto} €</p>
                    <p><strong>Cita:</strong> ${result.cita}</p>
                `;
            }else{
                resultadoDiv.innerHTML = `<p style="color:red;">Error: ${result.error}</p>`;
            }
        }catch(error){
            console.error(error);
            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.style.display='block';
            resultadoDiv.innerHTML='<p style="color:red;">Error al procesar la solicitud.</p>';
        }
    });

});
