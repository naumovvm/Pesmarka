import {
    Box, Button, TextField, Typography, Container,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLatestSongs } from './../api/songs.telefunc';

type HomeSong = {
    id: number;
    title: string;
    artistName: string;
    createdAt: string | null;
};

export default function HomePage({ category }: { category: 'balkan' | 'foreign' }) {
    const [songs, setSongs] = useState<HomeSong[]>([]);
    const theme = useTheme();
    const { navbarBg, textColor, buttonHoverBg } = theme.custom;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getLatestSongs(category).then((rows) => {
            setSongs(
                rows.map((row) => ({
                    id: row.id,
                    title: row.title,
                    artistName: row.artistName,
                    createdAt: row.createdAt,
                }))
            );
        });
    }, [category]);

    const handleRowClick = (songId: number) => {
        const params = new URLSearchParams(location.search);
        const query = params.toString();
        navigate(query ? `/song/${songId}?${query}` : `/song/${songId}`);
    };

    return (
        <Container
            maxWidth="xl"
            sx={{ mt: 3, mb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <TextField
                placeholder="SEARCH BOX"
                variant="outlined"
                sx={{ width: '100%', maxWidth: '600px', mb: 4, bgcolor: 'background.paper' }}
            />

            <Box sx={{ display: 'flex', gap: 3, mb: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        bgcolor: navbarBg,
                        color: textColor,
                        width: '200px',
                        '&:hover': { bgcolor: buttonHoverBg },
                    }}
                >
                    CHORD DIAGRAM
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        bgcolor: navbarBg,
                        color: textColor,
                        width: '200px',
                        '&:hover': { bgcolor: buttonHoverBg },
                    }}
                >
                    FAVORITES
                </Button>
            </Box>

            <Box sx={{ width: '100%', maxWidth: '900px' }}>
                <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Newest {category} songs:
                </Typography>
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ bgcolor: navbarBg }}>
                            <TableRow>
                                <TableCell sx={{ color: textColor }}><strong>Song Title</strong></TableCell>
                                <TableCell sx={{ color: textColor }}><strong>Artist</strong></TableCell>
                                <TableCell sx={{ color: textColor }}><strong>Date Uploaded</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {songs.map((song) => (
                                <TableRow
                                    key={song.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => handleRowClick(song.id)}
                                >
                                    <TableCell>{song.title}</TableCell>
                                    <TableCell>{song.artistName}</TableCell>
                                    <TableCell>
                                        {song.createdAt
                                            ? new Date(song.createdAt).toLocaleDateString()
                                            : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {songs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Typography align="center" color="text.secondary">
                                            No songs yet for this category.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}
