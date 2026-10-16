import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import LocaleContext from '../components/context/LocaleContext';
import { getContacts as getGuestContacts, deleteContact as deleteGuestContact, addContact as addGuestContact, updateContact as updateGuestContact, getCachedContacts, cacheContacts } from '../utils/data';
import { addContact as addContactToApi, getContacts as getApiContacts, deleteContact as deleteApiContact, updateContact as updateApiContact } from '../utils/api';
import ContactInput from '../components/ContactInput';
import { FiUsers, FiSearch, FiPlus, FiHeart } from 'react-icons/fi';
 
function HomePage({ guest = false }) {
    const [searchParams, setSearchParams]= useSearchParams();
    const [contacts, setContacts] = React.useState([]);
    const [visibleCount, setVisibleCount] = React.useState(10);
    const listViewportRef = React.useRef(null);

    const [keyword, setKeyword] = React.useState(() => {
      return searchParams.get('keyword') || ''
      });
      const { locale } = React.useContext(LocaleContext);

    React.useEffect(() => {
    if (guest) setContacts(getGuestContacts());
    else {
      const cached = getCachedContacts();
      if (cached.length) setContacts(cached);
      getApiContacts().then(({ error, data }) => {
        if (!error && data) { setContacts(data); cacheContacts(data); }
      }).catch(() => {});
    }
    }, [guest]);

    React.useEffect(() => { setVisibleCount(10); }, [keyword, contacts.length]);

    React.useEffect(() => {
      const viewport = listViewportRef.current;
      if (viewport && viewport.scrollHeight <= viewport.clientHeight + 4 && visibleCount < filteredContacts.length) {
        setVisibleCount((count) => Math.min(count + 10, filteredContacts.length));
      }
    }, [visibleCount, contacts, keyword]);

    function handleListScroll(event) {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        setVisibleCount((count) => Math.min(count + 10, filteredContacts.length));
      }
    }

    async function onDeleteHandler(id) {
        if (guest) setContacts(deleteGuestContact(id));
        else { await deleteApiContact(id); const { data } = await getApiContacts(); setContacts(data || []); cacheContacts(data || []); }
      };

    async function onSaveContact(contact) {
      if (contact.id) {
        setContacts(updateGuestContact(contact.id, contact));
      } else {
        setContacts(addGuestContact(contact));
      }
    }

      function onKeywordChangeHandler(keyword) {
        setKeyword(keyword);
        setSearchParams({ keyword });
      }   

    function onEditContact(contact) {
      if (guest) {
        setContacts(updateGuestContact(contact.id, { name: contact.name, tag: contact.tag }));
      } else {
        updateApiContact(contact.id, contact).then(async ({ error }) => {
          if (!error) {
            const { data } = await getApiContacts();
            setContacts(data || []);
            cacheContacts(data || []);
          }
        }).catch(() => window.alert('Kontak gagal diperbarui. Periksa koneksi lalu coba lagi.'));
      }
    }

    const filteredContacts = contacts.filter((contact) => {
    return contact.name.toLowerCase().includes(
      keyword.toLowerCase()
    );
  });  

  return (
    <section className="contacts-page">
      <aside className="contacts-sidebar">
        <div className="sidebar-art"><span>✦</span><FiUsers /><b>CC</b></div>
        <p className="eyebrow">RUANG KECIL UNTUK</p><h2>ORANG<br /><em>TERDEKAT</em></h2>
        <div className="sidebar-note"><FiHeart /><span>Kontakmu, ceritamu.<br />Tersimpan rapi dan mudah dicari.</span></div>
        <div className="side-stamp">★ <span>{contacts.length.toString().padStart(2, '0')}<small> KONTAK</small></span> ★</div>
      </aside>
      <div className="contacts-content">
        <div className="content-heading">
          <div><p className="eyebrow">KONEKSI BERHARGA</p><h2>{locale === 'id' ? 'Daftar Kontak' : 'Contacts List'}</h2><p>Semua orang penting, dalam satu tempat.</p></div>
          <div className="count-badge"><FiUsers /><span>{contacts.length} <small>kontak</small></span></div>
        </div>
        {guest && <div className="add-panel"><div className="panel-heading"><span className="panel-icon"><FiPlus /></span><div><h3>Tambah orang baru</h3><p>Isi nama dan tag untuk menyimpan kontak.</p></div></div><ContactInput addContact={onSaveContact} /></div>}
        <div className="list-heading"><h3>Semua kontak <span>{filteredContacts.length}</span></h3><span className="list-caption">DIURUTKAN TERBARU</span></div>
        <div className="search-wrap"><FiSearch /><SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} /></div>
        <div className="contact-list-viewport" ref={listViewportRef} onScroll={handleListScroll}>
          {filteredContacts.length ? <ContactList contacts={filteredContacts.slice(0, visibleCount)} onDelete={onDeleteHandler} onEdit={onEditContact} /> : <div className="empty-state"><div className="empty-art"><FiUsers /><span>+</span></div><h3>{keyword ? 'Kontak tidak ditemukan' : 'Mulai dari satu nama'}</h3><p>{keyword ? 'Coba kata kunci lain.' : 'Kontak yang kamu tambahkan akan muncul di sini.'}</p></div>}
        </div>
        <footer className="content-footer"><span>CONTACT CLUB · KEEP YOUR PEOPLE CLOSE</span><span>BUAT DENGAN <FiHeart /></span></footer>
      </div>
    </section>
  )
}   
export default HomePage;
