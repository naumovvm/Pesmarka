import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onGetSong, isFavorited, toggleFavorite } from '../../../api/songs.telefunc';
import ChordProPreview from '../../../components/ChordProPreview.tsx';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

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
    const { id } = useParams<{ id: string }>();
    const songId = Number(id);
    const [song, setSong] = useState<Song | null>(null);
    const [favorited, setFavorited] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!Number.isNaN(songId)) {
            onGetSong(songId).then(setSong);
            if (auth.user) {
                isFavorited(songId).then(setFavorited);
            }
        }
    }, [songId, auth.user]);

    const handleFavoriteToggle = async () => {
        if (!auth.user) return;
        setFavLoading(true);
        const result = await toggleFavorite(songId);
        setFavorited(result.favorited);
        setFavLoading(false);
    };

    if (!song) {
        return (
            <Box maxWidth="md" mx="auto" p={4}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    const difficultyColor: 'success' | 'warning' | 'error' =
        song.difficulty === 'beginner' ? 'success'
            : song.difficulty === 'intermediate' ? 'warning'
                : 'error';

    return (
        <Box maxWidth="md" mx="auto" p={4}>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h3" fontWeight="bold">
                    {song.title}
                </Typography>

                <Tooltip title={
                    !auth.user ? 'Login to favorite'
                        : favorited ? 'Remove from favorites'
                            : 'Add to favorites'
                }>
                    <span>
                        <IconButton
                            onClick={handleFavoriteToggle}
                            disabled={!auth.user || favLoading}
                            sx={{ color: favorited ? 'error.main' : 'text.secondary' }}
                        >
                            {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
                onClick={() => {
                    const params = new URLSearchParams(location.search);
                    navigate(`/artist/${song.artistId}?${params.toString()}`);
                }}
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
                {song.artistName}
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                <Chip label={song.difficulty} size="small" color={difficultyColor} />
                {song.capoPosition != null && song.capoPosition > 0 && (
                    <Chip label={`Capo ${song.capoPosition}`} size="small" />
                )}
                {song.originalKey && (
                    <Chip label={`Key: ${song.originalKey}`} size="small" />
                )}
            </Box>

            {song.youtubeId && (
                <Box mb={4}>
                    <Paper elevation={3} sx={{ aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 2 }}>
                        <Box
                            component="iframe"
                            src={`https://www.youtube.com/embed/${song.youtubeId}`}
                            sx={{ width: '100%', height: '100%', border: 0 }}
                            allowFullScreen
                        />
                    </Paper>
                </Box>
            )}

            <ChordProPreview chordPro={song.lyricsWithChords} />
        </Box>
    );
}
