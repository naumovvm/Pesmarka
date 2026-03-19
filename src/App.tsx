import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import Layout from './Layout.tsx';
import HomePage from './pages/HomePage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/user/AdminDashboard';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import SubmitPage from './pages/submit/SubmitPage.tsx';
import ArtistPage from './pages/artist/@id/+Page';
import SongPage from './pages/song/@id/+Page';

function AppInner() {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();

    const searchParams = new URLSearchParams(location.search);
    const urlCategory = searchParams.get('cat') as 'balkan' | 'foreign' | null;

    const [category, setCategory] = useState<'balkan' | 'foreign'>(
        urlCategory ?? 'balkan'
    );
    const [mode, setMode] = useState<'light' | 'dark'>('dark');
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    useEffect(() => {
        const urlCat = searchParams.get('cat') as 'balkan' | 'foreign' | null;
        if (urlCat && urlCat !== category) {
            setCategory(urlCat);
        }
    }, [location.search]);

    const handleCategoryChange = (cat: 'balkan' | 'foreign') => {
        setCategory(cat);
        const params = new URLSearchParams(location.search);
        params.set('cat', cat);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    const toggleTheme = () =>
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

    return (
        <>
            <Layout
                category={category}
                onCategoryChange={handleCategoryChange}
                mode={mode}
                onThemeToggle={toggleTheme}
                onLoginClick={() => setLoginOpen(true)}
                onRegisterClick={() => setRegisterOpen(true)}
            >
                <Routes>
                    <Route path="/" element={<HomePage category={category} />} />

                    <Route
                        path="/dashboard"
                        element={auth.user ? <UserDashboard /> : <Navigate to="/" replace />}
                    />

                    <Route
                        path="/admin"
                        element={
                            auth.user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/submit"
                        element={
                            auth.user ? <SubmitPage /> : <Navigate to="/" replace />
                        }
                    />

                    <Route path="/artist/:id" element={<ArtistPage />} />
                    <Route path="/song/:id" element={<SongPage />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
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
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppInner />
        </BrowserRouter>
    );
}
