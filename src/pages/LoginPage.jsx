import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoginInput from '../components/LoginInput';
import { login } from '../utils/api';
 
function LoginPage({ loginSuccess }) {
  const navigate = useNavigate();
  async function onLogin({ email, password, remember }) {
    const { error, data } = await login({ email, password });
 
    if (!error) {
      await loginSuccess(data, remember);
      navigate('/', { replace: true });
    }
  }
 
  return (
    <section className='login-page auth-card'>
      <div className="auth-icon">*</div><p className="eyebrow">SENANG BERTEMU LAGI</p>
      <h2>Masuk ke akunmu</h2><p className="auth-description">Lanjutkan menyimpan dan merapikan kontak favoritmu.</p>
      <LoginInput login={onLogin} />
      <p className="auth-switch">Belum punya akun? <Link to="/register">Daftar di sini</Link></p>
    </section>
  );
}
 
LoginPage.propTypes = {
  loginSuccess: PropTypes.func.isRequired,
}
 
export default LoginPage;
