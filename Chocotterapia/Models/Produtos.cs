using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Chocotterapia.Models
{
    public class Produtos
    {
        [Key] // Define a chave primária
        public int Id { get; set; }

        public string? Nome { get; set; } // pode ser nulo
        public decimal? Preco { get; set; } // pode ser nulo
        public string? Descricao { get; set; } // pode ser nulo
    }
}