import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/icons/Logo SuperAção.svg';
import styles from './NavBar.module.css';
import { useAuthentication } from '../../hooks/useAuthentication.hook';
import { AppRoutes } from '../../router/routes';

interface NavItem {
  label: string;
  route: string;
}

interface NavbarProps {
  navItems?: NavItem[];
}

export const Navbar = ({ navItems }: NavbarProps) => {
  const { isAuthenticated } = useAuthentication();
  const location = useLocation();
  
  const defaultNavItems: NavItem[] = getDefaultNavItems(isAuthenticated);
  const itemsToRender = navItems && navItems.length > 0 ? navItems : defaultNavItems;
  
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="SuperAção Logo" className={styles.logo} />
        <span className={styles.brandName}>SuperAção</span>
      </div>

      <div className={styles.links}>
        {itemsToRender.map((item, index) => {
          const isHighlighted = location.pathname === item.route;
          
          return(
            <div
              key={`navbar-link-${index}`}
              className={styles.navItem + (isHighlighted ? ` ${styles.highlighted}` : '')}
            >
              <Link to={item.route}>
                {item.label}
              </Link>
            </div>
        )})}
      </div>
    </nav>
  );
};

function getDefaultNavItems(isAuthenticated: boolean): NavItem[] {
  const defaultNavItems = [
    { label: 'Eventos', route: AppRoutes.EVENTS },
    { label: 'Meus Eventos', route: AppRoutes.MY_EVENTS },
  ];

  if (isAuthenticated)
    defaultNavItems.push({ label: 'Meu perfil', route: AppRoutes.PROFILE });
  else
    defaultNavItems.push({ label: 'Entrar', route: AppRoutes.LOGIN });

  return defaultNavItems;
}
