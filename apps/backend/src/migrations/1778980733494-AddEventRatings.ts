import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventRatings1778980733494 implements MigrationInterface {
  name = 'AddEventRatings1778980733494';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "event_ratings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "event_id" uuid NOT NULL,
        "author_id" integer NOT NULL,
        "category_id" integer NOT NULL,
        "rating" integer NOT NULL,
        "comment" character varying,
        CONSTRAINT "PK_1a40669403a8ea520987fcb5396"
        PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "event_ratings"
      ADD CONSTRAINT "FK_b040edbf3fa45022e456098c4df"
      FOREIGN KEY ("event_id")
      REFERENCES "events"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "event_ratings"
      ADD CONSTRAINT "FK_event_ratings_author"
      FOREIGN KEY ("author_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "event_ratings"
      DROP CONSTRAINT "FK_event_ratings_author"
    `);

    await queryRunner.query(`
      ALTER TABLE "event_ratings"
      DROP CONSTRAINT "FK_b040edbf3fa45022e456098c4df"
    `);

    await queryRunner.query(`
      DROP TABLE "event_ratings"
    `);
  }
}
