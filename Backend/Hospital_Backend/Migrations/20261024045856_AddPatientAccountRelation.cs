using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hospital_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientAccountRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserAccountId",
                table: "Patient",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patient_UserAccountId",
                table: "Patient",
                column: "UserAccountId",
                unique: true,
                filter: "[UserAccountId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Patient_UserAccounts_UserAccountId",
                table: "Patient",
                column: "UserAccountId",
                principalTable: "UserAccounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Patient_UserAccounts_UserAccountId",
                table: "Patient");

            migrationBuilder.DropIndex(
                name: "IX_Patient_UserAccountId",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "UserAccountId",
                table: "Patient");
        }
    }
}
