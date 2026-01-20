import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Phone, Search, Briefcase, Plus, Trash2, X } from 'lucide-react';

export default function ContactsPage() {
    const { contacts, addContact, deleteContact } = useData();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [showNewContact, setShowNewContact] = useState(false);
    const [formData, setFormData] = useState({ name: '', specialty: '', phone: '' });

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.specialty.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        addContact(formData);
        setFormData({ name: '', specialty: '', phone: '' });
        setShowNewContact(false);
    };

    const canManage = user?.role === 'admin' || user?.role === 'controller';

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Agenda de Especialistas</h1>
                {canManage && (
                    <button className="btn btn-primary" onClick={() => setShowNewContact(true)}>
                        <Plus size={20} /> Nuevo Técnico
                    </button>
                )}
            </div>

            {showNewContact && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3>Añadir Técnico</h3>
                        <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowNewContact(false)} />
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div className="grid-2">
                            <div>
                                <label>Nombre / Empresa</label>
                                <input
                                    type="text" required
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Especialidad</label>
                                <input
                                    type="text" required placeholder="Ej: Electricidad"
                                    value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label>Teléfono</label>
                            <input
                                type="tel" required
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar Contacto</button>
                    </form>
                </div>
            )}

            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o especialidad..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ paddingLeft: '3rem' }}
                />
            </div>

            <div className="grid-2">
                {filteredContacts.map(contact => (
                    <div key={contact.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '50%',
                            background: '#e0f2fe', color: '#0284c7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Briefcase size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.25rem' }}>{contact.name}</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{contact.specialty}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {canManage && (
                                <button
                                    onClick={() => deleteContact(contact.id)}
                                    style={{
                                        color: '#ef4444', background: '#fee2e2',
                                        border: 'none', borderRadius: '50%',
                                        width: '40px', height: '40px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                            <a
                                href={`tel:${contact.phone}`}
                                className="btn btn-primary"
                                style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                            >
                                <Phone size={20} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
