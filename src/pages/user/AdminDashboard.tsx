import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Chip, CircularProgress,
    Button, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PendingIcon from '@mui/icons-material/Pending';
import { useTheme } from '@mui/material/styles';
import { getPendingSubmissions, approveSubmission, rejectSubmission } from '../../api/user.telefunc';

type Submission = Awaited<ReturnType<typeof getPendingSubmissions>>[number];

const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('sr-Latn', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

export default function AdminDashboard() {
    const theme = useTheme();
    const { navbarBg, textColor } = theme.custom;

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    const [rejectTarget, setRejectTarget] = useState<number | null>(null);
    const [rejectComment, setRejectComment] = useState('');

    useEffect(() => {
        getPendingSubmissions().then(data => {
            setSubmissions(data);
            setLoading(false);
        });
    }, []);

    const handleApprove = async (id: number) => {
        await approveSubmission(id);
        setSubmissions(prev => prev.filter(s => s.id !== id));
    };

    const handleReject = async () => {
        if (rejectTarget === null) return;
        await rejectSubmission(rejectTarget, rejectComment);
        setSubmissions(prev => prev.filter(s => s.id !== rejectTarget));
        setRejectTarget(null);
        setRejectComment('');
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ maxWidth: '900px', mx: 'auto', mt: 4, mb: 6, px: 2 }}>

            <Paper elevation={3} sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3 }}>
                <PendingIcon sx={{ fontSize: 50, color: navbarBg }} />
                <Box>
                    <Typography variant="h5" fontWeight="bold">Admin Dashboard</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Pending submissions:</Typography>
                        <Chip
                            label={submissions.length}
                            color={submissions.length > 0 ? 'warning' : 'success'}
                            size="small"
                        />
                    </Box>
                </Box>
            </Paper>

            <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: navbarBg, px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MusicNoteIcon sx={{ color: textColor }} />
                    <Typography variant="h6" sx={{ color: textColor, fontWeight: 'bold' }}>
                        Pending Songs
                    </Typography>
                </Box>

                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {submissions.length === 0 ? (
                        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            No pending submissions 🎉
                        </Typography>
                    ) : (
                        submissions.map((song) => (
                            <Paper key={song.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {song.titleCyrillic}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {song.artistName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Submitted by <strong>{song.submittedBy}</strong> on {formatDate(song.createdAt)}
                                        </Typography>
                                        {song.youtubeId && (
                                            <Box sx={{ mt: 0.5 }}>
                                                <Chip label="▶ Video" size="small" sx={{ bgcolor: 'red', color: '#fff' }} />
                                            </Box>
                                        )}
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={() => handleApprove(song.id)}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => setRejectTarget(song.id)}
                                        >
                                            Reject
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        ))
                    )}
                </Box>
            </Paper>

            <Dialog open={rejectTarget !== null} onClose={() => setRejectTarget(null)} fullWidth maxWidth="xs">
                <DialogTitle>Reject Submission</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Reason (optional)"
                        multiline
                        rows={3}
                        fullWidth
                        value={rejectComment}
                        onChange={e => setRejectComment(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectTarget(null)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleReject}>
                        Confirm Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
