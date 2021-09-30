import {MigrationInterface, QueryRunner} from "typeorm";

export class QuestionCreate1633007153207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`CREATE TABLE IF NOT EXISTS "Question"
        (
            id "uuid" NOT NULL,
            question "text" NOT NULL,
            answer "text" NOT NULL,
            CONSTRAINT "QuestionAnswer_pkey" PRIMARY KEY (id)
        )`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
