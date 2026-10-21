using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hospital_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet("public")]
        [AllowAnonymous]
        public IActionResult Public()
        {
            return Ok(new {message="Bu endpoint kerkese açıktır"});

        }
        [HttpGet("patient")]
        [Authorize(Roles = "Patient")]
        public IActionResult Patient() {
            return Ok(new { message = "Hasta yetkilendirmesi başarılı" });
        }

        [HttpGet("manager")]
        [Authorize(Roles = "Manager")]
        public IActionResult Manager() {
            return Ok(new { message = "Müdür yetkilendirmesi başarılı" });
        
        }
    }
}
