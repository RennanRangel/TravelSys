using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoHotelAviao.Migrations
{
    /// <inheritdoc />
    public partial class AddTripTypeToFlights : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TripType",
                table: "Flights",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TripType",
                table: "Flights");
        }
    }
}
