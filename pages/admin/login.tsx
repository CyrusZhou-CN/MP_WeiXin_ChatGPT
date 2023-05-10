import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next'; // 引入 useTranslation hook
import { Header } from 'components/header';
import { Footer } from 'components/footer';
import { signIn, useSession } from 'next-auth/react';

import { getStaticProps } from 'components/i18nServerSideProps';
export { getStaticProps };

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();
  const loginTitle = t('Login');
  const usernameLabel = t('Username');
  const passwordLabel = t('Password');
  const submitLabel = t('Submit');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await signIn("credentials",{redirect: false, username, password });
      console.error('result:', result);
      if (result?.error) {
        console.error('loginerror:', result.error);
        setErrorMessage(t(result.error) as string);
      } else if (result) {
        router.push("/admin/dashboard");
      } else {
        setErrorMessage(t("Invalid username or password") as string);
      }
    } catch (error: any) {
      setErrorMessage(t(error || 'Unknown error') as string);
    }
  };
  return (
    <>
      <Header heading={loginTitle} title={loginTitle} /><div className="login-form-container">
        <form className="login-form" onSubmit={handleLogin}>
          <label className="form-label" htmlFor="username">
            {usernameLabel}:
          </label>
          <input
            className="form-input"
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)} />
          <label className="form-label" htmlFor="password">
            {passwordLabel}:
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)} />
          <button className="form-submit-button" type="submit">
            {submitLabel}
          </button>
          {errorMessage && <p className="form-error-message">{errorMessage}</p>}
        </form>
      </div><Footer />
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
        }

        .login-title {
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 300px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .form-group {
          margin-bottom: 10px;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          display: block;
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          font-size: 1rem;
          line-height: 1.5;
          color: #495057;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid #ced4da;
          border-radius: 0.25rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .form-error-message {
          color: #dc3545;
          font-size: 0.875rem;
        }
        
        .form-submit-button {
          display: block;
          width: 100%;
          padding: 0.5rem;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #fff;
          background-color: #007bff;
          border: 1px solid #007bff;
          border-radius: 0.25rem;
          transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
          cursor: pointer;
        }
        
        .form-submit-button:hover {
          background-color: #0069d9;
          border-color: #0062cc;
        }
        
        .form-submit-button:active {
          background-color: #0062cc;
          border-color: #005cbf;
        }
        
        .login-form-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 80vh;
          width: 100vw;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 400px;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 0.5rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          background-color: #fff;
        }
        `}</style></>
  )
}
export default LoginPage;
