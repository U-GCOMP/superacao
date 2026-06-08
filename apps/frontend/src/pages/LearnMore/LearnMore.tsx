import { BaseScreen } from '../../components/BaseScreen/BaseScreen';
import styles from './LearnMore.module.css';

export const LearnMore = () => {
  return (
    <BaseScreen>
      <main className={styles.content}>
        <h1>Sobre o SuperAção</h1>
        <p>
          O SuperAção é uma plataforma desenvolvida para facilitar a
          organização, divulgação e gerenciamento de eventos de diferentes
          portes. Nosso objetivo é conectar organizadores e participantes por
          meio de uma experiência simples, intuitiva e eficiente.
        </p>

        <p>
          Através da plataforma, organizadores podem criar eventos, gerenciar
          inscrições e acompanhar informações importantes em um único lugar.
          Isso reduz a complexidade dos processos administrativos e permite
          maior foco na realização de eventos de qualidade.
        </p>

        <p>
          Para os participantes, o SuperAção oferece uma maneira prática de
          encontrar eventos, realizar inscrições e acompanhar detalhes
          importantes, como datas, horários e locais. Dessa forma, buscamos
          tornar a participação em eventos mais acessível e organizada para
          todos.
        </p>
      </main>
    </BaseScreen>
  );
};
