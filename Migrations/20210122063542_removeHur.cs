using Microsoft.EntityFrameworkCore.Migrations;

namespace Quilti.Migrations
{
    public partial class removeHur : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HurDur",
                table: "Patches");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HurDur",
                table: "Patches",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
