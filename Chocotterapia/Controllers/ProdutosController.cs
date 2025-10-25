using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Chocotterapia.Data;
using Chocotterapia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produtos>>> GetProdutos()
        {
            var produtos = await _appDbContext.Produtos.ToListAsync();

            return Ok(produtos);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Produtos>> GetProduto(int id)
        {
            var produto = await _appDbContext.Produtos.FindAsync();

            if (produto == null)
            {
                return NotFound("Produto não encontrado!");
            }

            return Ok(produto);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduto(int id, [FromBody] Produtos produtosAtualizado)
        {
            var produtosExistente = await _appDbContext.Produtos.FindAsync(id);


            if (produtosExistente == null)
            {
                return NotFound("Produto não encontrado!");
            }

            _appDbContext.Entry(produtosExistente).CurrentValues.SetValues(produtosAtualizado);
            await _appDbContext.SaveChangesAsync();

            return StatusCode(201, produtosExistente);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduto(int id)
        {
            var produtos = await _appDbContext.Produtos.FindAsync(id);


            if (produtos == null)
            {
                return NotFound("Produto não encontrado!");
            }

            _appDbContext.Produtos.Remove(produtos);
            await _appDbContext.SaveChangesAsync();

            return Ok("Produto deletado com sucesso !");
        }



    }
}