import {MigrationInterface, QueryRunner} from "typeorm";

export class TeamCreate1633006800047 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`CREATE TABLE IF NOT EXISTS "team"
            (
                id "uuid" NOT NULL,
                "teamName" "text" NOT NULL,
                "score" "int" NOT NULL,
                CONSTRAINT "Team_pkey" PRIMARY KEY (id)
            )`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
