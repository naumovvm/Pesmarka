'use client';

import {useState} from 'react';
import {
    Box, TextField, ToggleButton, ToggleButtonGroup,
    MenuItem, Button, Typography, Divider, Paper
} from '@mui/material';
import ChordProPreview from './../../components/ChordProPreview.tsx';
import {submitSong} from './../../api/songs.telefunc';
import {Alert, CircularProgress} from '@mui/material';
import {artist} from './../../db/schema';

type Artist = typeof artist.$inferSelect;

interface Props {
    artists: Artist[];
}

export default function SubmitForm({artists}: Props) {
    const [artistMode, setArtistMode] = useState<'existing' | 'new'>('existing');
    const [lyrics, setLyrics] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        setLoading(true);
        setError('');

        try {
            await submitSong({
                artistId: artistMode === 'existing' ? Number(data.get('artistId')) : undefined,
                artistName: artistMode === 'new' ? String(data.get('artistName')) : undefined,
                titleCyrillic: String(data.get('titleCyrillic')),
                titleLatin: String(data.get('titleLatin')),
                lyricsWithChords: lyrics,
                difficulty: String(data.get('difficulty')),
                capoPosition: Number(data.get('capo')) || 0,
                youtubeId: String(data.get('youtubeId')) || undefined,
            });
            setSuccess(true);
            form.reset();
            setLyrics('');
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'},
                gap: 4,
            }}
        >
            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
                <Box>
                    <Typography variant="subtitle2" mb={1}>Artist</Typography>
                    <ToggleButtonGroup
                        value={artistMode}
                        exclusive
                        onChange={(_, v) => v && setArtistMode(v)}
                        size="small"
                        sx={{mb: 2}}
                    >
                        <ToggleButton value="existing">Existing artist</ToggleButton>
                        <ToggleButton value="new">New artist</ToggleButton>
                    </ToggleButtonGroup>

                    {artistMode === 'existing' ? (
                        <TextField select fullWidth label="Select artist" name="artistId">
                            {artists.map((a) => (
                                <MenuItem key={a.id} value={a.id}>
                                    {a.nameCyrillic} / {a.nameLatin}
                                </MenuItem>
                            ))}
                        </TextField>
                    ) : (
                        <TextField fullWidth label="Artist name" name="artistName"/>
                    )}
                </Box>

                <Divider/>

                <TextField fullWidth label="Title (Cyrillic)" name="titleCyrillic" required/>
                <TextField fullWidth label="Title (Latin)" name="titleLatin" required/>

                <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2}}>
                    <TextField select fullWidth label="Difficulty" name="difficulty">
                        {['Beginner', 'Intermediate', 'Advanced'].map((d) => (
                            <MenuItem key={d} value={d.toLowerCase()}>{d}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Capo"
                        name="capo"
                        type="number"
                    />
                </Box>

                <TextField
                    fullWidth
                    label="YouTube ID (optional)"
                    name="youtubeId"
                    placeholder="e.g. dQw4w9WgXcQ"
                    helperText="Just the ID part, not the full URL"
                />

                <TextField
                    fullWidth
                    multiline
                    rows={16}
                    label="Lyrics with chords (ChordPro format)"
                    name="lyrics"
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder={`{title: Song Title}\n{artist: Artist Name}\n\n{start_of_verse}\nLet it [Am]be, let it [C]be\n{end_of_verse}`}
                />

                {success && <Alert severity="success">Song submitted! It will be reviewed shortly.</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} /> : null}
                >
                    {loading ? 'Submitting...' : 'Submit Song'}
                </Button>
            </Box>

            <Paper
                variant="outlined"
                sx={{p: 3, position: 'sticky', top: 80, alignSelf: 'start', minHeight: 400}}
            >
                <Typography variant="subtitle2" mb={2} color="text.secondary">
                    Live Preview
                </Typography>
                {lyrics
                    ? <ChordProPreview chordPro={lyrics}/>
                    : <Typography color="text.disabled">Start typing lyrics to see the preview…</Typography>
                }
            </Paper>
        </Box>
    );
}
