import styles from "./BaseScreen.module.css"
import { Footer } from "../Footer/Footer"
import { Navbar } from "../NavBar/NavBar";

interface BaseScreenProps {
    hasPadding?: boolean;
    children: React.ReactNode;
}

export const BaseScreen = ({ hasPadding = true, children }: BaseScreenProps) => {
    return (
        <main className={styles.main}>
            <Navbar />
            <section className={styles.content} data-has-padding={hasPadding}>
                {children}
            </section>
            <Footer />
        </main>
    )
}
