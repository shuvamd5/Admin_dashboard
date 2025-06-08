import { LoginResponse } from '@/lib/types/auth';

export const mockLogin = async (username: string, password: string): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'admin#123') {
        resolve({
          responseCode: '000',
          responseMessage: 'Login Successful.',
          token: '7e67ba1a565b911c2c21980b21c976a4',
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};