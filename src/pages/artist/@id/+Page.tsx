import {useEffect, useState} from 'react';
import {getSongsByArtist, getAllArtists} from '../../../api/songs.telefunc';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import {useParams, useLocation, useNavigate} from 'react-router-dom';

type Song = {
    id: number;
    title: string;
    difficulty: string;
    capoPosition: number | null;
    originalKey: string | null;
};

type Artist = {
    id: number;
    name: string;
    bio: string | null;
    letter: string;
    category: string;
};

export default function ArtistPage() {
    const {id} = useParams<{ id: string }>();
    const artistId = Number(id);

    const [artist, setArtist] = useState<Artist | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        getAllArtists().then((all) => {
            const found = all.find((a) => a.id === artistId) ?? null;
            setArtist(found);
        });

        getSongsByArtist(artistId).then(setSongs);
    }, [artistId]);

    useEffect(() => {
        getAllArtists().then((all) => {
            console.log('All artists:', all);
            console.log('Looking for ID:', artistId, typeof artistId);
            const found = all.find((a) => a.id === artistId) ?? null;
            console.log('Found:', found);
            setArtist(found);
        });

        getSongsByArtist(artistId).then((s) => {
            console.log('Songs:', s);
            setSongs(s);
        });
    }, [artistId]);


    if (!artist) return <Typography sx={{p: 4}}>Loading...</Typography>;

    const difficultyColor = (d: string) => {
        if (d === 'beginner') return 'success';
        if (d === 'intermediate') return 'warning';
        return 'error';
    };

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', p: 4}}>

            <Typography variant="h3" fontWeight="bold" gutterBottom>
                {artist.name}
            </Typography>

            {artist.bio && (
                <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
                    {artist.bio}
                </Typography>
            )}

            <Typography variant="h6" sx={{mb: 2}}>
                {songs.length} {songs.length === 1 ? 'Song' : 'Songs'}
            </Typography>

            {songs.length === 0 ? (
                <Typography color="text.secondary">No songs yet for this artist.</Typography>
            ) : (
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    {songs.map((song) => (
                        <Card key={song.id} variant="outlined">
                            <CardActionArea onClick={() => {
                                const params = new URLSearchParams(location.search);
                                const query = params.toString();
                                navigate(query ? `/song/${song.id}?${query}` : `/song/${song.id}`);
                            }}>
                                <CardContent
                                    sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Typography variant="h6">{song.title}</Typography>
                                    <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                                        {song.originalKey && (
                                            <Chip label={`Key: ${song.originalKey}`} size="small"/>
                                        )}
                                        {song.capoPosition != null && song.capoPosition > 0 && (
                                            <Chip label={`Capo ${song.capoPosition}`} size="small"/>
                                        )}
                                        <Chip
                                            label={song.difficulty}
                                            size="small"
                                            color={difficultyColor(song.difficulty)}
                                        />
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Box>
            )
            }
        </Box>
    )
        ;
}
