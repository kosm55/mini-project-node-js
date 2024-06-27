import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseEntiies1719520210881 implements MigrationInterface {
    name = 'AddBaseEntiies1719520210881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_posts" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_posts" ADD CONSTRAINT "FK_5f8f822a6546af748814f1a2eab" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_posts" DROP CONSTRAINT "FK_5f8f822a6546af748814f1a2eab"`);
        await queryRunner.query(`ALTER TABLE "car_posts" DROP COLUMN "user_id"`);
    }

}
