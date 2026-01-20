import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [incidents, setIncidents] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIncidents();
        fetchContacts();
    }, []);

    const fetchIncidents = async () => {
        const { data, error } = await supabase
            .from('incidents')
            .select('*, profiles(full_name)')
            .order('created_at', { ascending: false });

        if (data) setIncidents(data);
        if (error) console.error('Error fetching incidents:', error);
    };

    const fetchContacts = async () => {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('name');

        if (data) setContacts(data);
        if (error) console.error('Error fetching contacts:', error);
        setLoading(false);
    };

    const addContact = async (contact) => {
        const { data, error } = await supabase
            .from('contacts')
            .insert([contact])
            .select()
            .single();

        if (data) setContacts([...contacts, data]);
        if (error) throw error;
    };

    const deleteContact = async (id) => {
        const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id);

        if (!error) setContacts(contacts.filter(c => c.id !== id));
        else throw error;
    };

    const updateContact = async (id, updates) => {
        const { data, error } = await supabase
            .from('contacts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (data) setContacts(prev => prev.map(c => c.id === id ? data : c));
        if (error) throw error;
    };

    const addIncident = async (incidentData, user) => {
        const { data, error } = await supabase
            .from('incidents')
            .insert([{
                ...incidentData,
                created_by: user.id,
                history: [{
                    date: new Date().toISOString(),
                    action: 'Reportada',
                    user: user.full_name,
                    details: 'Incidencia creada en el sistema'
                }]
            }])
            .select()
            .single();

        if (data) {
            setIncidents([data, ...incidents]);
            return data;
        }
        if (error) throw error;
    };

    const updateIncident = async (id, updates, user, actionLabel) => {
        // First get current history
        const { data: current } = await supabase
            .from('incidents')
            .select('history')
            .eq('id', id)
            .single();

        const newHistory = [
            ...(current?.history || []),
            {
                date: new Date().toISOString(),
                action: actionLabel,
                user: user?.full_name || 'Sistema',
                details: updates.status ? `Estado cambiado a ${updates.status}` : actionLabel
            }
        ];

        const { data, error } = await supabase
            .from('incidents')
            .update({ ...updates, history: newHistory })
            .eq('id', id)
            .select()
            .single();

        if (data) {
            setIncidents(prev => prev.map(inc => inc.id === id ? data : inc));
            return data;
        }
        if (error) throw error;
    };

    return (
        <DataContext.Provider value={{
            incidents,
            contacts,
            loading,
            addIncident,
            updateIncident,
            addContact,
            deleteContact,
            updateContact,
            refreshData: () => { fetchIncidents(); fetchContacts(); }
        }}>
            {children}
        </DataContext.Provider>
    );
};
