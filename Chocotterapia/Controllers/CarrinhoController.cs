using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Chocotterapia.Data;
using Chocotterapia.Models;

namespace Chocotterapia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarrinhoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarrinhoController(AppDbContext context)
        {
            _context = context;
        }

        // 📦 1. Listar todos os itens do carrinho
        [HttpGet]
        public async Task<IActionResult> GetCarrinhoItens()
        {
            var itens = await _context.CarrinhoItens
                .Include(i => i.Produto) // Inclui os dados do produto
                .ToListAsync();

            return Ok(itens);
        }

        // ➕ 2. Adicionar item ao carrinho
        [HttpPost("adicionar")]
        public async Task<IActionResult> AdicionarItem(int produtoId, int quantidade)
        {
            var produto = await _context.Produtos.FindAsync(produtoId);
            if (produto == null)
                return NotFound("Produto não encontrado.");

            // Verifica se já existe o item no carrinho
            var itemExistente = await _context.CarrinhoItens
                .FirstOrDefaultAsync(i => i.ProdutoId == produtoId);

            if (itemExistente != null)
            {
                itemExistente.Quantidade += quantidade;
                _context.CarrinhoItens.Update(itemExistente);
            }
            else
            {
                var novoItem = new CarrinhoItem
                {
                    ProdutoId = produtoId,
                    Quantidade = quantidade
                };
                _context.CarrinhoItens.Add(novoItem);
            }

            await _context.SaveChangesAsync();
            return Ok("Item adicionado ao carrinho.");
        }

        // 🗑️ 3. Remover um item do carrinho
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoverItem(int id)
        {
            var item = await _context.CarrinhoItens.FindAsync(id);
            if (item == null)
                return NotFound("Item não encontrado.");

            _context.CarrinhoItens.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // 🔄 4. Limpar o carrinho
        [HttpDelete("limpar")]
        public async Task<IActionResult> LimparCarrinho()
        {
            var itens = _context.CarrinhoItens;
            _context.CarrinhoItens.RemoveRange(itens);
            await _context.SaveChangesAsync();

            return Ok("Carrinho limpo.");
        }
    }
}
