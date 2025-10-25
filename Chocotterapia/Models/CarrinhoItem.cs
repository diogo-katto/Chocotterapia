using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chocotterapia.Models
{
    public class CarrinhoItem
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public Produtos? Produto { get; set; }
        public int Quantidade { get; set; }

        // Propriedade calculada
        public decimal Subtotal => (Produto?.Preco ?? 0) * Quantidade;
    }
}
