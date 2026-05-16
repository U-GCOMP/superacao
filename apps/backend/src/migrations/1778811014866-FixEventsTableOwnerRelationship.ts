import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixEventsTableOwnerRelationship1778811014866 implements MigrationInterface {
  name = 'FixEventsTableOwnerRelationship1778811014866';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" RENAME COLUMN "owner_id" TO "user_id"`,
    );
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD "user_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_09f256fb7f9a05f0ed9927f406b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_09f256fb7f9a05f0ed9927f406b"`,
    );
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "events" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "events" RENAME COLUMN "user_id" TO "owner_id"`,
    );
  }
}
