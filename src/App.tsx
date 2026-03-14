import {useState} from 'react';
import {useAuth} from './context/AuthContext';

import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Layout from './Layout.tsx';
import HomePage from './pages/HomePage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/user/AdminDashboard';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import SubmitPage from './pages/submit/SubmitPage.tsx'

export default function App() {
    const [category, setCategory] = useState<'balkan' | 'foreign'>('balkan');
    const [mode, setMode] = useState<'light' | 'dark'>('dark');
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    const toggleTheme = () => setMode(prev => prev === 'light' ? 'dark' : 'light');
    const auth = useAuth();

    return (
        <BrowserRouter>
            <Layout
                category={category}
                onCategoryChange={setCategory}
                mode={mode}
                onThemeToggle={toggleTheme}
                onLoginClick={() => setLoginOpen(true)}
                onRegisterClick={() => setRegisterOpen(true)}
            >
                <Routes>
                    <Route path="/" element={<HomePage category={category}/>}/>

                    <Route
                        path="/dashboard"
                        element={auth.user ? <UserDashboard/> : <Navigate to="/" replace/>}
                    />

                    <Route
                        path="/admin"
                        element={auth.user?.isAdmin ? <AdminDashboard/> : <Navigate to="/" replace/>}
                    />

                    <Route path="*" element={<Navigate to="/" replace/>}/>

                    <Route path="*" element={<Navigate to="/" replace/>}/>

                    <Route path="/submit" element={auth.user ? <SubmitPage/> : <Navigate to="/" replace/>}
                    />
                </Routes>
            </Layout>

            <LoginModal
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSwitchToRegister={() => {
                    setLoginOpen(false);
                    setRegisterOpen(true);
                }}
            />
            <RegisterModal
                open={registerOpen}
                onClose={() => setRegisterOpen(false)}
                onSwitchToLogin={() => {
                    setRegisterOpen(false);
                    setLoginOpen(true);
                }}
            />
        </BrowserRouter>
    );
}
