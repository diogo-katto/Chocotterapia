using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Chocotterapia.Data;
using Chocotterapia.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chocotterapia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public ProdutosController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public async Task<IActionResult> AddProduto(Produtos produtos)
        {
            _appDbContext.Produtos.Add(produtos);
            await _appDbContext.SaveChangesAsync();

            return Ok(produtos);
        }
    }
}