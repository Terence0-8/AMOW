// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Hash SHA-256 du PIN via l'API Web Crypto native
async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurer la session au chargement
  useEffect(() => {
    const stored = localStorage.getItem('amow_user');
    if (stored) setCurrentUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  // Créer un compte
  async function register(name, pin) {
    const pin_hash = await hashPin(pin);

    // Vérifier si le PIN est déjà pris
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('pin_hash', pin_hash)
      .single();

    if (existing) {
      return { error: 'Ce PIN est déjà utilisé, choisis-en un autre 🔒' };
    }

    const { data, error } = await supabase
      .from('users')
      .insert({ name: name.trim(), pin_hash })
      .select()
      .single();

    if (error) return { error: 'Erreur lors de la création du compte' };

    const user = { id: data.id, name: data.name };
    localStorage.setItem('amow_user', JSON.stringify(user));
    setCurrentUser(user);
    return { success: true };
  }

  // Se connecter
  async function login(pin) {
    const pin_hash = await hashPin(pin);

    const { data, error } = await supabase
      .from('users')
      .select('id, name')
      .eq('pin_hash', pin_hash)
      .single();

    if (error || !data) {
      return { error: 'PIN incorrect, réessaie 🔑' };
    }

    const user = { id: data.id, name: data.name };
    localStorage.setItem('amow_user', JSON.stringify(user));
    setCurrentUser(user);
    return { success: true };
  }

  // Modifier le nom
  async function updateName(newName) {
    if (!currentUser) return { error: 'Non connecté' };

    const { error } = await supabase
      .from('users')
      .update({ name: newName.trim() })
      .eq('id', currentUser.id);

    if (error) return { error: 'Erreur lors de la modification' };

    const updated = { ...currentUser, name: newName.trim() };
    localStorage.setItem('amow_user', JSON.stringify(updated));
    setCurrentUser(updated);
    return { success: true };
  }

  // Déconnexion
  function logout() {
    localStorage.removeItem('amow_user');
    setCurrentUser(null);
  }

  return { currentUser, loading, register, login, logout, updateName };
}