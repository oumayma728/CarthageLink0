using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

namespace CarthageLink.Server.Models
{
    public class RegisterModel
    {
        public required string Name { get; set; }


        //[MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
        ErrorMessage = "Password must be at least 8 characters long and contain at least one letter and one number.")]
        public required string Password { get; set; }

        [EmailAddress]
        public required string Email { get; set; }

        [BsonElement("phone")]
        [RegularExpression(@"^\+\d{1,3}\s\d{8,15}$",
        ErrorMessage = "Invalid phone number format. Example: +216 53805335")]
        public string? Phone { get; set; }

        [MinLength(16, ErrorMessage = "Key must be at least 16 characters long.")]
        public required string LicenseKey { get; set; }

    }
}
