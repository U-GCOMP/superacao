import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRatings1779475034701 implements MigrationInterface {
  name = 'AddUserRatings1779475034701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_ratings" (
        "id" SERIAL NOT NULL,
        "target_id" integer NOT NULL,
        "author_id" integer NOT NULL,
        "rating" integer NOT NULL,
        "comment" character varying,
        CONSTRAINT "PK_9de3e405c7a1a3a8ce4c0715993" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "user_ratings"
      ADD CONSTRAINT "FK_user_ratings_author"
      FOREIGN KEY ("author_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "user_ratings"
      ADD CONSTRAINT "FK_user_ratings_target"
      FOREIGN KEY ("target_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_ratings"
      DROP CONSTRAINT "FK_user_ratings_target"
    `);

    await queryRunner.query(`
      ALTER TABLE "user_ratings"
      DROP CONSTRAINT "FK_user_ratings_author"
    `);

    await queryRunner.query(`
      DROP TABLE "user_ratings"
    `);
  }
}
