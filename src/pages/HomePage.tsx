import {
    Box, Button, TextField, Typography, Container,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// import ChordProPreview from "../components/ChordProPreview.tsx";

export default function HomePage({ category }: { category: 'balkan' | 'foreign' }) {
    const songs = [
        { id: '1', title: 'Song 1', artist: 'Artist 1', date: '2026-02-11' },
        { id: '2', title: 'Song 2', artist: 'Artist 2', date: '2026-02-10' },
        { id: '3', title: 'Song 3', artist: 'Artist 3', date: '2026-02-09' },
    ];

    const theme = useTheme();
    const { navbarBg, textColor, buttonHoverBg } = theme.custom;

    return (
        <Container maxWidth="xl" sx={{ mt: 3, mb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <TextField
                placeholder="SEARCH BOX"
                variant="outlined"
                sx={{ width: '100%', maxWidth: '600px', mb: 4, bgcolor: 'background.paper' }}
            />

            <Box sx={{ display: 'flex', gap: 3, mb: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button variant="contained" size="large" sx={{
                    bgcolor: navbarBg,
                    color: textColor,
                    width: '200px',
                    '&:hover': { bgcolor: buttonHoverBg }
                }}>
                    CHORD DIAGRAM
                </Button>
                <Button variant="contained" size="large" sx={{
                    bgcolor: navbarBg,
                    color: textColor,
                    width: '200px',
                    '&:hover': { bgcolor: buttonHoverBg }
                }}>
                    FAVORITES
                </Button>
            </Box>

            {/*Testing chordpro preview:*/}
            {/*<Box sx={{width: '100%', maxWidth: '900px', mb: 5}}>*/}
            {/*    <ChordProPreview chordPro={`*/}
            {/*        {title: Girl on the Moon}*/}
            {/*        {artist: Foreigner}*/}
            {/*        {start_of_verse}*/}
            {/*        [Am]Cuz she's a girl on the [Em]moon*/}
            {/*    `}/>*/}
            {/*</Box>*/}

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
                                <TableRow key={song.id} hover>
                                    <TableCell>{song.title}</TableCell>
                                    <TableCell>{song.artist}</TableCell>
                                    <TableCell>{song.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}
