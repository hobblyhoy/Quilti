using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quilti.Migrations
{
    public partial class patch4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedDate",
                table: "PatchImages",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastModifiedDate",
                table: "PatchImages",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ObjectStatus",
                table: "PatchImages",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "PatchImages");

            migrationBuilder.DropColumn(
                name: "LastModifiedDate",
                table: "PatchImages");

            migrationBuilder.DropColumn(
                name: "ObjectStatus",
                table: "PatchImages");
        }
    }
}
