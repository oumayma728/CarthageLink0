using CarthageLink.Server.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CarthageLink.Server.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(User user);
    }

    public class TokenService(IConfiguration configuration) : ITokenService
    {
        private readonly IConfiguration _configuration = configuration;

        public string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id!),
                new Claim(JwtRegisteredClaimNames.Email, user.Email), //username
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); 

            var expirationMinutes = double.Parse(_configuration["Jwt:ExpirationMinutes"]!);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(expirationMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
