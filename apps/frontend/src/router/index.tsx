import { createBrowserRouter } from 'react-router-dom';

import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { RedefinePassword } from '../pages/RedefinePassword/RedefinePassword';
import { ConfirmCode } from '../pages/ConfirmCode/ConfirmCode';
import { RecoverPassword } from '../pages/RecoverPassword/RecoverPassword';
import { RegisterEvent } from '../pages/RegisterEvent/RegisterEvent';
import { Events } from '../pages/Events/Events';
import { UserNotFound } from '../pages/UserNotFound/UserNotFound';
import { AppRoutes } from './routes';

export const router = createBrowserRouter([
  // TODO: Criar um middleware para lidar com autenticação e redirecionamento
  {
    path: '/',
    element: <Events />,
  },
  {
    path: AppRoutes.LOGIN,
    element: <Login />,
  },
  {
    path: AppRoutes.REGISTER,
    element: <Register />,
  },
  {
    path: AppRoutes.PASSWORD_RESET,
    element: <RedefinePassword />,
  },
  {
    path: AppRoutes.PASSWORD_RECOVERY,
    element: <RecoverPassword />,
  },
  {
    path: AppRoutes.CONFIRM_CODE,
    element: <ConfirmCode />,
  },
  {
    path: AppRoutes.REGISTER_EVENT,
    element: <RegisterEvent />,
  },
  {
    path: AppRoutes.EVENTS,
    element: <Events />,
  },
  {
    path: AppRoutes.USER_NOT_FOUND,
    element: <UserNotFound />,
  },
]);