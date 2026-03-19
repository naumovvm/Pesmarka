'use client';

import { useEffect, useState } from 'react';
import {
    Box, Typography, Tabs, Tab, Card, CardContent, CardActions,
    Button, Chip, TextField, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, CircularProgress, Alert
} from '@mui/material';
import {
    getPendingSubmissions,
    approveSubmission,
    rejectSubmission,
    addArtist,
    getAllArtists,
} from './../../api/songs.telefunc';
import ChordProPreview from './../../components/ChordProPreview';

type Submission = {
    id: number;
    title: string;
    artistId: number | null;
    artistName: string | null;
    difficulty: string;
    capoPosition: number | null;
    lyricsWithChords: string;
    youtubeId: string | null;
    createdAt: Date | null;
    submittedBy: string | null;
};

type Artist = {
    id: number;
    name: string;
    category: string;
};

export default function AdminDashboard() {
    const [tab, setTab] = useState(0);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [rejectId, setRejectId] = useState<number | null>(null);
    const [rejectComment, setRejectComment] = useState('');

    const [assignedArtistIds, setAssignedArtistIds] = useState<Record<number, string>>({});

    const [artistForm, setArtistForm] = useState({ name: '', letter: '', category: 'balkan', bio: '' });
    const [artistSuccess, setArtistSuccess] = useState(false);

    const fetchData = async () => {
        try {
            const [subs, arts] = await Promise.all([
                getPendingSubmissions(),
                getAllArtists(),
            ]);
            setSubmissions(subs);
            setArtists(arts);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id: number, overrideArtistId?: number) => {
        try {
            await approveSubmission(id, overrideArtistId);
            setSubmissions(prev => prev.filter(s => s.id !== id));
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleReject = async () => {
        if (!rejectId) return;
        try {
            await rejectSubmission(rejectId, rejectComment);
            setSubmissions(prev => prev.filter(s => s.id !== rejectId));
            setRejectId(null);
            setRejectComment('');
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleAddArtist = async () => {
        try {
            await addArtist(artistForm);
            setArtistSuccess(true);
            setArtistForm({ name: '', letter: '', category: 'balkan', bio: '' });
            // Refresh artists list so the new one appears in dropdowns immediately
            const updated = await getAllArtists();
            setArtists(updated);
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>Admin Panel</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label={`Pending Submissions (${submissions.length})`} />
                <Tab label="Add Artist" />
            </Tabs>

            {/* TAB 1 — Pending Submissions */}
            {tab === 0 && (
                <Box>
                    {loading && <CircularProgress />}
                    {!loading && submissions.length === 0 && (
                        <Typography color="text.secondary">No pending submissions!</Typography>
                    )}
                    {submissions.map((s) => (
                        <Card key={s.id} variant="outlined" sx={{ mb: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6">{s.title}</Typography>
                                    <Chip label={s.difficulty} size="small" />
                                    {s.capoPosition ? <Chip label={`Capo ${s.capoPosition}`} size="small" /> : null}
                                </Box>
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                    {s.artistName ? `New artist: ${s.artistName}` : `Artist ID: ${s.artistId}`}
                                    {' · '}Submitted by <strong>{s.submittedBy ?? 'unknown'}</strong>
                                    {' · '}{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}
                                </Typography>
                                <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                                    <ChordProPreview chordPro={s.lyricsWithChords} />
                                </Box>
                            </CardContent>
                            <CardActions sx={{ flexWrap: 'wrap', gap: 1 }}>
                                {s.artistName && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                        <Typography variant="caption" color="warning.main">
                                            ⚠ New artist "{s.artistName}" — add them in the Artists tab first, then assign:
                                        </Typography>
                                        <TextField
                                            select
                                            size="small"
                                            label="Assign artist"
                                            value={assignedArtistIds[s.id] ?? ''}
                                            onChange={(e) => setAssignedArtistIds(prev => ({ ...prev, [s.id]: e.target.value }))}
                                            sx={{ minWidth: 200 }}
                                        >
                                            {artists.map((a) => (
                                                <MenuItem key={a.id} value={a.id}>
                                                    {a.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                )}
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleApprove(s.id, s.artistName ? Number(assignedArtistIds[s.id]) : undefined)}
                                    disabled={!!s.artistName && !assignedArtistIds[s.id]}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => setRejectId(s.id)}
                                >
                                    Reject
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}

            {/* TAB 2 — Add Artist */}
            {tab === 1 && (
                <Box sx={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {artistSuccess && <Alert severity="success">Artist added! You can now assign them to pending submissions.</Alert>}
                    <TextField
                        label="Artist name"
                        value={artistForm.name}
                        onChange={(e) => setArtistForm(p => ({ ...p, name: e.target.value }))}
                        helperText="Use Cyrillic for Balkan artists"
                    />
                    <TextField
                        label="Letter"
                        value={artistForm.letter}
                        onChange={(e) => setArtistForm(p => ({ ...p, letter: e.target.value }))}
                        helperText="First letter of the artist name, used for alphabetical navigation"
                    />
                    <TextField
                        select
                        label="Category"
                        value={artistForm.category}
                        onChange={(e) => setArtistForm(p => ({ ...p, category: e.target.value }))}
                    >
                        <MenuItem value="balkan">Balkan</MenuItem>
                        <MenuItem value="foreign">Foreign</MenuItem>
                    </TextField>
                    <TextField
                        label="Bio (optional)"
                        multiline
                        rows={3}
                        value={artistForm.bio}
                        onChange={(e) => setArtistForm(p => ({ ...p, bio: e.target.value }))}
                    />
                    <Button variant="contained" onClick={handleAddArtist}>
                        Add Artist
                    </Button>
                </Box>
            )}

            {/* Reject Dialog */}
            <Dialog open={!!rejectId} onClose={() => setRejectId(null)}>
                <DialogTitle>Reject Submission</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Reason (optional)"
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectId(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleReject}>Reject</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
