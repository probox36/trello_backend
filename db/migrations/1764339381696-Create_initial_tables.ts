import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1764339381696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "users" (
                                             "id" uuid NOT NULL UNIQUE,
                                             "email" varchar NOT NULL,
                                             "password" varchar NOT NULL,
                                             PRIMARY KEY ("id")
          );

        CREATE TABLE IF NOT EXISTS "columns" (
                                               "id" uuid NOT NULL UNIQUE,
                                               "title" varchar NOT NULL,
                                               "order" bigint NOT NULL DEFAULT '0',
                                               "user_id" uuid NOT NULL,
                                               PRIMARY KEY ("id")
          );

        CREATE TABLE IF NOT EXISTS "cards" (
                                             "id" uuid NOT NULL UNIQUE,
                                             "title" varchar NOT NULL,
                                             "order" bigint NOT NULL,
                                             "column_id" uuid NOT NULL,
                                             "content" varchar NOT NULL,
                                             PRIMARY KEY ("id")
          );

        CREATE TABLE IF NOT EXISTS "comments" (
                                                "id" uuid NOT NULL UNIQUE,
                                                "content" varchar NOT NULL,
                                                "card_id" uuid NOT NULL,
                                                "order" bigint NOT NULL DEFAULT '0',
                                                "user_id" uuid NOT NULL,
                                                PRIMARY KEY ("id")
          );


        ALTER TABLE "columns" ADD CONSTRAINT "columns_fk3" FOREIGN KEY ("user_id") REFERENCES "users"("id");
        ALTER TABLE "cards" ADD CONSTRAINT "cards_fk3" FOREIGN KEY ("column_id") REFERENCES "columns"("id");
        ALTER TABLE "comments" ADD CONSTRAINT "comments_fk2" FOREIGN KEY ("card_id") REFERENCES "cards"("id");
        ALTER TABLE "comments" ADD CONSTRAINT "comments_fk4" FOREIGN KEY ("user_id") REFERENCES "users"("id");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "comments_fk2";
        `);
    await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "comments_fk4";
        `);
    await queryRunner.query(`
            ALTER TABLE "cards" DROP CONSTRAINT "cards_fk3";
        `);
    await queryRunner.query(`
            ALTER TABLE "columns" DROP CONSTRAINT "columns_fk3";
        `);

    await queryRunner.query(`
            DROP TABLE "comments";
        `);
    await queryRunner.query(`
            DROP TABLE "cards";
        `);
    await queryRunner.query(`
            DROP TABLE "columns";
        `);
    await queryRunner.query(`
            DROP TABLE "users";
        `);
  }
}
