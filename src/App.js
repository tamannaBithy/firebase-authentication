import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile, FacebookAuthProvider } from "firebase/auth";
import initializeAuthentication from './Firebase/firebase.initialize';
import { useState } from 'react';


initializeAuthentication();

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

function App() {

  const [user, setUser] = useState({})

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogIn, setIsLogIn] = useState(false);



  const auth = getAuth();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        // console.log(result.user);
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(loggedInUser);
      })
      .catch(error => {
        console.log(error.message);
      })
  }


  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        // console.log(result.user);
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(loggedInUser);
      })
      .catch(error => {
        console.log(error.message);
      })
  }


  const handleFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        // console.log(result.user);
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(loggedInUser);
      })
  }


  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
      .catch((error) => {
        console.log(error.message);
      });
  }



  // form portion


  const handleNameChange = e => {
    setName(e.target.value);
  }

  const handleReg = e => {
    e.preventDefault();
    console.log(email, password);

    // for password validation. you can search 'javascript regex password strength' for more validation in stackoverflow.
    if (password.length < 6) {
      setError('password must be at least 6 characters long.');
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('password must contain 2 uppercase.');
      return;
    }

    isLogIn ? preocessLogIn(email, password) : registerNewuser(email, password);

  }

  const preocessLogIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      });
  }


  const registerNewuser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
        verifyEmail();
        setUserName();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  // for set user name in firebase
  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(() => {

      })
  }

  // for email verification
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
  }

  // for reset pass
  const handleClickResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {

      })
  }


  const handleEmailChange = e => {
    setEmail(e.target.value)
  }

  const handlePassChange = e => {
    setPassword(e.target.value)
  }

  const toggleLogIn = e => {
    setIsLogIn(e.target.checked);
  }



  return (
    <div className="m-5">

      <form onSubmit={handleReg}>
        <h3 className="text-primary mb-4">Please {isLogIn ? 'Login' : 'Register'}</h3>

        {!isLogIn && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input type="text" onBlur={handleNameChange} className="form-control" placeholder="Your Name" id="inputName" />
          </div>
        </div>}


        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePassChange} type="password" className="form-control" id="inputPassword3" required />
            <div className="text-danger">{error}</div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleLogIn} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {isLogIn ? 'Login' : 'Register'}
        </button>

        <br />
        <br />

        <button onClick={handleClickResetPassword} type="button" class="btn btn-secondary btn-sm">Reset password</button>
      </form>

      <br />
      <br />
      <br />

      {/* for google & github */}
      {!user.name ?
        <div>
          <button onClick={handleGoogleSignIn}>Google Sign In</button>
          <br />
          <br />
          <button onClick={handleGithubSignIn}>Github Sign In</button>
          <br />
          <br />
          <button onClick={handleFacebookSignIn}>Facebook Sign In</button>
        </div> :

        <div>
          <br />
          <br />
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      }
      <br />
      {
        user.name && <div>
          <h2>Welcome {user.name}</h2>
          <p>i know your email address : {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
