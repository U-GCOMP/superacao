import { createBrowserRouter } from 'react-router-dom';

import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { RedefinePassword } from '../pages/RedefinePassword/RedefinePassword';
import { ConfirmCode } from '../pages/ConfirmCode/ConfirmCode';
import { RecoverPassword } from '../pages/RecoverPassword/RecoverPassword';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/cadastro',
    element: <Register />,
  },
  {
    path: '/redefinir-senha',
    element: <RedefinePassword />,
  },
  {
    path: '/recuperar-senha',
    element: <RecoverPassword />,
  },
  {
    path: 'confirmar-codigo',
    element: <ConfirmCode />,
  }
]);