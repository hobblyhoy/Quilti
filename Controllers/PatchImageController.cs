using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quilti.DAL;
using Quilti.Dtos;
using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatchImageController : ControllerBase
    {
        private readonly QuiltiContext _context;
        public PatchImageController(QuiltiContext context)
        {
            _context = context;
        }

        [HttpGet("{patchId}")]
        public async Task<string> Get(int patchId)
        {
            var query = _context.PatchImages.Where(p => p.Patch.PatchId == patchId);
            var queryString = query.ToQueryString();

            var patchImage = _context.PatchImages.First(p => p.Patch.PatchId == patchId);
            return patchImage.Image;
        }

        [HttpPost]
        public async Task Post()
        {

        }
    }
}
