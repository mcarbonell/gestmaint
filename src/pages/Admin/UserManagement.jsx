import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Trash2, Shield, ShoppingBag, Wrench } from 'lucide-react';

export default function UserManagement() {
    const { allUsers, addUser, deleteUser } = useAuth();
    const [showNewUser, setShowNewUser] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'local' });

    const handleSubmit = (e) => {
        e.preventDefault();
        addUser(formData);
        setFormData({ name: '', email: '', role: 'local' });
        setShowNewUser(false);
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
                    <UserPlus size={20} /> Nuevo Usuario
                </button>
            </div>

            {showNewUser && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Añadir Nuevo Usuario</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Rol</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="local">Local Comercial</option>
                                <option value="controller">Controlador Mantenimiento</option>
                                <option value="admin">Administrador (Gestoría)</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Guardar</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowNewUser(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

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
                        {allUsers.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{u.name}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.85rem',
                                        background: u.role === 'admin' ? '#fee2e2' : (u.role === 'controller' ? '#dbeafe' : '#f1f5f9'),
                                        color: u.role === 'admin' ? '#991b1b' : (u.role === 'controller' ? '#1e40af' : '#475569'),
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem'
                                    }}>
                                        {getRoleIcon(u.role)}
                                        {u.role === 'admin' ? 'Gestoría' : (u.role === 'controller' ? 'Mant.' : 'Local')}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    {u.id !== 'admin' && (
                                        <button
                                            onClick={() => deleteUser(u.id)}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
