import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1781363784292 implements MigrationInterface {
    name = 'InitialDatabase1781363784292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_ratings" ("id" SERIAL NOT NULL, "target_id" integer NOT NULL, "author_id" integer NOT NULL, "rating" real NOT NULL, "comment" character varying, CONSTRAINT "PK_9de3e405c7a1a3a8ce4c0715993" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid NOT NULL, "author_id" integer NOT NULL, "category_id" integer NOT NULL, "rating" real NOT NULL, "comment" character varying, CONSTRAINT "PK_1a40669403a8ea520987fcb5396" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_volunteers" ("event_id" uuid NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_c25a66b656c0df4f0cec6b3da8d" PRIMARY KEY ("event_id", "user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."events_status_enum" AS ENUM('SCHEDULED', 'COMPLETED', 'CANCELED')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "place" text, "date" TIMESTAMP NOT NULL, "status" "public"."events_status_enum" NOT NULL DEFAULT 'SCHEDULED', "volunteers_subscription_deadline_date" TIMESTAMP NOT NULL, "volunteers_max" integer NOT NULL DEFAULT '0', "volunteers_count" integer NOT NULL DEFAULT '0', "rating_sum" double precision NOT NULL DEFAULT '0', "rating_count" integer NOT NULL DEFAULT '0', "imageUrl" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "bio" character varying, "deleted_at" TIMESTAMP, "rating_sum" real NOT NULL DEFAULT '0', "rating_count" integer NOT NULL DEFAULT '0', "imageUrl" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "password_reset_requests" ("id" SERIAL NOT NULL, "code" character varying(6) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_4aa83fc224280f3c94c3e214d65" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_ratings" ADD CONSTRAINT "FK_e02ba31a570375fd72a9d128ba0" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_ratings" ADD CONSTRAINT "FK_5c6bf8104eafddf87db9319b8ac" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_ratings" ADD CONSTRAINT "FK_c9995fb94e3807a09010350aef5" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_ratings" ADD CONSTRAINT "FK_b040edbf3fa45022e456098c4df" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" ADD CONSTRAINT "FK_5b1c714378c002f25f3c813f2d9" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" ADD CONSTRAINT "FK_1e3561228d3a8a4908e03c814d4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_09f256fb7f9a05f0ed9927f406b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_reset_requests" ADD CONSTRAINT "FK_8a8bf5831893c4b0c63f999c2d0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset_requests" DROP CONSTRAINT "FK_8a8bf5831893c4b0c63f999c2d0"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_09f256fb7f9a05f0ed9927f406b"`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" DROP CONSTRAINT "FK_1e3561228d3a8a4908e03c814d4"`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" DROP CONSTRAINT "FK_5b1c714378c002f25f3c813f2d9"`);
        await queryRunner.query(`ALTER TABLE "event_ratings" DROP CONSTRAINT "FK_b040edbf3fa45022e456098c4df"`);
        await queryRunner.query(`ALTER TABLE "event_ratings" DROP CONSTRAINT "FK_c9995fb94e3807a09010350aef5"`);
        await queryRunner.query(`ALTER TABLE "user_ratings" DROP CONSTRAINT "FK_5c6bf8104eafddf87db9319b8ac"`);
        await queryRunner.query(`ALTER TABLE "user_ratings" DROP CONSTRAINT "FK_e02ba31a570375fd72a9d128ba0"`);
        await queryRunner.query(`DROP TABLE "password_reset_requests"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
        await queryRunner.query(`DROP TABLE "event_volunteers"`);
        await queryRunner.query(`DROP TABLE "event_ratings"`);
        await queryRunner.query(`DROP TABLE "user_ratings"`);
    }

}
