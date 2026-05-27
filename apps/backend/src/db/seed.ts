import dataSource from './data-source';
import { Users } from '../auth/entities/user.entity';
import { Event } from '../event/entities/event.entity';
import { EventVolunteers } from '../event/entities/event-volunteers.entity';
import { EventRatings } from '../event/entities/event-rating.entity';
import { UserRatings } from '../user/entities/user-ratings.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  try {
    console.log('Conectando ao banco de dados...');
    await dataSource.initialize();
    console.log('Conexão estabelecida');

    console.log('Limpando tabelas antigas...');
    await dataSource.query(`
      TRUNCATE TABLE 
        "users", 
        "events", 
        "event_ratings", 
        "user_ratings", 
        "event_volunteers" 
      CASCADE;
    `);

    const userRepo = dataSource.getRepository(Users);
    const eventRepo = dataSource.getRepository(Event);
    const eventVolunteersRepo = dataSource.getRepository(EventVolunteers);
    const eventRatingsRepo = dataSource.getRepository(EventRatings);
    const userRatingsRepo = dataSource.getRepository(UserRatings);

    console.log('Criando Usuários...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Senha123@', salt);

    const usersData = [
      { 
        username: 'admin', 
        email: 'admin@teste.com', 
        password: hashedPassword, 
        bio: 'Admin do sistema'
      },
      { 
        username: 'joao_voluntario', 
        email: 'joao@teste.com', 
        password: hashedPassword, 
        bio: 'Amo ajudar e ler light novels!'
      },
      { 
        username: 'maria_ong', 
        email: 'maria@teste.com', 
        password: hashedPassword, 
        bio: 'Organizadora de eventos.'
      },
    ];
    
    const savedUsers = await userRepo.save(usersData);

    console.log('Criando Eventos...');
    const eventsData = [
      {
        title: 'Mutirão de Limpeza do Parque do Povo',
        description: 'Vamos limpar o parque do povo neste final de semana.',
        place: 'Parque do Povo',
        date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        volunteers_subscription_deadline_date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        volunteers_max: 20,
        owner: savedUsers[2],
        status: 'SCHEDULED' as const,
      },
      {
        title: 'Doação de Agasalhos',
        description: 'Arrecadação de agasalhos para o inverno.',
        place: 'Auditório da UNESP',
        date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
        volunteers_subscription_deadline_date: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000),
        volunteers_max: 10,
        owner: savedUsers[0],
        status: 'COMPLETED' as const,
      }
    ];
    const savedEvents = await eventRepo.save(eventsData);

    console.log('Criando Voluntários...');
    await eventVolunteersRepo.save([
      { event_id: savedEvents[1].id, user_id: savedUsers[1].id, event: savedEvents[1], user: savedUsers[1] },
      { event_id: savedEvents[1].id, user_id: savedUsers[2].id, event: savedEvents[1], user: savedUsers[2] }
    ]);

    savedEvents[1].volunteers_count = 2;
    await eventRepo.save(savedEvents[1]);

    console.log('Criando Avaliações de Eventos...');
    await eventRatingsRepo.save([
      {
        event_id: savedEvents[1].id,
        author_id: savedUsers[1].id,
        event: savedEvents[1],
        author: savedUsers[1],
        category_id: 1,
        rating: 5,
        comment: 'Evento maravilhoso, muito organizado!',
      }
    ]);

    console.log('Criando Avaliações de Usuários...');
    await userRatingsRepo.save([
      {
        target_id: savedUsers[1].id,
        author_id: savedUsers[0].id,
        target: savedUsers[1],
        author: savedUsers[0],
        rating: 5,
        comment: 'Voluntário extremamente prestativo.',
      }
    ]);

    console.log('Seed finalizada com sucesso');
  } catch (error) {
    console.error('Erro ao rodar o seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

bootstrap();