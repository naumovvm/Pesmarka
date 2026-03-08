import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export default function Footer() {
    const theme = useTheme();
    const { navbarBg, textColor, borderColor } = theme.custom;

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: navbarBg,
                borderTop: `1px solid ${borderColor}`
            }}
        >
            <Typography variant="body1" align="center" sx={{ color: textColor }}>
                © {new Date().getFullYear()} Pesmarka. All rights reserved.
            </Typography>
        </Box>
    );
}
