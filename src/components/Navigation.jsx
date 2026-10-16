import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiLogOut, FiGlobe } from 'react-icons/fi';
import { LocaleConsumer } from './context/LocaleContext';

function Navigation({logout, name}) {
  return (
    <LocaleConsumer>
      {
        ({locale, toggleLocale}) => {
          return(
            <nav className="navigation">
            <ul>
            <li><button className="nav-locale" onClick={toggleLocale}><FiGlobe /><span>{locale === 'id' ? 'EN' : 'ID'}</span></button></li>
            <li><Link className="nav-icon" to="/" aria-label="Beranda"><FiHome /><span>Kontak</span></Link></li>
              <li><Link className="nav-icon" to="/add" aria-label="Tambah kontak"><FiPlusCircle /><span>Tambah</span></Link></li>
              <li><button className="nav-user" onClick={logout}><span>{name}</span><FiLogOut /></button></li>
            </ul>
          </nav>
          )
        }
      }
  </LocaleConsumer>
  );
}

Navigation.propTypes = {
  logout: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default Navigation;
