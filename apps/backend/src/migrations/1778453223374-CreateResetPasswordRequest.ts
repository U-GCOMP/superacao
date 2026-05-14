import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResetPasswordRequest1778453223374 implements MigrationInterface {
  name = 'CreateResetPasswordRequest1778453223374';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "password_reset_requests" ("id" SERIAL NOT NULL, "code" character varying(6) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_4aa83fc224280f3c94c3e214d65" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_requests" ADD CONSTRAINT "FK_8a8bf5831893c4b0c63f999c2d0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password_reset_requests" DROP CONSTRAINT "FK_8a8bf5831893c4b0c63f999c2d0"`,
    );
    await queryRunner.query(`DROP TABLE "password_reset_requests"`);
  }
}
