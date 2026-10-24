using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hospital_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorUserAccountRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserAccountId",
                table: "Doctors",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_UserAccountId",
                table: "Doctors",
                column: "UserAccountId",
                unique: true,
                filter: "[UserAccountId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Doctors_UserAccounts_UserAccountId",
                table: "Doctors",
                column: "UserAccountId",
                principalTable: "UserAccounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Doctors_UserAccounts_UserAccountId",
                table: "Doctors");

            migrationBuilder.DropIndex(
                name: "IX_Doctors_UserAccountId",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "UserAccountId",
                table: "Doctors");
        }
    }
}
