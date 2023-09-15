import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError('');
    }

    // Validate password length
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    } else {
      setPasswordError('');
    }

    try {
      // Create a new user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage('Signup successful! You can now log in.');
      setSignedIn(true);
    } catch (error) {
      console.log(error.message);
    }

    // Reset form fields
    setEmail('');
    setPassword('');

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <>
      <div className='main'>
        <div className='sign'>
          <h2>Signup</h2>
          <form action='' onSubmit={submitForm}>
            <div className='email'>
              <label htmlFor='email'>Email:</label>
              <input
                type='text'
                id='email'
                placeholder='Email'
                autoComplete='off'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className='error'>{emailError}</p>}
            </div>
            <div className='password'>
              <label htmlFor='password'>Password:</label>
              <input
                type='password'
                id='password'
                placeholder='Password'
                autoComplete='off'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className='error'>{passwordError}</p>}
            </div>
            <button type='submit'>Signup</button>
            {successMessage && <p className='success'>{successMessage}</p>}
            {signedIn && navigate('/Login')}
            <p>
              Already have an account?{' '}
              <span>
                <Link to='/Login'>Login</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
