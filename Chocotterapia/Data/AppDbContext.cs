
using Microsoft.EntityFrameworkCore;
using Chocotterapia.Models;

namespace Chocotterapia.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Produtos> Produtos { get; set; }
       
    }
}