import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterInput from '../components/RegisterInput';
import { register } from '../utils/api';
 
function RegisterPage() {
  const navigate = useNavigate();
 
  async function onRegisterHandler(user) {
    const { error } = await register(user);
    if (!error) {
      navigate('/login');
    }
  }
 
  return (
    <section className='register-page auth-card'>
      <div className="auth-icon">*</div><p className="eyebrow">MULAI SIMPAN KONEKSI</p><h2>Buat akun Contact Club</h2><p className="auth-description">Buat akun untuk membawa kontak tersimpanmu ke mana saja.</p>
      <RegisterInput register={onRegisterHandler} />
      <p>Kembali ke <Link to="/">Kontak</Link> · <Link to="/login">Masuk</Link></p>
    </section>
  )
}
 
export default RegisterPage;
