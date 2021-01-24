using Microsoft.EntityFrameworkCore;
using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Z.EntityFramework.Plus;

namespace Quilti.DAL
{
    public class QuiltiContext : DbContext
    {
        public QuiltiContext(DbContextOptions<QuiltiContext> options) : base(options)
        {
            this.Filter<EntityBase>(q => q.Where(x => x.ObjectStatus != ObjectStatus.Deleted));
        }

        public DbSet<Patch> Patches { get; set; }
        public DbSet<PatchImage> PatchImages { get; set; }

        // Base overrides
        public void AddTimestampsAndStatusCode()
        {
            var objectStateEntries = ChangeTracker.Entries()
                .Where(e => e.Entity is EntityBase && (e.State == EntityState.Modified || e.State == EntityState.Added))
                .ToList();

            var currentDateTimeOffset = DateTimeOffset.Now;

            foreach (var entry in objectStateEntries)
            {
                var entityBase = entry.Entity as EntityBase;

                if (entry.State == EntityState.Added)
                {
                    entityBase.CreatedDate = currentDateTimeOffset;
                    entityBase.ObjectStatus = ObjectStatus.Active;
                }

                entityBase.LastModifiedDate = currentDateTimeOffset;
            }
        }

        public override int SaveChanges()
        {
            AddTimestampsAndStatusCode();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            AddTimestampsAndStatusCode();
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //// Patch \\\\
            modelBuilder.Entity<Patch>().HasKey("PatchId");
            modelBuilder.Entity<Patch>().Property("CreatorIp").IsRequired();

            // Option 1
            //modelBuilder.Entity<Patch>()
            //   .HasOne(x => x.NorthPatch)
            //   .WithOne(x => x.SouthPatch)
            //   .HasForeignKey(typeof(Patch), "NorthPatchId");
            //modelBuilder.Entity<Patch>()
            //   .HasOne(x => x.EastPatch)
            //   .WithOne(x => x.WestPatch)
            //   .HasForeignKey(typeof(Patch), "EastPatchId");

            // Option 2...
            modelBuilder.Entity<Patch>()
                .HasOne(x => x.NorthPatch)
                .WithOne()
                .HasForeignKey(typeof(Patch), "NorthPatchId");

            modelBuilder.Entity<Patch>()
                .HasOne(x => x.SouthPatch)
                .WithOne()
                .HasForeignKey(typeof(Patch), "SouthPatchId");

            modelBuilder.Entity<Patch>()
                .HasOne(x => x.EastPatch)
                .WithOne()
                .HasForeignKey(typeof(Patch), "EastPatchId");

            modelBuilder.Entity<Patch>()
                .HasOne(x => x.WestPatch)
                .WithOne()
                .HasForeignKey(typeof(Patch), "WestPatchId");




            //// Patch Image \\\\
            modelBuilder.Entity<PatchImage>().HasKey("PatchImageId");
            modelBuilder.Entity<PatchImage>().Property("Image").IsRequired();

            modelBuilder.Entity<Patch>()
                .HasOne(p => p.PatchImage)
                .WithOne(pi => pi.Patch)
                .HasForeignKey(typeof(PatchImage), "PatchId");
        }
    }
}
