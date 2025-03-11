using Microsoft.AspNetCore.Mvc;
using CarthageLink.Server.Models;
using CarthageLink.Server.Services;

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestJwtController(ITokenService tokenService) : Controller
    {

        [HttpPost("jwt")]
        public IActionResult GenerateJwt([FromBody] User user)
        {
            try
            {
                var token = tokenService.GenerateJwtToken(user);
                return Ok(new { Token = token });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
