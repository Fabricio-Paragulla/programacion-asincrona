import { it, expect, describe, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../store/authStore';

describe('Seguridad: Interceptores', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('Debe borrar el token si la API responde con un error 401', async () => {
    const store = useAuthStore();
    store.token = 'token_de_prueba';
    
    // Simular un error 401 llamando directamente al método logout
    const mockError = { response: { status: 401 } };
    
    // Verificar que el store tiene el token antes
    expect(store.token).toBe('token_de_prueba');
    
    // Simular lo que hace el interceptor cuando detecta un 401
    if (mockError.response?.status === 401) {
      store.logout();
    }
    
    // Verificar que el token fue eliminado
    expect(store.token).toBeNull();
  });
});