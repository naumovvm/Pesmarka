import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {onGetSong} from '../../../api/songs.telefunc.ts';
import ChordProPreview from '../../../components/ChordProPreview.tsx';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

type Song = {
    id: number;
    title: string;
    lyricsWithChords: string;
    difficulty: string;
    capoPosition: number | null;
    originalKey: string | null;
    youtubeId: string | null;
    artistName: string;
    artistId: number;
};

export default function Page() {
    const {id} = useParams<{ id: string }>();
    const songId = Number(id);
    const [song, setSong] = useState<Song | null>(null);

    useEffect(() => {
        if (!Number.isNaN(songId)) {
            onGetSong(songId).then(setSong);
        }
    }, [songId]);

    if (!song) {
        return (
            <Box maxWidth="md" mx="auto" p={4}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    const difficultyColor: 'success' | 'warning' | 'error' = song.difficulty === 'beginner' ? 'success' : song.difficulty === 'intermediate' ? 'warning' : 'error';

    return (
        <Box maxWidth="md" mx="auto" p={4}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                {song.title}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {song.artistName}
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                <Chip label={song.difficulty} size="small" color={difficultyColor}/>
                {song.capoPosition != null && song.capoPosition > 0 && (
                    <Chip label={`Capo ${song.capoPosition}`} size="small"/>
                )}
                {song.originalKey && (
                    <Chip label={`Key: ${song.originalKey}`} size="small"/>
                )}
            </Box>

            {song.youtubeId && (
                <Box mb={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            aspectRatio: '16 / 9',
                            overflow: 'hidden',
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            component="iframe"
                            src={`https://www.youtube.com/embed/${song.youtubeId}`}
                            sx={{width: '100%', height: '100%', border: 0}}
                            allowFullScreen
                        />
                    </Paper>
                </Box>
            )}

            <ChordProPreview chordPro={song.lyricsWithChords}/>
        </Box>
    );
}
