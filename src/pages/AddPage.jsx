import React from 'react';
import { addContact } from '../utils/api';
import ContactInput from '../components/ContactInput';
import { useNavigate } from 'react-router-dom';

function AddPage() {
  const navigate = useNavigate();
 
  async function onAddContactHandler(contact) {
    await addContact(contact);
    navigate('/');
  }

  
  return (
    <section className="add-page auth-card">
      <div className="auth-icon">+</div><p className="eyebrow">KONEKSI BARU</p><h2>Tambah kontak</h2><p className="auth-description">Simpan detail orang yang ingin selalu kamu temukan.</p>
      <ContactInput addContact={onAddContactHandler} />
    </section>
  )
}

export default AddPage;
