import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { updateSong } from './../api/songs.telefunc.ts';

export default function EditSongModal({ song, open, onClose, onSaved }) {
    const [form, setForm] = useState({
        title: song.title,
        artistName: song.artistName,
        lyricsWithChords: song.lyricsWithChords,
        difficulty: song.difficulty,
        capoPosition: song.capoPosition,
        originalKey: song.originalKey,
        youtubeId: song.youtubeId,
    });

    const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSave = async () => {
        await updateSong(song.id, form);
        onSaved();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Song</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField label="Title" value={form.title} onChange={handleChange('title')} />
                <TextField label="Artist" value={form.artistName} onChange={handleChange('artistName')} />
                <TextField label="YouTube ID" value={form.youtubeId} onChange={handleChange('youtubeId')} />
                <TextField label="Original Key" value={form.originalKey} onChange={handleChange('originalKey')} />
                <TextField label="Capo Position" type="number" value={form.capoPosition} onChange={handleChange('capoPosition')} />
                <TextField label="Difficulty" select value={form.difficulty} onChange={handleChange('difficulty')}>
                    {['beginner', 'intermediate', 'advanced'].map(d => (
                        <MenuItem key={d} value={d}>{d}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Lyrics with Chords"
                    multiline
                    rows={10}
                    value={form.lyricsWithChords}
                    onChange={handleChange('lyricsWithChords')}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
