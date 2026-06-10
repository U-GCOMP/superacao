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
import { EventDetails } from '../pages/EventDetails/EventDetails';
import { Profile } from '../pages/Profile/Profile';
import { protectedRouteLoader } from './loaders/protected-route-loader';
import { LearnMore } from '../pages/LearnMore/LearnMore';

export const router = createBrowserRouter([
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
    loader: protectedRouteLoader,
  },
  {
    path: AppRoutes.EVENTS,
    element: <Events />,
  },
  {
    path: AppRoutes.DETAIL_EVENT,
    element: <EventDetails />,
  },
  {
    path: AppRoutes.USER_PROFILE, 
    element: <Profile />,         
  },
  {
    path: AppRoutes.USER_NOT_FOUND,
    element: <UserNotFound />,
  },
  {
    path: AppRoutes.PROFILE,
    element: <Profile />,
    loader: protectedRouteLoader,
  },
  {
    path: AppRoutes.LEARN_MORE,
    element: <LearnMore />,
  },
]);
