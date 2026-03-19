import { config } from 'telefunc/client';

export function syncTelefuncToken() {
    const token = localStorage.getItem('token');
    config.httpHeaders = token ? { Authorization: `Bearer ${token}` } : {};
}

syncTelefuncToken();
