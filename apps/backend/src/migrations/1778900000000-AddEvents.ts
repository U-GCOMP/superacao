import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEvents1778900000000 implements MigrationInterface {
  name = 'AddEvents1778900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(
      `CREATE TYPE "public"."events_status_enum"
      AS ENUM('SCHEDULED', 'COMPLETED', 'CANCELED')`,
    );

    await queryRunner.query(
      `CREATE TABLE "events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text,
        "place" text,
        "date" TIMESTAMP NOT NULL,
        "status" "public"."events_status_enum"
          NOT NULL DEFAULT 'SCHEDULED',
        "volunteers_subscription_deadline_date" TIMESTAMP NOT NULL,
        "volunteers_max" integer NOT NULL DEFAULT 0,
        "volunteers_count" integer NOT NULL DEFAULT 0,
        "rating_sum" real NOT NULL DEFAULT 0,
        "rating_count" integer NOT NULL DEFAULT 0,
        "imageUrl" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "user_id" integer NOT NULL,

        CONSTRAINT "PK_40731c7151fe4be3116e45ddf73"
          PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "events"
      ADD CONSTRAINT "FK_09f256fb7f9a05f0ed9927f406b"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events"
      DROP CONSTRAINT "FK_09f256fb7f9a05f0ed9927f406b"`,
    );

    await queryRunner.query(`DROP TABLE "events"`);

    await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
  }
}
