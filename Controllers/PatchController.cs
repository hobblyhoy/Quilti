using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatchController : ControllerBase
    {
        public PatchController() { }

        [HttpGet]
        public Patch Get()
        {
            var a = new Patch()
            {
                PatchId = 1,
                CreatorIp = "123"
            };
            return a;
        }

        [HttpPost]
        public void Post()
        {
            //TODO
        }
    }
}
