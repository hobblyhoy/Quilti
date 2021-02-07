using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quilti.Migrations
{
    public partial class patch_21084 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CreatorInfo",
                columns: table => new
                {
                    CreatorIp = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsBanned = table.Column<bool>(type: "bit", nullable: false),
                    IsUnrestricted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LastModifiedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    ObjectStatus = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CreatorInfo", x => x.CreatorIp);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CreatorInfo");
        }
    }
}
