import React from 'react';
import PropType from 'prop-types';
import ContactItemBody from './ContactItemBody';
import ContactItemImage from './ContactItemImage';
import DeleteButton from './DeleteButton';
import { FiEdit2, FiX, FiCheck } from 'react-icons/fi';

function ContactItem({ imageUrl, name, tag, id, onDelete, onEdit }) {
 const [editing, setEditing] = React.useState(false);
 const [editedName, setEditedName] = React.useState(name);
 const [editedTag, setEditedTag] = React.useState(tag);

 function saveEdit(event) {
   event.preventDefault();
   onEdit({ id, name: editedName.trim(), tag: editedTag.trim() });
   setEditing(false);
 }

 return (
   <div className={`contact-item${editing ? ' contact-item--editing' : ''}`}>
     {editing ? (
       <form className="contact-edit-form" onSubmit={saveEdit}>
         <label><span>Nama</span><input required value={editedName} onChange={(event) => setEditedName(event.target.value)} /></label>
         <label><span>Email / nomor HP</span><input required value={editedTag} onChange={(event) => setEditedTag(event.target.value)} /></label>
         <div className="contact-edit-actions">
           <button className="contact-item__save" type="submit"><FiCheck /> Simpan</button>
           <button className="contact-item__cancel" type="button" onClick={() => { setEditedName(name); setEditedTag(tag); setEditing(false); }}><FiX /> Batal</button>
         </div>
       </form>
     ) : (
       <>
         <ContactItemImage imageUrl={imageUrl} />
         <ContactItemBody name={name} tag={tag} />
         {onEdit && <button className="contact-item__edit" type="button" aria-label={`Edit ${name}`} title="Edit kontak" onClick={() => setEditing(true)}><FiEdit2 /></button>}
         <DeleteButton id={id} onDelete={onDelete} />
       </>
     )}
   </div>
 );
}

ContactItem.propType = {
  imageUrl: PropType.string.isRequired,
  name: PropType.string.isRequired,
  tag: PropType.string.isRequired,
  id: PropType.number.isRequired,
  onDelete: PropType.func.isRequired,
};

export default ContactItem;
