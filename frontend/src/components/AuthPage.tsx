import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import './AuthPage.css';
import { googleLogin } from '../apis';

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSuccess = async (response: CredentialResponse) => {
        setError(null);
        try {
            if (!response.credential) {
                setError('No credential received from Google.');
                return;
            }
            const data = await googleLogin(response.credential);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Google sign-in failed');
        }
    };

    const handleGoogleError = () => {
        setError('Google sign-in was cancelled or failed. Please try again.');
    };

    return (
        <div className="auth">
            <div className="auth__container">
                {/* Branding */}
                <div className="auth__header">
                    <h1 className="auth__title">Cashflow Buddy</h1>
                    <p className="auth__tagline">
                        Make your month last till your next allowance.
                    </p>
                </div>

                {/* Card */}
                <div className="auth__card">
                    <h2 className="auth__card-heading">Welcome</h2>
                    <p className="auth__card-subtext">
                        Sign in with your Google account to get started.
                    </p>

                    {error && <div className="auth__error">{error}</div>}

                    <div className="auth__google-wrapper">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            size="large"
                            width="320"
                            theme="outline"
                            text="signin_with"
                            shape="rectangular"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
