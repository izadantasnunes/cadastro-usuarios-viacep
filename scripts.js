const form = document.getElementById('cadastroForm');
const cepInput = document.getElementById('cep');
const estadoSelect = document.getElementById('estado');
const cidadeSelect = document.getElementById('cidade');
const mensagemCep = document.getElementById('mensagemCep');
const semNumero = document.getElementById('semNumero');
const numeroInput = document.getElementById('numero');
const successModal = document.getElementById('successModal');
const telefoneInput = document.getElementById('telefone');
const fecharModal = document.getElementById('fecharModal');

function exibirMensagem(texto, tipo = 'erro') {
  mensagemCep.textContent = texto;
  mensagemCep.className = tipo === 'success' ? 'message success' : 'message';
  mensagemCep.style.display = 'block';
}

function limparMensagem() {
  mensagemCep.textContent = '';
  mensagemCep.style.display = 'none';
}

function apenasNumeros(valor) {
  return valor.replace(new RegExp('[^0-9]', 'g'), '');
}

function formatarCep(valor) {
  const numeros = apenasNumeros(valor).slice(0, 8);

  if (numeros.length > 5) {
    return numeros.slice(0, 5) + '-' + numeros.slice(5);
  }

  return numeros;
}

async function carregarCidades(uf, cidadeSelecionada = '') {
  cidadeSelect.innerHTML = '<option value="">Carregando cidades...</option>';
  cidadeSelect.disabled = true;

  if (!uf) {
    cidadeSelect.innerHTML = '<option value="">Selecione um estado primeiro</option>';
    return;
  }

  try {
    const resposta = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
    );

    const cidades = await resposta.json();

    cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';

    cidades.forEach(cidade => {
      const option = document.createElement('option');
      option.value = cidade.nome;
      option.textContent = cidade.nome;
      cidadeSelect.appendChild(option);
    });

    cidadeSelect.disabled = false;

    if (cidadeSelecionada) {
      cidadeSelect.value = cidadeSelecionada;
    }
  } catch (erro) {
    console.log('Erro ao carregar cidades:', erro);
    cidadeSelect.innerHTML = '<option value="">Não foi possível carregar as cidades</option>';
  }
}

window.addEventListener('load', async () => {
  const dadosSalvos = JSON.parse(localStorage.getItem('cadastroUsuario'));

  if (dadosSalvos) {
    document.getElementById('nome').value = dadosSalvos.nome || '';
    document.getElementById('email').value = dadosSalvos.email || '';
    document.getElementById('telefone').value = dadosSalvos.telefone || '';
    document.getElementById('cep').value = dadosSalvos.cep || '';
    document.getElementById('rua').value = dadosSalvos.rua || '';
    document.getElementById('numero').value = dadosSalvos.numero || '';
    document.getElementById('complemento').value = dadosSalvos.complemento || '';
    document.getElementById('bairro').value = dadosSalvos.bairro || '';
    document.getElementById('referencia').value = dadosSalvos.referencia || '';
    semNumero.checked = dadosSalvos.semNumero || false;
    estadoSelect.value = dadosSalvos.estado || '';

    if (semNumero.checked) {
      numeroInput.value = '';
      numeroInput.disabled = true;
    }

    if (dadosSalvos.estado) {
      await carregarCidades(dadosSalvos.estado, dadosSalvos.cidade || '');
    }
  }
});

telefoneInput.addEventListener('input', () => {
  let numeros = telefoneInput.value.replace(/\D/g, '');

  numeros = numeros.slice(0, 11);

  if (numeros.length >= 3) {
    numeros = numeros.slice(0, 2) + '9' + numeros.slice(3);
  }

  if (numeros.length > 6) {
    telefoneInput.value =
      '(' +
      numeros.slice(0, 2) +
      ') ' +
      numeros.slice(2, 7) +
      '-' +
      numeros.slice(7, 11);
  } else if (numeros.length > 2) {
    telefoneInput.value = '(' + numeros.slice(0, 2) + ') ' + numeros.slice(2);
  } else if (numeros.length > 0) {
    telefoneInput.value = '(' + numeros;
  } else {
    telefoneInput.value = '';
  }

  salvarDados();
});

cepInput.addEventListener('input', () => {
  cepInput.value = formatarCep(cepInput.value);
  salvarDados();
  limparMensagem();

  const cep = apenasNumeros(cepInput.value);

  if (cep.length === 8) {
    buscarCep(cep);
  }
});

cepInput.addEventListener('blur', async () => {
  const cep = apenasNumeros(cepInput.value);

  if (!cep) return;

  if (cep.length !== 8) {
    exibirMensagem('CEP inválido. Digite um CEP com 8 números.');
    return;
  }

  await buscarCep(cep);
});

async function buscarCep(cep) {
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      exibirMensagem('Esse CEP não existe. Por favor, insira o CEP correto.');
      document.getElementById('rua').value = '';
      document.getElementById('bairro').value = '';
      estadoSelect.value = '';
      cidadeSelect.innerHTML = '<option value="">Selecione um estado primeiro</option>';
      cidadeSelect.disabled = true;
      salvarDados();
      return;
    }

    document.getElementById('rua').value = dados.logradouro || '';
    document.getElementById('bairro').value = dados.bairro || '';
    estadoSelect.value = dados.uf || '';

    await carregarCidades(dados.uf, dados.localidade);

    exibirMensagem('Endereço preenchido automaticamente pelo CEP.', 'success');
    salvarDados();
  } catch (erro) {
    console.log('Erro ao buscar CEP:', erro);
    exibirMensagem('Não foi possível buscar o CEP agora. Tente novamente em instantes.');
  }
}

estadoSelect.addEventListener('change', async () => {
  await carregarCidades(estadoSelect.value);
  salvarDados();
});

cidadeSelect.addEventListener('change', salvarDados);

semNumero.addEventListener('change', () => {
  if (semNumero.checked) {
    numeroInput.value = '';
    numeroInput.disabled = true;
  } else {
    numeroInput.disabled = false;
  }

  salvarDados();
});

function salvarDados() {
  const dadosFormulario = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    cep: document.getElementById('cep').value,
    rua: document.getElementById('rua').value,
    numero: document.getElementById('numero').value,
    semNumero: semNumero.checked,
    complemento: document.getElementById('complemento').value,
    bairro: document.getElementById('bairro').value,
    referencia: document.getElementById('referencia').value,
    cidade: cidadeSelect.value,
    estado: estadoSelect.value
  };

  localStorage.setItem('cadastroUsuario', JSON.stringify(dadosFormulario));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  salvarDados();

  successModal.classList.add('show');

  localStorage.removeItem('cadastroUsuario');

  form.reset();

  document.getElementById('cep').value = '';
  document.getElementById('rua').value = '';
  document.getElementById('bairro').value = '';
  document.getElementById('numero').value = '';
  document.getElementById('complemento').value = '';
  document.getElementById('referencia').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  document.getElementById('telefone').value = '';

  estadoSelect.value = '';
  cidadeSelect.innerHTML = '<option value="">Selecione um estado primeiro</option>';
  cidadeSelect.disabled = true;

  semNumero.checked = false;
  numeroInput.disabled = false;

  limparMensagem();
});

fecharModal.addEventListener('click', () => {
  successModal.classList.remove('show');
});

successModal.addEventListener('click', (e) => {
  if (e.target === successModal) {
    successModal.classList.remove('show');
  }
});

const campos = document.querySelectorAll('input, select');

campos.forEach(campo => {
  campo.addEventListener('input', salvarDados);
});