import {MigrationInterface, QueryRunner} from "typeorm";

export class UserCreate1633006978788 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`CREATE TABLE IF NOT EXISTS "User"
            (
                id "uuid" NOT NULL,
                slackId "text" NOT NULL,
                "teamId" "uuid" NOT NULL,,
                "score" "int" NOT NULL DEFAULT 0,
                CONSTRAINT "User_pkey" PRIMARY KEY (id)
            )`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
