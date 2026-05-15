import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEvent1778802953234 implements MigrationInterface {
  name = 'AddEvent1778802953234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."events_status_enum" AS ENUM('SCHEDULED', 'COMPLETED', 'CANCELED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "date" TIMESTAMP NOT NULL, "owner_id" uuid NOT NULL, "status" "public"."events_status_enum" NOT NULL DEFAULT 'SCHEDULED', "volunteers_subscription_deadline_date" TIMESTAMP NOT NULL, "volunteers_max" integer NOT NULL DEFAULT '0', "volunteers_count" integer NOT NULL DEFAULT '0', "rating_sum" integer NOT NULL DEFAULT '0', "rating_count" integer NOT NULL DEFAULT '0', "imageUrl" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
  }
}
