# Cadastro de Usuário com ViaCEP

Projeto desenvolvido com HTML, CSS e JavaScript utilizando integração com a API ViaCEP para preenchimento automático de endereço a partir do CEP informado pelo usuário.

## Funcionalidades

- Preenchimento automático de endereço via CEP
- Integração com Fetch API + ViaCEP
- Salvamento automático dos dados com LocalStorage
- Persistência dos dados após atualizar a página
- Campo de telefone com máscara automática
- Seleção dinâmica de cidades por estado
- Modal de confirmação de cadastro realizado
- Layout responsivo
- Interface moderna inspirada em formulários profissionais de e-commerce e delivery

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Fetch API
- LocalStorage API
- ViaCEP API
- API de localidades do IBGE

## APIs utilizadas

### ViaCEP
https://viacep.com.br/

Responsável pelo preenchimento automático do endereço através do CEP.

### IBGE Localidades
https://servicodados.ibge.gov.br/api/docs/localidades

Responsável pela listagem dinâmica de cidades conforme o estado selecionado.

## Demonstração

Acesse o projeto online:

https://izadantasnunes.github.io/cadastro-usuarios-viacep/

## Estrutura do projeto

```bash
cadastro-usuarios-viacep/
│
├── index.html
├── styles.css
├── scripts.js
└── README.md
