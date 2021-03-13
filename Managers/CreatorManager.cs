using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Quilti.DAL;
using Quilti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quilti.Managers
{
    public class CreatorManager
    {
        public static Creator GetCreaterInfo(QuiltiContext context, IMemoryCache cache, string creatorIp)
        {
            var creatorInfo = cache.GetOrCreate($"CreatorIp_{creatorIp}", entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromHours(1);
                return context.CreatorInfo.AsNoTracking().FirstOrDefault(c => c.CreatorIp == creatorIp);
            });
            return creatorInfo;
        }

        public static bool UserHasHitCreateCap(QuiltiContext context, IMemoryCache cache, string creatorIp)
        {
            var creatorInfo = GetCreaterInfo(context, cache, creatorIp);
            if (creatorInfo != null)
            {
                if (creatorInfo.IsBanned) return true;
                if (creatorInfo.IsUnrestricted) return false;
            }

            var oneHourAgo = DateTimeOffset.Now.AddHours(-1);
            var usersRecentPatches = context.Patches.Where(p => p.CreatorIp == creatorIp && p.LastModifiedDate > oneHourAgo).ToList();
            return usersRecentPatches.Count > 4;
        }

        public static async Task BanUser(QuiltiContext context, IMemoryCache cache, string creatorIp)
        {
            var creatorInfo = GetCreaterInfo(context, cache, creatorIp);

            if (creatorInfo == null)
            {
                var newBannedUser = new Creator()
                {
                    CreatorIp = creatorIp,
                    IsBanned = true,
                    IsUnrestricted = false
                };

                context.CreatorInfo.Add(newBannedUser);
                await context.SaveChangesAsync();

                cache.Remove($"CreatorIp_{creatorIp}");
            }
        }
    }
}
