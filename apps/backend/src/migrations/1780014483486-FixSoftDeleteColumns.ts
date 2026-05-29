import { MigrationInterface, QueryRunner } from "typeorm";

export class FixSoftDeleteColumns1780014483486 implements MigrationInterface {
    name = 'FixSoftDeleteColumns1780014483486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_ratings" DROP CONSTRAINT "FK_user_ratings_author"`);
        await queryRunner.query(`ALTER TABLE "user_ratings" DROP CONSTRAINT "FK_user_ratings_target"`);
        await queryRunner.query(`ALTER TABLE "event_ratings" DROP CONSTRAINT "FK_event_ratings_author"`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" DROP CONSTRAINT "FK_event_volunteers_event"`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" DROP CONSTRAINT "FK_event_volunteers_user"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "is_deleted" TO "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_ratings" ADD CONSTRAINT "FK_e02ba31a570375fd72a9d128ba0" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_ratings" ADD CONSTRAINT "FK_5c6bf8104eafddf87db9319b8ac" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_ratings" ADD CONSTRAINT "FK_c9995fb94e3807a09010350aef5" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" ADD CONSTRAINT "FK_5b1c714378c002f25f3c813f2d9" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" ADD CONSTRAINT "FK_1e3561228d3a8a4908e03c814d4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_volunteers" DROP CONSTRAINT "FK_1e3561228d3a8a4908e03c814d4"`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" DROP CONSTRAINT "FK_5b1c714378c002f25f3c813f2d9"`);
        await queryRunner.query(`ALTER TABLE "event_ratings" DROP CONSTRAINT "FK_c9995fb94e3807a09010350aef5"`);
        await queryRunner.query(`ALTER TABLE "user_ratings" DROP CONSTRAINT "FK_5c6bf8104eafddf87db9319b8ac"`);
        await queryRunner.query(`ALTER TABLE "user_ratings" DROP CONSTRAINT "FK_e02ba31a570375fd72a9d128ba0"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "deleted_at" TO "is_deleted"`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" ADD CONSTRAINT "FK_event_volunteers_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_volunteers" ADD CONSTRAINT "FK_event_volunteers_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_ratings" ADD CONSTRAINT "FK_event_ratings_author" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_ratings" ADD CONSTRAINT "FK_user_ratings_target" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_ratings" ADD CONSTRAINT "FK_user_ratings_author" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
