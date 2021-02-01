using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Quilti.DAL;
using Quilti.Dtos;
using Quilti.Managers;
using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatchGroupController : ControllerBase
    {
        private readonly QuiltiContext _context;
        private readonly IMemoryCache _cache;

        public PatchGroupController(QuiltiContext context, IMemoryCache memoryCache)
        {
            _context = context;
            _cache = memoryCache;
        }

        [HttpGet("{leftX}/{rightX}/{topY}/{bottomY}")]
        public async Task<List<string>> Get(int leftX, int rightX, int topY, int bottomY)
        {
            return PatchManager.GetPatchIdsInRange(_context, leftX, rightX, topY, bottomY);
        }
    }
}
