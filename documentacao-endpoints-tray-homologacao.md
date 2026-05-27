# Homologacao Tray - preenchimento das tarefas

Este arquivo serve como guia para preencher as tarefas da homologacao no Odoo/Tray e tirar os prints do Postman.

## Contexto do nosso projeto

O projeto atual (`Digital Veiculos`) e uma vitrine React + Vite com Supabase e atendimento via WhatsApp. No codigo atual nao existe consumo direto da API Tray.

Portanto, para esta etapa de homologacao, o caminho correto e:

1. Montar as requisicoes no Postman.
2. Executar as chamadas com as credenciais fornecidas pela Tray.
3. Tirar prints mostrando URL, metodo, headers/body e response.
4. Colar em cada tarefa o texto correspondente deste arquivo.
5. Anexar o print daquela requisicao na tarefa correta.

Nao coloque `consumer_secret`, `access_token` ou `refresh_token` no frontend React. Se a integracao Tray for implementada no produto depois, esses dados devem ficar em backend/serverless function.

## Antes de comecar

Crie um Environment no Postman com estas variaveis:

```text
api_address=https://SUA_LOJA.commercesuite.com.br/web_api
consumer_key=SUA_CONSUMER_KEY
consumer_secret=SUA_CONSUMER_SECRET
code=SEU_CODE
access_token=preencher depois da geracao
refresh_token=preencher depois da geracao
category_id=ID_DE_CATEGORIA_TESTE
product_id=ID_DE_PRODUTO_TESTE
variant_id=ID_DE_VARIACAO_TESTE
order_id=ID_DE_PEDIDO_TESTE
invoice_id=ID_DE_NOTA_TESTE
public_image_url=https://URL_PUBLICA/imagem-teste.jpg
webhook_url=https://SUA_URL_PUBLICA/webhook/tray
```

Nos prints, oculte parte de `consumer_key`, `consumer_secret`, `code`, `access_token` e `refresh_token`.

## 01 - Geracao de Token

Resposta para colar na tarefa:

```text
Requisicao demonstrada no Postman para geracao do token OAuth da Tray.

Metodo: POST
URL consumida: {{api_address}}/auth
Content-Type: application/x-www-form-urlencoded
Body enviado:
- consumer_key={{consumer_key}}
- consumer_secret={{consumer_secret}}
- code={{code}}

Retorno esperado: HTTP 200 ou 201 com access_token, refresh_token, datas de expiracao, api_host e store_id.
Evidencia anexada: print do Postman com URL, metodo, body x-www-form-urlencoded e response da API.
```

Print obrigatorio:

- Postman com metodo `POST`, URL `{{api_address}}/auth`, aba `Body`, opcao `x-www-form-urlencoded`, campos `consumer_key`, `consumer_secret`, `code` e response `200/201`.

## 02 - Renovar Token

Resposta para colar na tarefa:

```text
Requisicao demonstrada no Postman para renovacao do access_token a partir do refresh_token.

Metodo: GET
URL consumida: {{api_address}}/auth?refresh_token={{refresh_token}}
Body: nao aplicavel

Retorno esperado: HTTP 200 com novo access_token e novo refresh_token.
Evidencia anexada: print do Postman com URL, metodo GET e response da API.
```

## 04 - API de categoria

Resposta para colar na tarefa:

```text
Requisicao demonstrada no Postman para consulta de categorias da Tray.

Metodo: GET
URL consumida: {{api_address}}/categories/?access_token={{access_token}}
Body: nao aplicavel

Tambem pode ser demonstrada a arvore de categorias:
{{api_address}}/categories/tree/{{category_id}}?access_token={{access_token}}

Retorno esperado: HTTP 200 com a lista de categorias.
Evidencia anexada: print do Postman com URL, metodo GET e response da API.
```

## 05 - API de Produtos

Resposta para colar na tarefa:

```text
Requisicao demonstrada no Postman para consulta de produtos da Tray.

Metodo: GET
URL consumida: {{api_address}}/products?access_token={{access_token}}
Body: nao aplicavel

Para validacao de montagem de POST, tambem foi preparada a criacao de produto:
POST {{api_address}}/products?access_token={{access_token}}
Content-Type: application/x-www-form-urlencoded
Body com campos Product, como name, description, price, stock, category_id, available e reference.

Retorno esperado: HTTP 200 ou 201.
Evidencia anexada: print do Postman com URL, metodo, parametros/body quando aplicavel e response da API.
```

## 06 - API de variacao

Resposta para colar na tarefa:

```text
Requisicao demonstrada no Postman para consulta de variacoes de produtos.

Metodo: GET
URL consumida: {{api_address}}/products/variants/?access_token={{access_token}}
Body: nao aplicavel

Para validacao de montagem de POST, tambem foi preparada a criacao de variacao:
POST {{api_address}}/products/variants/?access_token={{access_token}}
Content-Type: application/x-www-form-urlencoded
Body com campos Variant, como product_id, price, stock, reference, weight, length, width e height.

Retorno esperado: HTTP 200 ou 201.
Evidencia anexada: print do Postman com URL, metodo, parametros/body quando aplicavel e response da API.
```

## 07 - API de imagem

Resposta para colar na tarefa:

```text
Requisicao demonstrada no Postman para cadastro/atualizacao de imagem de produto.

Metodo: POST
URL consumida: {{api_address}}/products/{{product_id}}/images?access_token={{access_token}}
Content-Type: application/json
Body enviado:
{
  "Images": {
    "picture_source_1": "{{public_image_url}}"
  }
}

Observacao: a imagem precisa estar em URL publica, sem espacos/acentos/caracteres especiais, nos formatos JPG, JPEG ou PNG, ate 350 KB e ate 2000x2000.
Retorno esperado: HTTP 200 com mensagem de upload/processamento.
Evidencia anexada: print do Postman com URL, metodo, body JSON e response da API.
```

## 08 - Cumprir limite de 180 requisicoes por min

Resposta para colar na tarefa:

```text
A integracao respeitara o limite operacional informado pela Tray de ate 180 requisicoes por minuto e o limite diario por loja.

Medidas previstas:
- controle de taxa por loja/token;
- fila/retry para reprocessamento quando houver erro temporario;
- renovacao de token somente quando necessario;
- evitar chamadas repetidas em massa;
- uso de webhooks para reduzir consultas desnecessarias.

Evidencia anexada: print de uma requisicao real no Postman e descricao do controle de limite.
```

## 09 - API de nota fiscal

Resposta para colar na tarefa:

```text
Requisicao demonstrada no Postman para consulta de notas fiscais.

Metodo: GET
URL consumida: {{api_address}}/orders/invoices?access_token={{access_token}}
Body: nao aplicavel

Para consulta especifica:
GET {{api_address}}/orders/{{order_id}}/invoices/{{invoice_id}}?access_token={{access_token}}

Para cadastro, quando aplicavel:
POST {{api_address}}/orders/{{order_id}}/invoices?access_token={{access_token}}
Body com issue_date, number, serie, value, key, link, xml_danfe e ProductCfop.

Retorno esperado: HTTP 200 ou 201.
Evidencia anexada: print do Postman com URL, metodo, body quando aplicavel e response da API.
```

## 09 - Webhook

Resposta para colar na tarefa:

```text
A URL de webhook sera disponibilizada em ambiente HTTPS publico para receber notificacoes via POST da Tray.

Metodo recebido: POST
Content-Type esperado: application/x-www-form-urlencoded
URL de notificacao: {{webhook_url}}
Campos esperados:
- seller_id
- scope_id
- scope_name
- act
- app_code
- url_notification

Tratamento previsto:
- responder HTTP 200 ao receber a notificacao;
- registrar a notificacao recebida;
- agrupar notificacoes repetidas quando necessario;
- consultar a API correspondente pelo scope_name/scope_id para atualizar os dados.

Evidencia anexada: print do Postman simulando o POST do webhook com body x-www-form-urlencoded.
```

## 10 - Demais APIs consumidas

Resposta para colar na tarefa:

```text
No projeto atual ainda nao ha consumo direto da API Tray no frontend. O app usa React + Vite, Supabase e atendimento via WhatsApp.

Para a homologacao tecnica, foram montadas no Postman as APIs solicitadas pela Tray:
- autenticacao;
- renovacao de token;
- categorias;
- produtos;
- variacoes;
- imagens;
- nota fiscal;
- webhook.

Para demonstracao tecnica adicional, tambem foram montadas:
- GET {{api_address}}/info?access_token={{access_token}} para informacoes da loja;
- GET {{api_address}}/orders?access_token={{access_token}} para listagem de pedidos.

Mesmo que algumas chamadas nao estejam no fluxo inicial do projeto, as requisicoes foram demonstradas para validar conhecimento tecnico da API.
Evidencias anexadas: prints do Postman com URL, metodo e response.
```

## Checklist rapido dos prints

- [ ] 01 Token: POST auth com body x-www-form-urlencoded.
- [ ] 02 Renovar token: GET auth com refresh_token.
- [ ] 04 Categorias: GET categories.
- [ ] 05 Produtos: GET products e, se possivel, POST products.
- [ ] 06 Variacao: GET variants e, se possivel, POST variants.
- [ ] 07 Imagem: POST product images com URL publica.
- [ ] 08 Limite: print de requisicao + texto sobre limite.
- [ ] 09 Nota fiscal: GET orders/invoices.
- [ ] 09 Webhook: POST simulado para webhook_url.
- [ ] 10 Demais APIs: GET info e/ou GET orders.
