﻿using Microsoft.AspNetCore.Http;
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
    public class PatchController : ControllerBase
    {
        private readonly QuiltiContext _context;
        public PatchController(QuiltiContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<Patch> Get()
        {
            var incomingImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAH0AfQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhABAQEAAAAAAAAAAAAAAAAAAAER/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABsRAQEBAQADAQAAAAAAAAAAAAABETESIUEC/9oADAMBAAIRAxEAPwACWh1RnTRcrQzpoZWhnVgYoAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzWmaLOgCNAACxFgl4oaarIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzWmaLOgCNIA0yKihQBUaAZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmtJgsQXDEXYyKNJqKAACo0AyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQoMgNAAAADQDIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACImteLQiqlmAAgAAAAAAAAAACaLJqiImr4tCAYqaIEi6rKhYoCsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACKiNRABoWIBfbSIGpkaEBMUQVMURQswAEAQCoqI6QAAUUZtRFQWAArQiqxQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAEa+CKgsoAKAoCgrGoKiLKABVAVkZWojc4ACigJVQBJEAGgUEtxQFYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASizoAjQIoZiKKJqKgGaogqYoAgioLPYqKFEUCXGVUTF8kFQNQAaFRYJbhigrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlVBYAI0iiiWgCsoKgsoAiqIqpeiKgQVFCgAgAAgiNyYAoooKxboAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIqI1AAVQFYoAAAAAAigsuIAjSiGqzlUAQABkVEdBYjQlvoAVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBUF+KIIuKMtKlmAJRFEii2YACAAJUaRGpfgAKokVWaGAIAAAAAAACgAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAioKAqLqKCpboAIAAAAAAAAgojWoAKoCsAAAAAgLigCAAIoCgAgCCqIoAAgIC5VAEAAAAAAAAAAAAAAAAAAAABBGsUBWQAAAAAAAAAAABFZStRVZWC2elAVgABFAXQAQAAAAAARUFAUEARQAUVFVmgAgAAAAAAAAAAAAAAAAACAI3oqKrNABAAAAAAAAAEFk01ARrMUAPqKiiqArmAAAAAAAAAAAAAAAAgoLoAIAAAAAAAAAAAAAAAAAAAAIoLoIaGVQBAAAAAAAABlpErX5QAaUATQFEtEVBIADSiKrNgIoYACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJQggI6LFRVYvQAQAAAAAAABMUA2iKCgAgACCiNagqBugACoKigCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACKCxkURsVFVigAgAAAAAAAAAAioLBUEVQFZAAAAQUF0QEUADFEVUoAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAgqI1OKArIAAAAAAAAAAAAigsQBFiiKqWAAgAAAAACIojcFQEqgKyAAAAAAAAAAAAAAAAAAAAAAAAAAAAggjeKqKrNgAICaouUAEAAAAAAAAEqgs9IKiLugAtFQVlQBARRUFEWVFBUtABAAAAAAAAAAAAAAAAAAAAAAAAAABFZStfkAGhplRLNVlUCTAAVoSKrnegAAAAAAAAAAACKC6ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACKCy4yLhiNbEFA1BcA2IooWgCsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z";

            //var oldTest = new Patch()
            //{
            //    CreatorIp = incomingImage

            //};

            //var leftie = _context.Patches.First(x => x.CreatorIp == "Im left");
            //var upper = new Patch()
            //{
            //    CreatorIp = "im upper"
            //};

            //var center = new Patch()
            //{
            //    CreatorIp = "hi im center",
            //    WestPatch = leftie,
            //    NorthPatch = upper
            //};


            //_context.Patches.Add(upper);
            //_context.Patches.Add(center);
            //await _context.SaveChangesAsync();

            //var base64 = incomingImage[(incomingImage.IndexOf(',') + 1)..];
            //var binary = Convert.FromBase64String(base64);

            var newPatch = new Patch()
            {
                CreatorIp = incomingImage,
                ImageMini = incomingImage
            };

            //_context.Patches.Add(newPatch);
            //_context.SaveChanges();

            //var a = 1;

            //var arr = new byte[1];
            //arr[0] = 5;
            //var newPatchImage = new PatchImage()
            //{
            //    Patch = newPatch,
            //    Image = arr
            //};
            //_context.PatchImages.Add(newPatchImage);



            return newPatch;
        }

        [HttpPost]
        public async Task<Patch> Post(PatchRequest patchRequest)
        {
            var creatorIp = HttpContext.Connection.RemoteIpAddress.ToString();

            var newPatch = new Patch()
            {
                CreatorIp = creatorIp,
                ImageMini = patchRequest.ImageMini
            };

            await _context.Patches.AddAsync(newPatch);
            await _context.SaveChangesAsync();

            var newPatchImage = new PatchImage()
            {
                Patch = newPatch,
                Image = patchRequest.Image
            };

            await _context.PatchImages.AddAsync(newPatchImage);
            await _context.SaveChangesAsync();

            //Now we simulate it coming back down from the db in the GET
            var returnPatch = _context.Patches.First(p => p.PatchId == newPatch.PatchId);

            // Probs wont have to do this in reality but I think EF has some kind of memory causing it tot keep the PatchImage
            returnPatch.PatchImage = null;

            return returnPatch;
        }
    }
}
