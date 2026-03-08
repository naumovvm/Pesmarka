import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../context/AuthContext';
import { register } from '../api/auth/auth.telefunc';

interface RegisterModalProps {
    open: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export default function RegisterModal({ open, onClose, onSwitchToLogin }: RegisterModalProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = useAuth();

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async () => {
        setError('');

        if (!username || !email || !password) {
            setError('All fields are required');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        const result = await register(username, email, password);
        setLoading(false);

        if (!result.success) {
            setError(result.message ?? 'Registration failed');
            return;
        }

        auth.login(result.username!, result.token!, result.isAdmin ?? false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Register</DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                {error && <Typography color="error" variant="body2">{error}</Typography>}

                <TextField
                    label="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Typography variant="body2">Already have an account?</Typography>
                    <Typography variant="body2" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={onSwitchToLogin}>
                        Login
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
