document.getElementById("formProduto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const arquivoImagem = document.getElementById("imagem")?.files[0]; // Input file (se existir)
  const imgUrl = document.getElementById("imgUrl").value; // URL manual
  
  let urlFinal = imgUrl;
  
  // Se selecionou um arquivo, fazer upload primeiro
  if (arquivoImagem) {
    const formData = new FormData();
    formData.append("arquivo", arquivoImagem);
    
    try {
      const respostaUpload = await fetch("http://localhost:5150/api/upload/imagem", {
        method: "POST",
        body: formData
      });
      
      if (respostaUpload.ok) {
        const dados = await respostaUpload.json();
        urlFinal = `http://localhost:5150${dados.url}`;
        console.log("Upload concluído:", urlFinal);
      } else {
        alert("❌ Erro ao fazer upload da imagem!");
        return;
      }
    } catch (erro) {
      console.error("Erro no upload:", erro);
      alert("⚠️ Erro ao fazer upload da imagem.");
      return;
    }
  }

  // Cadastrar produto com a URL da imagem
  const produto = {
    nome,
    descricao,
    preco,
    ImagemUrl: urlFinal  // ← Mude de imagemUrl para ImagemUrl (U maiúsculo)
};

  try {
    const response = await fetch("http://localhost:5150/api/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });

    if (response.ok) {
      alert("✅ Produto cadastrado com sucesso!");
      e.target.reset();
    } else {
      alert("❌ Erro ao cadastrar produto!");
    }
  } catch (error) {
    alert("⚠️ Erro de conexão com a API.");
    console.error(error);
  }
});