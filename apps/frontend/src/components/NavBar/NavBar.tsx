import logo from '../../assets/icons/Logo SuperAção.svg';
import styles from './Navbar.module.css';

interface NavItem {
  label: string;
  onClick: () => void;
  isPrimary?: boolean;
  borderRadius?: number;
}

interface NavbarProps {
  navItems: NavItem[];
}

export const Navbar = ({ navItems }: NavbarProps) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="SuperAção Logo" className={styles.logo} />
        <span className={styles.brandName}>SuperAção</span>
      </div>

      <div className={styles.links}>
        {navItems.map((item, index) => (
          <div key={index} className={styles.navItem}>
            {item.isPrimary ? (
              <button 
                className={styles.primaryButton} 
                onClick={item.onClick}
                style={item.borderRadius ? { borderRadius: item.borderRadius } : {}}
              >
                {item.label}
              </button>
            ) : (
              <button className={styles.textButton} onClick={item.onClick}>
                {item.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};