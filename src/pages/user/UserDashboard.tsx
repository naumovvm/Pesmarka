import { useEffect, useState } from 'react';
import {
    Box, Typography, Avatar, Paper, Chip,
    CircularProgress, Button, Divider
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { getUserDashboard } from '../../api/user.telefunc';

const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('sr-Latn', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

export default function UserDashboard() {
    const auth = useAuth();
    const theme = useTheme();
    const { navbarBg, textColor } = theme.custom;

    const [data, setData] = useState<Awaited<ReturnType<typeof getUserDashboard>>>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const payload = JSON.parse(atob(auth.user!.token.split('.')[1]));

        getUserDashboard(payload.id).then(result => {
            setData(result);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    if (!data) return (
        <Typography sx={{ textAlign: 'center', mt: 10 }}>
            Could not load dashboard.
        </Typography>
    );

    return (
        <Box sx={{ maxWidth: '900px', mx: 'auto', mt: 4, mb: 6, px: 2 }}>

            <Paper elevation={3} sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 4, borderRadius: 3 }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#666' }}>
                    <AccountCircleIcon sx={{ fontSize: 80 }} />
                </Avatar>

                <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                        {data.profile.username}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarTodayIcon fontSize="small" />
                            <Box>
                                <Typography variant="caption" color="text.secondary">Member since</Typography>
                                <Typography variant="body2">{formatDate(data.profile.createdAt)}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon fontSize="small" />
                            <Box>
                                <Typography variant="caption" color="text.secondary">Last submission</Typography>
                                <Typography variant="body2">{formatDate(data.lastSubmit)}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MusicNoteIcon fontSize="small" />
                            <Box>
                                <Typography variant="caption" color="text.secondary">Songs submitted</Typography>
                                <Typography variant="body2">{data.submissions.length}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: navbarBg, px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MusicNoteIcon sx={{ color: textColor }} />
                    <Typography variant="h6" sx={{ color: textColor, fontWeight: 'bold' }}>
                        Songs by {data.profile.username}
                    </Typography>
                </Box>

                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {data.submissions.length === 0 ? (
                        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            No songs submitted yet.
                        </Typography>
                    ) : (
                        data.submissions.map((song) => (
                            <Paper key={song.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                    {song.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {song.artistName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    📅 {formatDate(song.createdAt)}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    {song.youtubeId && (
                                        <Chip
                                            label="▶ Video"
                                            size="small"
                                            sx={{ bgcolor: 'red', color: '#fff', fontWeight: 'bold' }}
                                        />
                                    )}
                                    <Chip
                                        label={song.status}
                                        size="small"
                                        color={
                                            song.status === 'approved' ? 'success' :
                                                song.status === 'rejected' ? 'error' : 'warning'
                                        }
                                    />
                                </Box>

                                {song.adminComment && (
                                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                        Admin note: {song.adminComment}
                                    </Typography>
                                )}

                                <Divider sx={{ my: 1 }} />
                                <Button size="small" variant="outlined" startIcon="👁">
                                    View
                                </Button>
                            </Paper>
                        ))
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
