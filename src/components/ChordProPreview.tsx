'use client';

import { ChordProParser, HtmlDivFormatter } from 'chordsheetjs';
import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
    chordPro: string;
}

export default function ChordProPreview({ chordPro }: Props) {
    const { html, artist } = useMemo(() => {
        try {
            const parser = new ChordProParser();
            const song = parser.parse(chordPro);
            const formatter = new HtmlDivFormatter();
            return {
                html: formatter.format(song),
                artist: song.artist,
            };
        } catch {
            return { html: '<p>Invalid Format! Try again!</p>', title: null, artist: null };
        }
    }, [chordPro]);

    return (
        <Box>
            {/*{title && <Typography variant="h6" fontWeight="bold">{title}</Typography>}*/}
            {artist && <Typography variant="subtitle2" color="text.secondary">{artist}</Typography>}
            <Box
                dangerouslySetInnerHTML={{ __html: html }}
                sx={{
                    '& .paragraph': { mb: 3 },
                    '& .row': { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end' },
                    '& .column': {
                        display: 'inline-flex',
                        flexDirection: 'column',
                        position: 'relative',
                        mr: '4px',
                        pt: '1.4em',
                    },
                    '& .chord': {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        color: '#a4b9d8',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                    },
                }}

            />
        </Box>
    );
}
