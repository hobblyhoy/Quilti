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
    public class PatchController : ControllerBase
    {
        private readonly QuiltiContext _context;
        public PatchController(QuiltiContext context)
        {
            _context = context;
        }

        [HttpGet]

        // Important note! I've decided to abandon this method. I had a big long think and decided
        // while I certainly could do it this way and it certainly has its advantages
        // It's more condusive to my end goal and allows for more expansion if I'm assembling my 
        // Grid on the frontend instead.

        //public async Task GetBulk(int viewportWidth, int viewportHeight, int imageSize)
        {
            // Find our starting patch, first one with a missing neighbor
            // and not reserved
            var startingPatch = _context.Patches.First(x => x.NorthPatchId == null || x.EastPatchId == null || x.SouthPatchId == null || x.WestPatchId == null);


        // do the math on what our grid will look like
        var buttonBuffer = 2 * 20; //2 buttons, 20 pixels each
        var columnCount = (viewportWidth - buttonBuffer) / imageSize; //Intentionally collapses float down to an int
        var rowCount = (viewportHeight - buttonBuffer) / imageSize; //Intentionally collapses float down to an int

        // Initialize the grid
        var patches2D = new Patch[columnCount, rowCount];
        var checkedAllDirections2D = new bool[columnCount, rowCount];

            // Insert our initial item
            if (startingPatch.NorthPatchId == null)
            {
                //insert into row number 2 (unless there only one row), middle column
                var rowToInsert = rowCount > 1 ? 1 : 0;
        var columnToInsert = columnCount / 2; //Intentionally collapses float down to an int
        patches2D[rowToInsert, columnToInsert] = startingPatch;
            }
            else
            {
                throw new Exception("not implemented");
}

            // Fill the grid


        }

        public void FillGrid(Patch[,] patches2D, bool[,] checkedAllDirections2D)
{

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
