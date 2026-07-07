import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1783438095791 implements MigrationInterface {
    name = 'InitialSchema1783438095791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "affectedEntity" character varying(100) NOT NULL, "entityId" uuid NOT NULL, "action" "public"."audit_logs_action_enum" NOT NULL, "dataBefore" jsonb, "dataAfter" jsonb, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "sourceIp" character varying(45), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b054efb3457218f87473bc297f" ON "audit_logs"  ("affectedEntity") `);
        await queryRunner.query(`CREATE INDEX "IDX_f23279fad63453147a8efb46cf" ON "audit_logs"  ("entityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_88dcc148d532384790ab874c3d" ON "audit_logs"  ("timestamp") `);
        await queryRunner.query(`CREATE TABLE "managing_units" ("id" uuid NOT NULL, "name" character varying(255) NOT NULL, "acronym" character varying(20) NOT NULL, "type" "public"."managing_units_type_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7a1790b7e199a8ee8bd564e5ea4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_152b486e74eda0260234c280e4" ON "managing_units"  ("acronym") `);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL, "registrationNumber" character varying(20) NOT NULL, "notaryOffice" character varying(255) NOT NULL, "notarialDescription" text NOT NULL, "addressStreet" character varying(255) NOT NULL, "addressNumber" character varying(20) NOT NULL, "addressNeighborhood" character varying(100) NOT NULL, "addressZipCode" character varying(9) NOT NULL, "addressReference" character varying(255), "totalArea" numeric(12,2) NOT NULL, "builtArea" numeric(12,2) NOT NULL, "geolocation" geometry(Point,4326) NOT NULL, "managingUnitId" uuid NOT NULL, "budgetUnit" character varying(100), "usageCategory" "public"."properties_usagecategory_enum" NOT NULL, "possessionType" "public"."properties_possessiontype_enum" NOT NULL, "contractStartDate" TIMESTAMP WITH TIME ZONE, "contractEndDate" TIMESTAMP WITH TIME ZONE, "contractMonthlyValue" numeric(12,2), "contractReferenceValue" numeric(12,2), "contractGrantor" character varying(255), "contractLessor" character varying(255), "contractAdministrativeProcessNumber" character varying(100), "acquisitionYear" integer NOT NULL, "originalValue" numeric(14,2) NOT NULL, "accumulatedDepreciation" numeric(14,2) NOT NULL, "publicPurpose" text NOT NULL, "status" "public"."properties_status_enum" NOT NULL, "createdById" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cecf1a1491355bf57756101969" ON "properties"  ("registrationNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_bb0e4924199f47872ca6fe193b" ON "properties" USING gist ("geolocation") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "name" character varying(255) NOT NULL, "employeeNumber" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users"  ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb0e4924199f47872ca6fe193b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cecf1a1491355bf57756101969"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_152b486e74eda0260234c280e4"`);
        await queryRunner.query(`DROP TABLE "managing_units"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88dcc148d532384790ab874c3d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f23279fad63453147a8efb46cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b054efb3457218f87473bc297f"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }

}
