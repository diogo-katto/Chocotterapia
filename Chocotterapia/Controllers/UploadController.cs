using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    [HttpPost("imagem")]
    public async Task<IActionResult> UploadImagem(IFormFile arquivo)
    {
        if (arquivo == null || arquivo.Length == 0)
            return BadRequest("Nenhum arquivo enviado");

        // Validar tipo de arquivo
        var extensoesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extensao = Path.GetExtension(arquivo.FileName).ToLower();
        
        if (!Array.Exists(extensoesPermitidas, e => e == extensao))
            return BadRequest("Apenas imagens são permitidas");

        // Gerar nome único
        var nomeArquivo = $"{Guid.NewGuid()}{extensao}";
        var caminho = Path.Combine("wwwroot", "uploads", "produtos", nomeArquivo);

        // Criar diretório se não existir
        var diretorio = Path.GetDirectoryName(caminho);
        if (string.IsNullOrEmpty(diretorio))
            throw new InvalidOperationException($"Não foi possível determinar o diretório para o caminho: {caminho}");
        Directory.CreateDirectory(diretorio);

        // Salvar arquivo
        using (var stream = new FileStream(caminho, FileMode.Create))
        {
            await arquivo.CopyToAsync(stream);
        }

        // Retornar URL
        var url = $"/uploads/produtos/{nomeArquivo}";
        return Ok(new { url });
    }
}