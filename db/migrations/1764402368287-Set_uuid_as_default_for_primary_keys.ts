import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetUuidAsDefaultForPrimaryKeys1764402368287
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

      ALTER TABLE "columns"
      ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

      ALTER TABLE "cards"
      ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

      ALTER TABLE "comments"
      ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "id" DROP DEFAULT;

      ALTER TABLE "columns"
      ALTER COLUMN "id" DROP DEFAULT;

      ALTER TABLE "cards"
      ALTER COLUMN "id" DROP DEFAULT;

      ALTER TABLE "comments"
      ALTER COLUMN "id" DROP DEFAULT;
    `);
  }
}
