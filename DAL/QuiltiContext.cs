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
    }
}
