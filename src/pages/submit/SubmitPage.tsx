import { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import SubmitForm from './SubmitForm';
import { getAllArtists } from './../../api/songs.telefunc';
import { artist } from './../../db/schema';

type Artist = typeof artist.$inferSelect;

export default function SubmitPage() {
    const [artists, setArtists] = useState<Artist[]>([]);

    useEffect(() => {
        getAllArtists().then(setArtists);
    }, []);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" mb={4}>
                Submit a Song
            </Typography>
            <SubmitForm artists={artists} />
        </Container>
    );
}
