import logo from '../../assets/icons/Logo SuperAção.svg';
import styles from './Footer.module.css';

interface FooterItem {
  label: string;
  onClick: () => void;
  isPrimary?: boolean;
  borderRadius?: number;
}

interface FooterProps {
  footerItems?: FooterItem[];
}

export const Footer = ({ footerItems }: FooterProps) => {
  const defaultFooterItems: FooterItem[] = [
    { label: 'Saiba Mais', onClick: () => {}},
    { label: 'Email', onClick: () => {}},
  ];

  const itemsToRender = footerItems && footerItems.length > 0 ? footerItems : defaultFooterItems;

  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="SuperAção Logo" className={styles.logo} />
        <span className={styles.brandName}>SuperAção</span>
      </div>

      <div className={styles.links}>
        {itemsToRender.map((item, index) => (
          <div key={index} className={styles.footerItem}>
            {item.isPrimary ? (
              <button 
                className={styles.primaryButton} 
                onClick={item.onClick}
                style={{ borderRadius: item.borderRadius }}
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
    </footer>
  );
};