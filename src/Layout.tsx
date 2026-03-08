import {type ReactNode, useMemo} from 'react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navbar from './components/AlphabetNav.tsx';
import Footer from './components/Footer.tsx';

interface LayoutProps {
    children: ReactNode;
    category: 'balkan' | 'foreign';
    onCategoryChange: (cat: 'balkan' | 'foreign') => void;
    mode: 'light' | 'dark';
    onThemeToggle: () => void;
    onLoginClick: () => void;
    onRegisterClick: () => void;
}

declare module '@mui/material/styles' {
    interface Theme {
        custom: {
            navbarBg: string;
            textColor: string;
            borderColor: string;
            buttonGray: string;
            toggleBg: string;
            toggleColor: string;
            toggleSelectedBg: string;
            buttonHoverBg: string;
        };
    }

    interface ThemeOptions {
        custom?: {
            navbarBg?: string;
            textColor?: string;
            borderColor?: string;
            buttonGray?: string;
            toggleBg?: string;
            toggleColor?: string;
            toggleSelectedBg?: string;
            buttonHoverBg: string;
        };
    }
}


export default function Layout({
                                   children,
                                   category,
                                   onCategoryChange,
                                   mode,
                                   onThemeToggle,
                                   onLoginClick,
                                   onRegisterClick
                               }: LayoutProps) {

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {main: '#a8c5dd'},
            background: {
                default: mode === 'light' ? '#f5f5f5' : '#121212',
                paper: mode === 'light' ? '#fff' : '#1e1e1e'
            },
            text: {
                primary: mode === 'light' ? '#000' : '#fff',
            }
        },
        custom: {
            navbarBg: mode === 'dark' ? '#234059' : '#a4b9d8',
            textColor: mode === 'dark' ? '#fff' : '#000',
            borderColor: mode === 'dark' ? '#fff' : '#333',
            buttonGray: mode === 'dark' ? '#232323' : '#333',
            toggleBg: mode === 'dark' ? '#424242' : '#fff',
            toggleColor: mode === 'dark' ? '#aaa' : 'rgba(0,0,0,0.54)',
            toggleSelectedBg: mode === 'dark' ? '#666' : '#e0e0e0',
            buttonHoverBg: mode === 'dark' ? '#2c4f6d' : '#90b0c9',
        }
    }), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
            }}>
                <Navbar
                    currentCategory={category}
                    onCategoryChange={onCategoryChange}
                    onThemeToggle={onThemeToggle}
                    onLoginClick={onLoginClick}
                    onRegisterClick={onRegisterClick}
                />

                <Box component="main" sx={{flexGrow: 1}}>
                    {children}
                </Box>

                <Footer/>
            </Box>
        </ThemeProvider>
    );
}
