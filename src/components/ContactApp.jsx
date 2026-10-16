import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation';
import HomePage from '../pages/HomePage';
import AddPage from '../pages/AddPage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import { getUserLogged, putAccessToken, addContact as addContactToApi, getAccessToken } from '../utils/api';
import { clearContacts, getContacts as getGuestContacts } from '../utils/data';
import { LocaleProvider } from './context/LocaleContext';
import { Link } from 'react-router-dom';

class ContactApp extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      authedUser: null,
      initializing: true,

      localeContext: {
        locale: localStorage.getItem('locale') || 'id',
        toggleLocale: () => {
          this.setState((prevState) => {
            const newLocale = prevState.localeContext.locale === 'id' ? 'en' : 'id';
            localStorage.setItem('locale', newLocale);
            return {
              localeContext: {
                ...prevState.localeContext,
                locale: prevState.localeContext.locale === 'id' ? 'en' : 'id'
              }
            }
          })
        }
      }
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }
 
  async onLoginSuccess({ accessToken }, remember = false) {
    putAccessToken(accessToken);
    const sessionDuration = remember ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    localStorage.setItem('accessTokenExpiresAt', String(Date.now() + sessionDuration));
    localStorage.setItem('rememberLogin', String(remember));
    this.startSessionTimer(sessionDuration);
    const { data } = await getUserLogged();
    if (data) await this.syncGuestContacts();

    this.setState(() => {
      return {
        authedUser: data,
        
      };
    });
  }

  startSessionTimer(duration) {
    clearTimeout(this.sessionTimer);
    this.sessionTimer = setTimeout(() => this.onLogout(), duration);
  }

  async syncGuestContacts() {
    const contacts = getGuestContacts();
    for (const contact of contacts) {
      const { error } = await addContactToApi({ name: contact.name, tag: contact.tag });
      if (error) return false;
    }
    clearContacts();
    return true;
  }

  async componentDidMount() {
    let data = null;
    if (getAccessToken()) {
      if (!localStorage.getItem('accessTokenExpiresAt')) {
        localStorage.setItem('accessTokenExpiresAt', String(Date.now() + 60 * 60 * 1000));
      }
      this.startSessionTimer(Math.max(0, Number(localStorage.getItem('accessTokenExpiresAt')) - Date.now()));
      try { ({ data } = await getUserLogged()); } catch { data = null; }
    }
    this.setState(() => {
      return {
        authedUser: data,
        initializing: false
      };
    });
  }
 
  onLogout() {
    clearTimeout(this.sessionTimer);
    this.setState(() => {
      return {
        authedUser: null
      }
    });
    putAccessToken('');
  }

  componentWillUnmount() {
    clearTimeout(this.sessionTimer);
  }

  render() {
    if (this.state.initializing) {
      return null;
    }
    
    if (this.state.authedUser === null) {
      return (
        <LocaleProvider value={this.state.localeContext}>
        <div className='contact-app poster-app'>
          <header className='contact-app__header'>
            <div className="brand-mark"><span className="brand-mark__icon">✦</span><span>CONTACT<br />CLUB</span></div>
            <div className="header-title"><p>BUKU ALAMAT DIGITAL</p><h1>Kontak Favorit</h1><span>Simpan orang penting di satu tempat.</span></div>
            <Link className="register-link" to="/register">Daftar <span>↗</span></Link>
          </header>
          <main className="poster-main">
            <Routes>
              <Route path="/login" element={<LoginPage loginSuccess={this.onLoginSuccess} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/*" element={<HomePage guest />} />
            </Routes>
          </main>
        </div>
        </LocaleProvider>
      );
    }
 
    return (
      <LocaleProvider value={this.state.localeContext}>
      <div className="contact-app poster-app">
        <header className='contact-app__header'>
        <div className="brand-mark"><span className="brand-mark__icon">*</span><span>CONTACT<br />CLUB</span></div>
        <div className="header-title"><p>BUKU ALAMAT DIGITAL</p><h1>{this.state.localeContext.locale === 'id' ? 'Kontak Favorit' : 'Favorite Contacts'}</h1><span>Simpan orang penting di satu tempat.</span></div>
          <Navigation logout={this.onLogout} name={this.state.authedUser.name} />
        </header>
        <main className="poster-main">
          <Routes>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddPage />} />
          </Routes>
        </main>
      </div>
      </LocaleProvider>
    );
  }
}

export default ContactApp;
