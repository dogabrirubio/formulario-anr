exports.handler = async (event) => {

if(event.httpMethod !== "POST"){
return{
statusCode:405,
body:"Method not allowed"
}
}

const data = JSON.parse(event.body)

let presupuesto = 1000

const m2 = parseInt(data.m2)||0
const habitaciones = parseInt(data.habitaciones)||0
const banos = parseInt(data.banos)||0

presupuesto += 75*m2
presupuesto += 4200*habitaciones
presupuesto += 7400*banos

if(data.reforma_integral) presupuesto *=1.2

if(data.cambios_distribucion) presupuesto+=6692

if(data.reforma_cocina){

presupuesto+=12000

if(data.recupera_cocina)
presupuesto-=12000*0.15

}

if(data.reforma_banos_integral){

presupuesto+=100*banos

if(data.recupera_banos)
presupuesto-=banos*7400*0.15

}

if(data.renovacion_fontaneria) presupuesto+=6500

if(data.cambiar_caldera==="si") presupuesto+=2890

if(data.renovacion_electricidad) presupuesto+=4527

if(data.aire_acondicionado) presupuesto+=1500

if(data.cambios_carpinteria_exterior==="si"){

presupuesto+=
(parseInt(data.cambios_carpinteria_exterior_cuantos)||0)*2750

}

if(data.cambios_carpinteria_interior==="si"){

presupuesto+=
(parseInt(data.cambios_carpinteria_interior_cuantos)||0)*875

}

if(data.cambios_suelo==="si"){

if(data.tipo_solado==="tarima")
presupuesto+=m2*57

if(data.tipo_solado==="ceramico")
presupuesto+=m2*75

}

if(data.cambios_techo) presupuesto+=1500

if(data.falso_techo) presupuesto+=500

const fechas=["2026-02-10","2026-02-15","2026-02-20"]

const cita=fechas.includes(data.fecha_inicio_obra)
?`Cita disponible ${data.fecha_inicio_obra}`
:"Fecha no disponible"

return{

statusCode:200,

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

success:true,

presupuesto:new Intl.NumberFormat("es-ES").format(presupuesto),

cita

})

}

}
