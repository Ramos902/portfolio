---
postId: 6
title: "Tutorial: montando um stack de acesso remoto self-hosted com Guacamole, Cloudflare Tunnel e GNOME Remote Desktop"
description: "Passo a passo para acessar seu Linux remotamente pelo navegador, sem VPN e sem abrir portas no roteador."
date: 2026-07-26
tags: ["Linux", "Docker", "Remote Acess", "Acesso Remoto", "Cloudflare", "Tunnel"]
---

Neste tutorial você vai aprender a montar um stack de acesso remoto self-hosted usando três peças: **GNOME Remote Desktop** como servidor RDP, **Apache Guacamole** como cliente web (rodando em Docker) e **Cloudflare Tunnel** para expor tudo isso na internet sem abrir nenhuma porta no seu roteador e sem depender de VPN.

## Visão geral da arquitetura

Antes de colocar a mão no teclado, vale entender o fluxo da conexão:
 
```
Navegador  ->  Cloudflare Edge  ->  cloudflared (túnel outbound)  ->  serviço local
                                          │
                                          ├─ <SUBDOMINIO_RDP>      -> Guacamole
                                          └─ <SUBDOMINIO_ADMIN>    -> outro serviço local (opcional)
```

O `cloudflared` roda localmente na sua máquina e abre uma conexão **outbound** para a borda da Cloudflare, por isso não é necessário abrir nenhuma porta de entrada no roteador. A Cloudflare recebe as requisições nos subdomínios configurados e repassa para o serviço correto na sua rede local através do túnel.

O Guacamole é dividido em dois componentes:

- **guacd**: o proxy que fala os protocolos remotos (RDP, VNC, SSH) com a máquina de destino.
- **guacamole**: a aplicação web que serve a interface e se comunica com o `guacd`.

E o destino final é o **GNOME Remote Desktop**, que expõe um servidor RDP nativo direto na sessão do GNOME.

## Pré-requisitos
 
- Uma máquina Linux com ambiente GNOME
- Docker e Docker Compose instalados
- Um domínio próprio gerenciado pela Cloudflare `cloudflared` instalado na máquina que vai rodar o túnel

## Passo 1 - Habilitar o GNOME Remote Desktop
 
1. Abra **Configurações** -> **Compartilhamento**.
2. Ative **Área de Trabalho Remota**.
3. Defina um usuário e senha de acesso remoto (evite reutilizar a senha da sua conta do
   sistema).
4. Anote a porta configurada, por padrão o GNOME Remote Desktop usa RDP, mas você pode alterar a porta exibida na tela de configuração se preferir não usar a padrão.

Isso já deixa a máquina pronta para receber conexões RDP localmente o próximo passo é dar acesso a essa conexão via navegador, sem expor a porta diretamente à internet.

## Passo 2 - Subir o Guacamole com Docker Compose

Crie um `docker-compose.yml` com os dois serviços do Guacamole:

```yaml
services:
  guacd:
    image: guacamole/guacd
    restart: always
    environment:
      GUACD_LOG_LEVEL: debug
    deploy:
      resources:
        limits:
          memory: 512m
          cpus: '2'
  guacamole:
    image: guacamole/guacamole
    restart: always
    environment:
      GUACD_HOSTNAME: guacd
      GUACAMOLE_HOME: /guacamole-home
    volumes:
      - ./guacamole-home:/guacamole-home
    ports:
      - "<PORTA_LOCAL_GUACAMOLE>:8080"
    depends_on:
      - guacd
    deploy:
      resources:
        limits:
          memory: 512m
```

Pontos de atenção:
 
- `GUACD_HOSTNAME: guacd` funciona porque os dois containers compartilham a rede padrão criada pelo Compose, o Docker resolve o nome do serviço automaticamente.
- `GUACAMOLE_HOME` aponta para um volume local persistente, onde ficam as configurações e a base de conexões do Guacamole.
- Escolha uma porta local de sua preferência para publicar o serviço (`<PORTA_LOCAL_GUACAMOLE>`), essa porta **não** precisa (e não deve) ser aberta no roteador, pois será acessada só internamente pelo túnel.

Suba com:
 
```bash
docker compose up -d
```

Depois, acesse a interface web do Guacamole na porta escolhida, faça login com as credenciais padrão (troque-as imediatamente) e cadastre uma nova conexão do tipo RDP apontando para o endereço da sua máquina na rede local e a porta configurada no Passo 1.

## Passo 3 - Expor com Cloudflare Tunnel

Com a Cloudflare como provedora de DNS do seu domínio, crie o túnel:

```bash
cloudflared tunnel login
cloudflared tunnel create meu-tunel
```

Isso gera um arquivo de credenciais local (trate-o como um segredo, não versione, restrinja permissões de leitura). Em seguida, crie o arquivo de configuração, por exemplo em `/etc/cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_UUID>
credentials-file: /etc/cloudflared/<TUNNEL_UUID>.json
ingress:
  - hostname: <SEU_SUBDOMINIO_RDP>
    service: http://localhost:<PORTA_LOCAL_GUACAMOLE>
  - service: http_status:404
```

Detalhes importantes:
 
- As regras de `ingress` são avaliadas em ordem; a última (`http_status:404`) é obrigatória e captura qualquer hostname que não bateu com nenhuma regra anterior.
- Substitua `<SEU_SUBDOMINIO_RDP>` pelo subdomínio que você quer usar (ex.: algo como `remoto.seudominio.com`) e `<PORTA_LOCAL_GUACAMOLE>` pela porta escolhida no Passo 2.
- Se for expor outros serviços locais (um painel de administração, por exemplo), adicione mais entradas de `ingress` seguindo o mesmo padrão, sempre antes da regra final de `404`.

Crie o registro DNS apontando para o túnel:

```bash
cloudflared tunnel route dns meu-tunel <SEU_SUBDOMINIO_RDP>
```

Isso cria automaticamente um CNAME apontando para `<TUNNEL_UUID>.cfargotunnel.com`.

Por fim, instale o `cloudflared` como serviço systemd para que o túnel suba automaticamente com a máquina:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

Para confirmar que está tudo funcionando:

```bash
cloudflared tunnel list
```

O comando deve mostrar o túnel com conexões ativas para a borda da Cloudflare (normalmente 4, por redundância).

## Testando

Acesse pelo navegador o subdomínio configurado (`<SEU_SUBDOMINIO_RDP>`). Você deve cair direto na tela de login do Guacamole. Ao entrar, selecione a conexão RDP cadastrada no Passo 2 e você terá acesso à área de trabalho remota do GNOME, tudo através do túnel, sem VPN e sem porta aberta no roteador.

## Referências
 
- [GNOME Remote Desktop — README oficial (GitHub)](https://github.com/GNOME/gnome-remote-desktop/blob/main/README.md)
- [Apache Guacamole — Instalando com Docker (Manual oficial)](https://guacamole.apache.org/doc/gug/guacamole-docker.html)
- [Apache Guacamole — imagem oficial no Docker Hub](https://hub.docker.com/r/guacamole/guacamole)
- [Cloudflare Tunnel — Criar um túnel gerenciado localmente](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/create-local-tunnel/)
- [Cloudflare Tunnel — Arquivo de configuração (ingress rules)](https://developers.cloudflare.com/tunnel/advanced/local-management/configuration-file/)


---

*Adapte hostnames, portas e políticas de acesso ao seu contexto antes de reproduzir este setup em produção.*

