import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useTheme} from '@mui/material/styles';
import {useAuth} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';

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
    const navigate = useNavigate();

    const handleToggle = (
        _event: React.MouseEvent<HTMLElement>,
        newCategory: 'balkan' | 'foreign' | null,
    ) => {
        if (newCategory !== null) {
            onCategoryChange(newCategory);
        }
    };

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const {navbarBg, textColor, borderColor, buttonGray, toggleBg, toggleColor, toggleSelectedBg} = theme.custom;
    const auth = useAuth();

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
                                    <Button variant="outlined" sx={{color: textColor, borderColor: borderColor}}
                                            onClick={auth.logout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outlined" sx={{color: textColor, borderColor: borderColor}}
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
                py: 1,
                px: 2,
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
                        sx={{
                            minWidth: '30px',
                            color: textColor,
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255, 0.1)'
                            }
                        }}
                    >
                        {letter}
                    </Button>
                ))}
            </Box>
        </>
    );
}
