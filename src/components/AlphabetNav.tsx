import React, {useState, useRef} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useTheme} from '@mui/material/styles';
import {useAuth} from '../context/AuthContext';
import {useNavigate, useLocation} from 'react-router-dom';
import {getArtistsByLetter} from '../api//songs.telefunc';

interface Artist {
    id: number;
    name: string;
    letter: string;
    category: string;
}

interface NavbarProps {
    currentCategory: 'balkan' | 'foreign';
    onCategoryChange: (cat: 'balkan' | 'foreign') => void;
    onThemeToggle: () => void;
    onLoginClick: () => void;
    onRegisterClick: () => void;
}

export default function AlphabetNav({
                                        currentCategory,
                                        onCategoryChange,
                                        onThemeToggle,
                                        onLoginClick,
                                        onRegisterClick
                                    }: NavbarProps) {
    const cyrillicAlphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Ѓ', 'Е', 'Ж', 'З', 'Ѕ', 'И', 'Ј', 'К', 'Л', 'Љ', 'М', 'Н', 'Њ', 'О', 'П', 'Р', 'С', 'Т', 'Ќ', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Џ', 'Ш'];
    const latinAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const alphabet = currentCategory === 'balkan' ? cyrillicAlphabet : latinAlphabet;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
    const [artists, setArtists] = useState<Artist[]>([]);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const {navbarBg, textColor, borderColor, buttonGray, toggleBg, toggleColor, toggleSelectedBg} = theme.custom;
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLetterEnter = async (event: React.MouseEvent<HTMLElement>, letter: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setAnchorEl(event.currentTarget);
        setHoveredLetter(letter);
        const result = await getArtistsByLetter(letter, currentCategory);
        setArtists(result);
    };

    const handleLetterLeave = () => {
        closeTimer.current = setTimeout(() => {
            setAnchorEl(null);
            setHoveredLetter(null);
            setArtists([]);
        }, 150);
    };

    const handleDropdownEnter = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };

    const handleDropdownLeave = () => {
        closeTimer.current = setTimeout(() => {
            setAnchorEl(null);
            setHoveredLetter(null);
            setArtists([]);
        }, 150);
    };

    const handleToggle = (
        _event: React.MouseEvent<HTMLElement>,
        newCategory: 'balkan' | 'foreign' | null,
    ) => {
        if (newCategory !== null) onCategoryChange(newCategory);
    };

    return (
        <>
            <AppBar position="static" sx={{backgroundColor: navbarBg, transition: '0.3s'}}>
                <Box sx={{width: '100%', px: 2}}>
                    <Toolbar disableGutters sx={{justifyContent: 'space-between'}}>
                        <Typography
                            variant="h5"
                            sx={{color: textColor, fontWeight: 'bold', cursor: 'pointer'}}
                            onClick={() => window.location.href = '/'}
                        >
                            {currentCategory === 'balkan' ? 'Песмарка' : 'Pesmarka'}
                        </Typography>

                        <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                            <ToggleButtonGroup
                                value={currentCategory}
                                exclusive
                                onChange={handleToggle}
                                sx={{
                                    backgroundColor: toggleBg,
                                    height: '40px',
                                    '& .MuiToggleButton-root': {
                                        color: toggleColor,
                                        '&.Mui-selected': {
                                            color: textColor,
                                            backgroundColor: toggleSelectedBg,
                                        }
                                    }
                                }}
                            >
                                <ToggleButton value="balkan">Balkan</ToggleButton>
                                <ToggleButton value="foreign">Foreign</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <IconButton onClick={onThemeToggle} sx={{color: textColor}}>
                                {isDark ? <Brightness7Icon/> : <Brightness4Icon/>}
                            </IconButton>

                            {auth.user ? (
                                <>
                                    <Typography
                                        sx={{
                                            color: textColor,
                                            cursor: 'pointer',
                                            '&:hover': {textDecoration: 'underline'}
                                        }}
                                        onClick={() => navigate(auth.user?.isAdmin ? '/admin' : '/dashboard')}
                                    >
                                        {auth.user?.username}
                                    </Typography>
                                    <Button variant="outlined" sx={{color: textColor, borderColor}}
                                            onClick={auth.logout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outlined" sx={{color: textColor, borderColor}}
                                            onClick={onLoginClick}>
                                        Login
                                    </Button>
                                    <Button variant="contained" sx={{bgcolor: buttonGray, color: '#fff'}}
                                            onClick={onRegisterClick}>
                                        Register
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Box>
            </AppBar>

            <Box sx={{
                bgcolor: navbarBg,
                borderTop: `1px solid ${borderColor}`,
                py: 1, px: 2,
                transition: '0.3s',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 0.5
            }}>
                {alphabet.map((letter) => (
                    <Button
                        key={letter}
                        size="small"
                        onMouseEnter={(e) => handleLetterEnter(e, letter)}
                        onMouseLeave={handleLetterLeave}
                        sx={{
                            minWidth: '30px',
                            color: hoveredLetter === letter ? '#fff' : textColor,
                            backgroundColor: hoveredLetter === letter ? 'rgba(255,255,255,0.15)' : 'transparent',
                            '&:hover': {backgroundColor: 'rgba(255,255,255,0.1)'}
                        }}
                    >
                        {letter}
                    </Button>
                ))}
            </Box>

            <Popper open={Boolean(anchorEl) && artists.length > 0} anchorEl={anchorEl} placement="bottom-start"
                    sx={{zIndex: 1300}}>
                <Paper
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                    sx={{
                        mt: 0.5,
                        minWidth: 160,
                        maxHeight: 300,
                        overflowY: 'auto',
                        bgcolor: navbarBg,
                        border: `1px solid ${borderColor}`
                    }}
                >
                    {artists.map((a) => (
                        <MenuItem
                            key={a.id}
                            onClick={() => {
                                const params = new URLSearchParams(location.search);
                                params.set('cat', currentCategory);
                                navigate(`/artist/${a.id}?${params.toString()}`);
                            }}
                            sx={{color: textColor, '&:hover': {bgcolor: 'rgba(255,255,255,0.1)'}}}
                        >
                            {a.name}
                        </MenuItem>
                    ))}
                </Paper>
            </Popper>
        </>
    );
}
