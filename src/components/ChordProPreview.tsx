import {ChordProParser, HtmlDivFormatter} from 'chordsheetjs'
import {useMemo} from 'react'
import { Box } from '@mui/material';

interface Props {
    chordPro: string;
}

export default function ChordProPreview({chordPro}: Props) {
    const html = useMemo(() => {
        try {
            const parser = new ChordProParser();
            const song = parser.parse(chordPro);
            const formatter = new HtmlDivFormatter();
            return formatter.format(song);
        } catch {
            return '<p>Invalid Format! Try again!</p>';
        }
    }, [chordPro]);

    return (
        <Box dangerouslySetInnerHTML={{__html: html}}  sx={{
            '& .paragraph': { mb: 3 },
            '& .row': { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end' },
            '& .column': { display: 'inline-flex', flexDirection: 'column', mr: '4px' },
            '& .chord': { color: '#a4b9d8', fontWeight: 'bold', minHeight: '1.2em' },
        }}/>
    );
}