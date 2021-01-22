﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quilti.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Patches",
                columns: table => new
                {
                    PatchId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NorthPatchId = table.Column<int>(type: "int", nullable: true),
                    SouthPatchId = table.Column<int>(type: "int", nullable: true),
                    CreatorIp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HurDur = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LastModifiedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    ObjectStatus = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patches", x => x.PatchId);
                    table.ForeignKey(
                        name: "FK_Patches_Patches_NorthPatchId",
                        column: x => x.NorthPatchId,
                        principalTable: "Patches",
                        principalColumn: "PatchId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Patches_Patches_SouthPatchId",
                        column: x => x.SouthPatchId,
                        principalTable: "Patches",
                        principalColumn: "PatchId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Patches_NorthPatchId",
                table: "Patches",
                column: "NorthPatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Patches_SouthPatchId",
                table: "Patches",
                column: "SouthPatchId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Patches");
        }
    }
}
