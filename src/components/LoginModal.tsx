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
import { login } from '../api/auth/auth.telefunc';

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

export default function LoginModal({ open, onClose, onSwitchToRegister }: LoginModalProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = useAuth();

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        const result = await login(username, password);

        setLoading(false);

        if (!result.success) {
            setError(result.message ?? 'Login failed');
            return;
        }

        auth.login(result.username!, result.token!, result.isAdmin ?? false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Login</DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                {error && <Typography color="error" variant="body2">{error}</Typography>}

                <TextField
                    label="Username"
                    type="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
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
                    <Typography variant="body2">Don't have an account?</Typography>
                    <Typography variant="body2" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={onSwitchToRegister}>
                        Register
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
