import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventVolunteers1779475664638 implements MigrationInterface {
  name = 'AddEventVolunteers1779475664638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "event_volunteers" (
        "event_id" uuid NOT NULL,
        "user_id" integer NOT NULL,
        CONSTRAINT "PK_event_volunteers"
          PRIMARY KEY ("event_id", "user_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "event_volunteers"
      ADD CONSTRAINT "FK_event_volunteers_event"
      FOREIGN KEY ("event_id")
      REFERENCES "events"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "event_volunteers"
      ADD CONSTRAINT "FK_event_volunteers_user"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "event_volunteers"
      DROP CONSTRAINT "FK_event_volunteers_user"
    `);

    await queryRunner.query(`
      ALTER TABLE "event_volunteers"
      DROP CONSTRAINT "FK_event_volunteers_event"
    `);

    await queryRunner.query(`
      DROP TABLE "event_volunteers"
    `);
  }
}
