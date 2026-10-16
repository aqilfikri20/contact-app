import React from 'react';
import PropTypes from 'prop-types';
 
class LoginInput extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      email: localStorage.getItem('rememberLogin') === 'true' ? localStorage.getItem('rememberedEmail') || '' : '',
      password: '',
      remember: localStorage.getItem('rememberLogin') === 'true',
    };
 
    this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
    this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }
 
  onEmailChangeHandler(event) {
    if (this.state.remember) localStorage.setItem('rememberedEmail', event.target.value);
    this.setState(() => {
      return {
        email: event.target.value
      }
    })
  }
 
  onPasswordChangeHandler(event) {
    this.setState(() => {
      return {
        password: event.target.value
      };
    });
  }
 
  onSubmitHandler(event) {
    event.preventDefault();
 
    this.props.login({
      email: this.state.email,
      password: this.state.password,
      remember: this.state.remember,
    });
  }
 
  render() {
    return (
      <form onSubmit={this.onSubmitHandler} className='login-input'>
        <input type="email" placeholder='Email' value={this.state.email} onChange={this.onEmailChangeHandler} />
        <input type="password" placeholder='Password' value={this.state.password} onChange={this.onPasswordChangeHandler} />
        <label className="remember-login"><input type="checkbox" checked={this.state.remember} onChange={(event) => { const remember = event.target.checked; localStorage.setItem('rememberLogin', String(remember)); if (remember) localStorage.setItem('rememberedEmail', this.state.email); else localStorage.removeItem('rememberedEmail'); this.setState({ remember }); }} /><span>Ingat saya <small>Simpan email dan sesi selama 1 minggu. Jika tidak dicentang, sesi berakhir setelah 1 jam.</small></span></label>
        <button>Masuk</button>
      </form>
    );
  }
}
 
LoginInput.propTypes = {
  login: PropTypes.func.isRequired,
}
 
export default LoginInput;
