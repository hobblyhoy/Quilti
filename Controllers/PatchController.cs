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
    public class PatchController : ControllerBase
    {
        private readonly QuiltiContext _context;
        private readonly IMemoryCache _cache;

        public PatchController(QuiltiContext context, IMemoryCache memoryCache)
        {
            _context = context;
            _cache = memoryCache;
        }

        [HttpGet]
        public async Task<PatchGetResponseDto> Get()
        {
            // With no ID provided we're just seeking out the next logical block to return as a starting point
            return new PatchGetResponseDto(PatchManager.GetNextAvailablePatch(_context));
        }

        [HttpGet("{patchId}")]
        public async Task<PatchGetResponseDto> Get(string patchId)
        {
            return new PatchGetResponseDto(PatchManager.GetPatch(_context, _cache, patchId));
        }

        [HttpPost("{patchId}")]
        public async Task<ActionResult<string>> Post(string patchId)
        {
            var creatorIp = HttpContext.Connection.RemoteIpAddress.ToString();
            if (PatchManager.UserHasHitCreateCap(_context, creatorIp)) return Forbid();
            if (PatchManager.PatchExists(_context, patchId)) return Conflict();

            return await PatchManager.ReservePatch(_context, creatorIp, patchId);
        }

        [HttpPatch]
        public async Task<ActionResult<Patch>> Patch(PatchPatchRequestDto requestDto) // lol
        {
            var creatorIp = HttpContext.Connection.RemoteIpAddress.ToString();
            if (!PatchManager.PatchExists(_context, requestDto.PatchId)) return Conflict();
            if (PatchManager.UserHasHitCreateCap(_context, creatorIp)) return Forbid();

            var patch = PatchManager.GetPatch(_context, _cache, requestDto.PatchId);
            if (patch.CreatorIp != creatorIp) return Forbid();

            return await PatchManager.CompletePatch(_context, patch, requestDto.ImageMini, requestDto.Image);
        }
    }
}
