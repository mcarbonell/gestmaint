import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Supabase Edge Function: notify-incident
// Envía un email real usando Resend cuando se inserta una incidencia

serve(async (req) => {
    try {
        const payload = await req.json()
        const { record, type } = payload

        if (type !== 'INSERT') {
            return new Response(JSON.stringify({ message: 'Skipped non-insert event' }), { status: 200 })
        }

        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not set')
            return new Response(JSON.stringify({ error: 'Missing API Key' }), { status: 500 })
        }

        // Configuración del correo
        const category = record.type.toUpperCase()
        const priority = record.priority.toUpperCase()
        const description = record.description
        const incidentId = record.id

        // Nota: Por ahora usamos un email fijo de destino. 
        // En el futuro podemos buscar el email del técnico asignado en la DB.
        const recipientEmail = 'mantenimiento@asvian.com'

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'GestMaint ASVIAN <incidencias@asvian.com>',
                to: [recipientEmail],
                subject: `[${priority}] Nueva Incidencia: ${category}`,
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px;">Nueva Incidencia Registrada</h1>
            </div>
            <div style="padding: 24px; color: #1e293b; line-height: 1.5;">
              <p>Se ha registrado una nueva incidencia que requiere su atención:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Categoría:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${category}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Prioridad:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                    <span style="background-color: ${priority === 'ALTA' ? '#fee2e2' : '#fef3c7'}; color: ${priority === 'ALTA' ? '#991b1b' : '#92400e'}; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                      ${priority}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Descripción:</td>
                  <td style="padding: 8px 0;">${description}</td>
                </tr>
              </table>
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://asvian.vercel.app/incidents/${incidentId}" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Ver detalle de la incidencia
                </a>
              </div>
            </div>
            <div style="background-color: #f8fafc; color: #64748b; padding: 15px; text-align: center; font-size: 12px;">
              Este es un mensaje automático generado por el sistema de Gestión de Mantenimiento ASVIAN.
            </div>
          </div>
        `,
            }),
        })

        const data = await res.json()

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
