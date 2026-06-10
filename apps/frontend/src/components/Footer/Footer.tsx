import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/icons/Logo SuperAção.svg';
import styles from './Footer.module.css';

interface FooterItem {
  label: string;
  route: string;
}

interface FooterProps {
  footerItems?: FooterItem[];
}

export const Footer = ({ footerItems }: FooterProps) => {
  const location = useLocation();

  const defaultFooterItems: FooterItem[] = [
    {
      label: 'Saiba Mais',
      route: '/saiba-mais',
    },
    { label: 'Email', route: '' },
  ];

  const itemsToRender =
    footerItems && footerItems.length > 0 ? footerItems : defaultFooterItems;

  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="SuperAção Logo" className={styles.logo} />
        <span className={styles.brandName}>SuperAção</span>
      </div>

      <div className={styles.links}>
        {itemsToRender.map((item, index) => {
          const isHighlighted = location.pathname === item.route;

          return (
            <div key={index} className={styles.footerItem + (isHighlighted ? ` ${styles.highlighted}` : '')}>
              <Link to={item.route}>
                {item.label}
              </Link>
            </div>
          );
        })}
      </div>
    </footer>
  );
};
