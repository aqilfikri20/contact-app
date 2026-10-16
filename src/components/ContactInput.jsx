import React from 'react';
import PropTypes from 'prop-types';

class ContactInput extends React.Component {
  constructor(props) {
    super(props);

    // inisialisasi state
    this.state = {
      name: '',
      tag: '',
      id: null,
    }

    this.onNameChangeEventHandler = this.onNameChangeEventHandler.bind(this);
    this.onTagChangeEventHandler = this.onTagChangeEventHandler.bind(this);
    this.onSubmitEventHandler = this.onSubmitEventHandler.bind(this);
  }

  onNameChangeEventHandler(event) {
    this.setState(() => {
      return {
        name: event.target.value,
      }
    });
  }

  onTagChangeEventHandler(event) {
    this.setState(() => {
      return {
        tag: event.target.value,
      }
    });
  }

  onSubmitEventHandler(event) {
    event.preventDefault();
    this.props.addContact(this.state);
    this.setState({ name: '', tag: '', id: null });
  }

  render() {
   return (
     <form className='contact-input' onSubmit={this.onSubmitEventHandler}>
       <input aria-label="Nama" required type="text" placeholder="Nama lengkap" value={this.state.name} onChange={this.onNameChangeEventHandler} />
       <input aria-label="Email atau nomor HP" required type="text" placeholder="Email / nomor HP" value={this.state.tag} onChange={this.onTagChangeEventHandler} />
       <button type="submit"><span>{this.state.id ? 'Simpan perubahan' : 'Simpan kontak'}</span><span>↗</span></button>
     </form>
   )
 }
}

ContactInput.propTypes = {
  addContact: PropTypes.func.isRequired,
 }

export default ContactInput;
