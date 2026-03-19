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

const isCyrillic = (text: string) => /[\u0400-\u04FF]/.test(text);

const extractYoutubeId = (input: string) => {
    const match = input.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : input;
};

export default function SubmitForm({ artists }: Props) {
    const [artistMode, setArtistMode] = useState<'existing' | 'new'>('existing');
    const [category, setCategory] = useState<'balkan' | 'foreign'>('balkan');
    const [lyrics, setLyrics] = useState('');
    const [title, setTitle] = useState('');
    const [previewArtist, setPreviewArtist] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const previewLyrics = `{title: ${title}}\n{artist: ${previewArtist}}\n\n${lyrics}`;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        const titleValue = String(data.get('title'));
        const artistName = String(data.get('artistName') ?? '');

        if (category === 'balkan') {
            if (!isCyrillic(titleValue)) {
                setError('Balkan songs must have a Cyrillic title.');
                return;
            }
            if (artistMode === 'new' && !isCyrillic(artistName)) {
                setError('Balkan artist names must be in Cyrillic.');
                return;
            }
        }

        setLoading(true);
        setError('');

        const rawYoutubeId = String(data.get('youtubeId') ?? '').trim();

        try {
            await submitSong({
                artistId: artistMode === 'existing' ? Number(data.get('artistId')) : undefined,
                artistName: artistMode === 'new' ? artistName : undefined,
                title: titleValue,
                lyricsWithChords: lyrics,
                difficulty: String(data.get('difficulty')),
                capoPosition: Number(data.get('capo')) || 0,
                youtubeId: rawYoutubeId ? extractYoutubeId(rawYoutubeId) : undefined,
            });
            setSuccess(true);
            form.reset();
            setLyrics('');
            setTitle('');
            setPreviewArtist('');
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const filteredArtists = artists.filter(a => a.category === category);

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>

            {/* LEFT — Form */}
            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>

                {/* Category toggle */}
                <Box>
                    <Typography variant="subtitle2" mb={1}>Category</Typography>
                    <ToggleButtonGroup
                        value={category}
                        exclusive
                        onChange={(_, v) => v && setCategory(v)}
                        size="small"
                    >
                        <ToggleButton value="balkan">Balkan</ToggleButton>
                        <ToggleButton value="foreign">Foreign</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Divider />

                {/* Artist toggle */}
                <Box>
                    <Typography variant="subtitle2" mb={1}>Artist</Typography>
                    <ToggleButtonGroup
                        value={artistMode}
                        exclusive
                        onChange={(_, v) => v && setArtistMode(v)}
                        size="small"
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value="existing">Existing artist</ToggleButton>
                        <ToggleButton value="new">New artist</ToggleButton>
                    </ToggleButtonGroup>

                    {artistMode === 'existing' ? (
                        <TextField
                            select
                            fullWidth
                            label="Select artist"
                            name="artistId"
                            onChange={(e) => {
                                const found = filteredArtists.find(a => a.id === Number(e.target.value));
                                setPreviewArtist(found?.name ?? '');
                            }}
                        >
                            {filteredArtists.map((a) => (
                                <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                            ))}
                        </TextField>
                    ) : (
                        <TextField
                            fullWidth
                            label={category === 'balkan' ? 'Artist name (Cyrillic)' : 'Artist name'}
                            name="artistName"
                            onChange={(e) => setPreviewArtist(e.target.value)}
                            helperText={category === 'balkan' ? 'Must be in Cyrillic e.g. Дино Мерлин' : ''}
                        />
                    )}
                </Box>

                <Divider />

                {/* Title */}
                <TextField
                    fullWidth
                    label={category === 'balkan' ? 'Title (Cyrillic)' : 'Title'}
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    helperText={category === 'balkan' ? 'Must be in Cyrillic e.g. Љубав је' : ''}
                />

                {/* Difficulty + Capo */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
                    label="YouTube ID or URL (optional)"
                    name="youtubeId"
                    placeholder="e.g. dQw4w9WgXcQ or full YouTube URL"
                    helperText="You can paste the full URL or just the video ID"
                />

                <TextField
                    fullWidth
                    multiline
                    rows={16}
                    label="Lyrics with chords (ChordPro format)"
                    name="lyrics"
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder={`{start_of_verse}\nLet it [Am]be, let it [C]be\n{end_of_verse}`}
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

            {/* Right — Live Preview */}
            <Paper variant="outlined" sx={{ p: 3, position: 'sticky', top: 80, alignSelf: 'start', minHeight: 400 }}>
                <Typography variant="subtitle2" mb={2} color="text.secondary">
                    Live Preview
                </Typography>
                {(lyrics || title || previewArtist)
                    ? <ChordProPreview chordPro={previewLyrics} />
                    : <Typography color="text.disabled">Start typing lyrics to see the preview…</Typography>
                }
            </Paper>
        </Box>
    );
}
