using System.ComponentModel.DataAnnotations;

namespace CarthageLink.Server.Models
{
    public class LogInModel
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        //[MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
        ErrorMessage = "Password must be at least 8 characters long and contain at least one letter and one number.")]
        public required string Password { get; set; }


    }
}
