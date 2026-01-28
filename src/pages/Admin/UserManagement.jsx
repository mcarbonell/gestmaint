import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { UserPlus, Trash2, Shield, ShoppingBag, Wrench, Loader2 } from 'lucide-react';

export default function UserManagement() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewUser, setShowNewUser] = useState(false);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name');

        if (data) setProfiles(data);
        if (error) console.error('Error fetching profiles:', error);
        setLoading(false);
    };

    const updateRole = async (id, newRole) => {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', id);

        if (!error) {
            setProfiles(profiles.map(p => p.id === id ? { ...p, role: newRole } : p));
        } else {
            alert('Error al actualizar el rol: ' + error.message);
        }
    };

    const deleteProfile = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este perfil? El usuario de Auth seguirá existiendo.')) return;

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (!error) setProfiles(profiles.filter(p => p.id !== id));
        else alert('Error al eliminar: ' + error.message);
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield size={18} />;
            case 'controller': return <Wrench size={18} />;
            default: return <ShoppingBag size={18} />;
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Gestión de Usuarios</h1>
                <button className="btn btn-primary" onClick={() => setShowNewUser(true)}>
                    <UserPlus size={20} /> Crear en Auth
                </button>
            </div>

            {showNewUser && (
                <div className="card" style={{ marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Aviso Importante</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Para crear nuevos accesos reales, por ahora debes usar el panel de <b>Supabase - Authentication - Users</b>.
                        Una vez creado el usuario en Auth, se debe insertar su perfil en la tabla <code>profiles</code> con el mismo ID.
                    </p>
                    <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setShowNewUser(false)}>Cerrar</button>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 className="spinner" size={32} />
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Usuario</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Email</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Rol</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{u.full_name}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={u.role}
                                            onChange={(e) => updateRole(u.id, e.target.value)}
                                            style={{
                                                fontSize: '0.85rem',
                                                background: u.role === 'admin' ? '#fee2e2' : (u.role === 'controller' ? '#dbeafe' : '#f1f5f9'),
                                                color: u.role === 'admin' ? '#991b1b' : (u.role === 'controller' ? '#1e40af' : '#475569'),
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.5rem',
                                                border: 'none',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="admin">Gestoría (Admin)</option>
                                            <option value="controller">Mantenimiento</option>
                                            <option value="local">Local</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => deleteProfile(u.id)}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
