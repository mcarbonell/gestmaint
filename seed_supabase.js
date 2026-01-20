import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fpzogyazomgtgkfromwv.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwem9neWF6b21ndGdrZnJvbXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg4ODIyMCwiZXhwIjoyMDg0NDY0MjIwfQ.RGrMfyXSeKZO__m2XFYxuC4gLEvwHx5sWBAmaUzCCk0';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const usersToCreate = [
    { email: 'admin@asvian.com', password: 'gestmaint2026', full_name: 'Administrador Albán', role: 'admin' },
    { email: 'mantenimiento@asvian.com', password: 'gestmaint2026', full_name: 'Jefe de Mantenimiento', role: 'controller' },
    { email: 'familycash@asvian.com', password: 'gestmaint2026', full_name: 'FamilyCash', role: 'local' },
    { email: 'conforama@asvian.com', password: 'gestmaint2026', full_name: 'Conforama', role: 'local' },
    { email: 'norauto@asvian.com', password: 'gestmaint2026', full_name: 'Norauto', role: 'local' },
    { email: 'tiendanimal@asvian.com', password: 'gestmaint2026', full_name: 'Tiendanimal', role: 'local' },
    { email: 'buffet@asvian.com', password: 'gestmaint2026', full_name: 'Buffet Colonial', role: 'local' },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function seed() {
    console.log('--- Iniciando Seed Albán ---');

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) return console.error('Error:', listError);

    const createdIds = {};

    for (const u of usersToCreate) {
        await delay(500);
        let userId;
        const existing = users.find(eu => eu.email === u.email);

        if (existing) {
            userId = existing.id;
        } else {
            console.log(`[CREANDO] ${u.email}...`);
            const { data, error } = await supabase.auth.admin.createUser({
                email: u.email, password: u.password, email_confirm: true
            });
            if (error) { console.error(`  Error ${u.email}:`, error.message); continue; }
            userId = data.user.id;
        }

        createdIds[u.email] = userId;

        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ id: userId, full_name: u.full_name, role: u.role, email: u.email });

        if (!profileError) console.log(`  Perfil ${u.full_name} OK.`);
    }

    console.log('--- Creando Incidencias de Prueba ---');
    const sampleIncidents = [
        {
            type: 'fontanería',
            priority: 'alta',
            description: 'Fuga de agua en los servicios de clientes (Cerca de cajas)',
            created_by: createdIds['familycash@asvian.com'],
            status: 'reported'
        },
        {
            type: 'climatización',
            priority: 'media',
            description: 'El aire acondicionado de la zona de sofás no enfría',
            created_by: createdIds['conforama@asvian.com'],
            status: 'reported'
        },
        {
            type: 'electricidad',
            priority: 'baja',
            description: 'Luz fundida en el letrero exterior',
            created_by: createdIds['norauto@asvian.com'],
            status: 'assigned'
        }
    ];

    for (const inc of sampleIncidents) {
        if (!inc.created_by) continue;
        const { error } = await supabase.from('incidents').upsert([inc]);
        if (!error) console.log(`  Incidencia para ${inc.type} creada.`);
    }

    console.log('--- Fin del proceso ---');
}

seed();
