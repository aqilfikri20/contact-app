import React from 'react';
import PropTypes from 'prop-types';
import ContactItem from './ContactItem';

function ContactList({ contacts, onDelete, onEdit }) {
  return (
    <div className="contact-list">
      {
        contacts.map((contact) => (
          <ContactItem 
          key={contact.id}
          id={contact.id}
          onDelete={onDelete}
          onEdit={onEdit}
          {...contact} />
        ))
      }
    </div>
  );
}

ContactList.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
}

export default ContactList;
