using System.ComponentModel.DataAnnotations;

namespace CarthageLink.Server.Models
{
    public class RegisterModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Phone { get; set; }
        [Required]
        public string LicenseKey { get; set; }
    }
}
