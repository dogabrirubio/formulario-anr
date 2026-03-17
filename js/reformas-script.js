document.addEventListener('DOMContentLoaded', function() {

    // Calendario inicio igual que fecha
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

    toggleBlock("carp_int_si","carp_int_no","detalle_carp_interior");
    toggleBlock("carp_ext_si","carp_ext_no","detalle_carp_exterior");
    toggleBlock("suelo_si","suelo_no","detalle_suelo");
    toggleBlock("calef_si","calef_no","detalle_calefaccion");

    // Plano toggle
    const planoSi = document.getElementById('plano_si');
    const planoNo = document.getElementById('plano_no');
    const uploadPlano = document.getElementById('upload_plano');
    const estanciasTexto = document.getElementById('estancias_texto');

    if (planoSi && planoNo) {
        planoSi.addEventListener('change', ()=>{ uploadPlano.style.display='block'; estanciasTexto.style.display='none'; });
        planoNo.addEventListener('change', ()=>{ uploadPlano.style.display='none'; estanciasTexto.style.display='block'; });
    }

    // Submit: cálculo en navegador
    document.getElementById('form-reformas').addEventListener('submit', function(e){
        e.preventDefault();
        const form = this;
        const data = {};
        new FormData(form).forEach((v,k)=>{data[k]=v;});
        form.querySelectorAll('input[type="checkbox"]').forEach(cb=>{data[cb.name]=cb.checked;});

        // Cálculo presupuesto
        let presupuesto = 1000;
        const m2 = parseInt(data.m2)||0;
        const habitaciones = parseInt(data.habitaciones)||0;
        const banos = parseInt(data.banos)||0;
        const reformaIntegral = data.reforma_integral===true || data.reforma_integral==='on';

        presupuesto += 75*m2 + 4200*habitaciones + 7400*banos;
        if (reformaIntegral) presupuesto *= 1.2;
        if (data.cambios_distribucion) presupuesto += 6692;
        if (data.reforma_cocina) presupuesto += 12000 * (data.recupera_cocina ? 0.85 : 1);
        if (data.reforma_banos_integral) {
            presupuesto += banos*100;
            if(data.recupera_banos) presupuesto -= (banos*7400 + banos*100)*0.15;
        }
        if(data.renovacion_fontaneria) presupuesto += 6500;
        if(data.cambiar_caldera==='si') presupuesto += 2890;
        if(data.renovacion_electricidad) presupuesto += 4527;
        if(data.aire_acondicionado) presupuesto += 1500;
        if(data.cambios_carpinteria_exterior==='si') presupuesto += (parseInt(data.cambios_carpinteria_exterior_cuantos)||0)*2750;
        if(data.cambios_carpinteria_interior==='si') presupuesto += (parseInt(data.cambios_carpinteria_interior_cuantos)||0)*875;
        if(data.cambios_suelo==='si') {
            if(data.tipo_solado==='tarima') presupuesto += m2*57;
            else if(data.tipo_solado==='ceramico') presupuesto += m2*75;
        }
        if(data.cambios_techo) presupuesto += 1500;
        if(data.falso_techo) presupuesto += 500;

        // Fecha
        const cita = data.fecha_inicio_obra ? `Cita prevista: ${data.fecha_inicio_obra}` : 'Sin fecha';

        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = `<h3>Presupuesto aproximado</h3><p>${presupuesto.toFixed(2)} €</p><p>${cita}</p>`;

        // Opcional: enviar email con SendGrid
        // Aquí podrías hacer fetch a tu endpoint de correo (tu servidor externo o Netlify Function solo para emails)
    });

});
