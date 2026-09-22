# Atividade Prática — Produtos e Movimentações


## Objetivo

Implementar as telas de **Produtos** e **Movimentações** do sistema e registrar suas rotas, de modo que os links do menu lateral passem a funcionar.

## Regras gerais

- Os arquivos `src/types/index.ts`, `src/api/api.ts` e `src/api/mockData.ts` **não devem ser alterados**. Use os tipos e as funções que já existem neles.
- Siga a mesma organização e o mesmo padrão de componentes usados no restante do projeto.
- As novas telas devem ficar acessíveis somente para usuários logados e aparecer dentro do layout do dashboard.
- O projeto deve compilar sem erros (`npm run build`).

---

## Requisitos — Produtos (`/produtos`)

1. Listar todos os produtos mostrando: ID, nome, **nome da categoria**, preço em reais (ex.: `R$ 8,50`) e quantidade em estoque.
2. Exibir uma mensagem quando não houver produtos cadastrados.
3. Cadastrar um novo produto informando nome, preço, quantidade inicial e categoria (escolhida entre as categorias cadastradas).
4. Validar antes de enviar, exibindo a mensagem de erro na tela:
   - nome obrigatório;
   - preço maior que zero;
   - quantidade inteira maior ou igual a zero;
   - categoria obrigatória.
5. Exibir na tela qualquer erro retornado pela API.
6. Após o cadastro, a lista deve ser atualizada e o formulário limpo.

## Requisitos — Movimentações (`/movimentacoes`)

1. Listar o histórico de movimentações mostrando: data/hora no formato brasileiro, nome do produto, tipo ("Entrada" ou "Saída", visualmente diferenciados) e quantidade.
2. Exibir uma mensagem quando não houver movimentações registradas.
3. Registrar uma movimentação informando produto, tipo (entrada ou saída) e quantidade. Na escolha do produto, deve aparecer o **estoque atual** de cada um.
4. Validar antes de enviar: produto obrigatório e quantidade inteira maior que zero.
5. Quando a API recusar a movimentação (ex.: saída maior que o estoque), exibir na tela a mensagem retornada por ela.
6. Após o registro, o histórico **e** o estoque exibido na escolha do produto devem estar atualizados.

---

## Critérios de aceite

Com os dados iniciais do sistema (Refrigerante 2L: 20 un.; Detergente: 5 un.), o sistema deve se comportar assim:

- Uma categoria criada na tela de Categorias aparece como opção no cadastro de produtos.
- Entrada de 10 Detergentes → estoque passa para 15.
- Saída de 20 Detergentes → aparece a mensagem de estoque insuficiente vinda da API e nada é registrado.
- Saída de 12 Detergentes → estoque passa para 3, e o Detergente aparece como "estoque baixo" na tela Início.

---

## Entrega

- Link do repositório no GitHub **sem** a pasta `node_modules`.
- No `README.md`, inclua um print de cada tela implementada.
