import styles from "./BaseScreen.module.css"
import { Footer } from "../Footer/Footer"
import { Navbar } from "../NavBar/NavBar";

interface BaseScreenProps {
    children: React.ReactNode;
}

export const BaseScreen = ({ children }: BaseScreenProps) => {
    return (
        <main className={styles.main}>
            <Navbar />
            <section className={styles.content}>
                {children}
            </section>
            <Footer />
        </main>
    )
}