using Microsoft.EntityFrameworkCore;
using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.DAL
{
    public class QuiltiContext : DbContext
    {
        public DbSet<Patch> Patches { get; set; }
        public QuiltiContext(DbContextOptions<QuiltiContext> options) : base(options)
        {

        }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    //modelBuilder.Entity<Patch>()
        //    //    .HasOne(p => p.NorthPatch)
        //    //    .WithOne(p => p)
        //    //    .HasForeignKey<Patch>(b => b.NorthPatchId);

        //    //modelBuilder.Entity<Patch>()
        //    //    .HasOne(p => p.SouthPatch)
        //    //    .WithOne(p => p.)
        //    //    .HasForeignKey<Patch>(b => b.SouthPatchId);
        //}
    }
}
