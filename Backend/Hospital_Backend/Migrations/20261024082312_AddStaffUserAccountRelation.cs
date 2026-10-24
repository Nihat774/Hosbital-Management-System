using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hospital_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffUserAccountRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserAccountId",
                table: "Staff",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Staff_UserAccountId",
                table: "Staff",
                column: "UserAccountId",
                unique: true,
                filter: "[UserAccountId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_UserAccounts_UserAccountId",
                table: "Staff",
                column: "UserAccountId",
                principalTable: "UserAccounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Staff_UserAccounts_UserAccountId",
                table: "Staff");

            migrationBuilder.DropIndex(
                name: "IX_Staff_UserAccountId",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "UserAccountId",
                table: "Staff");
        }
    }
}
