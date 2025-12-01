import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnDeleteCascade1764568296689 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "columns" DROP CONSTRAINT "columns_fk3";
        ALTER TABLE "cards" DROP CONSTRAINT "cards_fk3";
        ALTER TABLE "comments" DROP CONSTRAINT "comments_fk2";
        ALTER TABLE "comments" DROP CONSTRAINT "comments_fk4";

        ALTER TABLE "columns"
          ADD CONSTRAINT "columns_user_fk"
            FOREIGN KEY ("user_id")
              REFERENCES "users"("id")
              ON DELETE CASCADE;

        ALTER TABLE "cards"
          ADD CONSTRAINT "cards_column_fk"
            FOREIGN KEY ("column_id")
              REFERENCES "columns"("id")
              ON DELETE CASCADE;

        ALTER TABLE "comments"
          ADD CONSTRAINT "comments_card_fk"
            FOREIGN KEY ("card_id")
              REFERENCES "cards"("id")
              ON DELETE CASCADE;

        ALTER TABLE "comments"
          ADD CONSTRAINT "comments_user_fk"
            FOREIGN KEY ("user_id")
              REFERENCES "users"("id")
              ON DELETE CASCADE;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "columns" DROP CONSTRAINT "columns_user_fk";
      ALTER TABLE "cards" DROP CONSTRAINT "cards_column_fk";
      ALTER TABLE "comments" DROP CONSTRAINT "comments_card_fk";
      ALTER TABLE "comments" DROP CONSTRAINT "comments_user_fk";

      ALTER TABLE "columns" ADD CONSTRAINT "columns_fk3" FOREIGN KEY ("user_id") REFERENCES "users"("id");
      ALTER TABLE "cards" ADD CONSTRAINT "cards_fk3" FOREIGN KEY ("column_id") REFERENCES "columns"("id");
      ALTER TABLE "comments" ADD CONSTRAINT "comments_fk2" FOREIGN KEY ("card_id") REFERENCES "cards"("id");
      ALTER TABLE "comments" ADD CONSTRAINT "comments_fk4" FOREIGN KEY ("user_id") REFERENCES "users"("id");
      `);
  }
}
