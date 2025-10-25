// ...existing code...
const API_URL = "http://localhost:5150/api/produtos";
const BACKEND_ORIGIN = "http://localhost:5150";
const FALLBACK_IMAGE = "https://via.placeholder.com/300x200?text=Produto+sem+imagem";

function resolveImagemUrl(produto) {
  const raw = produto.imagemUrl || produto.ImagemUrl || produto.imagem_url || produto.imageUrl || produto.url || "";
  if (!raw) return FALLBACK_IMAGE;
  // Se já for absoluta, retorna ela
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  // Se for caminho relativo ao backend, prefixa o backend
  if (raw.startsWith("/")) return `${BACKEND_ORIGIN}${raw}`;
  return `${BACKEND_ORIGIN}/${raw}`;
}

async function carregarProdutos() {
  const listaProdutos = document.getElementById("lista-produtos");
  if (!listaProdutos) {
    console.error("Elemento #lista-produtos não encontrado no DOM");
    return;
  }

  listaProdutos.innerHTML = '<p class="text-center">Carregando produtos...</p>';

  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
    const produtos = await resposta.json();

    if (!Array.isArray(produtos) || produtos.length === 0) {
      listaProdutos.innerHTML = '<p class="text-center alert alert-info">Nenhum produto disponível.</p>';
      return;
    }

    listaProdutos.innerHTML = "";
    produtos.forEach(produto => criarCardProduto(produto, listaProdutos));
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    listaProdutos.innerHTML = `<p class="text-center text-danger">Erro ao carregar produtos. Verifique backend em ${API_URL}</p>`;
  }
}

function criarCardProduto(produto, container) {
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4";

  const imagem = resolveImagemUrl(produto);
  const preco = Number(produto.preco || 0);

  col.innerHTML = `
    <div class="card h-100 shadow-sm">
      <div class="card-img-wrapper">
        <img src="${imagem}" 
             class="card-img-top" 
             alt="${produto.nome || 'Produto'}"
             onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';">
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${produto.nome || 'Sem nome'}</h5>
        <p class="card-text text-muted mb-2">${produto.descricao || ''}</p>
        <p class="fw-bold mb-3">R$ ${preco.toFixed(2)}</p>
        <button class="btn btn-outline-brown mt-auto" onclick="adicionarAoCarrinho(${Number(produto.id)})">🛒 Adicionar</button>
      </div>
    </div>
  `;

  container.appendChild(col);
}

function adicionarAoCarrinho(idProduto) {
  const id = Number(idProduto);
  if (Number.isNaN(id)) return;
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.push(id);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
}

window.adicionarAoCarrinho = adicionarAoCarrinho;
document.addEventListener("DOMContentLoaded", carregarProdutos);
// ...existing code...