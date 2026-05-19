import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlaceFieldEvent1779145812899 implements MigrationInterface {
    name = 'AddPlaceFieldEvent1779145812899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "place" text`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "is_deleted" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "is_deleted" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "place"`);
    }

}
